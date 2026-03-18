export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    const supabase = createServiceClient()
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: users, count } = await supabase
      .from('users')
      .select('*, subscriptions(*)', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    return NextResponse.json({ users: users || [], total: count || 0, page, limit })
  } catch {
    return NextResponse.json({
      users: [],
      total: 0,
      message: 'Database not configured'
    })
  }
}
