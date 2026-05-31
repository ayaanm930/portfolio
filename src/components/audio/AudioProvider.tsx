'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'

type SfxKey = 'click' | 'gate' | 'map'

type AudioContextValue = {
  muted: boolean
  setMuted: (muted: boolean) => void
  toggleMuted: () => void
  play: (key: SfxKey) => void
}

const AudioCtx = createContext<AudioContextValue | null>(null)

const STORAGE_KEY = 'hk_portfolio_muted'

function safeLocalStorageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}
function safeLocalStorageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(true)
  const ambientRef = useRef<Howl | null>(null)
  const sfxRef = useRef<Record<SfxKey, Howl> | null>(null)

  useEffect(() => {
    const stored = safeLocalStorageGet(STORAGE_KEY)
    if (stored === '0') setMutedState(false)
    if (stored === '1') setMutedState(true)
  }, [])

  const setMuted = useCallback((next: boolean) => {
    setMutedState(next)
    safeLocalStorageSet(STORAGE_KEY, next ? '1' : '0')
  }, [])

  const toggleMuted = useCallback(() => {
    setMuted(!muted)
  }, [setMuted, muted])

  // Preload sounds once (and keep Howl instances stable).
  useEffect(() => {
    // Public paths you will add audio files to:
    // - public/audio/ambient.mp3
    // - public/audio/click.mp3
    // - public/audio/gate.mp3
    // - public/audio/map.mp3
    const ambient = new Howl({
      src: ['/audio/ambient.mp3'],
      loop: true,
      volume: 0.0099,
      html5: true,
      onloaderror: () => {
        // If no file exists, fail silently (site still works).
      },
    })

    const click = new Howl({
      src: ['/audio/click.mp3'],
      volume: 0.1,
      html5: true,
      onloaderror: () => { },
    })
    const gate = new Howl({
      src: ['/audio/gate.mp3'],
      volume: 0.1,
      html5: true,
      onloaderror: () => { },
    })
    const map = new Howl({
      src: ['/audio/map.mp3'],
      volume: 0.1,
      html5: true,
      onloaderror: () => { },
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

  useEffect(() => {
    Howler.mute(muted)
  }, [muted])

  // Start ambient after first user interaction OR immediately if unmuted.
  useEffect(() => {
    const ambient = ambientRef.current
    if (!ambient) return

    if (!muted) {
      if (!ambient.playing()) ambient.play()
      return
    }

    const onFirstInteraction = () => {
      // If user unmuted later, ambient will start there.
      // If they choose to unmute now, start immediately.
      // Also unlock audio on iOS/Chrome policies.
      // We don't auto-unmute; we only ensure the graph is ready.
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
    if (!ambient) return
    if (muted) return
    if (!ambient.playing()) ambient.play()
  }, [muted])

  const play = useCallback((key: SfxKey) => {
    const sfx = sfxRef.current
    if (!sfx) return
    const howl = sfx[key]
    try {
      howl.stop()
      howl.play()
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo<AudioContextValue>(
    () => ({ muted, setMuted, toggleMuted, play }),
    [muted, setMuted, toggleMuted, play]
  )

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}

