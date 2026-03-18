export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getFullCompliancePackage } from '@/lib/compliance-engine'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hireId = searchParams.get('hireId')
  const state = searchParams.get('state')

  if (state && !hireId) {
    const pkg = getFullCompliancePackage(state)
    return NextResponse.json(pkg)
  }

  if (!hireId) {
    return NextResponse.json({ error: 'hireId or state required' }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()
    const { data: items } = await supabase
      .from('compliance_items')
      .select('*')
      .eq('hire_id', hireId)
      .order('gate_order', { ascending: true })

    const { data: hire } = await supabase
      .from('hires')
      .select('*')
      .eq('id', hireId)
      .single()

    return NextResponse.json({ hire, items: items || [] })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, status, completedBy } = body

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('compliance_items')
      .update({
        status,
        completed_by: completedBy,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', itemId)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Recalculate hire progress
    if (data.hire_id) {
      const { data: allItems } = await supabase
        .from('compliance_items')
        .select('status')
        .eq('hire_id', data.hire_id)

      if (allItems) {
        const completed = allItems.filter(i => i.status === 'completed').length
        const total = allItems.length
        const score = Math.round((completed / total) * 100)
        const newStatus = score === 100 ? 'cleared' : completed > 0 ? 'in_progress' : 'pending'

        await supabase
          .from('hires')
          .update({
            compliance_score: score,
            completed_requirements: completed,
            status: newStatus
          })
          .eq('id', data.hire_id)
      }
    }

    return NextResponse.json({ item: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
