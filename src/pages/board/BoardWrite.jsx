import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const CATEGORIES = [
  { slug: 'notice', name: '공지사항', adminOnly: true },
  { slug: 'question', name: '질문게시판', adminOnly: false },
  { slug: 'free', name: '자유게시판', adminOnly: false },
]

export default function BoardWrite() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()

  const isEdit = Boolean(id)
  const defaultCat = searchParams.get('cat') || 'free'

  const [form, setForm] = useState({ title: '', content: '', categorySlug: defaultCat })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) navigate('/login', { replace: true })
  }, [user])

  useEffect(() => {
    if (isEdit) loadPost()
  }, [id])

  async function loadPost() {
    const { data } = await supabase
      .from('ail_posts')
      .select('*, category:ail_board_categories!category_id(slug)')
      .eq('id', id)
      .single()
    if (!data) {
      navigate('/board/free', { replace: true })
      return
    }
    if (data.author_id !== user?.id && !isAdmin) {
      navigate(`/board/post/${id}`, { replace: true })
      return
    }
    setForm({ title: data.title, content: data.content, categorySlug: data.category?.slug || 'free' })
  }

  const allowedCats = CATEGORIES.filter((c) => !c.adminOnly || isAdmin)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.title.trim() || !form.content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }

    setLoading(true)

    const { data: catData } = await supabase
      .from('ail_board_categories')
      .select('id, admin_only')
      .eq('slug', form.categorySlug)
      .single()

    if (!catData) {
      setError('카테고리를 찾을 수 없습니다.')
      setLoading(false)
      return
    }

    if (catData.admin_only && !isAdmin) {
      setError('해당 카테고리에는 관리자만 게시글을 작성할 수 있습니다.')
      setLoading(false)
      return
    }

    if (isEdit) {
      const { error: updateError } = await supabase
        .from('ail_posts')
        .update({
          title: form.title.trim(),
          content: form.content.trim(),
          category_id: catData.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) {
        setError('수정에 실패했습니다.')
        setLoading(false)
        return
      }
      navigate(`/board/post/${id}`)
    } else {
      const { data: newPost, error: insertError } = await supabase
        .from('ail_posts')
        .insert({
          title: form.title.trim(),
          content: form.content.trim(),
          category_id: catData.id,
          author_id: user.id,
        })
        .select('id')
        .single()

      if (insertError) {
        setError('게시글 등록에 실패했습니다.')
        setLoading(false)
        return
      }
      navigate(`/board/post/${newPost.id}`)
    }
  }

  return (
    <div className="min-h-screen pb-16 pt-20">
      <div className="container-wrap section-x max-w-3xl">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/board/free" className="hover:text-navy-700 dark:hover:text-sky-light">게시판</Link>
          <span>/</span>
          <span className="font-semibold text-navy-900 dark:text-white">{isEdit ? '글 수정' : '글쓰기'}</span>
        </div>

        <h1 className="section-title mb-8">{isEdit ? '글 수정' : '글쓰기'}</h1>

        <form onSubmit={handleSubmit} className="card space-y-5 p-6 md:p-8">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              카테고리
            </label>
            <select
              value={form.categorySlug}
              onChange={(e) => setForm((prev) => ({ ...prev, categorySlug: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
            >
              {allowedCats.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              제목
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
              placeholder="제목을 입력하세요"
              maxLength={100}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              내용
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              required
              placeholder="내용을 입력하세요"
              rows={14}
              className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-navy-600 dark:text-gray-400 dark:hover:bg-navy-800"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '처리 중...' : isEdit ? '수정하기' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
