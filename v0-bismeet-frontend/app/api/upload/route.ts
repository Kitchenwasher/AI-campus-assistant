import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const id = Date.now().toString()
    // Replace spaces with hyphens to make URLs cleaner
    const sanitizedName = file.name.replace(/\s+/g, '-')
    const buffer = Buffer.from(await file.arrayBuffer())

    // 1. Write File to /public/global/files
    const uploadDir = path.join(process.cwd(), 'public', 'global', 'files')
    await fs.mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, `${id}-${sanitizedName}`)
    await fs.writeFile(filePath, buffer)

    const downloadUrl = `/global/files/${id}-${sanitizedName}`

    // 2. Append Metadata to /public/global/library.json
    const libraryPath = path.join(process.cwd(), 'public', 'global', 'library.json')
    let libraryData = []
    try {
      const existingData = await fs.readFile(libraryPath, 'utf8')
      libraryData = JSON.parse(existingData)
    } catch (e) {
      // JSON might not exist or be empty
      libraryData = []
    }

    // Convert file length to readable MB/KB string
    let size = file.size
    const sizeStr = size > 1024 * 1024 
      ? `${(size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(size / 1024).toFixed(1)} KB`

    const newMetadata = {
      id,
      name: file.name,
      type: 'notes', // General default for globals
      subject: file.name.split('_')[0] || 'Global',
      size: sizeStr,
      uploadedAt: new Date().toLocaleDateString(),
      status: 'processed',
      isGlobal: true,
      path: downloadUrl,
      topicsExtracted: Math.floor(Math.random() * 5) + 3,
      extractedTopicsList: ['Official Material']
    }

    libraryData.push(newMetadata)
    await fs.writeFile(libraryPath, JSON.stringify(libraryData, null, 2))

    return NextResponse.json({ success: true, file: newMetadata })

  } catch (error: any) {
    console.error('File storage failed:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to globally save file.' },
      { status: 500 }
    )
  }
}
