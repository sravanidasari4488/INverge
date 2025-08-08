import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'INverge - Where Startups Connect & Grow',
  description: 'The professional network designed specifically for startup founders, entrepreneurs, and innovators.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={process.env.CLERK_SIGN_IN_URL || '/sign-in'}
      signUpUrl={process.env.CLERK_SIGN_UP_URL || '/sign-up'}
      afterSignInUrl={process.env.CLERK_AFTER_SIGN_IN_URL || '/dashboard'}
      afterSignUpUrl={process.env.CLERK_AFTER_SIGN_UP_URL || '/onboarding'}
    >
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}