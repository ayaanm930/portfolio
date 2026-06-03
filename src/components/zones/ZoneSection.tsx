'use client'

import { useEffect, useState } from 'react'
import { IconArrowDown, IconBook2, IconBrandGithub, IconBrandLinkedin, IconDownload, IconExternalLink, IconFlask2, IconMail, IconPhone } from '@tabler/icons-react'
import type { EducationEntry, ExperienceEntry, Project } from '@/lib/data'
import { currentlyBuilding } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useAudio } from '@/components/audio/AudioProvider'
import { SfxButton } from '@/components/ui/SfxButton'
import { ZoneCanvas } from '@/components/zones/ZoneCanvas'
import type { ZoneConfig, ZoneId } from '@/components/world/types'

type Content = {
  personalInfo: {
    name: string
    title: string
    email: string
    github: string
    linkedin: string
    phone: string
    resumeUrl: string
    bio: string
  }
  technicalSkills: Record<string, readonly string[]>
  projects: Project[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
}

const SCRUMMATE_DIAGRAM = `
.                   ┌─────────────────────┐
                    │     Team Users      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    ScrumMate UI     │
                    │  Project Dashboard  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Agentic Project     │
                    │      Manager        │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
 ┌───────────────┐   ┌────────────────┐   ┌────────────────┐
 │ Project Mgmt  │   │ Meeting Agent  │   │ Metrics Engine │
 │ - Create      │   │ - Host Meeting │   │ - Velocity     │
 │ - Update      │   │ - Record Audio │   │ - Progress     │
 │ - Track       │   │ - Generate MoM │   │ - Analytics    │
 └───────┬───────┘   └───────┬────────┘   └───────┬────────┘
         │                   │                    │
         │                   ▼                    │
         │         ┌──────────────────┐           │
         │         │   AI Processing  │           │
         │         │ - Summarization  │           │
         │         │ - User Stories   │           │
         │         └────────┬─────────┘           │
         │                  │                     │
         └──────────────────┼─────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      n8n Hub        │
                 │  Workflow Engine    │
                 └──────────┬──────────┘
                            │
            ┌───────────────┼────────────────┐
            │               │                │
            ▼               ▼                ▼
 ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
 │ Trello Create  │ │ Trello Update  │ │ Database Sync  │
 │ Boards         │ │ Cards/Stories  │ │ Projects/Data  │
 └────────────────┘ └────────────────┘ └────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Trello Board      │
                 │  Sprint Backlog     │
                 │  User Stories       │
                 │  Tasks & Progress   │
                 └─────────────────────┘
`.trim()

const MEETING_MASTER_DIAGRAM = `
 
`.trim()

export function ZoneSection({
  zone,
  activeZoneId,
  content,
}: {
  zone: ZoneConfig
  activeZoneId: ZoneId
  content: Content
}) {
  const active = activeZoneId === zone.id
  const audio = useAudio()
  const [resumeOpen, setResumeOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [archExpanded, setArchExpanded] = useState(false)

  useEffect(() => {
    if (!selectedProject) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null)
        audio.play('click')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProject, audio])

  useEffect(() => {
    const overlayOpen = resumeOpen || Boolean(selectedProject)
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    if (overlayOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [resumeOpen, selectedProject])

  return (
    <section
  id={`zone-${zone.id}`}
  data-zone-id={zone.id}
  data-zone-name={zone.name}
  data-zone-accent={zone.accent1}
  data-zone={zone.id}          // ← add this for the bg canvas observer
  className="zone-container"
  style={{ color: zone.text }} // ← no backgroundColor
>
      <ZoneCanvas zone={zone} active={active} />
      <div className="zone-content">
        <div className="mb-8 flex flex-col gap-2">
          <div className="text-[11px] tracking-[0.42em] opacity-70">
            {zone.name} · {zone.biomeRef}
          </div>
          <div className="h-px w-full opacity-50" style={{ background: `linear-gradient(90deg, ${zone.accent2}00, ${zone.accent2}99, ${zone.accent2}00)` }} />
        </div>

        {zone.id === 'void' && (
          <div className="grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="text-[12px] tracking-[0.34em] text-white/70">FOUND VESSEL</div>
              <h1
                className="mt-3 text-4xl font-medium tracking-[0.18em] md:text-6xl"
                style={{
                  textShadow: `0 0 30px ${zone.accent1}22, 0 0 50px ${zone.accent2}14`,
                }}
              >
                {content.personalInfo.name.toUpperCase()}
              </h1>
              <div className="mt-3 text-base tracking-[0.12em] opacity-90 md:text-lg">
                AI Engineer &amp; Full-Stack Developer Building Real-Time Intelligent Systems
              </div>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
                CS graduate who has shipped production ML features — Whisper ASR pipelines, LLM summarization modules, and computer vision workflows at TechGenesys.
                I build AI-powered applications: from a RAG-powered Scrum automation platform to an LSTM racing agent trained from scratch.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <SfxButton
                  type="button"
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm tracking-[0.16em]',
                    'bg-white/5 hover:bg-white/10 border-white/10 text-white/90'
                  )}
                  onClick={() => document.getElementById('zone-labs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  <IconFlask2 size={18} />
                  VIEW PROJECTS
                </SfxButton>
                <a
                  href={content.personalInfo.resumeUrl}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm tracking-[0.14em] text-white/85 hover:bg-black/30"
                >
                  <IconDownload size={18} />
                  DOWNLOAD RESUME
                </a>
                <a
                  href={content.personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm tracking-[0.14em] text-white/80 hover:bg-black/30"
                >
                  <IconBrandGithub size={18} />
                  GITHUB
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
              <div className="text-[11px] tracking-[0.34em] text-white/65">SOUL ESSENCE</div>
              <div className="mt-3 text-sm leading-relaxed text-white/70">{zone.particleDescription}</div>
              <div className="mt-5 text-[11px] tracking-[0.34em] text-white/55">DESCENT</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-white/65">
                <IconArrowDown size={16} />
                Scroll to traverse biomes.
              </div>
            </div>
          </div>
        )}

        {zone.id === 'core' && (
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-sm">
              <div className="text-[11px] tracking-[0.38em] text-white/70">ABOUT</div>
              <h2 className="mt-3 text-2xl tracking-[0.16em]" style={{ color: zone.accent1 }}>
                DEVELOPER PROFILE
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {content.personalInfo.bio}
              </p>
              <div className="mt-5 text-xs text-white/65">{zone.particleDescription}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm md:p-8">
              <div className="text-[11px] tracking-[0.38em] text-white/70">TECHNICAL SKILLS</div>
              <h2 className="mt-3 text-2xl tracking-[0.16em] mb-6" style={{ color: zone.accent1 }}>
                ABILITY CLUSTERS
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(content.technicalSkills).map(([group, items], idx) => (
                  <AbilityCard
                    key={group}
                    title={group.toUpperCase()}
                    items={items}
                    accent={idx % 2 === 0 ? zone.accent1 : zone.accent2}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {zone.id === 'labs' && (
          <div className="grid items-stretch gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div
              className="group/featured relative rounded-2xl border border-white/10 bg-black/28 p-6 backdrop-blur-sm md:p-8 cursor-pointer hover:border-white/20 transition-all hover:scale-[1.002]"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('a, video, button')) {
                  return
                }
                setSelectedProject(content.projects[0])
                audio.play('click')
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] tracking-[0.38em] text-white/70">FEATURED PROJECT</div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-[0.28em] text-white/80">
                    FINAL YEAR PROJECT
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-[0.28em] text-white/80">
                    <span
                      className="mr-2 inline-block align-middle text-[10px]"
                      style={{ color: content.projects[0]?.status === 'completed' ? zone.accent1 : zone.accent2 }}
                    >
                      ●
                    </span>
                    {(content.projects[0]?.status ?? 'active').toUpperCase()}
                  </div>
                </div>
              </div>

              <h2 className="mt-4 text-3xl tracking-[0.16em]" style={{ color: zone.text }}>
                {content.projects[0]?.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">
                {content.projects[0]?.description}
              </p>

              {/* Case-study: Problem / Solution / Impact */}
              {(content.projects[0]?.problem || content.projects[0]?.solution || content.projects[0]?.impact) && (
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {content.projects[0]?.problem && (
                    <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs">
                      <div className="text-[10px] tracking-[0.3em] text-white/45 mb-1">PROBLEM</div>
                      <div className="text-white/75 leading-relaxed">{content.projects[0].problem}</div>
                    </div>
                  )}
                  {content.projects[0]?.solution && (
                    <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs" style={{ boxShadow: `0 0 20px ${zone.accent1}0a` }}>
                      <div className="text-[10px] tracking-[0.3em] text-white/45 mb-1">SOLUTION</div>
                      <div className="text-white/75 leading-relaxed">{content.projects[0].solution}</div>
                    </div>
                  )}
                  {content.projects[0]?.impact && (
                    <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs" style={{ boxShadow: `0 0 20px ${zone.accent2}0a` }}>
                      <div className="text-[10px] tracking-[0.3em] text-white/45 mb-1">IMPACT</div>
                      <div className="leading-relaxed" style={{ color: zone.accent1 }}>{content.projects[0].impact}</div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {content.projects[0]?.stack?.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                    style={{ boxShadow: `0 0 18px ${zone.accent1}12` }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-7">
                <div className="text-[11px] tracking-[0.38em] text-white/65">PIPELINE</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {(content.projects[0]?.pipeline ?? []).map((stage, idx) => (
                    <div
                      key={stage}
                      className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-white/75"
                      style={{
                        boxShadow:
                          idx % 2 === 0 ? `0 0 30px ${zone.accent1}10` : `0 0 30px ${zone.accent2}10`,
                      }}
                    >
                      {stage}
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture diagram (expandable) */}
              <div className="mt-5">
                <button
                  type="button"
                  className="flex items-center gap-2 text-[11px] tracking-[0.28em] text-white/50 hover:text-white/80 transition-colors"
                  onClick={(e) => { e.stopPropagation(); setArchExpanded((v) => !v) }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: archExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  ARCHITECTURE DIAGRAM
                </button>
                {archExpanded && (
                  <pre
                    className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-[11px] leading-relaxed text-white/65 font-mono"
                    style={{ boxShadow: `0 0 30px ${zone.accent1}08` }}
                  >
                    {SCRUMMATE_DIAGRAM}
                  </pre>
                )}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <SfxButton
                  type="button"
                  className={cn(
                    'inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm tracking-[0.14em] text-white/90 hover:bg-white/10'
                  )}
                  onClick={() => {
                    setSelectedProject(content.projects[0])
                  }}
                >
                  VIEW DETAILS & HIGHLIGHTS
                </SfxButton>
                <a
                  className="inline-flex items-center gap-2 justify-center rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm tracking-[0.14em] text-white/90 hover:bg-black/30"
                  href={content.projects[0]?.github ?? '#'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconBrandGithub size={16} />
                  VIEW GITHUB
                </a>
              </div>

              {/* ── Demo Recording ── */}
              <div className="mt-8">
                <div className="text-[11px] tracking-[0.38em] text-white/65 mb-3">DEMO RECORDING</div>
                <div
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                  style={{ boxShadow: `0 0 40px ${zone.accent1}0e` }}
                >
                  <video
                    className="w-full rounded-2xl"
                    style={{ display: 'block', maxHeight: '320px', objectFit: 'cover' }}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    src="/demo-scrummate.mp4"
                    ref={(el) => {
                      if (el) {
                        el.muted = true
                        el.volume = 0
                        // Re-enforce mute if user somehow triggers volumechange
                        el.addEventListener('volumechange', () => {
                          el.muted = true
                          el.volume = 0
                        })
                      }
                    }}
                    onError={(e) => {
                      ; (e.currentTarget as HTMLVideoElement).style.display = 'none'
                      const ph = e.currentTarget.nextElementSibling as HTMLElement | null
                      if (ph) ph.style.display = 'flex'
                    }}
                  />
                  { }
                  <div
                    className="hidden w-full flex-col items-center justify-center gap-3 py-16 text-white/30"
                    style={{ minHeight: '180px' }}
                  >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <div className="text-[11px] tracking-[0.32em] text-white/35">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── OTHER LABS - scrollable panel ── */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/22 backdrop-blur-sm" style={{ minHeight: 0 }}>
              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-3">
                <div className="text-[11px] tracking-[0.38em] text-white/70">OTHER LABS</div>
                <div className="flex items-center gap-1.5 text-[10px] tracking-[0.26em] text-white/40">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="7 13 12 18 17 13" />
                    <polyline points="7 6 12 11 17 6" />
                  </svg>
                  SCROLL
                </div>
              </div>

              {/* Desktop: vertical scroll */}
              <div className="relative hidden flex-1 lg:block" style={{ minHeight: 0 }}>
                <div
                  className="absolute inset-0 overflow-y-auto px-6 pb-14"
                  style={{ scrollbarWidth: 'none' }}
                >
                  <div className="space-y-3">
                    {content.projects.slice(1).map((p, idx) => (
                      <div
                        key={p.title}
                        className="group/card cursor-pointer rounded-2xl border border-white/10 bg-black/28 p-4 transition-all hover:bg-black/38 hover:border-white/20 hover:scale-[1.01]"
                        style={{ boxShadow: idx % 2 === 0 ? `0 0 24px ${zone.accent1}0a` : `0 0 24px ${zone.accent2}0a` }}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('a')) {
                            return
                          }
                          setSelectedProject(p)
                          audio.play('click')
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm tracking-[0.12em] font-medium" style={{ color: zone.accent1 }}>
                            {p.title}
                          </div>
                          <div className="text-[10px] tracking-[0.24em] text-white/40 uppercase">
                            {p.status ?? 'active'}
                          </div>
                        </div>
                        <div className="mt-2 text-xs leading-relaxed text-white/70">{p.description}</div>
                        {p.impact && (
                          <div className="mt-2 rounded-lg border border-white/5 bg-black/30 px-3 py-1.5 text-[11px] leading-relaxed" style={{ color: zone.accent2 }}>
                            <span className="text-white/35 mr-1">▸</span>{p.impact}
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.stack.slice(0, 5).map((t) => (
                            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/75">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <a
                            className="inline-flex items-center gap-1.5 text-xs tracking-[0.14em] text-white/55 underline decoration-white/15 underline-offset-4 hover:text-white/85"
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconBrandGithub size={13} />
                            GITHUB
                          </a>
                          <span className="text-[10px] tracking-[0.16em] text-white/45 group-hover/card:text-white/75 transition-colors">
                            VIEW DETAILS →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Fade-out scroll hint at bottom */}
                <div
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 rounded-b-2xl"
                  style={{ background: `linear-gradient(to top, ${zone.background}ee 0%, transparent 100%)` }}
                />
              </div>

              {/* Mobile: horizontal snap scroll - one card at a time */}
              <div className="relative lg:hidden px-4 pb-6">
                <div
                  className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
                  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
                >
                  {content.projects.slice(1).map((p, idx) => (
                    <div
                      key={p.title}
                      className="w-full shrink-0 snap-center rounded-2xl border border-white/10 bg-black/28 p-4 cursor-pointer"
                      style={{ boxShadow: idx % 2 === 0 ? `0 0 24px ${zone.accent1}0a` : `0 0 24px ${zone.accent2}0a` }}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('a')) {
                          return
                        }
                        setSelectedProject(p)
                        audio.play('click')
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm tracking-[0.12em] font-medium" style={{ color: zone.accent1 }}>
                          {p.title}
                        </div>
                        <div className="text-[10px] tracking-[0.24em] text-white/40 uppercase">
                          {p.status ?? 'active'}
                        </div>
                      </div>
                      <div className="mt-2 text-xs leading-relaxed text-white/70">{p.description}</div>
                      {p.impact && (
                        <div className="mt-2 rounded-lg border border-white/5 bg-black/30 px-3 py-1.5 text-[11px] leading-relaxed" style={{ color: zone.accent2 }}>
                          <span className="text-white/35 mr-1">▸</span>{p.impact}
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.stack.slice(0, 5).map((t) => (
                          <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/75">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <a
                          className="inline-flex items-center gap-1.5 text-xs tracking-[0.14em] text-white/55 underline decoration-white/15 underline-offset-4 hover:text-white/85"
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconBrandGithub size={13} />
                          GITHUB
                        </a>
                        <span className="text-[10px] tracking-[0.16em] text-white/45">
                          VIEW DETAILS →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Swipe hint dots */}
                <div className="mt-1 flex justify-center gap-1.5">
                  {content.projects.slice(1).map((p, i) => (
                    <div
                      key={p.title}
                      className="h-1 rounded-full bg-white/20"
                      style={{ width: i === 0 ? '20px' : '6px', transition: 'width 0.2s' }}
                    />
                  ))}
                </div>
              </div>

              <div className="px-6 pb-5 text-xs text-white/40 hidden lg:block">{zone.particleDescription}</div>
            </div>
          </div>
        )}

        {zone.id === 'logs' && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/24 p-6 backdrop-blur-sm md:p-8">
              <div className="text-[11px] tracking-[0.38em] text-white/70">MISSION LOG</div>
              <div className="mt-2 text-xs tracking-[0.24em] text-white/55">Remember: open each log to reveal the mission's hidden echoes.</div>
              <div className="mt-4 space-y-3">
                {content.experience.map((exp) => (
                  <details key={`${exp.company}-${exp.period}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <summary
                      className="cursor-pointer list-none"
                      onClick={() => audio.play('click')}
                    >
                      <h2 className="text-xl tracking-[0.13em]" style={{ color: zone.accent1 }}>
                        {exp.role}
                      </h2>
                      <div className="mt-1 text-sm text-white/70">
                        {exp.company} · {exp.period} · {exp.location}
                      </div>
                    </summary>
                    <div className="details-body mt-4 space-y-2 text-sm text-white/75">
                      <ul className="space-y-2">
                        {exp.highlights.map((h) => (
                          <li key={h} className="flex gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: zone.accent2 }} />
                            <span className="leading-relaxed">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/24 p-6 backdrop-blur-sm md:p-8">
              <div className="text-[11px] tracking-[0.38em] text-white/70">ORIGIN DATA</div>
              <div className="mt-2 text-xs tracking-[0.24em] text-white/55">Unearth the archive - expand each origin entry to reveal the deeper memory.</div>
              <div className="mt-4 space-y-3">
                {content.education.map((edu) => (
                  <details key={`${edu.institution}-${edu.period}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <summary
                      className="cursor-pointer list-none"
                      onClick={() => audio.play('click')}
                    >
                      <h2 className="text-xl tracking-[0.13em]" style={{ color: zone.accent1 }}>
                        {edu.institution}
                      </h2>
                      <div className="mt-1 text-sm text-white/70">
                        {edu.degree} · {edu.period} · {edu.location}
                      </div>
                    </summary>
                    <div className="details-body mt-4">
                      <div className="text-[11px] tracking-[0.38em] text-white/60">MODULES</div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {edu.courses.map((c, idx) => (
                          <div
                            key={c}
                            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/75"
                            style={{ boxShadow: idx % 2 === 0 ? `0 0 22px ${zone.accent1}12` : `0 0 22px ${zone.accent2}12` }}
                          >
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
              <div className="mt-4 text-xs text-white/55">{zone.particleDescription}</div>
            </div>
          </div>
        )}

        {zone.id === 'signal' && (
          <div className="grid gap-10">

            {/* ── Currently Building ── */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <div className="text-[11px] tracking-[0.38em] text-white/70">CURRENTLY BUILDING</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {currentlyBuilding.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"
                    style={{ boxShadow: `0 0 20px ${zone.accent1}08` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: zone.accent1 }} />
                      <div className="text-xs font-medium tracking-[0.1em] text-white/85">{item.label}</div>
                    </div>
                    <div className="mt-1.5 text-[11px] leading-relaxed text-white/50">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] tracking-[0.38em] text-white/70">CONTACT</div>
                  <h2 className="mt-3 text-2xl tracking-[0.16em]" style={{ color: zone.accent1 }}>
                    OPEN TO OPPORTUNITIES
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-white/60 max-w-xl">
                    Looking for opportunities in AI engineering, backend development, and full-stack systems.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] tracking-[0.28em] text-white/85 shrink-0">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle animate-pulse" style={{ backgroundColor: zone.accent1 }} />
                  AVAILABLE
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Icon buttons for Email, GitHub, LinkedIn, Resume */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <a
                    href={`mailto:${content.personalInfo.email}`}
                    aria-label="Send email"
                    className="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm tracking-[0.12em] text-white/80 hover:bg-black/35 hover:border-white/20 transition-colors"
                    style={{ boxShadow: `0 0 20px ${zone.accent1}10` }}
                  >
                    <IconMail size={18} style={{ color: zone.accent1 }} />
                    <span className="truncate text-[11px] tracking-[0.3em] text-white/65">EMAIL</span>
                  </a>
                  <a
                    href={content.personalInfo.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub profile"
                    className="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm tracking-[0.12em] text-white/80 hover:bg-black/35 hover:border-white/20 transition-colors"
                    style={{ boxShadow: `0 0 20px ${zone.accent1}10` }}
                  >
                    <IconBrandGithub size={18} style={{ color: zone.accent1 }} />
                    <span className="truncate text-[11px] tracking-[0.3em] text-white/65">GITHUB</span>
                  </a>
                  <a
                    href={content.personalInfo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                    className="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm tracking-[0.12em] text-white/80 hover:bg-black/35 hover:border-white/20 transition-colors"
                    style={{ boxShadow: `0 0 20px ${zone.accent1}10` }}
                  >
                    <IconBrandLinkedin size={18} style={{ color: zone.accent1 }} />
                    <span className="truncate text-[11px] tracking-[0.3em] text-white/65">LINKEDIN</span>
                  </a>
                  <a
                    href={content.personalInfo.resumeUrl}
                    download
                    aria-label="Download resume"
                    className="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm tracking-[0.12em] text-white/80 hover:bg-black/35 hover:border-white/20 transition-colors"
                    style={{ boxShadow: `0 0 20px ${zone.accent2}10` }}
                  >
                    <IconDownload size={18} style={{ color: zone.accent2 }} />
                    <span className="truncate text-[11px] tracking-[0.3em] text-white/65">RESUME</span>
                  </a>
                </div>
                {/* Phone as a text row */}
                <a
                  href={`tel:${content.personalInfo.phone.replace(/\s+/g, '')}`}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 hover:bg-black/30 transition-colors sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <IconPhone size={15} style={{ color: zone.accent1 }} />
                    <span className="text-[11px] tracking-[0.38em] text-white/60">PHONE</span>
                  </div>
                  <span className="text-sm text-white/75 sm:ml-auto">{content.personalInfo.phone}</span>
                </a>
              </div>

              <div className="mt-6 text-xs text-white/55">{zone.particleDescription}</div>
            </div>
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-white/10 bg-black/10 p-5 text-xs text-white/55 backdrop-blur-sm">
          <div className="tracking-[0.3em] text-white/60">ZONE NOTES</div>
          <div className="mt-2 leading-relaxed">{zone.zoneDescription}</div>
        </div>
      </div>

      {resumeOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-2xl">
          <div
            className="relative w-full max-w-6xl overflow-hidden rounded-3xl border bg-black/90 shadow-2xl"
            style={{
              borderColor: `${zone.accent1}40`,
              boxShadow: `0 0 80px ${zone.accent1}22`,
              background: `linear-gradient(180deg, ${zone.background}dd 0%, ${zone.surface}dd 100%)`,
            }}
          >
            <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[10px] tracking-[0.38em] text-white/60">RESUME VIEWER</div>
                <div className="mt-1 text-lg font-medium" style={{ color: zone.accent1 }}>
                  {content.personalInfo.name}'s Resume
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <a
                  className="inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-xs text-white/90 transition-colors"
                  style={{
                    borderColor: `${zone.accent1}55`,
                    backgroundColor: `${zone.accent1}15`,
                  }}
                  href={content.personalInfo.resumeUrl}
                  download
                >
                  DOWNLOAD
                </a>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-xs text-white/85 hover:bg-black/30"
                  onClick={() => setResumeOpen(false)}
                >
                  CLOSE
                </button>
              </div>
            </div>
            <div className="h-[70vh] bg-black/80">
              <iframe
                className="h-full w-full border-none bg-black"
                src={content.personalInfo.resumeUrl}
                title="Resume preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECT DETAILS HOVERING CARD MODAL ── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md transition-all duration-300"
          onClick={() => {
            setSelectedProject(null)
            audio.play('click')
          }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 bg-[#02050c]/95 shadow-2xl backdrop-blur-xl flex flex-col p-6 md:p-8 transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: `0 0 50px ${zone.accent1}1f`,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9px] tracking-[0.24em] text-white/60 uppercase">
                    {selectedProject.type}
                  </span>
                  {selectedProject.status && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9px] tracking-[0.24em] text-white/60 uppercase">
                      <span
                        className="mr-1.5 inline-block align-middle text-[8px]"
                        style={{ color: selectedProject.status === 'completed' ? zone.accent1 : zone.accent2 }}
                      >
                        ●
                      </span>
                      {selectedProject.status}
                    </span>
                  )}
                  {selectedProject.period && (
                    <span className="text-[10px] tracking-[0.16em] text-white/50">
                      {selectedProject.period}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-2xl tracking-[0.14em] font-medium" style={{ color: zone.accent1 }}>
                  {selectedProject.title}
                </h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-black/20 p-2 text-white/60 hover:text-white hover:bg-black/40 hover:border-white/20 transition-all cursor-pointer active:scale-95"
                onClick={() => {
                  setSelectedProject(null)
                  audio.play('click')
                }}
                aria-label="Close details"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-2 mt-5 space-y-6" style={{ scrollbarWidth: 'thin' }}>
              <div>
                <h4 className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Description</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {selectedProject.description}
                </p>
              </div>

              {/* Case Study: Problem / Solution / Impact */}
              {(selectedProject.problem || selectedProject.solution || selectedProject.impact) && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {selectedProject.problem && (
                    <div className="rounded-xl border border-white/8 bg-black/35 px-4 py-3">
                      <h4 className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-1.5">Problem</h4>
                      <p className="text-xs leading-relaxed text-white/70">{selectedProject.problem}</p>
                    </div>
                  )}
                  {selectedProject.solution && (
                    <div className="rounded-xl border border-white/8 bg-black/35 px-4 py-3" style={{ boxShadow: `0 0 16px ${zone.accent1}08` }}>
                      <h4 className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-1.5">Solution</h4>
                      <p className="text-xs leading-relaxed text-white/70">{selectedProject.solution}</p>
                    </div>
                  )}
                  {selectedProject.impact && (
                    <div className="rounded-xl border border-white/8 bg-black/35 px-4 py-3" style={{ boxShadow: `0 0 16px ${zone.accent2}08` }}>
                      <h4 className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-1.5">Impact</h4>
                      <p className="text-xs leading-relaxed" style={{ color: zone.accent1 }}>{selectedProject.impact}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Challenges */}
              {selectedProject.challenges && selectedProject.challenges.length > 0 && (
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] text-white/50 uppercase mb-3">Challenges Solved</h4>
                  <ul className="space-y-2">
                    {selectedProject.challenges.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/75 leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: i % 2 === 0 ? zone.accent1 : zone.accent2 }} />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Architecture Diagram (ScrumMate only) */}
              {selectedProject.title.toLowerCase().includes('scrum') && (
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] text-white/50 uppercase mb-3">Architecture</h4>
                  <pre
                    className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 px-4 py-4 text-[11px] leading-relaxed text-white/60 font-mono"
                    style={{ boxShadow: `0 0 24px ${zone.accent1}08` }}
                  >
                    {SCRUMMATE_DIAGRAM}
                  </pre>
                </div>
              )}

              {/* Architecture Diagram (TechGenesys / Meeting Master) */}
              {selectedProject.title.toLowerCase().includes('hotel') && false && (
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] text-white/50 uppercase mb-3">System Diagram</h4>
                  <pre
                    className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 px-4 py-4 text-[11px] leading-relaxed text-white/60 font-mono"
                  >
                    {MEETING_MASTER_DIAGRAM}
                  </pre>
                </div>
              )}

              {/* Pipeline */}
              {selectedProject.pipeline && selectedProject.pipeline.length > 0 && (
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] text-white/50 uppercase mb-3">Pipeline</h4>
                  <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
                    {selectedProject.pipeline.map((stage, idx) => (
                      <div
                        key={stage}
                        className="rounded-xl border border-white/5 bg-black/40 px-3 py-2 text-xs text-white/75"
                        style={{
                          boxShadow: idx % 2 === 0 ? `0 0 20px ${zone.accent1}0a` : `0 0 20px ${zone.accent2}0a`,
                        }}
                      >
                        <span className="mr-1.5 text-white/40 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                        {stage}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights & Contributions */}
              {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] text-white/50 uppercase mb-3">Highlights & Contributions</h4>
                  <ul className="space-y-2.5">
                    {selectedProject.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-white/75 leading-relaxed">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full animate-pulse"
                          style={{ backgroundColor: index % 2 === 0 ? zone.accent1 : zone.accent2 }}
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              <div>
                <h4 className="text-[10px] tracking-[0.3em] text-white/50 uppercase mb-2.5">Technologies Used</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-xs text-white/75"
                      style={{ boxShadow: `0 0 10px ${zone.accent1}05` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-6">
              <a
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs tracking-[0.14em] text-white/90 hover:bg-white/10 transition-colors"
                href={selectedProject.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => audio.play('click')}
              >
                <IconBrandGithub size={14} />
                VIEW ON GITHUB
              </a>
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-xs tracking-[0.14em] text-white/80 hover:bg-black/30 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedProject(null)
                  audio.play('click')
                }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function AbilityCard({ title, items, accent }: { title: string; items: readonly string[]; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/22 p-5 backdrop-blur-sm">
      <div className="text-[11px] tracking-[0.38em] text-white/70">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((x) => (
          <span
            key={x}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
            style={{ boxShadow: `0 0 18px ${accent}12` }}
          >
            {x}
          </span>
        ))}
      </div>
    </div>
  )
}

function ContactRow({
  label,
  value,
  href,
  accent,
}: {
  label: string
  value: string
  href: string
  accent: string
}) {
  return (
    <a
      className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 hover:bg-black/30"
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
    >
      <div className="text-[11px] tracking-[0.38em] text-white/60">{label}</div>
      <div
        className="text-right text-sm text-white/80 underline decoration-white/20 underline-offset-4 group-hover:decoration-white/35"
        style={{ textShadow: `0 0 18px ${accent}1a` }}
      >
        {value}
      </div>
    </a>
  )
}

export type { ZoneId } from '@/components/world/types'

