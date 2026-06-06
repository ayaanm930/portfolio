'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { SfxButton } from '@/components/ui/SfxButton'
import type { ZoneConfig, ZoneId } from '@/components/world/types'

type Point = { x: number; y: number }

const ROOM_POS: Record<ZoneId, Point> = {
  void: { x: 70, y: 180 },
  core: { x: 210, y: 110 },
  labs: { x: 360, y: 160 },
  logs: { x: 520, y: 120 },
  signal: { x: 620, y: 230 },
}

const LINKS: Array<[ZoneId, ZoneId]> = [
  ['void', 'core'],
  ['core', 'labs'],
  ['labs', 'logs'],
  ['logs', 'signal'],
]

function scrollToZone(id: ZoneId) {
  const el = document.getElementById(`zone-${id}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function WorldMapModal({
  open,
  onClose,
  zones,
  activeZoneId,
  visited,
}: {
  open: boolean
  onClose: () => void
  zones: readonly ZoneConfig[]
  activeZoneId: ZoneId
  visited: Record<ZoneId, boolean>
}) {
  const z = (id: ZoneId) => zones.find((x) => x.id === id)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm md:backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="absolute left-1/2 top-1/2 w-[min(62rem,95vw)] -translate-x-1/2 -translate-y-1/2 max-h-[95vh] overflow-hidden rounded-2xl border border-white/10 bg-black/55 md:backdrop-blur-md"
            initial={{ opacity: 0, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.99 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label="World map"
          >
            <div className="flex items-center justify-between px-5 py-4 md:px-7">
              <div>
                <div className="text-[10px] tracking-[0.38em] text-white/60">WORLD MAP</div>
                <div className="mt-1 text-sm tracking-[0.14em] text-white/85">Discoverable rooms — scroll or jump.</div>
              </div>
              <SfxButton
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10"
                onClick={onClose}
                aria-label="Close map"
              >
                <IconX size={18} />
              </SfxButton>
            </div>

            <div className="px-5 pb-6 md:px-7">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/35">
                <svg
                  viewBox="0 0 700 320"
                  className="block h-[min(54vh,420px)] w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2.6" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Connection lines */}
                  {LINKS.map(([a, b]) => {
                    const pa = ROOM_POS[a]
                    const pb = ROOM_POS[b]
                    const aa = z(a)?.accent1 ?? '#fff'
                    const bb = z(b)?.accent1 ?? '#fff'
                    const active = a === activeZoneId || b === activeZoneId
                    const discovered = visited[a] && visited[b]
                    return (
                      <g key={`${a}-${b}`} opacity={discovered ? 0.9 : 0.45}>
                        <path
                          d={`M ${pa.x} ${pa.y} C ${(pa.x + pb.x) / 2} ${pa.y - 60}, ${(pa.x + pb.x) / 2} ${
                            pb.y + 60
                          }, ${pb.x} ${pb.y}`}
                          fill="none"
                          stroke={active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.28)'}
                          strokeWidth={2}
                        />
                        <path
                          d={`M ${pa.x} ${pa.y} C ${(pa.x + pb.x) / 2} ${pa.y - 60}, ${(pa.x + pb.x) / 2} ${
                            pb.y + 60
                          }, ${pb.x} ${pb.y}`}
                          fill="none"
                          stroke={`url(#grad-${a}-${b})`}
                          strokeWidth={4}
                          opacity={active ? 0.75 : 0.35}
                          filter="url(#glow)"
                        />
                        <linearGradient id={`grad-${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}>
                          <stop offset="0%" stopColor={aa} stopOpacity="0.8" />
                          <stop offset="100%" stopColor={bb} stopOpacity="0.8" />
                        </linearGradient>
                      </g>
                    )
                  })}

                  {/* Rooms */}
                  {(Object.keys(ROOM_POS) as ZoneId[]).map((id) => {
                    const p = ROOM_POS[id]
                    const zone = z(id)
                    const accent = zone?.accent1 ?? '#fff'
                    const isActive = id === activeZoneId
                    const isVisited = visited[id]
                    return (
                      <g key={id}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isActive ? 18 : 14}
                          fill={isVisited ? `${accent}` : 'rgba(255,255,255,0.10)'}
                          opacity={isVisited ? 0.95 : 0.8}
                          filter="url(#glow)"
                        />
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isActive ? 26 : 22}
                          fill="transparent"
                          stroke={isActive ? `${accent}` : 'rgba(255,255,255,0.18)'}
                          strokeWidth={2}
                          opacity={isActive ? 0.9 : 0.55}
                        />
                        <foreignObject x={p.x - 85} y={p.y + 22} width={170} height={60}>
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={cn(
                                'rounded-full border px-3 py-1 text-[10px] tracking-[0.28em] md:backdrop-blur-md',
                                isActive
                                  ? 'border-white/25 bg-white/10 text-white'
                                  : 'border-white/10 bg-black/30 text-white/75'
                              )}
                              style={isVisited ? { boxShadow: `0 0 22px ${accent}33` } : undefined}
                            >
                              {zone?.name ?? id.toUpperCase()}
                            </div>
                          </div>
                        </foreignObject>
                        {/* Click target */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={34}
                          fill="transparent"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            scrollToZone(id)
                            onClose()
                          }}
                        />
                      </g>
                    )
                  })}
                </svg>

                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] tracking-wide text-white/60">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-white/60" />
                      visited
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                      undiscovered
                    </span>
                  </div>
                  <div>Click a room to travel.</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

