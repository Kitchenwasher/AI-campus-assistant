"use client"

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  ArrowRight,
  BookOpen,
  Upload,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const steps = [
  {
    id: 1,
    title: 'Create Account',
    description: 'Securely sync your courses, assignments, and deadlines in one click.',
    icon: ShieldCheck
  },
  {
    id: 2,
    title: 'Upload Study Materials',
    description: 'Add your syllabus PDFs, lecture notes, and previous year papers.',
    icon: Upload
  },
  {
    id: 3,
    title: 'Get Your Dashboard',
    description: 'Receive your personalized AI study plan and insights instantly.',
    icon: LayoutDashboard
  },
]

const trustBadges = [
  { icon: ShieldCheck, label: 'Secure Login', desc: 'Encrypted storage' },
  { icon: Users, label: 'Student-focused', desc: 'Built for academics' },
  { icon: Zap, label: 'AI-Powered', desc: 'Smart study insights' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  // Sign Up State
  const [signUpName, setSignUpName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const res = await signIn("credentials", {
      redirect: false,
      email: signInEmail,
      password: signInPassword,
    })

    if (res?.error) {
      setError(res.error)
      setIsLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signUpName, email: signUpEmail, password: signUpPassword })
      })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      // Automatically sign in after creating account
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: signUpEmail,
        password: signUpPassword,
      })

      if (signInRes?.error) {
        setError(signInRes.error)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#c4d8c0] dark:bg-[#8aa886]">
      <div className="min-h-screen bg-background flex flex-col m-3 md:m-4 rounded-3xl overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card">
              <span className="text-lg font-black text-foreground">N</span>
            </div>
            <div className="leading-none">
              <span className="text-sm font-bold text-foreground">CampusMind</span>
              <span className="text-sm font-bold text-primary"> AI</span>
            </div>
          </Link>
          <Badge variant="secondary" className="text-xs border border-primary/20 bg-primary/10 text-primary rounded-full">
            Beta Access
          </Badge>
        </header>

        {/* Main */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">

            {/* Left: Sign in card */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-4 rounded-full">Get started for free</Badge>
                <h1 className="text-3xl font-black text-foreground text-balance mb-3 tracking-tight">
                  Your smart study hub starts here.
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  Log in or create a new account to unlock your personalized AI academic assistant.
                </p>
              </div>

              {/* Auth Forms */}
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Create Account</TabsTrigger>
                </TabsList>

                {error && (
                  <div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                    {error}
                  </div>
                )}

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input 
                        id="signin-email" 
                        type="email" 
                        required 
                        placeholder="student@university.edu"
                        value={signInEmail}
                        onChange={e => setSignInEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input 
                        id="signin-password" 
                        type="password" 
                        required 
                        value={signInPassword}
                        onChange={e => setSignInPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In to Dashboard"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input 
                        id="signup-name" 
                        type="text" 
                        required 
                        placeholder="John Doe"
                        value={signUpName}
                        onChange={e => setSignUpName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        required 
                        placeholder="student@university.edu"
                        value={signUpEmail}
                        onChange={e => setSignUpEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        required 
                        value={signUpPassword}
                        onChange={e => setSignUpPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center"
                  >
                    <badge.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-foreground leading-tight">{badge.label}</p>
                      <p className="text-xs text-muted-foreground">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Onboarding steps */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                How it works
              </p>
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-4 rounded-3xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary">STEP {step.id}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">100% free for students</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      CampusMind AI is completely free to use. No subscription required.
                      Your data stays private and is never shared.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
