import React from 'react'

export default function Header({navigate}:{navigate:(to:string)=>void}){
  return (
    <header className={'bg-slate-900 text-white shadow'}>
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight"><button onClick={()=>navigate('/')} className="text-inherit">Nathaniel Chappelle</button></h1>
          <p className="text-sm text-gray-500">Code, Design, & Downhill Skate</p>
        </div>
        <div className="flex items-center gap-4">
          <nav className="space-x-4">
            <button onClick={()=>navigate('/code')} className="text-sm text-white/90 hover:underline">Code</button>
            <button onClick={()=>navigate('/skate')} className="text-sm text-white/90 hover:underline">Skate</button>
          </nav>
        </div>
      </div>
    </header>
  )
}
