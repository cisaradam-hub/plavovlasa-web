/**
 * PLAVOVLASA.MAKEUP — Figma Plugin Script
 * ─────────────────────────────────────────
 * HOW TO RUN:
 *   1. In Figma: Main Menu → Plugins → Development → New Plugin
 *   2. Choose "Run once" template → click "Create Plugin"
 *   3. Open code.js in the generated folder, replace ALL contents with this file
 *   4. Back in Figma: Plugins → Development → plavovlasa-plugin → Run
 *
 * REQUIRES these fonts installed in Figma:
 *   — Cormorant (Light, Light Italic, Regular, Italic)
 *   — DM Sans (Light, Regular, Medium)
 *   Install via Google Fonts panel in Figma (Resources → Fonts → search)
 *
 * Image placeholders are gray rectangles labelled [TODO].
 * Replace them with your real photography after running.
 */

(async () => {

  // ─────────────────────────────────────────────────────────
  // DESIGN TOKENS
  // ─────────────────────────────────────────────────────────

  const C = {
    bg:        { r: 0.961, g: 0.949, b: 0.925 }, // #F5F2EC
    surface:   { r: 0.929, g: 0.918, b: 0.886 }, // #EDEAE2
    dark:      { r: 0.102, g: 0.102, b: 0.086 }, // #1A1A16
    primary:   { r: 0.102, g: 0.102, b: 0.086 }, // #1A1A16
    secondary: { r: 0.290, g: 0.290, b: 0.259 }, // #4A4A42
    tertiary:  { r: 0.604, g: 0.604, b: 0.557 }, // #9A9A8E
    onDark:    { r: 0.961, g: 0.949, b: 0.925 }, // #F5F2EC
    accent:    { r: 0.059, g: 0.298, b: 0.612 }, // #0F4C9C
    border:    { r: 0.102, g: 0.102, b: 0.086 }, // at 12% opacity
  }

  // [fontSize, lineHeightMultiplier, letterSpacingPercent, weight, family]
  const T = {
    displayXl:  [110, 0.92, -2,    300, 'serif'],
    displayLg:  [80,  0.92, -2,    300, 'serif'],
    displayMd:  [56,  1.10,  0,    400, 'serif'],
    heading:    [36,  1.10,  0,    300, 'serif'],
    subheading: [24,  1.70,  0,    300, 'serif'],
    body:       [18,  1.70,  0,    400, 'sans'],
    caption:    [13,  1.70,  8,    400, 'sans'],
    micro:      [11,  1.50,  15,   500, 'sans'],
  }

  const S = {
    xs: 8,   sm: 16,  md: 32,  lg: 64,
    xl: 96,  xl2: 128, xl3: 192, xl4: 256, xl5: 320,
    margin: 80, gutter: 24,
  }

  const W = 1440  // canvas width

  // ─────────────────────────────────────────────────────────
  // FONT LOADING
  // ─────────────────────────────────────────────────────────

  await Promise.all([
    figma.loadFontAsync({ family: 'Cormorant', style: 'Light' }),
    figma.loadFontAsync({ family: 'Cormorant', style: 'Light Italic' }),
    figma.loadFontAsync({ family: 'Cormorant', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Cormorant', style: 'Italic' }),
    figma.loadFontAsync({ family: 'DM Sans', style: 'Light' }),
    figma.loadFontAsync({ family: 'DM Sans', style: 'Regular' }),
    figma.loadFontAsync({ family: 'DM Sans', style: 'Medium' }),
  ])

  // ─────────────────────────────────────────────────────────
  // PRIMITIVE HELPERS
  // ─────────────────────────────────────────────────────────

  function solid(color, opacity = 1) {
    return [{ type: 'SOLID', color, opacity }]
  }

  /** Auto-layout frame that hugs its content vertically */
  function vFrame(name, width, gap = 0) {
    const f = figma.createFrame()
    f.name = name
    f.fills = []
    f.layoutMode = 'VERTICAL'
    f.primaryAxisSizingMode = 'AUTO'
    f.counterAxisSizingMode = 'FIXED'
    f.resize(width, 100)
    f.itemSpacing = gap
    f.clipsContent = false
    return f
  }

  /** Auto-layout frame horizontal, hugs content */
  function hFrame(name, width, gap = 0) {
    const f = figma.createFrame()
    f.name = name
    f.fills = []
    f.layoutMode = 'HORIZONTAL'
    f.primaryAxisSizingMode = 'FIXED'
    f.counterAxisSizingMode = 'AUTO'
    f.resize(width, 100)
    f.itemSpacing = gap
    f.clipsContent = false
    return f
  }

  /** Fixed-size frame (no auto-layout) */
  function fixedFrame(name, w, h, color) {
    const f = figma.createFrame()
    f.name = name
    f.resize(w, h)
    f.fills = color ? solid(color) : []
    f.clipsContent = true
    return f
  }

  /** Rectangle placeholder */
  function rect(name, w, h, shade = 0.82) {
    const r = figma.createRectangle()
    r.name = name
    r.resize(w, h)
    r.fills = solid({ r: shade, g: shade - 0.02, b: shade - 0.04 })
    return r
  }

  /** 1px horizontal rule */
  function rule(name, width, opacity = 0.12) {
    const r = figma.createRectangle()
    r.name = name
    r.resize(width, 1)
    r.fills = solid(C.border, opacity)
    return r
  }

  /** Invisible spacer that grows in an h-auto-layout parent */
  function flexSpacer(name) {
    const f = figma.createFrame()
    f.name = name
    f.fills = []
    f.resize(1, 1)
    f.layoutGrow = 1
    f.layoutMode = 'HORIZONTAL'
    f.primaryAxisSizingMode = 'FIXED'
    f.counterAxisSizingMode = 'FIXED'
    return f
  }

  /**
   * Create a styled text node.
   * @param {string} content
   * @param {keyof T} token
   * @param {keyof C} colorKey
   * @param {{ italic?, uppercase?, width?, name?, opacity? }} opts
   */
  async function txt(content, token, colorKey, opts = {}) {
    const [size, lhMult, lsPercent, weight, family] = T[token]
    const t = figma.createText()

    const isSerif = family === 'serif'
    let style
    if (isSerif) {
      style = opts.italic
        ? (weight === 300 ? 'Light Italic' : 'Italic')
        : (weight === 300 ? 'Light' : 'Regular')
    } else {
      style = weight === 500 ? 'Medium' : weight === 300 ? 'Light' : 'Regular'
    }

    t.fontName = { family: isSerif ? 'Cormorant' : 'DM Sans', style }
    t.fontSize = size
    t.lineHeight = { unit: 'PERCENT', value: lhMult * 100 }
    t.letterSpacing = { unit: 'PERCENT', value: lsPercent }
    if (opts.uppercase) t.textCase = 'UPPER'
    t.characters = content
    t.fills = solid(C[colorKey] || C.primary, opts.opacity || 1)
    t.name = opts.name || content.substring(0, 50)

    if (opts.width) {
      t.textAutoResize = 'HEIGHT'
      t.resize(opts.width, t.height)
    } else {
      t.textAutoResize = 'WIDTH_AND_HEIGHT'
    }

    return t
  }

  // ─────────────────────────────────────────────────────────
  // SECTION BUILDERS
  // ─────────────────────────────────────────────────────────

  // ── 01  NAVIGATION ────────────────────────────────────────
  async function buildNav() {
    const nav = hFrame('Navigation', W, 0)
    nav.fills = []
    nav.primaryAxisAlignItems = 'CENTER'
    nav.counterAxisAlignItems = 'CENTER'
    nav.paddingLeft = S.margin
    nav.paddingRight = S.margin
    nav.resize(W, 60)
    nav.primaryAxisSizingMode = 'FIXED'
    nav.counterAxisSizingMode = 'FIXED'

    const logo = await txt('PLAVOVLASA', 'micro', 'primary', {
      uppercase: true, name: 'Logo / Plavovlasa',
    })
    // Override letter-spacing to match 0.12em
    logo.letterSpacing = { unit: 'PERCENT', value: 12 }

    const spacer = flexSpacer('Spacer')
    const indexBtn = await txt('INDEX', 'micro', 'primary', {
      uppercase: true, name: 'Nav / Index',
    })

    nav.appendChild(logo)
    nav.appendChild(spacer)
    nav.appendChild(indexBtn)
    return nav
  }

  // ── 02  HERO ──────────────────────────────────────────────
  async function buildHero() {
    const section = fixedFrame('Hero', W, 900)
    section.fills = solid(C.bg)

    // Right image zone (60%)
    const imgW = Math.round(W * 0.6)
    const imgPlaceholder = rect(
      'Image / Hero [TODO: /images/hero.jpg]',
      imgW, 900, 0.80
    )
    imgPlaceholder.x = W - imgW
    section.appendChild(imgPlaceholder)

    // Gradient fade (left edge of image)
    const gradW = Math.round(W * 0.12)
    const grad = figma.createRectangle()
    grad.name = 'Gradient / Edge fade'
    grad.resize(gradW, 900)
    grad.x = W - imgW - gradW
    grad.fills = [{
      type: 'GRADIENT_LINEAR',
      gradientTransform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: [
        { position: 0, color: { ...C.bg, a: 1 } },
        { position: 1, color: { ...C.bg, a: 0 } },
      ],
    }]
    section.appendChild(grad)

    // Text zone
    const textW = Math.round(W * 0.38)
    const textZone = vFrame('Hero / Text Zone', textW, 0)
    textZone.paddingLeft = S.margin
    textZone.paddingBottom = S.xl
    textZone.itemSpacing = 0
    textZone.x = 0
    textZone.y = 900 - 580

    const label = await txt('MAKE-UP ARTIST', 'micro', 'tertiary', {
      uppercase: true, name: 'Label / Make-Up Artist',
    })

    // Add bottom margin manually via a spacer between label and headline
    const labelSpacer = figma.createFrame()
    labelSpacer.name = 'Spacing / sm'
    labelSpacer.resize(textW - S.margin, S.sm)
    labelSpacer.fills = []

    const headline = vFrame('Headline / Display XL', textW - S.margin, 0)
    headline.itemSpacing = 0
    const hl1 = await txt('Face as medium.', 'displayXl', 'primary', { name: 'Headline line 1' })
    const hl2 = await txt('Light as material.', 'displayXl', 'primary', { italic: true, name: 'Headline line 2 — italic' })
    const hl3 = await txt('Skin as architecture.', 'displayXl', 'primary', { name: 'Headline line 3' })
    headline.appendChild(hl1)
    headline.appendChild(hl2)
    headline.appendChild(hl3)

    const bodySpacer = figma.createFrame()
    bodySpacer.name = 'Spacing / lg'
    bodySpacer.resize(textW - S.margin, S.lg)
    bodySpacer.fills = []

    const bodyTxt = await txt(
      'Available for editorial, film, and private collaboration.',
      'body', 'secondary',
      { width: textW - S.margin, name: 'Body / Tagline' }
    )

    textZone.appendChild(label)
    textZone.appendChild(labelSpacer)
    textZone.appendChild(headline)
    textZone.appendChild(bodySpacer)
    textZone.appendChild(bodyTxt)
    section.appendChild(textZone)

    return section
  }

  // ── 03  MANIFESTO ─────────────────────────────────────────
  async function buildManifesto() {
    const section = vFrame('Manifesto', W, 0)
    section.fills = solid(C.bg)
    section.paddingTop = S.xl5
    section.paddingBottom = S.xl5
    section.paddingLeft = Math.round(W * 0.12)
    section.paddingRight = S.margin

    const inner = vFrame('Manifesto / Inner', 680, 0)
    inner.itemSpacing = 0

    const label = await txt('ON THE WORK', 'micro', 'accent', {
      uppercase: true, name: 'Label / On the Work',
    })

    const labelSpacer = figma.createFrame()
    labelSpacer.name = 'Spacing / md'
    labelSpacer.resize(680, S.md)
    labelSpacer.fills = []

    const quote = await txt(
      'I work in the space between the face as it is and the face as it wants to become. Every collaboration begins with listening — to the light, to the skin, to what is already there.',
      'displayMd', 'primary',
      { italic: true, width: 680, name: 'Quote / Manifesto' }
    )

    const xlSpacer = figma.createFrame()
    xlSpacer.name = 'Spacing / xl'
    xlSpacer.resize(680, S.xl)
    xlSpacer.fills = []

    const attribution = vFrame('Attribution', 680, S.sm)
    const attrRule = rule('Rule / 40px', 40)
    const sig = await txt('PLAVOVLASA', 'micro', 'tertiary', {
      uppercase: true, name: 'Signature',
    })
    attribution.appendChild(attrRule)
    attribution.appendChild(sig)

    inner.appendChild(label)
    inner.appendChild(labelSpacer)
    inner.appendChild(quote)
    inner.appendChild(xlSpacer)
    inner.appendChild(attribution)
    section.appendChild(inner)
    return section
  }

  // ── 04  WORK ──────────────────────────────────────────────
  async function buildWork() {
    const section = vFrame('Work', W, 0)
    section.fills = solid(C.bg)
    section.paddingTop = S.xl3
    section.paddingBottom = 0

    // Section heading
    const heading = vFrame('Work / Heading', W - S.margin, S.sm)
    heading.paddingLeft = S.margin
    const wLabel = await txt('SELECTED WORK', 'micro', 'tertiary', { uppercase: true })
    const wTitle = await txt('The Work', 'displayLg', 'primary')
    heading.appendChild(wLabel)
    heading.appendChild(wTitle)
    section.appendChild(heading)

    const sectionSpacer = figma.createFrame()
    sectionSpacer.name = 'Spacing / xl3'
    sectionSpacer.resize(W, S.xl3)
    sectionSpacer.fills = []
    section.appendChild(sectionSpacer)

    // ── Project 01 — Layout: Left ──
    {
      const p = fixedFrame('Project 01 / The Architecture of Light — layout:left', W, 600)
      const colW = Math.round(W * 7 / 12)
      const imgEl = rect('Image / Architecture of Light [TODO]', colW, 600, 0.84)
      p.appendChild(imgEl)

      const textZone = vFrame('Text Zone', W - colW - S.margin - S.lg, S.md)
      textZone.x = colW + S.lg
      textZone.y = S.xl2

      const ghostNum = await txt('01', 'displayXl', 'primary', {
        name: 'Ghost number', opacity: 0.06,
      })
      const cat = await txt('EDITORIAL CAMPAIGN', 'micro', 'accent', { uppercase: true })
      const title = await txt('The Architecture of Light', 'displayMd', 'primary')
      const desc = await txt(
        'A study in natural illumination and the geometry of shadow on skin.',
        'body', 'secondary', { width: W - colW - S.margin - S.lg }
      )
      textZone.appendChild(ghostNum)
      textZone.appendChild(cat)
      textZone.appendChild(title)
      textZone.appendChild(desc)
      p.appendChild(textZone)
      section.appendChild(p)
    }

    const gap1 = figma.createFrame()
    gap1.name = 'Spacing / xl4'
    gap1.resize(W, S.xl4)
    gap1.fills = []
    section.appendChild(gap1)

    // ── Project 02 — Layout: Right ──
    {
      const p = fixedFrame('Project 02 / Faces in Transition — layout:right', W, 520)
      const colW = Math.round(W * 5 / 12)
      const textZone = vFrame('Text Zone', colW - S.margin, S.md)
      textZone.x = S.margin
      textZone.y = S.xl3

      const ghostNum = await txt('02', 'displayXl', 'primary', {
        name: 'Ghost number', opacity: 0.06,
      })
      const cat = await txt('FILM PRODUCTION', 'micro', 'accent', { uppercase: true })
      const title = await txt('Faces in Transition', 'displayMd', 'primary')
      const desc = await txt(
        'Character transformation across eight scenes. The work beneath the work.',
        'body', 'secondary', { width: colW - S.margin }
      )
      textZone.appendChild(ghostNum)
      textZone.appendChild(cat)
      textZone.appendChild(title)
      textZone.appendChild(desc)

      const imgEl = rect('Image / Faces in Transition [TODO]', W - colW, 520, 0.81)
      imgEl.x = colW

      p.appendChild(textZone)
      p.appendChild(imgEl)
      section.appendChild(p)
    }

    const gap2 = figma.createFrame()
    gap2.name = 'Spacing / xl4'
    gap2.resize(W, S.xl4)
    gap2.fills = []
    section.appendChild(gap2)

    // ── Project 03 — Layout: Full bleed ──
    {
      const H = Math.round(900 * 0.75)
      const p = fixedFrame('Project 03 / Private Ceremony — layout:full', W, H)
      const imgEl = rect('Image / Private Ceremony [TODO]', W, H, 0.78)
      p.appendChild(imgEl)

      // Gradient overlay bottom 30%
      const gradH = Math.round(H * 0.3)
      const gradEl = figma.createRectangle()
      gradEl.name = 'Gradient / Text overlay'
      gradEl.resize(W, gradH)
      gradEl.y = H - gradH
      gradEl.fills = [{
        type: 'GRADIENT_LINEAR',
        gradientTransform: [[0, -1, 1], [1, 0, 0]],
        gradientStops: [
          { position: 0, color: { r: 0, g: 0, b: 0, a: 0.4 } },
          { position: 1, color: { r: 0, g: 0, b: 0, a: 0 } },
        ],
      }]
      p.appendChild(gradEl)

      const textZone = vFrame('Text Zone', W - S.margin * 2, S.sm)
      textZone.x = S.margin
      textZone.y = H - S.xl - 130

      const cat = await txt('PRIVATE CLIENT', 'micro', 'onDark', { uppercase: true })
      const title = await txt('Private Ceremony', 'displayMd', 'onDark')
      const desc = await txt(
        'Intimate work for a deeply personal occasion. Presence over spectacle.',
        'body', 'onDark',
        { width: 600, name: 'Description' }
      )
      textZone.appendChild(cat)
      textZone.appendChild(title)
      textZone.appendChild(desc)
      p.appendChild(textZone)
      section.appendChild(p)
    }

    const gap3 = figma.createFrame()
    gap3.name = 'Spacing / xl3'
    gap3.resize(W, S.xl3)
    gap3.fills = []
    section.appendChild(gap3)

    // ── Project 04 — Layout: Split ──
    {
      const p = fixedFrame('Project 04 / The Editorial Space — layout:split', W, 420)
      const imgAW = Math.round(W * 0.45)
      const imgA = rect('Image A / Editorial Space [TODO]', imgAW, 400, 0.83)
      imgA.x = S.margin
      imgA.y = 0

      const textZone = vFrame('Text Zone', Math.round(W * 0.14), S.sm)
      textZone.x = S.margin + imgAW + S.md
      textZone.y = 100

      const cat = await txt('COLLABORATION', 'micro', 'accent', { uppercase: true })
      const title = await txt('The Editorial Space', 'displayMd', 'primary')
      const desc = await txt(
        'A long-form collaboration with photographer and poet.',
        'body', 'secondary',
        { width: Math.round(W * 0.14) }
      )
      textZone.appendChild(cat)
      textZone.appendChild(title)
      textZone.appendChild(desc)

      const imgBW = Math.round(W * 0.33)
      const imgB = rect('Image B / Editorial Space [TODO]', imgBW, 340, 0.79)
      imgB.x = S.margin + imgAW + Math.round(W * 0.14) + S.md * 2
      imgB.y = S.lg

      p.appendChild(imgA)
      p.appendChild(textZone)
      p.appendChild(imgB)
      section.appendChild(p)
    }

    const gap4 = figma.createFrame()
    gap4.name = 'Spacing / xl4'
    gap4.resize(W, S.xl4)
    gap4.fills = []
    section.appendChild(gap4)

    return section
  }

  // ── 05  INTERLUDE ─────────────────────────────────────────
  async function buildInterlude() {
    const section = fixedFrame('Interlude', W, 900)
    section.fills = solid({ r: 0.72, g: 0.70, b: 0.68 })

    const imgEl = rect('Image / Interlude [TODO]', W, 990, 0.70)
    imgEl.y = -45
    section.appendChild(imgEl)

    const wordLabel = await txt('CRAFT', 'micro', 'onDark', {
      uppercase: true, opacity: 0.4,
      name: 'Word / Craft',
    })
    wordLabel.letterSpacing = { unit: 'PERCENT', value: 25 }
    // Position bottom-right
    wordLabel.textAutoResize = 'WIDTH_AND_HEIGHT'
    // We'll position after adding (we know approximate width)
    section.appendChild(wordLabel)
    wordLabel.x = W - S.margin - wordLabel.width
    wordLabel.y = 900 - S.xl - 20

    return section
  }

  // ── 06  PRACTICE ──────────────────────────────────────────
  async function buildPractice() {
    const section = vFrame('Practice Areas', W, 0)
    section.fills = solid(C.bg)
    section.paddingTop = S.xl5
    section.paddingBottom = S.xl3
    section.paddingLeft = S.margin
    section.paddingRight = S.margin

    const heading = vFrame('Practice / Heading', W - S.margin * 2, S.sm)
    const pLabel = await txt('WAYS OF WORKING', 'micro', 'tertiary', { uppercase: true })
    const pTitle = await txt('Practice Areas', 'displayLg', 'primary')
    heading.appendChild(pLabel)
    heading.appendChild(pTitle)
    section.appendChild(heading)

    const headGap = figma.createFrame()
    headGap.name = 'Spacing / xl'
    headGap.resize(W - S.margin * 2, S.xl)
    headGap.fills = []
    section.appendChild(headGap)

    // 4-column grid
    const contentW = W - S.margin * 2
    const colW = Math.floor((contentW - S.gutter * 3) / 4)
    const topPads = [0, S.xl, S.md, S.xl2]
    const areas = [
      { idx: '01', name: 'Editorial & Campaign', desc: 'Fashion, beauty, and luxury campaigns. Print and digital.' },
      { idx: '02', name: 'Film & Moving Image', desc: 'Feature film, short form, music video, and commercial production.' },
      { idx: '03', name: 'Private Clientele', desc: 'Discrete, personal appointments for significant occasions.' },
      { idx: '04', name: 'Collaboration', desc: 'Long-form creative work with photographers, directors, and artists.' },
    ]

    const grid = hFrame('Practice / 4-Column Grid', contentW, S.gutter)
    grid.counterAxisAlignItems = 'MIN'

    for (let i = 0; i < areas.length; i++) {
      const a = areas[i]
      const col = vFrame(`Practice Item ${a.idx} / ${a.name}`, colW, S.sm)
      col.paddingTop = topPads[i]

      const topRule = rule(`Rule top / col ${a.idx}`, colW)
      const idx = await txt(a.idx, 'micro', 'tertiary', { uppercase: true })
      const name = await txt(a.name, 'displayMd', 'primary', { name: `Practice name / ${a.name}` })
      const desc = await txt(a.desc, 'body', 'secondary', { width: colW })
      col.appendChild(topRule)
      col.appendChild(idx)
      col.appendChild(name)
      col.appendChild(desc)
      grid.appendChild(col)
    }
    section.appendChild(grid)

    const closingGap = figma.createFrame()
    closingGap.name = 'Spacing / xl3'
    closingGap.resize(contentW, S.xl3)
    closingGap.fills = []
    section.appendChild(closingGap)

    const closing = vFrame('Practice / Closing', contentW, S.sm)
    const closingBody = await txt('For inquiries regarding availability and collaboration —', 'body', 'secondary')
    const emailLink = await txt('hello@plavovlasa.com', 'displayMd', 'primary', {
      italic: true, name: 'Email link [TODO: real email]',
    })
    closing.appendChild(closingBody)
    closing.appendChild(emailLink)
    section.appendChild(closing)

    return section
  }

  // ── 07  PROCESS ───────────────────────────────────────────
  async function buildProcess() {
    const section = vFrame('Process & Collaboration', W, 0)
    section.fills = solid(C.surface)
    section.paddingTop = S.xl4
    section.paddingBottom = S.xl4
    section.paddingLeft = S.margin
    section.paddingRight = S.margin

    const contentW = W - S.margin * 2
    const headW = Math.round(contentW * 0.4)

    const heading = vFrame('Process / Heading', headW, S.sm)
    const pLabel = await txt('BEHIND THE WORK', 'micro', 'tertiary', { uppercase: true })
    const pTitle = await txt('Process & Collaboration', 'displayLg', 'primary')
    const pBody = await txt(
      'Every face carries its own story. My role is to listen before I begin.',
      'body', 'secondary',
      { italic: true, width: headW }
    )
    heading.appendChild(pLabel)
    heading.appendChild(pTitle)
    heading.appendChild(pBody)
    section.appendChild(heading)

    const collageGap = figma.createFrame()
    collageGap.name = 'Spacing / xl3'
    collageGap.resize(contentW, S.xl3)
    collageGap.fills = []
    section.appendChild(collageGap)

    // Asymmetric collage (fixed-position within fixed frame)
    const collageH = 820
    const collage = fixedFrame('Process / Image Collage [TODO: real photos]', contentW, collageH)

    const imgs = [
      { w: Math.round(contentW * 0.50), h: 480, x: 0,                           y: 0,        shade: 0.83, label: 'Process Image 1 [TODO]' },
      { w: Math.round(contentW * 0.35), h: 340, x: Math.round(contentW * 0.55), y: 0,        shade: 0.79, label: 'Process Image 2 [TODO]' },
      { w: Math.round(contentW * 0.28), h: 280, x: S.xl2,                       y: 480 + S.md, shade: 0.76, label: 'Process Image 3 [TODO]' },
      { w: Math.round(contentW * 0.42), h: 360, x: Math.round(contentW * 0.30), y: 480 - S.xl, shade: 0.72, label: 'Process Image 4 [TODO]' },
    ]
    imgs.forEach(img => {
      const r2 = rect(img.label, img.w, img.h, img.shade)
      r2.x = img.x
      r2.y = img.y
      collage.appendChild(r2)
    })

    const sentence = await txt(
      'The work is the relationship.',
      'subheading', 'secondary',
      { italic: true, width: Math.round(contentW * 0.4), name: 'Overlapping sentence' }
    )
    sentence.x = Math.round(contentW * 0.52)
    sentence.y = 660
    collage.appendChild(sentence)
    section.appendChild(collage)

    return section
  }

  // ── 08  CLIENTS ───────────────────────────────────────────
  async function buildClients() {
    const section = vFrame('In Collaboration With', W, 0)
    section.fills = solid(C.bg)
    section.paddingTop = S.xl4
    section.paddingBottom = 0

    const inner = hFrame('Clients / Row', W, S.xl3)
    inner.counterAxisAlignItems = 'MIN'
    inner.paddingLeft = S.margin
    inner.paddingRight = S.margin
    inner.resize(W, inner.height)
    inner.primaryAxisSizingMode = 'FIXED'

    const leftW = Math.round(W * 0.35)
    const left = vFrame('Clients / Heading', leftW, S.sm)
    const cLabel = await txt('CONTEXT', 'micro', 'tertiary', { uppercase: true })
    const cTitle = await txt('In Collaboration\nWith —', 'displayLg', 'primary', { width: leftW })
    left.appendChild(cLabel)
    left.appendChild(cTitle)

    const riverW = W - leftW - S.margin * 2 - S.xl3
    const river = hFrame('Clients / Name River [TODO: real names]', riverW, 0)
    river.layoutWrap = 'WRAP'
    river.counterAxisAlignItems = 'MIN'
    river.resize(riverW, river.height)
    river.primaryAxisSizingMode = 'FIXED'

    const clients = [
      ['Vogue',                  'displayMd', false, false],
      ["Harper's Bazaar",        'heading',   true,  true ],
      ['Independent Editorial',  'subheading',false, false],
      ['Film Production',        'displayMd', true,  true ],
      ['Fashion Week',           'heading',   false, false],
      ['International Campaign', 'subheading',true,  true ],
      ['Museum Exhibition',      'displayMd', false, true ],
      ['Private Commission',     'heading',   true,  false],
      ['Music Video',            'subheading',false, true ],
      ['Luxury Brand',           'displayMd', true,  false],
    ]
    for (const [name, tok, isItalic, isMuted] of clients) {
      const t = await txt(name, tok, isMuted ? 'tertiary' : 'primary', {
        italic: isItalic, name: `Client / ${name}`,
      })
      river.appendChild(t)
    }

    inner.appendChild(left)
    inner.appendChild(river)
    section.appendChild(inner)

    const dividerGap = figma.createFrame()
    dividerGap.name = 'Spacing / xl4'
    dividerGap.resize(W, S.xl4)
    dividerGap.fills = []
    section.appendChild(dividerGap)

    const divider = rule('Divider / Full width', W)
    section.appendChild(divider)

    return section
  }

  // ── 09  TESTIMONIAL ───────────────────────────────────────
  async function buildTestimonial() {
    const section = vFrame('Testimonial', W, 0)
    section.fills = solid(C.bg)
    section.paddingTop = S.xl5
    section.paddingBottom = S.xl5
    section.paddingLeft = Math.round(W * 0.15)
    section.paddingRight = S.margin

    const innerW = Math.round(W * 0.55)
    const inner = vFrame('Testimonial / Inner', innerW, S.xl)

    const tLabel = await txt('CLIENT VOICE', 'micro', 'accent', { uppercase: true })

    const quote = vFrame('Blockquote [TODO: real testimonial]', innerW, 0)
    const lines = [
      'Working with Plavovlasa changed how I understand',
      'my own face. She listens before she touches anything.',
      'The result was exactly who I wanted to be.',
    ]
    for (const line of lines) {
      const l = await txt(line, 'displayLg', 'primary', {
        italic: true, width: innerW,
      })
      quote.appendChild(l)
    }

    const attribution = vFrame('Attribution [TODO: real name]', innerW, S.sm)
    const attrRule = rule('Rule / 24px', 24)
    const attrName = await txt('CLIENT NAME, ROLE', 'micro', 'secondary', {
      uppercase: true, name: 'Attribution name',
    })
    attribution.appendChild(attrRule)
    attribution.appendChild(attrName)

    inner.appendChild(tLabel)
    inner.appendChild(quote)
    inner.appendChild(attribution)
    section.appendChild(inner)
    return section
  }

  // ── 10  CONTACT ───────────────────────────────────────────
  async function buildContact() {
    const section = vFrame('Contact', W, 0)
    section.fills = solid(C.bg)
    section.paddingTop = S.xl5
    section.paddingBottom = S.xl4
    section.paddingLeft = Math.round(W * 0.12)
    section.paddingRight = S.margin

    const contentW = W - Math.round(W * 0.12) - S.margin

    const cLabel = await txt('CONTACT', 'micro', 'tertiary', { uppercase: true })

    const labelGap = figma.createFrame()
    labelGap.name = 'Spacing / md'
    labelGap.resize(contentW, S.md)
    labelGap.fills = []

    const headline = vFrame('Headline / Available for...', contentW, 0)
    const hl1 = await txt('Available for the', 'displayXl', 'primary', { width: contentW })
    const hl2 = await txt('right work.', 'displayXl', 'primary', { italic: true, width: contentW })
    headline.appendChild(hl1)
    headline.appendChild(hl2)

    const hlGap = figma.createFrame()
    hlGap.name = 'Spacing / xl'
    hlGap.resize(contentW, S.xl)
    hlGap.fills = []

    const bodyTxt = await txt(
      'Select clients, editorial commissions, and film production.',
      'body', 'secondary', { width: 400 }
    )

    const linksGap = figma.createFrame()
    linksGap.name = 'Spacing / xl2'
    linksGap.resize(contentW, S.xl2)
    linksGap.fills = []

    const links = vFrame('Contact / Links', 500, S.md)
    const emailLink = await txt('hello@plavovlasa.com →', 'displayMd', 'primary', {
      italic: true, name: 'Email [TODO: real email]',
    })
    const igLink = await txt('@plavovlasa.makeup', 'micro', 'tertiary', {
      uppercase: true, name: 'Instagram link',
    })
    links.appendChild(emailLink)
    links.appendChild(igLink)

    const formGap = figma.createFrame()
    formGap.name = 'Spacing / xl2'
    formGap.resize(contentW, S.xl2)
    formGap.fills = []

    // Form
    const formW = 440
    const form = vFrame('Contact / Form', formW, S.lg)

    const nameField = vFrame('Field / Your name', formW, S.sm)
    const namePlaceholder = await txt('Your name', 'body', 'tertiary', {
      italic: true, name: 'Placeholder / name',
    })
    const nameBorder = rule('Border bottom', formW)
    nameField.appendChild(namePlaceholder)
    nameField.appendChild(nameBorder)

    const msgField = vFrame('Field / Your message', formW, 0)
    const msgPlaceholder = await txt('Your message', 'body', 'tertiary', {
      name: 'Placeholder / message',
    })
    const msgArea = figma.createFrame()
    msgArea.name = 'Textarea height (4 rows)'
    msgArea.resize(formW, 80)
    msgArea.fills = []
    const msgBorder = rule('Border bottom', formW)
    msgField.appendChild(msgPlaceholder)
    msgField.appendChild(msgArea)
    msgField.appendChild(msgBorder)

    const submitRow = hFrame('Submit Row', formW, 0)
    submitRow.primaryAxisAlignItems = 'MAX'
    submitRow.resize(formW, submitRow.height)
    submitRow.primaryAxisSizingMode = 'FIXED'
    const submitBtn = await txt('SEND —', 'micro', 'secondary', {
      uppercase: true, name: 'Submit button',
    })
    submitRow.appendChild(submitBtn)

    form.appendChild(nameField)
    form.appendChild(msgField)
    form.appendChild(submitRow)

    section.appendChild(cLabel)
    section.appendChild(labelGap)
    section.appendChild(headline)
    section.appendChild(hlGap)
    section.appendChild(bodyTxt)
    section.appendChild(linksGap)
    section.appendChild(links)
    section.appendChild(formGap)
    section.appendChild(form)
    return section
  }

  // ── 11  FOOTER ────────────────────────────────────────────
  async function buildFooter() {
    const footer = hFrame('Footer', W, 0)
    footer.fills = solid(C.bg)
    footer.primaryAxisAlignItems = 'CENTER'
    footer.counterAxisAlignItems = 'CENTER'
    footer.paddingLeft = S.margin
    footer.paddingRight = S.margin
    footer.paddingTop = S.xl
    footer.paddingBottom = S.xl
    footer.resize(W, footer.height)
    footer.primaryAxisSizingMode = 'FIXED'

    // Top border (stroke on top)
    footer.strokes = [{ type: 'SOLID', color: C.border, opacity: 0.12 }]
    footer.strokeWeight = 1
    footer.strokeAlign = 'INSIDE'
    footer.individualStrokeWeights = { top: 1, bottom: 0, left: 0, right: 0 }

    const copyright = await txt('© 2024 PLAVOVLASA', 'micro', 'tertiary', {
      uppercase: true, name: 'Copyright',
    })
    const sp1 = flexSpacer('Spacer')
    const intention = await txt('Made with intention.', 'caption', 'tertiary', {
      italic: true, name: 'Tagline',
    })
    // Override family for italic serif
    intention.fontName = { family: 'Cormorant', style: 'Italic' }
    const sp2 = flexSpacer('Spacer')
    const backTop = await txt('BACK TO TOP ↑', 'micro', 'tertiary', {
      uppercase: true, name: 'Back to top',
    })

    footer.appendChild(copyright)
    footer.appendChild(sp1)
    footer.appendChild(intention)
    footer.appendChild(sp2)
    footer.appendChild(backTop)
    return footer
  }

  // ─────────────────────────────────────────────────────────
  // ASSEMBLE PAGE
  // ─────────────────────────────────────────────────────────

  const page = vFrame('Plavovlasa.makeup — Desktop 1440', W, 0)
  page.fills = solid(C.bg)
  page.itemSpacing = 0
  page.clipsContent = false

  page.appendChild(await buildNav())
  page.appendChild(await buildHero())
  page.appendChild(await buildManifesto())
  page.appendChild(await buildWork())
  page.appendChild(await buildInterlude())
  page.appendChild(await buildPractice())
  page.appendChild(await buildProcess())
  page.appendChild(await buildClients())
  page.appendChild(await buildTestimonial())
  page.appendChild(await buildContact())
  page.appendChild(await buildFooter())

  figma.currentPage.appendChild(page)
  figma.viewport.scrollAndZoomIntoView([page])
  figma.closePlugin('✓ Plavovlasa.makeup — all 11 sections created')

})()
