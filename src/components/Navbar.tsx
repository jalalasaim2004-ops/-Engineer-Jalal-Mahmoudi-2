import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  navItems: NavItem[]
  activeSection: string
  navOpen: boolean
  setNavOpen: (open: boolean) => void
}

export default function Navbar({ navItems, activeSection, navOpen, setNavOpen }: NavbarProps) {
  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 glass"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
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
            v2.5 Pro
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-all duration-200 relative"
              style={{
                color: activeSection === l.href.slice(1) ? 'var(--primary)' : 'var(--muted-foreground)',
                textDecoration: 'none',
                fontFamily: 'var(--font-cairo)',
              }}
            >
              {l.label}
              {activeSection === l.href.slice(1) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 right-0 left-0 h-px"
                  style={{ background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}
                />
              )}
            </a>
          ))}
        </div>

        {/* CTA & Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-all"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.3)',
              color: 'var(--primary)',
              textDecoration: 'none',
            }}
          >
            تواصل سريع
          </a>
        </div>

        {/* Mobile Toggle Button */}
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

      {/* Mobile Drawer */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid var(--border)', background: 'rgba(4, 5, 15, 0.95)' }}
          >
            <div className="flex flex-col gap-4 px-6 py-5">
              {navItems.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium transition-colors"
                  style={{
                    color: activeSection === l.href.slice(1) ? 'var(--primary)' : 'var(--foreground)',
                    textDecoration: 'none',
                  }}
                  onClick={() => setNavOpen(false)}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
