import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { priceId, quantity = 1 } = await request.json()

  if (!priceId) {
    return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/pricing`,
    })

    return NextResponse.json(session)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
