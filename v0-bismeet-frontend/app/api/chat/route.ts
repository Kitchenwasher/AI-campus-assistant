import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { promises as fs } from 'fs'
import path from 'path'

// Initialize the Gemini client using the key from .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const { messages, documents } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Server is missing GEMINI_API_KEY. Please add it to .env.local.' },
        { status: 500 }
      )
    }

    // Get the basic textual messages history minus the last user message
    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))
    
    const lastUserMessage = messages[messages.length - 1].content

    // Get the flash model (Flash supports massive multi-modal contexts effortlessly)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const systemPrompt = 'You are CampusMind AI, an intelligent college assistant. Answer the user strictly based on the provided documents. If not in the documents, try to be helpful based on general knowledge.'

    // Build the parts array for the current message
    const parts: any[] = []
    parts.push({ text: systemPrompt + '\n' })
    
    if (documents && documents.length > 0) {
      parts.push({ text: '\n--- ATTACHED DOCUMENTS ---\n' })
      for (const doc of documents) {
        let base64Data = doc.data
        if (doc.isGlobal && doc.path) {
          // Pull directly from the physical Local Server storage if global
          try {
            // Strip leading slash to prevent Windows path.join override issues
            const safePath = doc.path.replace(/^\//, '')
            const filePath = path.join(process.cwd(), 'public', safePath)
            const fileBuffer = await fs.readFile(filePath)
            base64Data = fileBuffer.toString('base64')
          } catch (e) {
            console.error(`Failed to read global file ${doc.name}:`, e)
            continue
          }
        }

        parts.push({ text: `Document: ${doc.name}\n` })
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: 'application/pdf'
          }
        })
      }
      parts.push({ text: '\n-----------------------------\n' })
    }

    parts.push({ text: `\nUser Question: ${lastUserMessage}` })

    // Start chat session with historical context
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
