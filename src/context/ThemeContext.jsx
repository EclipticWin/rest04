import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const palettes = [
  {
    id: 'ocean',
    name: '오션',
    preview: ['#1E3A8A', '#3B82F6', '#0D9488', '#F59E0B'],
  },
  {
    id: 'violet',
    name: '바이올렛',
    preview: ['#4C1D95', '#8B5CF6', '#EC4899', '#EAB308'],
  },
  {
    id: 'forest',
    name: '포레스트',
    preview: ['#166534', '#22C55E', '#84CC16', '#F97316'],
  },
  {
    id: 'sunset',
    name: '선셋',
    preview: ['#991B1B', '#F43F5E', '#FB923C', '#EAB308'],
  },
  {
    id: 'arctic',
    name: '아틱',
    preview: ['#075985', '#06B6D4', '#7C3AED', '#10B981'],
  },
]

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [palette, setPaletteState] = useState(
    () => localStorage.getItem('palette') || 'ocean'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    document.documentElement.dataset.palette = palette
    localStorage.setItem('palette', palette)
  }, [palette])

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggle: () => setIsDark(d => !d),
      palette,
      setPalette: setPaletteState,
      palettes,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
