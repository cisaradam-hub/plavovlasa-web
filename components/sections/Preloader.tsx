'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const NAME = 'plavovlasa'

export default function Preloader() {
  const [visible, setVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const seen = sessionStorage.getItem('preloader-seen')
    if (seen) return
    setVisible(true)
  }, [])

  useEffect(() => {
    if (!visible) return
    if (!overlayRef.current) return

    const tl = gsap.timeline()

    tl.fromTo(
      charsRef.current,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'expo.out',
      }
    )
      .to({}, { duration: 0.3 })
      .to(charsRef.current, {
        opacity: 0,
        duration: 0.5,
        stagger: { amount: 0.2, from: 'end' },
        ease: 'expo.in',
      })
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            sessionStorage.setItem('preloader-seen', '1')
            setVisible(false)
          },
        },
        '-=0.2'
      )
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'var(--color-background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <div className="display-lg" aria-label={NAME}>
        {NAME.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => { if (el) charsRef.current[i] = el }}
            style={{ display: 'inline-block', opacity: 0 }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  )
}
