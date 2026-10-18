import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Environment, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

// ─── 3D Sphere Component ──────────────────────────────────────────────────
function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
  })
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#00d4ff"
          attach="material"
          distort={0.35}
          speed={2}
          roughness={0}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>
      <Torus args={[2.2, 0.02, 8, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#7928ca" transparent opacity={0.6} />
      </Torus>
      <Torus args={[2.6, 0.01, 8, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </Torus>
    </Float>
  )
}

// ─── Floating 3D Particles ────────────────────────────────────────────────
function Particles() {
  const count = 120
  const positions = useRef(
    new Float32Array(
      Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 20)
    )
  )
  const meshRef = useRef<THREE.Points>(null!)
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.02
  })
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#00d4ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

// ─── Mouse Camera Rig ─────────────────────────────────────────────────────
function CameraRig({ mouse }: { mouse: { x: number; y: number } }) {
  useFrame((state) => {
    state.camera.position.x += (mouse.x * 0.5 - state.camera.position.x) * 0.05
    state.camera.position.y += (mouse.y * 0.3 - state.camera.position.y) * 0.05
    state.camera.lookAt(new THREE.Vector3(0, 0, 0))
  })
  return null
}

// ─── Typed Text Component ─────────────────────────────────────────────────
export function TypedText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[index]
    let timeout: ReturnType<typeof setTimeout>
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIndex((i) => (i + 1) % texts.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, index, texts])

  return (
    <span>
      {displayed}
      <span className="inline-block w-0.5 h-6 bg-current ml-1 animate-pulse" />
    </span>
  )
}

// ─── Magnetic Button Component ───────────────────────────────────────────
export function MagneticButton({
  href,
  children,
  primary,
  download,
}: {
  href: string
  children: React.ReactNode
  primary?: boolean
  download?: boolean | string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPos({ x: x * 0.25, y: y * 0.25 })
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      className="relative inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-sm overflow-hidden"
      style={{
        borderRadius: 'var(--radius)',
        textDecoration: 'none',
        ...(primary
          ? {
              background: 'linear-gradient(135deg, #00d4ff, #7928ca)',
              color: '#fff',
              boxShadow: '0 0 30px rgba(0,212,255,0.3)',
            }
          : {
              background: 'transparent',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            }),
      }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      whileHover={primary ? { boxShadow: '0 0 50px rgba(0,212,255,0.5)' } : { borderColor: 'var(--primary)', color: 'var(--primary)' }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.a>
  )
}

interface HeroSectionProps {
  mouse: { x: number; y: number }
}

export default function HeroSection({ mouse }: HeroSectionProps) {
  const { t } = useLanguage()
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
            <pointLight position={[-10, -5, -5]} intensity={0.8} color="#7928ca" />
            <pointLight position={[0, -10, 5]} intensity={0.5} color="#ff2d78" />
            <Particles />
            <AnimatedSphere />
            <CameraRig mouse={mouse} />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, rgba(4,5,15,0.3) 0%, rgba(4,5,15,0.7) 55%, rgba(4,5,15,0.95) 100%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-mono glass"
              style={{
                color: 'var(--primary)',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-mono)',
                border: '1px solid rgba(0,212,255,0.3)',
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--primary)', boxShadow: '0 0 6px var(--primary)' }} />
              {t('hero.badge')}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-black leading-none mb-4"
            style={{
              fontSize: 'clamp(3.2rem, 7.5vw, 6rem)',
              letterSpacing: '-0.03em',
              color: 'var(--foreground)',
            }}
          >
            {t('hero.title.prefix')}
            <br />
            <span className="gradient-text-animate">{t('hero.title.name')}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="text-lg md:text-xl font-light mb-4"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
              <TypedText texts={[
                t('hero.typed.1'),
                t('hero.typed.2'),
                t('hero.typed.3'),
                t('hero.typed.4')
              ]} />
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.7 }}
            className="text-sm md:text-base text-gray-300 leading-relaxed mb-6 max-w-xl"
          >
            {t('hero.desc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <MagneticButton href="#projects" primary>
              {t('hero.btn.projects')} 🔥
            </MagneticButton>
            <MagneticButton href="./Jalal_Mahmoudi_CV.pdf" download="Jalal_Mahmoudi_CV.pdf">
              {t('hero.btn.cv')} 📄
            </MagneticButton>
            <MagneticButton href="#contact">
              {t('hero.btn.contact')} ⚡
            </MagneticButton>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10"
          >
            {[
              { v: '5+', l: t('stats.experience') },
              { v: '25+', l: t('stats.projects') },
              { v: '97.3%', l: t('stats.accuracy') },
              { v: '99.9%', l: t('stats.uptime') },
            ].map(s => (
              <div key={s.l}>
                <div
                  className="text-2xl md:text-3xl font-black"
                  style={{
                    fontFamily: 'var(--font-orbitron)',
                    color: 'var(--primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.v}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 flex flex-col items-center gap-2"
        style={{ transform: 'translateX(-50%)' }}
      >
        <div className="w-5 h-8 border-2 rounded-full flex justify-center pt-1.5"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <motion.div
            className="w-1 h-1.5 rounded-full"
            style={{ background: 'var(--primary)' }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
