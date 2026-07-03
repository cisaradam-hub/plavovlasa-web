import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function revealFade(
  target: gsap.TweenTarget,
  options?: { y?: number; duration?: number; delay?: number }
) {
  return gsap.fromTo(
    target,
    { opacity: 0, y: options?.y ?? 24 },
    {
      opacity: 1,
      y: 0,
      duration: options?.duration ?? 0.9,
      delay: options?.delay ?? 0,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: target as Element,
        start: 'top 88%',
        once: true,
      },
    }
  )
}

export function revealImage(target: gsap.TweenTarget) {
  return gsap.fromTo(
    target,
    { opacity: 0, scale: 1.04 },
    {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: target as Element,
        start: 'top 85%',
        once: true,
      },
    }
  )
}

export function revealLines(
  container: Element,
  lineSelector = '[data-line]',
  stagger = 0.08
) {
  const lines = container.querySelectorAll(lineSelector)
  return gsap.fromTo(
    lines,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 1.0,
      stagger,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        once: true,
      },
    }
  )
}

export function revealDisplay(target: gsap.TweenTarget) {
  return gsap.fromTo(
    target,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: target as Element,
        start: 'top 80%',
        once: true,
      },
    }
  )
}

export function parallaxImage(target: gsap.TweenTarget, factor = 0.12) {
  return gsap.to(target, {
    yPercent: -(factor * 100),
    ease: 'none',
    scrollTrigger: {
      trigger: target as Element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}
