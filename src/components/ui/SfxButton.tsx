'use client'

import type { ButtonHTMLAttributes } from 'react'
import { useAudio } from '@/components/audio/AudioProvider'
import { cn } from '@/lib/utils'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  sfx?: 'click' | 'map'
}

export function SfxButton({ className, sfx = 'click', onClick, ...rest }: Props) {
  const audio = useAudio()
  return (
    <button
      className={cn(
        'cursor-pointer select-none outline-none transition-[transform,opacity,filter] active:scale-[0.99] disabled:opacity-60',
        className
      )}
      onClick={(e) => {
        audio.play(sfx)
        onClick?.(e)
      }}
      {...rest}
    />
  )
}

