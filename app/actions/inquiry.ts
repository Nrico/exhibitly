'use server'

import { Resend } from 'resend'
import { createClient } from '@/utils/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInquiry(formData: FormData) {
    const artworkId = formData.get('artworkId') as string
    const artistId = formData.get('artistId') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
        return { error: 'Missing required fields' }
    }

    const supabase = await createClient()

    try {
        let finalArtistId = artistId
        let artistEmail = ''
        let artworkTitle = 'General Inquiry'

        // 0. Resolve the artwork and artist context server-side
        if (artworkId) {
            const { data: artwork } = await supabase
                .from('artworks')
                .select('title, user_id')
                .eq('id', artworkId)
                .single()
            if (artwork) {
                artworkTitle = artwork.title
                finalArtistId = artwork.user_id
            }
        }

        if (!finalArtistId) {
            return { error: 'Artist context not found' }
        }

        // Fetch verified email from settings or profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', finalArtistId)
            .single()

        const { data: settings } = await supabase
            .from('site_settings')
            .select('contact_email')
            .eq('user_id', finalArtistId)
            .single()

        artistEmail = settings?.contact_email || profile?.email || ''

        if (!artistEmail) {
            return { error: 'Artist contact email not configured' }
        }

        // If we found the artist, save the subscriber
        if (finalArtistId) {
            // Check if already subscribed to avoid unique constraint error
            await supabase.from('subscribers').insert({
                user_id: finalArtistId,
                email: email,
                source: 'inquiry',
                subscribed: true
            }).select().single()
        }

        // 1. Send email to Artist
        await resend.emails.send({
            from: 'Exhibitly <inquiries@exhibitly.art>',
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
            from: 'Exhibitly <notifications@exhibitly.art>',
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
