import React from 'react'

export default function SkateCard({title, desc, media}:{title:string; desc:string; media?:string}){
  return (
    <article className="bg-white rounded-lg shadow overflow-hidden">
      {media && <div className="h-40 bg-gray-200" style={{backgroundImage:`url(${media})`, backgroundSize:'cover', backgroundPosition:'center'}} />}
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{desc}</p>
      </div>
    </article>
  )
}
