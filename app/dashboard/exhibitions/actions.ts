'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getImpersonatedUser } from '@/utils/impersonation'

const exhibitionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']),
    coverImageUrl: z.string().optional(),
})

export async function getExhibitions() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return []

    const { data: exhibitions, error } = await supabase
        .from('exhibitions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching exhibitions:', error)
        return []
    }

    return exhibitions
}

export async function createExhibition(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return { error: 'Unauthorized' }

    const rawData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        startDate: formData.get('startDate') as string || undefined,
        endDate: formData.get('endDate') as string || undefined,
        status: formData.get('status') as 'draft' | 'published' | 'archived',
    }

    const imageFile = formData.get('coverImage') as File
    let coverImageUrl = formData.get('coverImageUrl') as string

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/exhibitions/${Math.random()}.${fileExt}`
        // Use 'artworks' bucket for now as it's public, or create 'exhibitions' bucket?
        // Let's reuse 'artworks' bucket but organize by folder, or 'avatars'?
        // 'artworks' bucket seems appropriate for exhibition covers too.
        const { error: uploadError } = await supabase.storage
            .from('artworks')
            .upload(fileName, imageFile)

        if (uploadError) {
            console.error('Upload error:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('artworks')
                .getPublicUrl(fileName)
            coverImageUrl = publicUrl
        }
    }

    const validated = exhibitionSchema.safeParse({ ...rawData, coverImageUrl })
    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { error } = await supabase
        .from('exhibitions')
        .insert({
            user_id: user.id,
            title: validated.data.title,
            description: validated.data.description,
            start_date: validated.data.startDate || null,
            end_date: validated.data.endDate || null,
            status: validated.data.status,
            cover_image_url: validated.data.coverImageUrl,
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/exhibitions')
    return { success: true, message: 'Exhibition created successfully' }
}

export async function updateExhibition(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return { error: 'Unauthorized' }

    const id = formData.get('id') as string
    const rawData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        startDate: formData.get('startDate') as string || undefined,
        endDate: formData.get('endDate') as string || undefined,
        status: formData.get('status') as 'draft' | 'published' | 'archived',
    }

    const imageFile = formData.get('coverImage') as File
    let coverImageUrl = formData.get('coverImageUrl') as string

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/exhibitions/${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('artworks')
            .upload(fileName, imageFile)

        if (uploadError) {
            console.error('Upload error:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('artworks')
                .getPublicUrl(fileName)
            coverImageUrl = publicUrl
        }
    }

    const validated = exhibitionSchema.safeParse({ ...rawData, coverImageUrl })
    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { error } = await supabase
        .from('exhibitions')
        .update({
            title: validated.data.title,
            description: validated.data.description,
            start_date: validated.data.startDate || null,
            end_date: validated.data.endDate || null,
            status: validated.data.status,
            cover_image_url: validated.data.coverImageUrl,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/exhibitions')
    return { success: true, message: 'Exhibition updated successfully' }
}

export async function deleteExhibition(id: string) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('exhibitions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/exhibitions')
    return { success: true }
}

export async function getExhibitionArtworks(exhibitionId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('exhibition_artworks')
        .select(`
            *,
            artwork:artworks(*)
        `)
        .eq('exhibition_id', exhibitionId)
        .order('position', { ascending: true })

    if (error) {
        console.error('Error fetching exhibition artworks:', error)
        return []
    }

    return data
}

export async function updateExhibitionArtworks(exhibitionId: string, artworkIds: string[]) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) return { error: 'Unauthorized' }

    // Verify ownership of exhibition
    const { data: exhibition } = await supabase
        .from('exhibitions')
        .select('id')
        .eq('id', exhibitionId)
        .eq('user_id', user.id)
        .single()

    if (!exhibition) return { error: 'Exhibition not found or unauthorized' }

    // Delete existing links
    await supabase
        .from('exhibition_artworks')
        .delete()
        .eq('exhibition_id', exhibitionId)

    if (artworkIds.length === 0) return { success: true }

    // Insert new links with position
    const { error } = await supabase
        .from('exhibition_artworks')
        .insert(
            artworkIds.map((artworkId, index) => ({
                exhibition_id: exhibitionId,
                artwork_id: artworkId,
                position: index,
            }))
        )

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/exhibitions')
    return { success: true }
}
