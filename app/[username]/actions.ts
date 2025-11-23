'use server'

import { createClient } from '@/utils/supabase/server'

export async function getArtistData(username: string) {
    const supabase = await createClient()

    // 1. Get User ID from Username (Profile)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (profileError || !profile) {
        return { error: 'Artist not found' }
    }

    // 2. Get Site Settings
    const { data: settings, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('user_id', profile.id)
        .single()

    // 3. Get Public Artworks
    const { data: artworks, error: artworksError } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', profile.id)
        .in('status', ['available', 'sold', 'Live']) // 'Live' was used in mock data, 'available' in new schema
        .order('created_at', { ascending: false })

    return {
        profile,
        settings: settings || {}, // Handle case where settings might not exist yet
        artworks: artworks || []
    }
}
