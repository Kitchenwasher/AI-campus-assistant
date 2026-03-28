import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

function chunkText(text: string, chunkSize = 1000, overlap = 200) {
  const chunks = []
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    let rawChunk = text.slice(i, i + chunkSize)
    chunks.push(rawChunk.replace(/\n+/g, ' ').trim())
  }
  return chunks.filter(c => c.length > 50)
}

export async function POST(req: NextRequest) {
  try {
    const { base64, docId } = await req.json()

    if (!base64 || !docId) {
      return NextResponse.json({ error: 'Missing base64 payload or docId' }, { status: 400 })
    }

    const buffer = Buffer.from(base64, 'base64')
    const pdfParse = require('pdf-parse')
    const pdfData = await pdfParse(buffer)
    
    if (!pdfData.text) {
        return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 })
    }

    const chunks = chunkText(pdfData.text)
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Server missing GEMINI_API_KEY' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
    const requests = chunks.map(c => ({ 
      content: { role: 'user', parts: [{ text: c }] } 
    }))

    const localVectors: any[] = []
    
    // Process mathematically in batches of 50
    for (let i = 0; i < requests.length; i += 50) {
      const batchReqs = requests.slice(i, i + 50)
      const result = await model.batchEmbedContents({ requests: batchReqs })
      const embeddings = result.embeddings.map(e => e.values)
      
      embeddings.forEach((emb, j) => {
        localVectors.push({
          text: chunks[i + j],
          embedding: emb,
          namespace: 'student_personal',
          docId
        })
      })
    }

    return NextResponse.json({ success: true, vectors: localVectors })

  } catch (error: any) {
    console.error('Local Embedding failed:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to embed local file.' },
      { status: 500 }
    )
  }
}
