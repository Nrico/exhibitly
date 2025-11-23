'use server'

import { resend } from '@/utils/resend/server';

export async function sendContactEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const artistEmail = formData.get('artistEmail') as string;

    if (!artistEmail) {
        return { error: 'Artist email not found' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Exhibitly <onboarding@resend.dev>', // Use default domain for testing
            to: [artistEmail],
            subject: `New Inquiry from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email,
        });

        if (error) {
            return { error: error.message };
        }

        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
