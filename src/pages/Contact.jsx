import { useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../data/site'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 pt-16 pb-12">
        <div className="container-wrap section-x">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white/80 transition-colors">홈</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white/80">문의하기</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3">문의하기</h1>
          <p className="text-white/60">강의 관련 문의나 협력 제안을 남겨주세요.</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-wrap section-x py-14">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="section-title text-2xl">연락처</h2>
            {[
              { icon: '📍', label: '주소', value: siteConfig.address },
              { icon: '📞', label: '전화', value: siteConfig.phone },
              { icon: '✉️', label: '이메일', value: siteConfig.email },
            ].map((item) => (
              <div key={item.label} className="flex gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{item.label}</p>
                  <p className="text-sm text-navy-900 dark:text-gray-200 mt-1">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100 dark:border-navy-800">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">SNS</p>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-400 font-semibold transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                유튜브 채널 방문
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="card p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">문의가 접수되었습니다</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">빠른 시일 내에 이메일로 답변 드리겠습니다.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="btn-outline"
                >
                  새 문의 작성
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5">
                <h2 className="font-bold text-lg text-navy-900 dark:text-white">문의 양식</h2>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="홍길동"
                      className="w-full rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 px-4 py-3 text-sm text-navy-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-700 dark:focus:ring-sky transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 px-4 py-3 text-sm text-navy-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-700 dark:focus:ring-sky transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    문의 제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="문의 제목을 입력하세요"
                    className="w-full rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 px-4 py-3 text-sm text-navy-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-700 dark:focus:ring-sky transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    문의 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={6}
                    placeholder="문의 내용을 자세히 작성해 주세요"
                    className="w-full rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 px-4 py-3 text-sm text-navy-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-700 dark:focus:ring-sky transition-all resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3.5">
                  문의 보내기
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
