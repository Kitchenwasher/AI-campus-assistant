'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  CalendarClock,
  Clock,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockDeadlines, type DeadlineItem } from '@/lib/mock-data'

const typeColors: Record<DeadlineItem['type'], string> = {
  assignment: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  quiz: 'bg-primary/10 text-primary border-primary/20',
  assessment: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
}

const statusColors: Record<DeadlineItem['status'], string> = {
  pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  submitted: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
  graded: 'bg-muted text-muted-foreground border-border',
}

function DeadlineRow({ item }: { item: DeadlineItem }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 hover:border-primary/30 transition-colors">
      <div className={`h-2 w-2 rounded-full shrink-0 mt-1 sm:mt-0 ${
        item.urgency === 'today' ? 'bg-orange-500' :
        item.urgency === 'overdue' ? 'bg-destructive' : 'bg-primary'
      }`} />
      <div className="flex-1 min-w-0 grid sm:grid-cols-4 gap-x-4 gap-y-1 items-center">
        <div className="sm:col-span-2">
          <p className="text-sm font-semibold text-foreground leading-tight">{item.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{item.course}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={`text-xs border capitalize ${typeColors[item.type]}`}>
            {item.type}
          </Badge>
          <Badge variant="outline" className={`text-xs border capitalize ${statusColors[item.status]}`}>
            {item.status}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground sm:text-right font-medium">
          {item.dueDate}
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  count,
  iconColor,
}: {
  icon: React.ElementType
  title: string
  count: number
  iconColor: string
}) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{count} item{count !== 1 ? 's' : ''}</p>
      </div>
    </div>
  )
}

type Filter = 'all' | 'assignment' | 'quiz' | 'overdue'

export default function DeadlinesPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [syncing, setSyncing] = useState(false)

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  const todayItems = mockDeadlines.filter(
    (d) => d.urgency === 'today' && (filter === 'all' || filter === d.type)
  )
  const weekItems = mockDeadlines.filter(
    (d) => d.urgency === 'week' && (filter === 'all' || filter === d.type)
  )
  const overdueItems = mockDeadlines.filter(
    (d) => d.urgency === 'overdue' && (filter === 'all' || filter === 'overdue' || filter === d.type)
  )

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">DEADLINES</h2>
          <p className="text-muted-foreground text-sm mt-1">Track all your assignments, quizzes, and assessments.</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="gap-2 rounded-full"
          onClick={handleSync}
          disabled={syncing}
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

      {/* Classroom status card */}
      <Card className="border-primary/30 bg-primary/5 rounded-2xl">
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Google Classroom Connected</p>
            <p className="text-xs text-muted-foreground">Last synced 12 minutes ago · 5 courses imported</p>
          </div>
          <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 shrink-0">
            Active
          </Badge>
        </CardContent>
      </Card>

      {/* Filter tabs */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs px-3">All</TabsTrigger>
            <TabsTrigger value="assignment" className="text-xs px-3">Assignments</TabsTrigger>
            <TabsTrigger value="quiz" className="text-xs px-3">Quizzes</TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs px-3">Overdue</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Due Today', value: mockDeadlines.filter(d => d.urgency === 'today').length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Due This Week', value: mockDeadlines.filter(d => d.urgency === 'week').length, icon: CalendarClock, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Overdue', value: mockDeadlines.filter(d => d.urgency === 'overdue').length, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Due Today */}
      {(filter === 'all' || filter === 'assignment' || filter === 'quiz') && todayItems.length > 0 && (
        <section>
          <SectionHeader icon={Clock} title="Due Today" count={todayItems.length} iconColor="text-orange-500" />
          <div className="space-y-2">
            {todayItems.map((d) => <DeadlineRow key={d.id} item={d} />)}
          </div>
        </section>
      )}

      {/* Due This Week */}
      {(filter === 'all' || filter === 'assignment' || filter === 'quiz') && weekItems.length > 0 && (
        <section>
          <SectionHeader icon={CalendarClock} title="Due This Week" count={weekItems.length} iconColor="text-primary" />
          <div className="space-y-2">
            {weekItems.map((d) => <DeadlineRow key={d.id} item={d} />)}
          </div>
        </section>
      )}

      {/* Overdue */}
      {overdueItems.length > 0 && (
        <section>
          <SectionHeader icon={AlertTriangle} title="Overdue" count={overdueItems.length} iconColor="text-destructive" />
          <div className="space-y-2">
            {overdueItems.map((d) => <DeadlineRow key={d.id} item={d} />)}
          </div>
        </section>
      )}

      {/* Empty state */}
      {todayItems.length === 0 && weekItems.length === 0 && overdueItems.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground mt-1">No deadlines match this filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
