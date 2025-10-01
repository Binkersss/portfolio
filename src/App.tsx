import React from 'react'
import Header from './components/Header'
import Home from './components/Home'
import Section from './components/Section'
import CodeCard from './components/CodeCard'
import SkateCard from './components/SkateCard'
import ParticleCODEButton from './components/ParticleCode'

const codeItems = [
  { title: 'Project Atlas', desc: 'A TypeScript monorepo for micro-frontends.', tags: ['TypeScript','React','Monorepo'] },
  { title: 'AI Research', desc: 'Tools for model evaluation and metrics dashboards.', tags: ['Python','ML','Data'] }
]

const skateItems = [
  { title: 'Downhill Race 2024', desc: 'Top-10 finish in regional series.', media: '/skate/2024.jpg' },
  { title: 'Setup Guide', desc: 'My board setup, trucks, and wheel choices.', media: '/skate/setup.jpg' }
]

export default function App(){
  // always dark-mode only
  const [route, setRoute] = React.useState<string>(() => window.location.pathname || '/')

  React.useEffect(()=>{
    const onPop = ()=> setRoute(window.location.pathname || '/')
    window.addEventListener('popstate', onPop)
    return ()=> window.removeEventListener('popstate', onPop)
  }, [])

  React.useEffect(()=>{
    // make the site dark-only
    try { document.documentElement.classList.add('dark') } catch {}
  }, [])

  return (
    <div className={`min-h-screen bg-slate-900 text-white`}>
      {/* minimal client-side router */}
      <Header navigate={(to:string)=>{ window.history.pushState({}, '', to); setRoute(to) }} />

      {route === '/' && <Home navigate={(to:string)=>{ window.history.pushState({},'',to); setRoute(to) }} />}

      {route === '/code' && (
        <main className="max-w-5xl mx-auto px-6 py-12">
          <Section id="code" title="Code / Software / Computer Science" subtitle="Selected projects and experiments">
            <div className="grid gap-6 sm:grid-cols-2">
              {codeItems.map((c)=> <CodeCard key={c.title} {...c} />)}
            </div>
          </Section>
        </main>
      )}

      {route === '/skate' && (
        <main className="max-w-5xl mx-auto px-6 py-12">
          <Section id="skate" title="Downhill Skate" subtitle="Racing, setups, and videos" className="mt-12">
            <div className="grid gap-6 sm:grid-cols-2">
              {skateItems.map((s)=> <SkateCard key={s.title} {...s} />)}
            </div>
          </Section>
        </main>
      )}
    </div>
  )
}
