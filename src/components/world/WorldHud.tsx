'use client'

import { useState } from 'react'
import Image from 'next/image'
import { IconChevronDown, IconChevronUp, IconMap2, IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons-react'
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

  const handleMuteToggle = () => {
    audio.setMuted(!audio.muted)
  }

  const VolumeIcon = audio.muted
    ? IconVolumeOff
    : audio.volume > 0.5
    ? IconVolume
    : IconVolume2

  return (
    <>
      <div className="fixed bottom-5 left-5 z-[60]">
        {collapsed ? (
          <div
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-2 py-2 md:backdrop-blur-md"
            style={active ? { boxShadow: `0 0 24px ${active.accent2}22` } : undefined}
          >
            {/* avatar motif */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <Image
                src="/graphics/knight.png"
                alt="flea"
                width={50}
                height={50}
                style={{ imageRendering: 'pixelated' }}
                priority
              />
            </div>
            <SfxButton
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
              skipSfx
              onClick={handleMuteToggle}
              aria-label={audio.muted ? 'Unmute audio' : 'Mute audio'}
            >
              <VolumeIcon size={16} />
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
            className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 md:backdrop-blur-md"
            style={
              active
                ? { boxShadow: `0 0 30px ${active.accent2}22` }
                : undefined
            }
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/graphics/knight.png"
                  alt="knight"
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
                {active?.name ?? ''}
              </div>
            </div>
            <div className="mt-1 text-xs text-white/55 tracking-wide">{active?.biomeRef ?? ''}</div>

            {/* Audio controls */}
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs tracking-[0.14em] text-white/80 hover:bg-white/10 transition-colors"
                onClick={handleMuteToggle}
              >
                <VolumeIcon size={16} />
                {audio.muted ? 'MUTED' : 'AUDIO ON'}
              </button>

              {/* Volume slider — only shown when unmuted */}
              {!audio.muted && (
                <div className="flex items-center gap-2 px-1">
                  <IconVolumeOff size={12} className="shrink-0 text-white/35" />
                  <div className="relative flex-1 h-1 rounded-full bg-white/10">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all"
                      style={{
                        width: `${audio.volume * 100}%`,
                        backgroundColor: active?.accent1 ?? '#fff',
                        boxShadow: `0 0 6px ${active?.accent1 ?? '#fff'}88`,
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={audio.volume}
                      onChange={(e) => audio.setVolume(Number(e.target.value))}
                      className="absolute inset-0 w-full cursor-pointer opacity-0 h-full"
                      aria-label="Volume"
                    />
                  </div>
                  <IconVolume size={12} className="shrink-0 text-white/35" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
        <SfxButton
          type="button"
          sfx="map"
          className={cn(
            'group relative inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm tracking-[0.12em] md:backdrop-blur-md',
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