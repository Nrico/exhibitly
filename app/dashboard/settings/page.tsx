import { createClient } from '@/utils/supabase/server'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

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
    } else {
        // Mock Data Fallback
        profile = {
            full_name: 'Enrico Trujillo',
            email: 'art@enricotrujillo.com',
            avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200'
        }
        settings = {
            site_title: 'Enrico Trujillo Art',
            site_bio: 'Fine Art & Digital Fabrication based in Taos, NM.',
            custom_domain: 'enricotrujillo.com'
        }
    }

    return <SettingsForm initialProfile={profile} initialSettings={settings} />
}
