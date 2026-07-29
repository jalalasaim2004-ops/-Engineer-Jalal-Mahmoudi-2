import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SKILLS = [
  { name: 'Python & FastAPI', pct: 92, color: '#00d4ff' },
  { name: 'React / TypeScript', pct: 85, color: '#7928ca' },
  { name: 'Machine Learning', pct: 78, color: '#ff2d78' },
  { name: 'Docker & Kubernetes', pct: 82, color: '#00d4ff' },
  { name: 'PostgreSQL / Redis', pct: 88, color: '#7928ca' },
  { name: 'AWS / Cloud Infrastructure', pct: 75, color: '#ff2d78' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function AnimatedSkillBar({ skill, delay }: { skill: typeof SKILLS[0]; delay: number }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setAnimated(true) },
      { threshold: 0.5 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="glass p-5"
      style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
      whileHover={{ borderColor: `${skill.color}50` }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{skill.name}</span>
        <span
          className="font-mono text-sm font-bold"
          style={{ color: skill.color, fontFamily: 'var(--font-mono)' }}
        >
          {skill.pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: animated ? `${skill.pct}%` : 0 }}
          transition={{ duration: 1.4, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
            boxShadow: `0 0 12px ${skill.color}80`,
          }}
        />
      </div>
    </motion.div>
  )
}

export default function SkillsSection() {
  return (
    <motion.section
      id="skills"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="mb-16">
          <p className="text-xs font-mono mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
            02 / المهارات
          </p>
          <h2
            className="font-black text-4xl"
            style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
          >
            الأدوات والتقنيات
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {SKILLS.map((skill, i) => (
            <AnimatedSkillBar key={skill.name} skill={skill} delay={i * 100} />
          ))}
        </div>

        {/* Tech badges */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-8">
          {['Git', 'CI/CD', 'Microservices', 'GraphQL', 'Celery', 'RabbitMQ', 'Nginx', 'Terraform',
            'Prometheus', 'Grafana', 'Pandas', 'Scikit-learn', 'OpenCV', 'WebSockets', 'Linux'].map(tag => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.1, color: 'var(--primary)', borderColor: 'var(--primary)' }}
              className="text-xs font-mono px-3 py-1.5 glass cursor-default transition-colors"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--muted-foreground)',
                borderRadius: '20px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
