'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { revealImage, revealLines } from '@/lib/animations'
import { gsap } from 'gsap'

const processImages = [
  {
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85',
    alt: 'Process — preparation',
    style: { width: '50%', height: '480px', left: 0 },
    delay: 0,
    objectPosition: 'center top',
  },
  {
    src: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=700&q=85',
    alt: 'Process — detail',
    style: { width: '35%', height: '340px', marginLeft: '55%', marginTop: 'calc(-1 * var(--space-2xl))' },
    delay: 0.15,
    objectPosition: 'center center',
  },
  {
    src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=85',
    alt: 'Process — application',
    style: { width: '28%', height: '280px', marginLeft: 'var(--space-2xl)', marginTop: 'var(--space-md)' },
    delay: 0.3,
    objectPosition: 'center 30%',
  },
  {
    src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85',
    alt: 'Process — result',
    style: { width: '42%', height: '360px', marginLeft: '30%', marginTop: 'calc(-1 * var(--space-xl))' },
    delay: 0.45,
    objectPosition: 'center top',
  },
]

// TODO: Replace all process images with real behind-the-scenes photography

export default function Process() {
  const headingRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<HTMLDivElement[]>([])
  const sentenceRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (headingRef.current) revealLines(headingRef.current)
    imageRefs.current.forEach((img, i) => {
      if (img) {
        const tl = gsap.fromTo(
          img,
          { opacity: 0, scale: 1.04 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            delay: processImages[i].delay,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: img,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }
    })
    if (sentenceRef.current) revealLines(sentenceRef.current as unknown as Element)
  }, [])

  return (
    <section
      id="process"
      style={{
        background: 'var(--color-surface)',
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-4xl)',
        overflow: 'hidden',
      }}
    >
      {/* Heading block */}
      <div
        ref={headingRef}
        style={{
          paddingLeft: 'var(--margin-desktop)',
          paddingRight: 'var(--margin-desktop)',
          maxWidth: '40%',
          marginBottom: 'var(--space-3xl)',
        }}
      >
        <p data-line className="small-caps" style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-sm)' }}>
          Behind the Work
        </p>
        <h2 data-line className="display-lg" style={{ marginBottom: 'var(--space-lg)' }}>
          Process &amp; Collaboration
        </h2>
        <p
          data-line
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-body)',
            fontStyle: 'italic',
            lineHeight: 'var(--leading-body)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Every face carries its own story. My role is to listen before I begin.
        </p>
      </div>

      {/* Asymmetric image collage */}
      <div
        style={{
          position: 'relative',
          paddingLeft: 'var(--margin-desktop)',
          paddingRight: 'var(--margin-desktop)',
        }}
      >
        {processImages.map((img, i) => (
          <div
            key={i}
            ref={(el) => { if (el) imageRefs.current[i] = el }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 0,
              opacity: 0,
              ...img.style,
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              style={{ objectFit: 'cover', objectPosition: img.objectPosition }}
            />
          </div>
        ))}

        {/* Overlapping italic sentence */}
        <p
          ref={sentenceRef}
          style={{
            position: 'relative',
            zIndex: 2,
            marginTop: 'calc(-1 * var(--space-lg))',
            marginLeft: '52%',
            width: '40%',
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-subheading)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-body)',
          }}
        >
          The work is the relationship.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #process > div:nth-child(2) {
            max-width: 100% !important;
            padding-left: var(--margin-mobile) !important;
            padding-right: var(--margin-mobile) !important;
          }
          #process > div:nth-child(3) > div {
            position: relative !important;
            width: 100% !important;
            margin-left: 0 !important;
            margin-top: var(--space-lg) !important;
          }
          #process > div:nth-child(3) > p {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}
