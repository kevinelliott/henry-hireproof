'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, Lock, CheckCircle, ChevronRight, AlertTriangle, FileText, User, CreditCard, MapPin, BookOpen, PenTool } from 'lucide-react'

interface OnboardingData {
  hire: {
    id: string
    full_name: string
    email: string
    start_date: string
    work_state: string
    position: string
    department?: string
    status: string
  }
  token: {
    token: string
    current_step: number
    max_step: number
    expires_at: string
  }
  currentStep: number
  maxStep: number
  complianceItems: any[]
  stateNotes: string[]
}

const STEPS = [
  { id: 1, title: 'Personal Information', icon: User, description: 'Legal name, address, emergency contact' },
  { id: 2, title: 'Tax Forms', icon: CreditCard, description: 'Federal W-4 and state withholding' },
  { id: 3, title: 'Employment Verification', icon: FileText, description: 'I-9 Section 1 and identity documents' },
  { id: 4, title: 'State-Specific Notices', icon: MapPin, description: 'Required state compliance notices' },
  { id: 5, title: 'Company Policies', icon: BookOpen, description: 'Handbook and workplace policies' },
  { id: 6, title: 'Digital Signature', icon: PenTool, description: 'Final signature and confirmation' },
]

const STATE_WITHHOLDING_FORMS: Record<string, string> = {
  CA: 'DE-4 (California Employee\'s Withholding Allowance Certificate)',
  NY: 'IT-2104 (Employee\'s Withholding Allowance Certificate)',
  IL: 'IL-W-4 (Employee\'s Illinois Withholding Allowance Certificate)',
  NJ: 'NJ-W4 (Employee\'s Withholding Certificate)',
  MA: 'M-4 (Employee\'s Massachusetts Withholding Exemption Certificate)',
  CO: 'DR 0004 (Colorado Employee Withholding Certificate)',
  OR: 'OR-W-4 (Oregon Employee\'s Withholding Statement)',
  WA: 'No state income tax — no form needed',
  TX: 'No state income tax — no form needed',
  FL: 'No state income tax — no form needed',
  NV: 'No state income tax — no form needed',
  SD: 'No state income tax — no form needed',
  TN: 'No state income tax on wages — no form needed',
  WY: 'No state income tax — no form needed',
}

export default function OnboardingClient({ token }: { token: string }) {
  const [data, setData] = useState<OnboardingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [stepData, setStepData] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Step form states
  const [personalInfo, setPersonalInfo] = useState({ legalName: '', address: '', city: '', state: '', zip: '', dob: '', ssn: '', emergencyName: '', emergencyPhone: '', emergencyRelation: '' })
  const [taxInfo, setTaxInfo] = useState({ w4FilingStatus: 'single', w4Allowances: '0', stateFormCompleted: false, directDeposit: false, bankRouting: '', bankAccount: '' })
  const [i9Info, setI9Info] = useState({ section1Completed: false, documentType: '', documentNumber: '', documentExpiry: '', citizenship: 'citizen' })
  const [stateAcks, setStateAcks] = useState<Record<string, { checked: boolean; typedName: string; timestamp: string }>>({})
  const [policyAcks, setPolicyAcks] = useState({ handbook: false, antiHarassment: false, osha: false, typedName: '' })
  const [signature, setSignature] = useState({ typedName: '', confirmed: false, canvas: false })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    fetchOnboarding()
  }, [token])

  async function fetchOnboarding() {
    try {
      const res = await fetch(`/api/v1/onboard?token=${token}`)
      const d = await res.json()
      if (d.hire) {
        setData(d)
        const step = d.currentStep || 1
        setCurrentStep(step)
        // Mark previous steps as completed
        const prev = Array.from({ length: step - 1 }, (_, i) => i + 1)
        setCompletedSteps(prev)
      }
    } catch {}
    setLoading(false)
  }

  // Canvas drawing
  function startDraw(e: React.MouseEvent<HTMLCanvasElement>) {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1e293b'
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
    setHasSignature(true)
  }

  function stopDraw() { setIsDrawing(false) }

  function clearCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  async function submitStep(step: number) {
    setSubmitting(true)
    try {
      const sigs = []
      if (step === 6 && hasSignature) {
        const canvas = canvasRef.current
        sigs.push({
          type: 'canvas',
          data: canvas?.toDataURL() || '',
          typedName: signature.typedName,
          documentName: 'Final Employment Agreement'
        })
      }

      await fetch('/api/v1/onboard', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, step, formData: stepData[step], signatures: sigs })
      })

      setCompletedSteps(prev => [...prev, step])
      if (step >= 6) {
        setCompleted(true)
      } else {
        setCurrentStep(step + 1)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  // Initialize state acknowledgments when data loads
  useEffect(() => {
    if (data?.complianceItems?.length) {
      const stateItems = data.complianceItems.filter(i => i.category === 'state' && i.gate_order === 4)
      const initial: Record<string, any> = {}
      stateItems.forEach((item: any) => {
        initial[item.requirement_id] = { checked: false, typedName: '', timestamp: '' }
      })
      setStateAcks(initial)
    }
  }, [data])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your onboarding portal...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link not found</h1>
          <p className="text-gray-600">This onboarding link is invalid or has expired. Please contact your HR team for a new link.</p>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">You&apos;re cleared to start!</h1>
          <p className="text-gray-600 text-lg mb-4">
            Congratulations, {data.hire.full_name}. You&apos;ve completed all required federal and {data.hire.work_state} state compliance documentation.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="text-green-700 font-semibold mb-1">Start Date</div>
            <div className="text-2xl font-bold text-green-900">{data.hire.start_date}</div>
          </div>
          <p className="text-sm text-gray-500">Your HR team has been notified. A copy of all signed documents will be provided by your employer.</p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">Verified by HireProof</span>
          </div>
        </div>
      </div>
    )
  }

  const { hire } = data
  const progress = ((completedSteps.length / 6) * 100).toFixed(0)
  const stateWithholding = STATE_WITHHOLDING_FORMS[hire.work_state] || `${hire.work_state} State Income Tax Withholding Form`

  const isStepLocked = (stepId: number) => stepId > currentStep
  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId)

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-gray-900">HireProof</span>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-medium text-gray-900">{hire.full_name}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{completedSteps.length}/6 steps</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Step sidebar */}
          <div className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-28">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Onboarding Steps</h2>
              <div className="space-y-1">
                {STEPS.map(step => {
                  const StepIcon = step.icon
                  const isLocked = isStepLocked(step.id)
                  const isComplete = isStepCompleted(step.id)
                  const isCurrent = step.id === currentStep

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-sm transition-colors ${
                        isCurrent ? 'bg-indigo-50 text-indigo-700' :
                        isComplete ? 'text-gray-700' :
                        'text-gray-400'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isComplete ? 'bg-green-100' :
                        isCurrent ? 'bg-indigo-100' :
                        'bg-gray-100'
                      }`}>
                        {isComplete ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : isLocked ? (
                          <Lock className="w-3 h-3 text-gray-400" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium leading-tight">{step.title}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Position info */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-indigo-700 font-medium">{hire.position}{hire.department ? ` · ${hire.department}` : ''}</div>
                  <div className="text-xs text-indigo-600 mt-0.5">Start date: {hire.start_date} · Work state: {hire.work_state}</div>
                </div>
                <div className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {hire.work_state} Compliance Package
                </div>
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Personal Information</h1>
                    <p className="text-sm text-gray-600">Required for employment records and emergency contact</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Legal Full Name *</label>
                    <input type="text" value={personalInfo.legalName} onChange={e => setPersonalInfo(p => ({ ...p, legalName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="As it appears on your government-issued ID" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                    <input type="text" value={personalInfo.address} onChange={e => setPersonalInfo(p => ({ ...p, address: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="123 Main Street, Apt 4" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input type="text" value={personalInfo.city} onChange={e => setPersonalInfo(p => ({ ...p, city: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input type="text" value={personalInfo.state} onChange={e => setPersonalInfo(p => ({ ...p, state: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="CA" maxLength={2} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP *</label>
                      <input type="text" value={personalInfo.zip} onChange={e => setPersonalInfo(p => ({ ...p, zip: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="90210" maxLength={5} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                      <input type="date" value={personalInfo.dob} onChange={e => setPersonalInfo(p => ({ ...p, dob: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SSN (last 4 digits for verification) *</label>
                      <input type="text" value={personalInfo.ssn} onChange={e => setPersonalInfo(p => ({ ...p, ssn: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="XXX-XX-####" maxLength={11} />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Emergency Contact</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input type="text" value={personalInfo.emergencyName} onChange={e => setPersonalInfo(p => ({ ...p, emergencyName: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                        <input type="text" value={personalInfo.emergencyRelation} onChange={e => setPersonalInfo(p => ({ ...p, emergencyRelation: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Spouse, Parent, etc." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input type="tel" value={personalInfo.emergencyPhone} onChange={e => setPersonalInfo(p => ({ ...p, emergencyPhone: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => submitStep(1)}
                  disabled={!personalInfo.legalName || !personalInfo.address || submitting}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? 'Saving...' : 'Continue to Tax Forms'} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Tax Forms */}
            {currentStep === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Tax Forms</h1>
                    <p className="text-sm text-gray-600">Federal W-4 and state withholding must be completed before your first paycheck</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">FEDERAL</span>
                      <h3 className="font-semibold text-gray-900">W-4: Employee's Withholding Certificate</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Required by IRS. Determines how much federal income tax is withheld from your paycheck. Deadline: before your first paycheck. <em>Citation: IRC §3402; IRS Pub. 15-T</em></p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filing Status</label>
                        <select value={taxInfo.w4FilingStatus} onChange={e => setTaxInfo(p => ({ ...p, w4FilingStatus: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option value="single">Single or Married Filing Separately</option>
                          <option value="married">Married Filing Jointly or Qualifying Surviving Spouse</option>
                          <option value="head">Head of Household</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Withholding ($)</label>
                        <input type="number" min="0" value={taxInfo.w4Allowances}
                          onChange={e => setTaxInfo(p => ({ ...p, w4Allowances: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="0" />
                      </div>
                    </div>
                  </div>

                  {stateWithholding && !stateWithholding.includes('No state income tax') && (
                    <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded">{hire.work_state} STATE</span>
                        <h3 className="font-semibold text-gray-900">State Withholding Form</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{stateWithholding}</p>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={taxInfo.stateFormCompleted}
                          onChange={e => setTaxInfo(p => ({ ...p, stateFormCompleted: e.target.checked }))}
                          className="mt-0.5 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                        <span className="text-sm text-gray-700">I acknowledge that I have completed or will complete the {hire.work_state} state withholding form and understand my state tax withholding rights.</span>
                      </label>
                    </div>
                  )}

                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3">Direct Deposit Authorization (Optional)</h3>
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input type="checkbox" checked={taxInfo.directDeposit}
                        onChange={e => setTaxInfo(p => ({ ...p, directDeposit: e.target.checked }))}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                      <span className="text-sm text-gray-700">I authorize direct deposit to my bank account</span>
                    </label>
                    {taxInfo.directDeposit && (
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bank Routing Number</label>
                          <input type="text" value={taxInfo.bankRouting}
                            onChange={e => setTaxInfo(p => ({ ...p, bankRouting: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="9 digits" maxLength={9} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                          <input type="text" value={taxInfo.bankAccount}
                            onChange={e => setTaxInfo(p => ({ ...p, bankAccount: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button onClick={() => submitStep(2)} disabled={submitting}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {submitting ? 'Saving...' : 'Continue to Employment Verification'} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 3: I-9 */}
            {currentStep === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Employment Verification (I-9)</h1>
                    <p className="text-sm text-gray-600">Required by federal law — must complete Section 1 on or before your first day of work</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <strong>Legal Requirement:</strong> Failure to complete I-9 correctly can result in fines of $272–$2,701 per form (first offense) or $2,701–$27,018 for repeat violations. <em>Citation: INA §274A; 8 U.S.C. §1324a</em>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">I-9 Section 1 — Employee Attestation</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Citizenship/Immigration Status</label>
                      <div className="space-y-2">
                        {[
                          { value: 'citizen', label: 'A citizen of the United States' },
                          { value: 'national', label: 'A noncitizen national of the United States' },
                          { value: 'permanent_resident', label: 'A lawful permanent resident (Alien Registration No./USCIS No.)' },
                          { value: 'authorized', label: 'An alien authorized to work (with expiration date)' },
                        ].map(opt => (
                          <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="citizenship" value={opt.value}
                              checked={i9Info.citizenship === opt.value}
                              onChange={() => setI9Info(p => ({ ...p, citizenship: opt.value }))}
                              className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm text-gray-700">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={i9Info.section1Completed}
                        onChange={e => setI9Info(p => ({ ...p, section1Completed: e.target.checked }))}
                        className="mt-0.5 w-4 h-4 text-indigo-600 rounded" />
                      <span className="text-sm text-gray-700">
                        I attest, under penalty of perjury, that I am aware that federal law provides for imprisonment and/or fines for false statements or use of false documents in connection with the completion of this form. The information I have provided is true, correct, and complete to the best of my knowledge and belief.
                      </span>
                    </label>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3">Identity & Work Authorization Documents</h3>
                    <p className="text-sm text-gray-600 mb-4">You must present original documents to your employer within 3 business days of your start date. Select the document type you will provide:</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                      <select value={i9Info.documentType}
                        onChange={e => setI9Info(p => ({ ...p, documentType: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select document...</option>
                        <optgroup label="List A — Identity AND Work Authorization (one document)">
                          <option value="us_passport">U.S. Passport or U.S. Passport Card</option>
                          <option value="perm_resident_card">Permanent Resident Card (Form I-551)</option>
                          <option value="foreign_passport_visa">Foreign Passport with temporary I-551 stamp</option>
                          <option value="i94_passport">Foreign Passport with Form I-94 (nonimmigrant visa)</option>
                        </optgroup>
                        <optgroup label="List B — Identity Only (present with List C document)">
                          <option value="drivers_license">Driver's License or ID Card issued by U.S. state</option>
                          <option value="state_id">ID Card issued by federal, state, or local government</option>
                          <option value="military_id">U.S. Military Card or draft record</option>
                        </optgroup>
                        <optgroup label="List C — Work Authorization Only (present with List B document)">
                          <option value="ssn_card">Social Security Card</option>
                          <option value="birth_cert">Certified Copy of Birth Certificate</option>
                          <option value="work_auth">Employment Authorization Document (Form I-766)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                </div>

                <button onClick={() => submitStep(3)} disabled={!i9Info.section1Completed || submitting}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {submitting ? 'Saving...' : 'Continue to State Notices'} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 4: State Notices */}
            {currentStep === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{hire.work_state} State-Specific Notices</h1>
                    <p className="text-sm text-gray-600">You must individually acknowledge each state-required notice</p>
                  </div>
                </div>

                {data.stateNotes && data.stateNotes.length > 0 && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-semibold text-indigo-700 mb-2">Important notes for {hire.work_state} employees:</h3>
                    <ul className="space-y-1">
                      {data.stateNotes.map((note, i) => (
                        <li key={i} className="text-xs text-indigo-600 flex items-start gap-2">
                          <span className="mt-0.5">•</span><span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Show state compliance items or generic notices */}
                  {(data.complianceItems.filter((i: any) => i.category === 'state').length > 0
                    ? data.complianceItems.filter((i: any) => i.category === 'state')
                    : getDefaultStateNotices(hire.work_state)
                  ).map((item: any) => {
                    const ack = stateAcks[item.requirement_id || item.id] || { checked: false, typedName: '' }
                    const itemId = item.requirement_id || item.id
                    return (
                      <div key={itemId} className="border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{item.requirement_name || item.name}</h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ack.checked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {ack.checked ? 'Acknowledged' : 'Required'}
                          </span>
                        </div>
                        {(item.penalty_amount || item.penalty?.amount) && (
                          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3 text-xs text-red-700">
                            <strong>Penalty for non-compliance:</strong> {item.penalty_amount || item.penalty?.amount}
                            {(item.penalty_citation || item.penalty?.citation) && (
                              <span className="ml-1 text-red-500">({item.penalty_citation || item.penalty?.citation})</span>
                            )}
                          </div>
                        )}
                        <div className="mb-4">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={ack.checked}
                              onChange={e => {
                                setStateAcks(prev => ({
                                  ...prev,
                                  [itemId]: {
                                    ...prev[itemId],
                                    checked: e.target.checked,
                                    timestamp: e.target.checked ? new Date().toISOString() : ''
                                  }
                                }))
                              }}
                              className="mt-0.5 w-4 h-4 text-indigo-600 rounded" />
                            <span className="text-sm text-gray-700">I have read, understand, and acknowledge this notice.</span>
                          </label>
                        </div>
                        {ack.checked && (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Type your full legal name to confirm:</label>
                            <input type="text" value={ack.typedName}
                              onChange={e => setStateAcks(prev => ({ ...prev, [itemId]: { ...prev[itemId], typedName: e.target.value } }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Type your full legal name" />
                            {ack.timestamp && (
                              <div className="text-xs text-gray-400 mt-1">Acknowledged at {new Date(ack.timestamp).toLocaleString()}</div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={() => submitStep(4)}
                  disabled={submitting}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {submitting ? 'Saving...' : 'Continue to Company Policies'} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 5: Company Policies */}
            {currentStep === 5 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Company Policies</h1>
                    <p className="text-sm text-gray-600">Acknowledge all required company and federal policy requirements</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded">COMPANY POLICY</span>
                      <h3 className="font-semibold text-gray-900">Employee Handbook Acknowledgment</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">I acknowledge that I have received, read, and understand the Employee Handbook. I understand that the policies contained in the handbook are subject to change, and that employment is at-will (except as prohibited by state law).</p>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={policyAcks.handbook}
                        onChange={e => setPolicyAcks(p => ({ ...p, handbook: e.target.checked }))}
                        className="mt-0.5 w-4 h-4 text-indigo-600 rounded" />
                      <span className="text-sm text-gray-700">I acknowledge receipt and understanding of the Employee Handbook.</span>
                    </label>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">FEDERAL LAW</span>
                      <h3 className="font-semibold text-gray-900">Anti-Harassment & Discrimination Policy</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Coverage: Title VII, ADA, ADEA, and all applicable state anti-discrimination laws. Acknowledging this policy fulfills initial training requirement.</p>
                    <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3 text-xs text-red-700">
                      Employer liability under Title VII: uncapped compensatory and punitive damages. Citation: 42 U.S.C. §2000e
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={policyAcks.antiHarassment}
                        onChange={e => setPolicyAcks(p => ({ ...p, antiHarassment: e.target.checked }))}
                        className="mt-0.5 w-4 h-4 text-indigo-600 rounded" />
                      <span className="text-sm text-gray-700">I have received and read the Anti-Harassment and Non-Discrimination Policy. I understand my rights and responsibilities under this policy, including how to report violations.</span>
                    </label>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">FEDERAL LAW</span>
                      <h3 className="font-semibold text-gray-900">OSHA Workplace Safety Orientation</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Acknowledgment of OSHA workplace safety rights: right to safe working conditions, right to report hazards without retaliation, right to request OSHA inspection. Citation: OSH Act §17; 29 CFR §1910.1200</p>
                    <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 mb-3 text-xs text-orange-700">
                      OSHA penalty for willful violations: up to $16,131 per violation. Citation: 29 CFR §1910.1200
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={policyAcks.osha}
                        onChange={e => setPolicyAcks(p => ({ ...p, osha: e.target.checked }))}
                        className="mt-0.5 w-4 h-4 text-indigo-600 rounded" />
                      <span className="text-sm text-gray-700">I have received OSHA workplace safety information and understand my rights and responsibilities regarding workplace safety.</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type your full name to acknowledge all policies above:</label>
                  <input type="text" value={policyAcks.typedName}
                    onChange={e => setPolicyAcks(p => ({ ...p, typedName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Full legal name" />
                </div>

                <button
                  onClick={() => submitStep(5)}
                  disabled={!policyAcks.handbook || !policyAcks.antiHarassment || !policyAcks.osha || !policyAcks.typedName || submitting}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {submitting ? 'Saving...' : 'Continue to Final Signature'} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 6: Digital Signature */}
            {currentStep === 6 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Final Digital Signature</h1>
                    <p className="text-sm text-gray-600">Your signature locks and certifies all completed documents</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm text-gray-600">
                  By signing below, you confirm that all information provided in this onboarding process is true and accurate to the best of your knowledge, and that you have read and acknowledged all required federal and {hire.work_state} state compliance documents. This digital signature is valid under the E-SIGN Act (15 U.S.C. §7001) and UETA.
                </div>

                <div className="border border-gray-200 rounded-xl p-5 shadow-sm mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Draw your signature</h3>
                    <button onClick={clearCanvas} className="text-xs text-gray-500 hover:text-gray-700 underline">Clear</button>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={120}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair bg-white"
                    style={{ touchAction: 'none' }}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                  />
                  {!hasSignature && (
                    <p className="text-xs text-gray-400 text-center mt-2">Draw your signature above</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type your full legal name to confirm *</label>
                  <input type="text" value={signature.typedName}
                    onChange={e => setSignature(p => ({ ...p, typedName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={hire.full_name} />
                </div>

                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={signature.confirmed}
                      onChange={e => setSignature(p => ({ ...p, confirmed: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 text-indigo-600 rounded" />
                    <span className="text-sm text-gray-700">
                      I, {signature.typedName || hire.full_name}, confirm that all information submitted in this onboarding is accurate and complete. I understand that false statements may result in immediate termination and potential legal liability.
                    </span>
                  </label>
                </div>

                <button
                  onClick={() => submitStep(6)}
                  disabled={!hasSignature || !signature.typedName || !signature.confirmed || submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {submitting ? 'Submitting...' : '✓ Complete Onboarding & Get Cleared'}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Shield className="w-4 h-4" />
                  Secured by HireProof · E-SIGN Act compliant · IP logged
                </div>
              </div>
            )}

            {/* Locked step message */}
            {isStepLocked(currentStep) && (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600">This step is locked</h2>
                <p className="text-gray-500 mt-2">Complete step {currentStep - 1} first to unlock this step.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getDefaultStateNotices(state: string) {
  return [
    {
      id: `${state}-notice-1`,
      requirement_id: `${state}-notice-1`,
      requirement_name: `${state} Wage and Employment Notice`,
      category: 'state',
      penalty_amount: 'Varies by violation',
      penalty_citation: `${state} Labor Code`
    },
    {
      id: `${state}-notice-2`,
      requirement_id: `${state}-notice-2`,
      requirement_name: `${state} Workers' Compensation Coverage Notice`,
      category: 'state',
      penalty_amount: 'Civil penalty; potential criminal liability',
      penalty_citation: `${state} Workers' Compensation Act`
    }
  ]
}
