"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check screen width for initial auto-collapse on tablet
    const handleResize = () => {
      const width = window.innerWidth
      const mobile = width < 768
      const tablet = width >= 768 && width < 1024

      setIsMobile(mobile)

      if (tablet) {
        setIsCollapsed(true)
      } else if (!mobile) {
        // Read persisted user preference on desktop
        const stored = localStorage.getItem("placetrack_sidebar_collapsed")
        if (stored !== null) {
          setIsCollapsed(stored === "true")
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      if (!isMobile) {
        localStorage.setItem("placetrack_sidebar_collapsed", String(next))
      }
      return next
    })
  }

  const setCollapsed = (val: boolean) => {
    setIsCollapsed(val)
    if (!isMobile) {
      localStorage.setItem("placetrack_sidebar_collapsed", String(val))
    }
  }

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        setCollapsed,
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
