export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const { data: logs } = await supabase
      .from('mcp_usage')
      .select('*, users(email)')
      .order('created_at', { ascending: false })
      .limit(100)

    const toolCounts: Record<string, number> = {}
    logs?.forEach(l => {
      toolCounts[l.tool_name] = (toolCounts[l.tool_name] || 0) + 1
    })

    return NextResponse.json({ logs: logs || [], toolUsage: toolCounts })
  } catch {
    return NextResponse.json({ logs: [], toolUsage: {} })
  }
}
