'use server'

import { Resend } from 'resend'

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

    try {
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
