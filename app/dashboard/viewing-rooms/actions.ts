'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { ViewingRoom, RoomItem } from '@/types'

export async function createViewingRoom(title: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Generate a random slug
    const slug = Math.random().toString(36).substring(2, 10)

    const { data, error } = await supabase
        .from('viewing_rooms')
        .insert({
            gallery_id: user.id,
            title,
            slug,
            status: 'draft'
        })
        .select()
        .single()

    if (error) return { error: error.message }
    return { data }
}

export async function updateViewingRoom(id: string, updates: Partial<ViewingRoom>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('viewing_rooms')
        .update(updates)
        .eq('id', id)
        .eq('gallery_id', user.id)

    if (error) return { error: error.message }
    revalidatePath(`/dashboard/viewing-rooms/${id}`)
    return { success: true }
}

export async function addRoomItem(roomId: string, artworkId: string, isHighlight: boolean = false) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Verify ownership of room
    const { data: room } = await supabase
        .from('viewing_rooms')
        .select('id')
        .eq('id', roomId)
        .eq('gallery_id', user.id)
        .single()

    if (!room) return { error: 'Room not found or unauthorized' }

    const { error } = await supabase
        .from('room_items')
        .insert({
            room_id: roomId,
            artwork_id: artworkId,
            is_highlight: isHighlight
        })

    if (error) return { error: error.message }
    revalidatePath(`/dashboard/viewing-rooms/${roomId}`)
    return { success: true }
}

export async function removeRoomItem(itemId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // We rely on RLS policy "Galleries can manage items in their rooms"
    const { error } = await supabase
        .from('room_items')
        .delete()
        .eq('id', itemId)

    if (error) return { error: error.message }
    return { success: true }
}

export async function updateRoomItemOrder(items: { id: string, sort_order: number }[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    for (const item of items) {
        await supabase
            .from('room_items')
            .update({ sort_order: item.sort_order })
            .eq('id', item.id)
    }

    return { success: true }
}

export async function createSingleArtworkRoom(artworkId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // 1. Fetch Artwork details
    const { data: artwork } = await supabase
        .from('artworks')
        .select('title')
        .eq('id', artworkId)
        .eq('user_id', user.id)
        .single()

    if (!artwork) return { error: 'Artwork not found' }

    // 2. Create Room
    const slug = Math.random().toString(36).substring(2, 10)
    const { data: room, error: roomError } = await supabase
        .from('viewing_rooms')
        .insert({
            gallery_id: user.id,
            title: artwork.title, // Use artwork title for room
            slug,
            status: 'draft' // Start as draft so they can tweak it
        })
        .select()
        .single()

    if (roomError) return { error: roomError.message }

    // 3. Add Artwork to Room
    const { error: itemError } = await supabase
        .from('room_items')
        .insert({
            room_id: room.id,
            artwork_id: artworkId,
            is_highlight: true, // Make it the hero
            sort_order: 0
        })

    if (itemError) return { error: itemError.message }

    return { success: true, roomId: room.id }
}

export async function deleteViewingRoom(roomId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('viewing_rooms')
        .delete()
        .eq('id', roomId)
        .eq('gallery_id', user.id)

    if (error) return { error: error.message }
    revalidatePath('/dashboard/viewing-rooms')
    return { success: true }
}
