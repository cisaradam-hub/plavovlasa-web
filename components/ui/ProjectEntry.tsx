'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { revealImage, revealLines } from '@/lib/animations'

interface ProjectEntryProps {
  number: string
  title: string
  category: string
  description: string
  imageSrc: string
  imageSrc2?: string
  imageAlt: string
  imageAlt2?: string
  layout: 'left' | 'right' | 'full' | 'split'
}

export default function ProjectEntry({
  number,
  title,
  category,
  description,
  imageSrc,
  imageSrc2,
  imageAlt,
  imageAlt2,
  layout,
}: ProjectEntryProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const img1Ref = useRef<HTMLDivElement>(null)
  const img2Ref = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = { revert: () => {} }
    if (img1Ref.current) revealImage(img1Ref.current)
    if (img2Ref.current) revealImage(img2Ref.current)
    if (textRef.current) revealLines(textRef.current)
    return () => ctx.revert()
  }, [])

  if (layout === 'left') {
    return (
      <div
        ref={sectionRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          columnGap: 'var(--gutter)',
          marginBottom: 'var(--space-4xl)',
        }}
      >
        <div
          ref={img1Ref}
          style={{
            gridColumn: '1 / 8',
            height: '600px',
            overflow: 'hidden',
            borderRadius: 0,
            position: 'relative',
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>

        <div
          ref={textRef}
          style={{
            gridColumn: '8 / 13',
            paddingLeft: 'var(--space-lg)',
            paddingTop: 'var(--space-2xl)',
            position: 'relative',
          }}
        >
          <span
            className="display-xl"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 'var(--space-xl)',
              left: 'var(--space-sm)',
              opacity: 0.06,
              lineHeight: 1,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {number}
          </span>
          <p data-line className="small-caps" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-sm)' }}>
            {category}
          </p>
          <h2 data-line className="display-md" style={{ marginBottom: 'var(--space-md)' }}>
            {title}
          </h2>
          <p data-line className="body-text">
            {description}
          </p>
        </div>
      </div>
    )
  }

  if (layout === 'right') {
    return (
      <div
        ref={sectionRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          columnGap: 'var(--gutter)',
          marginBottom: 'var(--space-4xl)',
        }}
      >
        <div
          ref={textRef}
          style={{
            gridColumn: '1 / 6',
            paddingLeft: 'var(--margin-desktop)',
            paddingTop: 'var(--space-3xl)',
            position: 'relative',
          }}
        >
          <span
            className="display-xl"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 'var(--space-2xl)',
              right: 'var(--space-sm)',
              opacity: 0.06,
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            {number}
          </span>
          <p data-line className="small-caps" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-sm)' }}>
            {category}
          </p>
          <h2 data-line className="display-md" style={{ marginBottom: 'var(--space-md)' }}>
            {title}
          </h2>
          <p data-line className="body-text">
            {description}
          </p>
        </div>

        <div
          ref={img1Ref}
          style={{
            gridColumn: '6 / 13',
            height: '520px',
            overflow: 'hidden',
            borderRadius: 0,
            position: 'relative',
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
        </div>
      </div>
    )
  }

  if (layout === 'full') {
    return (
      <div
        ref={sectionRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '75vh',
          overflow: 'hidden',
          borderRadius: 0,
          marginBottom: 'var(--space-3xl)',
        }}
      >
        <div ref={img1Ref} style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </div>

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        <div
          ref={textRef}
          style={{
            position: 'absolute',
            bottom: 'var(--space-xl)',
            left: 'var(--margin-desktop)',
            zIndex: 2,
            color: 'var(--color-text-on-dark)',
          }}
        >
          <p data-line className="small-caps" style={{ color: 'rgba(245,242,236,0.6)', marginBottom: 'var(--space-sm)' }}>
            {category}
          </p>
          <h2 data-line className="display-md">
            {title}
          </h2>
          <p data-line className="body-text" style={{ color: 'rgba(245,242,236,0.7)', marginTop: 'var(--space-sm)' }}>
            {description}
          </p>
        </div>
      </div>
    )
  }

  // layout === 'split'
  return (
    <div
      ref={sectionRef}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-4xl)',
        paddingLeft: 'var(--margin-desktop)',
      }}
    >
      <div
        ref={img1Ref}
        style={{
          width: '45%',
          height: '400px',
          overflow: 'hidden',
          borderRadius: 0,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>

      <div
        ref={textRef}
        style={{
          width: '15%',
          flexShrink: 0,
          padding: '0 var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      >
        <p data-line className="small-caps" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-sm)' }}>
          {category}
        </p>
        <h2 data-line className="display-md">
          {title}
        </h2>
        <p data-line className="body-text" style={{ marginTop: 'var(--space-sm)' }}>
          {description}
        </p>
      </div>

      {imageSrc2 && (
        <div
          ref={img2Ref}
          style={{
            width: '35%',
            height: '340px',
            overflow: 'hidden',
            borderRadius: 0,
            flexShrink: 0,
            marginTop: 'var(--space-lg)',
            position: 'relative',
          }}
        >
          <Image
            src={imageSrc2}
            alt={imageAlt2 || imageAlt}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
      )}
    </div>
  )
}
