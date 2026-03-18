import Link from 'next/link'
import { Shield, Code, Database, Globe, Lock, Zap } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="bg-white min-h-screen">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-7 h-7 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">HireProof</span>
            </Link>
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg font-medium">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          {/* Sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              {[
                { label: 'Getting Started', href: '#getting-started' },
                { label: 'API Reference', href: '#api-reference' },
                { label: 'Compliance Engine', href: '#compliance-engine' },
                { label: 'Onboarding Flow', href: '#onboarding-flow' },
                { label: 'Webhooks', href: '#webhooks' },
                { label: 'MCP Integration', href: '#mcp' },
              ].map(item => (
                <a key={item.label} href={item.href} className="block text-sm text-gray-600 hover:text-indigo-600 py-1.5">{item.label}</a>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">HireProof Documentation</h1>
            <p className="text-gray-600 text-lg mb-12">Everything you need to integrate and use HireProof for new hire compliance.</p>

            <section id="getting-started" className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
              <p className="text-gray-600 mb-6">HireProof is a compliance gatekeeper for new hires. It auto-generates state-specific compliance checklists and blocks "Cleared to Start" until every requirement is complete.</p>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Start</h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Create a hire via dashboard or API: <code className="bg-gray-200 px-1 rounded">POST /api/v1/hires</code></li>
                  <li>2. Share the generated onboarding link with your new hire</li>
                  <li>3. New hire completes the 6-step gated flow</li>
                  <li>4. Status updates to CLEARED when 100% complete</li>
                </ol>
              </div>
            </section>

            <section id="api-reference" className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h2>

              <div className="space-y-6">
                {[
                  { method: 'GET', endpoint: '/api/v1/hires', description: 'List all hires for a user', params: 'userId (query)' },
                  { method: 'POST', endpoint: '/api/v1/hires', description: 'Create a new hire and generate compliance checklist', params: 'fullName, email, startDate, workState, position, department, userId' },
                  { method: 'GET', endpoint: '/api/v1/states', description: 'List all 50 states with requirement counts', params: 'none' },
                  { method: 'GET', endpoint: '/api/v1/compliance', description: 'Get compliance status for a hire or state', params: 'hireId or state (query)' },
                  { method: 'PATCH', endpoint: '/api/v1/compliance', description: 'Update compliance item status', params: 'itemId, status, completedBy' },
                  { method: 'GET', endpoint: '/api/v1/risk', description: 'Calculate risk exposure in dollars', params: 'userId (query)' },
                  { method: 'POST', endpoint: '/api/v1/offer-letter', description: 'Generate state-specific offer letter', params: 'employeeName, position, workState, salary, startDate, companyName' },
                  { method: 'GET', endpoint: '/api/mcp', description: 'MCP server info and available tools', params: 'none' },
                  { method: 'POST', endpoint: '/api/mcp', description: 'Execute MCP tools (tools/list, tools/call)', params: 'method, params' },
                ].map(api => (
                  <div key={api.endpoint} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${api.method === 'GET' ? 'bg-green-100 text-green-700' : api.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {api.method}
                      </span>
                      <code className="text-sm font-mono text-gray-900">{api.endpoint}</code>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-600 mb-1">{api.description}</p>
                      <p className="text-xs text-gray-500"><span className="font-medium">Params:</span> {api.params}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="compliance-engine" className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance Engine</h2>
              <p className="text-gray-600 mb-4">The compliance engine contains real statutory requirements for all 50 states + DC + federal requirements.</p>

              <div className="bg-gray-900 rounded-xl p-6 text-sm font-mono text-gray-300 overflow-x-auto">
                <pre>{`// Get compliance requirements for a state
import { getFullCompliancePackage } from '@/lib/compliance-engine'

const pkg = getFullCompliancePackage('CA')
// Returns:
// {
//   federal: ComplianceRequirement[]  // 7 federal requirements
//   state: StateCompliance            // 8 CA-specific requirements
//   allRequirements: ComplianceRequirement[]  // 15 total
//   totalPenaltyExposure: '89,832'    // estimated max exposure
// }

// Each requirement includes:
// {
//   id: 'ca-wtpa',
//   name: 'Wage Theft Prevention Act Notice',
//   penalty: {
//     amount: '$50-$4,000 per employee',
//     citation: 'California Labor Code §2810.5'
//   },
//   deadline: 'First day of employment',
//   gateOrder: 4  // sequential unlock order
// }`}</pre>
              </div>
            </section>

            <section id="mcp" className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MCP Integration</h2>
              <p className="text-gray-600 mb-4">HireProof exposes an MCP (Model Context Protocol) server at <code className="bg-gray-100 px-1 rounded">/api/mcp</code> that AI assistants can use to query compliance data.</p>

              <div className="space-y-4">
                {[
                  { tool: 'get_state_compliance', desc: 'Get all compliance requirements for a specific state' },
                  { tool: 'get_federal_requirements', desc: 'Get all 7 federal compliance requirements' },
                  { tool: 'list_all_states', desc: 'List all 50 states with requirement counts' },
                  { tool: 'calculate_risk_exposure', desc: 'Calculate penalty exposure for incomplete items' },
                  { tool: 'get_hire_status', desc: 'Get compliance status for a specific hire' },
                ].map(t => (
                  <div key={t.tool} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl shadow-sm">
                    <Code className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <code className="text-sm font-mono text-gray-900">{t.tool}</code>
                      <p className="text-sm text-gray-600 mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
