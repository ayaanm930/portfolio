// src/lib/data.ts

export const personalInfo = {
  name: 'Ayaan Mughal',
  title: 'CS Graduate',
  email: 'ayaanmughal03@gmail.com',
  github: 'https://github.com/ayaanm930',
  linkedin: 'https://linkedin.com/in/ayaan-mughal-36a80b227',
  phone: '+92 315 2092828',
  resumeUrl: '/resume_AyaanMughal.pdf',
  location: 'Islamabad, Pakistan',
  educationPeriod: 'Sep 2022 - Jun 2026',
  seeking: 'AI / Software Engineering Role',
  bio: 'Final-year CS student at FAST-NUCES who has shipped real ML features in production - Whisper ASR pipelines, LLM summarization modules, and computer vision workflows at TechGenesys. I build AI-powered applications: from a RAG-powered Scrum automation platform to a DQN racing agent trained from scratch. Looking for an AI/SWE role where the work actually ships.',
}

// ==================== SINGLE SOURCE OF TRUTH FOR SKILLS ====================
// All skills from your resume, grouped logically, no duplicates.
export const technicalSkills = {
  Languages: ['Python', 'C/C++', 'Java', 'JavaScript', 'Kotlin', 'SQL'],
  'AI / ML': ['PyTorch', 'TensorFlow', 'Voice AI', 'Hugging Face Transformers', 'Computer Vision', 'scikit-learn'],
  'LLM & NLP': ['Prompt engineering', 'LLM integration', 'Summarization pipelines', 'RAG workflows'],
  'Web / Mobile': ['Node.js', 'Express', 'React', 'MongoDB', 'REST APIs', 'Android (Kotlin)', 'Flutter'],
  'DevOps & Tools': ['Git', 'Docker', 'Linux', 'CI/CD', 'n8n workflow automation', 'AI-assisted development'],
}

// For "The Core" zone display – picks a curated subset, still no duplication across categories.
export const skills = {
  intelligence: ['PyTorch', 'TensorFlow', 'ASR', 'Hugging Face Transformers'],
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
    period: 'Aug 2025 – May 2026',
    description: 'AI-powered Scrum assistant that converts meeting recordings into sprint-ready deliverables - auto-generated meeting minutes, prioritised user stories, and skill-matched task assignments - with a built-in RAG interface for querying your entire project history.',
    stack: ['Python', 'FastAPI', 'Gemini', 'ChromaDB', 'RAG', 'React', 'uvicorn'],
    pipeline: [
      'Transcript Ingestion',
      'Knowledge Base Creation',
      'Meeting Summarisation',
      'User Story Generation',
      'Smart Task Assignment',
      'RAG Query Interface',
    ],
    github: 'https://github.com/mishalali-A2/ScrumMate',
    highlights: [
      'Agentic pipeline: ingests meeting transcripts, builds a searchable knowledge base, auto-generates meeting minutes, extracts user stories, and assigns tasks by developer skill and workload',
      'RAG query interface over meeting history lets the team ask questions across all past transcripts via ChromaDB vector search',
      'Developer profiling module matches extracted stories to team members based on skills and current workload',
      'FastAPI server exposes pipeline execution, status polling, results retrieval, and RAG endpoints; React frontend triggers runs and displays output',
    ],
  },
  {
    title: 'Hotel Booking Microservices Platform',
    type: 'Full-stack',
    status: 'completed',
    period: '2024',
    description: 'Fully containerized hotel booking platform built on a microservices architecture with three independent Node.js/Express services, a shared MongoDB layer, and a unified React frontend.',
    stack: ['Node.js', 'Express', 'React', 'MongoDB', 'Docker', 'Docker Compose', 'Jest', 'Supertest'],
    github: 'https://github.com/AyaanKhan1576/Hotel-Booking-Microservices',
    highlights: [
      'Three decoupled services - User, Hotel, and Booking - each with its own container and MongoDB instance',
      'User service handles registration, authentication, loyalty program enrollment/redemption, and favorites',
      'Booking service supports individual and group bookings, cancellations, payments, and loyalty point awards',
      'Single React frontend consuming all three service APIs across user, hotel, and booking modules',
      'White- and black-box test coverage via Jest and Supertest with ≥70% coverage target per service',
      'Fully Dockerized with Docker Compose for one-command local deployment',
    ],
  },
  {
    title: 'TORCS Racing Agent with Machine Learning',
    type: 'AI / ML',
    status: 'completed',
    period: '2024',
    description: 'Hybrid manual-AI racing agent for the TORCS simulator that collects human driving data via keyboard inputs, trains an LSTM-based PyTorch model on it, then autonomously controls the vehicle in real time using supervised imitation learning.',
    stack: ['Python', 'PyTorch', 'scikit-learn', 'NumPy', 'Pandas', 'TORCS'],
    github: 'https://github.com/ayaanm930/TORCS-Racing-Agent-with-ML',
    highlights: [
      'LSTM model with track/car embeddings predicts steering, acceleration, and braking from sequences of 5 past sensor frames',
      'Custom loss function penalises off-centre track position and extreme steering angles to encourage smoother driving',
      'Seamless runtime switching between keyboard control and ML inference within the same simulation session',
      'Full data pipeline from live CSV logging during manual play through Min-Max scaling to model training and serialisation',
      'Trained over 20 epochs with batch size 64; saves model weights and preprocessor artefacts for deployment',
    ],
  },
  {
    title: 'Habitify',
    type: 'Full-stack',
    status: 'completed',
    period: '2024',
    description: 'Android habit tracking app with a PHP backend for persisting and syncing daily habits, streaks, and progress.',
    stack: ['Kotlin', 'Android', 'PHP', 'Gradle'],
    github: 'https://github.com/bilalnaveed0293/Habitify',
    highlights: [
      'Native Android frontend built entirely in Kotlin with Gradle build system',
      'PHP backend handling habit data persistence and client-server communication',
      'Full-stack architecture with dedicated app/ and backend/ directory separation',
      'Daily habit tracking with streak and progress management',
    ],
  },
  {
    title: 'Parallel Butterfly Counting in Bipartite Graphs',
    type: 'Systems / HPC',
    status: 'completed',
    period: '2024',
    description: 'High-performance parallel algorithm for counting butterfly motifs in large bipartite graphs using a hybrid MPI + OpenMP approach with METIS-based graph partitioning.',
    stack: ['C++', 'MPI', 'OpenMP', 'METIS', 'Shell', 'Jupyter Notebook'],
    github: 'https://github.com/ayaanm930/PARBUTTERFLY-Counting-with-OpenMP-MPI',
    highlights: [
      'Hybrid parallelism combining MPI for inter-node and OpenMP for intra-node computation',
      'METIS-based graph partitioning to minimize cross-node communication overhead',
      'Up to 4x speedup over sequential execution with 4 MPI ranks on large graphs',
      'Additional 15–30% performance gain from layering OpenMP threads over MPI processes',
      'Supports sequential, OpenMP-only, MPI-only, and hybrid execution modes with benchmark logging',
    ],
  },
]

// ==================== EXPERIENCE ====================
export const experience: ExperienceEntry[] = [
  {
    role: 'ML / AI Intern',
    company: 'TechGenesys',
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
    institution: 'Beaconhouse School System',
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