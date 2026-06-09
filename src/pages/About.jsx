import { useParams, Navigate, Link } from 'react-router-dom'
import { siteConfig } from '../data/site'
import Reveal from '../components/Reveal'

const tabs = [
  { id: 'intro', label: '회사 소개' },
  { id: 'vision', label: '비전 & 미션' },
  { id: 'team', label: '팀 소개' },
  { id: 'history', label: '연혁' },
]

export default function About() {
  const { tab } = useParams()
  const validTabs = tabs.map((t) => t.id)
  if (!tab || !validTabs.includes(tab)) {
    return <Navigate to="/about/intro" replace />
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 pt-16 pb-10">
        <div className="container-wrap section-x">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white/80 transition-colors">홈</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white/80">회사소개</span>
          </nav>
          <h1 className="hero-anim hero-d1 text-2xl md:text-3xl font-extrabold text-white mb-8">회사소개</h1>

          {/* Tabs */}
          <div className="hero-anim hero-d2 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <Link
                key={t.id}
                to={`/about/${t.id}`}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  t.id === tab
                    ? 'bg-white text-navy-900'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wrap section-x py-14">
        {tab === 'intro' && <IntroTab />}
        {tab === 'vision' && <VisionTab />}
        {tab === 'team' && <TeamTab />}
        {tab === 'history' && <HistoryTab />}
      </div>
    </div>
  )
}

function IntroTab() {
  return (
    <div className="max-w-4xl">
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <Reveal direction="left">
          <h2 className="text-3xl font-extrabold text-navy-900 dark:text-white mb-6">
            AI 교육으로<br />
            <span className="text-gradient">미래를 열다</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {siteConfig.fullName}은 누구나 인공지능을 쉽고 체계적으로 배울 수 있도록 고품질의 온라인 동영상 강의를 제공하는 AI 전문 교육 기업입니다.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            AI 기초 이론부터 실무 활용까지, 전문가가 직접 제작한 강의로 빠르게 AI 역량을 키울 수 있습니다. 유튜브를 통해 언제 어디서든 무료로 학습하세요.
          </p>
        </Reveal>
        <Reveal direction="right" delay={120}>
          <div className="card p-8 bg-gradient-to-br from-navy-700 to-navy-900 text-white">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-xl font-bold mb-3">전문 AI 교육</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              현직 AI 전문가와 교육 전문가가 함께 설계한 커리큘럼으로 실질적인 AI 역량을 키웁니다.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

function VisionTab() {
  const items = [
    { icon: '🎯', title: '미션', desc: '모든 사람이 AI를 이해하고 활용할 수 있는 세상을 만들어 갑니다.' },
    { icon: '🚀', title: '비전', desc: 'AI 리터러시 교육의 선두 주자로서 디지털 전환 시대의 교육 혁신을 이끕니다.' },
    { icon: '💡', title: '핵심 가치', desc: '접근성, 전문성, 실용성을 바탕으로 최고의 AI 교육 경험을 제공합니다.' },
  ]
  return (
    <div className="max-w-3xl">
      <Reveal>
        <h2 className="section-title mb-8">비전 & 미션</h2>
      </Reveal>
      <div className="space-y-6">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 100} direction="up">
            <div className="card flex gap-5 p-6">
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div>
                <h3 className="font-bold text-navy-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function TeamTab() {
  const members = [
    { name: '김AI', role: 'CEO / AI 전문가', emoji: '👨‍💼', desc: '10년 이상의 AI 연구 및 교육 경험' },
    { name: '이리터', role: 'CTO / 교육 설계', emoji: '👩‍💻', desc: '에듀테크 전문가, 커리큘럼 설계' },
    { name: '박미래', role: '콘텐츠 디렉터', emoji: '🎬', desc: '유튜브 콘텐츠 기획 및 제작' },
    { name: '최학습', role: '강사 / 연구원', emoji: '👨‍🏫', desc: 'AI 리터러시 교육 전문 강사' },
  ]
  return (
    <div>
      <Reveal>
        <h2 className="section-title mb-8">팀 소개</h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((m, i) => (
          <Reveal key={m.name} delay={i * 90} direction="up">
            <div className="card text-center p-6 hover:-translate-y-2 transition-transform duration-300 h-full">
              <div className="text-5xl mb-3">{m.emoji}</div>
              <h3 className="font-bold text-navy-900 dark:text-white">{m.name}</h3>
              <p className="text-sm text-sky dark:text-sky-light font-medium mt-1">{m.role}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{m.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function HistoryTab() {
  const timeline = [
    { year: '2025', events: ['AILearn 교육 플랫폼 런칭', 'AI 기초 강의 시리즈 첫 업로드', '수강생 1,000명 돌파'] },
    { year: '2024', events: ['AI 리터러시 커리큘럼 개발 착수', 'AI 교육 연구팀 창설', '베타 서비스 런칭'] },
    { year: '2023', events: ['법인 설립', '초기 AI 강의 콘텐츠 기획', '유튜브 채널 개설'] },
  ]
  return (
    <div className="max-w-2xl">
      <Reveal>
        <h2 className="section-title mb-10">연혁</h2>
      </Reveal>
      <div className="space-y-8">
        {timeline.map((item, i) => (
          <Reveal key={item.year} delay={i * 120} direction="left">
            <div className="flex gap-6">
              <div className="shrink-0 w-16 text-right">
                <span className="text-lg font-extrabold text-navy-700 dark:text-sky-light">{item.year}</span>
              </div>
              <div className="relative pl-6 border-l-2 border-gray-200 dark:border-navy-700">
                <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-navy-700 dark:bg-sky" />
                <ul className="space-y-2">
                  {item.events.map((e) => (
                    <li key={e} className="text-sm text-gray-600 dark:text-gray-300">{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
