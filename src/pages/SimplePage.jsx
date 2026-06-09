import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

export default function SimplePage({ title = '준비 중' }) {
  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 pt-16 pb-12">
        <div className="container-wrap section-x">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white/80 transition-colors">홈</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white/80">{title}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{title}</h1>
        </div>
      </div>

      <div className="container-wrap section-x py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky/15 to-teal/10 dark:from-navy-800 dark:to-navy-700 flex items-center justify-center mx-auto mb-6">
          <Icon name="gears" size={36} className="text-sky dark:text-sky-light" />
        </div>
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-3">페이지 준비 중입니다</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">더 나은 콘텐츠로 곧 돌아오겠습니다.</p>
        <Link to="/" className="btn-primary">홈으로 돌아가기</Link>
      </div>
    </div>
  )
}
