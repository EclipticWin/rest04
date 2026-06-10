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
- 카카오 개발자 콘솔에서 Redirect URI 등록 필요: `https://lpdijndoqijhhkwicwoy.supabase.co/auth/v1/callback`

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
- `ail_increment_view_count()` 함수: SECURITY DEFINER로 RLS 우회 후 조회수 증가, anon/authenticated 롤에 EXECUTE 권한 부여
- 댓글 수는 INSERT/DELETE 트리거로 `ail_posts.comment_count` 자동 집계
- 회원가입 트리거: `auth.users` INSERT 시 `ail_profiles` 자동 생성 (닉네임은 메타데이터에서 추출)

#### RLS 정책 요약
- 게시글·댓글 읽기: 비로그인 포함 전체 허용
- 게시글 쓰기: 로그인 필수, 공지 카테고리는 admin만
- 수정: 본인만 / 삭제: 본인 또는 admin

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

## 남은 설정 (수동)

1. Supabase SQL Editor에서 `supabase/schema.sql` 실행
2. Supabase Auth → Providers → Kakao 활성화 (REST API 키 + Client Secret)
3. 카카오 개발자 콘솔 → Redirect URI 등록
4. Supabase Auth → URL Configuration → Redirect URLs 추가
5. 관리자 계정: `schema.sql` 하단 주석 해제 후 이메일 변경 실행
