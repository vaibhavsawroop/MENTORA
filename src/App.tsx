import { lazy, Suspense, type FormEvent, type MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { HoverMember, type HoverMemberItem } from './components/HoverMember'
import { Link, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Crown,
  ExternalLink,
  HelpCircle,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  MoveUpRight,
  Plus,
  Quote,
  Sparkles,
  Target,
  X,
} from 'lucide-react'
import { studentTestimonials, faqs, type Faq } from './data'
import { HalftoneReveal } from './components/HalftoneReveal'
import { PageTransition } from './components/PageTransition'
import { Clouds } from './components/canvasui/Clouds'
import { SmoothScroll } from './components/SmoothScroll'
import { TextPop } from './components/TextReveal'

const navItems = [
  ['Mentorship', '/mentorship'],
  ['Books', '/books'],
  ['Mentors', '/mentors'],
  ['Our team', '/team'],
] as const

const HeroScene = lazy(() => import('./scene/HeroScene').then((m) => ({ default: m.HeroScene })))

const plans = [
  { name: 'Foundation', index: '01', note: 'A clean beginning for serious self-starters.', features: ['A complete study architecture', 'Core resource & revision map', 'Member updates and group sessions'], accent: 'lilac' },
  { name: 'Momentum', index: '02', note: 'The considered, high-touch MentoraX experience.', features: ['Everything in Foundation', 'Personal planning conversations', 'Regular check-ins and recalibration', 'Practice & exam strategy feedback'], accent: 'lime', featured: true },
  { name: 'Intensive', index: '03', note: 'A precise final stretch for high-stakes preparation.', features: ['Everything in Momentum', 'More focused strategy sessions', 'Exam-window support', 'Priority guidance'], accent: 'peach' },
]

const materials = [
  ['01', 'Foundation files', 'Concept guides and essential references for the first steady layer.'],
  ['02', 'Practice archive', 'Purposeful problem sets, not endless downloads.'],
  ['03', 'Revision editions', 'Quick-reference tools for the stretch where time matters most.'],
  ['04', 'Strategy notes', 'The small, decisive patterns that are easy to miss alone.'],
]

type MentorCard = {
  initials: string
  name: string
  role: string
  detail: string
  tone: 'violet' | 'sage' | 'coral' | 'ink'
  portrait?: string
  portraitAlt?: string
}

const mentors: MentorCard[] = [
  { initials: 'R', name: 'Raj', role: 'Maths Mentor', detail: 'IISER TVM · Mentored 2,000+ students with personalised study roadmaps, weekly reviews, and accountability.', tone: 'violet', portrait: '/mentors/raj.png', portraitAlt: 'Raj, MentoraX Maths Mentor' },
  { initials: 'B', name: 'Bhavesha', role: 'Physics Mentor', detail: 'M.Sc. Physics student at IISER Thiruvananthapuram · B.Sc. (Hons.) Physics from Gargi College, University of Delhi. Qualified IIT JAM 2025 with Rank 2000 and researches astrophysics, solar magnetic fields, and low-frequency radio observations.', tone: 'sage', portrait: '/mentors/bhavesha.png', portraitAlt: 'Bhavesha, MentoraX Physics Mentor' },
  { initials: 'AT', name: 'Aditya Thakur', role: 'Chemistry Mentor', detail: 'BS Chemistry, IIT Madras · IAT 2026 AIR 544. PCM mentor with a major focus on Chemistry.', tone: 'coral', portrait: '/mentors/aditya-thakur.png', portraitAlt: 'Aditya Thakur, MentoraX Chemistry Mentor' },
  { initials: 'SB', name: 'Sparsh Bansal', role: 'Biology Mentor', detail: 'IISER TVM undergraduate · PCB mentor focused on Biology, IAT & NEST preparation, and clear concept support.', tone: 'ink' },
]

const team = [
  ['Raj', 'Maths Mentor', 'A calm system, a clear next step, and personalised academic guidance.'],
  ['Bhavesha', 'Physics Mentor', 'Physics guidance grounded in research, clear concepts, and exam-aware thinking.'],
  ['Team member 03', 'Operations', 'Details and portrait will be added from the source folder.'],
  ['Team member 04', 'Student experience', 'Details and portrait will be added from the source folder.'],
]

const pageTitle: Record<string, string> = {
  '/': 'MentoraX | The Science of a Clear Path',
  '/mentorship': 'Mentorship | MentoraX',
  '/books': 'Books | MentoraX',
  '/mentors': 'Mentors | MentoraX',
  '/team': 'Our Team | MentoraX',
  '/contact': 'Contact | MentoraX',
  '/refund-policy': 'Refund Policy | MentoraX',
  '/privacy-policy': 'Privacy Policy | MentoraX',
  '/terms': 'Terms & Conditions | MentoraX',
}

function ScrollManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = pageTitle[pathname] ?? pageTitle['/']
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function FaqAccordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <AnimateIn key={item.question} delay={index * 0.05}>
            <div className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
              <button
                className="faq-trigger"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="faq-question">{item.question}</span>
                <span className="faq-toggle-icon">{isOpen ? <Minus size={18} /> : <Plus size={18} />}</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimateIn>
        )
      })}
    </div>
  )
}

function AnimateIn({ children, className = '', delay = 0, pop = true }: { children: React.ReactNode; className?: string; delay?: number; pop?: boolean }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: pop ? 30 : 20, scale: pop ? 0.97 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function StatCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (triggered) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setTriggered(true)
        observer.disconnect()
        let startTime: number | null = null
        const duration = 1600
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, triggered])

  return <span ref={ref} className="stat-number">{count}{suffix}</span>
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><span />{children}</p>
}

function ArrowLink({ to, children, solid = false, className = '' }: { to: string; children: React.ReactNode; solid?: boolean; className?: string }) {
  return <Link className={`arrow-link ${solid ? 'solid' : ''} ${className}`} to={to}>{children}<ArrowUpRight size={17} strokeWidth={1.8} /></Link>
}

function Tilt({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const move = (event: MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--rx', `${((event.clientY - box.top) / box.height - 0.5) * -3}deg`)
    event.currentTarget.style.setProperty('--ry', `${((event.clientX - box.left) / box.width - 0.5) * 3}deg`)
    event.currentTarget.style.setProperty('--glow-x', `${((event.clientX - box.left) / box.width) * 100}%`)
    event.currentTarget.style.setProperty('--glow-y', `${((event.clientY - box.top) / box.height) * 100}%`)
  }
  const leave = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty('--rx')
    event.currentTarget.style.removeProperty('--ry')
  }
  return <div className={`tilt ${className}`} onMouseMove={move} onMouseLeave={leave}>{children}</div>
}

function Mark() { return <span className="mark" aria-hidden="true"><i>M</i></span> }

function HeroShader() {
  const reduced  = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Programmatically trigger play so it works inside sandboxed iframes
  // (React's autoPlay prop alone is not sufficient in some contexts)
  useEffect(() => {
    const vid = videoRef.current
    if (!vid || reduced) return
    vid.muted = true // must be muted before play() is called
    vid.play().catch(() => {/* silently swallow policy rejections */})
  }, [reduced])

  return (
    <div className="hero-shader-wrap" aria-hidden="true">
      {/* Aurora video over the CSS gradient fallback */}
      <div className="hero-video-wrap">
        <video
          ref={videoRef}
          className="hero-aurora-video"
          src="/hero-aurora.mp4"
          autoPlay={!reduced}
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
        />
      </div>

    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  return <header className="site-header"><div className="header-inner"><Link className="wordmark" to="/"><Mark /><span>mentora<span className="wordmark-x">x</span></span></Link><nav className="desktop-nav" aria-label="Main navigation">{navItems.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav><div className="header-actions"><Link className="header-contact" to="/contact">Start a conversation <ArrowUpRight size={14} /></Link><Link className="header-cta" to="/mentorship">Apply to MentoraX <ArrowRight size={15} /></Link><button className="menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></div><AnimatePresence>{open && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .2 }}>{navItems.map(([label, to]) => <NavLink key={to} to={to}>{label}<ArrowUpRight size={17} /></NavLink>)}<Link to="/contact">Start a conversation <ArrowRight size={17} /></Link></motion.div>}</AnimatePresence></header>
}

function Footer() {
  const openBuilderInstagram = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!/android/i.test(navigator.userAgent)) return
    event.preventDefault()
    window.location.href = 'intent://instagram.com/_u/vaibhavsawroop/#Intent;package=com.instagram.android;scheme=https;S.browser_fallback_url=https%3A%2F%2Fwww.instagram.com%2Fvaibhavsawroop%2F;end'
  }

  return <footer className="site-footer"><div className="footer-grid"><div><Link className="wordmark footer-mark" to="/"><Mark /><span>mentora<span className="wordmark-x">x</span></span></Link><p className="footer-statement">A focused mentorship studio for IAT, NEST, CUET, and science entrance aspirants. Managed with intent by Raj &amp; Dipti.</p><div className="social-links"><a href="mailto:support@mentorax.in" aria-label="Email MentoraX"><Mail size={17} /></a></div></div><FooterColumn title="Explore" links={navItems} /><FooterColumn title="Company" links={[["Contact Us", "/contact"], ["Refund & Cancellation Policy", "/refund-policy"], ["Privacy Policy", "/privacy-policy"], ["Terms & Conditions", "/terms"]]} /><div className="footer-note"><span className="tiny-kicker">A note from us</span><p>There is no shortcut to a good path. Only better guidance along it.</p></div></div><div className="footer-bottom"><span>© 2026 MentoraX. All Rights Reserved.</span><span>Website Built By <a className="builder-credit" href="https://www.instagram.com/vaibhavsawroop" target="_blank" rel="noopener noreferrer" onClick={openBuilderInstagram}>Vaibhav Sawroop</a></span><span>Made for the long game.</span></div></footer>
}

function FooterColumn({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return <div className="footer-column"><span className="tiny-kicker">{title}</span>{links.map(([name, href]) => <Link key={href} to={href}>{name}</Link>)}</div>
}

function Layout() {
  return (
    <SmoothScroll>
      <ScrollManager />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <PageTransition />
    </SmoothScroll>
  )
}

function PageIntro({ index, eyebrow, title, italic, copy, side }: { index: string; eyebrow: string; title: string; italic?: string; copy: string; side?: string }) {
  return (
    <section className="page-intro">
      <div className="page-intro-grid">
        <AnimateIn>
          <div className="page-index">{index}</div>
        </AnimateIn>
        <AnimateIn delay={.07}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <TextPop as="h1" delay={0.08}>
            {title} {italic && <em>{italic}</em>}
          </TextPop>
        </AnimateIn>
        <AnimateIn delay={.14}>
          <p className="intro-copy">{copy}</p>
          {side && <p className="intro-side">{side}</p>}
        </AnimateIn>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const total = studentTestimonials.length
  const prefersReduced = useReducedMotion()

  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setActive(i => (i + 1) % total), [total])

  useEffect(() => {
    if (paused || prefersReduced) return
    const id = setInterval(next, 4600)
    return () => clearInterval(id)
  }, [paused, next, prefersReduced])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  return (
    <section
      className="testimonials-section section-pad"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return
        const dx = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(dx) > 52) dx > 0 ? next() : prev()
        touchStartX.current = null
      }}
    >
      <div className="section-head">
        <div>
          <Eyebrow>Verified Student Admissions</Eyebrow>
          <h2>Real results. <em>Real IISER admits.</em></h2>
        </div>
        <p>Direct feedback from aspirants who transformed their IAT &amp; NEST preparation with MentoraX guidance.</p>
      </div>

      <div
        className="slideshow-stage"
        aria-roledescription="carousel"
        aria-label="Student testimonials"
      >
        <div
          className="slideshow-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {studentTestimonials.map((t, i) => (
            <div
              key={t.id}
              className="slideshow-item"
              aria-hidden={i !== active}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
            >
              <article className="slide-card">
                <div className="slide-card-top">
                  <span className="college-badge">{t.badge}</span>
                </div>
                <p className="slide-quote">"{t.comment}"</p>
                <div className="slide-author">
                  <span className="slide-name">{t.author}</span>
                  <span className="yt-proof-tag"><span />{t.handle}</span>
                </div>
                {t.reply && (
                  <div className="mentor-reply-box">
                    <MessageCircle size={14} />
                    <span>{t.reply}</span>
                  </div>
                )}
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className="slideshow-controls">
        <button className="slide-arrow" onClick={prev} aria-label="Previous review">
          <ChevronLeft size={18} />
        </button>
        <div className="slide-dots" role="tablist" aria-label="Testimonial navigation">
          {studentTestimonials.map((t, i) => (
            <button
              key={t.id}
              className={`slide-dot${i === active ? ' slide-dot-active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Review by ${t.author}`}
              role="tab"
              aria-selected={i === active}
            />
          ))}
        </div>
        <button className="slide-arrow" onClick={next} aria-label="Next review">
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  )
}

function Home() {
  return <>
    <section className="hero">
      <HeroShader />
      <div className="hero-wrap">
        <div className="hero-copy">
          <motion.div
            className="hero-proof-badge"
            initial={{ opacity: 0, y: -10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="proof-dot" />
            <span>92+ IISER admits</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .06, ease: [0.22, 1, 0.36, 1] }}>
            <Eyebrow>For IAT &amp; NEST aspirants</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8, delay: .12, ease: [0.22, 1, 0.36, 1] }}
          >
            The science<br />of a <em>clear</em> path.
          </motion.h1>

          <motion.p
            className="hero-lede"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, delay: .22, ease: [0.22, 1, 0.36, 1] }}
          >
            MentoraX is the thoughtful, high-touch mentoring space for students who want their effort to compound.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6, delay: .32, ease: [0.22, 1, 0.36, 1] }}
          >
            <ArrowLink solid to="/mentorship">Explore mentorship</ArrowLink>
            <ArrowLink to="/mentors">Meet your mentors</ArrowLink>
          </motion.div>

          <motion.div
            className="hero-tier-pills"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: .7, delay: .52 }}
          >
            <span className="tier-pill tier-foundation">Foundation</span>
            <span className="tier-pill tier-momentum">Momentum</span>
            <span className="tier-pill tier-intensive">Intensive</span>
          </motion.div>
        </div>

        <div className="hero-art">
          <motion.div
            className="orbit-caption orbit-caption-one"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="caption-dot" />
            doubt → direction
          </motion.div>

          <motion.div
            className="orbit-caption orbit-caption-two"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>01</span>
            <b>Start where<br />you are.</b>
          </motion.div>
        </div>
      </div>

      <div className="hero-bottom">
        <span>Scroll to calibrate</span>
        <div className="scroll-rule"><i /></div>
        <span>MentoraX · 2026</span>
      </div>
    </section>

    <section className="stats-banner section-pad">
      <div className="stats-grid">
        <div className="stat-item">
          <StatCounter target={92} suffix="+" />
          <span>IISER admits</span>
        </div>
        <div className="stat-item">
          <StatCounter target={400} suffix="+" />
          <span>Student hours</span>
        </div>
        <div className="stat-item">
          <StatCounter target={12} />
          <span>Strategy modules</span>
        </div>
      </div>
    </section>

    <section className="manifesto section-pad"><div className="manifesto-grid"><AnimateIn><span className="oversized-number">01</span></AnimateIn><AnimateIn><div><Eyebrow>Not another content pile</Eyebrow><TextPop as="h2" mode="skew">A good plan has a <em>pulse.</em></TextPop></div></AnimateIn><AnimateIn delay={.08}><p className="body-large">At MentoraX, mentorship is built around the difference between knowing what matters and actually knowing what to do next. The feeling is calm, exact, and personal.</p><ArrowLink to="/team">Why we built this</ArrowLink></AnimateIn></div></section>

    <section className="field-notes section-pad"><div className="section-head"><div><Eyebrow>The MentoraX field notes</Eyebrow><TextPop as="h2" mode="blur">Less static. More <em>signal.</em></TextPop></div><p>We have a bias for the few things that genuinely shift preparation forward.</p></div><div className="feature-list"><FeatureCard number="01" icon={<Compass />} title="A map you will use." text="Preparation becomes easier to trust when the next move is visible, and made for your actual week." /><FeatureCard number="02" icon={<MessageCircle />} title="A voice when you need one." text="A real mentoring relationship makes doubt smaller, faster than more content ever can." /><FeatureCard number="03" icon={<Target />} title="A rhythm that holds." text="The aim isn’t study intensity for a week. It’s a system that keeps you moving for the full arc." /></div></section>

    <section className="way section-pad"><div className="way-top"><Eyebrow>How the work unfolds</Eyebrow><span className="tiny-kicker">A four-part sequence</span></div><div className="way-grid"><WayItem number="01" title="Orient" copy="Meet your current level with honesty and without drama." /><WayItem number="02" title="Build" copy="Turn a large ambition into a rhythm you can live with." /><WayItem number="03" title="Refine" copy="Use feedback to find the few gaps that actually matter." /><WayItem number="04" title="Perform" copy="Arrive for the exam with calm, strategy, and self-trust." /></div></section>

    <TestimonialsSection />

    <section className="founders-section section-pad"><div className="founder-portrait-panel"><div className="founder-orbit"><span>MentoraX</span><i>✦</i><span>MentoraX</span><i>✦</i><span>MentoraX</span></div><div className="founder-initials">R <i>+</i> D</div><span className="rd-pun-label">Research &amp; Development</span><p>Managed personally by<br /><b>Raj &amp; Dipti</b></p></div><div className="founder-copy"><AnimateIn><Eyebrow>R+D — the real kind</Eyebrow><TextPop as="h2" mode="popup">Warmth is not the opposite of <em>rigour.</em></TextPop><p className="body-large">R+D at MentoraX means two things at once: Raj &amp; Dipti, and the Research &amp; Development mindset that IISER, IAT, and NEST are built on. We believe the best exam prep is also the best science education.</p><div className="founder-quote"><Quote size={21} /><p>"The aim is not to make a student busier. It's to help them become more certain."</p></div><ArrowLink to="/team">Meet the MentoraX team</ArrowLink></AnimateIn></div></section>

    <section className="program-preview section-pad"><AnimateIn><div className="section-head"><div><Eyebrow>Find your level of support</Eyebrow><TextPop as="h2" mode="bounce">Designed for a very real <em>journey.</em></TextPop></div><ArrowLink to="/mentorship">View the program</ArrowLink></div></AnimateIn><div className="plan-strip">{plans.map((plan, index) => <AnimateIn key={plan.name} delay={index * .06}>{plan.name === 'Foundation' || plan.name === 'Intensive' ? <Clouds className="plan-clouds" scale={1.1} speed={0.28} cover={0.12} density={1.35} shading={0.14} opacity={0.3} shadow={0.04} wind={0.45} windRadius={180} quality={0.55}><Tilt className="plan-card"><PlanCardContent plan={plan} /></Tilt></Clouds> : <Tilt className="plan-card plan-card-featured"><PlanCardContent plan={plan} /></Tilt>}</AnimateIn>)}</div></section>

    <section className="book-banner">
      <div>
        <span className="tiny-kicker">The MentoraX library</span>
        <TextPop as="h2" mode="blur">Resources that stay <em>on your desk.</em></TextPop>
        <p>Purpose-built books and revision editions are arriving here soon.</p>
        <ArrowLink to="/books">See the library</ArrowLink>
      </div>
      <div className="book-sculpture">
        <Link to="/books" className="book-shape b-one" aria-label="IAT book — see the library">
          IAT
          <span className="book-hover-label">View IAT guide</span>
        </Link>
        <Link to="/books" className="book-shape b-two" aria-label="NEST book — see the library">
          NEST
          <span className="book-hover-label">View NEST guide</span>
        </Link>
        <Link to="/books" className="book-shape b-three" aria-label="MentoraX X book — see the library">
          X
          <span className="book-hover-label">View all</span>
        </Link>
      </div>
    </section>

    <section className="faq-section section-pad">
      <div className="section-head">
        <div>
          <Eyebrow>Frequently asked questions</Eyebrow>
          <TextPop as="h2" mode="skew">Questions we hear <em>often.</em></TextPop>
        </div>
        <p>Can't find your answer? <ArrowLink to="/contact">Ask us directly</ArrowLink></p>
      </div>
      <FaqAccordion items={faqs} />
    </section>

    <section className="closing section-pad closing-with-orb">
      <div className="closing-orb" aria-hidden="true">
        <Suspense fallback={null}><HeroScene /></Suspense>
      </div>
      <AnimateIn><span className="closing-star">✦</span><TextPop as="h2" mode="popup">There is a version of preparation that feels like <em>possibility.</em></TextPop><p>Let's find the path that makes sense for you.</p><ArrowLink solid to="/contact">Start a conversation</ArrowLink></AnimateIn>
    </section>
  </>
}

function FeatureCard({ number, icon, title, text }: { number: string; icon: React.ReactNode; title: string; text: string }) { return <article className="feature-card"><div><span className="feature-number">{number}</span><span className="feature-icon">{icon}</span></div><h3>{title}</h3><p>{text}</p><ArrowUpRight className="feature-arrow" size={19} /></article> }
function WayItem({ number, title, copy }: { number: string; title: string; copy: string }) { return <article className="way-item"><span>{number}</span><h3>{title}</h3><p>{copy}</p></article> }

function ProductWhySection() {
  const benefits = [
    'Understand how IAT questions are actually asked',
    'Learn the concept behind every problem',
    'Develop an exam-oriented problem-solving approach',
    'Identify frequently tested topics and patterns',
  ]
  return (
    <section className="product-why section-pad">
      <div className="product-section-index">01</div>
      <div className="product-why-copy">
        <Eyebrow>Why this book?</Eyebrow>
        <h2>Don’t just solve PYQs. Understand <em>them.</em></h2>
        <p className="body-large">IAT preparation isn’t about memorizing hundreds of answers. It’s about recognizing the concepts, patterns, and problem-solving approaches hidden inside the questions.</p>
        <p>Every question becomes a learning opportunity — so you can see what the exam asks, why the answer works, and what to do next.</p>
      </div>
      <div className="product-benefits">
        {benefits.map((benefit, index) => (
          <div className="product-benefit" key={benefit}>
            <span>0{index + 1}</span><p>{benefit}</p><Check size={17} />
          </div>
        ))}
      </div>
    </section>
  )
}

function ProductInsideSection() {
  const features = [
    ['01', 'Complete IAT PYQs', 'Questions from 2017–2024 to reveal how the examination has evolved.'],
    ['02', 'Step-by-step solutions', 'Detailed working designed to make difficult questions easier to apply.'],
    ['03', 'Concept-based explanations', 'Don’t memorize the answer. Understand why it is correct.'],
    ['04', 'All four subjects', 'Physics, Chemistry, Mathematics, and Biology in one focused resource.'],
  ]
  return (
    <section className="product-inside section-pad">
      <div className="section-head">
        <div><Eyebrow>What’s inside?</Eyebrow><h2>Everything you need to master <em>IAT PYQs.</em></h2></div>
        <p>Built to be useful while you learn, precise while you practise, and easy to return to during revision.</p>
      </div>
      <div className="product-feature-grid">
        {features.map(([number, title, copy]) => <article className="product-feature" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
      </div>
    </section>
  )
}

function ProductLoopSection() {
  return (
    <section className="way product-loop section-pad">
      <div className="way-top"><Eyebrow>Your preparation, simplified</Eyebrow><span className="tiny-kicker">From question to confidence</span></div>
      <div className="way-grid product-loop-grid">
        <WayItem number="01" title="Learn" copy="Build the concepts that make questions easier to see." />
        <WayItem number="02" title="Practice" copy="Solve authentic IAT questions from the actual examination." />
        <WayItem number="03" title="Analyze" copy="Understand mistakes, patterns, and solution approaches." />
        <WayItem number="04" title="Revise" copy="Return to important concepts and recurring topics." />
        <WayItem number="05" title="Perform" copy="Walk into the IAT knowing what to expect." />
      </div>
    </section>
  )
}

function Mentorship() { return <><PageIntro index="01" eyebrow="The MentoraX mentorship" title="A better way to be" italic="serious." copy="Structure when you need it. Space when you need to think. The program is made to support the whole arc of IAT and NEST preparation." side="For students who care deeply about what comes next." /><section className="section-pad program-design"><div className="section-head"><div><Eyebrow>The programme in practice</Eyebrow><h2>One system, <em>four dimensions.</em></h2></div></div><div className="dimension-grid"><Dimension number="01" title="Direction" copy="A preparation map with a particular answer to the question: what should I do next?" /><Dimension number="02" title="Dialogue" copy="Mentoring conversations that turn uncertainty into a sensible decision." /><Dimension number="03" title="Deliberate practice" copy="Material and problem-solving built around learning, not just finishing." /><Dimension number="04" title="Reflection" copy="Regular recalibration so your plan grows with your understanding." /></div></section><section className="pricing-area section-pad"><div className="section-head"><div><Eyebrow>Programme editions</Eyebrow><h2>Pick the pressure you <em>need.</em></h2></div><p>Pricing and final inclusions are being confirmed by the MentoraX team. Every plan below is ready to replace with the official details.</p></div><div className="pricing-cards">{plans.map((plan, index) => <AnimateIn key={plan.name} delay={index * .06}><article className={`edition-card ${plan.featured ? 'edition-card-primary' : ''}`}><span className="edition-index">{plan.index}</span>{plan.featured && <span className="edition-label">Most complete</span>}<h3>{plan.name}</h3><div className="price-tba">₹ <span>TBA</span></div><p>{plan.note}</p><ul>{plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul><ArrowLink solid={!!plan.featured} to="/contact">Enquire about {plan.name}</ArrowLink></article></AnimateIn>)}</div></section><section className="material-section section-pad"><div><Eyebrow>The material desk</Eyebrow><h2>Useful things.<br /><em>In the right order.</em></h2></div><div className="material-list">{materials.map(([number, title, copy]) => <article key={number} className="material-row"><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><a href="#materials" aria-label={`${title} link coming soon`}>Source files <ArrowUpRight size={17} /></a></article>)}</div></section><section className="section-pad"><div className="cta-panel"><Sparkles /><div><span className="tiny-kicker">The first step</span><h2>Tell us a little<br />about your <em>ambition.</em></h2></div><ArrowLink solid to="/contact">Start your enquiry</ArrowLink></div></section></> }
function Dimension({ number, title, copy }: { number: string; title: string; copy: string }) { return <article className="dimension"><span>{number}</span><h3>{title}</h3><p>{copy}</p></article> }

function BooksHero() {
  return (
    <section className="books-hero">
      <div className="books-hero-grid">
        <div className="books-hero-copy">
          <motion.div className="books-launch-pill" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
            <span /> IAT MENTORAX · BOOK 01
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .08 }}>
            <Eyebrow>For serious IAT aspirants</Eyebrow>
            <h1>Master the past.<br />Ace the <em>future.</em></h1>
          </motion.div>
          <motion.p className="books-hero-lede" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .16 }}>
            IAT PYQ&apos;s Solution is the complete solved question bank for the IISER Aptitude Test — built to help you understand the exam, not just finish it.
          </motion.p>
          <motion.div className="books-hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .24 }}>
            <ArrowLink solid to="/contact?subject=iat-pyq-book">Buy the book · ₹499</ArrowLink>
            <span className="books-hero-note">One-time purchase<br />Instant access · Lifetime availability</span>
          </motion.div>
          <motion.div className="books-subjects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .4 }}>
            <span>Physics</span><span>Chemistry</span><span>Mathematics</span><span>Biology</span>
          </motion.div>
        </div>
        <div className="books-hero-art" aria-label="IAT PYQ's Solution book">
          <div className="books-hero-orbit books-hero-orbit-one" />
          <div className="books-hero-orbit books-hero-orbit-two" />
          <motion.div className="books-hero-card" initial={{ opacity: 0, y: 42, rotate: 9 }} animate={{ opacity: 1, y: 0, rotate: 5 }} transition={{ duration: .9, delay: .15, ease: [0.22, 1, 0.36, 1] }}>
            <span className="books-card-kicker">IAT Mentorax</span>
            <strong>IAT<br /><em>PYQ&apos;s</em></strong>
            <span className="books-card-solution">Solution</span>
            <span className="books-card-years">2017—2024</span>
            <span className="books-card-subjects">PHYSICS · CHEMISTRY<br />MATHEMATICS · BIOLOGY</span>
            <b>₹499</b>
          </motion.div>
          <motion.div className="books-floating-tag books-floating-tag-top" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55, delay: .65 }}>
            <span className="floating-tag-dot" /> 8 years of real questions
          </motion.div>
          <motion.div className="books-floating-tag books-floating-tag-bottom" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55, delay: .8 }}>
            Question <i>→</i> Concept <i>→</i> Solution
          </motion.div>
        </div>
      </div>
      <div className="books-hero-footer"><span>2017–2024 PYQs</span><i /><span>4 subjects</span><i /><span>Detailed solutions</span><i /><span>₹499 one-time</span></div>
    </section>
  )
}

function Books() { return <><BooksHero /><section className="book-showcase section-pad"><BookProduct type="IAT" subtitle="IAT PYQ's Solution · 2017–2024" description="Practice real IAT questions, understand the concepts behind them, and learn how the exam actually asks questions." tone="plum" /><BookProduct type="NEST" subtitle="NEST PYQ's Solution · 2017–2024" description="A focused NEST edition for practising authentic questions, understanding recurring concepts, and revising with confidence." tone="teal" /></section><section className="library-note"><BookOpen /><div><Eyebrow>What makes it different?</Eyebrow><h2>Question → Concept → Approach → Solution.</h2><p>Instead of simply telling you the answer, the book helps you understand how to arrive at it. That makes PYQ practice more useful, more deliberate, and easier to revise.</p></div></section><section className="section-pad"><div className="cta-panel dark-cta"><div><span className="tiny-kicker">One-time purchase · ₹499</span><h2>Start practising with the <em>real exam.</em></h2></div><ArrowLink solid to="/contact?subject=iat-pyq-book">Get the book · ₹499</ArrowLink></div></section></> }
function BookProduct({ type, subtitle, description, tone }: { type: string; subtitle: string; description: string; tone: string }) { return <AnimateIn><article className={`book-product ${tone}`}><div className="book-object"><div className="book-cover"><span>IAT Mentorax<br />book 01</span><strong>{type}</strong><i>{subtitle}</i><b>2017–24</b></div><div className="book-pages" /></div><div className="book-product-copy"><span className="tiny-kicker">{subtitle}</span><h2>{type} <em>edition.</em></h2><p>{description}</p><div className="product-meta"><span>Price <b>₹499</b></span><span>Format <b>Digital book</b></span><span>Access <b>Instant · lifetime</b></span></div><ArrowLink solid to="/contact?subject=iat-pyq-book">Get the book · ₹499</ArrowLink></div></article></AnimateIn> }
function PlanCardContent({ plan }: { plan: (typeof plans)[number] }) { return <><div className="plan-top"><span>{plan.index}</span>{plan.featured && <span className="plan-badge">The MentoraX edit</span>}</div><h3>{plan.name}</h3><p>{plan.note}</p><ul>{plan.features.slice(0, 3).map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul><Link to="/contact" className="plan-link">Enquire <ArrowRight size={16} /></Link></> }

function Mentors() { return <><PageIntro index="03" eyebrow="Your dedicated mentorship team" title="Four personal mentors. One clear way" italic="forward." copy="Every MentoraX student receives academic, subject, strategy, and career guidance throughout the IAT and NEST preparation journey." side="Individual attention, fast doubt resolution, weekly progress reviews, and direct mentor support." /><section className="mentor-grid section-pad">{mentors.map((person, index) => <AnimateIn key={person.name} delay={index * .05}><article className={`mentor-card ${person.tone}`}>{person.portrait ? <HalftoneReveal className="mentor-portrait mentor-halftone" src={person.portrait} alt={person.portraitAlt ?? `${person.name}, MentoraX mentor`} inkColor={person.tone === 'sage' ? '#27463c' : '#2b214d'} paperColor={person.tone === 'sage' ? '#e8f1df' : '#eee8ff'} /> : <div className="mentor-portrait"><span>{person.initials}</span><i>MentoraX</i><div className="portrait-badge">Profile image<br />coming soon</div></div>}<div className="mentor-info"><span className="tiny-kicker">{person.role}</span><h2>{person.name}</h2><p>{person.detail}</p><button type="button">Profile details <ChevronDown size={16} /></button></div></article></AnimateIn>)}</section><section className="mentor-manifesto section-pad"><div><Eyebrow>Our approach to mentorship</Eyebrow><h2>The best mentors leave you with better <em>questions.</em></h2></div><div className="manifesto-points"><p><span>01</span>A personalised study roadmap and weekly progress review keep preparation on track.</p><p><span>02</span>Dedicated subject support makes doubts, concepts, and chapter strategy easier to solve.</p><p><span>03</span>Strategy and career guidance help turn preparation into a confident admission plan.</p></div></section></> }

// Add `image: '/images/team/<filename>.jpg'` to each entry when portrait photos are available
const hoverTeamMembers: HoverMemberItem[] = [
  { name: 'Raj', role: 'Maths Mentor', initials: 'R' },
  { name: 'Bhavesha', role: 'Physics Mentor', initials: 'B', image: '/mentors/bhavesha.png' },
  { name: 'Aditya Thakur', role: 'Chemistry Mentor', initials: 'AT', image: '/mentors/aditya-thakur.png' },
  { name: 'Sparsh Bansal', role: 'Biology Mentor', initials: 'SB' },
  { name: 'Team 03', role: 'Operations', initials: '03' },
  { name: 'Team 04', role: 'Student Experience', initials: '04' },
  { name: 'Team 05', role: 'Student Support', initials: '05' },
]

function Team() {
  return (
    <>
      <HoverMember
        teamMembers={hoverTeamMembers}
        defaultText="MENTORAX"
        backgroundColor="#fbfaf6"
        textColor="#181722"
        hoverTextColor="#181722"
        scrollTarget="#team-contact"
      />
      <section id="team-contact" className="section-pad">
        <div className="cta-panel">
          <Crown />
          <div>
            <span className="tiny-kicker">Want to work with us?</span>
            <h2>Let's build something<br />worth <em>returning to.</em></h2>
          </div>
          <ArrowLink solid to="/contact">Contact MentoraX</ArrowLink>
        </div>
      </section>
    </>
  )
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }
  return (
    <>
      <PageIntro
        index="05"
        eyebrow="A good place to begin"
        title="Let's talk about what comes"
        italic="next."
        copy="Tell us a little about where you are, where you want to go, and what kind of support would feel most useful."
        side="For mentorship, purchase, privacy, or refund questions, email support@mentorax.in."
      />
      <section className="contact-layout section-pad">
        <div className="contact-aside">
          <span className="tiny-kicker">Start a conversation</span>
          <h2>Good questions<br />are a good <em>start.</em></h2>
          <p>If you are unsure which edition of MentoraX is right for you, that is exactly the kind of conversation we are here for.</p>
           <div className="contact-method"><Mail size={17} /><span><strong>Official email</strong><br /><a href="mailto:support@mentorax.in">support@mentorax.in</a></span></div>
           <div className="contact-method"><MessageCircle size={17} /><span><strong>Policy questions</strong><br />For privacy, payment, or refund support, email us directly.</span></div>
        </div>
        <form className="contact-form" name="mentorax-enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit}>
          <input type="hidden" name="form-name" value="mentorax-enquiry" />
          <p className="hidden-field"><label>Do not fill this out <input name="bot-field" /></label></p>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="form-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="success-icon"><Check size={32} /></div>
                <h3>Thank you for reaching out.</h3>
                <p>Your enquiry has been staged. The MentoraX team will respond through the official contact channel once it is live.</p>
                <button type="button" onClick={() => setSubmitted(false)} className="success-reset">Send another enquiry <ArrowRight size={15} /></button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="form-head"><span>01</span><p>All fields marked * are required.</p></div>
                <label>Your name*<input required name="name" autoComplete="name" placeholder="How should we address you?" /></label>
                <div className="form-two">
                  <label>Email address*<input required type="email" name="email" autoComplete="email" placeholder="you@example.com" /></label>
                  <label>Mobile number<input name="phone" type="tel" autoComplete="tel" placeholder="Your number" /></label>
                </div>
                <label>I am preparing for<select name="exam" defaultValue=""><option value="" disabled>Select an option</option><option value="IAT">IAT</option><option value="NEST">NEST</option><option value="IAT and NEST">IAT and NEST</option><option value="Not sure yet">Not sure yet</option></select></label>
                <label>I'm interested in<select name="interest" defaultValue=""><option value="" disabled>Select an option</option><option>Mentorship programme</option><option>Study materials</option><option>MentoraX books</option><option>General enquiry</option></select></label>
                <label>Tell us what you are working toward*<textarea required name="message" placeholder="Share your class, goals, or the question you would like help with." /></label>
                <div className="form-submit">
                  <p>Please do not include passwords, payment card details, or other highly sensitive information. By submitting, you agree to our <Link to="/privacy-policy">Privacy Policy</Link>.</p>
                  <button type="submit">Send enquiry <ArrowRight size={17} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </section>

      <section className="faq-section section-pad">
        <div className="section-head">
          <div>
            <Eyebrow>Common questions</Eyebrow>
            <h2>Before you <em>ask.</em></h2>
          </div>
        </div>
        <FaqAccordion items={faqs} />
      </section>
    </>
  )
}

type PolicySection = { title: string; text?: string; items?: string[] }

const refundSections: PolicySection[] = [
  { title: 'General policy', text: 'Because most MentoraX products are digital, refunds are limited. Please read carefully before purchasing.' },
  { title: 'Eligible refunds', items: ['Duplicate payment occurred.', 'Payment was deducted but the order was not created.', 'MentoraX cancels a scheduled paid mentorship session and cannot provide a suitable alternative.', 'Verified technical issues on our side permanently prevent access to the purchased service.'] },
  { title: 'Non-refundable items', items: ['Digital Books', 'PDF Notes', 'Flashcards', 'Mock Tests', 'Downloaded Study Materials', 'Recorded Classes', 'Completed Mentorship Sessions', 'Community Membership', 'Promotional or discounted purchases, unless required by law.'] },
  { title: 'Session rescheduling', text: 'Students should inform us at least 24 hours before a scheduled 1-to-1 mentorship session to request a reschedule. Missed sessions without prior notice may be treated as completed.' },
  { title: 'Cancellation by MentoraX', text: 'If MentoraX cancels a session, students may choose a new session date or a refund where appropriate.' },
  { title: 'Refund processing', text: 'Approved refunds will generally be processed to the original payment method within 7–10 business days, although bank processing times may vary.' },
  { title: 'Contact', text: 'For a refund review, email support@mentorax.in with the name used for the order, order reference, date of purchase, and a concise explanation.' },
]
const privacySections: PolicySection[] = [
  { title: 'Information we collect', text: 'When using our services we may collect your name, email, mobile number, city, educational details, and payment-related information. Payment details are processed securely through third-party payment gateways; MentoraX does not store debit or credit card information.' },
  { title: 'Usage information', items: ['Browser', 'Device', 'IP address', 'Website analytics', 'Cookies'] },
  { title: 'How we use your information', items: ['Deliver mentorship and study materials.', 'Send session links.', 'Process payments.', 'Improve website performance.', 'Provide customer support.', 'Notify you about updates.'] },
  { title: 'Cookies', text: 'We use cookies to improve user experience, remember login sessions, and analyse traffic. Users may disable cookies from their browser settings.' },
  { title: 'Third-party services', text: 'We may use Google Analytics, Razorpay, PhonePe, Google Meet, WhatsApp, and Gmail. Each service follows its own privacy policy.' },
  { title: 'Data security', text: 'We implement reasonable security measures to protect user information. However, no online system is 100% secure.' },
  { title: 'Children’s privacy', text: 'Students under 13 should not use the platform without parental supervision.' },
  { title: 'Your rights', text: 'You may request to update personal information, correct inaccurate information, or delete your account, subject to legal and business retention needs.' },
  { title: 'Data retention', text: 'Information is retained only as long as necessary for providing services, resolving disputes, complying with applicable laws, and maintaining educational records where appropriate.' },
  { title: 'Contact', text: 'For privacy questions or requests, email support@mentorax.in.' },
]
const termsSections: PolicySection[] = [
  { title: 'Welcome to MentoraX', text: 'These Terms & Conditions govern your use of our website, services, mentorship programs, study materials, mock tests, digital books, and all products offered through our platform. By accessing this website or purchasing any service, you agree to these Terms. If you do not agree, please do not use our website.' },
  { title: 'About MentoraX', text: 'MentoraX is an educational mentorship platform created to guide students preparing for competitive examinations such as IAT, IISER Admission, NEST, CUET, and other Science Entrance Exams. We provide personal mentorship, study material, mock tests, GMeet sessions, digital books, recorded sessions, strategy sessions, and community support.' },
  { title: 'Eligibility', text: 'You must be at least 13 years old to use this website. Students below 18 years should obtain permission from a parent or guardian before purchasing any paid service.' },
  { title: 'User responsibilities', items: ['Provide accurate information.', 'Maintain confidentiality of your account.', 'Not share your login with others.', 'Not misuse our platform.', 'Not distribute paid materials.'] },
  { title: 'Intellectual property', text: 'All content available on MentoraX, including PDFs, books, mock tests, videos, notes, flashcards, website design, logos, and graphics, is owned by MentoraX. You may not copy, sell, upload, reproduce, or redistribute it without written permission. Violation may result in legal action.' },
  { title: 'Payments', text: 'Payments are processed through secure payment gateways. Prices may change without prior notice. GST, if applicable, will be added during checkout.' },
  { title: 'Digital products', items: ['Digital products are licensed for personal educational use only.', 'You cannot upload them publicly, share them on Telegram, sell them, or print them for commercial use.'] },
  { title: 'Mentorship services', text: 'MentoraX provides academic guidance only. Admission, ranks, cutoffs, scholarships, placements, or career outcomes cannot be guaranteed. Students are responsible for their own preparation and performance.' },
  { title: 'Community guidelines', text: 'Students must maintain respectful behaviour. Harassment, abusive language, spam, hate speech, or inappropriate conduct may result in permanent removal without refund.' },
  { title: 'Account suspension', text: 'MentoraX reserves the right to suspend or terminate any account that shares paid content, uses fake payment proofs, violates community rules, or engages in fraudulent activities.' },
  { title: 'Limitation of liability', text: 'MentoraX shall not be liable for internet failures, device incompatibility, exam postponement, government policy changes, admission decisions, or personal academic performance.' },
  { title: 'Changes', text: 'We may modify these Terms at any time. Updated versions will be posted on this page.' },
  { title: 'Governing law', text: 'These Terms shall be governed by the laws of India.' },
  { title: 'Contact', text: 'For questions about these Terms, email support@mentorax.in.' },
]

function Policy({ kind, intro, sections }: { kind: string; intro: string; sections: PolicySection[] }) {
  return <><PageIntro index="Legal" eyebrow="MentoraX legal information" title={kind} copy={intro} side="Effective August 2026 · Please read this page carefully." /><section className="policy-layout section-pad"><aside><span className="tiny-kicker">On this page</span>{sections.map(({ title }, index) => <a href={`#policy-${index}`} key={title}>{title}</a>)}</aside><article><div className="policy-notice"><strong>Effective August 2026</strong><br />These policies explain how MentoraX handles access, purchases, personal information, and participation. If you have a question, contact <a href="mailto:support@mentorax.in">support@mentorax.in</a>.</div>{sections.map(({ title, text, items }, index) => <section id={`policy-${index}`} key={title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2>{text && <p>{text}</p>}{items && <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>}</section>)}</article></section></>
}

function NotFound() { return <section className="not-found"><span>404</span><h1>This page took a different path.</h1><ArrowLink solid to="/">Return home</ArrowLink></section> }

export default function App() { return <Routes><Route element={<Layout />}><Route path="/" element={<Home />} /><Route path="/mentorship" element={<Mentorship />} /><Route path="/books" element={<Books />} /><Route path="/mentors" element={<Mentors />} /><Route path="/team" element={<Team />} /><Route path="/contact" element={<Contact />} /><Route path="/refund-policy" element={<Policy kind="Refund policy" intro="A clear and considerate framework for purchase and refund conversations with MentoraX." sections={refundSections} />} /><Route path="/privacy-policy" element={<Policy kind="Privacy policy" intro="How MentoraX intends to treat the information you share with care and clarity." sections={privacySections} />} /><Route path="/terms" element={<Policy kind="Terms & conditions" intro="The shared understanding that protects the MentoraX learning environment." sections={termsSections} />} /><Route path="*" element={<NotFound />} /></Route></Routes> }
