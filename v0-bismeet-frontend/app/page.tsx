'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarClock,
  Youtube,
  Bot,
  FileText,
  CheckCircle2,
  Moon,
  Sun,
  Sparkles,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: CalendarClock,
    title: 'Google Classroom Sync',
    description:
      'Automatically pull assignments, quizzes, and deadlines from all your courses. Never miss a due date again.',
    accent: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Brain,
    title: 'PYQ Intelligence',
    description:
      'Analyze years of previous exam papers to surface the most frequently tested topics with confidence scores.',
    accent: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Youtube,
    title: 'Curriculum-Matched Videos',
    description:
      'Get YouTube recommendations aligned to your exact syllabus topics, filtered by exam relevance and quality.',
    accent: 'text-destructive',
    bg: 'bg-destructive/10',
  },
]

const steps = [
  {
    step: '01',
    title: 'Connect Google Classroom',
    description: 'Sign in with Google and sync all your courses, deadlines, and assignments automatically.',
    icon: BookOpen,
  },
  {
    step: '02',
    title: 'Upload Your Study Material',
    description: 'Drop in your syllabus PDFs, lecture notes, and previous year question papers.',
    icon: FileText,
  },
  {
    step: '03',
    title: 'Get Your Smart Dashboard',
    description: 'Receive AI-powered study priorities, PYQ insights, and video recommendations instantly.',
    icon: Sparkles,
  },
]

export default function LandingPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-[#c4d8c0] dark:bg-[#8aa886]">
      <div className="min-h-screen bg-background text-foreground m-3 md:m-4 rounded-3xl overflow-hidden">
        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur rounded-t-3xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card">
                <span className="text-lg font-black text-foreground">N</span>
              </div>
              <div className="leading-none">
                <span className="text-sm font-bold text-foreground">CampusMind</span>
                <span className="text-sm font-bold text-primary"> AI</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {['Check Box', 'Monitoring', 'Support'].map((item, i) => (
                <a
                  key={item}
                  href={i === 0 ? '#features' : i === 1 ? '#how-it-works' : '#cta'}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>{item}</span>
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button variant="secondary" size="sm" asChild className="rounded-full">
                <Link href="/onboarding">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/onboarding">Get Started</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 text-center">
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 border border-primary/20 bg-primary/10 text-primary rounded-full px-4 py-1.5"
            >
              <Sparkles className="h-3 w-3" />
              AI-Powered Academic Assistant
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-balance leading-tight mb-6">
              Your smart academic
              <span className="text-primary block">command center.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed mb-10 text-pretty">
              Connect Classroom, analyze PYQs, track deadlines, and get AI-powered study guidance — all in
              one unified dashboard built for serious students.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" asChild className="gap-2 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/onboarding">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="rounded-full">
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required · Google account login · Free for students
            </p>
          </div>
        </section>

        {/* Dashboard preview */}
        <section className="mx-auto max-w-5xl px-6 -mt-8 pb-20">
          <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-accent/70" />
                <div className="h-3 w-3 rounded-full bg-primary/70" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-5 w-48 rounded-full bg-muted mx-auto text-xs flex items-center justify-center text-muted-foreground">
                  campusmind.ai/dashboard
                </div>
              </div>
            </div>
            <div className="flex h-64 md:h-80 bg-background">
              {/* Sidebar mockup */}
              <div className="w-16 shrink-0 border-r border-border bg-sidebar p-3 hidden md:flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-card mb-4" />
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`h-10 w-10 rounded-2xl ${i === 1 ? 'bg-card' : 'bg-transparent'}`}
                  />
                ))}
              </div>
              {/* Content mockup */}
              <div className="flex-1 p-4">
                <div className="flex items-center gap-2 mb-4">
                  {['Check Box', 'Monitoring', 'Support'].map((item, i) => (
                    <div
                      key={item}
                      className={`h-8 px-4 rounded-full flex items-center text-xs ${
                        i === 0 ? 'bg-card text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="h-5 w-32 rounded bg-foreground/20 mb-4" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-card p-3">
                    <div className="text-xs text-muted-foreground mb-2">CUSTOMER</div>
                    <div className="text-2xl font-bold text-foreground">2,4%</div>
                  </div>
                  <div className="rounded-2xl bg-card p-3">
                    <div className="text-xs text-muted-foreground mb-2">PRODUCT</div>
                    <div className="text-2xl font-bold text-foreground">2,8%</div>
                  </div>
                  <div className="rounded-2xl bg-card p-3 row-span-2">
                    <div className="text-xs text-muted-foreground mb-2">TIMELINE</div>
                    <div className="space-y-1.5">
                      {[60, 80, 40, 70, 30].map((w, i) => (
                        <div
                          key={i}
                          className={`h-4 rounded-full ${i % 2 === 0 ? 'bg-primary' : 'bg-accent'}`}
                          style={{ width: `${w}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-card p-3">
                    <div className="text-xs text-muted-foreground mb-2">PRODUCT</div>
                    <div className="flex items-end gap-2 h-16">
                      {[60, 80, 50, 90, 40, 70, 55].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-0.5 justify-end">
                          <div
                            className="w-full rounded-full bg-primary"
                            style={{ height: `${h * 0.4}%` }}
                          />
                          <div
                            className="w-full rounded-full bg-accent"
                            style={{ height: `${(100 - h) * 0.3}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 rounded-full">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-balance">
                Everything you need to ace your semester
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-pretty">
                CampusMind AI brings together your classroom, study materials, and AI insights in one
                powerful platform.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-3xl border border-border bg-card p-6 hover:border-primary/30 transition-colors group"
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${f.bg} mb-4`}
                  >
                    <f.icon className={`h-6 w-6 ${f.accent}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>

            {/* Extra feature list */}
            <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Bot, label: 'AI Study Assistant' },
                { icon: FileText, label: 'PDF Upload & Analysis' },
                { icon: CheckCircle2, label: 'Deadline Tracking' },
                { icon: Sparkles, label: 'Study Priority Engine' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
                >
                  <item.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 rounded-full">
                How it works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-balance">Set up in 3 simple steps</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-border" />
              {steps.map((step, i) => (
                <div key={step.step} className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-background border border-border flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-20 bg-primary rounded-b-3xl">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-primary-foreground text-balance mb-4">
              Ready to transform how you study?
            </h2>
            <p className="text-primary-foreground/70 mb-8 text-pretty">
              Join thousands of students who use CampusMind AI to study smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="gap-2 px-8 rounded-full"
              >
                <Link href="/onboarding">
                  Start for free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/dashboard">View Demo Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
