import { createClient } from '@/utils/supabase/server'
import DesignClient from './design-client'
import { getImpersonatedUser } from '@/utils/impersonation'

export default async function SiteDesignPage() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) {
        return <div>Unauthorized</div>
    }

    // Fetch Site Settings
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const initialSettings = settings || {
        site_title: '',
        site_bio: '',
        theme: 'white',
        custom_domain: ''
    }

    // Fetch Artworks
    const { data: artworks } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const username = user.user_metadata.username || user.email?.split('@')[0]

    return <DesignClient initialSettings={initialSettings} username={username} artworks={artworks || []} />
}
