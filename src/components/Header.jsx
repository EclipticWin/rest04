import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { navMenu, videoCategories, siteConfig } from '../data/site'
import Icon from './Icon'

export default function Header() {
  const { isDark, toggle } = useTheme()
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const dropdownRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isVideosActive = location.pathname.startsWith('/videos')
  const isBoardActive = location.pathname.startsWith('/board')

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const displayName = profile?.nickname || user?.user_metadata?.nickname || user?.email?.split('@')[0] || '유저'
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 shadow-md backdrop-blur-md dark:bg-navy-950/95'
          : 'bg-white/80 backdrop-blur-sm dark:bg-navy-950/80'
      }`}
    >
      <div className="container-wrap section-x">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 to-sky text-sm font-bold text-white shadow-md transition-shadow group-hover:shadow-lg">
              AI
            </div>
            <span className="text-xl font-extrabold tracking-tight text-navy-900 dark:text-white">
              {siteConfig.name}<span className="text-sky dark:text-sky-light">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav ref={dropdownRef} className="hidden items-center gap-1 lg:flex">
            {navMenu.map((item) => (
              <div key={item.path} className="relative">
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(!openDropdown)}
                      className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        isVideosActive
                          ? 'bg-navy-50 text-navy-700 dark:bg-navy-800 dark:text-sky-light'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-navy-700 dark:text-gray-300 dark:hover:bg-navy-800 dark:hover:text-sky-light'
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${openDropdown ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {openDropdown && (
                      <div className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-navy-700 dark:bg-navy-800">
                        <div className="p-2">
                          {item.children.map((child) => {
                            const cat = videoCategories.find((c) => `/videos/${c.id}` === child.path)
                            return (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive }) =>
                                  `flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                                    isActive
                                      ? 'bg-navy-50 text-navy-700 dark:bg-navy-700 dark:text-sky-light'
                                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-navy-700'
                                  }`
                                }
                              >
                                <Icon name={cat?.icon} size={15} className="mt-0.5 shrink-0 text-sky dark:text-sky-light" />
                                <div>
                                  <div className="text-sm font-semibold">{child.label}</div>
                                  <div className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{child.desc}</div>
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
                    className={({ isActive }) => {
                      const active = isActive || (item.path === '/board' && isBoardActive)
                      return `rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        active
                          ? 'bg-navy-50 text-navy-700 dark:bg-navy-800 dark:text-sky-light'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-navy-700 dark:text-gray-300 dark:hover:bg-navy-800 dark:hover:text-sky-light'
                      }`
                    }}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-navy-700 dark:text-gray-400 dark:hover:bg-navy-800 dark:hover:text-sky-light"
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

            {/* Auth (desktop) */}
            {user ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-navy-800"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white">
                    {avatarLetter}
                  </div>
                  <span className="max-w-[80px] truncate">{displayName}</span>
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl dark:border-navy-700 dark:bg-navy-800">
                    <button
                      onClick={handleSignOut}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-navy-700"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden items-center rounded-lg bg-navy-700 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-navy-600 lg:flex"
              >
                로그인
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-navy-700 dark:text-gray-400 dark:hover:bg-navy-800 dark:hover:text-sky-light lg:hidden"
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
        <div className="max-h-[80vh] overflow-y-auto border-t border-gray-100 bg-white shadow-xl dark:border-navy-800 dark:bg-navy-950 lg:hidden">
          <nav className="container-wrap section-x space-y-1 py-4">
            {navMenu.map((item) => (
              <div key={item.path}>
                {item.children ? (
                  <>
                    <div className="mt-3 px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 first:mt-0 dark:text-gray-500">
                      {item.label}
                    </div>
                    {item.children.map((child) => {
                      const cat = videoCategories.find((c) => `/videos/${c.id}` === child.path)
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                              isActive
                                ? 'bg-navy-700 text-white'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-navy-800'
                            }`
                          }
                        >
                          <Icon name={cat?.icon} size={14} className="shrink-0 text-sky dark:text-sky-light" />
                          {child.label}
                        </NavLink>
                      )
                    })}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => {
                      const active = isActive || (item.path === '/board' && isBoardActive)
                      return `flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                        active
                          ? 'bg-navy-700 text-white'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-navy-800'
                      }`
                    }}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}

            {/* Mobile Auth */}
            <div className="mt-4 border-t border-gray-100 pt-4 dark:border-navy-800">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white">
                      {avatarLetter}
                    </div>
                    <span className="text-sm font-semibold text-navy-900 dark:text-white">{displayName}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-semibold text-gray-500 hover:text-red-500 dark:text-gray-400"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 px-1">
                  <Link
                    to="/login"
                    className="flex-1 rounded-xl bg-navy-700 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-navy-600"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-navy-700 dark:text-gray-300 dark:hover:bg-navy-800"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
