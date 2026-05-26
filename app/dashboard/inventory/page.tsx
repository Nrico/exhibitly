import { createClient } from '@/utils/supabase/server'
import { InventoryClient } from './inventory-client'
import { getImpersonatedUser } from '@/utils/impersonation'

import { Artist, Artwork } from '@/types'

export default async function InventoryPage() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    let artworks: Artwork[] = []
    let artists: Artist[] = []
    let profile: any = null
    let settings: any = null

    if (user && user.id !== 'mock-user-id') {
        const { data: artworksData } = await supabase
            .from('artworks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (artworksData) {
            artworks = artworksData
        }

        // Fetch Artists for Dropdown
        const { data: artistsData } = await supabase
            .from('artists')
            .select('*')
            .eq('user_id', user.id)
            .order('full_name', { ascending: true })

        if (artistsData) {
            artists = artistsData
        }

        // Fetch Profile details
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileData) {
            profile = profileData
        }

        // Fetch Site Settings details
        const { data: settingsData } = await supabase
            .from('site_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (settingsData) {
            settings = settingsData
        }
    } else {
        // Fallback for mock user (matching etrujillo details)
        profile = {
            full_name: 'El Trujillo',
            email: 'etrujillo@gmail.com',
            avatar_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/avatars/94615753-3152-4576-945b-0d62cc237d7e/avatar-0.6230062277931487.jpg'
        }
        settings = {
            site_title: 'El Trujillo',
            site_bio: 'Fine Art & Digital Fabrication based in Taos, NM. Exploring the intersection of traditional saint carving and modern manufacturing.',
            site_bio_long: 'The artist works with cedar, cottonwood, and aspen to create carved images of saints and quiet spiritual moments. Each piece keeps simple lines and visible tool marks.'
        }
        artworks = [
            {
                id: '1',
                title: 'Spiritualized',
                dimensions: 'Guardian angel sculpture',
                collection: 'Saint',
                medium: 'Aspen wood carving',
                price: null,
                status: 'available',
                image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/94615753-3152-4576-945b-0d62cc237d7e/0.632433993989002.jpg',
                description: 'This sculpture in aspen wood shows a guardian angel leaning forward as if listening. The wings curve close to the body rather than spreading wide.',
                user_id: 'mock-user-id',
                created_at: new Date().toISOString(),
                artist: undefined
            },
            {
                id: '2',
                title: 'Heart Hands',
                dimensions: 'Saint Anthony sculpture',
                collection: 'Sinner',
                medium: 'Bass wood relief',
                price: 1000,
                status: 'available',
                image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/94615753-3152-4576-945b-0d62cc237d7e/0.2992653177656386.jpg',
                description: 'A small pine retablo shows Saint Anthony holding the Child. Both faces are round with short noses and wide eyes.',
                user_id: 'mock-user-id',
                created_at: new Date().toISOString(),
                artist: undefined
            }
        ]
    }

    return (
        <InventoryClient
            initialArtworks={artworks}
            initialArtists={artists}
            profile={profile}
            settings={settings}
        />
    )
}
