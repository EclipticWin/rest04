import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function BoardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile, isAdmin } = useAuth()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    fetchPost()
    fetchComments()
    supabase.rpc('ail_increment_view_count', { post_id: parseInt(id) })
  }, [id])

  async function fetchPost() {
    const { data, error } = await supabase
      .from('ail_posts')
      .select(`
        *,
        author:ail_profiles!author_id(id, nickname, role),
        category:ail_board_categories!category_id(id, name, slug)
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      navigate('/board/free', { replace: true })
      return
    }
    setPost(data)
    setLoading(false)
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('ail_comments')
      .select(`*, author:ail_profiles!author_id(id, nickname)`)
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    setComments(data || [])
  }

  async function handleDeletePost() {
    if (!confirm('게시글을 삭제하시겠습니까?')) return
    await supabase.from('ail_posts').delete().eq('id', id)
    navigate(`/board/${post?.category?.slug || 'free'}`)
  }

  async function handleCommentSubmit(e) {
    e.preventDefault()
    if (!commentText.trim() || !user) return
    setSubmitting(true)
    await supabase.from('ail_comments').insert({
      post_id: parseInt(id),
      author_id: user.id,
      content: commentText.trim(),
    })
    setCommentText('')
    fetchComments()
    setSubmitting(false)
  }

  async function handleCommentUpdate(commentId) {
    if (!editText.trim()) return
    await supabase.from('ail_comments').update({ content: editText.trim() }).eq('id', commentId)
    setEditingId(null)
    setEditText('')
    fetchComments()
  }

  async function handleCommentDelete(commentId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) return
    await supabase.from('ail_comments').delete().eq('id', commentId)
    fetchComments()
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-700 border-t-transparent" />
      </div>
    )
  }

  const catSlug = post?.category?.slug || 'free'
  const catName = post?.category?.name || '게시판'
  const isAuthor = user?.id === post?.author?.id
  const canEdit = isAuthor || isAdmin

  function Avatar({ name }) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-100 text-sm font-bold text-navy-700 dark:bg-navy-700 dark:text-sky-light">
        {name?.charAt(0).toUpperCase() || '?'}
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16 pt-20">
      <div className="container-wrap section-x max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-navy-700 dark:hover:text-sky-light">홈</Link>
          <span>/</span>
          <Link to={`/board/${catSlug}`} className="hover:text-navy-700 dark:hover:text-sky-light">{catName}</Link>
          <span>/</span>
          <span className="max-w-xs truncate font-semibold text-navy-900 dark:text-white">{post.title}</span>
        </div>

        {/* Post */}
        <article className="card mb-6 p-6 md:p-8">
          <div className="mb-4">
            <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy-700 dark:bg-navy-800 dark:text-sky-light">
              {catName}
            </span>
          </div>

          <h1 className="mb-4 text-2xl font-bold text-navy-900 dark:text-white md:text-3xl">
            {post.title}
          </h1>

          <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-navy-700">
            <div className="flex items-center gap-3">
              <Avatar name={post.author?.nickname} />
              <div>
                <p className="text-sm font-semibold text-navy-900 dark:text-white">
                  {post.author?.nickname || '알 수 없음'}
                  {post.author?.role === 'admin' && (
                    <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      관리자
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(post.created_at).toLocaleString('ko-KR')} · 조회 {post.view_count}
                </p>
              </div>
            </div>

            {canEdit && (
              <div className="flex gap-2">
                <Link
                  to={`/board/edit/${id}`}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-navy-600 dark:text-gray-400 dark:hover:bg-navy-800"
                >
                  수정
                </Link>
                <button
                  onClick={handleDeletePost}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          <div className="py-6 text-sm leading-7 text-gray-700 whitespace-pre-wrap dark:text-gray-300">
            {post.content}
          </div>

          <div className="border-t border-gray-200 pt-4 dark:border-navy-700">
            <Link
              to={`/board/${catSlug}`}
              className="text-sm font-semibold text-gray-500 transition-colors hover:text-navy-700 dark:text-gray-400 dark:hover:text-sky-light"
            >
              ← 목록으로
            </Link>
          </div>
        </article>

        {/* Comments */}
        <section className="card p-6 md:p-8">
          <h2 className="mb-6 text-lg font-bold text-navy-900 dark:text-white">
            댓글{' '}
            <span className="text-sky dark:text-sky-light">{comments.length}</span>
          </h2>

          <div className="mb-6 space-y-5">
            {comments.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
              </p>
            ) : (
              comments.map((comment) => {
                const isMine = user?.id === comment.author?.id
                const canManage = isMine || isAdmin
                const isEditing = editingId === comment.id

                return (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar name={comment.author?.nickname} />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-semibold text-navy-900 dark:text-white">
                          {comment.author?.nickname || '알 수 없음'}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(comment.created_at).toLocaleString('ko-KR')}
                        </span>
                        {canManage && !isEditing && (
                          <div className="ml-auto flex gap-2">
                            {isMine && (
                              <button
                                onClick={() => { setEditingId(comment.id); setEditText(comment.content) }}
                                className="text-xs text-gray-400 transition-colors hover:text-navy-700 dark:hover:text-sky-light"
                              >
                                수정
                              </button>
                            )}
                            <button
                              onClick={() => handleCommentDelete(comment.id)}
                              className="text-xs text-gray-400 transition-colors hover:text-red-500"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="flex gap-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleCommentUpdate(comment.id)}
                              className="rounded-lg bg-navy-700 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-navy-600"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-800"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {user ? (
            <form onSubmit={handleCommentSubmit} className="flex gap-3">
              <Avatar name={profile?.nickname || user.email} />
              <div className="flex flex-1 gap-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/50 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="btn-primary self-end px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  등록
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl bg-gray-50 py-5 text-center dark:bg-navy-900/50">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                댓글을 작성하려면 로그인이 필요합니다.
              </p>
              <Link to="/login" className="text-sm font-semibold text-sky hover:underline">
                로그인하기
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
