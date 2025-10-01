import React from 'react'
import ParticleCODEButton from './ParticleCode'

export default function Home({navigate}:{navigate:(to:string)=>void}){
  return (
    <section className="min-h-[calc(100vh-5rem)] grid grid-cols-1 md:grid-cols-2 gap-0">
      <div className="flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white p-0">
        <ParticleCODEButton onClick={() => navigate('/code')} />
      </div>

      <div className="relative bg-black">
        <button onClick={()=>navigate('/skate')} className="absolute inset-0 block">
          <video className="w-full h-full object-cover relative z-0" src="/skate/loop.mp4" autoPlay muted loop playsInline />
          {/* blue tint overlay to darken and tint the video */}
          <div className="absolute inset-0 bg-blue-900/40 z-10" aria-hidden />
          {/* centered label above the overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span className="text-white px-4 py-2 rounded text-[max(3rem,6.5vw)] leading-none font-semibold uppercase tracking-wide">Skate</span>
          </div>
        </button>
      </div>
    </section>
  )
}
