'use client'

import { useState, useRef } from 'react'
import {
  Upload,
  FileText,
  BookOpen,
  FlaskConical,
  CheckCircle2,
  Loader2,
  X,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { type UploadedFile } from '@/lib/mock-data'
import { useUploads } from '@/components/uploads-provider'

const uploadZones = [
  {
    type: 'syllabus' as const,
    icon: BookOpen,
    title: 'Syllabus PDFs',
    description: 'Upload your course syllabus to extract topics and chapters.',
    accept: '.pdf',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30 hover:border-blue-500',
  },
  {
    type: 'notes' as const,
    icon: FileText,
    title: 'Lecture Notes',
    description: 'Upload handwritten or typed notes for AI-powered topic extraction.',
    accept: '.pdf',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30 hover:border-green-500',
  },
  {
    type: 'pyq' as const,
    icon: FlaskConical,
    title: 'Previous Year Papers',
    description: 'Upload PYQ PDFs to generate intelligent exam insights.',
    accept: '.pdf',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30 hover:border-primary',
  },
]

const statusIcon: Record<UploadedFile['status'], React.ReactNode> = {
  processed: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
  processing: <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />,
  failed: <X className="h-3.5 w-3.5 text-destructive" />,
}

const statusLabel: Record<UploadedFile['status'], string> = {
  processed: 'Processed',
  processing: 'Processing...',
  failed: 'Failed',
}

const typeColors: Record<UploadedFile['type'], string> = {
  syllabus: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  notes: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  pyq: 'bg-primary/10 text-primary border-primary/20',
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default function UploadsPage() {
  const [dragOver, setDragOver] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeUploadZone, setActiveUploadZone] = useState<UploadedFile['type']>('notes')
  
  const { uploads, addUpload, updateUploadStatus, removeUpload } = useUploads()

  const personalUploads = uploads.filter(u => !u.isGlobal)

  const handleFileUpload = async (file: File, type: UploadedFile['type']) => {
    if (personalUploads.length >= 4) return;

    const id = Date.now().toString()
    const subject = file.name.split('_')[0] || 'General'
    
    addUpload({
      id,
      name: file.name,
      type,
      subject,
      size: formatBytes(file.size),
      uploadedAt: 'Just now',
      status: 'processing',
    })

    // Standard local browser storage calculation
    try {
        const fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1]
            resolve(base64String)
          }
          reader.onerror = error => reject(error)
        })

        setTimeout(() => {
          const numTopics = Math.floor(Math.random() * 15) + 5
          let topicsList: string[] = []
          
          if (type === 'notes') {
            const potentialTopics = ['Architecture', 'Analysis', 'Introduction', 'Summary', 'Key Concepts', 'Methods', 'Framework']
            topicsList = [
              `${subject} ${potentialTopics[Math.floor(Math.random() * potentialTopics.length)]}`,
              `${potentialTopics[Math.floor(Math.random() * potentialTopics.length)]} Review`,
              `Advanced ${subject}`
            ]
          }
          
          updateUploadStatus(id, 'processed', numTopics, topicsList.length > 0 ? topicsList : undefined, fileData)
        }, 1000)

      } catch (error) {
        console.error('File reading failed', error)
        updateUploadStatus(id, 'failed')
      }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0], activeUploadZone)
    }
  }

  const triggerUpload = (type: UploadedFile['type']) => {
    if (personalUploads.length >= 4) return;
    setActiveUploadZone(type)
    fileInputRef.current?.click()
  }

  const processedCount = personalUploads.filter((u) => u.status === 'processed').length
  const processingCount = personalUploads.filter((u) => u.status === 'processing').length
  const totalTopics = personalUploads.reduce((sum, u) => sum + (u.topicsExtracted ?? 0), 0)

  // Calculate dynamic extracted subject topics ONLY from personal uploads
  const extractedSubjects = personalUploads.reduce((acc, u) => {
    if (u.status === 'processed') {
      if (!acc[u.subject]) {
        acc[u.subject] = {
          subject: u.subject,
          topics: new Set<string>(),
          count: 0
        }
      }
      acc[u.subject].count += (u.topicsExtracted ?? 0)
      if (u.extractedTopicsList) {
        u.extractedTopicsList.forEach(t => acc[u.subject].topics.add(t))
      }
    }
    return acc
  }, {} as Record<string, { subject: string; topics: Set<string>; count: number }>)

  // Provide initial mock subject sets if none exist (for UI demo purposes)
  if (Object.keys(extractedSubjects).length === 0) {
    extractedSubjects['DBMS'] = { subject: 'DBMS', topics: new Set(['Normalization', 'ER Diagrams', 'SQL']), count: 14 }
    extractedSubjects['Computer Networks'] = { subject: 'Computer Networks', topics: new Set(['OSI Model', 'TCP/IP']), count: 22 }
  }

  const extractedSubjectsArray = Object.values(extractedSubjects).map(s => ({
    ...s,
    topics: Array.from(s.topics).slice(0, 5) // restrict to 5 for UI fitting
  }))

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">MY UPLOADS</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Upload your personal syllabus, active notes, and previous year papers for private AI analysis.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Files Processed', value: processedCount, color: 'text-green-500' },
          { label: 'Processing', value: processingCount, color: 'text-primary' },
          { label: 'Topics Extracted', value: totalTopics, color: 'text-foreground' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload zones */}
      {personalUploads.length >= 4 ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
            <h3 className="text-lg font-bold text-foreground">Storage Limit Reached</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              You have reached your maximum limit of 4 personal files. Please delete an older file to upload a new one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {uploadZones.map((zone) => (
            <div
              key={zone.type}
              onDragOver={(e) => { e.preventDefault(); setDragOver(zone.type) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => { 
                e.preventDefault(); 
                setDragOver(null);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFileUpload(e.dataTransfer.files[0], zone.type)
                }
              }}
              onClick={() => triggerUpload(zone.type)}
              className={`relative rounded-3xl border-2 border-dashed ${zone.border} transition-all duration-200 p-6 cursor-pointer group ${
                dragOver === zone.type ? 'scale-[1.02] bg-accent' : 'bg-card hover:bg-muted/30'
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${zone.bg} mb-4`}>
                <zone.icon className={`h-6 w-6 ${zone.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{zone.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{zone.description}</p>
              <Button
                variant="outline"
                size="sm"
                className={`w-full gap-2 border ${zone.border} ${zone.color}`}
                onClick={(e) => {
                  e.stopPropagation()
                  triggerUpload(zone.type)
                }}
              >
                <Upload className="h-3.5 w-3.5" />
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">or drag & drop PDF</p>
            </div>
          ))}
        </div>
      )}

      {/* Processing queue */}
      {processingCount > 0 && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              Processing Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {personalUploads.filter((u) => u.status === 'processing').map((f) => (
              <div key={f.id} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground truncate">{f.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs border border-primary/20 bg-primary/5 text-primary shrink-0">
                    Analyzing...
                  </Badge>
                </div>
                <Progress value={65} className="h-1.5 animate-pulse" />
                <p className="text-xs text-muted-foreground">Extracting topics and concepts from PDF...</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Uploaded files list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          {personalUploads.filter((u) => u.status !== 'processing').length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground">No personal files uploaded yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Upload a PDF to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {personalUploads.filter((u) => u.status !== 'processing').map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {f.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{f.size}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{f.uploadedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={`text-xs border capitalize ${typeColors[f.type]}`}>
                      {f.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {statusIcon[f.status]}
                      <span className="text-xs text-muted-foreground">{statusLabel[f.status]}</span>
                    </div>
                    {f.topicsExtracted && (
                      <span className="text-xs text-muted-foreground">{f.topicsExtracted} topics</span>
                    )}

                    {f.fileData && (
                      <a href={`data:application/pdf;base64,${f.fileData}`} download={f.name}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeUpload(f.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extracted subjects preview */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Extracted Subject Topics</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {extractedSubjectsArray.map((s) => (
            <Card key={s.subject} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">{s.subject}</p>
                  <Badge variant="secondary" className="text-xs">{s.count} topics</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.topics.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-muted rounded-md px-2 py-0.5 text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                  {s.topics.length === 0 && (
                    <span className="text-xs text-muted-foreground italic">No descriptive topics extracted</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
