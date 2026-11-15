"use client"

import { useEffect, useRef } from "react"

interface Milestone {
  id: string
  label: string
  progress: number // 0 to 1 across curve
  subtext: string
}

const MILESTONES: Milestone[] = [
  { id: "resume", label: "RESUME", progress: 0.12, subtext: "01" },
  { id: "assessment", label: "ASSESSMENT", progress: 0.38, subtext: "02" },
  { id: "technical", label: "TECHNICAL", progress: 0.65, subtext: "03" },
  { id: "offer", label: "OFFER", progress: 0.88, subtext: "04" },
]

export function CareerTrajectoryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animationFrameId: number | null = null
    let width = 0
    let height = 0
    let dpr = 1

    // Mouse coordinates (screen space)
    let targetMouseX = -1000
    let targetMouseY = -1000
    let currentMouseX = -1000
    let currentMouseY = -1000
    let isHovering = false

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      if (!container || !canvas) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = container.clientWidth
      height = container.clientHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.scale(dpr, dpr)
    }

    resize()

    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw(0)
    })
    resizeObserver.observe(container)

    const requestDraw = () => {
      if (animationFrameId === null && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw)
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetMouseX = e.clientX - rect.left
      targetMouseY = e.clientY - rect.top
      isHovering = true
      requestDraw()
    }

    const handlePointerLeave = () => {
      isHovering = false
      targetMouseX = -1000
      targetMouseY = -1000
      requestDraw()
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    document.addEventListener("mouseleave", handlePointerLeave)

    // Cubic Bézier calculation helper for trajectory path
    const getCurvePoints = (w: number, h: number) => {
      const isMobile = w < 640
      const p0 = { x: w * 0.05, y: h * (isMobile ? 0.40 : 0.46) }
      const p1 = { x: w * 0.18, y: h * (isMobile ? 0.35 : 0.42) } // Resume
      const p2 = { x: w * 0.40, y: h * (isMobile ? 0.28 : 0.32) } // Assessment
      const p3 = { x: w * 0.65, y: h * (isMobile ? 0.48 : 0.52) } // Technical
      const p4 = { x: w * 0.88, y: h * (isMobile ? 0.32 : 0.36) } // Offer
      const p5 = { x: w * 0.98, y: h * (isMobile ? 0.30 : 0.34) }

      return [p0, p1, p2, p3, p4, p5]
    }

    // Evaluate spline point at parameter t in [0, 1]
    const evaluateSpline = (points: { x: number; y: number }[], t: number) => {
      const clampedT = Math.max(0, Math.min(1, t))
      const numSegments = points.length - 1
      const p = clampedT * numSegments
      const index = Math.min(Math.floor(p), numSegments - 1)
      const subT = p - index

      const pStart = points[index]
      const pEnd = points[index + 1]

      // Smooth cosine interpolation between segments
      const ft = subT * Math.PI
      const f = (1 - Math.cos(ft)) * 0.5

      return {
        x: pStart.x * (1 - f) + pEnd.x * f,
        y: pStart.y * (1 - f) + pEnd.y * f,
      }
    }

    const draw = (timestamp: number) => {
      if (!ctx || width === 0 || height === 0) return

      const isDark = document.documentElement.classList.contains("dark")

      // Color tokens
      const colors = isDark
        ? {
            dotBase: "rgba(42, 46, 53, 0.4)",
            dotActive: "rgba(42, 157, 143, 0.85)",
            pathBase: "rgba(42, 46, 53, 0.55)",
            pathActive: "rgba(42, 157, 143, 0.9)",
            copperAccent: "#D97736",
            emeraldAccent: "#2A9D8F",
            textBase: "#9499A3",
            textActive: "#ECEEF0",
            nodeBg: "#191B1F",
          }
        : {
            dotBase: "rgba(228, 225, 218, 0.5)",
            dotActive: "rgba(27, 107, 80, 0.8)",
            pathBase: "rgba(228, 225, 218, 0.75)",
            pathActive: "rgba(27, 107, 80, 0.85)",
            copperAccent: "#C26D2D",
            emeraldAccent: "#1B6B50",
            textBase: "#5F5D57",
            textActive: "#1C1B18",
            nodeBg: "#FFFFFF",
          }

      // Smooth mouse movement lerp
      let isMoving = false
      if (isHovering) {
        const dx = targetMouseX - currentMouseX
        const dy = targetMouseY - currentMouseY
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          currentMouseX += dx * 0.12
          currentMouseY += dy * 0.12
          isMoving = true
        } else {
          currentMouseX = targetMouseX
          currentMouseY = targetMouseY
        }
      } else {
        const dx = width * 0.5 - currentMouseX
        const dy = height * 0.35 - currentMouseY
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          currentMouseX += dx * 0.05
          currentMouseY += dy * 0.05
          isMoving = true
        }
      }

      ctx.clearRect(0, 0, width, height)

      // ========================================================================
      // 1. Draw Architectural Dot Matrix (Batched for Performance)
      // ========================================================================
      const spacing = 24
      const spotlightRadius = 280
      const spotlightRadiusSq = spotlightRadius * spotlightRadius

      // 1a. Draw all base dots in a single batch path
      ctx.save()
      ctx.fillStyle = colors.dotBase
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      for (let x = 12; x < width; x += spacing) {
        for (let y = 12; y < height; y += spacing) {
          ctx.moveTo(x + 0.9, y)
          ctx.arc(x, y, 0.9, 0, Math.PI * 2)
        }
      }
      ctx.fill()
      ctx.restore()

      // 1b. Draw active spotlight dots only in the bounding box of currentMouse
      if (currentMouseX > -spotlightRadius && currentMouseX < width + spotlightRadius) {
        const startX = Math.max(12, Math.floor((currentMouseX - spotlightRadius) / spacing) * spacing)
        const endX = Math.min(width, Math.ceil((currentMouseX + spotlightRadius) / spacing) * spacing)
        const startY = Math.max(12, Math.floor((currentMouseY - spotlightRadius) / spacing) * spacing)
        const endY = Math.min(height, Math.ceil((currentMouseY + spotlightRadius) / spacing) * spacing)

        ctx.save()
        for (let x = startX; x <= endX; x += spacing) {
          for (let y = startY; y <= endY; y += spacing) {
            const dx = x - currentMouseX
            const dy = y - currentMouseY
            const distSq = dx * dx + dy * dy

            if (distSq < spotlightRadiusSq) {
              const dist = Math.sqrt(distSq)
              const factor = 1 - dist / spotlightRadius
              const radius = 1 + factor * 1.6

              ctx.fillStyle = colors.dotActive
              ctx.globalAlpha = 0.25 + factor * 0.65
              ctx.beginPath()
              ctx.arc(x, y, radius, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
        ctx.restore()
      }

      // ========================================================================
      // 2. Draw Curved Career Milestone Pathway (Bézier Spline)
      // ========================================================================
      const pathPoints = getCurvePoints(width, height)
      const samples = 100
      const sampledCurve: { x: number; y: number }[] = []

      for (let i = 0; i <= samples; i++) {
        sampledCurve.push(evaluateSpline(pathPoints, i / samples))
      }

      // 2a. Base Pathway Line (subtle)
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(sampledCurve[0].x, sampledCurve[0].y)
      for (let i = 1; i < sampledCurve.length; i++) {
        ctx.lineTo(sampledCurve[i].x, sampledCurve[i].y)
      }
      ctx.strokeStyle = colors.pathBase
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()

      // 2b. Illuminated Pathway Segments within Spotlight
      ctx.save()
      for (let i = 0; i < sampledCurve.length - 1; i++) {
        const pA = sampledCurve[i]
        const pB = sampledCurve[i + 1]

        const midX = (pA.x + pB.x) / 2
        const midY = (pA.y + pB.y) / 2

        const dx = midX - currentMouseX
        const dy = midY - currentMouseY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < spotlightRadius) {
          const factor = 1 - dist / spotlightRadius
          ctx.beginPath()
          ctx.moveTo(pA.x, pA.y)
          ctx.lineTo(pB.x, pB.y)
          ctx.strokeStyle = colors.pathActive
          ctx.lineWidth = 1.5 + factor * 2
          ctx.globalAlpha = factor * 0.95
          ctx.stroke()
        }
      }
      ctx.restore()

      // ========================================================================
      // 3. Draw Milestone Node Waypoints
      // ========================================================================
      MILESTONES.forEach((m, idx) => {
        const pt = evaluateSpline(pathPoints, m.progress)

        const dx = pt.x - currentMouseX
        const dy = pt.y - currentMouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const isNearCursor = dist < spotlightRadius * 0.85
        const proximityFactor = isNearCursor ? 1 - dist / (spotlightRadius * 0.85) : 0

        ctx.save()

        // Outer ambient glow ring when illuminated
        if (proximityFactor > 0) {
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 16 + proximityFactor * 8, 0, Math.PI * 2)
          ctx.fillStyle = idx === 3 ? colors.copperAccent : colors.emeraldAccent
          ctx.globalAlpha = proximityFactor * 0.25
          ctx.fill()
        }

        // Node base pill / circle
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 9, 0, Math.PI * 2)
        ctx.fillStyle = colors.nodeBg
        ctx.globalAlpha = 1
        ctx.fill()

        // Border
        ctx.lineWidth = 2
        ctx.strokeStyle = isNearCursor
          ? idx === 3
            ? colors.copperAccent
            : colors.emeraldAccent
          : colors.pathBase
        ctx.stroke()

        // Inner center pip
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = isNearCursor
          ? idx === 3
            ? colors.copperAccent
            : colors.emeraldAccent
          : colors.dotBase
        ctx.fill()

        // Label Tag
        ctx.font = '600 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        const isAbove = idx % 2 === 0
        const labelY = isAbove ? pt.y - 19 : pt.y + 19

        ctx.fillStyle = isNearCursor ? colors.textActive : colors.textBase
        ctx.globalAlpha = isNearCursor ? 1 : 0.7
        ctx.fillText(m.label, pt.x, isAbove ? labelY : labelY + 7)

        ctx.restore()
      })

      // Only schedule next frame if mouse is moving or hovering
      if (isMoving && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw)
      } else {
        animationFrameId = null
      }
    }

    draw(0)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("mouseleave", handlePointerLeave)
      resizeObserver.disconnect()
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* Bottom fade mask into next section */}
      <div 
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--bg-canvas))",
        }}
      />
    </div>
  )
}
