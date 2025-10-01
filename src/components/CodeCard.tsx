import React from 'react'

export default function CodeCard({title, desc, tags}:{title:string; desc:string; tags?:string[]}){
  return (
    <article className="bg-white rounded-lg shadow p-5">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags?.map(t=> <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>)}
      </div>
    </article>
  )
}
