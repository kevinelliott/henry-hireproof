import { Suspense } from 'react'
import OnboardingClient from './OnboardingClient'

interface PageProps {
  params: { token: string }
}

export default function OnboardPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your onboarding...</p>
        </div>
      </div>
    }>
      <OnboardingClient token={params.token} />
    </Suspense>
  )
}
