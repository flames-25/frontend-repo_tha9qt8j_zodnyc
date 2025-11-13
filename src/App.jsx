import React, { useState } from 'react'
import HeroSolarSoul from './components/HeroSolarSoul'
import OrbitOfMemories from './components/OrbitOfMemories'
import SolarFlareWishes from './components/SolarFlareWishes'
import SunsetOfLove from './components/SunsetOfLove'
import EternalLightFinale from './components/EternalLightFinale'
import CursorTrails from './components/CursorTrails'

function App() {
  const [name, setName] = useState('Beloved Sun')

  const memories = [
    { id: 1, title: 'First Sunrise Together', text: 'Coffee steam meeting dawn light.', color: 'rgba(255,220,160,1)', core: 'rgba(255,240,200,1)' },
    { id: 2, title: 'Laughing in the Rain', text: 'You glowed even under clouds.', color: 'rgba(255,180,120,1)', core: 'rgba(255,220,160,1)' },
    { id: 3, title: 'Quiet Stargaze', text: 'You named the constellations after hope.', color: 'rgba(200,180,255,1)', core: 'rgba(230,210,255,1)' },
    { id: 4, title: 'Warmth in Winter', text: 'Hands wrapped in amber light.', color: 'rgba(255,160,120,1)', core: 'rgba(255,210,170,1)' },
  ]

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <CursorTrails />

      {/* Intro Scene — The Dawn of You */}
      <HeroSolarSoul name={name} />

      {/* Name input to personalize */}
      <div className="relative z-30 max-w-2xl mx-auto -mt-14 mb-10 px-6">
        <div className="rounded-2xl border border-amber-300/20 bg-black/50 backdrop-blur-md p-4 flex items-center gap-3">
          <span className="text-amber-200/80 text-sm">Sun’s Name</span>
          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Type their name..."
            className="flex-1 rounded-lg bg-zinc-900/60 border border-amber-300/20 px-4 py-2 text-amber-100 placeholder:text-amber-200/40"
          />
        </div>
      </div>

      {/* Orbit of Memories */}
      <OrbitOfMemories memories={memories} />

      {/* Solar Flare Wishes */}
      <SolarFlareWishes />

      {/* Sunset of Love */}
      <SunsetOfLove />

      {/* Eternal Light Finale */}
      <EternalLightFinale onReplay={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      <footer className="py-10 text-center text-amber-200/50 text-sm">
        Solar Soul — made with love.
      </footer>
    </div>
  )
}

export default App
