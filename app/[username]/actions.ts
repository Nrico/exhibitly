'use server'

import { createClient } from '@/utils/supabase/server'

export async function getArtistData(username: string) {
    const supabase = await createClient()

    // 1. Get User ID from Username (Profile)
    console.log('Fetching artist data for username:', username)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    console.log('Profile query result:', { profile, profileError })

    if (profileError || !profile) {
        console.error('Profile not found or error:', profileError)
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
        .order('position', { ascending: true })
        .order('created_at', { ascending: false })

    return {
        profile,
        settings: settings || {}, // Handle case where settings might not exist yet
        artworks: artworks || []
    }
}

export async function recordView(profileId: string) {
    const supabase = await createClient()

    // We can't easily get IP/User Agent here without passing headers, 
    // but for MVP just tracking the hit is enough.
    // If we wanted to be fancy we'd pass headers() from the page.

    try {
        await supabase.from('profile_views').insert({
            profile_id: profileId
        })
    } catch (err) {
        console.error('Failed to record view:', err)
        // Don't fail the page load if analytics fail
    }
}
