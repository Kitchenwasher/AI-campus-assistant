'use client'

import { useState } from 'react'
import {
  User,
  GraduationCap,
  Bell,
  Palette,
  Zap,
  Link2,
  Moon,
  Sun,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { mockUser } from '@/lib/mock-data'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    deadlineReminders: true,
    dailyBriefing: true,
    pyqUpdates: false,
    videoRecommendations: true,
  })
  const [demoMode, setDemoMode] = useState(true)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-foreground tracking-tight">SETTINGS</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your profile, integrations, and preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Profile</CardTitle>
          </div>
          <CardDescription className="text-xs">Your personal and academic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0">
              {mockUser.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold text-foreground">{mockUser.name}</p>
              <p className="text-sm text-muted-foreground">{mockUser.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{mockUser.college} · {mockUser.semester}</p>
            </div>
          </div>
          <Separator />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Full Name</Label>
              <Input defaultValue={mockUser.name} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">College</Label>
              <Input defaultValue={mockUser.college} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Semester</Label>
              <Input defaultValue={mockUser.semester} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Year</Label>
              <Input defaultValue={mockUser.year} className="h-9 text-sm" />
            </div>
          </div>
          <Button size="sm" className="gap-2">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Google Classroom */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Google Classroom</CardTitle>
          </div>
          <CardDescription className="text-xs">Manage your classroom connection and sync settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Connected</p>
              <p className="text-xs text-muted-foreground">5 courses · Last synced 12 min ago</p>
            </div>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 shrink-0">
              Active
            </Badge>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync Now
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive border-destructive/30">
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Notification Preferences</CardTitle>
          </div>
          <CardDescription className="text-xs">Choose what you want to be notified about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'deadlineReminders', label: 'Deadline Reminders', desc: 'Get alerts before assignments are due' },
            { key: 'dailyBriefing', label: 'Daily Study Briefing', desc: 'Morning summary of your schedule and priorities' },
            { key: 'pyqUpdates', label: 'PYQ Insight Updates', desc: 'When new insights are generated from your papers' },
            { key: 'videoRecommendations', label: 'New Video Recommendations', desc: 'When curriculum-matched videos are curated' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium text-foreground">{item.label}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-foreground">Dark Mode</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle between light and dark theme</p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Mode */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Demo Mode</CardTitle>
          </div>
          <CardDescription className="text-xs">Demo mode uses mock data to simulate full app functionality.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-foreground">Demo Mode Active</Label>
              <p className="text-xs text-muted-foreground mt-0.5">All data is simulated — no real API calls are made</p>
            </div>
            <Switch checked={demoMode} onCheckedChange={setDemoMode} />
          </div>
        </CardContent>
      </Card>

      {/* API Integrations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">API Integrations</CardTitle>
          </div>
          <CardDescription className="text-xs">Connect external services to power CampusMind AI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Google Classroom API', endpoint: '/api/classroom/sync', status: 'connected' },
            { label: 'Document Upload API', endpoint: '/api/upload', status: 'connected' },
            { label: 'PYQ Analysis Engine', endpoint: '/api/pyq/analyze', status: 'connected' },
            { label: 'YouTube Recommendations', endpoint: '/api/youtube/recommend', status: 'not-connected' },
            { label: 'AI Assistant API', endpoint: '/api/assistant', status: 'not-connected' },
          ].map((api) => (
            <div key={api.label} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <div className={`h-2 w-2 rounded-full shrink-0 ${api.status === 'connected' ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{api.label}</p>
                <code className="text-xs text-muted-foreground font-mono">{api.endpoint}</code>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className={`text-xs border ${
                    api.status === 'connected'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {api.status === 'connected' ? 'Connected' : 'Not Connected'}
                </Badge>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
