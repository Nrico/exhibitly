import Stripe from 'stripe';

// Prevent build failures if the key is missing (e.g. during static generation)
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build';

export const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-11-20.acacia' as any, // Using latest stable or specific version
    appInfo: {
        name: 'Exhibitly',
        version: '0.1.0',
    },
});
