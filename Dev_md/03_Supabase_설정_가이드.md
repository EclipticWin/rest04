# Supabase 설정 가이드 (게시판 + 로그인)

## 0. 기존 테이블 삭제 (재설치 시)

```sql
DROP TABLE IF EXISTS public.ail_comments       CASCADE;
DROP TABLE IF EXISTS public.ail_posts          CASCADE;
DROP TABLE IF EXISTS public.ail_board_categories CASCADE;
DROP TABLE IF EXISTS public.ail_profiles       CASCADE;

DROP FUNCTION IF EXISTS public.ail_handle_new_user()         CASCADE;
DROP FUNCTION IF EXISTS public.ail_handle_comment_count()    CASCADE;
DROP FUNCTION IF EXISTS public.ail_increment_view_count(BIGINT) CASCADE;
```

---

## 1. Supabase SQL Editor에서 실행할 스키마

Supabase 대시보드 → SQL Editor → New query 에 아래 SQL 전체를 붙여넣고 실행하세요.

```sql
-- ============================================================
-- 1. 프로필 테이블
-- ============================================================
CREATE TABLE public.ail_profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname    TEXT        NOT NULL DEFAULT 'User',
  avatar_url  TEXT,
  role        TEXT        NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  provider    TEXT        DEFAULT 'email',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. 게시판 카테고리
-- ============================================================
CREATE TABLE public.ail_board_categories (
  id          SERIAL      PRIMARY KEY,
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  description TEXT        DEFAULT '',
  admin_only  BOOLEAN     DEFAULT FALSE,
  sort_order  INT         DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.ail_board_categories (name, slug, description, admin_only, sort_order) VALUES
  ('공지사항',   'notice',   '운영진 공지사항',              TRUE,  1),
  ('질문게시판', 'question', 'AI 학습 관련 질문을 남겨보세요', FALSE, 2),
  ('자유게시판', 'free',     '자유롭게 이야기 나눠요',         FALSE, 3);

-- ============================================================
-- 3. 게시글
-- ============================================================
CREATE TABLE public.ail_posts (
  id            BIGSERIAL   PRIMARY KEY,
  title         TEXT        NOT NULL,
  content       TEXT        NOT NULL,
  category_id   INT         REFERENCES public.ail_board_categories(id) ON DELETE SET NULL,
  author_id     UUID        NOT NULL REFERENCES public.ail_profiles(id) ON DELETE CASCADE,
  view_count    INT         DEFAULT 0,
  comment_count INT         DEFAULT 0,
  is_pinned     BOOLEAN     DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. 댓글
-- ============================================================
CREATE TABLE public.ail_comments (
  id          BIGSERIAL   PRIMARY KEY,
  post_id     BIGINT      NOT NULL REFERENCES public.ail_posts(id) ON DELETE CASCADE,
  author_id   UUID        NOT NULL REFERENCES public.ail_profiles(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. 이전 버전 트리거/함수 잔존 시 정리 (안전하게 먼저 실행)
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_comment_count() CASCADE;
DROP FUNCTION IF EXISTS public.increment_view_count(BIGINT) CASCADE;

-- ============================================================
-- 6. 회원가입 시 프로필 자동 생성 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION public.ail_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.ail_profiles (id, nickname, avatar_url, provider)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'nickname',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER ail_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.ail_handle_new_user();

-- ============================================================
-- 7. 댓글 수 자동 카운트 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION public.ail_handle_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.ail_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.ail_posts SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER ail_on_comment_change
  AFTER INSERT OR DELETE ON public.ail_comments
  FOR EACH ROW EXECUTE FUNCTION public.ail_handle_comment_count();

-- ============================================================
-- 8. 조회수 증가 함수 (RLS 우회용)
-- ============================================================
CREATE OR REPLACE FUNCTION public.ail_increment_view_count(post_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.ail_posts SET view_count = view_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 함수 실행 권한 명시적 부여 (anon/authenticated 둘 다)
GRANT EXECUTE ON FUNCTION public.ail_increment_view_count(BIGINT) TO anon, authenticated;

-- ============================================================
-- 9. RLS 활성화
-- ============================================================
ALTER TABLE public.ail_profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ail_board_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ail_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ail_comments          ENABLE ROW LEVEL SECURITY;

-- ail_profiles
CREATE POLICY "ail_profiles_select" ON public.ail_profiles FOR SELECT USING (true);
CREATE POLICY "ail_profiles_insert" ON public.ail_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "ail_profiles_update" ON public.ail_profiles FOR UPDATE USING (auth.uid() = id);

-- ail_board_categories (누구나 읽기)
CREATE POLICY "ail_categories_select" ON public.ail_board_categories FOR SELECT USING (true);

-- ail_posts
CREATE POLICY "ail_posts_select" ON public.ail_posts FOR SELECT USING (true);
CREATE POLICY "ail_posts_insert" ON public.ail_posts FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    NOT (SELECT admin_only FROM public.ail_board_categories WHERE id = category_id)
    OR (SELECT role FROM public.ail_profiles WHERE id = auth.uid()) = 'admin'
  )
);
CREATE POLICY "ail_posts_update" ON public.ail_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "ail_posts_delete" ON public.ail_posts FOR DELETE USING (
  auth.uid() = author_id OR
  (SELECT role FROM public.ail_profiles WHERE id = auth.uid()) = 'admin'
);

-- ail_comments
CREATE POLICY "ail_comments_select" ON public.ail_comments FOR SELECT USING (true);
CREATE POLICY "ail_comments_insert" ON public.ail_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "ail_comments_update" ON public.ail_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "ail_comments_delete" ON public.ail_comments FOR DELETE USING (
  auth.uid() = author_id OR
  (SELECT role FROM public.ail_profiles WHERE id = auth.uid()) = 'admin'
);
```

---

## 2. 카카오 OAuth 설정

### Supabase 대시보드 설정
1. Authentication → **Providers** → **Kakao** Enable ON
2. 입력값:
   - **Client ID**: 카카오 개발자 콘솔 > 앱 키 > **REST API 키**
   - **Client Secret**: 카카오 개발자 콘솔 > 보안 > Client Secret 발급
3. Callback URL 복사: `https://lpdijndoqijhhkwicwoy.supabase.co/auth/v1/callback`

### 카카오 개발자 콘솔 설정
1. 카카오 로그인 → 활성화 ON
2. Redirect URI 등록: `https://lpdijndoqijhhkwicwoy.supabase.co/auth/v1/callback`
3. 동의항목: 닉네임(필수), 카카오계정(이메일)(선택)

### Supabase Redirect URL 허용
Authentication → URL Configuration → Redirect URLs 추가:
- `https://eclipticwin.github.io/rest04/oauth-redirect.html`
- `http://localhost:5173/rest04/oauth-redirect.html`

---

## 3. 관리자 계정 설정

```sql
UPDATE public.ail_profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
```

---

## 4. 이메일 인증 끄기 (개발 중 편의)

Authentication → Email → **Confirm email** 토글 OFF
