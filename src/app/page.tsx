import Link from 'next/link'
import { Shield, AlertTriangle, CheckCircle, ArrowRight, Star, MapPin, DollarSign, FileText, Lock, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-7 h-7 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">HireProof</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 text-sm">Features</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 text-sm">Docs</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">Dashboard</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
              <Link href="/pricing" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            One missing I-9 form = $2,701 fine. Are you protected?
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Never Start a Hire<br />
            <span className="text-indigo-600">Out of Compliance.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            HireProof auto-generates state-specific compliance checklists and blocks "Cleared to Start" until every federal and state requirement is 100% complete.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors">
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/onboard/demo" className="border border-gray-200 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors">
              See demo flow
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '$272–$2,701', label: 'Per I-9 violation (first offense)', icon: '⚠️' },
            { value: '50 States', label: 'Real compliance laws built-in', icon: '🗺️' },
            { value: '100%', label: 'Required before Day 1', icon: '✅' },
            { value: '$0', label: 'Penalties when done right', icon: '🛡️' },
          ].map(stat => (
            <div key={stat.label} className="text-center p-6 border border-gray-200 rounded-xl shadow-sm">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pain points */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">The compliance nightmare HR teams face daily</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Manual onboarding checklists miss state-specific requirements. One audit can cost you thousands.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Manual checklists fail',
                description: "Paper checklists and email threads miss requirements. California alone has 8+ mandatory new hire documents. Texas has unique workers' comp laws. How do you track all 50 states?"
              },
              {
                icon: '💰',
                title: 'The fine exposure is real',
                description: "I-9 violations: $272–$2,701 per form. California Wage Theft Prevention: up to $4,000 per employee. New York WTPA violations: $50/day. Each hire without proper docs is a liability."
              },
              {
                icon: '⏰',
                title: 'Deadlines are unforgiving',
                description: "I-9 must be completed within 3 business days. CA DE-4 due before first paycheck. IL BIPA consent before any biometric collection. Missing deadlines = automatic violations."
              }
            ].map(item => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">How HireProof works</h2>
        <p className="text-gray-600 text-center mb-12">Four steps from hire to fully compliant</p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Create the hire', description: 'Enter name, email, start date, work state, and position. Takes 30 seconds.' },
            { step: '02', title: 'Auto-generate checklist', description: 'HireProof instantly generates the complete federal + state compliance checklist with deadlines and penalty amounts.' },
            { step: '03', title: 'New hire completes gated flow', description: 'Employee receives a secure link. Each step unlocks only after the previous is done. No skipping ahead.' },
            { step: '04', title: 'Cleared to start', description: 'Only after 100% completion does the status change to CLEARED. You see it in real-time on your dashboard.' },
          ].map(item => (
            <div key={item.step} className="relative">
              <div className="bg-indigo-50 text-indigo-700 font-bold text-sm w-10 h-10 rounded-full flex items-center justify-center mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Risk calculator */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">What&apos;s your compliance exposure?</h2>
          <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
            A company with 50 employees across California, New York, and Texas has potential penalty exposure over $500,000 for incomplete new hire documentation.
          </p>
          <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">$4,000</div>
                <div className="text-sm text-gray-600">Max CA WTPA fine per employee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">$27,018</div>
                <div className="text-sm text-gray-600">Max I-9 fine (repeat offense)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">$10,000</div>
                <div className="text-sm text-gray-600">IL BIPA fine per reckless violation</div>
              </div>
            </div>
            <Link href="/dashboard" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors">
              Calculate my exposure → Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Trusted by HR teams across the US</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "We had an I-9 audit after our Series A. HireProof caught that 3 employees in California were missing the DE-4 form. Saved us from a $12,000 fine.",
              name: "Jennifer Walsh",
              role: "Head of People, Series B SaaS startup",
              stars: 5
            },
            {
              quote: "The gated onboarding flow is brilliant. New hires can't say 'I didn't see that form.' Every step is timestamped and signed. Attorneys love it.",
              name: "Marcus Thompson",
              role: "VP HR, 150-person manufacturing company",
              stars: 5
            },
            {
              quote: "We hire in 12 states. Before HireProof we had a Google Sheet. Now we have real compliance with actual statute citations. The risk dashboard alone is worth it.",
              name: "Priya Sharma",
              role: "HR Director, regional retailer",
              stars: 5
            }
          ].map(t => (
            <div key={t.name} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex mb-4">
                {Array(t.stars).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                <div className="text-gray-500 text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Start protecting your company today</h2>
          <p className="text-gray-600 mb-8">Join hundreds of HR teams who use HireProof to ensure every new hire is 100% compliant before Day 1.</p>
          <Link href="/pricing" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition-colors">
            View pricing <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-500 text-sm mt-4">No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-gray-900">HireProof</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/features" className="hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
              <Link href="/docs" className="hover:text-gray-900">Docs</Link>
              <Link href="/api/mcp" className="hover:text-gray-900">API</Link>
            </div>
            <p className="text-sm text-gray-500">© 2024 HireProof. Not legal advice. Consult an employment attorney.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
