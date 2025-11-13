import React, { useEffect, useMemo, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function HeroSolarSoul({ name = 'Your Sun' }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sX = useSpring(x, { stiffness: 60, damping: 18 })
  const sY = useSpring(y, { stiffness: 60, damping: 18 })

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const handleMouse = (e) => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const dx = (e.clientX - cx) / cx
    const dy = (e.clientY - cy) / cy
    x.set(dx)
    y.set(dy)
  }

  const gradientPos = useMemo(() => ({
    background: `radial-gradient(1200px 800px at ${50 + sX.get()*15}% ${50 + sY.get()*15}%, rgba(255,200,120,0.18), rgba(255,140,60,0.08) 40%, rgba(0,0,0,0) 70%)`
  }), [sX, sY])

  return (
    <section onMouseMove={handleMouse} className="relative h-[90vh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{...gradientPos}} />

      {/* 3D Spline Cover */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/7m4PRZ7kg6K1jPfF/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Subtle golden overlay for warmth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-fuchsia-500/10 mix-blend-screen" />

      <div className="relative z-30 flex h-full items-center justify-center text-center p-6">
        <motion.div
          style={{ x: sX.to(v => v*12), y: sY.to(v => v*10) }}
          className="max-w-3xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-serif tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-rose-300 drop-shadow-[0_0_20px_rgba(255,200,120,0.35)]"
          >
            Solar Soul
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-amber-100/90 text-lg sm:text-xl"
          >
            Every dawn begins with your light.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10"
          >
            <span className="inline-block rounded-full border border-amber-300/30 bg-amber-100/5 px-5 py-2 text-amber-200/90 shadow-[0_0_30px_rgba(255,200,120,0.25)]">
              {name}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
