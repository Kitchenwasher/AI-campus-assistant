import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { promises as fs } from 'fs'
import path from 'path'

// Initialize the Gemini client using the key from .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Fast native maths for RAG scoring
function cosineSimilarity(A: number[], B: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < A.length; i++) {
    dotProduct += A[i] * B[i];
    normA += A[i] * A[i];
    normB += B[i] * B[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(req: NextRequest) {
  try {
    const { messages, localVectors = [] } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Server is missing GEMINI_API_KEY.' },
        { status: 500 }
      )
    }

    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))
    
    const lastUserMessage = messages[messages.length - 1].content

    // 1. Generate Mathematical Vector for the User's Message
    const embedModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
    const queryEmbedReq = await embedModel.embedContent(lastUserMessage)
    const queryVector = queryEmbedReq.embedding.values

    // 2. Load the Physical Global Database
    let globalVectors: any[] = []
    try {
      const vectorPath = path.join(process.cwd(), 'public', 'global', 'vectors.json')
      const fileData = await fs.readFile(vectorPath, 'utf8')
      globalVectors = JSON.parse(fileData)
    } catch (e) {
      console.warn('No physical global vectors.json database found yet.')
    }

    // 3. Pool BOTH multi-tenant databases dynamically
    const unifiedVectors = [...globalVectors, ...localVectors]

    // 4. Run Cosine Similarity against all Mathematical nodes simultaneously
    const scoredChunks = unifiedVectors.map(vec => ({
      ...vec,
      score: cosineSimilarity(queryVector, vec.embedding)
    }))

    // 5. Isolate highest relevancy chunks
    scoredChunks.sort((a, b) => b.score - a.score)
    const topChunks = scoredChunks.slice(0, 5) // TOP 5 best matches

    const systemPrompt = 'You are CampusMind AI, an intelligent college assistant. Answer the user strictly based on the provided retrieved documentation blocks. If not in the blocks, formulate a highly confident hypothesis based on academic knowledge but specify it is generalized.'

    const parts: any[] = []
    parts.push({ text: systemPrompt + '\n' })
    
    if (topChunks.length > 0) {
      parts.push({ text: '\n--- RELEVANT EXTRACTED FRAGMENTS ---\n' })
      for (const chunk of topChunks) {
        parts.push({ text: `From Source (${chunk.namespace || 'unknown'}):\n"${chunk.text}"\n\n` })
      }
      parts.push({ text: '-----------------------------\n' })
    }

    parts.push({ text: `\nUser Question: ${lastUserMessage}` })

    // Start chat session with historical context
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    })

    // Send the multimodal parts
    const result = await chat.sendMessage(parts)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error('Error generating AI response:', error)
    return NextResponse.json(
      { error: error.message || 'Error occurred while contacting Gemini' },
      { status: 500 }
    )
  }
}
