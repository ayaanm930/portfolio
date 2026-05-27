'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { personalInfo, projects, skills, technicalSkills, experience, education } from '@/lib/data'
import { ZoneSection, type ZoneId } from '@/components/zones/ZoneSection'
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
          background: '#050810',
          accent1: '#c4a35a',
          accent2: '#7060b0',
          text: '#e2ddd6',
          particleType: 'soul',
          particleDescription: 'Soul essence — amber motes swimming in the basin’s hush',
          zoneDescription:
            'Ancient Basin. Hollow stone holds a current of quiet light. Silent pillars and drifting motes suggest a path that only those who listen will recognise.',
        },
        {
          id: 'core',
          name: 'THE CORE',
          biomeRef: 'City of Tears',
          background: '#05090f',
          accent1: '#7ab4d4',
          accent2: '#b0cce0',
          text: '#c8dce8',
          particleType: 'rain',
          particleDescription: 'City rain — silver threads falling through carved arches',
          zoneDescription:
            'City of Tears. Vaulted ribs and patient stone shape the light into ordered columns. The air here carries a steady professionalism, like work honed by careful repetition.',
        },
        {
          id: 'labs',
          name: 'THE LABS',
          biomeRef: 'Crystal Peak',
          background: '#03070c',
          accent1: '#4dd4e8',
          accent2: '#e87ad4',
          text: '#b8f0f8',
          particleType: 'crystal',
          particleDescription: 'Crystal shards — slow facets catching the pale glow',
          zoneDescription:
            'Crystal Peak. Lean spires and fractured light mark a place of restless craft. Sharp forms turn and shimmer, hinting at the rare work born from repeated ascent.',
        },
        {
          id: 'logs',
          name: 'THE LOGS',
          biomeRef: 'Resting Grounds',
          background: '#07040d',
          accent1: '#9478cc',
          accent2: '#c4b0e8',
          text: '#d4c8f0',
          particleType: 'spirits',
          particleDescription: 'Dream motes — violet wisps rising from quiet stones',
          zoneDescription:
            'Resting Grounds. Rows of weathered markers and a lone sentinel tree keep watch over quiet memory. The air here feels less about display and more about what has already been recorded.',
        },
        {
          id: 'signal',
          name: 'THE SIGNAL',
          biomeRef: 'Greenpath',
          background: '#020c04',
          accent1: '#4dd478',
          accent2: '#a8e8b8',
          text: '#b8f0c8',
          particleType: 'spores',
          particleDescription: 'Greenspores — soft seeds drifting beneath the canopy',
          zoneDescription:
            'Greenpath. Layered leaves filter the world into calm green light. The path here feels warm and inviting, as if it is leading toward something quietly grown.',
        },
      ] as const,
    []
  )

  const [mapOpen, setMapOpen] = useState(false)

  const { activeZoneId, visited, discovery } = useZoneDiscovery(
    zones.map((z) => z.id as ZoneId),
    { mapOpen, onOpenMap: () => setMapOpen(true) }
  )

  return (
    <main>
      <WorldHud
        zones={zones}
        activeZoneId={activeZoneId}
        visited={visited}
        onOpenMap={() => setMapOpen(true)}
      />

      {zones.map((z, index) => (
        <ZoneSection
          key={z.id}
          zone={z}
          activeZoneId={activeZoneId}
          previousZoneBackground={index > 0 ? zones[index - 1].background : undefined}
          nextZoneBackground={index < zones.length - 1 ? zones[index + 1].background : undefined}
          content={{
            personalInfo,
            skills,
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

