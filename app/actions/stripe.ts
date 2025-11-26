'use server'

import { stripe } from '@/utils/stripe/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createPortalSession() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single()

    if (!profile?.stripe_customer_id) {
        throw new Error('No Stripe customer found')
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/settings`,
    })

    redirect(session.url)
}
