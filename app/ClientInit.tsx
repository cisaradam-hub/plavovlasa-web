'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'
import { initLenis, destroyLenis } from '@/lib/lenis'

interface ClientInitProps {
  children: ReactNode
}

export default function ClientInit({ children }: ClientInitProps) {
  const progressFillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lenis = initLenis()

    // Scroll progress bar — Lenis emits the instance itself
    const updateProgress = (instance: Lenis) => {
      if (progressFillRef.current && instance.limit > 0) {
        progressFillRef.current.style.height = `${instance.progress * 100}vh`
      }
    }

    lenis.on('scroll', updateProgress)

    return () => {
      lenis.off('scroll', updateProgress)
      destroyLenis()
    }
  }, [])

  return <>{children}</>
}
