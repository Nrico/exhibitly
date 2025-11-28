'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getImpersonatedUser } from '@/utils/impersonation'
import { uploadToR2 } from '@/utils/r2'
import { sanitizeFileName } from '@/lib/utils'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

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
        const sanitizedName = sanitizeFileName(full_name || 'user')
        const timestamp = Date.now()
        const fileName = `${user.id}/${sanitizedName}-${timestamp}.${fileExt}`

        try {
            updates.avatar_url = await uploadToR2(avatarFile, fileName, avatarFile.type)
        } catch (error) {
            console.error('Upload error:', error)
        }
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
}



export async function updateTheme(theme: string) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

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
