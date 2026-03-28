'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Upload,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Zap,
  CheckCircle2,
  Chrome,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const steps = [
  {
    id: 1,
    icon: Chrome,
    title: 'Connect Google Classroom',
    description: 'Securely sync your courses, assignments, and deadlines in one click.',
  },
  {
    id: 2,
    icon: Upload,
    title: 'Upload Study Materials',
    description: 'Add your syllabus PDFs, lecture notes, and previous year papers.',
  },
  {
    id: 3,
    icon: LayoutDashboard,
    title: 'Get Your Dashboard',
    description: 'Receive your personalized AI study plan and insights instantly.',
  },
]

const trustBadges = [
  { icon: ShieldCheck, label: 'Secure Google Sync', desc: 'OAuth 2.0 protected' },
  { icon: Users, label: 'Student-focused', desc: 'Built for academics' },
  { icon: Zap, label: 'AI-Powered', desc: 'Smart study insights' },
]

export default function OnboardingPage() {
  const [clicked, setClicked] = useState(false)

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
            Demo Mode
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
                  Connect your Google account to sync Google Classroom and unlock your personalized AI academic assistant.
                </p>
              </div>

              {/* Google sign in button */}
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-3 h-12 text-sm font-medium border-2 hover:bg-accent rounded-2xl"
                onClick={() => setClicked(true)}
                asChild={clicked ? true : undefined}
              >
                {clicked ? (
                  <Link href="/dashboard" className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    Signed in - Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Link>
                ) : (
                  <>
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By continuing, you agree to our{' '}
                <a href="#" className="underline hover:text-foreground">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
              </p>

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
