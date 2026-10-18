import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Language = 'ar' | 'en'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Nav
    'nav.home': 'الرئيسية',
    'nav.about': 'عني',
    'nav.skills': 'المهارات',
    'nav.projects': 'المشاريع',
    'nav.articles': 'المقالات',
    'nav.contact': 'تواصل',
    'nav.admin': 'لوحة التحكم',

    // Hero
    'hero.badge': 'متاح للمشاريع والحلول التقنية المتقدمة — 2025',
    'hero.title.prefix': 'م.',
    'hero.title.name': 'جلال المحمودي',
    'hero.typed.1': 'مهندس برمجيات ونظم موزعة',
    'hero.typed.2': 'متخصص ذكاء اصطناعي وتعلم آلي',
    'hero.typed.3': 'مطور منتجات ويب وتطبيقات SaaS',
    'hero.typed.4': 'معماري حلول سحابية وبنى تحتية',
    'hero.desc': 'أبني أنظمة برمجية عالية الأداء وحلول ذكاء اصطناعي قابلة للتوسع تجمع بين قوة المعمارية البرمجية ودقة النماذج التحليلية الحديثة.',
    'hero.btn.projects': 'استكشف المشاريع',
    'hero.btn.cv': 'تحميل السيرة الذاتية',
    'hero.btn.contact': 'تواصل معي',

    // Stats
    'stats.experience': 'سنوات خبرة',
    'stats.projects': 'مشاريع مكتملة',
    'stats.accuracy': 'دقة نماذج الـ AI',
    'stats.uptime': 'اعتمادية الأنظمة',

    // About
    'about.badge': '01 / عني',
    'about.title': 'من أنا؟',
    'about.role': 'مهندس برمجيات · متخصص ذكاء اصطناعي',
    'about.available': 'متاح للمشاريع والتعاقد',
    'about.p1': 'مهندس برمجيات وباحث تقني متخصص في بناء البنى التحتية البرمجية القابلة للتوسع (Scalable Systems) وتصميم وتطبيق نماذج الذكاء الاصطناعي على أرض الواقع.',
    'about.p2': 'أجمع بين هندسة الواجهات والأنظمة الخلفية المعقدة ومعالجة البيانات الضخمة لتطوير منتجات رقمية متكاملة تقدم أثراً تجارياً ملموساً وتجربة استخدام استثنائية.',
    'about.degree': 'بكالوريوس هندسة الحاسوب والبرمجيات',
    'about.focus': 'نظم موزعة & نماذج لغوية وتعلّم عميق',

    // Skills
    'skills.badge': '02 / القدرات التقنية',
    'skills.title': 'المهارات والأدوات',
    'skills.desc': 'مجموعة الأدوات والتقنيات التي أعتمد عليها في بناء الأنظمة الذكية والمنتجات عالية الأداء.',

    // Projects
    'projects.badge': '03 / سجل الأعمال',
    'projects.title': 'أبرز المشاريع',
    'projects.all': 'الكل',
    'projects.ai': 'الذكاء الاصطناعي',
    'projects.systems': 'الأنظمة والبيانات',
    'projects.web': 'الويب ومنتجات SaaS',
    'projects.view_details': 'عرض دراسة الحالة',
    'projects.github': 'الكود المصدري',
    'projects.live': 'المعاينة الحية',
    'projects.close': 'إغلاق',
    'projects.challenge': 'المشكلة والتحدي',
    'projects.solution': 'الحل الهندسي والبنية',
    'projects.impact': 'الأثر والنتائج',

    // Articles
    'articles.badge': '04 / أفكار ورؤى',
    'articles.title': 'المقالات والمدونة التقنية',
    'articles.desc': 'مقالات متعمقة في هندسة البرمجيات، معمارية الأنظمة الموزعة، وتقنيات الذكاء الاصطناعي.',
    'articles.read_time': 'دقائق قراءة',
    'articles.read_article': 'قراءة المقال',

    // Contact
    'contact.badge': '05 / تواصل مباشر',
    'contact.title': 'لنعمل معاً',
    'contact.desc': 'هل لديك فكرة مشروع أو بحاجة لاستشارة تقنية في هندسة البرمجيات والذكاء الاصطناعي؟ يسعدني التواصل معك.',
    'contact.name': 'الاسم الكامل',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'رسالتك وتفاصيل المشروع',
    'contact.send': 'إرسال الرسالة',
    'contact.sending': 'جاري الإرسال...',
    'contact.success': 'تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.',
    'contact.error': 'حدث خطأ أثناء الإرسال، يرجى المحاولة ثانية.',

    // Footer
    'footer.rights': 'جميع الحقوق محفوظة © 2025 المهندس جلال المحمودي.',
    'footer.built': 'صُمم وبُني بأحدث التقنيات البرمجية.',
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.articles': 'Articles',
    'nav.contact': 'Contact',
    'nav.admin': 'Dashboard',

    // Hero
    'hero.badge': 'Available for Advanced Projects & Solutions — 2025',
    'hero.title.prefix': 'Eng.',
    'hero.title.name': 'Jalal Mahmoudi',
    'hero.typed.1': 'Software & Distributed Systems Engineer',
    'hero.typed.2': 'AI Specialist & Machine Learning Practitioner',
    'hero.typed.3': 'Full-Stack Web & SaaS Product Builder',
    'hero.typed.4': 'Cloud Architect & Infrastructure Specialist',
    'hero.desc': 'I engineer high-performance software systems and scalable AI solutions, bridging the gap between robust system architecture and cutting-edge analytical models.',
    'hero.btn.projects': 'Explore Projects',
    'hero.btn.cv': 'Download CV',
    'hero.btn.contact': 'Get in Touch',

    // Stats
    'stats.experience': 'Years Experience',
    'stats.projects': 'Completed Projects',
    'stats.accuracy': 'AI Model Accuracy',
    'stats.uptime': 'System Reliability',

    // About
    'about.badge': '01 / About Me',
    'about.title': 'Who Am I?',
    'about.role': 'Software Engineer · AI Specialist',
    'about.available': 'Available for Contracting',
    'about.p1': 'Software engineer and technical researcher specialized in engineering scalable distributed backends and applying real-world machine learning solutions.',
    'about.p2': 'Combining modern web architectures with heavy data pipelines to craft robust digital products that deliver quantifiable business value and stellar user experience.',
    'about.degree': 'B.Sc. in Computer Engineering & Software Systems',
    'about.focus': 'Distributed Systems & LLMs / Deep Learning',

    // Skills
    'skills.badge': '02 / Technical Skills',
    'skills.title': 'Skills & Arsenal',
    'skills.desc': 'The core technologies, frameworks, and tools I rely on to build resilient systems and intelligent products.',

    // Projects
    'projects.badge': '03 / Portfolio',
    'projects.title': 'Featured Projects',
    'projects.all': 'All',
    'projects.ai': 'Artificial Intelligence',
    'projects.systems': 'Systems & Data',
    'projects.web': 'Web & SaaS',
    'projects.view_details': 'View Case Study',
    'projects.github': 'Source Code',
    'projects.live': 'Live Preview',
    'projects.close': 'Close',
    'projects.challenge': 'The Challenge',
    'projects.solution': 'Architectural Solution',
    'projects.impact': 'Impact & Metrics',

    // Articles
    'articles.badge': '04 / Insights',
    'articles.title': 'Articles & Technical Insights',
    'articles.desc': 'In-depth write-ups covering software engineering, distributed systems, and real-world artificial intelligence architectures.',
    'articles.read_time': 'min read',
    'articles.read_article': 'Read Article',

    // Contact
    'contact.badge': '05 / Direct Contact',
    'contact.title': "Let's Collaborate",
    'contact.desc': 'Have a visionary project idea or looking for technical consultation in AI and software engineering? Reach out anytime.',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.message': 'Your Message / Project Details',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Your message has been sent successfully! I will reply shortly.',
    'contact.error': 'An error occurred while sending. Please try again.',

    // Footer
    'footer.rights': 'All rights reserved © 2025 Eng. Jalal Mahmoudi.',
    'footer.built': 'Engineered and built with modern web technologies.',
  },
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('preferred_language') as Language) || 'ar'
  })

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('preferred_language', newLang)
  }

  const isRTL = lang === 'ar'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  }, [lang, isRTL])

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.ar?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
