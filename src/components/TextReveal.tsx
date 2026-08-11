import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TextPopProps {
  children?: React.ReactNode
  text?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  className?: string
  delay?: number
  stagger?: number
  mode?: 'popup' | 'words' | 'fade'
}

export function TextPop({
  children,
  text,
  as = 'div',
  className = '',
  delay = 0,
  stagger = 0.035,
  mode = 'popup',
}: TextPopProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const targets = el.querySelectorAll('.pop-word')
    if (!targets.length) return

    const ctx = gsap.context(() => {
      if (mode === 'popup') {
        gsap.fromTo(
          targets,
          {
            y: 42,
            opacity: 0,
            scale: 0.9,
            rotationX: -15,
            transformOrigin: '0% 50% -20',
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 0.75,
            delay,
            stagger,
            ease: 'back.out(1.6)',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      } else {
        gsap.fromTo(
          targets,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay,
            stagger,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, el)

    return () => ctx.revert()
  }, [delay, stagger, mode, text])

  // Extract raw string content if text parameter provided or string children
  const rawContent = text || (typeof children === 'string' ? children : null)

  const contentToRender = rawContent ? (
    rawContent.split(' ').map((word, i) => (
      <span key={i} className="pop-word-box">
        <span className="pop-word">{word}&nbsp;</span>
      </span>
    ))
  ) : (
    children
  )

  return React.createElement(
    as,
    {
      ref: containerRef,
      className: `pop-text-wrap ${className}`,
    },
    contentToRender
  )
}
