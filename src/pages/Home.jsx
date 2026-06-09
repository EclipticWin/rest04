import { useState } from 'react'
import { Link } from 'react-router-dom'
import { videoCategories, videos, features, stats, siteConfig } from '../data/site'
import VideoCard from '../components/VideoCard'
import VideoModal from '../components/VideoModal'

export default function Home() {
  const [playingVideo, setPlayingVideo] = useState(null)

  // 최근 영상 6개 (전체 카테고리에서)
  const latestVideos = Object.values(videos)
    .flat()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-hero">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky/10 blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-teal/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-navy-700/20 blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="relative container-wrap section-x py-24 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm font-medium mb-8">
              <span className="h-2 w-2 rounded-full bg-teal-light animate-pulse" />
              AI 교육의 새로운 기준
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              누구나 쉽게 배우는
              <br />
              <span className="text-gradient">인공지능 교육</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-xl">
              AI 기초부터 실무 활용까지, 체계적인 동영상 강의로
              <br className="hidden sm:block" />
              AI 역량을 빠르게 키워보세요.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/videos/ai-basics" className="btn-primary text-base px-8 py-4">
                강의 시작하기
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-base border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-200"
              >
                회사 소개
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-16">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold text-white">{s.value}</div>
                  <div className="text-sm text-white/60 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-20 bg-gray-50 dark:bg-navy-900">
        <div className="container-wrap section-x">
          <div className="text-center mb-12">
            <h2 className="section-title">학습 카테고리</h2>
            <p className="section-sub">관심 분야를 선택하고 바로 시작하세요</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {videoCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/videos/${cat.id}`}
                className="card flex flex-col items-center text-center p-5 hover:-translate-y-1 transition-transform duration-200 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-sm text-navy-900 dark:text-white mb-1">{cat.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{cat.description}</p>
                <div className="mt-3 text-xs font-semibold text-sky dark:text-sky-light">
                  {videos[cat.id]?.length || 0}개 강의
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Videos */}
      <section className="py-20">
        <div className="container-wrap section-x">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="section-title">최신 강의</h2>
              <p className="section-sub">가장 최근에 업로드된 강의입니다</p>
            </div>
            <Link
              to="/videos/ai-basics"
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-sky-light hover:text-sky transition-colors"
            >
              전체 보기
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestVideos.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={setPlayingVideo} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-navy-900">
        <div className="container-wrap section-x">
          <div className="text-center mb-12">
            <h2 className="section-title">왜 AILearn인가요?</h2>
            <p className="section-sub">차별화된 AI 교육 경험을 제공합니다</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 text-center hover:-translate-y-1 transition-transform duration-200">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-navy-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-brand">
        <div className="container-wrap section-x text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            지금 바로 AI 학습을 시작하세요
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            유튜브를 통해 무료로 제공되는 AI 강의로
            빠르게 AI 역량을 키워보세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/videos/ai-basics" className="inline-flex items-center gap-2 bg-white text-navy-900 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
              강의 목록 보기
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors">
              문의하기
            </Link>
          </div>
        </div>
      </section>

      {playingVideo && (
        <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
      )}
    </div>
  )
}
