export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { getFullCompliancePackage, getAllStates, getAllFederalRequirements } from '@/lib/compliance-engine'
import { createServiceClient } from '@/lib/supabase'

// MCP (Model Context Protocol) Server for HireProof
export async function POST(request: NextRequest) {
  try {
    const { method, params } = await request.json()

    // Log MCP usage
    try {
      const supabase = createServiceClient()
      await supabase.from('mcp_usage').insert({
        tool_name: method,
        success: true
      })
    } catch {}

    switch (method) {
      case 'tools/list':
        return NextResponse.json({
          tools: [
            { name: 'get_state_compliance', description: 'Get all compliance requirements for a specific US state', inputSchema: { type: 'object', properties: { state: { type: 'string', description: '2-letter state code' } }, required: ['state'] } },
            { name: 'get_federal_requirements', description: 'Get all federal compliance requirements', inputSchema: { type: 'object', properties: {} } },
            { name: 'list_all_states', description: 'List all 50 states with requirement counts', inputSchema: { type: 'object', properties: {} } },
            { name: 'calculate_risk_exposure', description: 'Calculate total penalty exposure for incomplete requirements', inputSchema: { type: 'object', properties: { state: { type: 'string' }, completedRequirements: { type: 'array', items: { type: 'string' } } }, required: ['state'] } },
            { name: 'get_hire_status', description: 'Get compliance status for a specific hire', inputSchema: { type: 'object', properties: { hireId: { type: 'string' } }, required: ['hireId'] } }
          ]
        })

      case 'tools/call': {
        const { name, arguments: args } = params

        if (name === 'get_state_compliance') {
          const pkg = getFullCompliancePackage(args.state)
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(pkg, null, 2) }] })
        }

        if (name === 'get_federal_requirements') {
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(getAllFederalRequirements(), null, 2) }] })
        }

        if (name === 'list_all_states') {
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(getAllStates(), null, 2) }] })
        }

        if (name === 'calculate_risk_exposure') {
          const pkg = getFullCompliancePackage(args.state)
          const completed = args.completedRequirements || []
          const pending = pkg.allRequirements.filter(r => !completed.includes(r.id))
          const exposure = pending.reduce((sum, r) => {
            const match = r.penalty.amount.match(/\$([0-9,]+)/)
            return sum + (match ? parseInt(match[1].replace(/,/g, '')) : 0)
          }, 0)
          return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify({ totalExposure: exposure, pendingItems: pending.length }, null, 2) }] })
        }

        if (name === 'get_hire_status') {
          try {
            const supabase = createServiceClient()
            const { data } = await supabase.from('hires').select('*, compliance_items(*)').eq('id', args.hireId).single()
            return NextResponse.json({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] })
          } catch {
            return NextResponse.json({ content: [{ type: 'text', text: 'Hire not found' }] })
          }
        }

        return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })
      }

      default:
        return NextResponse.json({ error: 'Unknown method' }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'HireProof MCP Server',
    version: '1.0.0',
    description: 'Model Context Protocol server for HireProof compliance engine',
    capabilities: { tools: {} }
  })
}
