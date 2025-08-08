import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft, Rocket, Users, TrendingUp, Lightbulb, Star, Zap } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left Side - Branding & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-16 left-16 w-28 h-28 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-48 right-24 w-20 h-20 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-24 w-24 h-24 bg-white/10 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-80 left-1/2 w-16 h-16 bg-white/10 rounded-full animate-float" style={{animationDelay: '5s'}}></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 py-20 text-white">
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">INverge</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Join the future of startup networking
            </h1>
            <p className="text-xl text-purple-100 mb-12 leading-relaxed">
              Connect with 50,000+ founders, investors, and innovators building the next big thing.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Quality Network</h3>
                <p className="text-purple-100">Connect with verified founders, VCs, and startup talent</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Growth Tools</h3>
                <p className="text-purple-100">Access resources, templates, and insights to scale faster</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
                <p className="text-purple-100">Learn from successful entrepreneurs and industry experts</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Exclusive Events</h3>
                <p className="text-purple-100">Join virtual and in-person networking events worldwide</p>
              </div>
            </div>
          </div>
          
          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-white font-medium">4.9/5</span>
            </div>
            <p className="text-purple-100 text-sm">
              &quot;INverge helped me find my co-founder and secure our Series A. Game changer!&quot; 
              <span className="block mt-1 font-medium">- Sarah Chen, CEO of TechFlow</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                INverge
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join the network</h1>
            <p className="text-gray-600">Start building meaningful startup connections</p>
          </div>
          
          {/* Back to Home Link */}
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
          
          {/* Clerk Sign Up Component */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <SignUp 
              afterSignUpUrl="/onboarding"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "bg-transparent shadow-none",
                  headerTitle: "text-2xl font-bold text-gray-900 hidden lg:block",
                  headerSubtitle: "text-gray-600 hidden lg:block",
                  socialButtonsBlockButton: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm",
                  socialButtonsBlockButtonText: "font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-sm",
                  formFieldLabel: "text-gray-700 font-medium",
                  formFieldInput: "border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]",
                  footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                  identityPreviewText: "text-gray-700",
                  identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                }
              }}
            />
          </div>
          
          {/* Sign In Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/sign-in" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
          
          {/* Terms */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              By signing up, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}