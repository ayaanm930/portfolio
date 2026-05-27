'use client'

import { useState } from 'react'
import { IconArrowDown, IconBook2, IconFlask2 } from '@tabler/icons-react'
import type { EducationEntry, ExperienceEntry, Project } from '@/lib/data'
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
  skills: {
    intelligence: readonly string[]
    language: readonly string[]
    systems: readonly string[]
    interfaces: readonly string[]
  }
  technicalSkills: Record<string, readonly string[]>
  projects: Project[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
}

export function ZoneSection({
  zone,
  activeZoneId,
  content,
  previousZoneBackground,
  nextZoneBackground,
}: {
  zone: ZoneConfig
  activeZoneId: ZoneId
  content: Content
  previousZoneBackground?: string
  nextZoneBackground?: string
}) {
  const active = activeZoneId === zone.id
  const audio = useAudio()
  const [resumeOpen, setResumeOpen] = useState(false)

  return (
    <section
      id={`zone-${zone.id}`}
      data-zone-id={zone.id}
      data-zone-name={zone.name}
      data-zone-accent={zone.accent1}
      className="zone-container"
      style={{ backgroundColor: zone.background, color: zone.text }}
    >
      <ZoneCanvas zone={zone} active={active} />
      {previousZoneBackground && (
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-[2] h-36 md:h-44 blur-xl"
          style={{
            background: `linear-gradient(180deg, ${previousZoneBackground}dd 0%, ${zone.background}00 100%)`,
          }}
        />
      )}
      {nextZoneBackground && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-36 md:h-44 blur-xl"
          style={{
            background: `linear-gradient(180deg, ${zone.background}00 0%, ${nextZoneBackground}dd 100%)`,
          }}
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(180deg, ${zone.accent2}0f 0%, transparent 20%, transparent 80%, ${zone.accent1}0f 100%)`,
        }}
      />

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
              <div className="mt-3 text-base tracking-[0.12em] opacity-90 md:text-lg">{content.personalInfo.title}</div>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">{content.personalInfo.bio}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <SfxButton
                  type="button"
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm tracking-[0.16em]',
                    'bg-white/5 hover:bg-white/10 border-white/10 text-white/90'
                  )}
                  onClick={() => document.getElementById('zone-labs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  <IconFlask2 size={18} />
                  EXPLORE LABS
                </SfxButton>
                <SfxButton
                  type="button"
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm tracking-[0.16em]',
                    'bg-black/20 hover:bg-black/30 border-white/10 text-white/85'
                  )}
                  onClick={() => document.getElementById('zone-logs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  <IconBook2 size={18} />
                  VIEW LOGS
                </SfxButton>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm tracking-[0.14em] text-white/80 hover:bg-black/30"
                  onClick={() => setResumeOpen(true)}
                >
                  RESUME
                </button>
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
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-sm">
              <div className="text-[11px] tracking-[0.38em] text-white/70">ABOUT</div>
              <h2 className="mt-3 text-2xl tracking-[0.16em]" style={{ color: zone.accent1 }}>
                ABILITY CLUSTERS
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Architected systems across speech, vision, and language. I build end-to-end ML pipelines, ship production-integrated features, and keep
                interfaces recruiter-readable without losing depth.
              </p>
              <div className="mt-5 text-xs text-white/65">{zone.particleDescription}</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AbilityCard title="INTELLIGENCE" items={content.skills.intelligence} accent={zone.accent1} />
              <AbilityCard title="LANGUAGE" items={content.skills.language} accent={zone.accent2} />
              <AbilityCard title="SYSTEMS" items={content.skills.systems} accent={zone.accent1} />
              <AbilityCard title="INTERFACES" items={content.skills.interfaces} accent={zone.accent2} />
            </div>
            <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm md:col-span-2">
              <div className="text-[11px] tracking-[0.38em] text-white/70">FULL SKILL ARCHIVE</div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {Object.entries(content.technicalSkills).map(([group, items]) => (
                  <AbilityCard key={group} title={group.toUpperCase()} items={items} accent={zone.accent1} />
                ))}
              </div>
            </div>
          </div>
        )}

        {zone.id === 'labs' && (
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-2xl border border-white/10 bg-black/28 p-6 backdrop-blur-sm md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] tracking-[0.38em] text-white/70">FEATURED PROJECT</div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-[0.28em] text-white/80">
                    FINAL YEAR PROJECT
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-[0.28em] text-white/80">
                    <span className="mr-2 inline-block align-middle text-[10px]" style={{ color: zone.accent1 }}>
                      ●
                    </span>
                    ACTIVE
                  </div>
                </div>
              </div>

              <h2 className="mt-4 text-3xl tracking-[0.16em]" style={{ color: zone.text }}>
                ScrumMate
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">
                Agentic pipeline: transcripts → RAG → user stories → sprint planning. 70–80% accuracy.
              </p>

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

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm tracking-[0.14em] text-white/90 hover:bg-white/10"
                  href={content.projects[0]?.github ?? '#'}
                  target="_blank"
                  rel="noreferrer"
                >
                  VIEW GITHUB
                </a>
                
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/22 p-6 backdrop-blur-sm">
              <div className="text-[11px] tracking-[0.38em] text-white/70">OTHER LABS</div>
              <div className="mt-4 grid gap-3">
                {content.projects.slice(1).map((p) => (
                  <div key={p.title} className="rounded-2xl border border-white/10 bg-black/28 p-4">
                    <div className="text-sm tracking-[0.12em]" style={{ color: zone.accent1 }}>
                      {p.title}
                    </div>
                    <div className="mt-2 text-xs leading-relaxed text-white/70">{p.description}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.stack.slice(0, 5).map((t) => (
                        <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/75">
                          {t}
                        </span>
                      ))}
                    </div>
                    <a
                      className="mt-3 inline-flex text-xs tracking-[0.14em] text-white/70 underline decoration-white/20 underline-offset-4 hover:text-white/85"
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GITHUB LINK
                    </a>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-white/55">{zone.particleDescription}</div>
            </div>
          </div>
        )}

        {zone.id === 'logs' && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/24 p-6 backdrop-blur-sm md:p-8">
              <div className="text-[11px] tracking-[0.38em] text-white/70">MISSION LOG</div>
              <div className="mt-2 text-xs tracking-[0.24em] text-white/55">Remember: open each log to unearth the mission’s hidden echoes.</div>
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
              <div className="mt-2 text-xs tracking-[0.24em] text-white/55">Unearth the archive—expand each origin entry to reveal the deeper memory.</div>
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
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] tracking-[0.38em] text-white/70">CONTACT</div>
                  <h2 className="mt-3 text-2xl tracking-[0.16em]" style={{ color: zone.accent1 }}>
                    THE SIGNAL
                  </h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] tracking-[0.28em] text-white/85">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: zone.accent1 }} />
                  OPEN TO OPPORTUNITIES
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-white/78">
                <ContactRow label="EMAIL" value={content.personalInfo.email} href={`mailto:${content.personalInfo.email}`} accent={zone.accent1} />
                <ContactRow label="GITHUB" value={content.personalInfo.github} href={content.personalInfo.github} accent={zone.accent1} />
                <ContactRow label="LINKEDIN" value={content.personalInfo.linkedin} href={content.personalInfo.linkedin} accent={zone.accent1} />
                <ContactRow label="PHONE" value={content.personalInfo.phone} href={`tel:${content.personalInfo.phone.replace(/\s+/g, '')}`} accent={zone.accent1} />
              </div>

              <div className="mt-6 text-xs text-white/55">{zone.particleDescription}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm md:p-8">
              <div className="text-[11px] tracking-[0.38em] text-white/70">SEND TRANSMISSION</div>
              <div className="mt-4 grid gap-3">
                <input
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-white/20"
                  placeholder="Name"
                />
                <input
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-white/20"
                  placeholder="Email"
                />
                <textarea
                  className="min-h-[150px] w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-white/20"
                  placeholder="Message"
                />
                <SfxButton
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm tracking-[0.16em] text-white/90 hover:bg-white/10"
                  onClick={() => {
                    // Mock form area as requested — no submit side effects.
                  }}
                >
                  SEND
                </SfxButton>
              </div>
              <div className="mt-4 text-xs text-white/55">
                This is a mock terminal panel by design — wire it to your preferred email service later.
              </div>
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
          <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#02050c]/95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="text-[10px] tracking-[0.38em] text-white/60">RESUME VIEWER</div>
                <div className="mt-1 text-lg font-medium text-white">{content.personalInfo.name}'s Resume</div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/85 hover:bg-white/10"
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
            <div className="h-[70vh] bg-black">
              <iframe
                className="h-full w-full border-none bg-black"
                src={content.personalInfo.resumeUrl}
                title="Resume preview"
              />
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

