import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Project {
  title: string
  desc: string
  stack: string[]
  gradient: string
  glow: string
  year: string
  category: 'all' | 'ai' | 'systems' | 'web'
}

const PROJECTS: Project[] = [
  {
    title: 'منصة إدارة المشاريع الهندسية',
    desc: 'نظام متكامل يدعم فرقًا متعددة مع تتبع المهام في الوقت الفعلي وتحليلات متقدمة.',
    stack: ['Python', 'Django', 'React', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, #00d4ff22, #7928ca22)',
    glow: '#00d4ff',
    year: '2024',
    category: 'web',
  },
  {
    title: 'نظام كشف الشذوذات بالذكاء الاصطناعي',
    desc: 'محرك LSTM يرصد الأنماط غير الطبيعية في حركة الشبكة بدقة 97.3٪.',
    stack: ['TensorFlow', 'Kafka', 'Python', 'InfluxDB'],
    gradient: 'linear-gradient(135deg, #7928ca22, #ff2d7822)',
    glow: '#7928ca',
    year: '2024',
    category: 'ai',
  },
  {
    title: 'بوابة التوظيف الحكومي',
    desc: 'منصة رقمية تربط 40,000+ مرشح بالوظائف الحكومية مع تقييم آلي للخبرات.',
    stack: ['FastAPI', 'React', 'Docker', 'AWS'],
    gradient: 'linear-gradient(135deg, #ff2d7822, #00d4ff22)',
    glow: '#ff2d78',
    year: '2023',
    category: 'web',
  },
  {
    title: 'محرك توصيات المحتوى الضخم',
    desc: 'خوارزمية تصفية تعاونية على ملايين نقاط البيانات بزمن استجابة أقل من 50ms.',
    stack: ['Spark', 'Elasticsearch', 'Python', 'Redis'],
    gradient: 'linear-gradient(135deg, #00d4ff22, #ff2d7822)',
    glow: '#00d4ff',
    year: '2023',
    category: 'systems',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function Card3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.1s ease',
  })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotX = ((y - cy) / cy) * -10
    const rotY = ((x - cx) / cx) * 10
    setStyle({
      transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`,
      transition: 'transform 0.1s ease',
    })
  }

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={handleMouse}
      onMouseLeave={() =>
        setStyle({
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
          transition: 'transform 0.4s ease',
        })
      }
    >
      {children}
    </div>
  )
}

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'systems' | 'web'>('all')

  const categories = [
    { id: 'all', label: 'كافة المشاريع' },
    { id: 'ai', label: 'الذكاء الاصطناعي' },
    { id: 'systems', label: 'الأنظمة الموزعة' },
    { id: 'web', label: 'تطبيقات الويب' },
  ]

  const filteredProjects = activeCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory)

  return (
    <motion.section
      id="projects"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="text-xs font-mono mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              03 / المشاريع
            </p>
            <h2
              className="font-black text-4xl"
              style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
            >
              نماذج من أعمالي
            </h2>
          </div>

          {/* Categories Filter Tabs */}
          <div className="flex flex-wrap gap-2 glass p-1.5 rounded-xl border border-[var(--border)]">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id as any)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg transition-all"
                style={{
                  background: activeCategory === c.id ? 'var(--primary)' : 'transparent',
                  color: activeCategory === c.id ? '#04050f' : 'var(--muted-foreground)',
                  fontWeight: activeCategory === c.id ? 700 : 500,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p) => (
              <motion.div
                key={p.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card3D>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="glass relative overflow-hidden p-6 h-full flex flex-col justify-between"
                    style={{
                      borderRadius: 'var(--radius)',
                      border: `1px solid ${p.glow}30`,
                      background: p.gradient,
                      minHeight: 240,
                    }}
                  >
                    {/* Glow orb */}
                    <div
                      className="absolute -top-12 -left-12 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
                      style={{ background: p.glow }}
                    />

                    <div>
                      <div className="flex justify-between items-start mb-4 relative">
                        <span
                          className="text-xs font-mono px-2.5 py-1"
                          style={{
                            color: p.glow,
                            border: `1px solid ${p.glow}50`,
                            borderRadius: '6px',
                            background: `${p.glow}15`,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {p.year}
                        </span>
                        <motion.div
                          whileHover={{ rotate: 45, scale: 1.2 }}
                          className="w-7 h-7 flex items-center justify-center rounded-full"
                          style={{ border: `1px solid ${p.glow}40`, color: p.glow, cursor: 'pointer' }}
                        >
                          ↗
                        </motion.div>
                      </div>

                      <h3
                        className="text-lg font-bold mb-3 leading-snug relative"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-5 relative" style={{ color: 'var(--muted-foreground)' }}>
                        {p.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 relative mt-auto">
                      {p.stack.map(s => (
                        <span
                          key={s}
                          className="text-xs font-mono px-2.5 py-1"
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            color: 'var(--muted-foreground)',
                            borderRadius: '4px',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </Card3D>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}
