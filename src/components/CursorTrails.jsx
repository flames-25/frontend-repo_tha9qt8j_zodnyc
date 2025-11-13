import React, { useEffect, useRef } from 'react'

// Lightweight golden dust/comet trail using canvas
export default function CursorTrails({ mode = 'gold', intensity = 0.6 }) {
  const canvasRef = useRef(null)
  const pointsRef = useRef([])
  const rafRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      mouseRef.current = { x, y }
      pointsRef.current.push({ x, y, life: 1, vx: (Math.random()-0.5)*0.6, vy: (Math.random()-0.5)*0.6 })
      if (pointsRef.current.length > 120) pointsRef.current.shift()
    }
    window.addEventListener('pointermove', onMove)

    const colors = mode === 'gold'
      ? ['rgba(255,215,128,', 'rgba(255,180,80,', 'rgba(255,236,200,']
      : ['rgba(150,200,255,', 'rgba(200,220,255,', 'rgba(120,180,255,']

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0,0,width,height)

      // soft glow background around cursor
      const g = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, 180)
      g.addColorStop(0, `${colors[0]}0.20)`) // core glow
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0,0,width,height)

      // particles
      for (let p of pointsRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.015 * (1 + intensity)
        const alpha = Math.max(0, p.life)
        ctx.beginPath()
        ctx.fillStyle = `${colors[Math.floor(Math.random()*colors.length)]}${alpha})`
        ctx.shadowColor = 'rgba(255,200,120,0.6)'
        ctx.shadowBlur = 12
        ctx.arc(p.x, p.y, 2.2 + 1.8*Math.random(), 0, Math.PI*2)
        ctx.fill()
      }
      pointsRef.current = pointsRef.current.filter(p => p.life > 0)

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [mode, intensity])

  return (
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-40" />
  )
}
