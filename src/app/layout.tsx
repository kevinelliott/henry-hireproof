import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HireProof — New Hire Compliance Gatekeeper',
  description: 'Ensure every new hire completes all federal and state compliance requirements before Day 1. Block "Cleared to Start" until 100% complete.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{children}</body>
    </html>
  )
}
