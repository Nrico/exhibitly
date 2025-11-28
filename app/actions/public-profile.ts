'use server'

import { createClient } from '@/utils/supabase/server'

export async function getPublicProfileData(username: string) {
    const supabase = await createClient()

    // 1. Get User ID from Username (Profile)
    console.log('Fetching public profile data for username:', username)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    console.log('Profile query result:', { profile, profileError })

    if (profileError || !profile) {
        console.error('Profile not found or error:', profileError)
        return { error: 'Profile not found' }
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
        .in('status', ['available', 'sold', 'Live'])
        .order('position', { ascending: true })
        .order('created_at', { ascending: false })

    // 4. Get Gallery Data (if applicable)
    let artists = []
    let exhibitions = []

    if (profile.account_type === 'gallery') {
        const { data: artistsData } = await supabase
            .from('artists')
            .select('*')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })

        if (artistsData) {
            // Fetch artworks for these artists
            const artistIds = artistsData.map(a => a.id)
            const { data: artistArtworks } = await supabase
                .from('artworks')
                .select('*')
                .in('artist_id', artistIds)
                .in('status', ['available', 'sold', 'Live'])
                .order('created_at', { ascending: false })

            artists = artistsData.map(artist => ({
                ...artist,
                artworks: artistArtworks?.filter(w => w.artist_id === artist.id) || []
            }))
        }

        const { data: exhibitionsData } = await supabase
            .from('exhibitions')
            .select(`
                *,
                exhibition_artworks (
                    position,
                    artwork: artworks (*)
                )
            `)
            .eq('user_id', profile.id)
            .eq('status', 'published')
            .order('start_date', { ascending: false })

        if (exhibitionsData) {
            // Transform the data to match the expected structure if needed, 
            // or just pass it through. The type definition might need updating.
            // We want exhibition.artworks to be an array of Artworks.
            exhibitions = exhibitionsData.map(ex => ({
                ...ex,
                artworks: ex.exhibition_artworks
                    ?.sort((a: any, b: any) => a.position - b.position)
                    .map((ea: any) => ea.artwork)
                    .filter(Boolean) || []
            }))
        }
    }

    return {
        profile,
        settings: settings || {},
        artworks: artworks || [],
        artists,
        exhibitions
    }
}

export async function recordView(profileId: string) {
    const supabase = await createClient()

    try {
        await supabase.from('profile_views').insert({
            profile_id: profileId
        })
    } catch (err) {
        console.error('Failed to record view:', err)
    }
}
