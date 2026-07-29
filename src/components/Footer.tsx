export default function Footer() {
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
          © {new Date().getFullYear()} جلال المحمودي — جميع الحقوق محفوظة
        </p>
        <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
          Riyadh · SA · v2.5 Pro
        </p>
      </div>
    </footer>
  )
}
