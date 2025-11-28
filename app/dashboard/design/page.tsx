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

    // Fetch Profile for Username
    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

    let username = profile?.username

    // If username is missing, generate one and save it
    if (!username && user.email) {
        const baseUsername = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
        username = baseUsername

        // Try to update profile with base username
        const { error } = await supabase
            .from('profiles')
            .update({ username: baseUsername })
            .eq('id', user.id)

        // If error (likely duplicate), append timestamp
        if (error) {
            const timestamp = Date.now().toString().slice(-4)
            username = `${baseUsername}${timestamp}`
            await supabase
                .from('profiles')
                .update({ username })
                .eq('id', user.id)
        }
    }

    // Check for reserved usernames
    const reservedUsernames = ['gallery', 'admin', 'dashboard', 'auth', 'api', 'login', 'signup', 'contact', 'privacy', 'terms', 'view']
    if (username && reservedUsernames.includes(username.toLowerCase())) {
        const newUsername = `${username}-1`
        console.log(`Reserved username detected (${username}). Renaming to: ${newUsername}`)

        const { error } = await supabase
            .from('profiles')
            .update({ username: newUsername })
            .eq('id', user.id)

        if (!error) {
            username = newUsername
        } else {
            console.error('Failed to rename reserved username:', error)
        }
    }

    // Fallback if still missing (shouldn't happen if email exists)
    if (!username) {
        username = user.user_metadata.username || 'user'
    }

    console.log('Design Page - Final Username:', username)

    return <DesignClient initialSettings={initialSettings} username={username} artworks={artworks || []} accountType={profile?.account_type || 'artist'} />
}
