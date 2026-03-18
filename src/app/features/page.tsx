import Link from 'next/link'
import { Shield, MapPin, Lock, FileText, PenTool, Activity, RefreshCw, Code, ArrowRight, CheckCircle } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-7 h-7 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">HireProof</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">Get started</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Built for compliance-first HR teams
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Everything you need to<br />hire without liability</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">A complete compliance system built on real US employment law. Not just a checklist — a gatekeeper.</p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">

          {/* Feature 1 - Large */}
          <div className="lg:col-span-2 border border-gray-200 bg-white rounded-2xl p-8 shadow-sm overflow-hidden relative group hover:border-indigo-200 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-32 translate-x-32 group-hover:scale-110 transition-transform duration-500 opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">Core moat</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">50-State Compliance Engine</h2>
              <p className="text-gray-600 mb-6">Real statutory requirements for all 50 states + DC + federal. Every requirement includes the actual statute citation and penalty amount — not generic advice.</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { state: 'CA', reqs: '15 req', highlight: 'WTPA + SB 1162 + DE-4' },
                  { state: 'NY', reqs: '13 req', highlight: 'WTPA LS-54 + PFL + HERO Act' },
                  { state: 'TX', reqs: '10 req', highlight: 'At-will + DWC-5 + Payday Law' },
                  { state: 'IL', reqs: '12 req', highlight: 'WTA + BIPA + Harassment' },
                  { state: 'WA', reqs: '12 req', highlight: 'EPOA + PFML + Silenced No More' },
                  { state: 'CO', reqs: '12 req', highlight: 'EPEWA + FAMLI + COMPS #39' },
                ].map(s => (
                  <div key={s.state} className="bg-gray-50 rounded-xl p-3">
                    <div className="font-bold text-gray-900">{s.state}</div>
                    <div className="text-xs text-indigo-600 font-medium">{s.reqs}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.highlight}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="border border-gray-200 bg-white rounded-2xl p-8 shadow-sm overflow-hidden relative group hover:border-indigo-200 transition-colors">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-50 rounded-full translate-y-24 -translate-x-24 group-hover:scale-110 transition-transform duration-500 opacity-60" />
            <div className="relative">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Gated Onboarding Flow</h2>
              <p className="text-gray-600 text-sm mb-4">6 sequential steps that unlock one at a time. New hires can&apos;t skip ahead or access step 4 without completing steps 1–3.</p>
              <div className="space-y-2">
                {['Personal Information', 'Tax Forms (W-4, DE-4)', 'I-9 Verification', 'State Notices', 'Company Policies', 'Digital Signature'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {i < 3 ? '✓' : (i + 1)}
                    </div>
                    <span className={i < 3 ? 'text-gray-900' : 'text-gray-400'}>{step}</span>
                    {i >= 3 && <Lock className="w-3 h-3 text-gray-300" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="border border-gray-200 bg-white rounded-2xl p-8 shadow-sm overflow-hidden relative group hover:border-indigo-200 transition-colors">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full -translate-y-24 translate-x-24 group-hover:scale-110 transition-transform duration-500 opacity-60" />
            <div className="relative">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Activity className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Real-Time Risk Dashboard</h2>
              <p className="text-gray-600 text-sm mb-4">See your total penalty exposure in dollars. Updated in real-time as hires complete their onboarding.</p>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-sm text-red-700 font-medium mb-1">Current exposure</div>
                <div className="text-3xl font-bold text-red-600">$127,500</div>
                <div className="text-xs text-red-500 mt-1">3 hires with incomplete docs</div>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="border border-gray-200 bg-white rounded-2xl p-8 shadow-sm overflow-hidden relative group hover:border-indigo-200 transition-colors">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-50 rounded-full translate-y-24 translate-x-24 group-hover:scale-110 transition-transform duration-500 opacity-60" />
            <div className="relative">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Document Generation</h2>
              <p className="text-gray-600 text-sm mb-4">Auto-generate state-specific offer letters with the correct legal clauses, and compile full compliance packets.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700"><CheckCircle className="w-4 h-4 text-green-600" />CA: WTPA + SB 1162 pay clauses</div>
                <div className="flex items-center gap-2 text-gray-700"><CheckCircle className="w-4 h-4 text-green-600" />TX: At-will + DWC-5 workers' comp</div>
                <div className="flex items-center gap-2 text-gray-700"><CheckCircle className="w-4 h-4 text-green-600" />MT: WDEA probationary period notice</div>
              </div>
            </div>
          </div>

          {/* Feature 5 - Large */}
          <div className="lg:col-span-2 border border-gray-200 bg-white rounded-2xl p-8 shadow-sm overflow-hidden relative group hover:border-indigo-200 transition-colors">
            <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-50 rounded-full -translate-y-40 -translate-x-40 group-hover:scale-110 transition-transform duration-700 opacity-40" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">Legally valid</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Digital Signatures & Audit Trail</h2>
              <p className="text-gray-600 mb-6">Canvas-based signature capture + typed name confirmation. Every signature is timestamped with IP address. Fully compliant with E-SIGN Act (15 U.S.C. §7001) and UETA.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'E-SIGN Act', desc: '15 U.S.C. §7001 compliant' },
                  { label: 'UETA', desc: 'Uniform Electronic Transactions Act' },
                  { label: 'Timestamped', desc: 'ISO 8601 + timezone' },
                  { label: 'IP Logged', desc: 'For audit purposes' },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                    <div className="font-semibold text-gray-900 text-sm mb-1">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="border border-gray-200 bg-white rounded-2xl p-8 shadow-sm overflow-hidden relative group hover:border-indigo-200 transition-colors">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-50 rounded-full -translate-y-24 translate-x-24 group-hover:scale-110 transition-transform duration-500 opacity-60" />
            <div className="relative">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <RefreshCw className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">State Law Updates</h2>
              <p className="text-gray-600 text-sm mb-4">When employment laws change (new minimum wages, new notice requirements), the compliance engine is updated. You don&apos;t have to track every state legislature.</p>
              <div className="space-y-2 text-xs text-gray-500">
                <div>✓ CA SB 616 sick leave (2024)</div>
                <div>✓ MA Pay Transparency (Feb 2025)</div>
                <div>✓ MI ESTA expansion (Feb 2025)</div>
                <div>✓ VA Pay Transparency (Jan 2025)</div>
              </div>
            </div>
          </div>

          {/* Feature 7 */}
          <div className="border border-gray-200 bg-white rounded-2xl p-8 shadow-sm overflow-hidden relative group hover:border-indigo-200 transition-colors">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full translate-y-24 -translate-x-24 group-hover:scale-110 transition-transform duration-500 opacity-60" />
            <div className="relative">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">API Access & MCP Server</h2>
              <p className="text-gray-600 text-sm mb-4">Full REST API and Model Context Protocol server. Let AI assistants query your compliance data and integrate HireProof into your existing HR workflows.</p>
              <div className="bg-gray-900 rounded-xl p-3 text-xs font-mono text-green-400">
                <div className="text-gray-500">POST /api/mcp</div>
                <div>{`{"method": "tools/call",`}</div>
                <div>{` "params": {"name":`}</div>
                <div>{`  "get_state_compliance",`}</div>
                <div>{`  "arguments": {"state": "CA"}}}`}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-indigo-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to eliminate compliance risk?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">Start with 10 free hires. No credit card required.</p>
          <Link href="/pricing" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition-colors">
            See pricing <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
