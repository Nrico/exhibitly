'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteArtwork(artworkId: string) {
    const supabase = await createClient()

    // Check if admin (double check for safety)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) return { error: 'Unauthorized' }

    try {
        const { error } = await supabase.from('artworks').delete().eq('id', artworkId)
        if (error) throw error

        revalidatePath('/admin/artworks')
        return { success: true }
    } catch (error) {
        console.error('Delete artwork error:', error)
        return { error: 'Failed to delete artwork' }
    }
}

export async function deleteUser(userId: string) {
    const supabase = await createClient()

    // Check if admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) return { error: 'Unauthorized' }

    try {
        // Delete from profiles (Cascade should handle related data like artworks/settings if configured, 
        // but our schema might rely on manual cleanup or cascade on foreign keys)
        // Our schema has "on delete cascade" for artworks.user_id -> profiles.id, so this is safe.
        const { error } = await supabase.from('profiles').delete().eq('id', userId)
        if (error) throw error

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Delete user error:', error)
        return { error: 'Failed to delete user' }
    }
}
