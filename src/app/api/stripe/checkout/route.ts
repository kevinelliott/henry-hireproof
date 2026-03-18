export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PLANS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, email } = await request.json()

    const planData = PLANS[plan as keyof typeof PLANS]
    if (!planData) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const stripe = getStripe()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: planData.priceId || undefined,
          quantity: 1,
        }
      ],
      customer_email: email,
      metadata: { userId, plan },
      success_url: `${baseUrl}/dashboard?checkout=success&plan=${plan}`,
      cancel_url: `${baseUrl}/pricing?checkout=canceled`,
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
