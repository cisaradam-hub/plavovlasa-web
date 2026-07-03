'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return
    setIsDesktop(true)
  }, [])

  useEffect(() => {
    if (!isDesktop) return
    const dot = dotRef.current
    if (!dot) return

    const onMouseMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
    }

    document.addEventListener('mousemove', onMouseMove)
    return () => document.removeEventListener('mousemove', onMouseMove)
  }, [isDesktop])

  if (!isDesktop) return null

  return (
    <div
      ref={dotRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '8px',
        height:        '8px',
        borderRadius:  '50%',
        background:    '#ffffff',
        mixBlendMode:  'difference',
        pointerEvents: 'none',
        zIndex:        10000,
        willChange:    'transform',
      }}
      aria-hidden="true"
    />
  )
}
