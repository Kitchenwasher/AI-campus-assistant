'use client'

import Link from 'next/link'
import {
  CalendarClock,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import {
  mockUser,
  mockDeadlines,
  mockDashboardStats,
} from '@/lib/mock-data'

// Sample data for charts
const customerData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 55 },
  { name: 'Wed', value: 45 },
  { name: 'Thu', value: 60 },
  { name: 'Fri', value: 50 },
  { name: 'Sat', value: 70 },
  { name: 'Sun', value: 65 },
]

const productBarData = [
  { name: '1', resources: 52, valid: 81, invalid: 25 },
  { name: '2', resources: 96, valid: 51, invalid: 0 },
  { name: '3', resources: 48, valid: 49, invalid: 0 },
  { name: '4', resources: 80, valid: 67, invalid: 0 },
  { name: '5', resources: 34, valid: 28, invalid: 0 },
  { name: '6', resources: 92, valid: 58, invalid: 0 },
  { name: '7', resources: 84, valid: 39, invalid: 36 },
]

const timelineData = [
  { date: '30.09', label: 'Calculus Quiz', value: 16, color: '#a3e635' },
  { date: '29.09', label: 'Physics Lab', value: 29, color: '#fb923c' },
  { date: '28.09', label: 'Group Project', value: 15, color: '#6b7280' },
  { date: '27.09', label: 'Exam Prep', value: 21, color: '#a3e635' },
  { date: '26.09', label: 'History Essay', value: 10, color: '#6b7280' },
  { date: '25.09', label: 'Reading', value: 15, color: '#a3e635' },
  { date: '24.09', label: 'Data Structs', value: 8, color: '#a3e635' },
]

// Dot matrix data (deterministic for SSR hydration)
const dotMatrix = Array.from({ length: 7 }, (_, i) =>
  Array.from({ length: 12 }, (_, j) => {
    const val = (i * 12 + j) * 17 % 100
    return val > 30 ? (val > 60 ? 'lime' : 'orange') : 'empty'
  })
)

export default function DashboardPage() {
  const todayDeadlines = mockDeadlines.filter((d) => d.urgency === 'today')
  const weekDeadlines = mockDeadlines.filter((d) => d.urgency === 'week').slice(0, 3)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-black text-foreground tracking-tight">CHECK BOX</h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="rounded-full px-4 gap-2 bg-card hover:bg-card/80">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">Now</span>
          </Button>
          <Button variant="secondary" className="rounded-full px-4 gap-2 bg-card hover:bg-card/80">
            <span className="text-muted-foreground">Product:</span>
            <span className="font-medium">All</span>
          </Button>
          <Button variant="secondary" className="rounded-full px-4 gap-2 bg-card hover:bg-card/80">
            <span className="text-muted-foreground">Profile:</span>
            <span className="font-medium">{mockUser.name.split(' ')[0]}</span>
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full bg-card hover:bg-card/80">
            <CalendarClock className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer Card -> Study Focus */}
        <Card className="bg-card border-border rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Study Focus
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end gap-6 mb-4">
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-bold text-foreground">14.5</span>
                  <span className="text-xs text-muted-foreground mb-1">hrs</span>
                  <TrendingUp className="h-4 w-4 text-primary ml-1" />
                </div>
                <span className="text-xs text-muted-foreground">Deep Work</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-bold text-foreground">4.2</span>
                  <span className="text-xs text-muted-foreground mb-1">hrs</span>
                  <TrendingDown className="h-4 w-4 text-orange ml-1" />
                </div>
                <span className="text-xs text-muted-foreground">Distracted</span>
              </div>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Card with Dot Matrix -> Topic Mastery */}
        <Card className="bg-card border-border rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Topic Mastery
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end gap-6 mb-4">
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-bold text-foreground">8.2</span>
                  <span className="text-xs text-muted-foreground mb-1">/10</span>
                  <TrendingUp className="h-4 w-4 text-primary ml-1" />
                </div>
                <span className="text-xs text-muted-foreground">Average Concept Score</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-bold text-foreground">14</span>
                  <TrendingUp className="h-4 w-4 text-primary ml-1" />
                </div>
                <span className="text-xs text-muted-foreground">Mastered Topics</span>
              </div>
            </div>
            {/* Dot Matrix */}
            <div className="flex flex-col gap-1">
              {dotMatrix.map((row, i) => (
                <div key={i} className="flex gap-1">
                  {row.map((dot, j) => (
                    <div
                      key={j}
                      className={`h-2.5 w-2.5 rounded-full ${
                        dot === 'lime'
                          ? 'bg-primary'
                          : dot === 'orange'
                          ? 'bg-accent'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Timeline */}
        <Card className="bg-card border-border rounded-3xl overflow-hidden row-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Projects Timeline
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {timelineData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-10 shrink-0">
                    {item.date}
                  </span>
                  <div
                    className="h-7 rounded-full flex items-center gap-2 px-3"
                    style={{
                      backgroundColor: item.color,
                      width: `${Math.min(item.value * 3, 100)}%`,
                    }}
                  >
                    <span className="text-xs font-semibold text-black truncate">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Quizzes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-xs text-muted-foreground">Projects</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="text-xs text-muted-foreground">Reading</span>
              </div>
              <span className="text-xs text-muted-foreground ml-auto">Total: 284 hrs</span>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Bar Chart */}
        <Card className="bg-card border-border rounded-3xl overflow-hidden lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Weekly Activity Metrics
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productBarData} barCategoryGap="20%">
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Bar dataKey="resources" stackId="a" fill="hsl(var(--muted-foreground))" radius={[20, 20, 20, 20]} />
                  <Bar dataKey="valid" stackId="a" fill="hsl(var(--primary))" radius={[20, 20, 20, 20]} />
                  <Bar dataKey="invalid" stackId="a" fill="hsl(var(--accent))" radius={[20, 20, 20, 20]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="text-xs text-muted-foreground">Pages Read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Passed Mocks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-xs text-muted-foreground">Failed Mocks</span>
              </div>
              <span className="text-xs text-muted-foreground ml-auto">Total Actions: 1,012</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines (Academic Context) */}
      <Card className="bg-card border-border rounded-3xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Upcoming Deadlines
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs h-7 rounded-full">
              <Link href="/dashboard/deadlines">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...todayDeadlines, ...weekDeadlines].map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 rounded-2xl bg-muted/30 px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div
                className={`h-3 w-3 rounded-full shrink-0 ${
                  d.urgency === 'today' ? 'bg-accent' : 'bg-primary'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.course}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-foreground">{d.dueDate}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    d.urgency === 'today'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-primary/20 text-primary'
                  }`}
                >
                  {d.type}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
