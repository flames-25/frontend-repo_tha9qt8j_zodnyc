import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function SolarFlareWishes() {
  const canvasRef = useRef(null)
  const [message, setMessage] = useState('The world glows brighter because of your warmth...\nHappy Birthday, my eternal Sun.')
  const [flareTick, setFlareTick] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = 420
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    let raf

    const draw = () => {
      t += 1
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0,0,w,h)

      // background
      const bg = ctx.createLinearGradient(0,0,0,h)
      bg.addColorStop(0,'#0b0b13')
      bg.addColorStop(1,'#000')
      ctx.fillStyle = bg
      ctx.fillRect(0,0,w,h)

      // flare wave
      const cx = w/2
      const cy = h/2
      const radius = (t + flareTick*180) % (Math.max(w,h))
      const g = ctx.createRadialGradient(cx, cy, Math.max(1, radius*0.2), cx, cy, radius)
      g.addColorStop(0, 'rgba(255,200,120,0.35)')
      g.addColorStop(0.6, 'rgba(255,140,70,0.18)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI*2)
      ctx.fill()

      // plasma particles
      for (let i=0;i<140;i++){
        const a = i * 0.045 + t*0.003
        const r = radius*0.6 + (i%8)*6
        const px = cx + Math.cos(a)*r
        const py = cy + Math.sin(a)*r
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,200,120,${0.12 + ((i%5)/40)})`
        ctx.arc(px,py,1.6,0,Math.PI*2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(raf)
  }, [flareTick])

  const triggerFlare = () => setFlareTick(v => v+1)

  return (
    <section className="relative bg-black py-16">
      <div className="max-w-4xl mx-auto px-6">
        <canvas ref={canvasRef} className="w-full h-[420px] rounded-2xl border border-amber-300/10" />
        <div className="mt-8 space-y-4">
          {message.split('\n').map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ delay: i*0.2 }}
              className="text-amber-100 text-xl sm:text-2xl"
            >
              {line}
            </motion.p>
          ))}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 rounded-lg bg-zinc-900/60 border border-amber-300/20 px-4 py-2 text-amber-100 placeholder:text-amber-200/40"
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            placeholder="Write your glowing wish..."
          />
          <button onClick={triggerFlare} className="rounded-lg bg-amber-500/20 text-amber-100 px-4 py-2 border border-amber-300/30 hover:bg-amber-500/30">
            Send Solar Flare
          </button>
        </div>
      </div>
    </section>
  )
}
