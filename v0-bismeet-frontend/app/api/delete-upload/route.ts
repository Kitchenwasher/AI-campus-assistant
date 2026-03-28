import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LIBRARY_JSON_PATH = path.join(process.cwd(), 'public', 'global', 'library.json')
const GLOBAL_FILES_DIR = path.join(process.cwd(), 'public', 'global', 'files')

export async function DELETE(request: NextRequest) {
  try {
    const { id, name } = await request.json()

    if (!id || !name) {
      return NextResponse.json({ error: 'Missing ID or filename' }, { status: 400 })
    }

    // 1. Unlink physical server file
    const safeFilename = name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const physicalPath = path.join(GLOBAL_FILES_DIR, safeFilename)

    if (fs.existsSync(physicalPath)) {
      fs.unlinkSync(physicalPath)
    }

    // 2. Remove entry from library.json
    if (fs.existsSync(LIBRARY_JSON_PATH)) {
      const dbContent = fs.readFileSync(LIBRARY_JSON_PATH, 'utf-8')
      let library = JSON.parse(dbContent)
      
      // Filter out the deleted file by ID
      library = library.filter((file: any) => file.id !== id)
      
      // Save back to JSON
      fs.writeFileSync(LIBRARY_JSON_PATH, JSON.stringify(library, null, 2))
    }

    return NextResponse.json({ success: true, message: 'File permanently deleted from Global Registry.' })
    
  } catch (error) {
    console.error('SERVER DELETION ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to process deletion request.' },
      { status: 500 }
    )
  }
}
