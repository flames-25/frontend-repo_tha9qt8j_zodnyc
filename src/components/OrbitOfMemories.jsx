import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Minimal canvas-based orbit visualization with interactive hover/zoom
export default function OrbitOfMemories({ memories = [] }) {
  const canvasRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const [zoom, setZoom] = useState(1)
  const draggingRef = useRef(false)
  const rotationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = Math.max(520, window.innerHeight * 0.8)
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    const draw = () => {
      t += 0.008
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0,0,w,h)

      // space background
      const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/1.2)
      grad.addColorStop(0, 'rgba(10,10,20,1)')
      grad.addColorStop(1, 'rgba(0,0,0,1)')
      ctx.fillStyle = grad
      ctx.fillRect(0,0,w,h)

      // stars
      for (let i=0;i<100;i++){
        const sx = (i*97 % w)
        const sy = (i*57 % h)
        ctx.fillStyle = `rgba(255,255,255,${0.1 + (i%10)/20})`
        ctx.fillRect((sx+Math.sin(t+i)*2)%w, (sy+Math.cos(t+i)*2)%h, 1.2, 1.2)
      }

      ctx.save()
      ctx.translate(w/2, h/2)
      ctx.scale(zoom, zoom)
      ctx.rotate(rotationRef.current)

      // sun at center
      const pulse = 1 + Math.sin(t*2)*0.04
      const sunR = 40 * pulse
      const sunGrad = ctx.createRadialGradient(0,0,0,0,0,140)
      sunGrad.addColorStop(0, 'rgba(255,220,160,1)')
      sunGrad.addColorStop(0.4, 'rgba(255,160,80,0.9)')
      sunGrad.addColorStop(1, 'rgba(255,120,60,0.0)')
      ctx.fillStyle = sunGrad
      ctx.beginPath()
      ctx.arc(0,0,140,0,Math.PI*2)
      ctx.fill()

      // core
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255,190,120,1)'
      ctx.arc(0,0,sunR,0,Math.PI*2)
      ctx.fill()

      const orbitBase = 140

      memories.forEach((m, idx) => {
        const orbitR = orbitBase + idx*70
        const speed = 0.4/(idx+1)
        const ang = t*speed + idx
        const px = Math.cos(ang)*orbitR
        const py = Math.sin(ang)*orbitR

        // orbit path
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255,200,140,0.15)'
        ctx.lineWidth = 1
        ctx.arc(0,0,orbitR,0,Math.PI*2)
        ctx.stroke()

        // planet glow
        const planetR = 8 + (idx%3)*3
        const g = ctx.createRadialGradient(px,py,0,px,py,18)
        g.addColorStop(0, m.color || 'rgba(255,240,200,1)')
        g.addColorStop(1, 'rgba(255,200,120,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px,py,18,0,Math.PI*2)
        ctx.fill()

        // planet core
        ctx.beginPath()
        ctx.fillStyle = m.core || 'rgba(255,220,160,1)'
        ctx.arc(px,py,planetR,0,Math.PI*2)
        ctx.fill()

        // hover detection
        const mx = (mouse.x - w/2) / zoom
        const my = (mouse.y - h/2) / zoom
        const rx = mx*Math.cos(-rotationRef.current) - my*Math.sin(-rotationRef.current)
        const ry = mx*Math.sin(-rotationRef.current) + my*Math.cos(-rotationRef.current)
        const dist = Math.hypot(rx - px, ry - py)
        if (dist < planetR + 8) {
          setHovered(m)
        }
      })

      ctx.restore()

      requestAnimationFrame(draw)
    }

    const mouse = { x: -9999, y: -9999 }
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onWheel = (e) => {
      const z = Math.min(2.2, Math.max(0.6, zoom + (e.deltaY>0?-0.1:0.1)))
      setZoom(z)
    }
    const onDown = () => { draggingRef.current = true }
    const onUp = () => { draggingRef.current = false }
    const onDrag = (e) => {
      if (!draggingRef.current) return
      rotationRef.current += e.movementX * 0.005
    }

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('wheel', onWheel, { passive: true })
    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('mousemove', onDrag)

    draw()

    return () => {
      window.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onDrag)
    }
  }, [memories, zoom])

  return (
    <section className="relative bg-black py-12">
      <canvas ref={canvasRef} className="w-full h-[70vh] block" />

      {/* Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 rounded-xl border border-amber-300/20 bg-black/60 px-4 py-2 text-amber-100 backdrop-blur-sm"
        >
          {hovered.title}
        </motion.div>
      )}

      {/* Memory modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center">
          <div className="max-w-md w-full rounded-2xl border border-amber-300/20 bg-gradient-to-b from-zinc-900 to-black p-6 text-amber-100">
            <h3 className="text-xl font-semibold mb-2">{selected.title}</h3>
            {selected.image && (
              <img src={selected.image} alt="memory" className="rounded-lg mb-3" />
            )}
            {selected.text && <p className="opacity-90 mb-4">{selected.text}</p>}
            {selected.audio && (
              <audio controls className="w-full">
                <source src={selected.audio} />
              </audio>
            )}
            <button onClick={() => setSelected(null)} className="mt-4 inline-flex items-center justify-center rounded-lg bg-amber-400/20 px-4 py-2 text-amber-200 hover:bg-amber-400/30">Close</button>
          </div>
        </div>
      )}
    </section>
  )
}
