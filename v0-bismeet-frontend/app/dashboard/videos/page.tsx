'use client'

import { useState } from 'react'
import { PlaySquare, Search, Eye, ThumbsUp, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockVideos, type VideoRecommendation } from '@/lib/mock-data'

const tagColors: Record<string, string> = {
  'High syllabus match': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  'PYQ relevant': 'bg-primary/10 text-primary border-primary/20',
  'Best for revision': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
}

function VideoCard({ video, featured = false }: { video: VideoRecommendation; featured?: boolean }) {
  return (
    <div className={`rounded-3xl border bg-card overflow-hidden hover:border-primary/30 transition-colors group cursor-pointer ${featured ? 'border-primary/30' : 'border-border'}`}>
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlaySquare className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
          {video.duration}
        </div>
        {featured && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
            <Star className="h-3 w-3" />
            Featured
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1">{video.title}</h3>
          <p className="text-xs text-muted-foreground">{video.channel}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {video.views}
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            {video.likes}
          </div>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="text-xs text-muted-foreground leading-snug">{video.reason}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {video.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={`text-xs border ${tagColors[tag] ?? 'bg-muted text-muted-foreground border-border'}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

type SubjectFilter = 'All' | 'DBMS' | 'Computer Networks' | 'Operating Systems' | 'Software Engineering'

export default function VideosPage() {
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState<SubjectFilter>('All')

  const featured = mockVideos.filter((v) => v.featured)
  const filtered = mockVideos.filter((v) => {
    const subjectMatch = subject === 'All' || v.subject === subject
    const searchMatch =
      !search ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.channel.toLowerCase().includes(search.toLowerCase()) ||
      v.subject.toLowerCase().includes(search.toLowerCase())
    return subjectMatch && searchMatch
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PlaySquare className="h-5 w-5 text-destructive" />
            <h2 className="text-3xl font-black text-foreground tracking-tight">VIDEO RECS</h2>
          </div>
          <p className="text-muted-foreground text-sm">Curriculum-aligned YouTube videos matched to your syllabus and PYQ topics.</p>
        </div>
        <Badge variant="secondary" className="border border-border self-start">
          {mockVideos.length} videos curated
        </Badge>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by topic, channel..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Tabs value={subject} onValueChange={(v) => setSubject(v as SubjectFilter)}>
          <TabsList className="h-10">
            {(['All', 'DBMS', 'Computer Networks', 'Operating Systems', 'Software Engineering'] as SubjectFilter[]).map((s) => (
              <TabsTrigger key={s} value={s} className="text-xs px-3">
                {s === 'Computer Networks' ? 'CN' : s === 'Operating Systems' ? 'OS' : s === 'Software Engineering' ? 'SE' : s}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Top Picks this week */}
      {!search && subject === 'All' && (
        <section>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Top Picks for This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {featured.map((v) => (
                  <VideoCard key={v.id} video={v} featured />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* All / Filtered results */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            {search || subject !== 'All' ? `Results (${filtered.length})` : 'All Recommendations'}
          </h3>
        </div>
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-14 text-center">
              <PlaySquare className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No videos match your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
