import { watch, statSync } from 'fs'
import { execSync } from 'child_process'
import { join, extname, basename } from 'path'

const PORTFOLIO_DIR = 'public/images/portfolio'
const THRESHOLD_KB  = 500

const isImage = (f) => ['.jpg', '.jpeg'].includes(extname(f).toLowerCase())

const compress = (filepath) => {
  try {
    const sizeBefore = statSync(filepath).size
    if (sizeBefore < THRESHOLD_KB * 1024) return // already small enough
    const kb = Math.round(sizeBefore / 1024)
    console.log(`\n📸 [auto-compress] ${basename(filepath)} (${kb} KB) — komprimujem...`)
    execSync(`sips -Z 1400 -s format jpeg -s formatOptions 78 "${filepath}" --out "${filepath}"`, { stdio: 'ignore' })
    const sizeAfter = Math.round(statSync(filepath).size / 1024)
    console.log(`✅ [auto-compress] Hotovo: ${kb} KB → ${sizeAfter} KB`)
  } catch (e) {
    console.error(`[auto-compress] Chyba: ${e.message}`)
  }
}

console.log(`\n👁  [auto-compress] Sledujem ${PORTFOLIO_DIR}/ — nové fotky sa skomprimujú automaticky\n`)

watch(PORTFOLIO_DIR, { persistent: true }, (event, filename) => {
  if (!filename || !isImage(filename)) return
  const filepath = join(PORTFOLIO_DIR, filename)
  // small delay to let the file finish writing before we read it
  setTimeout(() => {
    try {
      statSync(filepath)
      compress(filepath)
    } catch {
      // file doesn't exist (deleted) — ignore
    }
  }, 800)
})
