'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAudio } from '@/components/audio/AudioProvider'
import type { DiscoveryEvent, ZoneId } from '@/components/world/types'

type Options = {
  mapOpen: boolean
  onOpenMap: () => void
}

export function useZoneDiscovery(zoneIds: ZoneId[], opts: Options) {
  const audio = useAudio()

  const [activeZoneId, setActiveZoneId] = useState<ZoneId>('void')
  const [visited, setVisited] = useState<Record<ZoneId, boolean>>(() => {
    const initial: Record<ZoneId, boolean> = {
      void: false,
      core: false,
      labs: false,
      logs: false,
      signal: false,
    }
    return initial
  })
  const [discovery, setDiscovery] = useState<DiscoveryEvent | null>(null)

  const discoveredZonesRef = useRef<Set<ZoneId>>(new Set())
  const discoveryTimeoutRef = useRef<number | null>(null)

  // Observe zone intersections to set active zone.
  useEffect(() => {
    const els = zoneIds
      .map((id) => document.getElementById(`zone-${id}`))
      .filter((x): x is HTMLElement => Boolean(x))

    if (els.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null
        let bestScore = -Infinity
        const viewportHeight = window.innerHeight || 1
        const titleThreshold = viewportHeight * 0.25

        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.zoneId as ZoneId | undefined
          if (!id) continue

          const ratio = e.intersectionRatio
          const rect = e.boundingClientRect
          const titleVisible = rect.top >= 0 && rect.top < titleThreshold
          const centerDistance = Math.abs(rect.top + rect.height / 2 - viewportHeight / 2)
          const centerScore = Math.max(0, 1 - centerDistance / viewportHeight)

          let score = ratio
          if (ratio >= 0.5) score += 1.5
          else if (ratio >= 0.25 && titleVisible) score += 1.0
          score += centerScore * 0.2

          if (score > bestScore) {
            bestScore = score
            best = e
          }
        }

        if (!best) return
        const id = (best.target as HTMLElement).dataset.zoneId as ZoneId | undefined
        if (!id) return
        setActiveZoneId(id)
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: [0.25, 0.5, 0.75],
      }
    )

    for (const el of els) io.observe(el)
    return () => io.disconnect()
  }, [zoneIds])

  // Fire "discovered" when active zone changes.
  useEffect(() => {
    if (discoveredZonesRef.current.has(activeZoneId)) return
    discoveredZonesRef.current.add(activeZoneId)
    setVisited((prev) => ({ ...prev, [activeZoneId]: true }))

    const el = document.getElementById(`zone-${activeZoneId}`)
    const zoneName = el?.dataset.zoneName ?? activeZoneId.toUpperCase()
    const accent = el?.dataset.zoneAccent ?? '#ffffff'

    audio.play('gate')
    setDiscovery({ id: activeZoneId, name: zoneName, accent })

    if (discoveryTimeoutRef.current) {
      window.clearTimeout(discoveryTimeoutRef.current)
    }
    discoveryTimeoutRef.current = window.setTimeout(() => {
      setDiscovery(null)
      discoveryTimeoutRef.current = null
    }, 2400)
  }, [activeZoneId, audio])

  useEffect(() => {
    return () => {
      if (discoveryTimeoutRef.current) window.clearTimeout(discoveryTimeoutRef.current)
    }
  }, [])

  const openMap = useMemo(
    () => () => {
      if (!opts.mapOpen) audio.play('map')
      opts.onOpenMap()
    },
    [opts, audio]
  )

  return { activeZoneId, visited, discovery, openMap }
}

