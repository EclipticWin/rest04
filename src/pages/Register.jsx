import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ nickname: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.nickname.trim()) {
      setError('닉네임을 입력해주세요.')
      return
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    if (form.password !== form.confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    try {
      await signUp(form.email, form.password, form.nickname.trim())
      setDone(true)
    } catch (err) {
      if (err.message.includes('already registered') || err.message.includes('already been registered')) {
        setError('이미 사용 중인 이메일입니다.')
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-navy-900 dark:text-white">회원가입 완료!</h2>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            입력하신 이메일로 인증 메일을 발송했습니다.
            <br />
            메일함을 확인해 이메일 인증을 완료해주세요.
          </p>
          <Link to="/login" className="btn-primary inline-block px-6 py-2.5 text-sm">
            로그인하러 가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="mb-2 text-center text-2xl font-bold text-navy-900 dark:text-white">
            회원가입
          </h1>
          <p className="mb-8 text-center text-sm text-gray-500 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-semibold text-sky hover:underline">
              로그인
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                닉네임
              </label>
              <input
                name="nickname"
                value={form.nickname}
                onChange={onChange}
                required
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
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
                name="password"
                value={form.password}
                onChange={onChange}
                required
                placeholder="6자 이상"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={onChange}
                required
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
