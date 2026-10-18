import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

interface Article {
  id: string
  title: { ar: string; en: string }
  excerpt: { ar: string; en: string }
  content: { ar: string; en: string }
  category: string
  readTime: string
  date: string
  gradient: string
}

const ARTICLES_DATA: Article[] = [
  {
    id: 'ai-scalable-systems',
    title: {
      ar: 'معمارية دمج نماذج الذكاء الاصطناعي في الأنظمة الموزعة عالية الحمل',
      en: 'Architecting High-Throughput AI Inference in Distributed Microservices',
    },
    excerpt: {
      ar: 'كيف تنتقل بنماذج التعلم الآلي من بيئة الأبحاث إلى أنظمة إنتاجية تتحمل ملايين الطلبات بزمن استجابة أقل من 50ms.',
      en: 'Bridging the chasm between experimental machine learning prototypes and robust production environments processing millions of requests.',
    },
    content: {
      ar: `يواجه معظم مهندسي البرمجيات والذكاء الاصطناعي تحدياً كبيراً عند نقل النماذج (Models) من مرحلة التدريب (Training) إلى مرحلة الإنتاج الميداني (Production Serving).

أهم الركائز لضمان استقرار الاستدلال عالي السرعة:
1. **عزل خطوط الاستدلال (Inference Decoupling):** استخدام طوابير رسائل غير متزامنة مثل Kafka لتفادي اختناق الخوادم عند ذروة الطلبات.
2. **التحسين الحجمي والكمي (Quantization & ONNX):** تحويل الأوزان العصبية إلى FP16 أو INT8 لتقليل استهلاك الذاكرة وزيادة سرعة الحسابات بنسبة تتجاوز 60٪.
3. **التخزين المؤقت التنبؤي (Predictive Caching):** تخزين استجابات الاستفسارات المتكررة عبر Redis Cluster لتوفير استهلاك وحدات المعالجة GPU.`,
      en: `Most AI engineers encounter significant friction when transitioning ML models from the experiment phase to enterprise production serving.

Key architectural pillars for sub-50ms inference:
1. **Asynchronous Decoupling:** Leveraging message queues like Kafka to absorb traffic bursts and decouple client requests from GPU queues.
2. **Quantization & Graph Optimization:** Converting weights into FP16 or INT8 using ONNX Runtime to dramatically minimize GPU VRAM consumption while multiplying throughput.
3. **Multi-tiered Predictive Caching:** Serving cached vector embeddings and common inference outputs via distributed Redis clusters.`,
    },
    category: 'AI & Architecture',
    readTime: '6',
    date: '2025',
    gradient: 'from-[#00d4ff]/20 to-[#7928ca]/20',
  },
  {
    id: 'microservices-resilience',
    title: {
      ar: 'أنماط المقاومة والتعافي في الخدمات المصغرة (Resilience Patterns)',
      en: 'Resilience Patterns & Circuit Breakers in Cloud-Native Microservices',
    },
    excerpt: {
      ar: 'دليل عملي لتطبيق قواطع الدوائر (Circuit Breakers) وإعادة المحاولة التراجعية لضمان توفر الخدمة 99.99٪.',
      en: 'A practical deep-dive into implementing circuit breakers, exponential backoffs, and fallback strategies for 99.99% system availability.',
    },
    content: {
      ar: `في الأنظمة الموزعة الحديثة، السؤال ليس "هل ستفشل إحدى الخدمات؟" بل "متى ستفشل وكيف سيتعامل النظام مع ذلك؟".

تطبيق استراتيجيات التعافي الأساسية:
- **قاطع الدائرة (Circuit Breaker):** قطع الاتصال بالخدمة المتعثرة تلقائياً لمنع استنزاف موارد النظام وتفادي انهيار الدومينو (Cascading Failures).
- **التراجع الأسي والتشويش (Exponential Backoff with Jitter):** تجنب إغراق الخادم المتعافي بطلبات إعادة المحاولة المتزامنة.
- **حدود العزل (Bulkheading):** عزل الموارد الحيوية بحيث لا يؤثر بطء مسار جانبي على مسارات الدفع أو التسجيل الأساسية.`,
      en: `In modern distributed topologies, the question is never "Will a service fail?" but rather "When it fails, how will the ecosystem survive without cascading?".

Core resilience implementation:
- **Circuit Breakers:** Tripping open faulty service calls to prevent thread starvation across dependent upstreams.
- **Exponential Backoff with Jitter:** De-synchronizing client retries to prevent the thundering herd problem against recovering databases.
- **Bulkheading:** Isolating critical thread pools so a slow secondary analytics pipeline never throttles the primary checkout gateway.`,
    },
    category: 'Cloud & Systems',
    readTime: '5',
    date: '2024',
    gradient: 'from-[#7928ca]/20 to-[#ff2d78]/20',
  },
  {
    id: 'fullstack-modern-edge',
    title: {
      ar: 'بناء تطبيقات SaaS فائقة السرعة على شبكات الحافة (Edge Computing)',
      en: 'Building Next-Gen Full-Stack SaaS on the Global Edge Network',
    },
    excerpt: {
      ar: 'استغلال خوادم الحافة (Edge Workers) لتقديم تجربة تصفح فورية وتوزيع المعالجة الجغرافية بالقرب من المستخدم.',
      en: 'Harnessing edge compute workers and geo-distributed caching to deliver instant, zero-cold-start SaaS experiences worldwide.',
    },
    content: {
      ar: `تقدم شبكات الحافة (Edge Computing) ثورة حقيقية في سرعة استجابة تطبيقات الويب.

عند نقل المعالجة إلى خوادم موزعة على مئات المدن حول العالم:
1. ينخفض زمن الوصول إلى أقل من 20ms للعملاء في أي دولة.
2. تتم حماية قواعد البيانات المركزية عبر التخزين المؤقت الذكي والتحقق من الهوية على الحافة قبل تمرير الطلبات.
3. التحديث التلقائي المستمر يضمن سرعة تسليم الميزات الجديدة بأعلى موثوقية.`,
      en: `Edge computing redefines user experience by moving compute logic closer to the user rather than round-tripping to a single centralized origin.

Key benefits of Edge architecture:
1. Sub-20ms TTFB worldwide across global edge points of presence.
2. Shielding central databases by verifying auth tokens and evaluating rate limits directly at the edge boundary.
3. Zero-downtime continuous global deployments without infrastructure maintenance overhead.`,
    },
    category: 'Full-Stack & Edge',
    readTime: '4',
    date: '2024',
    gradient: 'from-[#ff2d78]/20 to-[#00d4ff]/20',
  },
]

export default function ArticlesSection() {
  const { t, lang, isRTL } = useLanguage()
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  return (
    <section id="articles" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              {t('articles.badge')}
            </p>
            <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--foreground)' }}>
              {t('articles.title')}
            </h2>
          </div>
          <div className="h-px flex-1 min-w-12 mx-6" style={{ background: 'linear-gradient(to left, transparent, var(--border))' }} />
          <p className="text-sm text-gray-400 max-w-md">
            {t('articles.desc')}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES_DATA.map(art => (
            <motion.div
              key={art.id}
              whileHover={{ y: -6, borderColor: 'rgba(0,212,255,0.4)' }}
              className="glass p-7 rounded-2xl flex flex-col justify-between border border-white/10 transition-all duration-300 relative overflow-hidden group"
              style={{ background: 'rgba(15, 23, 42, 0.65)' }}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4 font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#00d4ff]">
                    {art.category}
                  </span>
                  <span>{art.readTime} {t('articles.read_time')}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#00d4ff] transition-colors leading-snug">
                  {art.title[lang]}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {art.excerpt[lang]}
                </p>
              </div>

              <button
                onClick={() => setSelectedArticle(art)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#00d4ff] hover:underline pt-4 border-t border-white/10 cursor-pointer"
              >
                <span>{t('articles.read_article')}</span>
                <span>{isRTL ? '←' : '→'}</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Reading Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass p-8 rounded-3xl z-10 border border-white/15"
              style={{ background: 'rgba(15, 23, 42, 0.96)' }}
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 left-6 md:left-8 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4 text-xs font-mono text-[#00d4ff]">
                <span>{selectedArticle.category}</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime} {t('articles.read_time')}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white mb-6 leading-tight">
                {selectedArticle.title[lang]}
              </h2>

              <div className="text-gray-300 text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line border-t border-white/10 pt-6">
                {selectedArticle.content[lang]}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
                <span>Eng. Jalal Mahmoudi</span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  {t('projects.close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
