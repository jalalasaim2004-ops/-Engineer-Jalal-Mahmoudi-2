import { useEffect, useRef } from 'react'

// Particle in the flowing field
interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  size: number; color: string
  trail: { x: number; y: number }[]
}

// Node in the neural graph
interface Node {
  x: number; y: number
  vx: number; vy: number
  r: number; color: string
  phase: number; speed: number
}

// Pulse traveling on an edge
interface Pulse {
  from: number; to: number
  t: number; speed: number; color: string
}

const C1 = '#00d4ff'   // cyan
const C2 = '#7928ca'   // purple
const C3 = '#00ff9f'   // green
const C4 = '#ff6b35'   // orange

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function ok(...ns: number[]) { return ns.every(n => Number.isFinite(n)) }

export default function AIBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0, W = 0, H = 0, t = 0

    // ── State ─────────────────────────────────────────────────────────────────
    const nodes: Node[] = []
    const edges: [number, number][] = []
    const pulses: Pulse[] = []
    const particles: Particle[] = []

    // ── Noise-like flow field via overlapping sine waves ──────────────────────
    function flowAngle(x: number, y: number, time: number) {
      return (
        Math.sin(x * 0.006 + time * 0.4) * Math.PI +
        Math.cos(y * 0.008 - time * 0.3) * Math.PI * 0.5 +
        Math.sin((x + y) * 0.004 + time * 0.2) * Math.PI * 0.3
      )
    }

    // ── Build neural graph ────────────────────────────────────────────────────
    function buildGraph() {
      nodes.length = 0; edges.length = 0; pulses.length = 0

      const count = clamp(Math.floor(W * H / 22000), 18, 42)
      const colors = [C1, C1, C1, C2, C2, C3, C4]
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
          r: 2.5 + Math.random() * 2,
          color: colors[i % colors.length],
          phase: Math.random() * Math.PI * 2,
          speed: .006 + Math.random() * .008,
        })
      }

      // Connect pairs within range, max 3 edges per node
      const degree = new Array(count).fill(0)
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          if (degree[i] >= 3 || degree[j] >= 3) continue
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          if (Math.hypot(dx, dy) < Math.min(W, H) * 0.32) {
            edges.push([i, j])
            degree[i]++; degree[j]++
          }
        }
      }
    }

    // ── Spawn flow particle ───────────────────────────────────────────────────
    function spawnParticle() {
      if (particles.length >= 90 || !ok(W, H)) return
      const edge = Math.random()
      let x = 0, y = 0
      if (edge < .25)      { x = Math.random() * W; y = 0 }
      else if (edge < .5)  { x = Math.random() * W; y = H }
      else if (edge < .75) { x = 0;                 y = Math.random() * H }
      else                 { x = W;                 y = Math.random() * H }
      const maxLife = 200 + Math.random() * 300
      const hues = [C1, C1, C2, C3, C4]
      particles.push({ x, y, vx: 0, vy: 0, life: 0, maxLife, size: .8 + Math.random() * 1.4,
                       color: hues[Math.floor(Math.random() * hues.length)], trail: [] })
    }

    // ── Resize ────────────────────────────────────────────────────────────────
    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
      buildGraph()
    }

    // ── Draw ──────────────────────────────────────────────────────────────────
    function draw() {
      raf = requestAnimationFrame(draw)
      if (!ok(W, H) || W < 1 || H < 1) return
      t += .016

      // Fade trail
      ctx.fillStyle = 'rgba(4,5,15,0.18)'
      ctx.fillRect(0, 0, W, H)

      // ── 1. Flow field particles ─────────────────────────────────────────────
      if (Math.random() < .4) spawnParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        if (!ok(p.x, p.y)) { particles.splice(i, 1); continue }
        p.life++
        if (p.life > p.maxLife || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          particles.splice(i, 1); continue
        }
        const angle = flowAngle(p.x, p.y, t)
        p.vx = lerp(p.vx, Math.cos(angle) * 1.2, .08)
        p.vy = lerp(p.vy, Math.sin(angle) * 1.2, .08)
        p.x += p.vx; p.y += p.vy

        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > 22) p.trail.shift()

        const progress = p.life / p.maxLife
        const alpha = progress < .15 ? progress / .15 : progress > .75 ? 1 - (progress - .75) / .25 : 1

        if (p.trail.length > 2) {
          ctx.beginPath()
          ctx.moveTo(p.trail[0].x, p.trail[0].y)
          for (let k = 1; k < p.trail.length; k++) {
            const tr = p.trail[k]
            if (!ok(tr.x, tr.y)) continue
            ctx.lineTo(tr.x, tr.y)
          }
          ctx.strokeStyle = p.color + Math.round(alpha * 80).toString(16).padStart(2, '0')
          ctx.lineWidth = p.size
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.round(alpha * 180).toString(16).padStart(2, '0')
        ctx.fill()
      }

      // ── 2. Neural graph edges ───────────────────────────────────────────────
      for (const [a, b] of edges) {
        const A = nodes[a], B = nodes[b]
        if (!ok(A.x, A.y, B.x, B.y)) continue
        const dist = Math.hypot(B.x - A.x, B.y - A.y)
        const maxDist = Math.min(W, H) * 0.32
        const alpha = clamp(1 - dist / maxDist, 0, 1) * 0.18
        ctx.beginPath()
        ctx.moveTo(A.x, A.y)
        ctx.lineTo(B.x, B.y)
        ctx.strokeStyle = C1 + Math.round(alpha * 255).toString(16).padStart(2, '0')
        ctx.lineWidth = .5
        ctx.stroke()
      }

      // ── 3. Pulses along edges ───────────────────────────────────────────────
      if (Math.random() < .04 && edges.length > 0) {
        const [a, b] = edges[Math.floor(Math.random() * edges.length)]
        const colors = [C1, C2, C3]
        pulses.push({ from: a, to: b, t: 0, speed: .008 + Math.random() * .012,
                      color: colors[Math.floor(Math.random() * colors.length)] })
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.t += p.speed
        if (p.t > 1) { pulses.splice(i, 1); continue }
        const A = nodes[p.from], B = nodes[p.to]
        if (!ok(A.x, A.y, B.x, B.y)) { pulses.splice(i, 1); continue }
        const px = A.x + (B.x - A.x) * p.t
        const py = A.y + (B.y - A.y) * p.t
        if (!ok(px, py)) continue
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 8)
        grd.addColorStop(0, p.color + 'ee')
        grd.addColorStop(1, p.color + '00')
        ctx.beginPath()
        ctx.arc(px, py, 8, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      }

      // ── 4. Neural nodes ─────────────────────────────────────────────────────
      for (const n of nodes) {
        n.phase += n.speed
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
        if (!ok(n.x, n.y)) continue

        const pulse = .5 + .5 * Math.sin(n.phase)
        const glowR = n.r * (5 + pulse * 3)

        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
        grd.addColorStop(0, n.color + Math.round(pulse * 90).toString(16).padStart(2, '0'))
        grd.addColorStop(1, n.color + '00')
        ctx.beginPath()
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.fill()
      }

      // ── 5. Central AI orb ───────────────────────────────────────────────────
      const ox = W / 2, oy = H * .45
      if (!ok(ox, oy)) return
      const breathe = 1 + .08 * Math.sin(t * 1.2)
      const orbR = 24 * breathe

      // Outer corona rings
      for (let ring = 0; ring < 4; ring++) {
        const rr = orbR * (2.2 + ring * 1.1)
        const alpha = (.18 - ring * .04) * (.7 + .3 * Math.sin(t * .8 + ring))
        ctx.beginPath()
        ctx.arc(ox, oy, rr, 0, Math.PI * 2)
        ctx.strokeStyle = C1 + Math.round(alpha * 255).toString(16).padStart(2, '0')
        ctx.lineWidth = .5
        ctx.stroke()
      }

      // Deep glow
      const deep = ctx.createRadialGradient(ox, oy, 0, ox, oy, orbR * 5)
      deep.addColorStop(0,   C2 + 'aa')
      deep.addColorStop(.35, C1 + '55')
      deep.addColorStop(1,   C1 + '00')
      ctx.beginPath()
      ctx.arc(ox, oy, orbR * 5, 0, Math.PI * 2)
      ctx.fillStyle = deep
      ctx.fill()

      // Orbiting ellipses
      const orbitColors = [C2, C1, C3]
      for (let o = 0; o < 3; o++) {
        const angle = t * (.6 + o * .3) + (o * Math.PI * 2) / 3
        const rx = orbR * (2.6 + o * .7)
        const ry = orbR * (.7 + o * .25)
        ctx.beginPath()
        ctx.ellipse(ox, oy, rx, ry, angle, 0, Math.PI * 2)
        ctx.strokeStyle = orbitColors[o] + '55'
        ctx.lineWidth = .8
        ctx.stroke()

        // Orbiting dot on each ellipse
        const dotX = ox + rx * Math.cos(angle)
        const dotY = oy + ry * Math.sin(angle)
        if (!ok(dotX, dotY)) continue
        const dg = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 5)
        dg.addColorStop(0, orbitColors[o] + 'ff')
        dg.addColorStop(1, orbitColors[o] + '00')
        ctx.beginPath()
        ctx.arc(dotX, dotY, 5, 0, Math.PI * 2)
        ctx.fillStyle = dg
        ctx.fill()
      }

      // Core white center
      const core = ctx.createRadialGradient(ox, oy, 0, ox, oy, orbR)
      core.addColorStop(0,  '#ffffffee')
      core.addColorStop(.4, C1 + 'cc')
      core.addColorStop(1,  C1 + '00')
      ctx.beginPath()
      ctx.arc(ox, oy, orbR, 0, Math.PI * 2)
      ctx.fillStyle = core
      ctx.fill()

      // ── 6. Perspective horizon grid ─────────────────────────────────────────
      const horizon = H * .84
      if (!ok(horizon)) return
      const vx = W / 2
      ctx.globalAlpha = .08 + .04 * Math.sin(t * .5)
      ctx.strokeStyle = C1
      ctx.lineWidth = .5

      for (let i = 0; i <= 18; i++) {
        const x = (i / 18) * W
        if (!ok(x)) continue
        ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(vx, horizon); ctx.stroke()
      }
      for (let d = 0; d <= 7; d++) {
        const tt = d / 7
        const y  = horizon + (H - horizon) * (1 - Math.pow(1 - tt, 2.8))
        const sp = (y - horizon) / (H - horizon)
        if (!ok(y, sp)) continue
        ctx.beginPath()
        ctx.moveTo(vx - sp * W * .5, y)
        ctx.lineTo(vx + sp * W * .5, y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // ── 7. Top vignette ─────────────────────────────────────────────────────
      const vig = ctx.createLinearGradient(0, 0, 0, H * .35)
      vig.addColorStop(0, 'rgba(4,5,15,0.7)')
      vig.addColorStop(1, 'rgba(4,5,15,0)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, W, H * .35)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100%', height: '100%' }}
    />
  )
}
