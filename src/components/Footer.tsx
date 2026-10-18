import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer
      className="border-t py-8"
      style={{ borderColor: 'var(--border)', position: 'relative', zIndex: 10 }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span
          className="font-black text-xl tracking-widest"
          style={{
            fontFamily: 'var(--font-orbitron)',
            background: 'linear-gradient(90deg, #00d4ff, #7928ca)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          JM
        </span>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {t('footer.rights')}
        </p>
        <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
          Riyadh · Global · v3.0 Pro
        </p>
      </div>
    </footer>
  )
}
