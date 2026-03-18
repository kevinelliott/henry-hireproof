export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getFullCompliancePackage } from '@/lib/compliance-engine'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()

    const { data: tokenData, error } = await supabase
      .from('onboarding_tokens')
      .select('*, hires(*)')
      .eq('token', token)
      .single()

    if (error || !tokenData) {
      // Return demo data
      return NextResponse.json(getDemoOnboardingData(token))
    }

    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 410 })
    }

    const hire = tokenData.hires as any
    const pkg = getFullCompliancePackage(hire.work_state)

    const { data: items } = await supabase
      .from('compliance_items')
      .select('*')
      .eq('hire_id', hire.id)
      .order('gate_order', { ascending: true })

    return NextResponse.json({
      hire,
      token: tokenData,
      currentStep: tokenData.current_step,
      maxStep: tokenData.max_step,
      complianceItems: items || [],
      stateNotes: pkg.state?.notes || []
    })
  } catch {
    return NextResponse.json(getDemoOnboardingData(token))
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, step, formData, signatures: sigs } = body

    const supabase = createServiceClient()

    const { data: tokenData } = await supabase
      .from('onboarding_tokens')
      .select('*, hires(*)')
      .eq('token', token)
      .single()

    if (!tokenData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    // Update step
    const newStep = Math.max(tokenData.current_step, step + 1)
    const isCompleted = step >= 6

    await supabase
      .from('onboarding_tokens')
      .update({
        current_step: newStep,
        completed_at: isCompleted ? new Date().toISOString() : null
      })
      .eq('token', token)

    // Save signatures if provided
    if (sigs && sigs.length > 0 && tokenData.hires) {
      const hire = tokenData.hires as any
      const sigRecords = sigs.map((sig: any) => ({
        hire_id: hire.id,
        token_id: tokenData.id,
        signature_type: sig.type,
        signature_data: sig.data,
        typed_name: sig.typedName,
        document_name: sig.documentName,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown'
      }))
      await supabase.from('signatures').insert(sigRecords)
    }

    // Mark compliance items complete if step completed
    if (tokenData.hires) {
      const hire = tokenData.hires as any
      const stepItemMap: Record<number, number[]> = {
        1: [], // personal info — no specific compliance items
        2: [2], // tax forms — gate order 2
        3: [1], // I-9 — gate order 1
        4: [4], // state notices — gate order 4
        5: [5], // company policies — gate order 5
        6: [6]  // signature
      }

      const gateOrders = stepItemMap[step] || []
      if (gateOrders.length > 0) {
        await supabase
          .from('compliance_items')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('hire_id', hire.id)
          .in('gate_order', gateOrders)
      }

      if (isCompleted) {
        await supabase
          .from('compliance_items')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('hire_id', hire.id)

        await supabase
          .from('hires')
          .update({
            status: 'cleared',
            compliance_score: 100,
            completed_requirements: hire.total_requirements
          })
          .eq('id', hire.id)
      }
    }

    return NextResponse.json({ success: true, currentStep: newStep, completed: isCompleted })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getDemoOnboardingData(token: string) {
  return {
    hire: {
      id: 'demo-hire-1',
      full_name: 'Jane Smith',
      email: 'jane.smith@example.com',
      start_date: '2024-03-01',
      work_state: 'CA',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      status: 'in_progress'
    },
    token: {
      token,
      current_step: 1,
      max_step: 6,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    currentStep: 1,
    maxStep: 6,
    complianceItems: [],
    stateNotes: [
      'California has the most comprehensive new hire requirements in the US',
      'Non-compete agreements are void and unenforceable under Business & Professions Code §16600'
    ]
  }
}
