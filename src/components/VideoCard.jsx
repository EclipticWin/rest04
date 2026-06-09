import { useState } from 'react'

const LEVEL_COLORS = {
  입문: 'bg-teal/10 text-teal dark:bg-teal/20 dark:text-teal-light',
  초급: 'bg-sky/10 text-sky dark:bg-sky/20 dark:text-sky-light',
  중급: 'bg-amber/10 text-amber-dark dark:bg-amber/20 dark:text-amber-light',
  고급: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
}

export default function VideoCard({ video, onPlay }) {
  const [imgErr, setImgErr] = useState(false)
  const isPlaceholder = !video.youtubeId || video.youtubeId.startsWith('YOUTUBE_VIDEO_ID')
  const thumbUrl = isPlaceholder
    ? null
    : `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

  return (
    <div className="card group flex flex-col h-full">
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden cursor-pointer aspect-video bg-navy-900"
        onClick={() => !isPlaceholder && onPlay && onPlay(video)}
      >
        {!isPlaceholder && !imgErr ? (
          <img
            src={thumbUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-navy-800 to-navy-900 text-gray-500">
            <svg className="h-10 w-10 mb-2 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-navy-600">영상 준비 중</span>
          </div>
        )}

        {/* Play overlay */}
        {!isPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-950/0 group-hover:bg-navy-950/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
              <svg className="h-5 w-5 text-navy-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-navy-950/80 text-white text-xs px-2 py-0.5 rounded font-mono">
            {video.duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          {video.level && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${LEVEL_COLORS[video.level] || LEVEL_COLORS['입문']}`}>
              {video.level}
            </span>
          )}
          {video.date && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(video.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        <h3 className="font-bold text-sm leading-snug text-navy-900 dark:text-white mb-1.5 line-clamp-2 flex-1">
          {video.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {video.description}
        </p>

        <button
          onClick={() => !isPlaceholder && onPlay && onPlay(video)}
          disabled={isPlaceholder}
          className={`mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isPlaceholder
              ? 'bg-gray-100 dark:bg-navy-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-navy-700 hover:bg-navy-600 dark:bg-sky-dark dark:hover:bg-sky text-white shadow-md hover:shadow-lg'
          }`}
        >
          <svg className="h-4 w-4" fill={isPlaceholder ? 'none' : 'currentColor'} stroke={isPlaceholder ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={isPlaceholder ? 2 : 0}>
            {isPlaceholder
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              : <path d="M8 5v14l11-7z" />
            }
          </svg>
          {isPlaceholder ? '준비 중' : '영상 보기'}
        </button>
      </div>
    </div>
  )
}
