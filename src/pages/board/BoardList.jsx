import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const CATEGORIES = [
  { slug: 'notice', name: '공지사항', adminOnly: true },
  { slug: 'question', name: '질문게시판', adminOnly: false },
  { slug: 'free', name: '자유게시판', adminOnly: false },
]

const PAGE_SIZE = 15

export default function BoardList() {
  const { category = 'free' } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()

  const [catId, setCatId] = useState(null)
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const cat = CATEGORIES.find((c) => c.slug === category) || CATEGORIES[2]
  const canWrite = user && (!cat.adminOnly || isAdmin)

  useEffect(() => {
    setPage(1)
    supabase
      .from('ail_board_categories')
      .select('id')
      .eq('slug', category)
      .single()
      .then(({ data }) => setCatId(data?.id ?? null))
  }, [category])

  useEffect(() => {
    if (!catId) return
    fetchPosts()
  }, [catId, page])

  async function fetchPosts() {
    setLoading(true)
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count, error } = await supabase
      .from('ail_posts')
      .select(
        `id, title, view_count, comment_count, is_pinned, created_at,
         author:ail_profiles!author_id(nickname)`,
        { count: 'exact' }
      )
      .eq('category_id', catId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (!error) {
      setPosts(data || [])
      setTotal(count || 0)
    }
    setLoading(false)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen pb-16 pt-20">
      <div className="container-wrap section-x">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-navy-700 dark:hover:text-sky-light">홈</Link>
          <span>/</span>
          <span className="font-semibold text-navy-900 dark:text-white">{cat.name}</span>
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="section-title">{cat.name}</h1>
          {canWrite && (
            <Link to={`/board/write?cat=${category}`} className="btn-primary px-5 py-2.5 text-sm">
              글쓰기
            </Link>
          )}
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-navy-700">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => navigate(`/board/${c.slug}`)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                category === c.slug
                  ? 'border-navy-700 text-navy-700 dark:border-sky-light dark:text-sky-light'
                  : 'border-transparent text-gray-500 hover:text-navy-700 dark:text-gray-400 dark:hover:text-sky-light'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Post List */}
        <div className="card overflow-hidden">
          <div className="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-navy-700 dark:bg-navy-900/50 md:grid md:grid-cols-[1fr_5rem_5rem_7rem]">
            {['제목', '작성자', '조회', '날짜'].map((h) => (
              <span key={h} className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 last:text-center [&:not(:first-child)]:text-center">
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-700 border-t-transparent" />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="mb-2 text-3xl">📭</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">아직 게시글이 없습니다.</p>
              {canWrite && (
                <Link to={`/board/write?cat=${category}`} className="mt-3 inline-block text-sm font-semibold text-sky hover:underline">
                  첫 글을 작성해보세요
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/board/post/${post.id}`)}
                className="cursor-pointer border-b border-gray-100 px-6 py-4 transition-colors last:border-0 hover:bg-gray-50 dark:border-navy-700 dark:hover:bg-navy-800/50 md:grid md:grid-cols-[1fr_5rem_5rem_7rem] md:gap-4 md:items-center"
              >
                <div className="flex min-w-0 items-center gap-2">
                  {post.is_pinned && (
                    <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      공지
                    </span>
                  )}
                  <span className="truncate text-sm font-semibold text-navy-900 hover:text-sky dark:text-white dark:hover:text-sky-light">
                    {post.title}
                  </span>
                  {post.comment_count > 0 && (
                    <span className="shrink-0 text-xs font-bold text-sky dark:text-sky-light">
                      [{post.comment_count}]
                    </span>
                  )}
                </div>
                <span className="mt-1 block truncate text-xs text-gray-500 dark:text-gray-400 md:mt-0 md:text-center">
                  {post.author?.nickname || '알 수 없음'}
                </span>
                <span className="hidden text-center text-xs text-gray-400 dark:text-gray-500 md:block">
                  {post.view_count}
                </span>
                <span className="mt-1 block text-xs text-gray-400 dark:text-gray-500 md:mt-0 md:text-center">
                  {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-navy-800"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
              .map((p, idx, arr) => {
                const gap = idx > 0 && p - arr[idx - 1] > 1
                return (
                  <span key={p} className="flex items-center gap-1">
                    {gap && <span className="px-1 text-gray-400">…</span>}
                    <button
                      onClick={() => setPage(p)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                        page === p
                          ? 'bg-navy-700 text-white'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-navy-800'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                )
              })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-navy-800"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
