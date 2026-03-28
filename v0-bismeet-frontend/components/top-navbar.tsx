'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Search, Menu, BarChart3, MessageCircle, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { mockUser } from '@/lib/mock-data'
import { useUploads } from '@/components/uploads-provider'

const topNavItems = [
  { label: 'Check Box', href: '/dashboard', icon: BarChart3 },
  { label: 'Monitoring', href: '/dashboard/deadlines', icon: BarChart3 },
  { label: 'Support', href: '/dashboard/assistant', icon: Headphones },
]

const mobileNavItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Deadlines', href: '/dashboard/deadlines' },
  { label: 'Uploads', href: '/dashboard/uploads' },
  { label: 'PYQ Insights', href: '/dashboard/pyq-insights' },
  { label: 'Video Recs', href: '/dashboard/videos' },
  { label: 'AI Assistant', href: '/dashboard/assistant' },
  { label: 'Settings', href: '/dashboard/settings' },
]

const pageTitles: Record<string, string> = {
  '/dashboard': 'CHECK BOX',
  '/dashboard/deadlines': 'DEADLINES',
  '/dashboard/uploads': 'UPLOADS',
  '/dashboard/pyq-insights': 'PYQ INSIGHTS',
  '/dashboard/videos': 'VIDEO RECS',
  '/dashboard/assistant': 'AI ASSISTANT',
  '/dashboard/settings': 'SETTINGS',
}

export function TopNavbar() {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'CAMPUSMIND'
  const { isDeveloper, setIsDeveloper } = useUploads()

  return (
    <header className="flex h-16 items-center gap-4 px-4 sticky top-0 z-30">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-56 p-0 bg-sidebar border-sidebar-border">
          <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card">
              <span className="text-lg font-black text-foreground">N</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-sidebar-foreground leading-none block">
                CampusMind
              </span>
              <span className="text-xs text-primary font-medium">AI</span>
            </div>
          </div>
          <nav className="py-4 px-2 space-y-0.5">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
                  pathname === item.href && 'bg-sidebar-accent text-sidebar-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Top nav pills with neon glow */}
      <div className="hidden md:flex items-center gap-2">
        {topNavItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium',
                'transition-all duration-300 ease-out',
                active
                  ? 'bg-card text-foreground shadow-[0_0_15px_rgba(163,230,53,0.3),0_0_30px_rgba(163,230,53,0.15)] border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50 hover:shadow-[0_0_12px_rgba(163,230,53,0.25),0_0_24px_rgba(163,230,53,0.1)]',
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Search with glow */}
      <button
        className={cn(
          'hidden md:flex h-10 w-10 items-center justify-center rounded-full',
          'text-muted-foreground transition-all duration-300 ease-out',
          'hover:text-foreground hover:bg-card/50',
          'hover:shadow-[0_0_12px_rgba(163,230,53,0.25),0_0_24px_rgba(163,230,53,0.1)]'
        )}
      >
        <Search className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      {/* Page title - mobile only */}
      <h1 className="text-lg font-black text-foreground md:hidden tracking-tight">{title}</h1>

      <div className="flex-1 md:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* User profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-3 rounded-full px-3 py-2 h-auto transition-all duration-300 hover:shadow-[0_0_12px_rgba(163,230,53,0.25),0_0_24px_rgba(163,230,53,0.1)]"
            >
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-foreground">{mockUser.name}</div>
                <div className="text-xs text-muted-foreground">@Nixtio</div>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/50">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {mockUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              {/* Notification badge */}
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{mockUser.name}</div>
              <div className="text-xs text-muted-foreground font-normal">{mockUser.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-sm font-medium">Developer Auth</span>
              <Switch checked={isDeveloper} onCheckedChange={setIsDeveloper} />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Sign out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
