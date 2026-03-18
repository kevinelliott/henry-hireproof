export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json()
    const stripe = getStripe()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard`
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
