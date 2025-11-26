'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getImpersonatedUser } from '@/utils/impersonation'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function notifySubscribers(supabase: any, user: any, artwork: any) {
    // 1. Fetch subscribers
    const { data: subscribers } = await supabase
        .from('subscribers')
        .select('email')
        .eq('user_id', user.id)
        .eq('subscribed', true)

    if (!subscribers || subscribers.length === 0) return

    // 2. Send emails (batch or loop)
    // Resend supports batching, but for simplicity/limitations we might loop or use bcc if list is small.
    // For privacy, we should send individual emails or use BCC properly.
    // Let's loop for now as the list is likely small for this MVP.
    // Or better: Send one email to the artist and BCC everyone? No, that exposes emails if not careful.
    // Best: Loop and send individual emails.

    const emailPromises = subscribers.map(async (sub: any) => {
        try {
            await resend.emails.send({
                from: 'Exhibitly <notifications@exhibitly.co>',
                to: sub.email,
                subject: `New Artwork Available: ${artwork.title}`,
                html: `
                    <h1>New Work by ${user.user_metadata.full_name || 'the Artist'}</h1>
                    <p>A new piece has just been released.</p>
                    <div style="margin: 20px 0; border: 1px solid #eee; padding: 20px; text-align: center;">
                        <img src="${artwork.image_url}" alt="${artwork.title}" style="max-width: 100%; max-height: 400px; object-fit: contain; margin-bottom: 20px;" />
                        <h2 style="margin: 0;">${artwork.title}</h2>
                        <p style="color: #666;">${artwork.medium} &bull; ${artwork.dimensions}</p>
                        <p style="font-weight: bold; font-size: 18px;">$${artwork.price}</p>
                    </div>
                    <p style="text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/${user.user_metadata.username || user.id}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">View Artwork</a>
                    </p>
                `
            })
        } catch (err) {
            console.error(`Failed to send to ${sub.email}`, err)
        }
    })

    await Promise.all(emailPromises)
}

export async function createArtwork(formData: FormData) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

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
    const shouldNotify = formData.get('notify_subscribers') === 'true'

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

    const { data: newArtwork, error } = await supabase.from('artworks').insert({
        user_id: user.id,
        title,
        description,
        medium,
        price: price ? parseFloat(price) : null,
        dimensions,
        collection,
        status,
        image_url
    }).select().single()

    if (error) {
        return { error: error.message }
    }

    if (shouldNotify && status === 'available' && newArtwork) {
        // Run in background (don't await to keep UI fast)
        notifySubscribers(supabase, user, newArtwork).catch(err => console.error('Notification error:', err))
    }

    revalidatePath('/dashboard/inventory')
    return { success: true }
}

export async function updateArtwork(id: string, formData: FormData) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

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
    const shouldNotify = formData.get('notify_subscribers') === 'true'

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

    const { data: updatedArtwork, error } = await supabase.from('artworks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    if (shouldNotify && status === 'available' && updatedArtwork) {
        notifySubscribers(supabase, user, updatedArtwork).catch(err => console.error('Notification error:', err))
    }

    revalidatePath('/dashboard/inventory')
    return { success: true }
}

export async function deleteArtwork(id: string) {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

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
    const { user } = await getImpersonatedUser(supabase)

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

    // Fetch profile to get username for revalidation
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()

    revalidatePath('/dashboard/inventory')
    if (profile?.username) {
        revalidatePath(`/${profile.username}`)
    }
    revalidatePath('/') // Just in case

    return { success: true }
}
