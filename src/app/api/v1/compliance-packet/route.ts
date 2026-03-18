export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hireId = searchParams.get('hireId')

  if (!hireId) {
    return NextResponse.json({ error: 'hireId required' }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()

    const { data: hire } = await supabase.from('hires').select('*').eq('id', hireId).single()
    const { data: items } = await supabase.from('compliance_items').select('*').eq('hire_id', hireId)
    const { data: signatures } = await supabase.from('signatures').select('*').eq('hire_id', hireId)
    const { data: token } = await supabase.from('onboarding_tokens').select('*').eq('hire_id', hireId).single()

    const packet = {
      generatedAt: new Date().toISOString(),
      hire: hire || { id: hireId, full_name: 'Demo Employee' },
      completionSummary: {
        total: items?.length || 0,
        completed: items?.filter(i => i.status === 'completed').length || 0,
        pending: items?.filter(i => i.status === 'pending').length || 0
      },
      signatures: signatures || [],
      complianceItems: items || [],
      onboardingCompleted: token?.completed_at || null,
      auditTrail: (items || []).map(item => ({
        requirementId: item.requirement_id,
        name: item.requirement_name,
        status: item.status,
        completedAt: item.completed_at,
        completedBy: item.completed_by
      }))
    }

    return NextResponse.json({ packet })
  } catch {
    return NextResponse.json({ error: 'Failed to generate packet' }, { status: 500 })
  }
}
