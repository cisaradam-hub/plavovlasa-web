'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { getLenis } from '@/lib/lenis'

const menuItems = [
  { number: '01', label: 'O mne',     href: '#o-mne',     id: 'o-mne'    },
  { number: '02', label: 'Služby',    href: '#sluzby',    id: 'sluzby'   },
  { number: '03', label: 'Portfólio', href: '#portfolio', id: 'portfolio' },
  { number: '04', label: 'Recenzie',  href: '#recenzie',  id: 'recenzie' },
  { number: '05', label: 'Cenník',    href: '#cennik',    id: 'cennik'   },
  { number: '06', label: 'Kontakt',   href: '#kontakt',   id: 'kontakt'  },
]

export default function Navigation() {
  const [menuOpen, setMenuOpen]         = useState(false)
  const [onHero, setOnHero]             = useState(true)
  const [hoveredId, setHoveredId]       = useState<string | null>(null)
  const [pillStyle, setPillStyle]       = useState<{ left: number; width: number; opacity: number }>({ left: 0, width: 0, opacity: 0 })
  const pillContainerRef = useRef<HTMLDivElement>(null)
  const overlayRef       = useRef<HTMLDivElement>(null)
  const itemsRef         = useRef<HTMLLIElement[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setOnHero(window.scrollY < window.innerHeight * 0.6)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleItemEnter = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const container = pillContainerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const btnRect = e.currentTarget.getBoundingClientRect()
    setHoveredId(id)
    setPillStyle({
      left:    btnRect.left - containerRect.left,
      width:   btnRect.width,
      opacity: 1,
    })
  }

  const handleItemLeave = () => {
    setHoveredId(null)
    setPillStyle(prev => ({ ...prev, opacity: 0 }))
  }

  useEffect(() => {
    if (!overlayRef.current) return
    if (menuOpen) {
      gsap.set(overlayRef.current, { display: 'flex' })
      const tl = gsap.timeline()
      tl.fromTo(overlayRef.current, { x: '100%' }, { x: '0%', duration: 0.45, ease: 'expo.out' })
        .fromTo(itemsRef.current, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, ease: 'expo.out' }, 0.15)
    } else {
      const tl = gsap.timeline({
        onComplete: () => { if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' }) },
      })
      tl.to(itemsRef.current, { opacity: 0, x: 16, duration: 0.2, stagger: 0.03, ease: 'expo.in' })
        .to(overlayRef.current, { x: '100%', duration: 0.35, ease: 'expo.in' }, 0.05)
    }
  }, [menuOpen])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.querySelector(href)
      if (!el) return
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.6 })
      else el.scrollIntoView({ behavior: 'smooth' })
    }, 400)
  }

  const scrollTop = () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 2.0 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pillBg    = onHero ? 'rgba(255,255,255,0.18)' : 'rgba(245,242,236,0.72)'
  const itemColor = onHero ? '#F5F2EC' : 'var(--color-text-primary)'

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav
        className="nav-desktop"
        style={{
          position: 'fixed',
          top:      0,
          left:     0,
          right:    0,
          height:   '96px',
          zIndex:   100,
          display:  'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding:  '0 var(--margin-desktop)',
        }}
      >
        {/* Logo — wordmark */}
        <button onClick={scrollTop} aria-label="Na začiatok" style={{ background: 'none', border: 'none', padding: 0, cursor: 'none', display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontFamily:    'var(--font-display)',
            fontSize:      '18px',
            fontWeight:    400,
            letterSpacing: '-0.02em',
            color:         'var(--color-accent)',
            lineHeight:    1,
          }}>
            plavovlasa
          </span>
        </button>

        {/* Right side — hamburger */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Otvoriť menu"
            style={{
              background:     'var(--color-accent)',
              border:         'none',
              borderRadius:   '50%',
              width:          '44px',
              height:         '44px',
              cursor:         'none',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '5px',
              flexShrink:     0,
            }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: '16px', height: '1px', background: '#F5F2EC' }} />
            ))}
          </button>
        </div>
      </nav>

      {/* ── Mobile nav ── */}
      <nav
        className="nav-mobile"
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          right:          0,
          height:         '60px',
          zIndex:         100,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 var(--margin-mobile)',
        }}
      >
        <button onClick={scrollTop} aria-label="Na začiatok" style={{ background: 'none', border: 'none', padding: 0, cursor: 'none' }}>
          <span style={{
            fontFamily:    'var(--font-display)',
            fontSize:      '15px',
            fontWeight:    400,
            letterSpacing: '-0.02em',
            color:         'var(--color-accent)',
            lineHeight:    1,
          }}>
            plavovlasa
          </span>
        </button>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Otvoriť menu"
          style={{
            background:     'var(--color-accent)',
            border:         'none',
            borderRadius:   '50%',
            width:          '34px',
            height:         '34px',
            cursor:         'none',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '5px',
            flexShrink:     0,
          }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{ display: 'block', width: '16px', height: '1px', background: '#F5F2EC' }} />
          ))}
        </button>
      </nav>

      {/* ── Mobile overlay ── */}
      <div
        ref={overlayRef}
        style={{
          position:      'fixed',
          top:           0,
          right:         0,
          bottom:        0,
          width:         '80%',
          zIndex:        200,
          background:    'var(--color-accent)',
          display:       'none',
          flexDirection: 'column',
          justifyContent:'center',
          padding:       '0 var(--space-lg)',
          transform:     'translateX(100%)',
        }}
      >
        <button onClick={() => setMenuOpen(false)} aria-label="Zatvoriť menu"
          style={{ position: 'absolute', top: 0, right: 'var(--margin-mobile)', height: '60px', background: 'none', border: 'none', padding: 0, cursor: 'none', display: 'flex', alignItems: 'center', width: '24px' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <line x1="1" y1="1" x2="17" y2="17" stroke="var(--color-text-on-dark)" strokeWidth="1" strokeLinecap="round"/>
            <line x1="17" y1="1" x2="1" y2="17" stroke="var(--color-text-on-dark)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </button>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item, i) => (
            <li key={item.id} ref={(el) => { if (el) itemsRef.current[i] = el }} style={{ marginBottom: '4px' }}>
              <button onClick={() => scrollTo(item.href)}
                style={{ background: 'none', border: 'none', padding: '6px 0', cursor: 'none', color: 'var(--color-text-on-dark)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 8vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile  { display: none !important; }
        }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
      `}</style>
    </>
  )
}
