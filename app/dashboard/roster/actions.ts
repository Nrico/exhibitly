'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getImpersonatedUser } from '@/utils/impersonation'
import { uploadToR2 } from '@/utils/r2'
import { checkLimit } from '@/utils/limits'
import { sanitizeFileName } from '@/lib/utils'

const artistSchema = z.object({
    fullName: z.string().min(1, 'Name is required'),
    bio: z.string().optional(),
    avatarUrl: z.string().optional(),
})

export async function getArtists() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return []

    console.log('Fetching artists for user:', user.id)

    const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching artists:', error)
        return []
    }

    console.log('Fetched artists count:', artists?.length)
    return artists
}

export async function createArtist(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return { error: 'Unauthorized' }

    // Check limits
    const { allowed, limit } = await checkLimit(supabase, user.id, 'artists')
    if (!allowed) {
        return { error: `You have reached the limit of ${limit} artists for your plan. Please upgrade to add more.` }
    }

    const rawData = {
        fullName: (formData.get('fullName') as string) || '',
        bio: (formData.get('bio') as string) || '',
    }

    const imageFile = formData.get('image') as File
    let avatarUrl = (formData.get('avatarUrl') as string) || undefined

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const sanitizedName = sanitizeFileName(rawData.fullName)
        const timestamp = Date.now()
        const fileName = `${user.id}/${sanitizedName}-${timestamp}.${fileExt}`

        try {
            avatarUrl = await uploadToR2(imageFile, fileName, imageFile.type)
        } catch (error) {
            console.error('Upload error:', error)
        }
    }

    const validated = artistSchema.safeParse({ ...rawData, avatarUrl })
    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { error } = await supabase
        .from('artists')
        .insert({
            user_id: user.id,
            full_name: validated.data.fullName,
            bio: validated.data.bio,
            avatar_url: validated.data.avatarUrl,
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/roster')
    return { success: true, message: 'Artist added successfully' }
}

export async function updateArtist(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return { error: 'Unauthorized' }

    const id = formData.get('id') as string
    const rawData = {
        fullName: (formData.get('fullName') as string) || '',
        bio: (formData.get('bio') as string) || '',
    }

    const imageFile = formData.get('image') as File
    let avatarUrl = (formData.get('avatarUrl') as string) || undefined

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const sanitizedName = sanitizeFileName(rawData.fullName)
        const timestamp = Date.now()
        const fileName = `${user.id}/${sanitizedName}-${timestamp}.${fileExt}`

        try {
            avatarUrl = await uploadToR2(imageFile, fileName, imageFile.type)
        } catch (error) {
            console.error('Upload error:', error)
        }
    }

    const validated = artistSchema.safeParse({ ...rawData, avatarUrl })
    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { error } = await supabase
        .from('artists')
        .update({
            full_name: validated.data.fullName,
            bio: validated.data.bio,
            avatar_url: validated.data.avatarUrl,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/roster')
    return { success: true, message: 'Artist updated successfully' }
}

export async function deleteArtist(id: string) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/roster')
    return { success: true }
}
