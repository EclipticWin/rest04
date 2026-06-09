import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { navMenu, videoCategories, siteConfig } from '../data/site'

export default function Header() {
  const { isDark, toggle, palette, setPalette, palettes } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null) // 'videos' | 'palette' | null
  const location = useLocation()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isVideosActive = location.pathname.startsWith('/videos')
  const currentPalette = palettes.find(p => p.id === palette) || palettes[0]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-navy-950/95 backdrop-blur-md shadow-md'
          : 'bg-white/80 dark:bg-navy-950/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-wrap section-x">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-sky text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow">
              AI
            </div>
            <span className="text-xl font-extrabold tracking-tight text-navy-900 dark:text-white">
              {siteConfig.name}<span className="text-sky dark:text-sky-light">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1">
            {navMenu.map((item) => (
              <div key={item.path} className="relative">
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'videos' ? null : 'videos')}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isVideosActive
                          ? 'text-navy-700 dark:text-sky-light bg-navy-50 dark:bg-navy-800'
                          : 'text-gray-600 dark:text-gray-300 hover:text-navy-700 dark:hover:text-sky-light hover:bg-gray-50 dark:hover:bg-navy-800'
                      }`}
                    >
                      {item.label}
                      <svg className={`h-4 w-4 transition-transform duration-200 ${openDropdown === 'videos' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {openDropdown === 'videos' && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-2xl shadow-xl border overflow-hidden bg-white dark:bg-navy-800 border-gray-100 dark:border-navy-700">
                        <div className="p-2">
                          {item.children.map((child) => {
                            const cat = videoCategories.find(c => `/videos/${c.id}` === child.path)
                            return (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive }) =>
                                  `flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                                    isActive
                                      ? 'bg-navy-50 dark:bg-navy-700 text-navy-700 dark:text-sky-light'
                                      : 'hover:bg-gray-50 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300'
                                  }`
                                }
                              >
                                <span className="text-lg mt-0.5">{cat?.icon || '▸'}</span>
                                <div>
                                  <div className="text-sm font-semibold">{child.label}</div>
                                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{child.desc}</div>
                                </div>
                              </NavLink>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isActive
                          ? 'text-navy-700 dark:text-sky-light bg-navy-50 dark:bg-navy-800'
                          : 'text-gray-600 dark:text-gray-300 hover:text-navy-700 dark:hover:text-sky-light hover:bg-gray-50 dark:hover:bg-navy-800'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}

            {/* Palette Picker (desktop) */}
            <div className="relative ml-1" ref={null}>
              <PaletteButton
                currentPalette={currentPalette}
                isOpen={openDropdown === 'palette'}
                onClick={() => setOpenDropdown(openDropdown === 'palette' ? null : 'palette')}
              />
              {openDropdown === 'palette' && (
                <PaletteDropdown
                  palettes={palettes}
                  current={palette}
                  onSelect={(id) => { setPalette(id); setOpenDropdown(null) }}
                />
              )}
            </div>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1">
            {/* Palette Picker (mobile) */}
            <div className="lg:hidden relative" ref={dropdownRef}>
              <PaletteButton
                currentPalette={currentPalette}
                isOpen={openDropdown === 'palette-m'}
                onClick={() => setOpenDropdown(openDropdown === 'palette-m' ? null : 'palette-m')}
              />
              {openDropdown === 'palette-m' && (
                <PaletteDropdown
                  palettes={palettes}
                  current={palette}
                  onSelect={(id) => { setPalette(id); setOpenDropdown(null) }}
                  alignRight
                />
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors
                         text-gray-500 hover:text-navy-700 hover:bg-gray-100
                         dark:text-gray-400 dark:hover:text-sky-light dark:hover:bg-navy-800"
              aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDark ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg transition-colors
                         text-gray-500 hover:text-navy-700 hover:bg-gray-100
                         dark:text-gray-400 dark:hover:text-sky-light dark:hover:bg-navy-800"
              aria-label="메뉴 열기/닫기"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-navy-800 bg-white dark:bg-navy-950 shadow-xl max-h-[80vh] overflow-y-auto">
          <nav className="section-x container-wrap py-4 space-y-1">
            {navMenu.map((item) => (
              <div key={item.path}>
                {item.children ? (
                  <>
                    <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-3 first:mt-0">
                      {item.label}
                    </div>
                    {item.children.map((child) => {
                      const cat = videoCategories.find(c => `/videos/${c.id}` === child.path)
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                              isActive
                                ? 'bg-navy-700 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800'
                            }`
                          }
                        >
                          <span className="text-base">{cat?.icon || '▸'}</span>
                          {child.label}
                        </NavLink>
                      )
                    })}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-navy-700 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

/* ── 팔레트 버튼 ─────────────────────────────── */
function PaletteButton({ currentPalette, isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors relative group
                  text-gray-500 hover:bg-gray-100 dark:hover:bg-navy-800`}
      aria-label="테마 색상 선택"
      title="테마 색상"
    >
      {/* 현재 팔레트 미리보기 - 2×2 도트 */}
      <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
        {currentPalette.preview.slice(0, 4).map((color, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      {/* 열림 표시 링 */}
      {isOpen && (
        <span className="absolute inset-0 rounded-lg ring-2 ring-navy-700 dark:ring-sky" />
      )}
    </button>
  )
}

/* ── 팔레트 드롭다운 ──────────────────────────── */
function PaletteDropdown({ palettes, current, onSelect, alignRight }) {
  return (
    <div className={`absolute top-full mt-2 w-44 rounded-2xl shadow-xl border overflow-hidden z-50
                     bg-white dark:bg-navy-800 border-gray-100 dark:border-navy-700
                     ${alignRight ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
      <div className="px-3 pt-3 pb-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        테마 색상
      </div>
      <div className="p-2 space-y-0.5">
        {palettes.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left ${
              current === p.id
                ? 'bg-navy-50 dark:bg-navy-700'
                : 'hover:bg-gray-50 dark:hover:bg-navy-700'
            }`}
          >
            {/* 색상 스와치 4개 */}
            <div className="flex gap-1 shrink-0">
              {p.preview.map((color, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded-full shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-navy-900 dark:text-white flex-1">
              {p.name}
            </span>
            {current === p.id && (
              <svg className="h-4 w-4 text-navy-700 dark:text-sky shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
