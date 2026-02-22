/* eslint-disable no-restricted-globals */

class Vector2D {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Vector3D {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
}

function mulberry32(seed) {
  let t = seed >>> 0
  return function rand() {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

class AnimationController {
  constructor(ctx, opts) {
    this.ctx = ctx
    this.dpr = opts.dpr
    this.width = opts.width
    this.height = opts.height

    this.time = 0
    this.motionTime = 0
    this.lastNow = performance.now()

    this.isIdle = false
    this.idleTransitionMs = 1000
    this.idleStartNow = 0
    this.idleStartMotionTime = 0

    // Constants (must match main-thread implementation)
    this.changeEventTime = 0.32
    this.cameraZ = -400
    this.cameraTravelDistance = 3400
    this.startDotYOffset = 28
    this.viewZoom = 100
    this.numberOfStars = 5000
    this.trailLength = 80

    // One-shot end time, then float forever
    this.endTime = 0.6

    this.rand = mulberry32(1234)
    this.stars = []
    this.createStars()

    this.idleTimer = 0
    this.isPaused = false
  }

  resize({ dpr, width, height }) {
    this.dpr = dpr
    this.width = width
    this.height = height
  }

  destroy() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
      this.idleTimer = 0
    }
  }

  enterIdle() {
    this.time = this.endTime
    this.isIdle = true
    this.idleStartNow = performance.now()
    this.idleStartMotionTime = this.motionTime
    this.render()
    this.startIdleLoop()
  }

  startIdleLoop() {
    if (this.idleTimer || this.isPaused) return
    const tick = () => {
      this.idleTimer = 0
      if (this.isPaused) return
      this.render()
      this.startIdleLoop()
    }
    // Use a timeout loop to avoid monopolizing CPU.
    this.idleTimer = setTimeout(tick, 16)
  }

  pause() {
    this.isPaused = true
    if (this.idleTimer) {
      clearTimeout(this.idleTimer)
      this.idleTimer = 0
    }
  }

  resume() {
    if (!this.isPaused) return
    this.isPaused = false
    this.lastNow = performance.now()
    if (this.isIdle) this.startIdleLoop()
  }

  ease(p, g) {
    if (p < 0.5) return 0.5 * Math.pow(2 * p, g)
    return 1 - 0.5 * Math.pow(2 * (1 - p), g)
  }

  easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 4.5
    if (x <= 0) return 0
    if (x >= 1) return 1
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1
  }

  map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
  }

  constrain(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t
  }

  spiralPath(p) {
    p = this.constrain(1.2 * p, 0, 1)
    p = this.ease(p, 1.8)
    const numberOfSpiralTurns = 6
    const theta = 2 * Math.PI * numberOfSpiralTurns * Math.sqrt(p)
    const r = 170 * Math.sqrt(p)

    return new Vector2D(r * Math.cos(theta), r * Math.sin(theta) + this.startDotYOffset)
  }

  rotate(v1, v2, p, orientation) {
    const middle = new Vector2D((v1.x + v2.x) / 2, (v1.y + v2.y) / 2)

    const dx = v1.x - middle.x
    const dy = v1.y - middle.y
    const angle = Math.atan2(dy, dx)
    const o = orientation ? -1 : 1
    const r = Math.sqrt(dx * dx + dy * dy)

    const bounce = Math.sin(p * Math.PI) * 0.05 * (1 - p)

    return new Vector2D(
      middle.x + r * (1 + bounce) * Math.cos(angle + o * Math.PI * this.easeOutElastic(p)),
      middle.y + r * (1 + bounce) * Math.sin(angle + o * Math.PI * this.easeOutElastic(p))
    )
  }

  showProjectedDot(position, sizeFactor, fillStyle = 'white') {
    const ctx = this.ctx

    const displayTime = Math.min(this.time, this.endTime)
    const t2 = this.constrain(this.map(displayTime, this.changeEventTime, 1, 0, 1), 0, 1)
    const newCameraZ = this.cameraZ + this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance

    if (position.z > newCameraZ) {
      const dotDepthFromCamera = position.z - newCameraZ

      const x = this.viewZoom * position.x / dotDepthFromCamera
      const y = this.viewZoom * position.y / dotDepthFromCamera
      const sw = 400 * sizeFactor / dotDepthFromCamera

      ctx.fillStyle = fillStyle
      ctx.lineWidth = sw
      ctx.beginPath()
      ctx.arc(x, y, 0.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  drawStartDot() {
    const displayTime = Math.min(this.time, this.endTime)
    if (displayTime > this.changeEventTime) {
      const dy = this.cameraZ * this.startDotYOffset / this.viewZoom
      const position = new Vector3D(0, dy, this.cameraTravelDistance)
      this.showProjectedDot(position, 2.5)
    }
  }

  drawTrail(t1) {
    const ctx = this.ctx

    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1)
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f

      ctx.fillStyle = 'white'
      ctx.lineWidth = sw

      const pathTime = t1 - 0.00015 * i
      const position = this.spiralPath(pathTime)

      const basePos = position
      const offset = new Vector2D(position.x + 5, position.y + 5)

      const wobble = Math.sin(this.motionTime * Math.PI * 2) * 0.5 + 0.5

      const rotated = this.rotate(basePos, offset, wobble, i % 2 === 0)

      ctx.beginPath()
      ctx.arc(rotated.x, rotated.y, sw / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  render() {
    const ctx = this.ctx
    if (!ctx) return

    const now = performance.now()
    const dt = this.lastNow ? Math.min(Math.max((now - this.lastNow) / 1000, 0), 0.05) : 0.016
    this.lastNow = now
    this.motionTime += dt

    const idleBlend = this.isIdle ? this.constrain((now - (this.idleStartNow || now)) / this.idleTransitionMs, 0, 1) : 0

    const w = this.width
    const h = this.height

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, w, h)

    ctx.save()
    ctx.translate(w / 2, h / 2)

    const displayTime = Math.min(this.time, this.endTime)

    const t1 = this.constrain(this.map(displayTime, 0, this.changeEventTime + 0.25, 0, 1), 0, 1)
    const t2 = this.constrain(this.map(displayTime, this.changeEventTime, 1, 0, 1), 0, 1)

    const baseRotation = -Math.PI * this.ease(t2, 2.7)
    const driftTime = this.isIdle ? Math.max(0, this.motionTime - this.idleStartMotionTime) : 0
    const idleDrift = driftTime * 0.03
    ctx.rotate(baseRotation + idleBlend * idleDrift)

    if (idleBlend < 1) {
      ctx.save()
      ctx.globalAlpha = 1 - idleBlend
      this.drawTrail(t1)
      ctx.restore()
    }

    for (const star of this.stars) {
      star.render(t1, this)
    }

    if (idleBlend < 1) {
      ctx.save()
      ctx.globalAlpha = 1 - idleBlend
      this.drawStartDot()
      ctx.restore()
    }

    ctx.restore()
  }

  createStars() {
    this.stars = []
    for (let i = 0; i < this.numberOfStars; i++) {
      this.stars.push(new Star(this.rand, this.cameraZ, this.cameraTravelDistance))
    }
  }
}

class Star {
  constructor(rand, cameraZ, cameraTravelDistance) {
    this.rand = rand

    this.angle = rand() * Math.PI * 2
    this.distance = 30 * rand() + 15
    this.rotationDirection = rand() > 0.5 ? 1 : -1
    this.expansionRate = 1.2 + rand() * 0.8
    this.finalScale = 0.7 + rand() * 0.6

    this.dx = this.distance * Math.cos(this.angle)
    this.dy = this.distance * Math.sin(this.angle)

    this.spiralLocation = (1 - Math.pow(1 - rand(), 3.0)) / 1.3
    this.z = (cameraTravelDistance + cameraZ - 0.5 * cameraZ) * rand() + 0.5 * cameraZ

    this.z = this.lerp(this.z, cameraTravelDistance / 2, 0.3 * this.spiralLocation)
    this.strokeWeightFactor = Math.pow(rand(), 2.0)
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t
  }

  render(p, controller) {
    const spiralPos = controller.spiralPath(this.spiralLocation)
    const q = p - this.spiralLocation

    if (q <= 0) return

    const displacementProgress = controller.constrain(4 * q, 0, 1)

    const linearEasing = displacementProgress
    const elasticEasing = controller.easeOutElastic(displacementProgress)
    const powerEasing = Math.pow(displacementProgress, 2)

    let easing
    if (displacementProgress < 0.3) {
      easing = controller.lerp(linearEasing, powerEasing, displacementProgress / 0.3)
    } else if (displacementProgress < 0.7) {
      const t = (displacementProgress - 0.3) / 0.4
      easing = controller.lerp(powerEasing, elasticEasing, t)
    } else {
      easing = elasticEasing
    }

    let screenX
    let screenY

    if (displacementProgress < 0.3) {
      screenX = controller.lerp(spiralPos.x, spiralPos.x + this.dx * 0.3, easing / 0.3)
      screenY = controller.lerp(spiralPos.y, spiralPos.y + this.dy * 0.3, easing / 0.3)
    } else if (displacementProgress < 0.7) {
      const midProgress = (displacementProgress - 0.3) / 0.4
      const curveStrength = Math.sin(midProgress * Math.PI) * this.rotationDirection * 1.5

      const baseX = spiralPos.x + this.dx * 0.3
      const baseY = spiralPos.y + this.dy * 0.3

      const targetX = spiralPos.x + this.dx * 0.7
      const targetY = spiralPos.y + this.dy * 0.7

      const perpX = -this.dy * 0.4 * curveStrength
      const perpY = this.dx * 0.4 * curveStrength

      screenX = controller.lerp(baseX, targetX, midProgress) + perpX * midProgress
      screenY = controller.lerp(baseY, targetY, midProgress) + perpY * midProgress
    } else {
      const finalProgress = (displacementProgress - 0.7) / 0.3

      const baseX = spiralPos.x + this.dx * 0.7
      const baseY = spiralPos.y + this.dy * 0.7

      const targetDistance = this.distance * this.expansionRate * 1.5
      const spiralTurns = 1.2 * this.rotationDirection
      const spiralAngle = this.angle + spiralTurns * finalProgress * Math.PI

      const targetX = spiralPos.x + targetDistance * Math.cos(spiralAngle)
      const targetY = spiralPos.y + targetDistance * Math.sin(spiralAngle)

      screenX = controller.lerp(baseX, targetX, finalProgress)
      screenY = controller.lerp(baseY, targetY, finalProgress)
    }

    const vx = (this.z - controller.cameraZ) * screenX / controller.viewZoom
    const vy = (this.z - controller.cameraZ) * screenY / controller.viewZoom

    const position = new Vector3D(vx, vy, this.z)

    let sizeMultiplier = 1.0
    if (displacementProgress < 0.6) {
      sizeMultiplier = 1.0 + displacementProgress * 0.2
    } else {
      const t = (displacementProgress - 0.6) / 0.4
      sizeMultiplier = 1.2 * (1.0 - t) + this.finalScale * t
    }

    const dotSize = 8.5 * this.strokeWeightFactor * sizeMultiplier

    controller.showProjectedDot(position, dotSize)
  }
}

let canvas = null
let ctx = null
let controller = null

function setCanvasSize(dpr, width, height) {
  if (!canvas || !ctx) return
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

self.onmessage = (event) => {
  const msg = event.data
  if (!msg || !msg.type) return

  switch (msg.type) {
    case 'init': {
      canvas = msg.canvas
      const dpr = msg.dpr
      const width = msg.width
      const height = msg.height
      ctx = canvas.getContext('2d')
      setCanvasSize(dpr, width, height)
      controller = new AnimationController(ctx, { dpr, width, height })
      controller.render()
      self.postMessage({ type: 'ready' })
      break
    }

    case 'resize': {
      if (!controller) break
      controller.resize({ dpr: msg.dpr, width: msg.width, height: msg.height })
      setCanvasSize(msg.dpr, msg.width, msg.height)
      controller.render()
      break
    }

    case 'setTime': {
      if (!controller || controller.isPaused) break
      controller.time = msg.time
      controller.render()
      break
    }

    case 'complete': {
      if (!controller) break
      controller.enterIdle()
      break
    }

    case 'pause': {
      if (!controller) break
      controller.pause()
      break
    }

    case 'resume': {
      if (!controller) break
      controller.resume()
      break
    }

    case 'destroy': {
      if (controller) controller.destroy()
      controller = null
      canvas = null
      ctx = null
      break
    }

    default:
      break
  }
}
