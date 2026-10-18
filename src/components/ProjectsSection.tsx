import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

interface ProjectDetail {
  id: string
  title: string
  category: 'ai' | 'systems' | 'web'
  shortDesc: { ar: string; en: string }
  fullChallenge: { ar: string; en: string }
  architectureSolution: { ar: string; en: string }
  keyImpact: { ar: string[]; en: string[] }
  stack: string[]
  githubUrl?: string
  liveUrl?: string
  gradient: string
  glow: string
  year: string
}

const PROJECTS_DATA: ProjectDetail[] = [
  {
    id: 'ai-network-anomaly',
    title: 'نظام كشف الشذوذات بالذكاء الاصطناعي',
    category: 'ai',
    shortDesc: {
      ar: 'محرك تعلّم عميق يرصد الأنماط غير الطبيعية والهجمات السيبرانية في حركة الشبكة بدقة 97.3٪.',
      en: 'Deep learning engine detecting anomalous network traffic and cyber threats with 97.3% precision in real time.',
    },
    fullChallenge: {
      ar: 'معالجة تدفقات بيانات الشبكة الضخمة (Network Packet Streams) بزمن انتقال لا يتجاوز أجزاء من الثانية دون إغفال التهديدات الصفرية (Zero-Day Attacks).',
      en: 'Ingesting massive real-time network packet streams with sub-second latency while accurately identifying zero-day anomalous behaviors.',
    },
    architectureSolution: {
      ar: 'تم بناء خط أنابيب متدفق باستخدام Apache Kafka و InfluxDB مع شبكات عصبية تكرارية (LSTM Autoencoders) تم تدريبها بـ PyTorch ودمجها عبر محرك استدلال سريع وموزع.',
      en: 'Engineered a streaming ingestion pipeline using Apache Kafka & InfluxDB paired with LSTM Autoencoders in PyTorch, deployed via a distributed high-throughput inference engine.',
    },
    keyImpact: {
      ar: [
        'دقة كشف بلغت 97.3٪ مع خفض الإيجابيات الكاذبة بنسبة 45٪',
        'زمن استجابة أقل من 40ms لكل دفعة بيانات واردة',
        'تحمل أعباء تصل إلى 15,000 طلب/ثانية دون فقدان حزم',
      ],
      en: [
        '97.3% detection accuracy with 45% reduction in false positives',
        'Sub-40ms response latency per incoming telemetry batch',
        'Sustained throughput exceeding 15,000 req/sec without packet drop',
      ],
    },
    stack: ['PyTorch', 'FastAPI', 'Apache Kafka', 'InfluxDB', 'Docker'],
    githubUrl: 'https://github.com/jalalasaim2004-ops',
    liveUrl: '#',
    gradient: 'linear-gradient(135deg, rgba(121,40,202,0.25), rgba(255,45,120,0.25))',
    glow: '#7928ca',
    year: '2024',
  },
  {
    id: 'engineering-saas-platform',
    title: 'منصة إدارة المشاريع الهندسية والتعاون',
    category: 'web',
    shortDesc: {
      ar: 'نظام متكامل لإدارة المشاريع الهندسية الكبرى مع لوحات تحكم متقدمة وتحديثات حية ومزامنة فورية.',
      en: 'Comprehensive SaaS platform for engineering project lifecycle, real-time collaboration, and actionable analytics.',
    },
    fullChallenge: {
      ar: 'حاجة الفرق الهندسية إلى أداة مركزية تدعم إدارة المخططات، تتبع الميزانيات، وتوزيع المهام مع تحديثات فورية متعددة المستخدمين (Real-Time Sync).',
      en: 'Engineering teams required a unified workspace supporting schematic management, budget forecasting, and concurrent task synchronization.',
    },
    architectureSolution: {
      ar: 'واجهة أمامية فائقة السرعة بـ React 19 و TypeScript، متصلة بنواة خلفية قوية تعتمد على Python و PostgreSQL و WebSockets للتحديثات اللحظية ومزامنة الجلسات.',
      en: 'Built with React 19 and TypeScript, powered by high-concurrency Python backends, WebSockets for live state synchronization, and partitioned PostgreSQL schemas.',
    },
    keyImpact: {
      ar: [
        'تسريع دورة تسليم المهام بنسبة 35٪ لدى الفرق المشتركة',
        'مزامنة فورية في أجزاء من الثانية لأكثر من 50 مستخدم متزامن في نفس المشروع',
        'نظام صلاحيات إدارية متعدد المستويات (RBAC) بأعلى معايير الأمان',
      ],
      en: [
        'Accelerated project milestone delivery cycles by 35%',
        'Sub-second real-time sync for 50+ concurrent project collaborators',
        'Robust multi-tenant RBAC security architecture',
      ],
    },
    stack: ['React', 'TypeScript', 'Python', 'PostgreSQL', 'WebSockets', 'Tailwind CSS'],
    githubUrl: 'https://github.com/jalalasaim2004-ops',
    liveUrl: '#',
    gradient: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(121,40,202,0.25))',
    glow: '#00d4ff',
    year: '2024',
  },
  {
    id: 'distributed-recommendation-engine',
    title: 'محرك توصيات المحتوى الضخم والبيانات الموزعة',
    category: 'systems',
    shortDesc: {
      ar: 'محرك تصفية تعاونية موزع يعالج ملايين التفاعلات لتقديم توصيات مخصصة بزمن استجابة فائق.',
      en: 'Distributed collaborative filtering engine crunching millions of interactions to deliver hyper-personalized recommendations.',
    },
    fullChallenge: {
      ar: 'تقديم توصيات شخصية فائقة الدقة لقاعدة مستخدمين تتجاوز مئات الآلاف بزمن استجابة أقل من 50 ميلي ثانية تحت ذروة الضغط.',
      en: 'Delivering hyper-accurate personalized recommendations for hundreds of thousands of users with strictly sub-50ms latency under traffic spikes.',
    },
    architectureSolution: {
      ar: 'تطوير خط أنابيب لمعالجة البيانات الموزعة باستخدام Apache Spark، مع فهرسة شعاعية سريعة بـ Elasticsearch وطبقة تخزين مؤقت فائقة السرعة بـ Redis Cluster.',
      en: 'Engineered a distributed data pipeline leveraging Apache Spark, vector-indexed via Elasticsearch, and cached through a tiered multi-node Redis cluster.',
    },
    keyImpact: {
      ar: [
        'زمن استجابة قياسي 35ms في 99٪ من الطلبات (p99 latency)',
        'رفع معدل تفاعل المستخدمين (CTR) بنسبة 28٪ مقارنة بالطرق التقليدية',
        'معمارية قابلة للتوسع أفقياً مع نمو حجم البيانات دون هبوط الأداء',
      ],
      en: [
        'Record 35ms p99 latency across millions of daily query hits',
        '28% boost in user interaction (CTR) over baseline algorithms',
        'Horizontally scalable architecture scaling linearly with dataset growth',
      ],
    },
    stack: ['Apache Spark', 'Python', 'Elasticsearch', 'Redis', 'Docker'],
    githubUrl: 'https://github.com/jalalasaim2004-ops',
    liveUrl: '#',
    gradient: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(255,45,120,0.25))',
    glow: '#00d4ff',
    year: '2023',
  },
  {
    id: 'gov-recruitment-portal',
    title: 'بوابة التوظيف الرقمية والتقييم الذكي',
    category: 'web',
    shortDesc: {
      ar: 'منصة رقمية موثوقة تربط عشرات الآلاف من المتقدمين بالوظائف مع مطابقة آلية للسير الذاتية.',
      en: 'Enterprise-grade portal matching 40,000+ candidates with recruitment opportunities via automated resume parsing and matching.',
    },
    fullChallenge: {
      ar: 'فرز آلاف السير الذاتية يدوياً كان يستغرق شهوراً ويتعرض للأخطاء البشرية في اختيار المؤهلين.',
      en: 'Manual vetting of tens of thousands of candidate resumes consumed months and suffered human biases and evaluation delays.',
    },
    architectureSolution: {
      ar: 'بناء منصة متكاملة بـ FastAPI و React، مع خوارزميات NLP لاستخراج المهارات تلقائياً ومطابقتها مع شروط الوظائف بدقة عالية.',
      en: 'Architected with FastAPI microservices and React, coupled with NLP extraction pipelines to parse resumes and score competency alignments automatically.',
    },
    keyImpact: {
      ar: [
        'خدمة أكثر من 40,000 متقدم بنسبة توفر 99.98٪',
        'تقليص وقت الفرز الأولي بنسبة 85٪ للأقسام الإدارية',
        'حماية أمنية وتشفير كامل للبيانات الشخصية الحساسة',
      ],
      en: [
        'Served 40,000+ applicants with 99.98% system uptime',
        'Reduced preliminary screening cycles by 85%',
        'End-to-end data encryption adhering to privacy compliance standards',
      ],
    },
    stack: ['FastAPI', 'Python', 'React', 'Docker', 'PostgreSQL', 'NLP'],
    githubUrl: 'https://github.com/jalalasaim2004-ops',
    liveUrl: '#',
    gradient: 'linear-gradient(135deg, rgba(255,45,120,0.25), rgba(0,212,255,0.25))',
    glow: '#ff2d78',
    year: '2023',
  },
]

export default function ProjectsSection() {
  const { t, lang, isRTL } = useLanguage()
  const [filter, setFilter] = useState<'all' | 'ai' | 'systems' | 'web'>('all')
  const [activeModal, setActiveModal] = useState<ProjectDetail | null>(null)

  const filtered = filter === 'all' ? PROJECTS_DATA : PROJECTS_DATA.filter(p => p.category === filter)

  return (
    <section id="projects" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-14 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              {t('projects.badge')}
            </p>
            <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--foreground)' }}>
              {t('projects.title')}
            </h2>
          </div>
          <div className="h-px flex-1 min-w-12 mx-6" style={{ background: 'linear-gradient(to left, transparent, var(--border))' }} />

          {/* Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'ai', 'systems', 'web'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="text-xs px-4 py-2 rounded-full font-medium transition-all"
                style={{
                  background: filter === cat ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                  color: filter === cat ? '#04050f' : 'var(--foreground)',
                  border: `1px solid ${filter === cat ? 'var(--primary)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  fontWeight: filter === cat ? 700 : 500,
                }}
              >
                {t(`projects.${cat}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filtered.map(proj => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="glass p-7 rounded-2xl flex flex-col justify-between group relative overflow-hidden transition-all duration-300"
                style={{
                  border: '1px solid var(--border)',
                  background: 'rgba(15, 23, 42, 0.65)',
                }}
                whileHover={{
                  borderColor: `${proj.glow}70`,
                  boxShadow: `0 10px 30px -10px ${proj.glow}30`,
                  y: -4,
                }}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-white/10 text-white/60">
                      {proj.year}
                    </span>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full uppercase"
                      style={{ color: proj.glow, background: `${proj.glow}15`, border: `1px solid ${proj.glow}30` }}
                    >
                      {t(`projects.${proj.category}`)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#00d4ff] transition-colors">
                    {proj.title}
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed mb-6">
                    {proj.shortDesc[lang]}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {proj.stack.map(tech => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    onClick={() => setActiveModal(proj)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#00d4ff] hover:underline cursor-pointer"
                  >
                    <span>{t('projects.view_details')}</span>
                    <span>{isRTL ? '←' : '→'}</span>
                  </button>

                  <div className="flex gap-3 text-sm text-gray-400">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors"
                        title="GitHub"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto glass p-8 rounded-3xl z-10 border border-white/15"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                boxShadow: `0 25px 60px -15px ${activeModal.glow}40`,
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 left-6 md:left-8 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="pr-2">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full uppercase"
                    style={{ color: activeModal.glow, background: `${activeModal.glow}20`, border: `1px solid ${activeModal.glow}40` }}
                  >
                    {t(`projects.${activeModal.category}`)}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{activeModal.year}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white mb-6">
                  {activeModal.title}
                </h3>

                {/* Section: Challenge */}
                <div className="mb-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <h4 className="text-sm font-bold text-[#ff2d78] mb-2 flex items-center gap-2">
                    <span>⚡</span> {t('projects.challenge')}
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {activeModal.fullChallenge[lang]}
                  </p>
                </div>

                {/* Section: Architectural Solution */}
                <div className="mb-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <h4 className="text-sm font-bold text-[#00d4ff] mb-2 flex items-center gap-2">
                    <span>🛠️</span> {t('projects.solution')}
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {activeModal.architectureSolution[lang]}
                  </p>
                </div>

                {/* Section: Impact & Key Results */}
                <div className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <h4 className="text-sm font-bold text-[#00ff9f] mb-3 flex items-center gap-2">
                    <span>📈</span> {t('projects.impact')}
                  </h4>
                  <ul className="space-y-2">
                    {activeModal.keyImpact[lang].map((metric, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-[#00ff9f] mt-1">✔</span>
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack & Links */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {activeModal.stack.map(tech => (
                      <span key={tech} className="text-xs font-mono px-3 py-1 rounded-lg bg-white/10 text-white">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {activeModal.githubUrl && (
                    <a
                      href={activeModal.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#00d4ff] to-[#7928ca] hover:opacity-90 transition-opacity"
                    >
                      {t('projects.github')} ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
