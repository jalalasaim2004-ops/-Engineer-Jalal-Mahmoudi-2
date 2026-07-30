import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import toast, { Toaster } from 'react-hot-toast'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Skill {
  id?: string
  name: string
  pct: number
  color: string
}

interface Project {
  id?: string
  title: string
  desc: string
  stack: string[]
  year: string
  category: string
  gradient: string
  glow: string
}

interface Message {
  id?: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: Timestamp | null
}

// ─── Sidebar items ────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'overview', label: 'نظرة عامة', icon: '📊' },
  { id: 'skills', label: 'المهارات', icon: '🛠️' },
  { id: 'projects', label: 'المشاريع', icon: '💼' },
  { id: 'messages', label: 'الرسائل', icon: '📬' },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  active, setActive, unreadCount, onLogout,
}: {
  active: string
  setActive: (s: string) => void
  unreadCount: number
  onLogout: () => void
}) {
  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: 'rgba(255,255,255,0.02)',
      borderLeft: '1px solid rgba(0,212,255,0.1)',
      display: 'flex', flexDirection: 'column',
      padding: '24px 0', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'linear-gradient(135deg, #00d4ff, #7928ca)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, marginBottom: 10,
        }}>⚡</div>
        <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>لوحة التحكم</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Admin Dashboard</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 14px', borderRadius: 10, marginBottom: 4,
              background: active === s.id
                ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(121,40,202,0.15))'
                : 'transparent',
              border: active === s.id ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
              color: active === s.id ? '#00d4ff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer', textAlign: 'right', fontFamily: 'Cairo, sans-serif',
              fontSize: 13, fontWeight: active === s.id ? 700 : 500,
              transition: 'all 0.2s', position: 'relative',
            }}
          >
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            {s.label}
            {s.id === 'messages' && unreadCount > 0 && (
              <span style={{
                marginRight: 'auto', background: '#ff2d78', color: '#fff',
                borderRadius: 20, fontSize: 10, fontWeight: 800,
                padding: '2px 7px',
              }}>{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <a
          href="/"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 10,
            color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
            fontSize: 13, fontFamily: 'Cairo, sans-serif', marginBottom: 6,
            transition: 'color 0.2s',
          }}
        >
          🌐 الموقع الرئيسي
        </a>
        <button
          onClick={onLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)',
            color: '#ff2d78', cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
            fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
          }}
        >
          🚪 تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function Overview({ skillsCount, projectsCount, messagesCount, unreadCount }: {
  skillsCount: number; projectsCount: number; messagesCount: number; unreadCount: number
}) {
  const stats = [
    { label: 'المهارات', value: skillsCount, icon: '🛠️', color: '#00d4ff' },
    { label: 'المشاريع', value: projectsCount, icon: '💼', color: '#7928ca' },
    { label: 'إجمالي الرسائل', value: messagesCount, icon: '📬', color: '#ff2d78' },
    { label: 'رسائل غير مقروءة', value: unreadCount, icon: '🔔', color: '#ffb800' },
  ]

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24, marginTop: 0 }}>
        نظرة عامة
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <motion.div
            key={s.label}
            whileHover={{ y: -4, boxShadow: `0 0 30px ${s.color}20` }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${s.color}20`,
              borderRadius: 16, padding: '20px 22px',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{
        background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)',
        borderRadius: 16, padding: 24,
      }}>
        <h3 style={{ color: '#00d4ff', fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>
          🚀 خطوات البدء
        </h3>
        <ol style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 2.2, paddingRight: 20, margin: 0 }}>
          <li>أنشئ مشروع Firebase من <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: '#00d4ff' }}>console.firebase.google.com</a></li>
          <li>فعّل Firestore Database وAuthentication (Email/Password)</li>
          <li>أضف مفاتيح Firebase في ملف <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4 }}>.env</code></li>
          <li>أنشئ مستخدم admin من Firebase Authentication Console</li>
          <li>ابدأ بإضافة مهاراتك ومشاريعك من الأقسام على اليسار</li>
        </ol>
      </div>
    </div>
  )
}

// ─── Skills Manager ───────────────────────────────────────────────────────────
function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Skill>({ name: '', pct: 80, color: '#00d4ff' })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'skills'), snap => {
      setSkills(snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill)))
      setLoading(false)
    })
    return unsub
  }, [])

  const save = async () => {
    if (!form.name.trim()) return toast.error('أدخل اسم المهارة')
    setSaving(true)
    try {
      if (editId) {
        await updateDoc(doc(db, 'skills', editId), { name: form.name, pct: form.pct, color: form.color })
        toast.success('تم تحديث المهارة')
      } else {
        await addDoc(collection(db, 'skills'), { name: form.name, pct: form.pct, color: form.color })
        toast.success('تمت إضافة المهارة')
      }
      setForm({ name: '', pct: 80, color: '#00d4ff' })
      setEditId(null)
    } catch {
      toast.error('حدث خطأ، تأكد من إعداد Firebase')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('هل تريد حذف هذه المهارة؟')) return
    await deleteDoc(doc(db, 'skills', id))
    toast.success('تم حذف المهارة')
  }

  const startEdit = (s: Skill) => {
    setForm({ name: s.name, pct: s.pct, color: s.color })
    setEditId(s.id!)
  }

  const COLORS = ['#00d4ff', '#7928ca', '#ff2d78', '#00ff94', '#ffb800', '#ff6b35']

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24, marginTop: 0 }}>
        إدارة المهارات
      </h2>

      {/* Form */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 24, marginBottom: 24,
      }}>
        <h3 style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
          {editId ? '✏️ تعديل المهارة' : '➕ إضافة مهارة جديدة'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>اسم المهارة</label>
            <input
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="مثال: React / TypeScript"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>النسبة %</label>
            <input
              type="number" min={1} max={100}
              value={form.pct} onChange={e => setForm({ ...form, pct: +e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>اللون</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <button
                key={c} onClick={() => setForm({ ...form, color: c })}
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: c,
                  border: form.color === c ? '3px solid #fff' : '3px solid transparent',
                  cursor: 'pointer', outline: 'none',
                  boxShadow: form.color === c ? `0 0 12px ${c}` : 'none',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={save} disabled={saving}
            style={primaryBtnStyle(saving)}
          >
            {saving ? 'جاري الحفظ...' : editId ? '✅ حفظ التعديلات' : '➕ إضافة'}
          </motion.button>
          {editId && (
            <button onClick={() => { setForm({ name: '', pct: 80, color: '#00d4ff' }); setEditId(null) }}
              style={secondaryBtnStyle}>إلغاء</button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? <Spinner /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {skills.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 40 }}>
              لا توجد مهارات بعد. أضف مهارتك الأولى!
            </p>
          )}
          <AnimatePresence>
            {skills.map(s => (
              <motion.div key={s.id}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}
              >
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: s.color, flexShrink: 0,
                  boxShadow: `0 0 8px ${s.color}`,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.name}</div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 4 }} />
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color, minWidth: 36 }}>{s.pct}%</span>
                <button onClick={() => startEdit(s)} style={iconBtnStyle('rgba(0,212,255,0.15)', '#00d4ff')}>✏️</button>
                <button onClick={() => remove(s.id!)} style={iconBtnStyle('rgba(255,45,120,0.15)', '#ff2d78')}>🗑️</button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// ─── Projects Manager ─────────────────────────────────────────────────────────
function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const GLOWS = ['#00d4ff', '#7928ca', '#ff2d78', '#00ff94', '#ffb800']
  const [form, setForm] = useState<Project>({
    title: '', desc: '', stack: [], year: new Date().getFullYear().toString(),
    category: 'web', gradient: 'linear-gradient(135deg, #00d4ff22, #7928ca22)', glow: '#00d4ff',
  })
  const [stackInput, setStackInput] = useState('')

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), snap => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)))
      setLoading(false)
    })
    return unsub
  }, [])

  const save = async () => {
    if (!form.title.trim()) return toast.error('أدخل عنوان المشروع')
    setSaving(true)
    try {
      const data = { ...form, stack: form.stack.filter(Boolean) }
      if (editId) {
        await updateDoc(doc(db, 'projects', editId), data)
        toast.success('تم تحديث المشروع')
      } else {
        await addDoc(collection(db, 'projects'), data)
        toast.success('تمت إضافة المشروع')
      }
      resetForm()
    } catch {
      toast.error('حدث خطأ، تأكد من إعداد Firebase')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setForm({ title: '', desc: '', stack: [], year: new Date().getFullYear().toString(), category: 'web', gradient: 'linear-gradient(135deg, #00d4ff22, #7928ca22)', glow: '#00d4ff' })
    setStackInput('')
    setEditId(null)
    setShowForm(false)
  }

  const remove = async (id: string) => {
    if (!confirm('حذف المشروع؟')) return
    await deleteDoc(doc(db, 'projects', id))
    toast.success('تم حذف المشروع')
  }

  const startEdit = (p: Project) => {
    setForm(p)
    setEditId(p.id!)
    setShowForm(true)
  }

  const addTag = () => {
    const tag = stackInput.trim()
    if (tag && !form.stack.includes(tag)) {
      setForm({ ...form, stack: [...form.stack, tag] })
      setStackInput('')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>إدارة المشاريع</h2>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setShowForm(!showForm)}
          style={primaryBtnStyle(false)}
        >
          {showForm ? '✕ إغلاق' : '➕ مشروع جديد'}
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 20 }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: 24,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>عنوان المشروع</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="عنوان المشروع" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>الوصف</label>
                  <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
                    style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="وصف المشروع..." />
                </div>
                <div>
                  <label style={labelStyle}>السنة</label>
                  <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} style={inputStyle} placeholder="2024" />
                </div>
                <div>
                  <label style={labelStyle}>التصنيف</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="web">تطبيقات ويب</option>
                    <option value="ai">ذكاء اصطناعي</option>
                    <option value="systems">أنظمة موزعة</option>
                    <option value="mobile">تطبيقات موبايل</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>لون التمييز (Glow)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {GLOWS.map(c => (
                      <button key={c} onClick={() => setForm({ ...form, glow: c, gradient: `linear-gradient(135deg, ${c}22, ${GLOWS[(GLOWS.indexOf(c) + 1) % GLOWS.length]}22)` })}
                        style={{
                          width: 28, height: 28, borderRadius: '50%', background: c,
                          border: form.glow === c ? '3px solid #fff' : '3px solid transparent',
                          cursor: 'pointer', outline: 'none',
                        }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>التقنيات المستخدمة</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={stackInput} onChange={e => setStackInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="React, Python, ..." style={{ ...inputStyle, flex: 1 }} />
                    <button onClick={addTag} style={{ ...secondaryBtnStyle, padding: '10px 16px', whiteSpace: 'nowrap' }}>إضافة</button>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {form.stack.map(t => (
                      <span key={t} style={{
                        background: 'rgba(0,212,255,0.12)', color: '#00d4ff',
                        borderRadius: 20, fontSize: 11, padding: '3px 10px',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        {t}
                        <button onClick={() => setForm({ ...form, stack: form.stack.filter(x => x !== t) })}
                          style={{ background: 'none', border: 'none', color: '#ff2d78', cursor: 'pointer', padding: 0, fontSize: 12 }}>✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={save} disabled={saving} style={primaryBtnStyle(saving)}>
                  {saving ? 'جاري الحفظ...' : editId ? '✅ حفظ التعديلات' : '➕ إضافة المشروع'}
                </motion.button>
                <button onClick={resetForm} style={secondaryBtnStyle}>إلغاء</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? <Spinner /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {projects.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 40 }}>
              لا توجد مشاريع بعد. أضف مشروعك الأول!
            </p>
          )}
          <AnimatePresence>
            {projects.map(p => (
              <motion.div key={p.id}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                style={{
                  background: p.gradient || 'rgba(255,255,255,0.02)',
                  border: `1px solid ${p.glow}25`,
                  borderRadius: 14, padding: '16px 20px',
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{p.title}</span>
                    <span style={{
                      fontSize: 10, background: `${p.glow}20`, color: p.glow,
                      border: `1px solid ${p.glow}40`, borderRadius: 20, padding: '2px 8px',
                    }}>{p.year}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', lineHeight: 1.5 }}>{p.desc}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.stack?.map(t => (
                      <span key={t} style={{
                        background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                        borderRadius: 4, fontSize: 10, padding: '2px 8px', fontFamily: 'monospace',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => startEdit(p)} style={iconBtnStyle('rgba(0,212,255,0.15)', '#00d4ff')}>✏️</button>
                  <button onClick={() => remove(p.id!)} style={iconBtnStyle('rgba(255,45,120,0.15)', '#ff2d78')}>🗑️</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// ─── Messages Viewer ──────────────────────────────────────────────────────────
function MessagesViewer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)))
      setLoading(false)
    }, () => {
      setLoading(false)
    })
    return unsub
  }, [])

  const markRead = async (id: string) => {
    await updateDoc(doc(db, 'messages', id), { read: true })
  }

  const remove = async (id: string) => {
    if (!confirm('حذف الرسالة؟')) return
    await deleteDoc(doc(db, 'messages', id))
    if (selected?.id === id) setSelected(null)
    toast.success('تم حذف الرسالة')
  }

  const open = (m: Message) => {
    setSelected(m)
    if (!m.read) markRead(m.id!)
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24, marginTop: 0 }}>
        رسائل التواصل
      </h2>

      {loading ? <Spinner /> : messages.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'rgba(255,255,255,0.02)', borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0 }}>لا توجد رسائل بعد</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence>
              {messages.map(m => (
                <motion.div key={m.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  onClick={() => open(m)}
                  style={{
                    background: selected?.id === m.id
                      ? 'rgba(0,212,255,0.08)'
                      : m.read ? 'rgba(255,255,255,0.02)' : 'rgba(0,212,255,0.04)',
                    border: selected?.id === m.id
                      ? '1px solid rgba(0,212,255,0.3)'
                      : `1px solid ${m.read ? 'rgba(255,255,255,0.06)' : 'rgba(0,212,255,0.15)'}`,
                    borderRadius: 12, padding: '14px 16px',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {!m.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4ff', flexShrink: 0 }} />}
                      <span style={{ fontSize: 13, fontWeight: m.read ? 500 : 700, color: '#fff' }}>{m.name}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginRight: 'auto', flexShrink: 0 }}>
                        {m.createdAt?.toDate().toLocaleDateString('ar-EG') || '—'}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.message}
                    </p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); remove(m.id!) }} style={iconBtnStyle('rgba(255,45,120,0.15)', '#ff2d78')}>🗑️</button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Detail */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: 16, padding: 24, alignSelf: 'flex-start', position: 'sticky', top: 20,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: 16 }}>تفاصيل الرسالة</h3>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <InfoRow label="الاسم" value={selected.name} />
                  <InfoRow label="البريد الإلكتروني" value={selected.email} />
                  <InfoRow label="التاريخ" value={selected.createdAt?.toDate().toLocaleString('ar-EG') || '—'} />
                  <div>
                    <label style={{ ...labelStyle, marginBottom: 6 }}>الرسالة</label>
                    <div style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10, padding: '12px 14px',
                      color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.8,
                    }}>
                      {selected.message}
                    </div>
                  </div>
                  <a href={`mailto:${selected.email}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '11px', borderRadius: 10, textDecoration: 'none',
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(121,40,202,0.15))',
                    border: '1px solid rgba(0,212,255,0.25)',
                    color: '#00d4ff', fontSize: 13, fontWeight: 600, fontFamily: 'Cairo, sans-serif',
                  }}>
                    📧 رد عبر البريد
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label style={{ ...labelStyle, marginBottom: 4 }}>{label}</label>
      <div style={{ color: '#fff', fontSize: 13 }}>{value}</div>
    </div>
  )
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)',
  marginBottom: 8, fontWeight: 600,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none',
  fontFamily: 'Cairo, sans-serif', boxSizing: 'border-box',
}

const primaryBtnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '10px 20px',
  background: disabled ? 'rgba(0,212,255,0.2)' : 'linear-gradient(135deg, #00d4ff, #7928ca)',
  border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'Cairo, sans-serif',
})

const secondaryBtnStyle: React.CSSProperties = {
  padding: '10px 16px',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, color: 'rgba(255,255,255,0.7)', fontSize: 13,
  cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
}

const iconBtnStyle = (bg: string, color: string): React.CSSProperties => ({
  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: bg, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14,
  color, flexShrink: 0,
})

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <div style={{
        width: 36, height: 36, border: '3px solid rgba(0,212,255,0.15)',
        borderTop: '3px solid #00d4ff', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [active, setActive] = useState('overview')
  const [stats, setStats] = useState({ skills: 0, projects: 0, messages: 0, unread: 0 })

  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, 'skills'), s => setStats(prev => ({ ...prev, skills: s.size }))),
      onSnapshot(collection(db, 'projects'), s => setStats(prev => ({ ...prev, projects: s.size }))),
      onSnapshot(collection(db, 'messages'), s => {
        const unread = s.docs.filter(d => !d.data().read).length
        setStats(prev => ({ ...prev, messages: s.size, unread }))
      }),
    ]
    return () => unsubs.forEach(u => u())
  }, [])

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  const renderSection = () => {
    switch (active) {
      case 'overview': return <Overview skillsCount={stats.skills} projectsCount={stats.projects} messagesCount={stats.messages} unreadCount={stats.unread} />
      case 'skills': return <SkillsManager />
      case 'projects': return <ProjectsManager />
      case 'messages': return <MessagesViewer />
      default: return null
    }
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh', display: 'flex',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        color: '#fff',
      }}
    >
      <Toaster position="top-center" toastOptions={{ style: { direction: 'rtl', fontFamily: 'Cairo, sans-serif' } }} />

      <Sidebar
        active={active} setActive={setActive}
        unreadCount={stats.unread} onLogout={handleLogout}
      />

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 32, paddingBottom: 20,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>
              {SECTIONS.find(s => s.id === active)?.icon} {SECTIONS.find(s => s.id === active)?.label}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: '#00ff94',
              boxShadow: '0 0 8px #00ff94',
            }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{user?.email}</span>
          </div>
        </div>

        {/* Section content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        select option { background: #0a0d1f; color: #fff; }
        textarea { resize: vertical; }
      `}</style>
    </div>
  )
}
