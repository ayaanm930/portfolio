'use client'

import { motion } from 'framer-motion'
import type { DiscoveryEvent } from '@/components/world/types'

export function AreaDiscoveredOverlay({ discovery }: { discovery: DiscoveryEvent }) {
  return (
    <motion.div
      className="fixed right-4 top-4 z-[70] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="relative w-[min(22rem,88vw)]"
        initial={{ y: -8, opacity: 0, scale: 0.995 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -8, opacity: 0, scale: 0.995 }}
        transition={{ duration: 0.18 }}
      >
        <div
          className="absolute -inset-3 blur-xl opacity-55"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${discovery.accent}55 0%, transparent 70%)`,
          }}
        />
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/45 md:backdrop-blur-md">
          <div className="px-4 py-3.5">
            <div className="text-[11px] tracking-[0.38em] text-white/70">AREA DISCOVERED</div>
            <div className="mt-1.5 flex items-baseline gap-2.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: discovery.accent, boxShadow: `0 0 18px ${discovery.accent}aa` }}
              />
              <div className="text-lg tracking-[0.12em]" style={{ color: discovery.accent }}>
                {discovery.name}
              </div>
            </div>
            <div className="mt-1 text-xs text-white/65 tracking-wide">Archive updated.</div>
          </div>
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${discovery.accent} 50%, transparent 100%)`,
              opacity: 0.9,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

