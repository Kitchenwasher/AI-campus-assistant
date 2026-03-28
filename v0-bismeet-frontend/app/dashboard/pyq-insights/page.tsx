'use client'

import { useState } from 'react'
import {
  FlaskConical,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  FileQuestion,
  Info,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { mockPYQTopics, type PYQTopic } from '@/lib/mock-data'

const confidenceColors: Record<PYQTopic['confidence'], string> = {
  high: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  low: 'bg-muted text-muted-foreground border-border',
}

const categoryMeta = {
  long: { label: 'Long Answer', icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10' },
  short: { label: 'Short Answer', icon: FileQuestion, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  unit: { label: 'High-Priority Unit', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
}

function TopicCard({ topic }: { topic: PYQTopic }) {
  const cat = categoryMeta[topic.category]
  return (
    <div className="rounded-3xl border border-border bg-card p-5 hover:border-primary/30 transition-colors space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">{topic.topic}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{topic.subject}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-lg font-bold text-primary">{topic.importance}</span>
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>
      <Progress value={topic.importance} className="h-1.5" />
      <div className="flex items-start gap-2">
        <AlertCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">{topic.reason}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${cat.bg} ${cat.color}`}>
          <cat.icon className="h-3 w-3" />
          {cat.label}
        </div>
        <Badge variant="outline" className={`text-xs border ${confidenceColors[topic.confidence]} capitalize`}>
          {topic.confidence} confidence
        </Badge>
        <span className="text-xs text-muted-foreground">{topic.appearances}x in past papers</span>
      </div>
    </div>
  )
}

type SubjectFilter = 'All' | 'DBMS' | 'Computer Networks' | 'Operating Systems' | 'Software Engineering'

export default function PYQInsightsPage() {
  const [subject, setSubject] = useState<SubjectFilter>('All')
  const [category, setCategory] = useState<'all' | 'long' | 'short' | 'unit'>('all')

  const filtered = mockPYQTopics.filter((t) => {
    const subjectMatch = subject === 'All' || t.subject === subject
    const catMatch = category === 'all' || t.category === category
    return subjectMatch && catMatch
  })

  const chartData = mockPYQTopics.slice(0, 6).map((t) => ({
    name: t.topic.length > 20 ? t.topic.slice(0, 20) + '…' : t.topic,
    score: t.importance,
    appearances: t.appearances,
  }))

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h2 className="text-3xl font-black text-foreground tracking-tight">PYQ INTELLIGENCE</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            AI-powered exam topic analysis from previous year question papers.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5 border border-primary/20 bg-primary/10 text-primary self-start">
          {mockPYQTopics.length} topics analyzed
        </Badge>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Trend-based insights only.</span> These predictions are based on historical PYQ patterns and frequency analysis — not official exam sources. Use as a study guide, not as an exact prediction.
        </p>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Topic Importance Score (Top 6)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={160}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v) => [`${v}%`, 'Importance']}
                />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Most Repeated Topics', value: mockPYQTopics.filter(t => t.appearances >= 6).length, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'High-Priority Units', value: mockPYQTopics.filter(t => t.category === 'unit').length, icon: FlaskConical, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Long Answer Areas', value: mockPYQTopics.filter(t => t.category === 'long').length, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Short Answer Areas', value: mockPYQTopics.filter(t => t.category === 'short').length, icon: FileQuestion, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Subject:</span>
          <Tabs value={subject} onValueChange={(v) => setSubject(v as SubjectFilter)}>
            <TabsList className="h-8">
              {(['All', 'DBMS', 'Computer Networks', 'Operating Systems', 'Software Engineering'] as SubjectFilter[]).map((s) => (
                <TabsTrigger key={s} value={s} className="text-xs px-3">{s === 'Computer Networks' ? 'CN' : s === 'Operating Systems' ? 'OS' : s === 'Software Engineering' ? 'SE' : s}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Type:</span>
          <Tabs value={category} onValueChange={(v) => setCategory(v as 'all' | 'long' | 'short' | 'unit')}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs px-3">All</TabsTrigger>
              <TabsTrigger value="long" className="text-xs px-3">Long Answer</TabsTrigger>
              <TabsTrigger value="short" className="text-xs px-3">Short Answer</TabsTrigger>
              <TabsTrigger value="unit" className="text-xs px-3">Units</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Topic cards grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((t) => <TopicCard key={t.id} topic={t} />)}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-14 text-center">
            <FlaskConical className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No topics match the selected filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
