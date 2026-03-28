'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarClock,
  Upload,
  FlaskConical,
  PlaySquare,
  Bot,
  Settings,
  Heart,
  Plus,
  Sparkles,
  Database,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUploads } from '@/components/uploads-provider'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Heart },
  { label: 'Deadlines', href: '/dashboard/deadlines', icon: CalendarClock },
  { label: 'Uploads', href: '/dashboard/uploads', icon: Upload },
  { label: 'PYQ Insights', href: '/dashboard/pyq-insights', icon: FlaskConical },
  { label: 'Video Recs', href: '/dashboard/videos', icon: PlaySquare },
  { label: 'AI Assistant', href: '/dashboard/assistant', icon: Bot },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Global Admin', href: '/dashboard/admin', icon: Database },
]

function NeonIconButton({
  active,
  children,
  className,
  ...props
}: {
  active?: boolean
  children: React.ReactNode
  className?: string
} & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'relative flex h-11 w-11 items-center justify-center rounded-xl',
        'transition-all duration-300 ease-out cursor-pointer',
        'text-muted-foreground',
        // Hover state with neon glow
        'hover:text-foreground hover:bg-card/80',
        'hover:shadow-[0_0_15px_rgba(163,230,53,0.35),0_0_30px_rgba(163,230,53,0.15),inset_0_0_10px_rgba(163,230,53,0.05)]',
        // Active state with stronger glow
        active && [
          'bg-card text-primary',
          'shadow-[0_0_20px_rgba(163,230,53,0.5),0_0_40px_rgba(163,230,53,0.25),inset_0_0_15px_rgba(163,230,53,0.1)]',
          'border border-primary/30',
        ],
        className
      )}
      {...props}
    >
      {/* Glow ring effect on active */}
      {active && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/20 to-transparent opacity-50" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function SidebarNav() {
  const pathname = usePathname()
  const { isDeveloper } = useUploads()

  const visibleNavItems = navItems.filter(item => 
    item.label === 'Global Admin' ? isDeveloper : true
  )

  return (
    <aside className="hidden md:flex flex-col w-[72px] shrink-0 bg-sidebar py-4 px-3 items-center gap-2">
      {/* Logo with glow */}
      <Link
        href="/dashboard"
        className="group flex h-12 w-12 items-center justify-center rounded-xl bg-card mb-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(163,230,53,0.4),0_0_40px_rgba(163,230,53,0.2)]"
      >
        <Sparkles className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
      </Link>

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {visibleNavItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} title={item.label}>
              <NeonIconButton active={active}>
                <item.icon className={cn('h-5 w-5', active && 'text-primary')} />
              </NeonIconButton>
            </Link>
          )
        })}
      </nav>

      {/* Add button with orange glow */}
      <button
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl',
          'bg-card text-muted-foreground',
          'transition-all duration-300 ease-out',
          'hover:text-foreground',
          'hover:shadow-[0_0_15px_rgba(251,146,60,0.4),0_0_30px_rgba(251,146,60,0.2),inset_0_0_10px_rgba(251,146,60,0.05)]',
          'hover:border hover:border-orange/30'
        )}
      >
        <Plus className="h-5 w-5" />
      </button>
    </aside>
  )
}
