'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createArtwork(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Ensure profile exists (self-healing for old accounts)
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
    if (!profile) {
        await supabase.from('profiles').insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata.full_name || user.email?.split('@')[0],
            username: user.user_metadata.username || user.email?.split('@')[0],
            account_type: 'artist' // Default
        })
        // Also ensure site settings exist
        await supabase.from('site_settings').insert({
            user_id: user.id,
            site_title: user.user_metadata.full_name || user.email?.split('@')[0]
        })
    }

    const title = formData.get('title') as string
    const medium = formData.get('medium') as string
    const price = formData.get('price') as string
    const dimensions = formData.get('dimensions') as string
    const collection = formData.get('collection') as string
    const status = formData.get('status') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File

    let image_url = 'https://images.unsplash.com/photo-1579783902614-a3fb39279cdb?q=80&w=400'

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('artworks')
            .upload(fileName, imageFile)

        if (uploadError) {
            console.error('Upload error:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('artworks')
                .getPublicUrl(fileName)
            image_url = publicUrl
        }
    }

    const { error } = await supabase.from('artworks').insert({
        user_id: user.id,
        title,
        description,
        medium,
        price: price ? parseFloat(price) : null,
        dimensions,
        collection,
        status,
        image_url
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/inventory')
    return { success: true }
}

export async function updateArtwork(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const medium = formData.get('medium') as string
    const price = formData.get('price') as string
    const dimensions = formData.get('dimensions') as string
    const collection = formData.get('collection') as string
    const status = formData.get('status') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File

    const updates: any = {
        title,
        description,
        medium,
        price: price ? parseFloat(price) : null,
        dimensions,
        collection,
        status
    }

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('artworks')
            .upload(fileName, imageFile)

        if (uploadError) {
            console.error('Upload error:', uploadError)
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('artworks')
                .getPublicUrl(fileName)
            updates.image_url = publicUrl
        }
    }

    const { error } = await supabase.from('artworks').update(updates).eq('id', id).eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/inventory')
    return { success: true }
}

export async function deleteArtwork(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase.from('artworks').delete().eq('id', id).eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/inventory')
    return { success: true }
}

export async function reorderArtworks(items: { id: string, position: number }[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Perform updates in a transaction-like manner (or just parallel promises)
    // Supabase doesn't support easy transactions via client yet, so we'll just loop.
    // For a small number of items (20-50), this is fine.

    const updates = items.map(item =>
        supabase
            .from('artworks')
            .update({ position: item.position })
            .eq('id', item.id)
            .eq('user_id', user.id)
    )

    await Promise.all(updates)

    revalidatePath('/dashboard/inventory')
    return { success: true }
}
