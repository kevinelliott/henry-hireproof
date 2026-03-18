import Link from 'next/link'
import { Shield, Check, ArrowRight, X } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-7 h-7 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">HireProof</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-600 text-lg">One I-9 fine costs more than a year of HireProof. It pays for itself on the first hire.</p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              name: 'Starter',
              price: 29,
              description: 'For small teams getting started with compliance',
              features: [
                '10 hires per month',
                '5 states included',
                'Federal compliance checklist',
                'Gated onboarding flow',
                'Digital signatures',
                'Email support',
              ],
              notIncluded: ['50-state coverage', 'Document generation', 'API access'],
              cta: 'Start free trial',
              href: '/dashboard',
              popular: false
            },
            {
              name: 'Growth',
              price: 79,
              description: 'For growing companies hiring across multiple states',
              features: [
                '50 hires per month',
                'All 50 states + DC',
                'Full compliance engine',
                'Document generation',
                'Offer letter templates',
                'Risk exposure dashboard',
                'Priority support',
                'Audit trail export',
              ],
              notIncluded: ['Unlimited hires', 'Custom policies', 'SSO'],
              cta: 'Start free trial',
              href: '/dashboard',
              popular: true
            },
            {
              name: 'Enterprise',
              price: 149,
              description: 'For larger organizations with complex needs',
              features: [
                'Unlimited hires',
                'All 50 states + DC',
                'Custom company policies',
                'API access (MCP server)',
                'SSO integration',
                'Dedicated support',
                'Compliance audit export',
                'Custom onboarding branding',
                'SLA guarantee',
              ],
              notIncluded: [],
              cta: 'Contact sales',
              href: '/dashboard',
              popular: false
            }
          ].map(plan => (
            <div key={plan.name} className={`relative border rounded-2xl p-8 shadow-sm ${plan.popular ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 bg-white'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full">Most popular</span>
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <Link href={plan.href} className={`block w-full text-center py-3 rounded-lg font-semibold mb-8 transition-colors ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border border-gray-200 text-gray-900 hover:bg-gray-50'}`}>
                {plan.cta}
              </Link>
              <ul className="space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="text-gray-700">{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm opacity-40">
                    <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Competitor comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Why HireProof vs. full HRIS platforms</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">BambooHR, Rippling, and Gusto are full HR platforms. You pay for time tracking, payroll, and benefits you may not need. HireProof is focused on one thing: compliance.</p>
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-indigo-600">HireProof</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">BambooHR</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Rippling</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Gusto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Price per employee/month', '$1.58–$14.90', '~$8', '~$8', '~$6'],
                  ['50-state compliance engine', '✅ Built-in', '⚠️ Basic', '⚠️ Basic', '⚠️ Basic'],
                  ['Real statute citations', '✅ All requirements', '❌', '❌', '❌'],
                  ['Gated onboarding flow', '✅ Sequential steps', '⚠️ Static forms', '⚠️ Static forms', '⚠️ Static forms'],
                  ['Penalty risk dashboard', '✅ Real dollar amounts', '❌', '❌', '❌'],
                  ['State-specific notices', '✅ All 50 states', '⚠️ Limited', '⚠️ Limited', '⚠️ Limited'],
                  ['Setup complexity', '✅ 5 minutes', '❌ Weeks', '❌ Weeks', '❌ Days'],
                  ['Works alongside payroll', '✅ Yes', '✅ Is payroll', '✅ Is payroll', '✅ Is payroll'],
                ].map(row => (
                  <tr key={row[0]} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row[0]}</td>
                    <td className="px-6 py-4 text-sm text-center text-indigo-600 font-medium">{row[1]}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">{row[2]}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">{row[3]}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Do I need this if I use BambooHR or Gusto?', a: 'Yes. HRIS platforms handle payroll and benefits, but they don\'t provide comprehensive state-specific compliance documentation with penalty citations. HireProof works alongside your existing HRIS.' },
              { q: 'Is the compliance data actually accurate?', a: 'All requirements are sourced from actual state statutes and federal regulations with citation references. We update the database when laws change. Always consult an employment attorney for your specific situation.' },
              { q: 'What happens if a hire doesn\'t complete their onboarding?', a: 'Their status stays "BLOCKED" on your dashboard. They literally cannot be marked as cleared to start. You get visibility into exactly which steps are incomplete and what the penalty exposure is.' },
              { q: 'Can I add custom policies?', a: 'Growth and Enterprise plans let you add company-specific policy acknowledgments to the onboarding flow. Enterprise plans support fully custom policy documents.' },
              { q: 'Does this work for remote employees in different states?', a: 'Yes. Compliance is based on the employee\'s work state, not where your company is headquartered. A remote employee in California gets California\'s compliance requirements even if you\'re based in Texas.' },
              { q: 'Is digital signature legally valid?', a: 'Yes. Digital signatures on acknowledgment forms are valid under the E-SIGN Act (15 U.S.C. §7001) and UETA. HireProof captures IP address, timestamp, and typed name confirmation for each signature.' },
            ].map(item => (
              <div key={item.q} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
