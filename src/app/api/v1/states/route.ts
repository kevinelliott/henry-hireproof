export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { getAllStates, getFullCompliancePackage } from '@/lib/compliance-engine'

export async function GET() {
  const states = getAllStates()

  const statesWithDetails = states.map(state => {
    const pkg = getFullCompliancePackage(state.code)
    return {
      ...state,
      federalRequirements: pkg.federal.length,
      stateRequirements: pkg.state?.requirements.length || 0,
      notes: pkg.state?.notes || [],
      penaltyExposure: pkg.totalPenaltyExposure
    }
  })

  return NextResponse.json({ states: statesWithDetails, total: statesWithDetails.length })
}
