'use server'

import { Resend } from 'resend'
import { createClient } from '@/utils/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInquiry(formData: FormData) {
    const artworkId = formData.get('artworkId') as string
    const artworkTitle = formData.get('artworkTitle') as string
    const artistEmail = formData.get('artistEmail') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name || !email || !message || !artistEmail) {
        return { error: 'Missing required fields' }
    }

    const supabase = await createClient()

    try {
        // 0. Find the artist's user_id based on the artwork or email
        // Since we don't have the artist's ID explicitly passed (only email), we should probably pass it or look it up.
        // Looking up by email is okay if email is unique in profiles.
        // Better: Pass artistId in the form data.
        // I'll assume we can look it up or I should have passed it.
        // Let's look it up by email for now, or fetch the artwork to get the user_id.

        let artistId = null
        if (artworkId) {
            const { data: artwork } = await supabase.from('artworks').select('user_id').eq('id', artworkId).single()
            if (artwork) artistId = artwork.user_id
        }

        // If we found the artist, save the subscriber
        if (artistId) {
            // Check if already subscribed to avoid unique constraint error (though we have ON CONFLICT in SQL usually, here we can just ignore)
            // Supabase `upsert` or `insert` with `ignoreDuplicates`
            await supabase.from('subscribers').insert({
                user_id: artistId,
                email: email,
                source: 'inquiry',
                subscribed: true
            }).select().single()
            // We ignore error here if it's a duplicate
        }

        // 1. Send email to Artist
        await resend.emails.send({
            from: 'Exhibitly <inquiries@exhibitly.co>', // Update this if you have a verified domain
            to: artistEmail,
            replyTo: email,
            subject: `New Inquiry: ${artworkTitle}`,
            html: `
                <h1>New Inquiry for "${artworkTitle}"</h1>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #ccc;">
                    ${message.replace(/\n/g, '<br>')}
                </blockquote>
                <hr>
                <p>You can reply directly to this email to contact the collector.</p>
                <p style="font-size: 12px; color: #888;">This person has been added to your subscriber list.</p>
            `
        })

        // 2. Send confirmation to User
        await resend.emails.send({
            from: 'Exhibitly <notifications@exhibitly.co>',
            to: email,
            subject: `Inquiry Received: ${artworkTitle}`,
            html: `
                <h1>Inquiry Received</h1>
                <p>Hi ${name},</p>
                <p>Thanks for your interest in <strong>"${artworkTitle}"</strong>. We've sent your message to the artist.</p>
                <p><strong>Your Message:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #ccc;">
                    ${message.replace(/\n/g, '<br>')}
                </blockquote>
                <p>The artist will be in touch with you shortly.</p>
            `
        })

        return { success: true }
    } catch (error) {
        console.error('Inquiry Error:', error)
        return { error: 'Failed to send inquiry. Please try again.' }
    }
}
