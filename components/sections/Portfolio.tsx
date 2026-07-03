'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { revealLines } from '@/lib/animations'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Portfolio({ images = [] }: { images?: string[] }) {
  const col1 = images.filter((_, i) => i % 3 === 0)
  const col2 = images.filter((_, i) => i % 3 === 1)
  const col3 = images.filter((_, i) => i % 3 === 2)

  const headingRef = useRef<HTMLDivElement>(null)
  const imgRefs    = useRef<HTMLDivElement[]>([])

  const [lightbox, setLightbox] = useState<number | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Map from column index back to original images[] index
  const colToOriginal = useCallback((colIndex: number, itemIndex: number) => {
    if (colIndex === 0) return itemIndex * 3
    if (colIndex === 1) return itemIndex * 3 + 1
    return itemIndex * 3 + 2
  }, [])

  const open = useCallback((idx: number) => {
    setLightbox(idx)
  }, [])

  const close = useCallback(() => {
    setLightbox(null)
  }, [])

  const prev = useCallback(() => {
    setLightbox(i => i === null ? null : (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => {
    setLightbox(i => i === null ? null : (i + 1) % images.length)
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, close, prev, next])

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  useEffect(() => {
    if (headingRef.current) revealLines(headingRef.current)
    imgRefs.current.forEach((el) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
          },
        }
      )
    })
  }, [])

  const renderCol = (colImages: string[], colIndex: number, offset: number) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      {colImages.map((src, i) => {
        const globalIdx = offset + i
        const originalIdx = colToOriginal(colIndex, i)
        return (
          <div
            key={globalIdx}
            ref={(el) => { if (el) imgRefs.current[globalIdx] = el }}
            style={{ overflow: 'hidden', opacity: 0, cursor: 'zoom-in' }}
            onClick={() => open(originalIdx)}
          >
            <Image
              src={src}
              alt={`Portfólio ${globalIdx + 1}`}
              width={600}
              height={800}
              sizes="(max-width: 600px) 50vw, (max-width: 900px) 50vw, 33vw"
              quality={82}
              style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = '' }}
            />
          </div>
        )
      })}
    </div>
  )

  return (
    <section
      id="portfolio"
      style={{
        background:    'var(--color-surface)',
        paddingTop:    'var(--space-xl)',
        paddingBottom: 'var(--space-xl)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin:   '0 auto',
          padding:  '0 var(--margin-desktop)',
        }}
      >
        <div className="masonry-grid">
          {renderCol(col1, 0, 0)}
          {renderCol(col2, 1, col1.length)}
          {renderCol(col3, 2, col1.length + col2.length)}
        </div>
      </div>

      {/* Lightbox — portal do body, nad nav */}
      {lightbox !== null && typeof document !== 'undefined' && createPortal(
        <div
          ref={overlayRef}
          onClick={close}
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         1000,
            background:     'rgba(0,0,0,0.92)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          {/* Image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position:   'relative',
              maxWidth:   '90vw',
              maxHeight:  '90vh',
              display:    'flex',
              alignItems: 'center',
            }}
          >
            <Image
              key={lightbox}
              src={images[lightbox]}
              alt={`Portfólio ${lightbox + 1}`}
              width={1200}
              height={1600}
              quality={92}
              style={{ maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto', display: 'block', objectFit: 'contain' }}
            />
          </div>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            style={{
              position:       'fixed',
              left:           '20px',
              top:            '50%',
              transform:      'translateY(-50%)',
              background:     'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              border:         'none',
              borderRadius:   '50%',
              width:          '48px',
              height:         '48px',
              cursor:         'none',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          '#F5F2EC',
              fontSize:       '20px',
              transition:     'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)' }}
          >←</button>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            style={{
              position:       'fixed',
              right:          '20px',
              top:            '50%',
              transform:      'translateY(-50%)',
              background:     'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              border:         'none',
              borderRadius:   '50%',
              width:          '48px',
              height:         '48px',
              cursor:         'none',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          '#F5F2EC',
              fontSize:       '20px',
              transition:     'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)' }}
          >→</button>

          {/* Close */}
          <button
            onClick={close}
            style={{
              position:       'fixed',
              top:            '20px',
              right:          '20px',
              background:     'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              border:         'none',
              borderRadius:   '50%',
              width:          '44px',
              height:         '44px',
              cursor:         'none',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          '#F5F2EC',
              transition:     'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line x1="1" y1="1" x2="15" y2="15" stroke="#F5F2EC" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="15" y1="1" x2="1" y2="15" stroke="#F5F2EC" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Counter */}
          <div style={{
            position:   'fixed',
            bottom:     '24px',
            left:       '50%',
            transform:  'translateX(-50%)',
            fontFamily: 'var(--font-mono)',
            fontSize:   '12px',
            color:      'rgba(245,242,236,0.5)',
            letterSpacing: '0.08em',
          }}>
            {lightbox + 1} / {images.length}
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .masonry-grid {
          display: flex;
          gap: var(--gutter);
          align-items: flex-start;
        }
        @media (max-width: 768px) {
          .masonry-grid > div:last-child {
            display: none;
          }
          #portfolio > div {
            padding: 0 var(--margin-mobile) !important;
          }
          .masonry-grid {
            gap: 8px;
          }
        }
      `}</style>
    </section>
  )
}
