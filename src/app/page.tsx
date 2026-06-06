'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { personalInfo, projects, technicalSkills, experience, education } from '@/lib/data'
import { ZoneSection, type ZoneId } from '@/components/zones/ZoneSection'
import type { ZoneConfig } from '@/components/world/types'
import { AreaDiscoveredOverlay } from '@/components/world/AreaDiscoveredOverlay'
import { WorldMapModal } from '@/components/world/WorldMapModal'
import { WorldHud } from '@/components/world/WorldHud'
import { CursorGlow } from '@/components/ui/CursorGlow'
import { useZoneDiscovery } from '@/components/world/useZoneDiscovery'

export default function HomePage() {
  const zones = useMemo(
    () =>
      [
        {
          id: 'void',
          name: 'THE ORIGIN',
          biomeRef: 'Ancient Basin',
          background: '#0a0a0a',
          surface: '#161616',
          mid: '#2c2c2c',
          accent1: '#e8e8f0',
          accent2: '#c8c8d8',
          text: '#f2f2f8',
          particleType: 'soul',
          particleDescription: 'Soul essence - achromatic orbs swimming in the basin’s hush',
          zoneDescription:
            'Ancient Basin. Hollow stone holds a current of quiet light. Silent pillars and drifting motes suggest a path that only those who listen will recognise.',
        },
        {
          id: 'core',
          name: 'THE CORE',
          biomeRef: 'City of Tears',
          background: '#0c1220',
          surface: '#1a2a42',
          mid: '#2e4a6e',
          accent1: '#a8c4d8',
          accent2: '#90abc8',
          text: '#d0e1f0',
          particleType: 'rain',
          particleDescription: 'City rain - silver threads falling through cerulean clouds',
          zoneDescription:
            'City of Tears. Vaulted ribs and patient stone shape the light into ordered columns. The air here carries a steady professionalism, like work honed by careful repetition.',
        },
        {
          id: 'labs',
          name: 'THE LABS',
          biomeRef: 'Crystal Peak',
          background: '#0e0818',
          surface: '#1e1035',
          mid: '#4a2a7a',
          accent1: '#d4a8f0',
          accent2: '#b894dd',
          text: '#e0d4f0',
          particleType: 'crystal',
          particleDescription: 'Crystal shards - slow facets catching the pale glow',
          zoneDescription:
            'Crystal Peak. Lean spires and fractured light mark a place of restless craft. Sharp forms turn and shimmer, hinting at the rare work born from repeated ascent.',
        },
        {
          id: 'logs',
          name: 'THE LOGS',
          biomeRef: 'Resting Grounds',
          background: '#100a04',
          surface: '#251508',
          mid: '#5a3010',
          accent1: '#e8b870',
          accent2: '#d19a5c',
          text: '#f0e0b8',
          particleType: 'spirits',
          particleDescription: 'Dream motes - amber wisps rising from quiet stones',
          zoneDescription:
            'Resting Grounds. Rows of weathered markers and a lone sentinel tree keep watch over quiet memory. The air here feels less about display and more about what has already been recorded.',
        },
        {
          id: 'signal',
          name: 'THE SIGNAL',
          biomeRef: 'Greenpath',
          background: '#020e0a',
          surface: '#041e14',
          mid: '#0a4a2e',
          accent1: '#60e8b0',
          accent2: '#47d4a0',
          text: '#c8f4dc',
          particleType: 'spores',
          particleDescription: 'Greenspores - soft seeds drifting beneath the canopy',
          zoneDescription:
            'Greenpath. Layered leaves filter the world into calm green light. The path here feels warm and inviting, as if it is leading toward something quietly grown.',
        },
      ] as const,
    []
  )

  const [mapOpen, setMapOpen] = useState(false)
  const bgRef = useRef<HTMLDivElement | null>(null)

  const { activeZoneId, visited, discovery } = useZoneDiscovery(
    zones.map((z) => z.id as ZoneId),
    { mapOpen, onOpenMap: () => setMapOpen(true) }
  )

  useEffect(() => {
    const sectionEls = Array.from(document.querySelectorAll<HTMLElement>('[data-zone]'))
    const bgEl = bgRef.current
    if (!bgEl || sectionEls.length === 0) return

    const hexToRgb = (hex: string) => {
      const h = hex.replace('#', '').trim()
      const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
      const n = Number.parseInt(full, 16)
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

    const updateBackground = () => {
      const vh = window.innerHeight
      const centerY = vh * 0.5
      const zoneRects = sectionEls.map((el) => ({
        id: el.dataset.zone ?? '',
        rect: el.getBoundingClientRect(),
      }))

      let currentIndex = zoneRects.findIndex((zoneRect) => zoneRect.rect.top <= centerY && zoneRect.rect.bottom >= centerY)
      if (currentIndex === -1) {
        const first = zoneRects[0]
        const last = zoneRects[zoneRects.length - 1]
        currentIndex = centerY < (first?.rect.top ?? 0) ? 0 : zoneRects.length - 1
      }

      const currentZone = zones.find((zone) => zone.id === zoneRects[currentIndex]?.id)
      const nextZone = currentIndex < zoneRects.length - 1 ? zones.find((zone) => zone.id === zoneRects[currentIndex + 1]?.id) : undefined
      if (!currentZone) return

      let color: string = currentZone.background
      if (nextZone) {
        const boundaryY = zoneRects[currentIndex].rect.bottom
        const start = boundaryY - vh * 0.8
        const end = boundaryY + vh * 0.2
        const progress = clamp01((centerY - start) / (end - start))

        if (progress > 0) {
          const currentRgb = hexToRgb(currentZone.background)
          const nextRgb = hexToRgb(nextZone.background)
          const r = Math.round(lerp(currentRgb.r, nextRgb.r, progress))
          const g = Math.round(lerp(currentRgb.g, nextRgb.g, progress))
          const b = Math.round(lerp(currentRgb.b, nextRgb.b, progress))
          color = `rgb(${r}, ${g}, ${b})`
        }
      }

      bgEl.style.backgroundColor = color
    }

    const handleScroll = () => {
      updateBackground()
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [zones])

  return (
    <main>
      <WorldHud
        zones={zones}
        activeZoneId={activeZoneId}
        visited={visited}
        onOpenMap={() => setMapOpen(true)}
      />
      <div
        ref={bgRef}
        id="bg-canvas"
        className="fixed inset-0 z-0"
        style={{ backgroundColor: zones.find((z) => z.id === activeZoneId)?.background ?? '#0a0a0a' }}
      />
      {zones.map((z, index) => (
        <ZoneSection
          key={z.id}
          zone={z}
          activeZoneId={activeZoneId}
          content={{
            personalInfo,
            technicalSkills,
            projects,
            experience,
            education,
          }}
        />
      ))}

      <AnimatePresence>
        {discovery && <AreaDiscoveredOverlay discovery={discovery} />}
      </AnimatePresence>

      <WorldMapModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        zones={zones}
        activeZoneId={activeZoneId}
        visited={visited}
      />
      <CursorGlow />
    </main>
  )
}

