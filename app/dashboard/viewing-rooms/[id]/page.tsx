import { createClient } from '@/utils/supabase/server'
import { getImpersonatedUser } from '@/utils/impersonation'
import { redirect } from 'next/navigation'
import { RoomBuilder } from '@/components/dashboard/viewing-rooms/RoomBuilder'

export default async function RoomBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) redirect('/auth')

    // Fetch Room
    const { data: room } = await supabase
        .from('viewing_rooms')
        .select('*')
        .eq('id', id)
        .eq('gallery_id', user.id)
        .single()

    if (!room) redirect('/dashboard/viewing-rooms')

    // Fetch Room Items
    const { data: roomItems } = await supabase
        .from('room_items')
        .select(`
            *,
            artwork:artworks(*)
        `)
        .eq('room_id', room.id)
        .order('sort_order', { ascending: true })

    // Fetch All Available Artworks (for selection)
    const { data: inventory } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

    return <RoomBuilder room={room} initialItems={roomItems || []} inventory={inventory || []} />
}
