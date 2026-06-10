import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'
import PrivateRoute from './components/PrivateRoute'

import Home from './pages/Home'
import Videos from './pages/Videos'
import About from './pages/About'
import Curriculum from './pages/Curriculum'
import Contact from './pages/Contact'
import SimplePage from './pages/SimplePage'
import Login from './pages/Login'
import Register from './pages/Register'
import BoardList from './pages/board/BoardList'
import BoardDetail from './pages/board/BoardDetail'
import BoardWrite from './pages/board/BoardWrite'

export default function App() {
  return (
    <div className="flex min-h-screen min-w-[320px] flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/videos" element={<Navigate to="/videos/ai-basics" replace />} />
          <Route path="/videos/:category" element={<Videos />} />

          <Route path="/about" element={<Navigate to="/about/intro" replace />} />
          <Route path="/about/:tab" element={<About />} />

          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Board */}
          <Route path="/board" element={<Navigate to="/board/free" replace />} />
          <Route path="/board/:category" element={<BoardList />} />
          <Route path="/board/post/:id" element={<BoardDetail />} />
          <Route path="/board/write" element={<PrivateRoute><BoardWrite /></PrivateRoute>} />
          <Route path="/board/edit/:id" element={<PrivateRoute><BoardWrite /></PrivateRoute>} />

          <Route path="/privacy" element={<SimplePage title="개인정보처리방침" />} />
          <Route path="/terms" element={<SimplePage title="이용약관" />} />
          <Route path="*" element={<SimplePage title="페이지를 찾을 수 없습니다" />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}
