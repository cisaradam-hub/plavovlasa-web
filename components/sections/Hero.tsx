'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { getLenis } from '@/lib/lenis'

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function getEventXY(e: MouseEvent | TouchEvent, rect: DOMRect) {
  if ('touches' in e) {
    const t = e.touches[0] ?? e.changedTouches[0]
    return { x: t.clientX - rect.left, y: t.clientY - rect.top }
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
  const sw = img.naturalWidth  * scale
  const sh = img.naturalHeight * scale
  const sx = (cw - sw) / 2
  const sy = (ch - sh) * 0.15
  ctx.drawImage(img, sx, sy, sw, sh)
}

// ─── Component ────────────────────────────────────────────────────────────────

const HERO_IMAGES = ['/images/hero.jpg', '/images/hero2.jpg', '/images/hero3.jpg']

export default function Hero() {
  const sectionRef    = useRef<HTMLElement>(null)
  const textRef       = useRef<HTMLDivElement>(null)
  const wrapperRef    = useRef<HTMLDivElement>(null)

  // Two stacked canvases — canvas1 is active (smear target), canvas2 is transition overlay
  const canvas1Ref    = useRef<HTMLCanvasElement>(null)
  const canvas2Ref    = useRef<HTMLCanvasElement>(null)
  const bufferRef     = useRef<HTMLCanvasElement | null>(null)
  const patchRef      = useRef<HTMLCanvasElement | null>(null)

  const imagesRef     = useRef<HTMLImageElement[]>([])
  const currentIdxRef = useRef(0)
  const userPausedRef = useRef(false)
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const transitingRef = useRef(false)

  const dragging  = useRef(false)
  const lastPos   = useRef({ x: 0, y: 0 })

  // ── Text animations ──────────────────────────────────────────────────────────
  useEffect(() => {
    const seen  = sessionStorage.getItem('preloader-seen')
    const delay = seen ? 0 : 2.4
    const ctx = gsap.context(() => {
      if (!textRef.current) return
      const lines = textRef.current.querySelectorAll('[data-line]')
      const cta   = textRef.current.querySelector('[data-cta]')
      gsap.fromTo(lines, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, delay: delay + 0.15, stagger: 0.1, ease: 'expo.out' })
      gsap.fromTo(cta,   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, delay: delay + 0.45, ease: 'expo.out' })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // ── Transition to image at index ─────────────────────────────────────────────
  const goTo = useCallback((idx: number) => {
    if (transitingRef.current) return
    const c1  = canvas1Ref.current
    const c2  = canvas2Ref.current
    if (!c1 || !c2) return
    const nextImg = imagesRef.current[idx]
    if (!nextImg || !nextImg.complete) return
    if (idx === currentIdxRef.current) return

    transitingRef.current = true

    const ctx2 = c2.getContext('2d')
    if (!ctx2) return

    // Draw next image on overlay canvas2
    ctx2.clearRect(0, 0, c2.width, c2.height)
    drawImageCover(ctx2, nextImg, c2.width, c2.height)

    // Crossfade: canvas2 fades in over canvas1 (no white flash)
    gsap.fromTo(c2, { opacity: 0 }, {
      opacity: 1,
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => {
        // Commit new image to canvas1 (active smear target)
        const ctx1 = c1.getContext('2d')
        if (ctx1) {
          ctx1.clearRect(0, 0, c1.width, c1.height)
          drawImageCover(ctx1, nextImg, c1.width, c1.height)
        }
        if (bufferRef.current) {
          const bCtx = bufferRef.current.getContext('2d')
          if (bCtx) {
            bCtx.clearRect(0, 0, bufferRef.current.width, bufferRef.current.height)
          }
        }
        gsap.set(c2, { opacity: 0 })
        currentIdxRef.current = idx
        transitingRef.current = false
      },
    })
  }, [])

  const next = useCallback(() => {
    userPausedRef.current = true
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    goTo((currentIdxRef.current + 1) % HERO_IMAGES.length)
  }, [goTo])

  const prev = useCallback(() => {
    userPausedRef.current = true
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    goTo((currentIdxRef.current - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)
  }, [goTo])

  // ── Canvas setup + resize + auto-advance ─────────────────────────────────────
  useEffect(() => {
    const c1      = canvas1Ref.current
    const c2      = canvas2Ref.current
    const wrapper = wrapperRef.current
    if (!c1 || !c2 || !wrapper) return

    const ctx1 = c1.getContext('2d')
    if (!ctx1) return

    let prevWidth = wrapper.offsetWidth
    const resize = () => {
      const w = wrapper.offsetWidth
      const h = wrapper.offsetHeight
      c1.width  = w; c1.height  = h
      c2.width  = w; c2.height  = h
      if (bufferRef.current) {
        bufferRef.current.width  = w
        bufferRef.current.height = h
      }
      const cur = imagesRef.current[currentIdxRef.current]
      if (cur?.complete && cur.naturalWidth > 0) {
        ctx1.clearRect(0, 0, w, h)
        drawImageCover(ctx1, cur, w, h)
      }
    }
    const handleResize = () => {
      const newWidth = wrapper.offsetWidth
      if (newWidth === prevWidth) return // iOS address bar height change — skip
      prevWidth = newWidth
      resize()
    }

    let loadedCount = 0
    HERO_IMAGES.forEach((src, i) => {
      const img = new window.Image()
      imagesRef.current[i] = img

      const handleLoad = () => {
        loadedCount++
        if (loadedCount === 1) {
          resize()
          bufferRef.current = document.createElement('canvas')
          bufferRef.current.width  = c1.width
          bufferRef.current.height = c1.height
          patchRef.current = document.createElement('canvas')
          patchRef.current.width  = 80
          patchRef.current.height = 80
          gsap.fromTo(wrapper, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out', onComplete: () => gsap.set(wrapper, { clearProps: 'transform' }) })
        }
      }

      img.onload = handleLoad
      img.src = src
      // If already cached, onload won't fire — handle manually
      if (img.complete && img.naturalWidth > 0) {
        img.onload = null
        handleLoad()
      }
    })

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [goTo])

  // ── Smear effect ─────────────────────────────────────────────────────────────
  const smear = useCallback((x: number, y: number, px: number, py: number) => {
    const canvas = canvas1Ref.current
    const buffer = bufferRef.current
    const patch  = patchRef.current
    if (!canvas || !buffer || !patch) return
    const ctx  = canvas.getContext('2d')
    const bCtx = buffer.getContext('2d')
    const pCtx = patch.getContext('2d')
    if (!ctx || !bCtx || !pCtx) return

    const dx    = x - px
    const dy    = y - py
    const speed = Math.sqrt(dx * dx + dy * dy)
    if (speed < 0.8) return

    const radius   = 24
    const strength = Math.min(speed * 0.55, 16)
    const nx = dx / speed
    const ny = dy / speed
    const destX = x + nx * strength
    const destY = y + ny * strength
    const half  = patch.width / 2

    bCtx.drawImage(canvas, 0, 0)

    // Draw source area from buffer into small patch canvas
    pCtx.clearRect(0, 0, patch.width, patch.height)
    pCtx.drawImage(buffer, x - half, y - half, patch.width, patch.height, 0, 0, patch.width, patch.height)

    // Feathered circular mask via radial gradient + destination-in
    pCtx.globalCompositeOperation = 'destination-in'
    const grad = pCtx.createRadialGradient(half, half, 0, half, half, radius)
    grad.addColorStop(0,    'rgba(0,0,0,1)')
    grad.addColorStop(0.5,  'rgba(0,0,0,0.9)')
    grad.addColorStop(0.8,  'rgba(0,0,0,0.4)')
    grad.addColorStop(1,    'rgba(0,0,0,0)')
    pCtx.fillStyle = grad
    pCtx.fillRect(0, 0, patch.width, patch.height)
    pCtx.globalCompositeOperation = 'source-over'

    // Composite feathered patch onto main canvas at destination
    ctx.drawImage(patch, destX - half, destY - half)
  }, [])

  // ── Pointer events ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvas1Ref.current
    if (!canvas) return

    const onDown = (e: MouseEvent | TouchEvent) => {
      dragging.current = true
      const rect = canvas.getBoundingClientRect()
      lastPos.current = getEventXY(e, rect)
    }
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return
      if ('touches' in e) {
        e.preventDefault()
        e.stopPropagation()
      }
      const rect = canvas.getBoundingClientRect()
      const { x, y } = getEventXY(e, rect)
      smear(x, y, lastPos.current.x, lastPos.current.y)
      lastPos.current = { x, y }
    }
    const onUp = () => { dragging.current = false }

    canvas.addEventListener('mousedown',  onDown)
    canvas.addEventListener('mousemove',  onMove)
    canvas.addEventListener('mouseup',    onUp)
    canvas.addEventListener('mouseleave', onUp)
    canvas.addEventListener('touchstart', onDown as EventListener, { passive: true })
    canvas.addEventListener('touchmove',  onMove as EventListener, { passive: false })
    canvas.addEventListener('touchend',   onUp)

    return () => {
      canvas.removeEventListener('mousedown',  onDown)
      canvas.removeEventListener('mousemove',  onMove)
      canvas.removeEventListener('mouseup',    onUp)
      canvas.removeEventListener('mouseleave', onUp)
      canvas.removeEventListener('touchstart', onDown as EventListener)
      canvas.removeEventListener('touchmove',  onMove as EventListener)
      canvas.removeEventListener('touchend',   onUp)
    }
  }, [smear])

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden', isolation: 'isolate' }}
    >
      {/* Canvas stack — canvas1 active, canvas2 transition overlay */}
      <div
        ref={wrapperRef}
        style={{ position: 'absolute', inset: 0, opacity: 0, zIndex: 0, background: '#0A0806' }}
      >
        <canvas
          ref={canvas1Ref}
          style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }}
        />
        <canvas
          ref={canvas2Ref}
          style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', opacity: 0, pointerEvents: 'none' }}
        />
      </div>

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          zIndex:        1,
          background:    'linear-gradient(to top, rgba(10,8,6,0.58) 0%, rgba(10,8,6,0.28) 40%, rgba(10,8,6,0.04) 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Slideshow arrows — left */}
      <button
        onClick={prev}
        aria-label="Predchádzajúca fotografia"
        className="hero-arrow hero-arrow-left"
        style={{
          position:       'absolute',
          top:            '50%',
          left:           'var(--margin-desktop)',
          transform:      'translateY(-50%)',
          zIndex:         3,
          width:          '44px',
          height:         '44px',
          borderRadius:   '50%',
          background:     'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border:         'none',
          cursor:         'none',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          color:          '#F5F2EC',
          fontSize:       '18px',
          transition:     'background 0.2s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.22)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)' }}
      >
        ←
      </button>

      {/* Slideshow arrows — right */}
      <button
        onClick={next}
        aria-label="Nasledujúca fotografia"
        className="hero-arrow hero-arrow-right"
        style={{
          position:       'absolute',
          top:            '50%',
          right:          'var(--margin-desktop)',
          transform:      'translateY(-50%)',
          zIndex:         3,
          width:          '44px',
          height:         '44px',
          borderRadius:   '50%',
          background:     'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          border:         'none',
          cursor:         'none',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          color:          '#F5F2EC',
          fontSize:       '18px',
          transition:     'background 0.2s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.22)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)' }}
      >
        →
      </button>

      {/* Text zone */}
      <div
        ref={textRef}
        className="hero-text-zone"
        style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 2, padding: 'var(--margin-desktop)', maxWidth: '900px' }}
      >
        <h1
          style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(28px, 3.8vw, 58px)',
            lineHeight:    1.05,
            letterSpacing: '-0.02em',
            fontWeight:    400,
            color:         '#F5F2EC',
          }}
        >
          <span data-line style={{ display: 'block', opacity: 0 }}>Keď sa cítiš dobre,</span>
          <span data-line style={{ display: 'block', opacity: 0 }}>je to vidieť.</span>
        </h1>

        <button
          data-cta
          onClick={() => {
            const el = document.querySelector('#o-mne')
            if (!el) return
            const lenis = getLenis()
            if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.6 })
            else el.scrollIntoView({ behavior: 'smooth' })
          }}
          style={{
            marginTop:     'var(--space-md)',
            display:       'inline-flex',
            alignItems:    'center',
            gap:           '10px',
            fontFamily:    'var(--font-mono)',
            fontSize:      '13px',
            fontWeight:    700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         '#ffffff',
            background:    'var(--color-accent)',
            border:        'none',
            borderRadius:  '100px',
            padding:       '16px 32px',
            cursor:        'none',
            opacity:       0,
            transition:    'background 0.3s var(--ease-out-expo), transform 0.2s var(--ease-out-expo)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#001d6e'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-accent)'; (e.currentTarget as HTMLButtonElement).style.transform = '' }}
        >
          Zistiť viac
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-text-zone {
            padding: var(--margin-mobile) !important;
            max-width: 100% !important;
          }
          .hero-text-zone h1 {
            font-size: clamp(26px, 6.5vw, 36px) !important;
          }
          .hero-arrow {
            width:  36px !important;
            height: 36px !important;
            font-size: 15px !important;
          }
          .hero-arrow-left  { left:  var(--margin-mobile) !important; }
          .hero-arrow-right { right: var(--margin-mobile) !important; }
        }
      `}</style>
    </section>
  )
}
