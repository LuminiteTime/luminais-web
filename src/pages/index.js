import React, { useEffect, useRef, useState } from 'react'
import '../styles/global.css'

const socials = [
  { label: 'GitHub', href: 'https://github.com/LuminiteTime', key: 'gh' },
  { label: 'Telegram', href: 'https://t.me/LuminiteTime', key: 'tg' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mikhailtrifonov28', key: 'li' },
  { label: 'Email', href: 'mailto:trifonov2812@gmail.com', key: 'mail' },
]

const copy = {
  en: {
    heroName: 'Mikhail Trifonov',
    heroRole: 'Java Backend Developer',
    introTitle: 'Hey!',
    intro1:
      'I’m Mikhail Trifonov from Kazan / Innopolis. I build backend systems on Java and Scala, focused on integrations, reliability, and developer experience.',
    intro2: 'Feel free to get in touch or take a look at my past work.',
    nav: { home: 'Home', exp: 'Experience', contact: 'Contact' },
    timelineTitle: 'Timeline',
    contactTitle: 'Contact',
  },
  ru: {
    heroName: 'Михаил Трифонов',
    heroRole: 'Java Backend разработчик',
    introTitle: 'Привет!',
    intro1:
      'Я Михаил Трифонов из Казани / Иннополиса. Делаю бэкенд на Java и Scala, фокус на интеграции, надёжность и удобство для разработчиков.',
    intro2: 'Пишите, если нужен надёжный бэкенд или хотите обсудить опыт.',
    nav: { home: 'Главная', exp: 'Опыт', contact: 'Контакты' },
    timelineTitle: 'Таймлайн',
    contactTitle: 'Контакты',
  },
}

const timelines = {
  en: [
    {
      period: 'Sep 2025 — present',
      title: 'Java Software Engineer — T-Bank',
      detail: 'Building microservices and reliable integrations for T-Bank.',
    },
    {
      period: 'Jan 2025 — Apr 2025',
      title: 'Scala Developer — Yandex',
      detail:
        'Developed and maintained microservices with gRPC for internal calls and REST for external clients. Optimized gRPC performance to cut response times. Designed GraphQL schemas for frontend, coordinated integrations, and documented solutions.',
    },
    {
      period: 'Jun 2024 — Aug 2024',
      title: 'Java Software Engineer — Hirus',
      detail:
        'Implemented REST controllers and business logic, crafted JDBC queries for PostgreSQL, participated in CI/CD, and covered services with integration tests using Testcontainers.',
    },
    {
      period: 'Jun 2024 — Jul 2024',
      title: 'Python Developer — Ragnar (AI app)',
      detail:
        'Developed FastAPI endpoints for AI interactions with solid error handling. Tuned RAG configuration to improve answers on uploaded docs. Refactored OpenWebUI codebase, removing redundant components to slim the app.',
    },
    {
      period: '2023 — 2027',
      title: 'Bachelor — Innopolis University',
      detail: 'Computer Science | 2023 — 2027',
    },
  ],
  ru: [
    {
      period: 'Сен 2025 — present',
      title: 'Java-разработчик — Т-Банк',
      detail: 'Строю микросервисы и надёжные интеграции для Т-Банка.',
    },
    {
      period: 'Янв 2025 — Апр 2025',
      title: 'Scala Developer — Яндекс',
      detail:
        'Разрабатывал и поддерживал микросервисы: gRPC для внутренних вызовов, REST для внешних. Оптимизировал gRPC, снижая время отклика. Проектировал GraphQL-схемы для фронта, согласовывал интеграции и писал документацию.',
    },
    {
      period: 'Июн 2024 — Авг 2024',
      title: 'Java-разработчик — Hirus',
      detail:
        'Реализовывал REST-контроллеры и бизнес-логику, писал JDBC-запросы в PostgreSQL, участвовал в CI/CD и покрывал сервисы интеграционными тестами на Testcontainers.',
    },
    {
      period: 'Июн 2024 — Июл 2024',
      title: 'Python Developer — Ragnar (AI приложение)',
      detail:
        'Писал эндпоинты FastAPI для AI с корректной обработкой ошибок. Настраивал RAG, улучшая ответы по загруженным документам. Рефакторил OpenWebUI, убирая лишние компоненты и уменьшая размер приложения.',
    },
    {
      period: '2023 — 2027',
      title: 'Бакалавриат — Университет Иннополис',
      detail: 'Информатика и вычислительная техника | 2023 — 2027',
    },
  ],
}

function ParticleField({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const particles = []
    const max = 90

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function spawn() {
      particles.length = 0
      for (let i = 0; i < max; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.55
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.6 + Math.random() * 0.8,
        })
      }
    }

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        const margin = 24
        if (p.x < -margin) p.x = canvas.width + margin
        if (p.x > canvas.width + margin) p.x = -margin
        if (p.y < -margin) p.y = canvas.height + margin
        if (p.y > canvas.height + margin) p.y = -margin
      }

      ctx.fillStyle = 'rgba(230,230,230,0.82)'
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.strokeStyle = 'rgba(210,210,210,0.4)'
      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < 140) {
            ctx.globalAlpha = 1 - dist / 140
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(step)
    }

    resize()
    spawn()
    step()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className={`particle-canvas ${className}`} />
}

function ContactIcon({ name }) {
  switch (name) {
    case 'mail':
      return (
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm.8 2.4 6.17 4.11c.2.13.46.13.66 0L17.8 8.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'tg':
      return (
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M9.48 14.37 9.2 18.5c.4 0 .57-.17.77-.38l1.86-1.78 3.86 2.82c.71.39 1.22.18 1.41-.66l2.55-11.96h.01c.23-1.06-.38-1.48-1.08-1.22L3.7 10.1c-1.04.41-1.02.99-.18 1.25l4.49 1.4 10.42-6.55c.49-.32.94-.14.57.18L9.48 14.37Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'li':
      return (
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M6.94 8.5V19H3.59V8.5h3.35ZM8.06 5.5c0 .49-.16.88-.49 1.17-.32.29-.72.43-1.2.43H6.3c-.48 0-.88-.14-1.2-.43-.32-.29-.48-.68-.48-1.17 0-.47.16-.85.48-1.15.32-.3.73-.45 1.23-.45.5 0 .9.15 1.21.45.31.3.47.68.47 1.15Zm13.35 7.01V19h-3.35v-5.99c0-.76-.15-1.33-.46-1.72-.31-.39-.78-.58-1.43-.58-.47 0-.86.13-1.18.4-.31.27-.54.6-.66 1.02-.07.19-.1.44-.1.76V19h-3.35c.02-3.33.02-5.98.02-7.96 0-1.98 0-3.19-.02-3.63h3.35v1.63h-.02c.14-.23.28-.43.42-.6.14-.17.32-.33.54-.5.22-.17.49-.31.8-.41.31-.1.67-.15 1.08-.15 1.13 0 2.06.38 2.79 1.13.73.75 1.1 1.82 1.1 3.22Z"
            fill="currentColor"
          />
        </svg>
      )
    default:
      return null
  }
}

const IndexPage = () => (
  <LangProvider>
    {({ lang, toggle }) => {
      const t = copy[lang]
      const timeline = timelines[lang]
      return (
        <div className="page">
          <ParticleField className="particle-fixed" />

          <StickyHeader lang={lang} toggleLang={toggle} />

          <section id="home" className="section hero dark">
            <div className="hero-inner">
              <div className="avatar">
                <img src="/images/main_me.jpg" alt={t.heroName} />
              </div>
              <h1 className="hero-title">{t.heroName}</h1>
              <p className="hero-subtitle">{t.heroRole}</p>
              <div className="social-row">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="social"
                    target="_blank"
                    rel="noreferrer"
                    data-title={s.label}
                  >
                    <SocialIcon name={s.key} />
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="section light intro">
            <div className="container narrow">
              <h3 className="eyebrow dark-text">{t.introTitle}</h3>
              <p className="para dark-text">{t.intro1}</p>
              <p className="para dark-text">{t.intro2}</p>
            </div>
          </section>

          <section id="experience" className="section dark band">
            <h2>{t.timelineTitle}</h2>
          </section>

          <section className="section light timeline-section">
            <div className="container timeline-wrapper">
              <Timeline timeline={timeline} />
            </div>
          </section>

          <section id="contact" className="section dark band">
            <h2>{t.contactTitle}</h2>
            <div className="contact-links contact-only">
              <a href="mailto:trifonov2812@gmail.com" className="contact-chip">
                <ContactIcon name="mail" />
                <span>Email</span>
              </a>
              <a href="https://t.me/LuminiteTime" target="_blank" rel="noreferrer" className="contact-chip">
                <ContactIcon name="tg" />
                <span>Telegram</span>
              </a>
              <a
                href="https://www.linkedin.com/in/mikhailtrifonov28"
                target="_blank"
                rel="noreferrer"
                className="contact-chip"
              >
                <ContactIcon name="li" />
                <span>LinkedIn</span>
              </a>
            </div>
          </section>
        </div>
      )
    }}
  </LangProvider>
)

function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  const toggle = () => setLang((prev) => (prev === 'en' ? 'ru' : 'en'))
  return children({ lang, toggle })
}

function StickyHeader({ lang, toggleLang }) {
  const t = copy[lang]
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 6)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="brand">{t.heroName}</div>
      <nav className="nav">
        <a href="#home">{t.nav.home}</a>
        <a href="#experience">{t.nav.exp}</a>
        <a href="#contact">{t.nav.contact}</a>
        <button className="lang-btn" onClick={toggleLang} aria-label="Switch language">
          <LangIcon />
        </button>
      </nav>
    </header>
  )
}

function getBadge(period) {
  if (/present/i.test(period)) return 'Now'
  const match = period.match(/\d{4}/)
  return match ? match[0] : ''
}

function SocialIcon({ name }) {
  switch (name) {
    case 'gh':
      return (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.84 9.5c.5.1.66-.22.66-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.46-1.16-1.13-1.48-1.13-1.48-.93-.62.07-.61.07-.61 1.02.07 1.56 1.05 1.56 1.05.92 1.57 2.4 1.12 2.99.86.09-.68.36-1.12.65-1.38-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.29.1-2.69 0 0 .85-.27 2.78 1.02a9.5 9.5 0 0 1 5.06 0c1.92-1.29 2.77-1.02 2.77-1.02.55 1.4.2 2.44.1 2.69.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.69-4.57 4.94.37.32.7.94.7 1.9v2.81c0 .27.17.58.67.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'tg':
      return (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M9.48 14.37 9.2 18.5c.4 0 .57-.17.77-.38l1.86-1.78 3.86 2.82c.71.39 1.22.18 1.41-.66l2.55-11.96h.01c.23-1.06-.38-1.48-1.08-1.22L3.7 10.1c-1.04.41-1.02.99-.18 1.25l4.49 1.4 10.42-6.55c.49-.32.94-.14.57.18L9.48 14.37Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'li':
      return (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M6.94 8.5V19H3.59V8.5h3.35ZM8.06 5.5c0 .49-.16.88-.49 1.17-.32.29-.72.43-1.2.43H6.3c-.48 0-.88-.14-1.2-.43-.32-.29-.48-.68-.48-1.17 0-.47.16-.85.48-1.15.32-.3.73-.45 1.23-.45.5 0 .9.15 1.21.45.31.3.47.68.47 1.15Zm13.35 7.01V19h-3.35v-5.99c0-.76-.15-1.33-.46-1.72-.31-.39-.78-.58-1.43-.58-.47 0-.86.13-1.18.4-.31.27-.54.6-.66 1.02-.07.19-.1.44-.1.76V19h-3.35c.02-3.33.02-5.98.02-7.96 0-1.98 0-3.19-.02-3.63h3.35v1.63h-.02c.14-.23.28-.43.42-.6.14-.17.32-.33.54-.5.22-.17.49-.31.8-.41.31-.1.67-.15 1.08-.15 1.13 0 2.06.38 2.79 1.13.73.75 1.1 1.82 1.1 3.22Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'mail':
      return (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm.8 2.4 6.17 4.11c.2.13.46.13.66 0L17.8 8.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    default:
      return (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 13.2c1.77 0 3.2-1.43 3.2-3.2S13.77 6.8 12 6.8 8.8 8.23 8.8 10s1.43 3.2 3.2 3.2Zm0-10.8C16.97 2.4 21 6.02 21 10.56c0 2.72-1.4 5.16-3.56 6.85l-4.22 3.34c-.32.25-.12.25-.44 0L8.56 17.4C6.4 15.72 5 13.28 5 10.56 5 6.02 9.03 2.4 12 2.4Z"
            fill="currentColor"
          />
        </svg>
      )
  }
}

function Timeline({ timeline }) {
  const [ready, setReady] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    setReady(false)
    const cards = Array.from(containerRef.current?.querySelectorAll('.timeline-card') || [])
    cards.forEach((c) => c.classList.remove('show'))
    setTimeout(() => setReady(true), 120)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
          }
        })
      },
      { threshold: 0.25 }
    )
    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [timeline])

  return (
    <div ref={containerRef} className={`timeline ${ready ? 'ready' : ''}`}>
      {timeline.map((t, index) => (
        <div key={t.period + t.title} className={`timeline-card ${index % 2 ? 'right' : 'left'}`}>
          <div className="timeline-bullet">{getBadge(t.period)}</div>
          <div className="timeline-body">
            <div className="timeline-title">{t.title}</div>
            <div className="timeline-detail">{t.detail}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function LangIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9Zm0 1.6c-.82 0-1.6.12-2.34.35.2.33.4.69.58 1.06.3.62.55 1.27.75 1.92h2.02c-.22-.8-.52-1.56-.88-2.27-.24-.47-.5-.91-.79-1.32-.43.16-.86.35-1.27.56.57-.2 1.17-.3 1.79-.3Zm-3.1.74C7.17 6.2 5.8 7.9 5.5 10h2.37c.08-.7.23-1.38.44-2.03.2-.6.46-1.17.76-1.68-.07-.22-.15-.43-.24-.64Zm6.2 0c-.09.2-.17.42-.24.64.3.5.55 1.07.75 1.68.2.65.35 1.33.44 2.03h2.37c-.3-2.1-1.67-3.8-3.36-4.66ZM7.9 11.6H5.5c.24 1.96 1.44 3.63 3.08 4.54-.3-.6-.56-1.25-.76-1.95-.2-.66-.33-1.36-.4-2.1Zm1.7 0c.07.64.2 1.25.38 1.82.2.64.46 1.22.77 1.74.35.6.73 1.1 1.15 1.5.42-.4.8-.9 1.15-1.5.31-.52.57-1.1.77-1.74.18-.57.31-1.18.38-1.82H9.6Zm6.5 0c-.07.74-.2 1.44-.4 2.1-.2.7-.46 1.35-.76 1.95 1.64-.9 2.84-2.58 3.08-4.54H16.1Zm-4.1 5.8c-.62 0-1.22-.1-1.79-.3.29-.4.55-.84.79-1.32.36-.71.66-1.47.88-2.27h2.02c-.2.65-.45 1.3-.75 1.92-.18.37-.38.73-.58 1.06.74.23 1.52.35 2.34.35Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default IndexPage

export const Head = () => (
  <>
    <title>Mikhail Trifonov — Java Backend</title>
    <link rel="icon" href="/images/main_me.jpg" type="image/jpeg" />
    <meta
      name="description"
      content="Java Backend Developer — portfolio of Mikhail Trifonov. Microservices, integrations, Java/Scala, distributed systems."
    />
  </>
)
