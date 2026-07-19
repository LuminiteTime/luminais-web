import * as THREE from 'three'
import { palette } from '../../scene/palette'

const CANVAS_SCALE = 2 // supersample for crisp close-ups

function createCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width * CANVAS_SCALE
  canvas.height = height * CANVAS_SCALE
  const ctx = canvas.getContext('2d')
  ctx.scale(CANVAS_SCALE, CANVAS_SCALE)
  return [canvas, ctx]
}

function toTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

// --- Laptop screen: a dark terminal with green code -------------------------

const CODE_LINES = [
  '$ ./gradlew bootRun',
  '  Starting LuminaisApplication v3.2.1',
  '  BeanDefinitionRegistry: 214 beans',
  '  HikariPool-1 - Start completed.',
  '  gRPC server listening on :9090',
  '  Kafka consumer group [core-ledger] rebalanced',
  '  >>> Application ready in 4.092s',
  '$ git log --oneline -3',
  '  9f31ac2 feat: idempotent payment consumer',
  '  41bd077 fix: race in outbox relay',
  '  c02e9aa test: testcontainers for ledger-api',
  '$ █',
]

const SCREEN = { width: 512, height: 320, lineHeight: 22, pad: 22 }

export function makeScreenTexture() {
  const [canvas, ctx] = createCanvas(SCREEN.width, SCREEN.height)

  ctx.fillStyle = '#050a08'
  ctx.fillRect(0, 0, SCREEN.width, SCREEN.height)

  const glow = ctx.createRadialGradient(256, 140, 20, 256, 140, 340)
  glow.addColorStop(0, 'rgba(61, 220, 151, 0.16)')
  glow.addColorStop(1, 'rgba(61, 220, 151, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, SCREEN.width, SCREEN.height)

  ctx.font = '13px "IBM Plex Mono", monospace'
  ctx.textBaseline = 'top'
  CODE_LINES.forEach((line, i) => {
    const isPrompt = line.startsWith('$')
    ctx.fillStyle = isPrompt ? palette.accentGlow : 'rgba(125, 255, 206, 0.66)'
    ctx.fillText(line, SCREEN.pad, SCREEN.pad + i * SCREEN.lineHeight)
  })

  return toTexture(canvas)
}

// --- Sticky note ------------------------------------------------------------

const NOTE = { size: 256, pad: 26, tapeHeight: 30 }

export function makeNoteTexture({ title, detail, color }) {
  const [canvas, ctx] = createCanvas(NOTE.size, NOTE.size)

  ctx.fillStyle = color
  ctx.fillRect(0, 0, NOTE.size, NOTE.size)

  // Soft paper shading + a strip of tape on top.
  const shade = ctx.createLinearGradient(0, 0, 0, NOTE.size)
  shade.addColorStop(0, 'rgba(255,255,255,0.18)')
  shade.addColorStop(1, 'rgba(0,0,0,0.14)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, NOTE.size, NOTE.size)
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.fillRect(NOTE.size / 2 - 44, -6, 88, NOTE.tapeHeight)

  ctx.fillStyle = '#1c2620'
  ctx.textBaseline = 'top'
  ctx.font = '700 25px "Space Grotesk", sans-serif'
  wrapText(ctx, title, NOTE.pad, 46, NOTE.size - NOTE.pad * 2, 29)

  ctx.font = '400 17px "Space Grotesk", sans-serif'
  ctx.globalAlpha = 0.82
  wrapText(ctx, detail, NOTE.pad, 118, NOTE.size - NOTE.pad * 2, 23)
  ctx.globalAlpha = 1

  return toTexture(canvas)
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let cursorY = y
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY)
      line = word
      cursorY += lineHeight
    } else {
      line = candidate
    }
  }
  ctx.fillText(line, x, cursorY)
}

// --- Night city outside the window ------------------------------------------

const CITY = { width: 512, height: 512, buildings: 26, seed: 42 }

export function makeCityTexture() {
  const [canvas, ctx] = createCanvas(CITY.width, CITY.height)
  const rand = mulberry32(CITY.seed)

  const sky = ctx.createLinearGradient(0, 0, 0, CITY.height)
  sky.addColorStop(0, '#060b14')
  sky.addColorStop(0.55, '#0b1a22')
  sky.addColorStop(1, '#0a0f0d')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, CITY.width, CITY.height)

  // Moon + halo.
  ctx.fillStyle = '#e8f4ec'
  ctx.beginPath()
  ctx.arc(392, 96, 26, 0, Math.PI * 2)
  ctx.fill()
  const halo = ctx.createRadialGradient(392, 96, 26, 392, 96, 130)
  halo.addColorStop(0, 'rgba(190, 230, 210, 0.25)')
  halo.addColorStop(1, 'rgba(190, 230, 210, 0)')
  ctx.fillStyle = halo
  ctx.fillRect(0, 0, CITY.width, CITY.height)

  // Building silhouettes with lit windows.
  let x = 0
  while (x < CITY.width) {
    const w = 26 + rand() * 46
    const h = 130 + rand() * 240
    const top = CITY.height - h
    ctx.fillStyle = '#0d1518'
    ctx.fillRect(x, top, w, h)
    for (let wy = top + 12; wy < CITY.height - 14; wy += 18) {
      for (let wx = x + 6; wx < x + w - 8; wx += 14) {
        if (rand() > 0.72) {
          ctx.fillStyle = rand() > 0.5 ? 'rgba(255, 191, 105, 0.85)' : 'rgba(125, 255, 206, 0.7)'
          ctx.fillRect(wx, wy, 5, 7)
        }
      }
    }
    x += w + 4
  }

  return toTexture(canvas)
}

function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
