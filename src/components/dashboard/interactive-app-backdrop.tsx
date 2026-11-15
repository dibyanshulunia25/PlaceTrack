"use client"

import { useEffect, useRef } from "react"

export function InteractiveAppBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) {
      container.style.setProperty("--mouse-x", "50vw")
      container.style.setProperty("--mouse-y", "35vh")
      return
    }

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight * 0.35
    let currentX = targetX
    let currentY = targetY
    let animationFrameId: number | null = null

    const render = () => {
      const dx = targetX - currentX
      const dy = targetY - currentY

      // When movement is active, interpolate smoothly
      if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
        currentX += dx * 0.12
        currentY += dy * 0.12
        container.style.setProperty("--mouse-x", `${currentX.toFixed(1)}px`)
        container.style.setProperty("--mouse-y", `${currentY.toFixed(1)}px`)
        animationFrameId = requestAnimationFrame(render)
      } else {
        // Settle at exact coordinates and stop the loop (0 CPU/GPU usage at rest)
        container.style.setProperty("--mouse-x", `${targetX.toFixed(1)}px`)
        container.style.setProperty("--mouse-y", `${targetY.toFixed(1)}px`)
        animationFrameId = null
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={
        {
          "--mouse-x": "50vw",
          "--mouse-y": "30vh",
        } as React.CSSProperties
      }
    >
      {/* Layer 1: Architectural Micro-Dot Pattern (20px spacing) */}
      <div 
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage: `radial-gradient(var(--border-subtle) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Layer 2: Primary Cursor-Following Ambient Radial Glow (450px radius) */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(450px circle at var(--mouse-x, 50vw) var(--mouse-y, 30vh), var(--radial-primary-glow), transparent 75%)`,
        }}
      />

      {/* Layer 3: Secondary Warm Copper Horizon Sheen */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(600px circle at calc(var(--mouse-x, 50vw) + 120px) calc(var(--mouse-y, 30vh) + 150px), var(--radial-copper-glow), transparent 70%)`,
        }}
      />

      {/* Layer 4: Subtle Top Horizon Vignette */}
      <div 
        className="absolute top-0 left-0 right-0 h-36 opacity-30 dark:opacity-20"
        style={{
          background: `linear-gradient(to bottom, var(--accent-primary-alpha), transparent)`,
        }}
      />

      <style jsx>{`
        div {
          --radial-primary-glow: rgba(27, 107, 80, 0.06);
          --radial-copper-glow: rgba(194, 109, 45, 0.035);
          --accent-primary-alpha: rgba(27, 107, 80, 0.07);
        }
        :global(.dark) div {
          --radial-primary-glow: rgba(42, 157, 143, 0.08);
          --radial-copper-glow: rgba(217, 119, 54, 0.045);
          --accent-primary-alpha: rgba(42, 157, 143, 0.08);
        }
      `}</style>
    </div>
  )
}
