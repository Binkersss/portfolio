import React from 'react'

export default function Section({id, title, subtitle, children, className}:{id?:string; title:string; subtitle?:string; children:React.ReactNode; className?:string}){
  const elId = id ?? title.split(' ')[0].toLowerCase()
  return (
    <section className={className}>
      <div id={elId} className="mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}
