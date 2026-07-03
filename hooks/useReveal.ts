'use client'

import { useEffect, useRef } from 'react'
import { revealFade } from '@/lib/animations'

export function useReveal(options?: { y?: number; duration?: number; delay?: number }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = revealFade(ref.current, options)
    return () => {
      if (ctx) ctx.kill()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return ref
}
