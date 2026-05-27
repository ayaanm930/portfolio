'use client'

import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    const onMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      glow.style.opacity = '0.6'
    }

    const onLeave = () => {
      glow.style.opacity = '0'
    }

    const animate = () => {
      const px = pointerRef.current.x
      const py = pointerRef.current.y
      // Higher factor = quicker following (1 = instant)
      currentRef.current.x += (px - currentRef.current.x) * 0.55
      currentRef.current.y += (py - currentRef.current.y) * 0.55
      glow.style.transform = `translate3d(${currentRef.current.x - 24}px, ${currentRef.current.y - 24}px, 0)`
      requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    const raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={glowRef} className="cursor-glow" />
}