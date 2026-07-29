import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function AboutSection() {
  return (
    <motion.section
      id="about"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-16 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              01 / عني
            </p>
            <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'var(--foreground)', letterSpacing: '-0.03em' }}>
              من أنا؟
            </h2>
          </div>
          <div className="h-px flex-1 min-w-12 mx-6" style={{ background: 'linear-gradient(to left, transparent, var(--border))' }} />
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Left: Photo + quick facts ── */}
          <motion.div variants={fadeUp} className="lg:col-span-4 flex flex-col gap-6">

            {/* Photo card */}
            <div className="relative" style={{ perspective: '900px' }}>
              <motion.div
                animate={{ rotateY: [0, 4, 0, -4, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="relative overflow-hidden"
                style={{ borderRadius: '16px', border: '1px solid rgba(0,212,255,0.2)' }}
              >
                <img
                  src="/jalal.jpg"
                  alt="جلال المحمودي"
                  style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,5,15,0.85) 0%, rgba(4,5,15,0.1) 60%)' }} />
                <div className="absolute bottom-0 right-0 left-0 p-5">
                  <p className="font-black text-xl" style={{ color: '#fff', letterSpacing: '-0.02em' }}>جلال المحمودي</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--primary)' }}>Software Engineer · AI Specialist</p>
                </div>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'radial-gradient(circle at top right, rgba(0,212,255,0.3), transparent 70%)' }} />
              </motion.div>

              {/* Status badge */}
              <div
                className="absolute -bottom-4 left-4 flex items-center gap-2 px-4 py-2 glass"
                style={{ border: '1px solid rgba(0,255,159,0.4)', borderRadius: 30 }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00ff9f', boxShadow: '0 0 8px #00ff9f' }} />
                <span className="text-xs font-semibold" style={{ color: '#00ff9f' }}>متاح للمشاريع</span>
              </div>
            </div>

            {/* Quick info pills */}
            <div className="mt-6 flex flex-col gap-3">
              {[
                { label: 'الموقع', value: 'الرياض 🇸🇦', icon: '📍' },
                { label: 'الشهادة', value: 'KFUPM — علوم حاسب', icon: '🎓' },
                { label: 'اللغات', value: 'العربية · الإنجليزية', icon: '🌐' },
              ].map(item => (
                <motion.div
                  key={item.label}
                  whileHover={{ x: -4, borderColor: 'rgba(0,212,255,0.35)' }}
                  className="glass flex items-center gap-4 px-4 py-3"
                  style={{ borderRadius: 10, border: '1px solid var(--border)', transition: 'border-color .2s' }}
                >
                  <span className="text-xl w-8 text-center shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Bio + timeline + stats ── */}
          <div className="lg:col-span-8 flex flex-col gap-10">

            {/* Bio */}
            <motion.div variants={fadeUp} className="space-y-4">
              <p className="text-lg leading-loose" style={{ color: 'var(--muted-foreground)' }}>
                مهندس برمجيات بخبرة أكثر من <span style={{ color: 'var(--primary)', fontWeight: 700 }}>ثماني سنوات</span> في تصميم وبناء الأنظمة الموزعة عالية الأداء.
                أعمل في تقاطع هندسة البرمجيات والذكاء الاصطناعي التطبيقي، حيث أحوّل المشاكل المعقدة إلى بنى تقنية أنيقة وقابلة للتوسع.
              </p>
              <p className="text-lg leading-loose" style={{ color: 'var(--muted-foreground)' }}>
                قدت فرقًا هندسية في شركات ناشئة ومؤسسات حكومية، وشاركت في تصميم أنظمة تخدم <span style={{ color: 'var(--primary)', fontWeight: 700 }}>ملايين المستخدمين</span> يوميًا. أؤمن بأن الكود الجيد يشبه الهندسة المعمارية: وظيفي وجميل في آنٍ واحد.
              </p>
            </motion.div>

            {/* Stat counters */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { val: '8+',  label: 'سنوات خبرة',    color: '#00d4ff' },
                { val: '20+', label: 'مشروع مكتمل',    color: '#7928ca' },
                { val: '5M+', label: 'مستخدم نهائي',   color: '#00ff9f' },
                { val: '97%', label: 'رضا العملاء',     color: '#ff6b35' },
              ].map(s => (
                <motion.div
                  key={s.label}
                  whileHover={{ scale: 1.04 }}
                  className="glass flex flex-col items-center justify-center py-6 px-3 text-center"
                  style={{ borderRadius: 14, border: `1px solid ${s.color}25`, background: `${s.color}08` }}
                >
                  <span className="font-black text-3xl" style={{ fontFamily: 'var(--font-orbitron)', color: s.color, letterSpacing: '-0.03em' }}>{s.val}</span>
                  <span className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>{s.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Timeline */}
            <motion.div variants={fadeUp}>
              <p className="text-xs font-mono mb-6" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                — المسيرة المهنية
              </p>
              <div className="relative">
                <div className="absolute top-0 bottom-0 right-3 w-px" style={{ background: 'linear-gradient(to bottom, var(--primary), var(--secondary), transparent)' }} />

                <div className="flex flex-col gap-0">
                  {[
                    { year: '2022–الآن', role: 'كبير مهندسي البرمجيات', company: 'شركة تقنيات المستقبل، الرياض', color: '#00d4ff' },
                    { year: '2019–2022', role: 'مهندس برمجيات أول',     company: 'مجموعة سدير للتقنية',          color: '#7928ca' },
                    { year: '2017–2019', role: 'مهندس برمجيات',          company: 'بيئة للحلول الرقمية',           color: '#00ff9f' },
                    { year: '2016–2017', role: 'متدرب هندسة برمجيات',    company: 'أرامكو السعودية',               color: '#ff6b35' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex items-start gap-6 pr-10 pb-8 relative"
                    >
                      <div
                        className="absolute right-0 top-1 w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${item.color}18`, border: `2px solid ${item.color}`, zIndex: 1 }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <span className="font-black text-base" style={{ color: 'var(--foreground)' }}>{item.role}</span>
                          <span
                            className="text-xs font-mono px-2 py-0.5"
                            style={{ color: item.color, border: `1px solid ${item.color}40`, borderRadius: 4, fontFamily: 'var(--font-mono)', background: `${item.color}10` }}
                          >
                            {item.year}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.company}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.section>
  )
}
