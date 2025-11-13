import React, { useEffect, useRef, useState } from 'react'

export default function SunsetOfLove() {
  const canvasRef = useRef(null)
  const [offset, setOffset] = useState(0.5)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = 360
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    let raf

    const draw = () => {
      t += 1
      const w = canvas.width
      const h = canvas.height

      // sky gradient changes with offset
      const g = ctx.createLinearGradient(0,0,0,h)
      const hue = 30 + offset*50
      ctx.clearRect(0,0,w,h)
      g.addColorStop(0, `hsl(${hue}, 90%, 60%)`)
      g.addColorStop(0.5, `hsl(${hue+30}, 80%, 45%)`)
      g.addColorStop(1, `hsl(${hue+80}, 70%, 20%)`)
      ctx.fillStyle = g
      ctx.fillRect(0,0,w,h)

      // sun position controlled by offset
      const sunX = w/2 + Math.sin(offset*Math.PI*2)*60
      const sunY = h*0.2 + offset*h*0.5
      const sunR = 36
      const glow = ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,140)
      glow.addColorStop(0,'rgba(255,220,160,0.9)')
      glow.addColorStop(1,'rgba(255,120,80,0)')
      ctx.fillStyle = glow
      ctx.beginPath(); ctx.arc(sunX,sunY,140,0,Math.PI*2); ctx.fill()
      ctx.beginPath(); ctx.fillStyle = 'rgba(255,230,180,1)'; ctx.arc(sunX,sunY,sunR,0,Math.PI*2); ctx.fill()

      // drifting orbs
      for (let i=0;i<30;i++){
        const ox = (i*97 + t*0.3 + i*8) % w
        const oy = (i*53 + Math.sin(t*0.01+i)*20) % h
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,200,180,${0.2 + (i%5)/10})`
        ctx.arc(ox, oy, 2 + (i%3), 0, Math.PI*2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(raf)
  }, [offset])

  const onDrag = (e) => {
    setOffset((p) => Math.min(1, Math.max(0, p + e.movementX/600)))
  }

  return (
    <section className="relative bg-black py-12 select-none">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-3 text-amber-100/80">
          <p>Even when you set, your warmth stays in my soul.</p>
          <span className="text-xs opacity-70">Drag to control sunset</span>
        </div>
        <canvas
          ref={canvasRef}
          onMouseMove={onDrag}
          className="w-full h-[360px] rounded-2xl border border-amber-300/10 cursor-ew-resize"
        />
      </div>
    </section>
  )
}
