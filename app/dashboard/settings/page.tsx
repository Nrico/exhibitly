import { createClient } from '@/utils/supabase/server'
import { SettingsForm } from './settings-form'
import { getImpersonatedUser } from '@/utils/impersonation'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    let profile = {
        full_name: '',
        email: '',
        avatar_url: ''
    }

    let settings = {
        site_title: '',
        site_bio: '',
        custom_domain: ''
    }

    let artworks: any[] = []

    if (user && user.id !== 'mock-user-id') {
        // Fetch Profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileData) {
            profile = profileData
        }

        // Fetch Site Settings
        const { data: settingsData } = await supabase
            .from('site_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (settingsData) {
            settings = settingsData
        }

        // Fetch Artworks for Export
        const { data: artworksData } = await supabase
            .from('artworks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (artworksData) {
            artworks = artworksData
        }
    } else {
        // Mock Data Fallback
        profile = {
            full_name: 'El Trujillo',
            email: 'etrujillo@gmail.com',
            avatar_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/avatars/94615753-3152-4576-945b-0d62cc237d7e/avatar-0.6230062277931487.jpg'
        }
        settings = {
            site_title: 'El Trujillo',
            site_bio: 'Fine Art & Digital Fabrication based in Taos, NM. Exploring the intersection of traditional saint carving and modern manufacturing.',
            custom_domain: 'exhibitly.art/etrujillo'
        }
    }

    return <SettingsForm initialProfile={profile} initialSettings={settings} artworks={artworks} />
}
