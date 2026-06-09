import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'og-image.png')

mkdirSync(join(__dirname, '..', 'public'), { recursive: true })

const W = 1200
const H = 630

// 5가지 브랜드 컬러
const palette = [
  { hex: '#0F1B2D', name: 'Deep Navy',   border: '#374151' },
  { hex: '#1E3A8A', name: 'Royal Blue',  border: null },
  { hex: '#3B82F6', name: 'Sky Blue',    border: null },
  { hex: '#0D9488', name: 'Teal',        border: null },
  { hex: '#F59E0B', name: 'Amber',       border: null },
]

const dotSpacing = 100
const dotR = 26
const dotY = 530
const dotsStartX = 80

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- 배경 그라디언트 -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#070e1a"/>
      <stop offset="55%"  stop-color="#0F1B2D"/>
      <stop offset="100%" stop-color="#152C6E"/>
    </linearGradient>

    <!-- 상단 액센트 바 -->
    <linearGradient id="topbar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#1E3A8A"/>
      <stop offset="45%"  stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#0D9488"/>
    </linearGradient>

    <!-- 로고 배지 그라디언트 -->
    <linearGradient id="badge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#1E3A8A"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>

    <!-- 텍스트 그라디언트 (메인 헤드라인) -->
    <linearGradient id="headline" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#14B8A6"/>
    </linearGradient>

    <!-- 장식 원 blur 효과 대체 (filter) -->
    <filter id="blur1">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
    <filter id="blur2">
      <feGaussianBlur stdDeviation="30"/>
    </filter>
  </defs>

  <!-- ── 배경 ── -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- 장식 블러 원 -->
  <circle cx="1080" cy="120" r="260" fill="#3B82F6" fill-opacity="0.07" filter="url(#blur1)"/>
  <circle cx="1100" cy="520" r="180" fill="#0D9488" fill-opacity="0.07" filter="url(#blur1)"/>
  <circle cx="60"   cy="540" r="140" fill="#F59E0B" fill-opacity="0.05" filter="url(#blur2)"/>
  <circle cx="600"  cy="320" r="300" fill="#1E3A8A" fill-opacity="0.08" filter="url(#blur1)"/>

  <!-- 격자 패턴 오버레이 -->
  <line x1="0"    y1="0"   x2="${W}" y2="${H}" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
  ${Array.from({ length: 20 }, (_, i) => `
  <line x1="${i * 64}" y1="0" x2="${i * 64}" y2="${H}" stroke="rgba(255,255,255,0.025)" stroke-width="0.5"/>
  <line x1="0" y1="${i * 64}" x2="${W}" y2="${i * 64}" stroke="rgba(255,255,255,0.025)" stroke-width="0.5"/>
  `).join('')}

  <!-- ── 상단 액센트 바 ── -->
  <rect x="0" y="0" width="${W}" height="6" fill="url(#topbar)"/>

  <!-- ── 로고 영역 ── -->
  <!-- 배지 배경 -->
  <rect x="80" y="68" width="76" height="76" rx="18" fill="url(#badge)"/>
  <!-- AI 텍스트 -->
  <text x="118" y="120"
    font-family="Arial Black, Impact, sans-serif"
    font-size="28" font-weight="900"
    fill="white" text-anchor="middle">AI</text>

  <!-- 사이트명 -->
  <text x="174" y="122"
    font-family="Arial Black, Impact, sans-serif"
    font-size="46" font-weight="900"
    fill="white" letter-spacing="-1">AILearn</text>
  <text x="174" y="122"
    font-family="Arial Black, Impact, sans-serif"
    font-size="46" font-weight="900"
    fill="#3B82F6" letter-spacing="-1" dx="200">.</text>

  <!-- ── 메인 헤드라인 ── -->
  <!-- 라인 1: 한글 -->
  <text x="80" y="278"
    font-family="'Malgun Gothic', 'Apple SD Gothic Neo', 'NanumGothic', 'Dotum', Arial, sans-serif"
    font-size="62" font-weight="700"
    fill="white">누구나 쉽게 배우는</text>

  <!-- 라인 2: 그라디언트 강조 -->
  <text x="80" y="362"
    font-family="'Malgun Gothic', 'Apple SD Gothic Neo', 'NanumGothic', 'Dotum', Arial, sans-serif"
    font-size="62" font-weight="700"
    fill="url(#headline)">인공지능 교육</text>

  <!-- ── 설명 텍스트 ── -->
  <text x="80" y="430"
    font-family="'Malgun Gothic', 'Apple SD Gothic Neo', 'NanumGothic', 'Dotum', Arial, sans-serif"
    font-size="24" fill="#9CA3AF">
    AI 기초부터 실무 활용까지, 체계적인 온라인 동영상 강의
  </text>

  <!-- ── 구분선 ── -->
  <line x1="80" y1="468" x2="${W - 80}" y2="468"
    stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <!-- ── 컬러 팔레트 ── -->
  ${palette.map((c, i) => `
  <!-- ${c.name} -->
  <circle cx="${dotsStartX + i * dotSpacing}" cy="${dotY}"
    r="${dotR}" fill="${c.hex}"
    ${c.border ? `stroke="${c.border}" stroke-width="2"` : ''}/>
  <text x="${dotsStartX + i * dotSpacing}" y="${dotY + dotR + 20}"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="13" fill="#6B7280">${c.name}</text>
  `).join('')}

  <!-- ── 우측 하단 URL ── -->
  <text x="${W - 80}" y="${H - 36}"
    font-family="Arial, sans-serif"
    font-size="20" fill="#4B5563"
    text-anchor="end">eclipticwin.github.io/rest04</text>

  <!-- ── 우측 장식 패턴 ── -->
  <!-- 점 그리드 -->
  ${Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) =>
      `<circle cx="${W - 120 - col * 28}" cy="${160 + row * 28}" r="2" fill="rgba(255,255,255,0.06)"/>`
    ).join('')
  ).join('')}
</svg>
`

const result = await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(OUT)

console.log(`✅ OG 이미지 생성 완료: ${OUT}`)
console.log(`   크기: ${result.width} × ${result.height}px`)
