import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      // Save to Firebase Firestore
      await addDoc(collection(db, 'messages'), {
        name: form.name,
        email: form.email,
        message: form.message,
        read: false,
        createdAt: serverTimestamp(),
      })

      // Also send via Web3Forms API (optional)
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: 'b974b9ef-60fa-40d6-8483-34e8590c8859',
            name: form.name,
            email: form.email,
            message: form.message,
            subject: `رسالة جديدة من الموقع: ${form.name}`,
            from_name: 'Engineer Jalal Portfolio',
          }),
        })
      } catch {
        // Ignore Web3Forms errors - message already saved to Firebase
      }

      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSent(false), 5000)
    } catch {
      setErrorMsg('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused === name ? 'var(--primary)' : 'var(--border)'}`,
    borderRadius: '8px',
    color: 'var(--foreground)',
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: 'var(--font-cairo)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === name ? '0 0 0 3px rgba(0,212,255,0.12)' : 'none',
    direction: 'rtl',
  })

  return (
    <form
      onSubmit={handleSubmit}
      className="glass p-8 space-y-5 relative"
      style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-[var(--primary)]">Web3Forms Direct Integration ⚡</span>
        <span className="text-[10px] text-[var(--muted-foreground)]">تسليم فوري للبريد</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(['name', 'email'] as const).map(field => (
          <div key={field}>
            <label className="block text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
              {field === 'name' ? 'الاسم الكريم' : 'البريد الإلكتروني'}
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              style={fieldStyle(field)}
              placeholder={field === 'name' ? 'أحمد علي' : 'example@domain.com'}
              value={form[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              onFocus={() => setFocused(field)}
              onBlur={() => setFocused(null)}
              disabled={loading}
              required
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>تفاصيل الفكرة أو المشروع</label>
        <textarea
          rows={5}
          style={{ ...fieldStyle('message'), resize: 'vertical' }}
          placeholder="أخبرني عن متطلبات المشروع أو الرؤية التقنية التي تطمح لتنفيذها..."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          onFocus={() => setFocused('message')}
          onBlur={() => setFocused(null)}
          disabled={loading}
          required
        />
      </div>

      {errorMsg && (
        <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 font-bold text-sm relative overflow-hidden"
        style={{
          background: sent
            ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(121,40,202,0.2))'
            : 'linear-gradient(135deg, #00d4ff, #7928ca)',
          color: sent ? 'var(--primary)' : '#fff',
          border: sent ? '1px solid var(--primary)' : 'none',
          borderRadius: '8px',
          cursor: loading ? 'wait' : 'pointer',
          fontFamily: 'var(--font-cairo)',
          boxShadow: sent ? 'none' : '0 0 30px rgba(0,212,255,0.25)',
        }}
        whileHover={{ scale: 1.01, boxShadow: '0 0 50px rgba(0,212,255,0.4)' }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={loading ? 'loading' : sent ? 'sent' : 'idle'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {loading
              ? 'جاري إرسال الرسالة عبر Web3Forms...'
              : sent
              ? '✓ تم إرسال رسالتك بنجاح! سأتواصل معك قريباً'
              : 'إرسال الرسالة إلى البريد ✉️'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </form>
  )
}

export default function ContactSection() {
  return (
    <motion.section
      id="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <motion.div variants={fadeUp}>
              <p className="text-xs font-mono mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                04 / تواصل
              </p>
              <h2
                className="font-black text-4xl leading-tight mb-6"
                style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
              >
                لنبني شيئًا{' '}
                <span className="gradient-text">رائعًا</span>
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--muted-foreground)' }}>
                سواء كنت تملك فكرة مشروع طموح أو تبحث عن مهندس يشاركك رؤيتك البرمجية والتقنية — أنا هنا دائماً للاستماع والتعاون.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3">
              {[
                { icon: '✉', label: 'البريد الإلكتروني', value: 'jalal@almahmoud.dev', color: '#00d4ff' },
                { icon: '📍', label: 'الموقع', value: 'الرياض، المملكة العربية السعودية', color: '#7928ca' },
                { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/jalal-m', color: '#ff2d78' },
                { icon: '⌨', label: 'GitHub', value: 'github.com/jalal-m', color: '#00d4ff' },
              ].map(item => (
                <motion.div
                  key={item.label}
                  whileHover={{ x: -6, borderColor: item.color }}
                  className="flex items-center gap-4 p-4 glass cursor-pointer transition-all"
                  style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="md:col-span-7">
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
