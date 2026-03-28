// ──────────────────────────────────────────────
// CampusMind AI — Mock Data
// ──────────────────────────────────────────────

export const mockUser = {
  name: 'Aryan Mehta',
  email: 'aryan.mehta@college.edu',
  avatar: '',
  college: 'Mumbai Institute of Technology',
  semester: '6th Semester',
  year: 'Third Year',
}

// ── Deadlines ──────────────────────────────────
export type DeadlineItem = {
  id: string
  course: string
  title: string
  dueDate: string
  type: 'assignment' | 'quiz' | 'assessment'
  status: 'pending' | 'submitted' | 'overdue' | 'graded'
  urgency: 'today' | 'week' | 'overdue'
}

export const mockDeadlines: DeadlineItem[] = [
  { id: '1', course: 'DBMS', title: 'ER Diagram Assignment', dueDate: 'Today, 11:59 PM', type: 'assignment', status: 'pending', urgency: 'today' },
  { id: '2', course: 'Computer Networks', title: 'Mid-Semester Quiz', dueDate: 'Today, 3:00 PM', type: 'quiz', status: 'pending', urgency: 'today' },
  { id: '3', course: 'Operating Systems', title: 'Memory Management Lab', dueDate: 'Tomorrow, 11:59 PM', type: 'assignment', status: 'pending', urgency: 'week' },
  { id: '4', course: 'Software Engineering', title: 'SRS Document', dueDate: 'March 29, 2026', type: 'assessment', status: 'pending', urgency: 'week' },
  { id: '5', course: 'Data Structures', title: 'Graph Algorithms Implementation', dueDate: 'March 31, 2026', type: 'assignment', status: 'pending', urgency: 'week' },
  { id: '6', course: 'DBMS', title: 'SQL Query Lab', dueDate: 'March 20, 2026', type: 'assignment', status: 'overdue', urgency: 'overdue' },
  { id: '7', course: 'Computer Networks', title: 'OSI Model Quiz', dueDate: 'March 18, 2026', type: 'quiz', status: 'overdue', urgency: 'overdue' },
  { id: '8', course: 'Operating Systems', title: 'Process Scheduling Assignment', dueDate: 'March 22, 2026', type: 'assignment', status: 'overdue', urgency: 'overdue' },
]

// ── Uploads ────────────────────────────────────
export type UploadedFile = {
  id: string
  name: string
  type: 'syllabus' | 'notes' | 'pyq'
  subject: string
  size: string
  uploadedAt: string
  status: 'processed' | 'processing' | 'failed'
  topicsExtracted?: number
  extractedTopicsList?: string[]
  fileData?: string
  isGlobal?: boolean
  path?: string
  localVectors?: { text: string; embedding: number[]; namespace: string; docId: string }[]
}

export const mockUploads: UploadedFile[] = [
  { id: '1', name: 'DBMS_Syllabus_2024.pdf', type: 'syllabus', subject: 'DBMS', size: '1.2 MB', uploadedAt: '2 days ago', status: 'processed', topicsExtracted: 14 },
  { id: '2', name: 'CN_Unit3_Notes.pdf', type: 'notes', subject: 'Computer Networks', size: '3.5 MB', uploadedAt: '1 day ago', status: 'processed', topicsExtracted: 22 },
  { id: '3', name: 'OS_PYQ_2022-2023.pdf', type: 'pyq', subject: 'Operating Systems', size: '2.8 MB', uploadedAt: '3 days ago', status: 'processed', topicsExtracted: 31 },
  { id: '4', name: 'SE_Syllabus_2024.pdf', type: 'syllabus', subject: 'Software Engineering', size: '0.9 MB', uploadedAt: '5 days ago', status: 'processed', topicsExtracted: 11 },
]

// ── PYQ Insights ───────────────────────────────
export type PYQTopic = {
  id: string
  topic: string
  subject: string
  importance: number
  category: 'long' | 'short' | 'unit'
  reason: string
  confidence: 'high' | 'medium' | 'low'
  appearances: number
}

export const mockPYQTopics: PYQTopic[] = [
  { id: '1', topic: 'Normalization (1NF, 2NF, 3NF, BCNF)', subject: 'DBMS', importance: 97, category: 'long', reason: 'Appeared in 8/10 previous papers as a major question', confidence: 'high', appearances: 8 },
  { id: '2', topic: 'TCP/IP Protocol Suite', subject: 'Computer Networks', importance: 92, category: 'long', reason: 'Core concept repeated across 7 previous exams', confidence: 'high', appearances: 7 },
  { id: '3', topic: 'Process Scheduling Algorithms', subject: 'Operating Systems', importance: 91, category: 'long', reason: 'FCFS, SJF, Round Robin covered in 6/8 papers', confidence: 'high', appearances: 6 },
  { id: '4', topic: 'ER Diagram Design', subject: 'DBMS', importance: 88, category: 'long', reason: 'Practical question in 7 out of 10 papers', confidence: 'high', appearances: 7 },
  { id: '5', topic: 'Deadlock Detection & Prevention', subject: 'Operating Systems', importance: 85, category: 'unit', reason: 'Chapter with highest frequency in short answers', confidence: 'high', appearances: 5 },
  { id: '6', topic: 'SQL Joins & Subqueries', subject: 'DBMS', importance: 83, category: 'short', reason: 'Short question every year for 6 years', confidence: 'high', appearances: 6 },
  { id: '7', topic: 'OSI vs TCP/IP Model', subject: 'Computer Networks', importance: 80, category: 'short', reason: 'Definitional comparison question in 5 papers', confidence: 'medium', appearances: 5 },
  { id: '8', topic: 'UML Diagrams', subject: 'Software Engineering', importance: 75, category: 'long', reason: 'Class diagrams & sequence diagrams repeated 4 times', confidence: 'medium', appearances: 4 },
  { id: '9', topic: 'Paging & Segmentation', subject: 'Operating Systems', importance: 72, category: 'short', reason: 'Memory management questions appear frequently', confidence: 'medium', appearances: 4 },
  { id: '10', topic: 'SDLC Models', subject: 'Software Engineering', importance: 70, category: 'unit', reason: 'Waterfall & Agile discussed in multiple papers', confidence: 'medium', appearances: 4 },
]

// ── Video Recommendations ──────────────────────
export type VideoRecommendation = {
  id: string
  title: string
  channel: string
  duration: string
  views: string
  likes: string
  thumbnail: string
  subject: string
  reason: string
  tags: string[]
  featured?: boolean
}

export const mockVideos: VideoRecommendation[] = [
  { id: '1', title: 'Database Normalization - 1NF 2NF 3NF BCNF with Examples', channel: 'Neso Academy', duration: '28:14', views: '2.4M', likes: '67K', thumbnail: 'https://img.youtube.com/vi/ABwD8IYByfk/maxresdefault.jpg', subject: 'DBMS', reason: 'Directly covers your highest PYQ topic', tags: ['High syllabus match', 'PYQ relevant', 'Best for revision'], featured: true },
  { id: '2', title: 'TCP/IP Model Explained - Computer Networks', channel: 'Gate Smashers', duration: '32:07', views: '1.8M', likes: '54K', thumbnail: 'https://img.youtube.com/vi/2QGgEk20RXM/maxresdefault.jpg', subject: 'Computer Networks', reason: 'Top PYQ topic for CN — thorough explanation', tags: ['High syllabus match', 'PYQ relevant'], featured: true },
  { id: '3', title: 'Process Scheduling - OS Algorithms FCFS SJF Round Robin', channel: 'Neso Academy', duration: '45:21', views: '3.1M', likes: '89K', thumbnail: 'https://img.youtube.com/vi/Jkmy2YLUbUY/maxresdefault.jpg', subject: 'Operating Systems', reason: 'Covers 3 most important PYQ scheduling algorithms', tags: ['High syllabus match', 'PYQ relevant', 'Best for revision'], featured: true },
  { id: '4', title: 'ER Diagram Design — Complete Guide with Examples', channel: 'Knowledge Gate', duration: '19:42', views: '890K', likes: '31K', thumbnail: 'https://img.youtube.com/vi/ztHopE5Wnpc/maxresdefault.jpg', subject: 'DBMS', reason: 'Practical ER diagram for upcoming assignment', tags: ['High syllabus match', 'PYQ relevant'] },
  { id: '5', title: 'SQL Joins - INNER JOIN, LEFT JOIN, RIGHT JOIN', channel: 'Traversy Media', duration: '22:15', views: '1.2M', likes: '43K', thumbnail: 'https://img.youtube.com/vi/9yeOJ0ZMUYw/maxresdefault.jpg', subject: 'DBMS', reason: 'SQL joins appear as a short answer every year', tags: ['PYQ relevant', 'Best for revision'] },
  { id: '6', title: 'Deadlock in Operating Systems - Detection & Prevention', channel: 'Gate Smashers', duration: '27:33', views: '760K', likes: '28K', thumbnail: 'https://img.youtube.com/vi/UVo9mGARkhQ/maxresdefault.jpg', subject: 'Operating Systems', reason: 'High priority unit from PYQ analysis', tags: ['High syllabus match', 'PYQ relevant'] },
  { id: '7', title: 'UML Diagrams Complete Course - Class & Sequence Diagrams', channel: 'Lucidchart', duration: '38:52', views: '540K', likes: '19K', thumbnail: 'https://img.youtube.com/vi/OkC7HKtiZC0/maxresdefault.jpg', subject: 'Software Engineering', reason: 'UML is repeated in 4 SE previous papers', tags: ['High syllabus match'] },
  { id: '8', title: 'OSI Model Explained - All 7 Layers', channel: 'Neso Academy', duration: '16:08', views: '4.2M', likes: '112K', thumbnail: 'https://img.youtube.com/vi/vv4y_uOneC0/maxresdefault.jpg', subject: 'Computer Networks', reason: 'OSI vs TCP/IP is a definitive short answer question', tags: ['PYQ relevant', 'Best for revision'] },
]

// ── AI Chat Messages ───────────────────────────
export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  timestamp: string
}

export const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'What should I study today?',
    timestamp: '10:02 AM',
  },
  {
    id: '2',
    role: 'assistant',
    content: `Based on your deadlines and PYQ analysis, here's your priority list for today:

**1. DBMS — ER Diagram Assignment** (Due today at 11:59 PM)
Start with this immediately. Review entity types, relationships, and cardinality. Your notes from Unit 2 cover this well.

**2. Computer Networks — Mid-Semester Quiz** (Due today at 3:00 PM)
Focus on the OSI model, TCP/IP protocol, and the top 3 topics from your PYQ report. Spend 45 minutes here.

**3. OS Concepts — Light Review**
Skim through process scheduling notes for tomorrow's lab. 20 minutes max.

I've queued the top-matched YouTube videos for each topic in your recommendations panel.`,
    sources: ['Classroom', 'PYQs', 'Notes'],
    timestamp: '10:02 AM',
  },
  {
    id: '3',
    role: 'user',
    content: 'Which topics are most important for the DBMS exam?',
    timestamp: '10:05 AM',
  },
  {
    id: '4',
    role: 'assistant',
    content: `Based on 10 years of DBMS PYQ analysis, here are the **must-know topics**:

**Very High Priority (90%+ confidence)**
- Normalization (1NF, 2NF, 3NF, BCNF) — appeared in 8/10 papers
- ER Diagram Design — practical question in 7/10 papers
- SQL Joins & Subqueries — short answer every year for 6 years

**High Priority**
- Transaction Management & ACID properties
- Relational Algebra operations
- B+ Tree indexing

**Medium Priority**
- File organization methods
- Query optimization basics

I recommend spending 60% of your DBMS prep time on the top 3 topics above.`,
    sources: ['PYQs', 'Notes'],
    timestamp: '10:05 AM',
  },
]

export const mockSuggestedPrompts = [
  'What should I study today?',
  'What deadlines are coming up?',
  'Which topics are important for exams?',
  'Recommend videos for DBMS normalization',
  'Summarize Unit 3 of Operating Systems',
  'Create a 7-day study schedule',
]

// ── Dashboard Stats ────────────────────────────
export const mockDashboardStats = {
  dueToday: 2,
  dueThisWeek: 5,
  overdue: 3,
  importantTopics: 10,
}

export const mockSubjectProgress = [
  { subject: 'DBMS', readiness: 72, color: 'hsl(264, 70%, 60%)' },
  { subject: 'OS', readiness: 58, color: 'hsl(220, 70%, 60%)' },
  { subject: 'CN', readiness: 65, color: 'hsl(180, 60%, 50%)' },
  { subject: 'SE', readiness: 80, color: 'hsl(145, 60%, 50%)' },
  { subject: 'DS', readiness: 45, color: 'hsl(30, 70%, 55%)' },
]

export const mockChartData = [
  { subject: 'DBMS', readiness: 72 },
  { subject: 'OS', readiness: 58 },
  { subject: 'CN', readiness: 65 },
  { subject: 'SE', readiness: 80 },
  { subject: 'DS', readiness: 45 },
]
