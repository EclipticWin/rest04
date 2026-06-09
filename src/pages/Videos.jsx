import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { videoCategories, videos } from '../data/site'
import VideoCard from '../components/VideoCard'
import VideoModal from '../components/VideoModal'

const VIDEOS_PER_PAGE = 6 // 2열 × 3행

export default function Videos() {
  const { category } = useParams()
  const [page, setPage] = useState(1)
  const [playingVideo, setPlayingVideo] = useState(null)

  // 카테고리 유효성 확인
  const validIds = videoCategories.map((c) => c.id)
  if (!validIds.includes(category)) {
    return <Navigate to={`/videos/${validIds[0]}`} replace />
  }

  const catInfo = videoCategories.find((c) => c.id === category)
  const allVideos = videos[category] || []
  const totalPages = Math.ceil(allVideos.length / VIDEOS_PER_PAGE)
  const pageVideos = allVideos.slice((page - 1) * VIDEOS_PER_PAGE, page * VIDEOS_PER_PAGE)

  const handleCategoryChange = () => setPage(1)

  return (
    <div className="pt-16 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 pt-16 pb-12">
        <div className="container-wrap section-x">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white/80 transition-colors">홈</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span>동영상 강의</span>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white/80">{catInfo.label}</span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-4xl">{catInfo.icon}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">{catInfo.label}</h1>
              <p className="text-white/60 mt-1">{catInfo.description}</p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none">
            {videoCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/videos/${cat.id}`}
                onClick={handleCategoryChange}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  cat.id === category
                    ? 'bg-white text-navy-900 shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
                <span className={`text-xs ml-1 ${cat.id === category ? 'text-navy-500' : 'text-white/40'}`}>
                  {videos[cat.id]?.length || 0}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="container-wrap section-x py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            총 <span className="font-bold text-navy-700 dark:text-sky-light">{allVideos.length}</span>개 강의
            {totalPages > 1 && (
              <span className="ml-2">({page} / {totalPages} 페이지)</span>
            )}
          </p>
        </div>

        {pageVideos.length > 0 ? (
          <>
            {/* 2×3 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pageVideos.map((video) => (
                <VideoCard key={video.id} video={video} onPlay={setPlayingVideo} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all
                             border-gray-200 dark:border-navy-700 text-gray-500 dark:text-gray-400
                             hover:border-navy-700 hover:text-navy-700 dark:hover:border-sky dark:hover:text-sky
                             disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="이전 페이지"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      p === page
                        ? 'bg-navy-700 text-white dark:bg-sky-dark shadow-md'
                        : 'border border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-400 hover:border-navy-700 hover:text-navy-700 dark:hover:border-sky dark:hover:text-sky'
                    }`}
                    aria-label={`${p}페이지`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={page === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all
                             border-gray-200 dark:border-navy-700 text-gray-500 dark:text-gray-400
                             hover:border-navy-700 hover:text-navy-700 dark:hover:border-sky dark:hover:text-sky
                             disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="다음 페이지"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-2">강의를 준비 중입니다</h3>
            <p className="text-gray-500 dark:text-gray-400">곧 새로운 강의가 업로드될 예정입니다.</p>
          </div>
        )}
      </div>

      {playingVideo && (
        <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
      )}
    </div>
  )
}
