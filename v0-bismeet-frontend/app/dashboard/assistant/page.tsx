'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Bot, Send, User, Sparkles, BookOpen, FlaskConical, PlaySquare, GraduationCap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { mockChatHistory, mockSuggestedPrompts, type ChatMessage } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { useUploads } from '@/components/uploads-provider'

const sourceColors: Record<string, string> = {
  Classroom: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Notes: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  PYQs: 'bg-primary/10 text-primary border-primary/20',
  Videos: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const sourceIcons: Record<string, React.ElementType> = {
  Classroom: GraduationCap,
  Notes: BookOpen,
  PYQs: FlaskConical,
  Videos: PlaySquare,
}

const mockResponses: Record<string, { content: string; sources: string[] }> = {
  default: {
    content: `I can help with that! Based on your uploaded materials and Google Classroom data, here's what I recommend:

**Study Plan Overview:**
- Start with your highest priority PYQ topics in DBMS and OS
- Check your upcoming deadlines — you have 2 items due today
- Use the video recommendations panel for visual learning

Is there a specific subject or topic you'd like me to focus on?`,
    sources: ['Classroom', 'PYQs', 'Notes'],
  },
  'What deadlines are coming up?': {
    content: `Here are your upcoming deadlines:\n\n**Due Today:**\n- DBMS — ER Diagram Assignment (11:59 PM)\n- Computer Networks — Mid-Semester Quiz (3:00 PM)\n\n**Due This Week:**\n- OS — Memory Management Lab (Tomorrow)\n- SE — SRS Document (March 29)\n- Data Structures — Graph Algorithms (March 31)\n\n**Overdue (3 items):**\nYou have 3 overdue items from last week. I recommend submitting them ASAP even if late.\n\nWant me to help you plan time for these?`,
    sources: ['Classroom'],
  },
  'What should I study today?': {
    content: `Based on your schedule and PYQ analysis, here's your **priority list for today**:\n\n**1. CN — Mid-Semester Quiz** (3:00 PM today)\nFocus on OSI model layers, TCP/IP, and the top 3 PYQ topics. Review Unit 2 notes.\n\n**2. DBMS — ER Diagram Assignment** (11:59 PM)\nRevise entity types, relationships, and cardinality rules. Your Unit 2 notes are already uploaded.\n\n**3. OS Process Scheduling** (Light review — lab tomorrow)\n20 mins on FCFS, SJF, Round Robin algorithms.\n\nI've already queued matching videos in your recommendations.`,
    sources: ['Classroom', 'Notes', 'PYQs'],
  },
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border',
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
      </div>
      <div className={cn('max-w-[80%] space-y-2', isUser && 'items-end flex flex-col')}>
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card border border-border rounded-tl-sm',
        )}>
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
            __html: msg.content
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n- /g, '\n• ')
          }} />
        </div>
        <div className={cn('flex items-center gap-2 flex-wrap', isUser && 'flex-row-reverse')}>
          <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
          {msg.sources?.map((src) => {
            const Icon = sourceIcons[src] ?? Sparkles
            return (
              <Badge key={src} variant="outline" className={`text-xs border gap-1 ${sourceColors[src] ?? ''}`}>
                <Icon className="h-3 w-3" />
                {src}
              </Badge>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { uploads } = useUploads()

  const dynamicSuggestedPrompts = useMemo(() => {
    const uploadPrompts: string[] = []
    uploads.forEach((u) => {
      if (u.status === 'processed' && u.type === 'notes') {
        if (u.extractedTopicsList && u.extractedTopicsList.length > 0) {
          uploadPrompts.push(`Summarize ${u.extractedTopicsList[0]}`)
          uploadPrompts.push(`Quiz me on ${u.extractedTopicsList[0]}`)
        } else {
          uploadPrompts.push(`Summarize notes from ${u.name}`)
        }
      }
    })
    const merged = [...uploadPrompts, ...mockSuggestedPrompts]
    return Array.from(new Set(merged)).slice(0, 6)
  }, [uploads])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async (text?: string) => {
    const content = text ?? input.trim()
    if (!content) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const currentMessages = [...messages, userMsg]
    setMessages(currentMessages)
    setInput('')
    setIsTyping(true)

    try {
      const localVectors = uploads
        .filter(u => u.status === 'processed' && u.localVectors)
        .flatMap(u => u.localVectors ?? [])

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: currentMessages, localVectors }),
      })
      
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to contact AI')
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (e: any) {
      console.error(e)
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, there was an error: ${e.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] gap-4 max-w-6xl mx-auto">
      {/* Sidebar: Suggested prompts */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col gap-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Suggested Prompts</span>
            </div>
            <div className="space-y-1.5">
              {dynamicSuggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="w-full text-left rounded-lg bg-muted/50 hover:bg-accent px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors leading-snug"
                >
                  {p}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <span className="text-xs font-semibold text-foreground block">Context Sources</span>
            <div className="space-y-1.5">
              {Object.entries(sourceColors).map(([src, cls]) => {
                const Icon = sourceIcons[src] ?? Sparkles
                return (
                  <div key={src} className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 border text-xs font-medium ${cls}`}>
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {src}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Chat area */}
      <div className="flex flex-1 flex-col min-w-0 rounded-3xl border border-border bg-card overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-3.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">CampusMind Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Online · Aware of your syllabus & deadlines</span>
            </div>
          </div>
          <Badge variant="secondary" className="ml-auto text-xs border border-primary/20 bg-primary/10 text-primary">
            Demo AI
          </Badge>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4 shrink-0">
          {/* Mobile suggested prompts */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-2">
            {dynamicSuggestedPrompts.slice(0, 3).map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="shrink-0 rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask about deadlines, study plans, or exam topics..."
              className="resize-none min-h-[44px] max-h-32 text-sm"
              rows={1}
            />
            <Button
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
