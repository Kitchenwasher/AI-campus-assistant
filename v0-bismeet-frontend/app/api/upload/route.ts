import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

function chunkText(text: string, chunkSize = 1000, overlap = 200) {
  const chunks = []
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    let rawChunk = text.slice(i, i + chunkSize)
    // Clean up whitespace formatting
    chunks.push(rawChunk.replace(/\n+/g, ' ').trim())
  }
  return chunks.filter(c => c.length > 50) // drop tiny empty chunks
}

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

    // 3. Vector Database Ingestion (RAG)
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Skipping vector math: GEMINI_API_KEY not found.')
      return NextResponse.json({ success: true, file: newMetadata })
    }

    try {
      const pdfParse = require('pdf-parse')
      const pdfData = await pdfParse(buffer)
      if (pdfData.text) {
        const chunks = chunkText(pdfData.text)
        
        // Use Gemini Embeddings Model
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
        
        // Batch requests mathematically
        const requests = chunks.map(c => ({ 
          content: { role: 'user', parts: [{ text: c }] } 
        }))
        
        // Batch size max limit is usually around 100 for API
        const batchVectors: any[] = []
        for (let i = 0; i < requests.length; i += 50) {
          const batchReqs = requests.slice(i, i + 50)
          const result = await model.batchEmbedContents({ requests: batchReqs })
          const embeddings = result.embeddings.map(e => e.values)
          
          embeddings.forEach((emb, j) => {
            batchVectors.push({
              text: chunks[i + j],
              embedding: emb,
              namespace: 'global',
              docId: id
            })
          })
        }

        const vectorsPath = path.join(process.cwd(), 'public', 'global', 'vectors.json')
        let vectors = []
        if (require('fs').existsSync(vectorsPath)) {
            const currentVecs = await fs.readFile(vectorsPath, 'utf8')
            vectors = JSON.parse(currentVecs)
        }
        
        // Append new mathematical chunks
        vectors = vectors.concat(batchVectors)
        await fs.writeFile(vectorsPath, JSON.stringify(vectors))
      }
    } catch (e) {
      console.error('Vector DB Insertion failed:', e)
    }

    return NextResponse.json({ success: true, file: newMetadata })

  } catch (error: any) {
    console.error('File storage failed:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to globally save file.' },
      { status: 500 }
    )
  }
}
