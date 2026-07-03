'use client'

import { useEffect, useRef } from 'react'
import { revealLines } from '@/lib/animations'
import ProjectEntry from '@/components/ui/ProjectEntry'
import { projects } from '@/data/projects'

export default function Work() {
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (headingRef.current) revealLines(headingRef.current)
  }, [])

  return (
    <section id="work" style={{ paddingTop: 'var(--space-3xl)' }}>
      <div
        ref={headingRef}
        style={{ paddingLeft: 'var(--margin-desktop)', marginBottom: 'var(--space-3xl)' }}
      >
        <p data-line className="small-caps" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-text-tertiary)' }}>
          Selected Work
        </p>
        <h2 data-line className="display-lg">
          The Work
        </h2>
      </div>

      {projects.map((project) => (
        <ProjectEntry key={project.number} {...project} />
      ))}
    </section>
  )
}
