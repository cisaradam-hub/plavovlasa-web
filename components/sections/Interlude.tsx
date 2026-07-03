'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Interlude() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (!imageRef.current) return

      // Scale down on scroll into view
      gsap.fromTo(
        imageRef.current,
        { scale: 1.08 },
        {
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        }
      )

      // Parallax
      gsap.to(imageRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <div
        ref={imageRef}
        style={{
          position: 'absolute',
          inset: '-10%',
          borderRadius: 0,
        }}
      >
        {/* TODO: Replace with real editorial photography */}
        <Image
          src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1800&q=90"
          alt="Editorial interlude"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
      </div>

      <span
        className="caption"
        style={{
          position: 'absolute',
          bottom: 'var(--space-xl)',
          right: 'var(--margin-desktop)',
          zIndex: 2,
          color: 'rgba(245,242,236,0.4)',
          letterSpacing: 'var(--tracking-extreme)',
          fontSize: 'var(--text-micro)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        Craft
      </span>
    </section>
  )
}
