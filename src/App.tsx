import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AIBackground from './AIBackground'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import SkillsSection from './components/SkillsSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'

const NAV_ITEMS = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'عني', href: '#about' },
  { label: 'المهارات', href: '#skills' },
  { label: 'المشاريع', href: '#projects' },
  { label: 'تواصل', href: '#contact' },
]

function MainSite() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [navOpen, setNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { scrollYProgress } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useEffect(() => {
    const ids = ['hero', 'about', 'skills', 'projects', 'contact']
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.3 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Dynamic Canvas Background */}
      <AIBackground />

      {/* Custom Glow Cursor (Desktop) */}
      <div
        className="fixed pointer-events-none z-[9999] hidden md:block"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: 'translate(-50%, -50%)',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'var(--primary)',
          boxShadow: '0 0 20px var(--primary)',
          transition: 'left 0.06s, top 0.06s',
          mixBlendMode: 'difference',
        }}
      />

      {/* Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-0.5 z-[60]"
        style={{
          width: progressWidth,
          background: 'linear-gradient(90deg, #00d4ff, #7928ca, #ff2d78)',
        }}
      />

      {/* Header Navbar */}
      <Navbar
        navItems={NAV_ITEMS}
        activeSection={activeSection}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />

      {/* Page Sections */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection mouse={mouse} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
