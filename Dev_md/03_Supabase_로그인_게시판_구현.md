# 03. Supabase 연동 · 로그인 · 게시판 구현

**작업일**: 2026-06-10

---

## 작업 개요

정적 영상 플랫폼에 Supabase를 백엔드로 연결하여 **이메일/카카오 로그인**과 **커뮤니티 게시판**을 추가했다.

---

## 주요 변경 사항

### 1. Supabase 클라이언트 연동

- `@supabase/supabase-js` 패키지 설치
- `src/lib/supabase.js` — 프로젝트 전역 Supabase 클라이언트 생성
- anon key는 브라우저 공개용 키로 커밋에 포함 (Supabase 공식 권장 방식)

### 2. 인증 (Auth)

#### 이메일/비밀번호 로그인
- `src/pages/Login.jsx` — 이메일+비밀번호 폼, 카카오 로그인 버튼
- `src/pages/Register.jsx` — 닉네임·이메일·비밀번호 회원가입, 이메일 인증 안내

#### 카카오 OAuth
- Supabase `signInWithOAuth({ provider: 'kakao' })` 사용
- HashRouter + GitHub Pages 환경에서 OAuth 리다이렉트 충돌을 해결하기 위해 `public/oauth-redirect.html` 도입
  - Supabase가 카카오 인증 후 이 페이지로 리다이렉트 → 세션을 localStorage에 저장 → `/#/`로 이동
- 카카오 개발자 콘솔 Redirect URI: `https://lpdijndoqijhhkwicwoy.supabase.co/auth/v1/callback`

#### Auth 상태 관리
- `src/context/AuthContext.jsx` — `user`, `profile`, `isAdmin`, 로그인/로그아웃 함수 전역 제공
- `src/main.jsx`에 `<AuthProvider>` 추가
- `src/components/PrivateRoute.jsx` — 비로그인 시 `/login`으로 리다이렉트

### 3. 헤더 UI 업데이트

- 데스크톱: 로그인 버튼 / 로그인 시 닉네임 + 로그아웃 드롭다운
- 모바일: 슬라이드 메뉴 하단에 로그인·회원가입 버튼 / 로그인 시 닉네임 + 로그아웃
- 네비게이션에 **게시판** 항목 추가 (`/board`)
- 게시판 경로 활성화 상태(`isBoardActive`) 별도 처리

### 4. 게시판 (Board)

#### 라우트 구조
| 경로 | 컴포넌트 | 설명 |
|------|---------|------|
| `/board` | redirect | `/board/free`로 이동 |
| `/board/:category` | `BoardList` | 카테고리별 목록 |
| `/board/post/:id` | `BoardDetail` | 게시글 상세 + 댓글 |
| `/board/write` | `BoardWrite` | 글쓰기 (로그인 필요) |
| `/board/edit/:id` | `BoardWrite` | 글 수정 (작성자/관리자) |

#### 카테고리
- **공지사항** (`notice`) — 관리자만 작성
- **질문게시판** (`question`) — 로그인 유저 작성
- **자유게시판** (`free`) — 로그인 유저 작성

#### 기능 상세
- 목록: 제목·작성자·조회수·날짜·댓글수 표시, 15개 단위 페이지네이션
- 상세: 조회수 자동 증가, 수정·삭제 버튼 (본인·관리자만 노출)
- 댓글: 등록·수정·삭제, 비로그인 시 로그인 유도 메시지
- 수정 진입 시 본인/관리자 여부 서버 확인 후 리다이렉트

### 5. Supabase DB 스키마

`supabase/schema.sql`로 분리 관리. 멱등성 보장(여러 번 실행 가능).

#### 테이블 (접두사 `ail_`)
| 테이블 | 설명 |
|--------|------|
| `ail_profiles` | 사용자 프로필 (역할: user/admin) |
| `ail_board_categories` | 게시판 카테고리 |
| `ail_posts` | 게시글 |
| `ail_comments` | 댓글 |

#### 주요 설계 결정
- `ail_posts.author_id`가 `ail_profiles.id`를 직접 참조 → Supabase PostgREST 자동 조인 지원
- `ail_increment_view_count()` 함수: SECURITY DEFINER로 RLS 우회 후 조회수 증가
- 댓글 수는 INSERT/DELETE 트리거로 `ail_posts.comment_count` 자동 집계
- 회원가입 트리거: `auth.users` INSERT 시 `ail_profiles` 자동 생성 (닉네임은 메타데이터에서 추출)

---

## 트러블슈팅

### 이메일 회원가입 실패 (email rate limit exceeded)

**원인**: 동일 이메일로 여러 번 가입 시도 → Supabase 무료 플랜 이메일 발송 한도(시간당 3회) 초과  
**해결**: Supabase → Authentication → Providers → Email → **Confirm email OFF**  
**비고**: 개발/테스트 중에는 인증 메일 비활성화 권장. 운영 전 재활성화 필요.

### 카카오 로그인 KOE205 (동의항목 미설정)

**원인 1**: Supabase GoTrue가 카카오 OAuth 요청 시 `account_email` 스코프를 서버 측에서 기본으로 포함시킴. 클라이언트 코드에서 스코프를 제거해도 GoTrue가 다시 추가하는 구조.  
**원인 2**: 카카오 개발자 콘솔 동의항목에서 `account_email`이 비활성 상태.  
**해결**:
- 카카오 개발자 콘솔 → **비즈 앱 개인 개발자 전환** (사업자 번호 불필요, 개인 개발자 가능)
- `카카오계정(이메일)` → **선택 동의** 활성화
- `프로필 사진` → **선택 동의** 활성화
- Supabase → Authentication → Providers → Kakao → **Allow users without an email ON** (이메일 제공 거부 시에도 로그인 가능)

### 카카오 로그인 KOE006 (Redirect URI 미등록)

**원인**: 카카오 개발자 콘솔에서 Redirect URI를 **로그아웃** 섹션에만 등록하고 **로그인** 섹션에 미등록  
**해결**: 카카오 로그인 → **Redirect URI** (로그인용 섹션) → `https://lpdijndoqijhhkwicwoy.supabase.co/auth/v1/callback` 등록

### 관리자 계정 설정

Supabase SQL Editor에서 직접 실행:
```sql
UPDATE public.ail_profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
```

---

## 파일 목록

### 신규 생성
```
src/lib/supabase.js
src/context/AuthContext.jsx
src/components/PrivateRoute.jsx
src/pages/Login.jsx
src/pages/Register.jsx
src/pages/board/BoardList.jsx
src/pages/board/BoardDetail.jsx
src/pages/board/BoardWrite.jsx
public/oauth-redirect.html
supabase/schema.sql
```

### 수정
```
package.json / package-lock.json   — @supabase/supabase-js 추가
src/main.jsx                       — AuthProvider 래핑
src/App.jsx                        — 인증·게시판 라우트 추가
src/components/Header.jsx          — 로그인 UI, 게시판 네비 추가
src/data/site.js                   — navMenu에 게시판 항목 추가
```

---

## 최종 동작 확인

- [x] 이메일 회원가입 / 로그인
- [x] 카카오 로그인 (닉네임·프로필 사진 연동)
- [x] 로그인 후 헤더 닉네임 표시
- [x] 게시판 목록·상세·글쓰기·댓글
- [x] 관리자 계정 공지사항 작성
- [x] GitHub Pages 배포

---

## Supabase 대시보드 설정 (수동 완료)

- [x] SQL Editor에서 `supabase/schema.sql` 실행
- [x] Authentication → Providers → Kakao 활성화
  - REST API Key 등록
  - Client Secret 등록
  - Allow users without an email → ON
- [x] 카카오 개발자 콘솔 → 비즈 앱 개인 개발자 전환
- [x] 카카오 동의항목: 닉네임(필수), 프로필 사진(선택), 이메일(선택) 설정
- [x] 카카오 Redirect URI 등록 (로그인용 섹션)
- [x] Supabase Redirect URLs 추가: `https://eclipticwin.github.io/rest04/oauth-redirect.html`
- [x] Authentication → Email → Confirm email OFF (개발 중)
- [x] 관리자 계정 SQL 실행
