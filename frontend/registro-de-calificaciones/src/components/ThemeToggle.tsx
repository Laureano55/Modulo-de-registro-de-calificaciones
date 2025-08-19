"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Verificar el tema actual al cargar el componente
    const htmlElement = document.documentElement
    setIsDark(htmlElement.classList.contains("dark"))
  }, [])

  const toggleTheme = () => {
    const htmlElement = document.documentElement

    if (isDark) {
      htmlElement.classList.remove("dark")
      setIsDark(false)
    } else {
      htmlElement.classList.add("dark")
      setIsDark(true)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden transition-all duration-300 hover:scale-105 bg-transparent cursor-pointer dark:hover:bg-primary dark:text-foreground"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
      />
    </Button>
  )
}
