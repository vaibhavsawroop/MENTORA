import { useEffect, useRef, useState } from 'react'
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl'

type HalftoneRevealProps = {
  src: string
  alt: string
  inkColor?: string
  paperColor?: string
  className?: string
}

const vertex = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`

const fragment = `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec2 iResolution;
uniform vec2 uImageSize;
uniform vec2 uMouse;
uniform float uActivity;
uniform vec3 uInk;
uniform vec3 uPaper;

in vec2 vUv;
out vec4 fragColor;

vec2 coverUv(vec2 uv) {
  float imageAspect = uImageSize.x / max(uImageSize.y, 1.0);
  float panelAspect = iResolution.x / max(iResolution.y, 1.0);
  vec2 scale = panelAspect > imageAspect ? vec2(1.0, imageAspect / panelAspect) : vec2(panelAspect / imageAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 aspect = vec2(iResolution.x / max(iResolution.y, 1.0), 1.0);
  vec2 sampleUv = coverUv(vUv);
  vec3 photo = texture(tMap, clamp(sampleUv, 0.0, 1.0)).rgb;
  float luminance = dot(photo, vec3(0.299, 0.587, 0.114));

  vec2 cell = vUv * aspect * 54.0;
  vec2 dotPosition = fract(cell) - 0.5;
  float dotRadius = sqrt(clamp(1.0 - luminance, 0.0, 1.0)) * 0.46;
  float edge = fwidth(length(dotPosition)) * 1.6;
  float dot = 1.0 - smoothstep(dotRadius - edge, dotRadius + edge, length(dotPosition));
  vec3 blackAndWhiteHalftone = mix(uPaper, uInk, dot);

  vec2 mouseDelta = (vUv - uMouse) * aspect;
  float distanceFromMouse = length(mouseDelta);
  float reveal = 1.0 - smoothstep(0.18, 0.42, distanceFromMouse);
  reveal *= uActivity;
  vec3 color = mix(blackAndWhiteHalftone, photo, reveal);

  fragColor = vec4(color, 1.0);
}`

function hexToRgb(hex: string) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return match
    ? [Number.parseInt(match[1], 16) / 255, Number.parseInt(match[2], 16) / 255, Number.parseInt(match[3], 16) / 255]
    : [0, 0, 0]
}

export function HalftoneReveal({
  src,
  alt,
  inkColor = '#24203d',
  paperColor = '#f2ecff',
  className = '',
}: HalftoneRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglAvailable, setWebglAvailable] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !webglAvailable) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const probe = document.createElement('canvas').getContext('webgl2')
    if (!probe) {
      setWebglAvailable(false)
      return
    }
    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: false, antialias: true, webgl: 2 })
    const gl = renderer.gl
    const texture = new Texture(gl, { generateMipmaps: false })
    const uniforms = {
      tMap: { value: texture },
      iResolution: { value: [1, 1] },
      uImageSize: { value: [1, 1] },
      uMouse: { value: [0.5, 0.5] },
      uActivity: { value: 0 },
      uInk: { value: hexToRgb(inkColor) },
      uPaper: { value: hexToRgb(paperColor) },
    }
    const program = new Program(gl, { vertex, fragment, uniforms })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    const image = new Image()
    let frame = 0
    let currentActivity = 0
    let targetActivity = 0
    let mouse = { x: 0.5, y: 0.5 }
    let smoothMouse = { x: 0.5, y: 0.5 }

    gl.canvas.setAttribute('aria-hidden', 'true')
    container.appendChild(gl.canvas)
    image.onload = () => {
      texture.image = image
      uniforms.uImageSize.value = [image.naturalWidth, image.naturalHeight]
      texture.needsUpdate = true
    }
    image.src = src
    if (image.complete && image.naturalWidth) {
      texture.image = image
      uniforms.uImageSize.value = [image.naturalWidth, image.naturalHeight]
      texture.needsUpdate = true
    }

    const resize = () => {
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1)
      uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height]
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    const move = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect()
      mouse = {
        x: (event.clientX - bounds.left) / bounds.width,
        y: 1 - (event.clientY - bounds.top) / bounds.height,
      }
      targetActivity = 1
    }
    const leave = () => { targetActivity = 0 }
    container.addEventListener('pointermove', move, { passive: true })
    container.addEventListener('pointerenter', move, { passive: true })
    container.addEventListener('pointerleave', leave)

    const render = () => {
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.12
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.12
      currentActivity += (targetActivity - currentActivity) * 0.1
      uniforms.uMouse.value = [smoothMouse.x, smoothMouse.y]
      uniforms.uActivity.value = currentActivity
      renderer.render({ scene: mesh })
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      container.removeEventListener('pointermove', move)
      container.removeEventListener('pointerenter', move)
      container.removeEventListener('pointerleave', leave)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
    }
  }, [src, inkColor, paperColor, webglAvailable])

  return (
    <div ref={containerRef} className={`halftone-reveal ${className}`.trim()} role="img" aria-label={alt}>
      {!webglAvailable && <img className="halftone-fallback" src={src} alt="" />}
    </div>
  )
}