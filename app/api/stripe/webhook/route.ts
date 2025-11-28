import { stripe } from '@/utils/stripe/server';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const supabase = await createClient();

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
            await supabase
                .from('profiles')
                .update({ subscription_status: 'active', stripe_customer_id: session.customer as string })
                .eq('id', userId);
        }
    }

    if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as Stripe.Subscription;
        // Check status: active, past_due, unpaid, canceled, incomplete, incomplete_expired, trialing
        // We map 'active' and 'trialing' to 'active', others to 'free' (or specific status if we want)
        const status = ['active', 'trialing'].includes(subscription.status) ? 'active' : 'free';

        // Find profile by stripe_customer_id
        await supabase
            .from('profiles')
            .update({ subscription_status: status })
            .eq('stripe_customer_id', subscription.customer as string);
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
            .from('profiles')
            .update({ subscription_status: 'free' })
            .eq('stripe_customer_id', subscription.customer as string);
    }

    return new NextResponse(null, { status: 200 });
}
