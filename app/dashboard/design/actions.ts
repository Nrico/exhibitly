'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveSiteSettings(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const site_title = formData.get('site_title') as string
    const site_subtitle = formData.get('site_subtitle') as string
    const site_bio = formData.get('site_bio') as string
    const site_bio_long = formData.get('site_bio_long') as string
    const theme = formData.get('theme') as string
    const custom_domain = formData.get('custom_domain') as string
    const contact_email = formData.get('contact_email') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const social_instagram = formData.get('social_instagram') as string
    const social_twitter = formData.get('social_twitter') as string
    const social_facebook = formData.get('social_facebook') as string

    // Upsert settings
    const { error } = await supabase.from('site_settings').upsert({
        user_id: user.id,
        site_title,
        site_subtitle,
        site_bio,
        site_bio_long,
        theme,
        custom_domain,
        contact_email,
        phone,
        address,
        social_instagram,
        social_twitter,
        social_facebook,
        updated_at: new Date().toISOString()
    })

    if (error) {
        return { error: error.message }
    }

    // Sync username to profile if missing (fixes 404 on public page)
    const username = user.user_metadata.username || user.email?.split('@')[0]
    if (username) {
        console.log('Attempting to update username for user:', user.id, 'to', username)

        // Check if profile exists first
        const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()

        if (!profile) {
            console.log('Profile missing, creating new profile...')
            await supabase.from('profiles').insert({
                id: user.id,
                email: user.email!,
                full_name: user.user_metadata.full_name || user.email?.split('@')[0],
                username: username,
                account_type: 'artist'
            })
        } else {
            const { error: updateError, count } = await supabase
                .from('profiles')
                .update({ username })
                .eq('id', user.id)
                .select() // Select to verify update

            console.log('Profile update result:', { updateError, count })

            if (updateError) {
                console.error('Failed to update profile username:', updateError)
            }
        }
    }

    revalidatePath('/dashboard/design')
    revalidatePath(`/${user.user_metadata.username || user.email?.split('@')[0]}`) // Revalidate public page
    return { success: true }
}
