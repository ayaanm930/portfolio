'use client'

import { useEffect, useRef } from 'react'
import type { ZoneConfig } from '@/components/world/types'

type V2 = { x: number; y: number }

type ParticleBase = {
  pos: V2
  vel: V2
  size: number
  life: number
  seed: number
  hueShift: number
  rot: number
  rotV: number
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function rand(seed: number) {
  // Deterministic-ish hash PRNG (cheap, stable).
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '').trim()
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = Number.parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgba(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

function dprScale(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  const rect = canvas.getBoundingClientRect()
  const w = Math.max(1, Math.floor(rect.width * dpr))
  const h = Math.max(1, Math.floor(rect.height * dpr))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)
  return { width: rect.width, height: rect.height, dpr }
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, base: string) {
  ctx.save()
  const g = ctx.createRadialGradient(w * 0.5, h * 0.48, Math.min(w, h) * 0.1, w * 0.5, h * 0.52, Math.max(w, h) * 0.7)
  g.addColorStop(0, rgba(base, 0))
  g.addColorStop(0.7, rgba('#000000', 0.28))
  g.addColorStop(1, rgba('#000000', 0.72))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.restore()
}

function drawFog(ctx: CanvasRenderingContext2D, w: number, h: number, accent: string, t: number, intensity: number) {
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  const bandY = h * 0.65
  const drift = Math.sin(t * 0.00025) * 40 + Math.cos(t * 0.00017) * 22
  const g = ctx.createLinearGradient(0, bandY - 160, 0, bandY + 160)
  g.addColorStop(0, rgba(accent, 0))
  g.addColorStop(0.35, rgba(accent, 0.06 * intensity))
  g.addColorStop(0.65, rgba(accent, 0.03 * intensity))
  g.addColorStop(1, rgba(accent, 0))
  ctx.translate(drift, 0)
  ctx.fillStyle = g
  ctx.fillRect(-w, 0, w * 3, h)
  ctx.restore()
}

function drawZoneMood(ctx: CanvasRenderingContext2D, w: number, h: number, zone: ZoneConfig, t: number) {
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = 0.14

  if (zone.id === 'void') {
    const glowY = h * 0.72
    for (let i = 0; i < 3; i++) {
      const x = w * (0.24 + i * 0.26)
      const r = 28 + i * 10
      const g = ctx.createRadialGradient(x, glowY, 0, x, glowY, r)
      g.addColorStop(0, rgba(zone.accent1, 0.18))
      g.addColorStop(0.55, rgba(zone.accent1, 0.08))
      g.addColorStop(1, rgba(zone.accent2, 0))
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, glowY, r, 0, Math.PI * 2)
      ctx.fill()
    }
    const beam = ctx.createLinearGradient(w * 0.48, h * 0.4, w * 0.48, h)
    beam.addColorStop(0, rgba(zone.accent1, 0))
    beam.addColorStop(0.35, rgba(zone.accent1, 0.08))
    beam.addColorStop(0.85, rgba(zone.accent1, 0.02))
    beam.addColorStop(1, rgba(zone.accent1, 0))
    ctx.fillStyle = beam
    ctx.fillRect(w * 0.42, h * 0.4, w * 0.16, h * 0.6)
  }

  if (zone.id === 'core') {
    ctx.strokeStyle = rgba(zone.accent2, 0.16)
    ctx.lineWidth = 1.2
    for (let i = 0; i < 5; i++) {
      const y = h * (0.12 + i * 0.14)
      ctx.beginPath()
      ctx.moveTo(w * 0.06, y)
      ctx.bezierCurveTo(w * 0.3, y + 18, w * 0.7, y - 18, w * 0.95, y)
      ctx.stroke()
    }
    ctx.globalAlpha = 0.08
    const arch = ctx.createRadialGradient(w * 0.5, h * 0.2, 0, w * 0.5, h * 0.2, w * 0.7)
    arch.addColorStop(0, rgba(zone.accent1, 0.08))
    arch.addColorStop(1, rgba(zone.accent1, 0))
    ctx.fillStyle = arch
    ctx.fillRect(0, 0, w, h * 0.48)
  }

  if (zone.id === 'labs') {
    for (let i = 0; i < 4; i++) {
      const px = w * (0.1 + i * 0.22)
      const py = h * (0.15 + (i % 2) * 0.12)
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(px + 24 + i * 12, py + 80 + i * 20)
      ctx.lineTo(px - 16 - i * 8, py + 96 + i * 22)
      ctx.closePath()
      ctx.fillStyle = rgba(i % 2 === 0 ? zone.accent1 : zone.accent2, 0.1)
      ctx.fill()
    }
    ctx.globalAlpha = 0.06
    const pulseGlow = ctx.createRadialGradient(w * 0.8, h * 0.18, 0, w * 0.8, h * 0.18, 120)
    pulseGlow.addColorStop(0, rgba(zone.accent1, 0.14))
    pulseGlow.addColorStop(1, rgba(zone.accent2, 0))
    ctx.fillStyle = pulseGlow
    ctx.fillRect(0, 0, w, h)
  }

  if (zone.id === 'logs') {
    for (let row = 0; row < 3; row++) {
      const y = h * (0.68 - row * 0.08)
      ctx.fillStyle = rgba(zone.accent2, 0.08 + row * 0.02)
      for (let i = 0; i < 8; i++) {
        const x = (i / 7) * w + Math.sin(row * 2 + i) * 14
        ctx.fillRect(x, y, 12, 28 - row * 4)
      }
    }
    const mist = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, 140)
    mist.addColorStop(0, rgba(zone.accent2, 0.12))
    mist.addColorStop(1, rgba(zone.accent2, 0))
    ctx.fillStyle = mist
    ctx.fillRect(0, 0, w, h)
  }

  if (zone.id === 'signal') {
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      const radius = w * (0.28 + i * 0.06)
      ctx.arc(w * 0.5, -h * 0.12 + i * 42, radius, 0, Math.PI)
      ctx.fillStyle = rgba(zone.accent1, 0.08)
      ctx.fill()
    }
    for (let i = 0; i < 8; i++) {
      const x = w * (0.12 + (i / 7) * 0.76)
      const y = h * (0.18 + (i % 2) * 0.05)
      const spr = 8 + (i % 3) * 4
      const glow = ctx.createRadialGradient(x, y, 0, x, y, spr)
      glow.addColorStop(0, rgba(zone.accent2, 0.14))
      glow.addColorStop(1, rgba(zone.accent2, 0))
      ctx.fillStyle = glow
      ctx.fillRect(x - spr, y - spr, spr * 2, spr * 2)
    }
  }

  ctx.restore()
}

// ---------------- Silhouettes (3 depth layers) ----------------

function drawStalactites(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, depth: number, parallax: number) {
  const top = -h * 0.02 + parallax * depth
  ctx.save()
  ctx.fillStyle = rgba(color, 0.28 + depth * 0.18)
  ctx.beginPath()
  ctx.moveTo(0, top)
  const count = Math.floor(8 + depth * 10)
  for (let i = 0; i <= count; i++) {
    const x = (i / count) * w
    const s = (Math.sin(i * 9.1 + depth * 3.0) * 0.5 + 0.5) * 1.0
    const spike = lerp(h * 0.08, h * (0.22 + depth * 0.12), s)
    ctx.lineTo(x, top + spike)
    ctx.lineTo(x + w / count / 2, top + spike * 0.35)
  }
  ctx.lineTo(w, top)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawPillars(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, parallax: number) {
  ctx.save()
  ctx.fillStyle = rgba(color, 0.35)
  const baseY = h * 0.25 + parallax * 0.35
  const pillarW = Math.max(26, w * 0.07)
  const gap = w * 0.07
  for (let i = 0; i < 4; i++) {
    const x = i === 0 ? -pillarW * 0.3 : w - pillarW * 0.7
    const y = baseY + i * 6
    const height = h * (0.72 - i * 0.05)
    ctx.beginPath()
    ctx.roundRect(x, y, pillarW, height, 14)
    ctx.fill()
    ctx.fillStyle = rgba(color, 0.18)
  }
  ctx.restore()
}

function drawGothicArches(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, depth: number, parallax: number) {
  ctx.save()
  const alpha = 0.16 + depth * 0.16
  ctx.fillStyle = rgba(color, alpha)
  const yBase = h * (0.22 + depth * 0.07) + parallax * (0.2 + depth * 0.25)
  const span = w / (5 + depth * 3)
  const archH = h * (0.55 - depth * 0.08)
  for (let i = -1; i < 8; i++) {
    const x = i * span + (depth * 22)
    ctx.beginPath()
    ctx.moveTo(x, h)
    ctx.lineTo(x, yBase + archH)
    ctx.quadraticCurveTo(x + span * 0.5, yBase, x + span, yBase + archH)
    ctx.lineTo(x + span, h)
    ctx.closePath()
    ctx.fill()
  }
  // Nave ribs
  ctx.strokeStyle = rgba(color, 0.12 + depth * 0.1)
  ctx.lineWidth = 1
  for (let i = 0; i < 8; i++) {
    const x = i * span + span * 0.5 + depth * 20
    ctx.beginPath()
    ctx.moveTo(x, yBase + archH * 0.12)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  ctx.restore()
}

function drawCrystalSpires(ctx: CanvasRenderingContext2D, w: number, h: number, colorA: string, colorB: string, depth: number, parallax: number) {
  ctx.save()
  const alpha = 0.12 + depth * 0.18
  const baseY = h * (0.78 - depth * 0.06) + parallax * (0.12 + depth * 0.22)
  const count = 7 + Math.floor(depth * 5)
  for (let i = 0; i < count; i++) {
    const seed = i * 13.7 + depth * 9.1
    const x = (i / (count - 1)) * w + (rand(seed) - 0.5) * 30
    const s = rand(seed + 3.1)
    const height = lerp(h * 0.22, h * (0.52 + depth * 0.08), s)
    const width = lerp(18, 56, rand(seed + 5.5)) * (0.8 + depth * 0.5)
    const g = ctx.createLinearGradient(x, baseY - height, x, baseY + 40)
    g.addColorStop(0, rgba(colorA, alpha * 0.75))
    g.addColorStop(0.55, rgba(colorB, alpha * 0.65))
    g.addColorStop(1, rgba('#000000', 0))
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(x, baseY - height)
    ctx.lineTo(x - width * 0.45, baseY)
    ctx.lineTo(x, baseY + 22)
    ctx.lineTo(x + width * 0.45, baseY)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

function drawGraves(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, row: number, parallax: number) {
  ctx.save()
  const alpha = 0.1 + row * 0.12
  ctx.fillStyle = rgba(color, alpha)
  const y = h * (0.72 + row * 0.06) + parallax * (0.08 + row * 0.18)
  const count = 10 + row * 4
  for (let i = 0; i < count; i++) {
    const x = (i / (count - 1)) * w + (Math.sin(i * 2.3 + row) * 14)
    const ww = lerp(10, 26, (Math.sin(i * 3.1 + row * 2.0) * 0.5 + 0.5) as number) * (0.8 + row * 0.25)
    const hh = lerp(18, 44, (Math.cos(i * 1.9 + row * 1.7) * 0.5 + 0.5) as number) * (0.8 + row * 0.25)
    ctx.beginPath()
    ctx.roundRect(x - ww / 2, y - hh, ww, hh, 6)
    ctx.fill()
  }
  ctx.restore()
}

function drawTreeSentinel(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, parallax: number) {
  ctx.save()
  ctx.strokeStyle = rgba(color, 0.26)
  ctx.lineWidth = 2
  ctx.translate(w * 0.82, h * 0.78 + parallax * 0.25)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(-10, -90)
  ctx.lineTo(-6, -170)
  ctx.stroke()

  function branch(x: number, y: number, len: number, a: number, depth: number) {
    if (depth <= 0) return
    const x2 = x + Math.cos(a) * len
    const y2 = y + Math.sin(a) * len
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    branch(x2, y2, len * 0.68, a - 0.55, depth - 1)
    branch(x2, y2, len * 0.72, a + 0.45, depth - 1)
  }

  branch(-6, -170, 48, -1.9, 3)
  branch(-6, -150, 44, -1.35, 3)
  ctx.restore()
}

function drawCanopy(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, depth: number, parallax: number) {
  ctx.save()
  const alpha = 0.1 + depth * 0.18
  ctx.fillStyle = rgba(color, alpha)
  const y = h * (0.0 + depth * 0.04) + parallax * (0.14 + depth * 0.18)
  const wave = 18 + depth * 20
  ctx.beginPath()
  ctx.moveTo(0, y)
  const steps = 16
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w
    const d = Math.sin(i * 1.35 + depth * 2.4) * wave
    ctx.lineTo(x, y + 70 + d)
  }
  ctx.lineTo(w, 0)
  ctx.lineTo(0, 0)
  ctx.closePath()
  ctx.fill()

  // Vines (depth-separated)
  ctx.strokeStyle = rgba(color, 0.18 + depth * 0.12)
  ctx.lineWidth = 1.5
  for (let i = 0; i < 5; i++) {
    const x = (i / 4) * w + Math.sin(i * 3.2 + depth) * 16
    const len = h * (0.25 + depth * 0.08)
    ctx.beginPath()
    ctx.moveTo(x, y + 60)
    ctx.bezierCurveTo(x + 12, y + 120, x - 18, y + 160, x + 8, y + 60 + len)
    ctx.stroke()
  }
  ctx.restore()
}

// ---------------- Particles ----------------

function makeParticles(count: number, w: number, h: number, seedBase: number): ParticleBase[] {
  const out: ParticleBase[] = []
  for (let i = 0; i < count; i++) {
    const seed = seedBase + i * 17.31
    out.push({
      pos: { x: rand(seed + 1.1) * w, y: rand(seed + 2.2) * h },
      vel: { x: (rand(seed + 3.3) - 0.5) * 0.25, y: (rand(seed + 4.4) - 0.5) * 0.25 },
      size: lerp(0.8, 2.6, rand(seed + 5.5)),
      life: rand(seed + 6.6),
      seed,
      hueShift: (rand(seed + 7.7) - 0.5) * 0.2,
      rot: rand(seed + 8.8) * Math.PI * 2,
      rotV: (rand(seed + 9.9) - 0.5) * 0.014,
    })
  }
  return out
}

function drawSoul(ctx: CanvasRenderingContext2D, p: ParticleBase, t: number, accent: string, accent2: string) {
  const pulse = 0.6 + 0.4 * Math.sin(t * 0.002 + p.seed)
  const r = p.size * (1.7 + pulse * 0.8)

  // 3-layer glow halos: r, r4, r7
  const grad1 = ctx.createRadialGradient(p.pos.x, p.pos.y, 0, p.pos.x, p.pos.y, r)
  grad1.addColorStop(0, rgba(accent, 0.9))
  grad1.addColorStop(1, rgba(accent, 0))
  ctx.fillStyle = grad1
  ctx.beginPath()
  ctx.arc(p.pos.x, p.pos.y, r, 0, Math.PI * 2)
  ctx.fill()

  const r4 = r * 2.4
  const grad2 = ctx.createRadialGradient(p.pos.x, p.pos.y, r * 0.3, p.pos.x, p.pos.y, r4)
  grad2.addColorStop(0, rgba(accent, 0.22))
  grad2.addColorStop(1, rgba(accent, 0))
  ctx.fillStyle = grad2
  ctx.beginPath()
  ctx.arc(p.pos.x, p.pos.y, r4, 0, Math.PI * 2)
  ctx.fill()

  const r7 = r * 4.0
  const grad3 = ctx.createRadialGradient(p.pos.x, p.pos.y, r4 * 0.25, p.pos.x, p.pos.y, r7)
  grad3.addColorStop(0, rgba(accent2, 0.08))
  grad3.addColorStop(1, rgba(accent2, 0))
  ctx.fillStyle = grad3
  ctx.beginPath()
  ctx.arc(p.pos.x, p.pos.y, r7, 0, Math.PI * 2)
  ctx.fill()
}

function drawRain(ctx: CanvasRenderingContext2D, p: ParticleBase, w: number, h: number, accent: string) {
  ctx.save()
  ctx.strokeStyle = rgba(accent, 0.42)
  ctx.lineWidth = 1
  const len = 10 + p.size * 9
  const dx = -len * 0.55
  const dy = len
  ctx.beginPath()
  ctx.moveTo(p.pos.x, p.pos.y)
  ctx.lineTo(p.pos.x + dx, p.pos.y + dy)
  ctx.stroke()
  ctx.restore()
}

function drawCrystal(ctx: CanvasRenderingContext2D, p: ParticleBase, t: number, accent: string, accent2: string) {
  const wobble = Math.sin(t * 0.0012 + p.seed) * 0.5 + 0.5
  const size = p.size * (6.0 + wobble * 8.5)
  const rot = p.rot + t * 0.0015 * (0.7 + wobble) + p.seed * 0.1
  const mix = wobble
  const col = mix < 0.5 ? accent : accent2

  ctx.save()
  ctx.translate(p.pos.x, p.pos.y)
  ctx.rotate(rot)

  // glow halo
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2.2)
  halo.addColorStop(0, rgba(col, 0.22))
  halo.addColorStop(1, rgba(col, 0))
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(0, 0, size * 2.2, 0, Math.PI * 2)
  ctx.fill()

  // diamond shard
  const g = ctx.createLinearGradient(-size, -size, size, size)
  g.addColorStop(0, rgba(accent, 0.95))
  g.addColorStop(0.5, rgba('#ffffff', 0.22))
  g.addColorStop(1, rgba(accent2, 0.9))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.lineTo(size * 0.8, 0)
  ctx.lineTo(0, size)
  ctx.lineTo(-size * 0.8, 0)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawSpirit(ctx: CanvasRenderingContext2D, p: ParticleBase, t: number, accent: string, accent2: string) {
  const pulse = 0.55 + 0.45 * Math.sin(t * 0.0015 + p.seed * 1.7)
  const r = p.size * (10 + pulse * 14)

  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  const core = ctx.createRadialGradient(p.pos.x, p.pos.y, 0, p.pos.x, p.pos.y, r)
  core.addColorStop(0, rgba(accent2, 0.18 + pulse * 0.1))
  core.addColorStop(0.35, rgba(accent, 0.12 + pulse * 0.08))
  core.addColorStop(1, rgba(accent, 0))
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(p.pos.x, p.pos.y, r, 0, Math.PI * 2)
  ctx.fill()

  const tail = ctx.createRadialGradient(p.pos.x, p.pos.y + r * 0.55, 0, p.pos.x, p.pos.y + r * 0.55, r * 1.7)
  tail.addColorStop(0, rgba(accent2, 0.08))
  tail.addColorStop(1, rgba(accent2, 0))
  ctx.fillStyle = tail
  ctx.beginPath()
  ctx.ellipse(p.pos.x, p.pos.y + r * 0.55, r * 0.9, r * 1.4, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawSpore(ctx: CanvasRenderingContext2D, p: ParticleBase, t: number, accent: string, accent2: string) {
  const sway = Math.sin(t * 0.001 + p.seed) * 0.9
  const r = p.size * (5.5 + (Math.sin(t * 0.0015 + p.seed) * 0.5 + 0.5) * 4.0)
  const x = p.pos.x + sway * 18
  const y = p.pos.y

  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 3)
  halo.addColorStop(0, rgba(accent2, 0.10))
  halo.addColorStop(1, rgba(accent2, 0))
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(x, y, r * 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'

  ctx.fillStyle = rgba(accent, 0.78)
  ctx.beginPath()
  ctx.ellipse(x, y, r * 0.78, r * 1.15, p.rot, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = rgba(accent2, 0.25)
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(x, y, r * 0.78, r * 1.15, p.rot, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function stepParticles(particles: ParticleBase[], zone: ZoneConfig, w: number, h: number, dt: number, scrollParallax: number) {
  const speed = zone.particleType === 'rain' ? 1.75 : zone.particleType === 'crystal' ? 0.95 : 0.7
  for (const p of particles) {
    p.life += dt * 0.00006 * speed
    if (p.life > 1) p.life -= 1

    if (zone.particleType === 'soul' || zone.particleType === 'spirits' || zone.particleType === 'spores') {
      const up = zone.particleType === 'spirits' ? 0.65 : zone.particleType === 'spores' ? 0.4 : 0.55
      p.pos.y -= dt * 0.03 * up
      p.pos.x += Math.sin(p.life * Math.PI * 2 + p.seed) * 0.12
      if (p.pos.y < -140) {
        p.pos.y = h + 40
        p.pos.x = rand(p.seed + p.life * 999) * w
      }
      if (p.pos.x < -120) p.pos.x = w + 120
      if (p.pos.x > w + 120) p.pos.x = -120
    } else if (zone.particleType === 'rain') {
      p.pos.x -= dt * 0.12
      p.pos.y += dt * 0.32
      if (p.pos.y > h + 120 || p.pos.x < -180 || p.pos.x > w + 180) {
        p.pos.y = -80
        p.pos.x = w + rand(p.seed + p.life * 123) * w * 0.3
      }
    } else if (zone.particleType === 'crystal') {
      p.rot += dt * (0.0007 + Math.abs(p.rotV))
      p.pos.x += Math.sin(p.seed + p.life * Math.PI * 2) * 0.02
      p.pos.y += Math.cos(p.seed * 1.3 + p.life * Math.PI * 2) * 0.018
      // Keep shards centered with subtle drift (plus scroll parallax).
      p.pos.y += scrollParallax * 0.002
      if (p.pos.x < -90) p.pos.x = w + 90
      if (p.pos.x > w + 90) p.pos.x = -90
      if (p.pos.y < -90) p.pos.y = h + 90
      if (p.pos.y > h + 90) p.pos.y = -90
    }
  }
}

function computeScrollParallax(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  const vh = window.innerHeight || 1
  // -1 at top far above, 0 centered, +1 far below
  const center = rect.top + rect.height / 2
  return clamp01((center - vh * 0.5) / (vh * 0.5)) * 2 - 1
}

export function ZoneCanvas({ zone, active }: { zone: ZoneConfig; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const tRef = useRef<number>(0)
  const lastRef = useRef<number>(0)
  const particlesRef = useRef<ParticleBase[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let mounted = true
    const particles = particlesRef.current

    // init particles after first layout
    const init = () => {
      const { width: w, height: h } = dprScale(canvas, ctx)
      const area = w * h
      const density =
        zone.particleType === 'rain'
          ? 1 / 6500
          : zone.particleType === 'crystal'
            ? 1 / 18000
            : zone.particleType === 'spirits'
              ? 1 / 26000
              : zone.particleType === 'spores'
                ? 1 / 14000
                : 1 / 15000
      const count = Math.max(24, Math.min(170, Math.floor(area * density)))
      particles.splice(0, particles.length, ...makeParticles(count, w, h, zone.id.length * 1000 + count))
    }

    init()

    const onResize = () => init()
    window.addEventListener('resize', onResize)

    const draw = (ts: number) => {
      if (!mounted) return
      rafRef.current = requestAnimationFrame(draw)
      const dt = Math.min(40, ts - (lastRef.current || ts))
      lastRef.current = ts
      tRef.current = ts

      const { width: w, height: h } = dprScale(canvas, ctx)
      const par = computeScrollParallax(canvas)

      // Clear
      ctx.clearRect(0, 0, w, h)

      // Atmosphere base
      drawFog(ctx, w, h, zone.accent2, ts, zone.id === 'labs' ? 1.2 : 0.9)
      drawZoneMood(ctx, w, h, zone, ts)

      // Silhouette depth layers (far -> mid -> close)
      if (zone.id === 'void') {
        drawStalactites(ctx, w, h, '#0b1020', 0.2, par * 28)
        drawStalactites(ctx, w, h, '#070b16', 0.55, par * 38)
        drawStalactites(ctx, w, h, '#050812', 0.9, par * 52)
        drawPillars(ctx, w, h, '#10182a', par * 18)
      } else if (zone.id === 'core') {
        drawGothicArches(ctx, w, h, '#0b1220', 0.2, par * 22)
        drawGothicArches(ctx, w, h, '#07101c', 0.55, par * 34)
        drawGothicArches(ctx, w, h, '#05090f', 0.9, par * 50)
      } else if (zone.id === 'labs') {
        drawCrystalSpires(ctx, w, h, zone.accent1, zone.accent2, 0.2, par * 18)
        drawCrystalSpires(ctx, w, h, zone.accent1, zone.accent2, 0.55, par * 30)
        drawCrystalSpires(ctx, w, h, zone.accent1, zone.accent2, 0.9, par * 44)
        // small stalactites above
        drawStalactites(ctx, w, h, '#050c18', 0.35, par * 14)
      } else if (zone.id === 'logs') {
        drawGraves(ctx, w, h, '#1a1030', 0, par * 10)
        drawGraves(ctx, w, h, '#120a22', 1, par * 18)
        drawGraves(ctx, w, h, '#0c0616', 2, par * 28)
        drawTreeSentinel(ctx, w, h, zone.accent2, par * 22)
      } else if (zone.id === 'signal') {
        drawCanopy(ctx, w, h, '#0a2a14', 0.2, par * 18)
        drawCanopy(ctx, w, h, '#062010', 0.55, par * 30)
        drawCanopy(ctx, w, h, '#03140a', 0.9, par * 44)
      }

      // Particle step & draw
      stepParticles(particles, zone, w, h, dt, par * 90)

      ctx.save()
      ctx.globalCompositeOperation = zone.particleType === 'rain' ? 'source-over' : 'screen'
      for (const p of particles) {
        if (zone.particleType === 'soul') drawSoul(ctx, p, ts, zone.accent1, zone.accent2)
        if (zone.particleType === 'rain') drawRain(ctx, p, w, h, zone.accent2)
        if (zone.particleType === 'crystal') drawCrystal(ctx, p, ts, zone.accent1, zone.accent2)
        if (zone.particleType === 'spirits') drawSpirit(ctx, p, ts, zone.accent1, zone.accent2)
        if (zone.particleType === 'spores') drawSpore(ctx, p, ts, zone.accent1, zone.accent2)
      }
      ctx.restore()

      // Vignette last
      drawVignette(ctx, w, h, zone.background)

      // Active shimmer hint (very subtle)
      if (active) {
        drawFog(ctx, w, h, zone.accent1, ts + 2000, 0.9)
      }
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      mounted = false
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [zone, active])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  )
}

