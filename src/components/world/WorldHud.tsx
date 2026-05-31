'use client'

import { useState } from 'react'
import Image from 'next/image'
import { IconChevronDown, IconChevronUp, IconMap2, IconVolume, IconVolumeOff } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { SfxButton } from '@/components/ui/SfxButton'
import { useAudio } from '@/components/audio/AudioProvider'
import type { ZoneConfig, ZoneId } from '@/components/world/types'

export function WorldHud({
  zones,
  activeZoneId,
  visited,
  onOpenMap,
}: {
  zones: readonly ZoneConfig[]
  activeZoneId: ZoneId
  visited: Record<ZoneId, boolean>
  onOpenMap: () => void
}) {
  const audio = useAudio()
  const active = zones.find((z) => z.id === activeZoneId)
  const [collapsed, setCollapsed] = useState(true)

  return (
    <>
      <div className="fixed bottom-5 left-5 z-[60]">
        {collapsed ? (
          <div
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-2 py-2 backdrop-blur-md"
            style={active ? { boxShadow: `0 0 24px ${active.accent2}22` } : undefined}
          >
            {/* Knight avatar motif */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <Image
                src="/graphics/knight.png"
                alt="Knight"
                width={26}
                height={26}
                style={{ imageRendering: 'pixelated' }}
                priority
              />
            </div>
            <SfxButton
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
              onClick={() => audio.toggleMuted()}
              aria-label={audio.muted ? 'Unmute audio' : 'Mute audio'}
            >
              {audio.muted ? <IconVolumeOff size={16} /> : <IconVolume size={16} />}
            </SfxButton>
            <SfxButton
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
              onClick={() => setCollapsed(false)}
              aria-label="Expand HUD"
            >
              <IconChevronUp size={16} />
            </SfxButton>
          </div>
        ) : (
          <div
            className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-md"
            style={
              active
                ? {
                    boxShadow: `0 0 30px ${active.accent2}22`,
                  }
                : undefined
            }
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/graphics/knight.png"
                  alt="Knight"
                  width={18}
                  height={18}
                  style={{ imageRendering: 'pixelated', opacity: 0.7 }}
                />
                <div className="text-[10px] tracking-[0.38em] text-white/60">ACTIVE AREA</div>
              </div>
              <SfxButton
                type="button"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse HUD"
              >
                <IconChevronDown size={14} />
              </SfxButton>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: active?.accent1 ?? '#fff',
                  boxShadow: `0 0 18px ${active?.accent1 ?? '#fff'}aa`,
                }}
              />
              <div className="text-sm tracking-[0.12em]" style={{ color: active?.text ?? '#fff' }}>
                {active?.name ?? '—'}
              </div>
            </div>
            <div className="mt-1 text-xs text-white/55 tracking-wide">{active?.biomeRef ?? ''}</div>
            <div className="mt-3 flex items-center gap-2">
              <SfxButton
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs tracking-[0.14em] text-white/80 hover:bg-white/10"
                onClick={() => audio.toggleMuted()}
              >
                {audio.muted ? <IconVolumeOff size={16} /> : <IconVolume size={16} />}
                {audio.muted ? 'MUTED' : 'AUDIO'}
              </SfxButton>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
        <SfxButton
          type="button"
          sfx="map"
          className={cn(
            'group relative inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm tracking-[0.12em] backdrop-blur-md',
            'text-white/85 hover:bg-black/55'
          )}
          onClick={onOpenMap}
          aria-label="Open world map"
        >
          <IconMap2 size={18} />
          WORLD MAP
          <span className="ml-1 inline-flex items-center gap-1 text-[10px] tracking-[0.3em] text-white/55">
            {Object.values(visited).filter(Boolean).length}/5
          </span>
          <span
            className="absolute -inset-0.5 rounded-[18px] opacity-0 blur-xl transition-opacity group-hover:opacity-70"
            style={{
              background: active
                ? `radial-gradient(circle at 35% 40%, ${active.accent1}55 0%, transparent 65%)`
                : undefined,
            }}
          />
        </SfxButton>
      </div>
    </>
  )
}

