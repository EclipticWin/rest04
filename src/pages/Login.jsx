import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, signInWithKakao } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : '로그인에 실패했습니다. 다시 시도해주세요.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleKakao() {
    setError('')
    try {
      await signInWithKakao()
    } catch {
      setError('카카오 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="mb-2 text-center text-2xl font-bold text-navy-900 dark:text-white">
            로그인
          </h1>
          <p className="mb-8 text-center text-sm text-gray-500 dark:text-gray-400">
            계정이 없으신가요?{' '}
            <Link to="/register" className="font-semibold text-sky hover:underline">
              회원가입
            </Link>
          </p>

          {/* Kakao Login */}
          <button
            onClick={handleKakao}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] py-3 text-sm font-semibold text-[#3A1D1D] transition-colors hover:bg-[#F4DC00]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 11c0 2.89 1.582 5.404 3.938 6.895-.173.613-.613 2.213-.704 2.559-.113.422.156.414.326.302.134-.09 2.13-1.445 2.993-2.032A11.02 11.02 0 0012 19c5.523 0 10-3.477 10-8S17.523 3 12 3z" />
            </svg>
            카카오로 로그인
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-navy-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-gray-400">
              <span className="bg-white px-3 dark:bg-navy-800">또는</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
