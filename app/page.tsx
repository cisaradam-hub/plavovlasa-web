import fs   from 'fs'
import path from 'path'

import Preloader    from '@/components/sections/Preloader'
import Navigation  from '@/components/layout/Navigation'
import Hero        from '@/components/sections/Hero'
import About       from '@/components/sections/About'
import Services    from '@/components/sections/Services'
import Portfolio   from '@/components/sections/Portfolio'
import Testimonials from '@/components/sections/Testimonials'
import Pricing     from '@/components/sections/Pricing'
import Contact     from '@/components/sections/Contact'

function getPortfolioImages(): string[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'portfolio')
  try {
    return fs.readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()
      .map(f => `/images/portfolio/${f}`)
  } catch {
    return []
  }
}

export default function Home() {
  const portfolioImages = getPortfolioImages()

  return (
    <main>
      <Preloader />
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <Portfolio images={portfolioImages} />
      <Pricing />
      <Contact />
    </main>
  )
}
