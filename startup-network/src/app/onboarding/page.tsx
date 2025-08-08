import { UserButton } from '@clerk/nextjs'
import { Rocket, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              INverge
            </span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to INverge! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            You&apos;re now part of an exclusive network of startup founders, investors, and innovators. 
            Let&apos;s get you set up for success.
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            What&apos;s Next?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Your Profile</h3>
              <p className="text-gray-600">
                Tell us about your startup, experience, and what you&apos;re looking for to get better connections.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start Networking</h3>
              <p className="text-gray-600">
                Discover and connect with founders in your industry, stage, and location.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg font-medium"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <p className="text-gray-500 mt-4 text-sm">
              You can always complete your profile later from your dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}