import React, { useEffect, useRef, useState } from 'react'

export default function EternalLightFinale({ onReplay }) {
  const canvasRef = useRef(null)
  const [foundSecret, setFoundSecret] = useState(false)

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
    const secret = { x: 0.72, y: 0.38, r: 32 } // percentage position

    const draw = () => {
      t += 1
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0,0,w,h)

      // twilight
      const g = ctx.createLinearGradient(0,0,0,h)
      g.addColorStop(0,'#0a0f24')
      g.addColorStop(1,'#02030a')
      ctx.fillStyle = g
      ctx.fillRect(0,0,w,h)

      // stars + comet trail at cursor handled by CSS elsewhere; here we draw field
      for (let i=0;i<180;i++){
        const x = (i*137 + Math.sin(t*0.01+i)*60) % w
        const y = (i*97 + Math.cos(t*0.008+i)*40) % h
        const a = 0.2 + ((i%10)/20)
        ctx.fillStyle = `rgba(255,255,200,${a})`
        ctx.fillRect(x,y,1.2,1.2)
      }

      // infinity symbol path
      ctx.save()
      ctx.translate(w/2, h/2)
      ctx.strokeStyle = 'rgba(255,220,180,0.6)'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let a = 0; a < Math.PI*2; a += 0.02){
        const r = 120
        const px = r * Math.cos(a) / (1 + Math.sin(a)**2)
        const py = r * Math.sin(a) * Math.cos(a) / (1 + Math.sin(a)**2)
        if (a === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.restore()

      // heart pulse
      const hx = w/2
      const hy = h/2
      const s = 1 + Math.sin(t*0.06)*0.05
      ctx.save()
      ctx.translate(hx, hy)
      ctx.scale(s, s)
      ctx.fillStyle = 'rgba(255,160,160,0.9)'
      ctx.beginPath()
      for (let a = 0; a <= Math.PI*2; a += 0.02){
        const x = 16 * Math.sin(a)**3
        const y = -(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))
        if (a === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.fill()
      ctx.restore()

      // secret star
      const sx = secret.x * w
      const sy = secret.y * h
      ctx.beginPath(); ctx.fillStyle = 'rgba(255,240,200,0.9)'; ctx.arc(sx, sy, 2.4, 0, Math.PI*2); ctx.fill()

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(raf)
  }, [])

  const onClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const sx = 0.72 * rect.width
    const sy = 0.38 * rect.height
    if (Math.hypot(x - sx, y - sy) < 24) setFoundSecret(true)
  }

  return (
    <section className="relative bg-black py-12">
      <div className="max-w-4xl mx-auto px-6">
        <canvas ref={canvasRef} className="w-full h-[360px] rounded-2xl border border-amber-300/10" onClick={onClick} />
        <div className="mt-6 text-center">
          <p className="text-amber-100/90">You're not just my sunshine — you're the reason my universe shines.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button onClick={onReplay} className="rounded-lg bg-amber-500/20 text-amber-100 px-4 py-2 border border-amber-300/30 hover:bg-amber-500/30">Replay the Orbit</button>
          </div>
          {foundSecret && (
            <p className="mt-4 text-amber-200/90">Secret Star: You are my infinity. Always. ✨</p>
          )}
        </div>
      </div>
    </section>
  )
}
