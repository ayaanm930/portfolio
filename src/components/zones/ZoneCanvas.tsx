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

function toHex(value: number) {
  const hex = Math.max(0, Math.min(255, Math.floor(value))).toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function darken(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(
    Math.floor(r * (1 - amount)),
    Math.floor(g * (1 - amount)),
    Math.floor(b * (1 - amount))
  )
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

// Abyss: tall stone pillars with crumbled tops + uneven ground mounds
function drawAbyssPillars(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, depth: number, parallax: number) {
  ctx.save()
  const alpha = 0.22 + depth * 0.22
  ctx.fillStyle = rgba(color, alpha)
  const baseY = h + parallax * (0.15 + depth * 0.2)
  const count = Math.floor(4 + depth * 3)
  const seed0 = depth * 77.3

  for (let i = 0; i < count; i++) {
    const s = rand(seed0 + i * 13.1)
    const x = (i / (count - 1)) * w * 1.1 - w * 0.05 + (rand(seed0 + i * 7.7) - 0.5) * w * 0.08
    const pw = lerp(w * 0.04, w * 0.09, rand(seed0 + i * 3.3)) * (0.6 + depth * 0.6)
    const ph = lerp(h * 0.35, h * (0.62 + depth * 0.1), s)
    const topY = baseY - ph

    // Pillar shaft
    ctx.beginPath()
    ctx.rect(x - pw / 2, topY, pw, ph)
    ctx.fill()

    // Crumbled top: jagged chunk cuts
    ctx.save()
    ctx.fillStyle = rgba(color, alpha * 0.6)
    for (let j = 0; j < 3; j++) {
      const cx = x - pw / 2 + rand(seed0 + i * 5.5 + j) * pw
      const cw = rand(seed0 + i * 6.6 + j) * pw * 0.55 + pw * 0.1
      const ch = rand(seed0 + i * 8.8 + j) * ph * 0.09 + ph * 0.02
      ctx.beginPath()
      ctx.rect(cx, topY - ch * 0.5, cw, ch * 1.5)
      ctx.fill()
    }
    ctx.restore()

    // Thin capital ring near top
    ctx.save()
    ctx.fillStyle = rgba(color, alpha * 1.3)
    ctx.beginPath()
    ctx.rect(x - pw / 2 - pw * 0.15, topY + ph * 0.04, pw * 1.3, ph * 0.03)
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()
}

function drawAbyssMounds(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, depth: number, parallax: number) {
  ctx.save()
  const alpha = 0.28 + depth * 0.25
  ctx.fillStyle = rgba(color, alpha)
  const baseY = h * (0.88 - depth * 0.04) + parallax * (0.1 + depth * 0.15)
  const steps = 32

  ctx.beginPath()
  ctx.moveTo(0, baseY)
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w
    const s1 = Math.sin(i * 0.8 + depth * 4.1) * 0.5 + 0.5
    const s2 = Math.sin(i * 2.2 + depth * 1.7) * 0.5 + 0.5
    const bump = lerp(h * 0.04, h * (0.14 + depth * 0.08), s1 * 0.7 + s2 * 0.3)
    ctx.lineTo(x, baseY - bump)
  }
  ctx.lineTo(w, baseY)
  ctx.lineTo(w, h)
  ctx.lineTo(0, h)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// Kept for labs stalactites (small spikes from top)
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

function drawCityBuildings(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, depth: number, parallax: number) {
  ctx.save()
  const alpha = 0.14 + depth * 0.18
  const baseY = h + parallax * (0.15 + depth * 0.22)
  const seed0 = depth * 53.9
  const count = Math.floor(6 + depth * 4)

  for (let i = 0; i < count; i++) {
    const s = rand(seed0 + i * 11.3)
    const x = (i / count) * w + (rand(seed0 + i * 4.4) - 0.5) * w * 0.06
    const bw = lerp(w * 0.06, w * 0.14, rand(seed0 + i * 6.1)) * (0.5 + depth * 0.7)
    const bh = lerp(h * 0.28, h * (0.58 + depth * 0.08), s)
    const topY = baseY - bh

    // Main building block
    ctx.fillStyle = rgba(color, alpha)
    ctx.beginPath()
    ctx.rect(x - bw / 2, topY, bw, bh)
    ctx.fill()

    // Gothic window slits
    ctx.fillStyle = rgba(color, alpha * 0.35)
    const winRows = Math.floor(2 + depth)
    const winH = bh * 0.1
    const winW = bw * 0.12
    for (let row = 0; row < winRows; row++) {
      const wy = topY + bh * (0.12 + row * 0.28)
      for (let col = 0; col < 2; col++) {
        const wx = x - bw * 0.22 + col * bw * 0.44 - winW / 2
        ctx.beginPath()
        ctx.moveTo(wx, wy + winH)
        ctx.lineTo(wx, wy + winH * 0.35)
        ctx.quadraticCurveTo(wx + winW / 2, wy, wx + winW, wy + winH * 0.35)
        ctx.lineTo(wx + winW, wy + winH)
        ctx.closePath()
        ctx.fill()
      }
    }

    // Pointed spire on top of building
    const spireW = bw * (0.25 + rand(seed0 + i * 9.1) * 0.2)
    const spireH = bh * (0.2 + rand(seed0 + i * 8.2) * 0.25)
    ctx.fillStyle = rgba(color, alpha * 1.1)
    ctx.beginPath()
    ctx.moveTo(x, topY - spireH)
    ctx.lineTo(x - spireW / 2, topY)
    ctx.lineTo(x + spireW / 2, topY)
    ctx.closePath()
    ctx.fill()

    // Side turrets on larger buildings
    if (bw > w * 0.09) {
      for (let side = -1; side <= 1; side += 2) {
        const tx = x + side * bw * 0.42
        const tw = bw * 0.22
        const th = bh * 0.4
        ctx.fillStyle = rgba(color, alpha * 0.8)
        ctx.beginPath()
        ctx.rect(tx - tw / 2, topY + bh * 0.22, tw, th)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(tx, topY + bh * 0.22 - tw * 0.8)
        ctx.lineTo(tx - tw / 2, topY + bh * 0.22)
        ctx.lineTo(tx + tw / 2, topY + bh * 0.22)
        ctx.closePath()
        ctx.fill()
      }
    }
  }
  ctx.restore()
}

function drawCrystalSpikes(ctx: CanvasRenderingContext2D, w: number, h: number, colorA: string, colorB: string, depth: number, parallax: number, fromTop: boolean) {
  ctx.save()
  const alpha = 0.14 + depth * 0.2
  const seed0 = depth * 39.1 + (fromTop ? 100 : 0)
  const count = Math.floor(9 + depth * 7)
  const baseY = fromTop
    ? parallax * (0.08 + depth * 0.1)
    : h * (0.82 - depth * 0.05) + parallax * (0.1 + depth * 0.18)

  for (let i = 0; i < count; i++) {
    const s = rand(seed0 + i * 13.7)
    const x = (i / (count - 1)) * w * 1.05 - w * 0.025 + (rand(seed0 + i * 7.7) - 0.5) * w * 0.05
    const height = lerp(h * 0.15, h * (0.42 + depth * 0.1), s)
    const hw = lerp(8, 28, rand(seed0 + i * 5.5)) * (0.6 + depth * 0.55)
    const color = (i % 3 === 0) ? colorA : colorB

    const g = fromTop
      ? ctx.createLinearGradient(x, baseY, x, baseY + height)
      : ctx.createLinearGradient(x, baseY - height, x, baseY + 20)
    g.addColorStop(0, rgba(color, alpha))
    g.addColorStop(0.6, rgba(color, alpha * 0.55))
    g.addColorStop(1, rgba('#000000', 0))
    ctx.fillStyle = g

    ctx.beginPath()
    if (fromTop) {
      ctx.moveTo(x, baseY)
      ctx.lineTo(x - hw / 2, baseY + height * 0.25)
      ctx.lineTo(x - hw * 0.18, baseY + height)
      ctx.lineTo(x + hw * 0.18, baseY + height)
      ctx.lineTo(x + hw / 2, baseY + height * 0.25)
    } else {
      ctx.moveTo(x, baseY - height)
      ctx.lineTo(x - hw * 0.18, baseY - height * 0.22)
      ctx.lineTo(x - hw / 2, baseY)
      ctx.lineTo(x + hw / 2, baseY)
      ctx.lineTo(x + hw * 0.18, baseY - height * 0.22)
    }
    ctx.closePath()
    ctx.fill()

    // Facet line — gives the crystal-cut look
    ctx.strokeStyle = rgba(colorA, alpha * 0.4)
    ctx.lineWidth = 0.5
    ctx.beginPath()
    if (fromTop) {
      ctx.moveTo(x, baseY)
      ctx.lineTo(x, baseY + height * 0.85)
    } else {
      ctx.moveTo(x, baseY - height)
      ctx.lineTo(x, baseY - height * 0.18)
    }
    ctx.stroke()
  }
  ctx.restore()
}

function drawCrystalMountains(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, depth: number, parallax: number) {
  ctx.save()
  const alpha = 0.18 + depth * 0.16
  const baseY = h * (0.78 - depth * 0.06) + parallax * (0.1 + depth * 0.2)
  const seed0 = depth * 61.1 + 200
  const peaks = Math.floor(3 + depth * 2)

  ctx.fillStyle = rgba(color, alpha)
  ctx.beginPath()
  ctx.moveTo(0, baseY)

  for (let i = 0; i <= peaks; i++) {
    const x = (i / peaks) * w
    const peakH = lerp(h * 0.18, h * (0.38 + depth * 0.08), rand(seed0 + i * 17.3))
    const nextX = ((i + 0.5) / peaks) * w
    // valley between peaks
    ctx.lineTo(x, baseY - peakH)
    if (i < peaks) ctx.lineTo(nextX, baseY - peakH * 0.2)
  }

  ctx.lineTo(w, baseY)
  ctx.lineTo(w, h)
  ctx.lineTo(0, h)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawGraves(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, row: number, parallax: number) {
  ctx.save()
  const alpha = 0.12 + row * 0.13
  const y = h * (0.74 + row * 0.05) + parallax * (0.08 + row * 0.18)
  const count = 8 + row * 3
  const seed0 = row * 44.7

  for (let i = 0; i < count; i++) {
    const s = rand(seed0 + i * 11.1)
    const x = (i / (count - 1)) * w + (Math.sin(i * 2.3 + row) * 12)
    const type = Math.floor(rand(seed0 + i * 7.3) * 3) // 0=rounded top, 1=cross, 2=mound
    const gw = lerp(10, 22, rand(seed0 + i * 3.3)) * (0.7 + row * 0.35)
    const gh = lerp(20, 48, s) * (0.7 + row * 0.35)

    ctx.fillStyle = rgba(color, alpha)
    ctx.strokeStyle = rgba(color, alpha * 0.6)
    ctx.lineWidth = 0.8

    if (type === 0) {
      // Rounded-top gravestone
      ctx.beginPath()
      ctx.moveTo(x - gw / 2, y)
      ctx.lineTo(x - gw / 2, y - gh * 0.6)
      ctx.quadraticCurveTo(x, y - gh, x + gw / 2, y - gh * 0.6)
      ctx.lineTo(x + gw / 2, y)
      ctx.closePath()
      ctx.fill()
    } else if (type === 1) {
      // Cross gravestone
      const cw = gw * 0.22
      // Vertical beam
      ctx.beginPath()
      ctx.rect(x - cw / 2, y - gh, cw, gh)
      ctx.fill()
      // Horizontal beam
      ctx.beginPath()
      ctx.rect(x - gw * 0.45, y - gh * 0.72, gw * 0.9, cw)
      ctx.fill()
    } else {
      // Small burial mound
      ctx.beginPath()
      ctx.ellipse(x, y, gw * 1.1, gh * 0.28, 0, Math.PI, 0)
      ctx.fill()
    }
  }

  // Ground dirt strip
  ctx.fillStyle = rgba(color, alpha * 0.55)
  ctx.beginPath()
  ctx.moveTo(0, y + 4)
  for (let i = 0; i <= 20; i++) {
    const x = (i / 20) * w
    const bump = Math.sin(i * 1.8 + row * 3.1) * 5
    ctx.lineTo(x, y + 8 + bump)
  }
  ctx.lineTo(w, h)
  ctx.lineTo(0, h)
  ctx.closePath()
  ctx.fill()

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

function drawLeafCanopy(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, depth: number, parallax: number) {
  ctx.save()
  const alpha = 0.12 + depth * 0.2
  const baseY = h * (depth * 0.06) + parallax * (0.12 + depth * 0.16)
  const seed0 = depth * 83.1

  // Canopy mass — wavy silhouette of overlapping leaf clusters
  ctx.fillStyle = rgba(color, alpha)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  const steps = 28
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w
    const wave1 = Math.sin(i * 1.1 + depth * 2.8) * (22 + depth * 18)
    const wave2 = Math.sin(i * 2.7 + depth * 1.4) * (10 + depth * 8)
    const bump = baseY + 55 + depth * 30 + wave1 + wave2
    ctx.lineTo(x, bump)
  }
  ctx.lineTo(w, 0)
  ctx.closePath()
  ctx.fill()

  // Individual leaf clusters (round lobes) along canopy edge
  const clusterCount = Math.floor(6 + depth * 5)
  for (let i = 0; i < clusterCount; i++) {
    const x = (i / clusterCount) * w * 1.1 - w * 0.05 + (rand(seed0 + i * 9.1) - 0.5) * w * 0.08
    const cy = baseY + 40 + depth * 20 + (Math.sin(i * 2.2 + depth) * 0.5 + 0.5) * 30
    const r = lerp(18, 46, rand(seed0 + i * 5.5)) * (0.6 + depth * 0.55)
    ctx.fillStyle = rgba(color, alpha * (0.8 + rand(seed0 + i * 3.1) * 0.5))
    ctx.beginPath()
    ctx.arc(x, cy, r, 0, Math.PI * 2)
    ctx.fill()
    // second lobe
    ctx.beginPath()
    ctx.arc(x + r * 0.7, cy - r * 0.3, r * 0.75, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x - r * 0.65, cy - r * 0.2, r * 0.7, 0, Math.PI * 2)
    ctx.fill()
  }

  // Hanging vines with leaf nodes
  const vineCount = Math.floor(4 + depth * 3)
  ctx.strokeStyle = rgba(color, 0.22 + depth * 0.14)
  ctx.lineWidth = 1.2 + depth * 0.6
  for (let i = 0; i < vineCount; i++) {
    const vx = (i / vineCount) * w * 1.1 - w * 0.05 + (rand(seed0 + i * 6.6) - 0.5) * w * 0.1
    const startY = baseY + 50 + depth * 15
    const len = h * (0.18 + depth * 0.08) * (0.6 + rand(seed0 + i * 4.4) * 0.8)
    const swing = Math.sin(seed0 + i * 3.3) * 18

    ctx.beginPath()
    ctx.moveTo(vx, startY)
    ctx.bezierCurveTo(
      vx + swing * 0.5, startY + len * 0.35,
      vx - swing * 0.3, startY + len * 0.65,
      vx + swing, startY + len
    )
    ctx.stroke()

    // Leaf nodes along vine
    const nodeCount = Math.floor(2 + depth * 2)
    for (let n = 0; n < nodeCount; n++) {
      const t = (n + 1) / (nodeCount + 1)
      const nx = lerp(vx, vx + swing, t)
      const ny = startY + len * t
      const lr = 5 + rand(seed0 + i * 2.2 + n) * 8
      ctx.fillStyle = rgba(color, alpha * 1.2)
      ctx.beginPath()
      ctx.ellipse(nx + lr * 0.6, ny, lr, lr * 0.55, -0.4 + rand(seed0 + n) * 0.8, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(nx - lr * 0.6, ny, lr, lr * 0.55, 0.4 - rand(seed0 + n + 1) * 0.8, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Floor bushes — rounded mounds at ground level
  const bushCount = Math.floor(5 + depth * 4)
  const bushY = h * (0.88 - depth * 0.03) + parallax * 0.1
  for (let i = 0; i < bushCount; i++) {
    const bx = (i / bushCount) * w * 1.1 - w * 0.05 + (rand(seed0 + i * 12.2) - 0.5) * w * 0.07
    const br = lerp(20, 52, rand(seed0 + i * 8.8)) * (0.5 + depth * 0.6)
    ctx.fillStyle = rgba(color, alpha * 0.9)
    ctx.beginPath()
    ctx.arc(bx, bushY, br, Math.PI, 0)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(bx + br * 0.65, bushY - br * 0.1, br * 0.72, Math.PI, 0)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(bx - br * 0.6, bushY - br * 0.08, br * 0.65, Math.PI, 0)
    ctx.fill()
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
        drawAbyssMounds(ctx, w, h, zone.surface, 0.2, par * 18)
        drawAbyssMounds(ctx, w, h, zone.mid, 0.55, par * 30)
        drawAbyssMounds(ctx, w, h, darken(zone.mid, 0.1), 0.9, par * 44)
        drawAbyssPillars(ctx, w, h, zone.surface, 0.2, par * 22)
        drawAbyssPillars(ctx, w, h, zone.mid, 0.55, par * 36)
        drawAbyssPillars(ctx, w, h, darken(zone.mid, 0.14), 0.9, par * 52)
      } else if (zone.id === 'core') {
        drawCityBuildings(ctx, w, h, zone.surface, 0.2, par * 22)
        drawCityBuildings(ctx, w, h, zone.mid, 0.55, par * 34)
        drawCityBuildings(ctx, w, h, darken(zone.mid, 0.14), 0.9, par * 50)
      } else if (zone.id === 'labs') {
        drawCrystalMountains(ctx, w, h, zone.surface, 0.2, par * 18)
        drawCrystalMountains(ctx, w, h, zone.mid, 0.55, par * 28)
        drawCrystalSpikes(ctx, w, h, zone.accent1, zone.accent2, 0.2, par * 18, false)
        drawCrystalSpikes(ctx, w, h, zone.accent1, zone.accent2, 0.55, par * 30, false)
        drawCrystalSpikes(ctx, w, h, zone.accent1, zone.accent2, 0.9, par * 44, false)
        drawCrystalSpikes(ctx, w, h, zone.accent1, zone.accent2, 0.35, par * 14, true)
        drawCrystalSpikes(ctx, w, h, zone.accent1, zone.accent2, 0.7, par * 22, true)
      } else if (zone.id === 'logs') {
        drawGraves(ctx, w, h, zone.surface, 0, par * 10)
        drawGraves(ctx, w, h, zone.mid, 1, par * 18)
        drawGraves(ctx, w, h, darken(zone.mid, 0.14), 2, par * 28)
        drawTreeSentinel(ctx, w, h, zone.accent2, par * 22)
      } else if (zone.id === 'signal') {
        drawLeafCanopy(ctx, w, h, zone.surface, 0.2, par * 18)
        drawLeafCanopy(ctx, w, h, zone.mid, 0.55, par * 30)
        drawLeafCanopy(ctx, w, h, darken(zone.mid, 0.14), 0.9, par * 44)
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