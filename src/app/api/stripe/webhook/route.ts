export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  try {
    const stripe = getStripe()
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )

    const supabase = createServiceClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        if (session.mode === 'subscription') {
          await supabase.from('subscriptions').upsert({
            user_id: session.metadata?.userId,
            stripe_subscription_id: session.subscription,
            stripe_customer_id: session.customer,
            plan: session.metadata?.plan || 'starter',
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          await supabase.from('users')
            .update({ plan: session.metadata?.plan, stripe_customer_id: session.customer })
            .eq('id', session.metadata?.userId)
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any
        await supabase.from('subscriptions')
          .update({ status: sub.status })
          .eq('stripe_subscription_id', sub.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
