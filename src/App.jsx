import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'

import Home from './pages/Home'
import Videos from './pages/Videos'
import About from './pages/About'
import Curriculum from './pages/Curriculum'
import Contact from './pages/Contact'
import SimplePage from './pages/SimplePage'

export default function App() {
  return (
    <div className="min-w-[320px] flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Videos with category routing */}
          <Route path="/videos" element={<Navigate to="/videos/ai-basics" replace />} />
          <Route path="/videos/:category" element={<Videos />} />

          {/* About with tab routing */}
          <Route path="/about" element={<Navigate to="/about/intro" replace />} />
          <Route path="/about/:tab" element={<About />} />

          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/contact" element={<Contact />} />

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
