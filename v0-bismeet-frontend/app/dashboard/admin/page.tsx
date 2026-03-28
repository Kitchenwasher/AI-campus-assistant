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
  Download,
  Trash2,
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
    title: 'Global Syllabus PDFs',
    description: 'Upload course syllabi for universal student access.',
    accept: '.pdf',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30 hover:border-blue-500',
  },
  {
    type: 'notes' as const,
    icon: FileText,
    title: 'Global Lecture Notes',
    description: 'Upload official lecture notes to the central database.',
    accept: '.pdf',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30 hover:border-green-500',
  },
  {
    type: 'pyq' as const,
    icon: FlaskConical,
    title: 'Global PYQs',
    description: 'Provide canonical Previous Year Papers for all students.',
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
  processed: 'Uploaded to Server',
  processing: 'Uploading...',
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

export default function AdminPage() {
  const [dragOver, setDragOver] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeUploadZone, setActiveUploadZone] = useState<UploadedFile['type']>('notes')
  
  const { uploads, addUpload, updateUploadStatus, removeUpload, isDeveloper } = useUploads()

  const handleDeleteFile = async (id: string, name: string) => {
    try {
      const res = await fetch('/api/delete-upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
      })
      if (res.ok) {
        removeUpload(id)
      } else {
        console.error("Failed to delete file from server.")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleFileUpload = async (file: File, type: UploadedFile['type']) => {
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

    // Direct Server File Upload (Global Mode ALWAYS ON HERE)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (res.ok) {
        removeUpload(id) // clear processing dummy
        addUpload(data.file) // insert confirmed global
      } else {
        updateUploadStatus(id, 'failed')
      }
    } catch (error) {
      console.error('API Upload failed', error)
      updateUploadStatus(id, 'failed')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0], activeUploadZone)
    }
  }

  const triggerUpload = (type: UploadedFile['type']) => {
    setActiveUploadZone(type)
    fileInputRef.current?.click()
  }

  // we only care about Global files in the admin view.
  const globalUploads = uploads.filter(u => u.isGlobal);
  const processingCount = uploads.filter((u) => u.status === 'processing').length

  if (!isDeveloper) {
    return (
       <div className="flex h-[80vh] items-center justify-center">
         <div className="text-center space-y-4">
           <div className="mx-auto h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
             <X className="h-8 w-8 text-destructive" />
           </div>
           <p className="text-2xl text-foreground font-black tracking-tight">Access Denied</p>
           <p className="text-muted-foreground">You must have active Developer Privileges to access the routing portal.</p>
         </div>
       </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <span className="text-orange">DEVELOPER</span> PORTAL
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Centrally upload course materials. These will be securely persisted on the server and globally broadcasted to every student's dashboard.
          </p>
        </div>
      </div>

      {/* Upload zones */}
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
              Upload Global PDF
            </Button>
          </div>
        ))}
      </div>

      {/* Processing queue */}
      {processingCount > 0 && (
        <Card className="border-orange/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange">
              <Loader2 className="h-4 w-4 animate-spin" />
              Writing to Server...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploads.filter((u) => u.status === 'processing').map((f) => (
              <div key={f.id} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground truncate">{f.name}</span>
                  </div>
                </div>
                <Progress value={65} className="h-1.5 animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Uploaded files list */}
      <h3 className="text-xl font-bold mt-10 tracking-tight">Active Global Server Registry</h3>
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">public/global/library.json</CardTitle>
        </CardHeader>
        <CardContent>
          {globalUploads.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground">The central server library is empty.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {globalUploads.map((f) => (
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
                    <Badge variant="secondary" className="bg-orange/20 text-orange hover:bg-orange/30 border-none capitalize">
                      {f.type} Record
                    </Badge>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-xs text-muted-foreground">Active Server File</span>
                    </div>

                    {f.path && (
                      <div className="flex items-center gap-1">
                        <a href={f.path} download>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                          onClick={() => handleDeleteFile(f.id, f.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
