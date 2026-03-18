'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Plus, AlertTriangle, CheckCircle, Clock, XCircle, Copy, ExternalLink, ChevronRight, DollarSign, Users, TrendingUp, FileText } from 'lucide-react'
import { US_STATES } from '@/lib/compliance-engine'

interface Hire {
  id: string
  full_name: string
  email: string
  start_date: string
  work_state: string
  position: string
  department?: string
  status: 'pending' | 'in_progress' | 'blocked' | 'cleared'
  compliance_score: number
  total_requirements: number
  completed_requirements: number
  risk_exposure_dollars: number
  created_at: string
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  blocked: { label: 'Blocked', color: 'bg-red-100 text-red-700', icon: XCircle },
  cleared: { label: 'Cleared', color: 'bg-green-100 text-green-700', icon: CheckCircle },
}

export default function DashboardPage() {
  const [hires, setHires] = useState<Hire[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewHireForm, setShowNewHireForm] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [generatedLinks, setGeneratedLinks] = useState<Record<string, string>>({})
  const [riskData, setRiskData] = useState<any>(null)

  const [newHire, setNewHire] = useState({
    fullName: '', email: '', startDate: '', workState: '',
    position: '', department: '', userId: 'demo-user'
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchHires()
    fetchRisk()
  }, [])

  async function fetchHires() {
    try {
      const res = await fetch('/api/v1/hires?userId=demo-user')
      const data = await res.json()
      setHires(data.hires || [])
    } catch {
      // Use demo data
    } finally {
      setLoading(false)
    }
  }

  async function fetchRisk() {
    try {
      const res = await fetch('/api/v1/risk?userId=demo-user')
      const data = await res.json()
      setRiskData(data)
    } catch {}
  }

  async function handleCreateHire(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/v1/hires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHire)
      })
      const data = await res.json()
      if (data.hire) {
        setHires(prev => [data.hire, ...prev])
        if (data.token) {
          setGeneratedLinks(prev => ({ ...prev, [data.hire.id]: `/onboard/${data.token}` }))
        }
        setShowNewHireForm(false)
        setNewHire({ fullName: '', email: '', startDate: '', workState: '', position: '', department: '', userId: 'demo-user' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  function copyLink(hireId: string) {
    const link = generatedLinks[hireId] || `/onboard/demo`
    const fullUrl = `${window.location.origin}${link}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedLink(hireId)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const totalExposure = riskData?.totalExposure || hires.filter(h => h.status !== 'cleared').reduce((sum, h) => sum + (h.risk_exposure_dollars || 0), 0)
  const atRisk = hires.filter(h => h.status !== 'cleared').length
  const cleared = hires.filter(h => h.status === 'cleared').length

  return (
    <div className="bg-white min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-7 h-7 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">HireProof</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900">Docs</Link>
              <button
                onClick={() => setShowNewHireForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Hire
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Risk Exposure</span>
            </div>
            <div className="text-2xl font-bold text-red-600">${totalExposure.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">{atRisk} hire{atRisk !== 1 ? 's' : ''} not cleared</div>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm text-gray-600">Total Hires</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{hires.length}</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Cleared</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{cleared}</div>
            <div className="text-xs text-gray-500 mt-1">100% complete</div>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-gray-600">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-amber-600">{atRisk}</div>
            <div className="text-xs text-gray-500 mt-1">Need attention</div>
          </div>
        </div>

        {/* Risk breakdown */}
        {riskData?.stateBreakdown && Object.keys(riskData.stateBreakdown).length > 0 && (
          <div className="border border-red-200 bg-red-50 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="font-semibold text-red-900">Compliance Risk Exposure by State</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(riskData.stateBreakdown).map(([state, amount]: [string, any]) => (
                <div key={state} className="bg-white border border-red-200 rounded-lg px-4 py-2">
                  <span className="font-bold text-gray-900">{state}</span>
                  <span className="text-red-600 ml-2 font-medium">${(amount as number).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hires table */}
        <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">New Hires</h2>
            <button
              onClick={() => setShowNewHireForm(true)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add hire
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading...</div>
          ) : hires.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="font-semibold text-gray-900 mb-2">No hires yet</h3>
              <p className="text-gray-600 text-sm mb-4">Create your first hire to generate a compliance checklist.</p>
              <button onClick={() => setShowNewHireForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Add first hire
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">State</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hires.map(hire => {
                    const statusCfg = STATUS_CONFIG[hire.status] || STATUS_CONFIG.pending
                    const StatusIcon = statusCfg.icon
                    return (
                      <tr key={hire.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{hire.full_name}</div>
                          <div className="text-sm text-gray-500">{hire.email}</div>
                          <div className="text-xs text-gray-400">{hire.position}{hire.department ? ` · ${hire.department}` : ''}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">{hire.work_state}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{hire.start_date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                              <div
                                className={`h-2 rounded-full transition-all ${hire.compliance_score === 100 ? 'bg-green-500' : hire.compliance_score > 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                style={{ width: `${hire.compliance_score || 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 whitespace-nowrap">{hire.compliance_score || 0}%</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">{hire.completed_requirements || 0}/{hire.total_requirements || '—'} items</div>
                        </td>
                        <td className="px-6 py-4">
                          {hire.status === 'cleared' ? (
                            <span className="text-green-600 text-sm font-medium">$0</span>
                          ) : (
                            <span className="text-red-600 text-sm font-medium">${(hire.risk_exposure_dollars || 0).toLocaleString()}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyLink(hire.id)}
                              className="flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-600 border border-gray-200 px-2 py-1.5 rounded-lg hover:border-indigo-300 transition-colors"
                              title="Copy onboarding link"
                            >
                              {copiedLink === hire.id ? <CheckCircle className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                              {copiedLink === hire.id ? 'Copied!' : 'Copy link'}
                            </button>
                            <Link
                              href={generatedLinks[hire.id] || '/onboard/demo'}
                              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                              target="_blank"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/api/v1/states" target="_blank" className="border border-gray-200 rounded-xl p-4 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">View all state requirements</div>
              <div className="text-xs text-gray-500">All 50 states + DC JSON</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
          <Link href="/api/v1/risk?userId=demo-user" target="_blank" className="border border-gray-200 rounded-xl p-4 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">Risk exposure API</div>
              <div className="text-xs text-gray-500">Live risk calculation endpoint</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
          <Link href="/docs" className="border border-gray-200 rounded-xl p-4 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">API documentation</div>
              <div className="text-xs text-gray-500">Integrate with your HRIS</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
        </div>
      </div>

      {/* New Hire Modal */}
      {showNewHireForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Add New Hire</h2>
              <button onClick={() => setShowNewHireForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleCreateHire} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newHire.fullName}
                    onChange={e => setNewHire(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newHire.email}
                    onChange={e => setNewHire(p => ({ ...p, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newHire.startDate}
                    onChange={e => setNewHire(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work State *</label>
                  <select
                    required
                    value={newHire.workState}
                    onChange={e => setNewHire(p => ({ ...p, workState: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select state...</option>
                    {US_STATES.map(s => (
                      <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  <input
                    type="text"
                    required
                    value={newHire.position}
                    onChange={e => setNewHire(p => ({ ...p, position: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newHire.department}
                    onChange={e => setNewHire(p => ({ ...p, department: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Engineering"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewHireForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium text-sm disabled:opacity-50 transition-colors">
                  {submitting ? 'Creating...' : 'Create Hire & Generate Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
