export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getFullCompliancePackage } from '@/lib/compliance-engine'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'demo-user'

  try {
    const supabase = createServiceClient()
    const { data: hires } = await supabase
      .from('hires')
      .select('*, compliance_items(*)')
      .eq('user_id', userId)
      .neq('status', 'cleared')

    if (!hires || hires.length === 0) {
      return NextResponse.json(getDemoRiskData())
    }

    let totalExposure = 0
    const stateBreakdown: Record<string, number> = {}
    const categoryBreakdown = { federal: 0, state: 0, company: 0 }

    hires.forEach((hire: any) => {
      const pending = (hire.compliance_items || []).filter((i: any) => i.status !== 'completed')
      pending.forEach((item: any) => {
        const match = (item.penalty_amount || '').match(/\$([0-9,]+)/)
        if (match) {
          const amount = parseInt(match[1].replace(/,/g, ''))
          totalExposure += amount
          stateBreakdown[hire.work_state] = (stateBreakdown[hire.work_state] || 0) + amount
          if (item.category in categoryBreakdown) {
            categoryBreakdown[item.category as keyof typeof categoryBreakdown] += amount
          }
        }
      })
    })

    return NextResponse.json({
      totalExposure,
      totalExposureFormatted: `$${totalExposure.toLocaleString()}`,
      hiresAtRisk: hires.length,
      stateBreakdown,
      categoryBreakdown
    })
  } catch {
    return NextResponse.json(getDemoRiskData())
  }
}

function getDemoRiskData() {
  return {
    totalExposure: 127500,
    totalExposureFormatted: '$127,500',
    hiresAtRisk: 3,
    stateBreakdown: { CA: 67500, NY: 38000, TX: 22000 },
    categoryBreakdown: { federal: 45000, state: 72500, company: 10000 }
  }
}
