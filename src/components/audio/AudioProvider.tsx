'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'

type SfxKey = 'click' | 'gate' | 'map'

type AudioContextValue = {
  muted: boolean
  volume: number
  setMuted: (muted: boolean) => void
  setVolume: (volume: number) => void
  toggleMuted: () => void
  play: (key: SfxKey) => void
}

const AudioCtx = createContext<AudioContextValue | null>(null)

const STORAGE_KEY = 'hk_portfolio_muted'
const VOLUME_KEY = 'hk_portfolio_volume'
const DEFAULT_VOLUME = 0.6

// Base volumes per sound — slider scales these proportionally
const BASE_VOLUMES: Record<string, number> = {
  ambient: 0.07,
  click:   0.28,
  gate:    0.42,
  map:     0.25,
}

function safeLocalStorageGet(key: string): string | null {
  try { return window.localStorage.getItem(key) } catch { return null }
}
function safeLocalStorageSet(key: string, value: string) {
  try { window.localStorage.setItem(key, value) } catch { /* ignore */ }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(true)
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME)
  const ambientRef = useRef<Howl | null>(null)
  const sfxRef = useRef<Record<SfxKey, Howl> | null>(null)

  useEffect(() => {
    const storedMuted = safeLocalStorageGet(STORAGE_KEY)
    if (storedMuted === '0') setMutedState(false)
    if (storedMuted === '1') setMutedState(true)

    const storedVolume = safeLocalStorageGet(VOLUME_KEY)
    if (storedVolume !== null) {
      const parsed = parseFloat(storedVolume)
      if (!isNaN(parsed)) setVolumeState(parsed)
    }
  }, [])

  const setMuted = useCallback((next: boolean) => {
    setMutedState(next)
    safeLocalStorageSet(STORAGE_KEY, next ? '1' : '0')
  }, [])

  const toggleMuted = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev
      safeLocalStorageSet(STORAGE_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  const setVolume = useCallback((next: number) => {
    const clamped = Math.min(1, Math.max(0, next))
    setVolumeState(clamped)
    safeLocalStorageSet(VOLUME_KEY, String(clamped))

    // Scale each howl's volume relative to its base value
    if (ambientRef.current) {
      ambientRef.current.volume(BASE_VOLUMES.ambient * clamped)
    }
    if (sfxRef.current) {
      sfxRef.current.click.volume(BASE_VOLUMES.click * clamped)
      sfxRef.current.gate.volume(BASE_VOLUMES.gate * clamped)
      sfxRef.current.map.volume(BASE_VOLUMES.map * clamped)
    }
  }, [])

  const initSounds = useCallback(() => {
    if (ambientRef.current && sfxRef.current) return

    const storedVolume = safeLocalStorageGet(VOLUME_KEY)
    const vol = storedVolume !== null ? parseFloat(storedVolume) || DEFAULT_VOLUME : DEFAULT_VOLUME

    const ambient = new Howl({
      src: ['/audio/ambient.mp3'],
      loop: true,
      volume: BASE_VOLUMES.ambient * vol,
      html5: true,
      preload: false,
      onloaderror: () => {},
    })
    const click = new Howl({
      src: ['/audio/click.mp3'],
      volume: BASE_VOLUMES.click * vol,
      html5: true,
      preload: false,
      onloaderror: () => {},
    })
    const gate = new Howl({
      src: ['/audio/gate.mp3'],
      volume: BASE_VOLUMES.gate * vol,
      html5: true,
      preload: false,
      onloaderror: () => {},
    })
    const map = new Howl({
      src: ['/audio/map.mp3'],
      volume: BASE_VOLUMES.map * vol,
      html5: true,
      preload: false,
      onloaderror: () => {},
    })

    ambientRef.current = ambient
    sfxRef.current = { click, gate, map }

    return () => {
      ambient.unload()
      click.unload()
      gate.unload()
      map.unload()
    }
  }, [])

  useEffect(() => { return initSounds() }, [initSounds])

  // Mute by zeroing volume on each Howl directly — more reliable than Howler.mute()
  // which can conflict with per-instance .volume() calls
  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.volume(muted ? 0 : BASE_VOLUMES.ambient * volume)
    }
    if (sfxRef.current) {
      sfxRef.current.click.volume(muted ? 0 : BASE_VOLUMES.click * volume)
      sfxRef.current.gate.volume(muted ? 0 : BASE_VOLUMES.gate * volume)
      sfxRef.current.map.volume(muted ? 0 : BASE_VOLUMES.map * volume)
    }
  }, [muted, volume])

  // Ambient playback
  useEffect(() => {
    const ambient = ambientRef.current
    if (!ambient) return
    if (!muted) {
      if (!ambient.playing()) ambient.play()
      return
    }
    const onFirstInteraction = () => {
      if (!ambient.playing() && !muted) ambient.play()
    }
    window.addEventListener('pointerdown', onFirstInteraction, { once: true })
    window.addEventListener('keydown', onFirstInteraction, { once: true })
    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
  }, [muted])

  useEffect(() => {
    const ambient = ambientRef.current
    if (!ambient || muted) return
    if (!ambient.playing()) ambient.play()
  }, [muted])

  const play = useCallback((key: SfxKey) => {
    if (!sfxRef.current) return
    try {
      const howl = sfxRef.current[key]
      howl.stop()
      howl.play()
    } catch { /* ignore */ }
  }, [])

  const value = useMemo<AudioContextValue>(
    () => ({ muted, volume, setMuted, setVolume, toggleMuted, play }),
    [muted, volume, setMuted, setVolume, toggleMuted, play]
  )

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}