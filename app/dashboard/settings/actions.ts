'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const full_name = formData.get('full_name') as string
    const email = formData.get('email') as string
    const avatarFile = formData.get('avatar') as File

    const updates: any = {
        full_name,
        // email: email // Don't update email directly in profiles for now to avoid sync issues
    }

    if (avatarFile && avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}/avatar-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, { upsert: true })

        if (uploadError) {
            console.error('Upload error:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)
            updates.avatar_url = publicUrl
        }
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function updateSiteSettings(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const site_title = formData.get('site_title') as string
    const site_bio = formData.get('site_bio') as string
    const custom_domain = formData.get('custom_domain') as string

    // Check if site settings exist, if not create them
    const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('user_id')
        .eq('user_id', user.id)
        .single()

    let error;

    if (!existingSettings) {
        const { error: insertError } = await supabase.from('site_settings').insert({
            user_id: user.id,
            site_title,
            site_bio,
            custom_domain
        })
        error = insertError
    } else {
        const { error: updateError } = await supabase.from('site_settings').update({
            site_title,
            site_bio,
            custom_domain
        }).eq('user_id', user.id)
        error = updateError
    }

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function updateTheme(theme: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase.from('site_settings').upsert({
        user_id: user.id,
        theme
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/design')
    return { success: true }
}
