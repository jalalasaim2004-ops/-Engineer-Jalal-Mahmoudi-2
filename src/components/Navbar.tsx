import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

interface NavItem {
  labelKey: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', href: '#hero' },
  { labelKey: 'nav.about', href: '#about' },
  { labelKey: 'nav.skills', href: '#skills' },
  { labelKey: 'nav.projects', href: '#projects' },
  { labelKey: 'nav.articles', href: '#articles' },
  { labelKey: 'nav.contact', href: '#contact' },
]

interface NavbarProps {
  activeSection: string
  navOpen: boolean
  setNavOpen: (open: boolean) => void
}

export default function Navbar({ activeSection, navOpen, setNavOpen }: NavbarProps) {
  const { lang, setLang, t } = useLanguage()

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar')
  }

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 glass"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span
            className="font-black text-xl tracking-widest cursor-pointer"
            style={{
              fontFamily: 'var(--font-orbitron)',
              background: 'linear-gradient(90deg, #00d4ff, #7928ca)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            JM
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border border-[rgba(0,212,255,0.3)] text-[#00d4ff] bg-[rgba(0,212,255,0.08)]">
            v3.0 Pro
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.href.slice(1)
            return (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-all duration-200 relative"
                style={{
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                  textDecoration: 'none',
                }}
              >
                {t(item.labelKey)}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 right-0 left-0 h-px"
                    style={{ background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}
                  />
                )}
              </a>
            )
          })}
        </div>

        {/* Language Switcher & Quick Contact */}
        <div className="flex items-center gap-3">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--foreground)',
            }}
            title="تبديل اللغة / Switch Language"
          >
            <span className="text-[10px] text-[#00d4ff]">🌐</span>
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Quick Action CTA */}
          <a
            href="#contact"
            className="hidden sm:inline-block text-xs font-semibold px-4 py-2 rounded-lg transition-all"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.3)',
              color: 'var(--primary)',
              textDecoration: 'none',
            }}
          >
            {t('nav.contact')}
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Toggle Menu"
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="h-px w-6"
                animate={{
                  rotate: navOpen && i === 0 ? 45 : navOpen && i === 2 ? -45 : 0,
                  y: navOpen && i === 0 ? 6 : navOpen && i === 2 ? -6 : 0,
                  opacity: navOpen && i === 1 ? 0 : 1,
                  width: navOpen && i === 1 ? 0 : 24,
                }}
                style={{ background: 'var(--foreground)', transformOrigin: 'center' }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 px-6 py-6 flex flex-col gap-4"
          >
            {NAV_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setNavOpen(false)}
                className="text-base font-semibold py-2 text-gray-200 hover:text-[#00d4ff] transition-colors"
              >
                {t(item.labelKey)}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
