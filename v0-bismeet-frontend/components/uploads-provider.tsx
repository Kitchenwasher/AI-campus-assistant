'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { mockUploads, type UploadedFile } from '@/lib/mock-data'

type UploadsContextType = {
  uploads: UploadedFile[]
  addUpload: (file: UploadedFile) => void
  updateUploadStatus: (id: string, status: UploadedFile['status'], topicsExtracted?: number, extractedTopicsList?: string[], fileData?: string) => void
  removeUpload: (id: string) => void
  isDeveloper: boolean
  setIsDeveloper: (val: boolean) => void
}

const UploadsContext = createContext<UploadsContextType | undefined>(undefined)

export function UploadsProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<UploadedFile[]>(mockUploads)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDeveloper, setIsDeveloperState] = useState(false)

  // Wrapper for setIsDeveloper that also persists to localStorage
  const setIsDeveloper = (val: boolean) => {
    setIsDeveloperState(val)
    localStorage.setItem('campusmind_is_developer', val ? 'true' : 'false')
  }

  // Load from local storage and global server library on mount
  useEffect(() => {
    async function loadData() {
      let localData: UploadedFile[] = mockUploads
      
      // Load personal
      try {
        const stored = localStorage.getItem('campusmind_uploads')
        if (stored) {
          localData = JSON.parse(stored)
          // THE FIX: Immediately purge any files permanently stuck in "processing" state
          localData = localData.filter(u => u.status !== 'processing')
        }
      } catch (e) {
        console.error('Failed to parse uploads from local storage', e)
      }

      // Load auth mock state
      const devState = localStorage.getItem('campusmind_is_developer')
      if (devState === 'true') {
        setIsDeveloperState(true)
      }

      // Load global
      try {
        const res = await fetch('/global/library.json')
        if (res.ok) {
          const globalData = await res.json()
          // Filter out existing globals just in case, then merge server globals first
          localData = localData.filter(u => !u.isGlobal)
          localData = [...globalData, ...localData]
        }
      } catch (e) {
        console.warn('Could not fetch global library', e)
      }

      setUploads(localData)
      setIsLoaded(true)
    }

    loadData()
  }, [])

  // Save changes to local storage
  useEffect(() => {
    if (isLoaded) {
      try {
        const localOnly = uploads.filter(u => !u.isGlobal)
        localStorage.setItem('campusmind_uploads', JSON.stringify(localOnly))
      } catch (e) {
        console.warn('Storage quota exceeded or error saving to local storage', e)
      }
    }
  }, [uploads, isLoaded])

  const addUpload = (file: UploadedFile) => {
    setUploads((prev) => [file, ...prev])
  }

  const updateUploadStatus = (id: string, status: UploadedFile['status'], topicsExtracted?: number, extractedTopicsList?: string[], fileData?: string) => {
    setUploads((prev: UploadedFile[]) =>
      prev.map((u: UploadedFile) =>
        u.id === id ? { ...u, status, ...(topicsExtracted !== undefined && { topicsExtracted }), ...(extractedTopicsList !== undefined && { extractedTopicsList }), ...(fileData !== undefined && { fileData }) } : u
      )
    )
  }

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <UploadsContext.Provider value={{ uploads, addUpload, updateUploadStatus, removeUpload, isDeveloper, setIsDeveloper }}>
      {children}
    </UploadsContext.Provider>
  )
}

export function useUploads() {
  const context = useContext(UploadsContext)
  if (context === undefined) {
    throw new Error('useUploads must be used within an UploadsProvider')
  }
  return context
}
