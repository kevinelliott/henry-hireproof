export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getFullCompliancePackage, calculatePenaltyExposure } from '@/lib/compliance-engine'
import { randomBytes } from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'

    const { data: hires, error } = await supabase
      .from('hires')
      .select('*, compliance_items(*), onboarding_tokens(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      // Return demo data if DB not configured
      return NextResponse.json({ hires: getDemoHires() })
    }

    return NextResponse.json({ hires: hires || [] })
  } catch {
    return NextResponse.json({ hires: getDemoHires() })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, startDate, workState, position, department, userId = 'demo-user' } = body

    if (!fullName || !email || !startDate || !workState || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const compliancePackage = getFullCompliancePackage(workState)
    const totalRequirements = compliancePackage.allRequirements.length
    const riskExposure = parseInt(compliancePackage.totalPenaltyExposure.replace(/,/g, ''))

    const supabase = createServiceClient()

    const { data: hire, error: hireError } = await supabase
      .from('hires')
      .insert({
        user_id: userId,
        full_name: fullName,
        email,
        start_date: startDate,
        work_state: workState,
        position,
        department,
        status: 'pending',
        compliance_score: 0,
        total_requirements: totalRequirements,
        completed_requirements: 0,
        risk_exposure_dollars: riskExposure
      })
      .select()
      .single()

    if (hireError) {
      // Return mock response for demo
      const mockHire = {
        id: `demo-${Date.now()}`,
        user_id: userId,
        full_name: fullName,
        email,
        start_date: startDate,
        work_state: workState,
        position,
        department,
        status: 'pending',
        compliance_score: 0,
        total_requirements: totalRequirements,
        completed_requirements: 0,
        risk_exposure_dollars: riskExposure,
        created_at: new Date().toISOString()
      }
      const token = randomBytes(32).toString('hex')
      return NextResponse.json({
        hire: mockHire,
        onboardingUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/onboard/${token}`,
        token
      })
    }

    // Create compliance items
    const complianceItems = compliancePackage.allRequirements.map(req => ({
      hire_id: hire.id,
      requirement_id: req.id,
      requirement_name: req.name,
      category: req.category,
      status: 'pending',
      completion_type: req.completionType,
      gate_order: req.gateOrder,
      penalty_amount: req.penalty.amount,
      penalty_citation: req.penalty.citation
    }))

    await supabase.from('compliance_items').insert(complianceItems)

    // Create onboarding token
    const token = randomBytes(32).toString('hex')
    await supabase.from('onboarding_tokens').insert({
      hire_id: hire.id,
      token,
      current_step: 1,
      max_step: 6
    })

    return NextResponse.json({
      hire,
      onboardingUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/onboard/${token}`,
      token
    })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getDemoHires() {
  return [
    {
      id: 'demo-1',
      full_name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      start_date: '2024-02-15',
      work_state: 'CA',
      position: 'Software Engineer',
      department: 'Engineering',
      status: 'in_progress',
      compliance_score: 65,
      total_requirements: 15,
      completed_requirements: 10,
      risk_exposure_dollars: 45000,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2',
      full_name: 'Michael Chen',
      email: 'michael.chen@example.com',
      start_date: '2024-02-20',
      work_state: 'NY',
      position: 'Product Manager',
      department: 'Product',
      status: 'pending',
      compliance_score: 0,
      total_requirements: 14,
      completed_requirements: 0,
      risk_exposure_dollars: 38000,
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-3',
      full_name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      start_date: '2024-01-30',
      work_state: 'TX',
      position: 'Sales Representative',
      department: 'Sales',
      status: 'cleared',
      compliance_score: 100,
      total_requirements: 10,
      completed_requirements: 10,
      risk_exposure_dollars: 0,
      created_at: new Date().toISOString()
    }
  ]
}
