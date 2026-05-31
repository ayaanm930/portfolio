'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const pointerRef = useRef({ x: -200, y: -200 })
  const glowCurrentRef = useRef({ x: -200, y: -200 })
  const [isDesktop, setIsDesktop] = useState(false)
  const enteredRef = useRef(false)
  const rafRef = useRef<number>(0)

  // Detect if device has a real mouse (hover:hover + pointer:fine)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!isDesktop) return

    const glow = glowRef.current
    const cursor = cursorRef.current
    if (!glow || !cursor) return

    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }
      // Cursor image: instant, offset so nail tip aligns with hotspot
      cursor.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`
      glow.style.opacity = '1'
      if (!enteredRef.current) {
        enteredRef.current = true
        cursor.style.opacity = '1'
      }
    }

    const onLeave = () => {
      glow.style.opacity = '0'
    }

    const animate = () => {
      const { x: px, y: py } = pointerRef.current
      // Slow lerp for a dreamy trailing glow (0.06 = very smooth lag)
      glowCurrentRef.current.x += (px - glowCurrentRef.current.x) * 0.06
      glowCurrentRef.current.y += (py - glowCurrentRef.current.y) * 0.06
      glow.style.transform = `translate3d(${glowCurrentRef.current.x - 110}px, ${glowCurrentRef.current.y - 110}px, 0)`
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isDesktop])

  // On mobile/touch: render nothing, real cursor stays
  if (!isDesktop) return null

  return (
    <>
      {/* Custom cursor image — tracks mouse instantly */}
      <div
        ref={cursorRef}
        className="cursor-img"
        style={{ opacity: 0, transition: 'opacity 0.15s ease' }}
      >
        <Image
          src="/graphics/cursor.png"
          alt=""
          width={38}
          height={38}
          draggable={false}
          priority
          style={{ display: 'block', userSelect: 'none', pointerEvents: 'none' }}
        />
      </div>

      {/* Glow — lags behind for dreamy trail effect */}
      <div ref={glowRef} className="cursor-glow" />
    </>
  )
}