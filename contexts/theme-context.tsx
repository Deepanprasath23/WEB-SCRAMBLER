"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "ocean" | "sunset" | "forest"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: { value: Theme; label: string; colors: string }[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  const themes = [
    { value: "light" as Theme, label: "Light", colors: "bg-gradient-to-r from-blue-500 to-purple-500" },
    { value: "dark" as Theme, label: "Dark", colors: "bg-gradient-to-r from-gray-800 to-gray-900" },
    { value: "ocean" as Theme, label: "Ocean", colors: "bg-gradient-to-r from-blue-600 to-teal-500" },
    { value: "sunset" as Theme, label: "Sunset", colors: "bg-gradient-to-r from-orange-500 to-pink-500" },
    { value: "forest" as Theme, label: "Forest", colors: "bg-gradient-to-r from-green-600 to-emerald-500" },
  ]

  useEffect(() => {
    const savedTheme = localStorage.getItem("web-scrambler-theme") as Theme
    if (savedTheme && themes.some((t) => t.value === savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("web-scrambler-theme", theme)

    // Remove all theme classes
    document.documentElement.classList.remove("dark", "ocean", "sunset", "forest")

    // Add current theme class
    if (theme !== "light") {
      document.documentElement.classList.add(theme)
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme, themes }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
