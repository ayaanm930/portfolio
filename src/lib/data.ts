// src/lib/data.ts

export const personalInfo = {
  name: 'Ayaan Mughal',
  title: 'CS Graduate',
  email: 'ayaanmughal03@gmail.com',
  github: 'https://github.com/ayaanm930',
  linkedin: 'https://linkedin.com/in/ayaan-mughal',
  phone: '+92 315 2092828',
  resumeUrl: '/resume_AyaanMughal.pdf',
  location: 'Islamabad, Pakistan',
  educationPeriod: 'Sep 2022 - Jun 2026',
  seeking: 'Entry-level AI / Software Engineering Role',
  bio: 'Final-year CS student at FAST-NUCES with hands-on ML/AI internship experience building Whisper ASR pipelines and LLM-powered automation. Shipped production-integrated features across speech recognition, computer vision, and NLP summarization. Seeking an entry-level AI or software engineering role where I can build intelligent systems that actually get used.',
}

// ==================== SINGLE SOURCE OF TRUTH FOR SKILLS ====================
// All skills from your resume, grouped logically, no duplicates.
export const technicalSkills = {
  Languages: ['Python', 'C/C++', 'Java', 'JavaScript', 'Kotlin', 'SQL'],
  'AI / ML': ['PyTorch', 'TensorFlow', 'Whisper ASR', 'Hugging Face Transformers', 'OpenCV', 'scikit-learn'],
  'LLM & NLP': ['Prompt engineering', 'LLM integration', 'Summarization pipelines', 'RAG workflows'],
  'Web / Mobile': ['Node.js', 'Express', 'React', 'MongoDB', 'REST APIs', 'Android (Kotlin)', 'Flutter'],
  'DevOps & Tools': ['Git', 'Docker', 'Linux', 'CI/CD', 'n8n workflow automation', 'AI-assisted development'],
}

// For "The Core" zone display – picks a curated subset, still no duplication across categories.
export const skills = {
  intelligence: ['PyTorch', 'TensorFlow', 'Whisper ASR', 'Hugging Face Transformers'],
  language: ['LLM integration', 'Prompt engineering', 'RAG workflows', 'Summarization pipelines'],
  systems: ['Python', 'C/C++', 'Docker', 'Linux'],
  interfaces: ['React', 'Node.js', 'Kotlin', 'Flutter'],
}

// ==================== TYPES ====================
export type ExperienceEntry = {
  role: string
  company: string
  period: string
  location: string
  highlights: string[]
}

export type EducationEntry = {
  institution: string
  degree: string
  period: string
  location: string
  courses: string[]
}

export type Project = {
  title: string
  type: string
  status?: 'active' | 'completed'
  period?: string
  description: string
  stack: string[]
  pipeline?: string[]
  github: string
  highlights: string[]
}

// ==================== PROJECTS ====================
export const projects: Project[] = [
  {
    title: 'Automated Scrum Master (ScrumMate)',
    type: 'Final Year Project',
    status: 'completed',
    period: 'Aug 2025 - May 2026',
    description: 'Agentic pipeline: transcripts → RAG → user stories → sprint planning. 70–80% accuracy in automated user story generation.',
    stack: ['Python', 'n8n', 'LLM APIs', 'REST APIs', 'Gemini', 'ChromaDB', 'FastAPI', 'RAG'],
    pipeline: ['Chunking', 'Embedding', 'Summary', 'Stories', 'Assignment', 'RAG'],
    github: 'https://github.com/mishalali-A2/ScrumMate',
    highlights: [
      'Architected AI-driven Agile system automating sprint planning, backlog scoring, and meeting facilitation via LLM-based workflows',
      'Saved 2+ hours of manual project management per sprint',
      'Implemented backlog prioritization heuristics and sprint division logic with n8n pipelines',
      'Validated against curated backlog entries with 70–80% accuracy',
    ],
  },
  {
    title: 'Hotel Booking Platform',
    type: 'Full-stack',
    status: 'completed',
    period: '2023',
    description: 'Full-stack booking platform with role-based access control and JWT authentication.',
    stack: ['Node.js', 'React', 'MongoDB', 'Express', 'JWT'],
    github: 'https://github.com/ayaanm930/hotel-booking',
    highlights: [
      'Role-based access control across distinct user and admin flows',
      'JWT authentication with persistent session management',
      'Responsive React frontend consuming structured Express/MongoDB backend',
      'End-to-end CRUD operations',
    ],
  },
  {
    title: 'Autonomous Racing Agent',
    type: 'Reinforcement Learning',
    status: 'completed',
    period: '2024',
    description: 'DQN-based autonomous driving agent trained in TORCS simulation environment.',
    stack: ['Python', 'TensorFlow', 'Deep Reinforcement Learning', 'TORCS'],
    github: 'https://github.com/ayaanm930/racing-agent',
    highlights: [
      'Trained DQN-based autonomous driving agent with custom reward shaping',
      'Implemented full training loop with replay buffer',
      'Developed quantitative evaluation metrics for policy performance',
    ],
  },
  {
    title: 'Dietary Management Android App',
    type: 'Mobile',
    status: 'completed',
    period: '2025',
    description: 'Production-structured Android app for meal tracking and nutrition management.',
    stack: ['Kotlin', 'MVVM', 'Android', 'REST APIs'],
    github: 'https://github.com/ayaanm930/dietary-app',
    highlights: [
      'MVVM architecture with offline data persistence',
      'Background services for sync and notifications',
      'Versioned REST API layer for cloud synchronization',
    ],
  },
]

// ==================== EXPERIENCE ====================
export const experience: ExperienceEntry[] = [
  {
    role: 'ML / AI Intern',
    company: 'Genesys Research Lab',
    period: 'Jun 2025 - Aug 2025',
    location: 'Islamabad, Pakistan',
    highlights: [
      'Built end-to-end Whisper ASR pipelines for real-time transcription, speaker segmentation, and audio preprocessing within a meeting intelligence platform',
      'Developed LLM-powered summarization modules with structured prompt engineering to automatically extract action items, decisions, and meeting summaries',
      'Developed computer vision features using OpenCV for video frame extraction',
      'Automated model evaluation and preprocessing workflows using Python, reducing manual pipeline overhead',
    ],
  },
]

// ==================== EDUCATION ====================
export const education: EducationEntry[] = [
  {
    institution: 'FAST-NUCES (National University of Computer and Emerging Sciences)',
    degree: 'B.S. Computer Science',
    period: 'Sep 2022 - Jun 2026',
    location: 'Islamabad, Pakistan',
    courses: [
      'Deep Learning',
      'Generative AI',
      'Data Structures & Algorithms',
      'Operating Systems',
      'Databases',
      'Software Engineering',
    ],
  },
  {
    institution:'Beaconhouse School System',
    degree: 'A-Level. Pre-Engineering',
    period: 'Sep 2020 - Jun 2022',
    location: 'Islamabad, Pakistan',
    courses: [
      'Mathematics',
      'Physics',
      'Chemistry',
    ],
  }
]

// Utility: all coursework in one array
export const courseworkHighlights = education.flatMap((e) => e.courses)