import { Link } from 'react-router-dom'
import { videoCategories, videos } from '../data/site'

const LEVELS = ['입문', '초급', '중급', '고급']

export default function Curriculum() {
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
            <span className="text-white/80">커리큘럼</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3">커리큘럼</h1>
          <p className="text-white/60">AI 역량 개발을 위한 단계별 학습 로드맵입니다.</p>
        </div>
      </div>

      {/* Level Guide */}
      <div className="bg-gray-50 dark:bg-navy-900 py-10">
        <div className="container-wrap section-x">
          <div className="flex flex-wrap gap-4 justify-center">
            {LEVELS.map((level, i) => (
              <div key={level} className="flex items-center gap-2 text-sm font-semibold">
                {i > 0 && <svg className="h-4 w-4 text-gray-300 dark:text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>}
                <span className={`px-3 py-1.5 rounded-full ${
                  ['bg-teal/10 text-teal', 'bg-sky/10 text-sky', 'bg-amber/10 text-amber-dark', 'bg-red-50 text-red-600'][i]
                }`}>
                  {level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Curricula */}
      <div className="container-wrap section-x py-14">
        <div className="space-y-14">
          {videoCategories.map((cat) => {
            const catVideos = videos[cat.id] || []
            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <h2 className="text-xl font-extrabold text-navy-900 dark:text-white">{cat.label}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{cat.description}</p>
                    </div>
                  </div>
                  <Link
                    to={`/videos/${cat.id}`}
                    className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-sky hover:text-navy-700 dark:hover:text-sky-light transition-colors"
                  >
                    전체 강의
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catVideos.slice(0, 6).map((video, idx) => (
                    <div
                      key={video.id}
                      className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-navy-700 bg-white dark:bg-navy-800 hover:border-navy-300 dark:hover:border-navy-600 transition-colors"
                    >
                      <span className="text-lg font-bold text-gray-200 dark:text-navy-700 shrink-0 w-7 text-center">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy-900 dark:text-white line-clamp-2">{video.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {video.level && (
                            <span className="text-xs text-gray-400">{video.level}</span>
                          )}
                          {video.duration && (
                            <span className="text-xs text-gray-400">· {video.duration}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {catVideos.length > 6 && (
                  <div className="mt-4 text-center">
                    <Link
                      to={`/videos/${cat.id}`}
                      className="text-sm text-sky dark:text-sky-light font-semibold hover:underline"
                    >
                      {catVideos.length - 6}개 강의 더 보기 →
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
