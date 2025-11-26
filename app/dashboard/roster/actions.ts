'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getImpersonatedUser } from '@/utils/impersonation'

const artistSchema = z.object({
    fullName: z.string().min(1, 'Name is required'),
    bio: z.string().optional(),
    avatarUrl: z.string().optional(),
})

export async function getArtists() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return []

    const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching artists:', error)
        return []
    }

    return artists
}

export async function createArtist(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return { error: 'Unauthorized' }

    const rawData = {
        fullName: formData.get('fullName') as string,
        bio: formData.get('bio') as string,
    }

    const imageFile = formData.get('image') as File
    let avatarUrl = formData.get('avatarUrl') as string

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, imageFile)

        if (uploadError) {
            console.error('Upload error:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)
            avatarUrl = publicUrl
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
        fullName: formData.get('fullName') as string,
        bio: formData.get('bio') as string,
    }

    const imageFile = formData.get('image') as File
    let avatarUrl = formData.get('avatarUrl') as string

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, imageFile)

        if (uploadError) {
            console.error('Upload error:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)
            avatarUrl = publicUrl
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
