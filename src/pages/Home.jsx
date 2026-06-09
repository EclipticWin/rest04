import { useState } from 'react'
import { Link } from 'react-router-dom'
import { videoCategories, videos, features, stats, siteConfig } from '../data/site'
import VideoCard from '../components/VideoCard'
import VideoModal from '../components/VideoModal'
import Reveal from '../components/Reveal'
import Icon from '../components/Icon'

// 카테고리별 아이콘 박스 색상 (Tailwind JIT 인식을 위해 전체 문자열로 선언)
const CAT_STYLE = {
  'ai-basics':     { box: 'from-sky/20 to-sky/5 dark:from-sky/30 dark:to-navy-800',     icon: 'text-sky dark:text-sky-light' },
  'ai-literacy':   { box: 'from-teal/20 to-teal/5 dark:from-teal/30 dark:to-navy-800',  icon: 'text-teal dark:text-teal-light' },
  'generative-ai': { box: 'from-amber/20 to-amber/5 dark:from-amber/25 dark:to-navy-800', icon: 'text-amber-dark dark:text-amber-light' },
  'ai-tools':      { box: 'from-sky/10 to-navy-50 dark:from-navy-700/60 dark:to-navy-800', icon: 'text-navy-700 dark:text-sky-light' },
  'ai-future':     { box: 'from-teal/15 to-sky/10 dark:from-teal/25 dark:to-sky/10',    icon: 'text-teal dark:text-teal-light' },
}
const FEAT_BOX = [
  'from-sky/20 to-sky/5 dark:from-sky/25 dark:to-navy-800',
  'from-teal/20 to-teal/5 dark:from-teal/25 dark:to-navy-800',
  'from-amber/20 to-amber/5 dark:from-amber/25 dark:to-navy-800',
  'from-sky/10 to-teal/5 dark:from-navy-700/50 dark:to-navy-800',
]
const FEAT_ICON = [
  'text-sky dark:text-sky-light',
  'text-teal dark:text-teal-light',
  'text-amber-dark dark:text-amber-light',
  'text-sky dark:text-sky-light',
]

export default function Home() {
  const [playingVideo, setPlayingVideo] = useState(null)

  const latestVideos = Object.values(videos)
    .flat()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  return (
    <div className="pt-16">

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-hero">
        {/* 배경 사진 — 연하게 */}
        <img
          src="/igor-omilaev-eGGFZ5X2LnA-unsplash.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          style={{ opacity: 0.13, mixBlendMode: 'luminosity' }}
        />

        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky/10 blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-teal/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-navy-700/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="relative container-wrap section-x py-24 w-full">
          <div className="max-w-3xl">
            {/* 배지 */}
            <div className="hero-anim hero-d1 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm font-medium mb-8">
              <span className="h-2 w-2 rounded-full bg-teal-light animate-pulse" />
              AI 교육의 새로운 기준
            </div>

            {/* 제목 */}
            <h1 className="hero-anim hero-d2 text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              AI 영상으로 배우는
              <br />
              <span className="text-gradient">인공지능 세계</span>
            </h1>

            {/* 설명 */}
            <p className="hero-anim hero-d3 text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-xl">
              AI 기초부터 생성형 AI, 미래 사회까지 —
              <br className="hidden sm:block" />
              유튜브 AI 영상을 주제별로 모아 한곳에서 만나보세요.
            </p>

            {/* 버튼 */}
            <div className="hero-anim hero-d4 flex flex-wrap gap-4">
              <Link to="/videos/ai-basics" className="btn-primary text-base px-8 py-4">
                영상 보러 가기
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

            {/* 통계 */}
            <div className="hero-anim hero-d5 flex flex-wrap gap-8 mt-16">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold text-white">{s.value}</div>
                  <div className="text-sm text-white/60 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── 카테고리 ──────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-navy-900">
        <div className="container-wrap section-x">
          <Reveal className="text-center mb-12">
            <h2 className="section-title">학습 카테고리</h2>
            <p className="section-sub">관심 분야를 선택하고 바로 시작하세요</p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {videoCategories.map((cat, i) => {
              const s = CAT_STYLE[cat.id] || CAT_STYLE['ai-basics']
              return (
                <Reveal key={cat.id} delay={i * 80} direction="up">
                  <Link
                    to={`/videos/${cat.id}`}
                    className="card flex flex-col items-center text-center p-5 hover:-translate-y-2 transition-transform duration-300 group h-full"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.box} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon name={cat.icon} size={22} className={s.icon} />
                    </div>
                    <h3 className="font-bold text-sm text-navy-900 dark:text-white mb-1">{cat.label}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{cat.description}</p>
                    <div className="mt-3 text-xs font-semibold text-sky dark:text-sky-light">
                      {videos[cat.id]?.length || 0}개 영상
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 최신 강의 ─────────────────────────────────── */}
      <section className="py-20">
        <div className="container-wrap section-x">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="section-title">최신 AI 영상</h2>
              <p className="section-sub">최근 추가된 AI 영상을 확인하세요</p>
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
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestVideos.map((video, i) => (
              <Reveal key={video.id} delay={i * 90} direction="up">
                <VideoCard video={video} onPlay={setPlayingVideo} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 특징 ──────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-navy-900">
        <div className="container-wrap section-x">
          <Reveal className="text-center mb-12">
            <h2 className="section-title">AILearn을 이용하는 이유</h2>
            <p className="section-sub">AI 영상을 더 쉽게, 더 빠르게 찾아보세요</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100} direction="up">
                <div className="card p-6 text-center hover:-translate-y-2 transition-transform duration-300 h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${FEAT_BOX[i]} flex items-center justify-center mb-5 mx-auto`}>
                    <Icon name={f.icon} size={26} className={FEAT_ICON[i]} />
                  </div>
                  <h3 className="font-bold text-navy-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24 bg-gradient-brand">
        <Reveal direction="fade" className="container-wrap section-x text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            지금 바로 AI 영상을 시작하세요
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            유튜브의 인기 AI 영상을 주제별로 정리했습니다.
            별도 가입 없이 누구나 무료로 시청할 수 있습니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/videos/ai-basics"
              className="inline-flex items-center gap-2 bg-white text-navy-900 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              강의 목록 보기
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              문의하기
            </Link>
          </div>
        </Reveal>
      </section>

      {playingVideo && (
        <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
      )}
    </div>
  )
}
