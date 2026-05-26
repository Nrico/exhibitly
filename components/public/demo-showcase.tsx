'use client'

import { useState } from 'react'
import Link from 'next/link'

type WorkItem = {
  title: string
  medium: string
  dimensions: string
  image: string
}

type ArtistProfile = {
  name: string
  subtitle: string
  portrait: string
  bio: string
  link: string
  recentWork: WorkItem[]
}

const ARTISTS_DATA: Record<'seth' | 'trujillo', ArtistProfile> = {
  seth: {
    name: 'Seth Herrera',
    subtitle: 'Southwest Modern Painting & Devotional Panels',
    portrait: '/api/proxy-image?url=https://exhibitly.co/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/seth-herrera-1764388581033.jpg',
    bio: 'Seth Herrera was a Southwest modern painter. His work explores small devotional panels, carved frames, and oil portraits capturing rural families under high-desert light.',
    link: '/demo',
    recentWork: [
      {
        title: 'Trail to the Moon',
        medium: 'Oil on pine panel',
        dimensions: '12 x 12 in',
        image: '/api/proxy-image?url=https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.08821344127910269.jpg'
      },
      {
        title: 'Blinded',
        medium: 'Oil on pine panel',
        dimensions: '16 x 20 in',
        image: '/api/proxy-image?url=https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.767166483680785.jpg'
      },
      {
        title: 'A Step Away',
        medium: 'Oil on canvas',
        dimensions: '24 x 30 in',
        image: '/api/proxy-image?url=https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.1439771331160673.jpg'
      },
      {
        title: 'Village Visitors',
        medium: 'Oil on pine panel',
        dimensions: '18 x 24 in',
        image: '/api/proxy-image?url=https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.536189758092916.jpg'
      }
    ]
  },
  trujillo: {
    name: 'El Trujillo',
    subtitle: 'Traditional Woodcarving & Modern Manufacturing',
    portrait: '/api/proxy-image?url=https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/avatars/94615753-3152-4576-945b-0d62cc237d7e/avatar-0.6230062277931487.jpg',
    bio: 'El Trujillo works with cedar, cottonwood, and aspen to create carved images of Southwest saints and quiet spiritual moments. His wood carvings focus on simple lines and tool marks.',
    link: '/etrujillo',
    recentWork: [
      {
        title: 'Spiritualized',
        medium: 'Aspen wood carving',
        dimensions: 'Guardian angel sculpture',
        image: '/api/proxy-image?url=https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/94615753-3152-4576-945b-0d62cc237d7e/0.632433993989002.jpg'
      },
      {
        title: 'Heart Hands',
        medium: 'Bass wood relief',
        dimensions: 'Saint Anthony sculpture',
        image: '/api/proxy-image?url=https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/94615753-3152-4576-945b-0d62cc237d7e/0.2992653177656386.jpg'
      },
      {
        title: 'Seated Glory',
        medium: 'Cottonwood crucifix',
        dimensions: 'Crucifix carving',
        image: '/api/proxy-image?url=https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/94615753-3152-4576-945b-0d62cc237d7e/0.19525845226670868.jpg'
      },
      {
        title: 'Fatherly',
        medium: 'Cedar wood panel',
        dimensions: 'Saint Francis carving',
        image: '/api/proxy-image?url=https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/94615753-3152-4576-945b-0d62cc237d7e/0.9695098596980076.jpg'
      }
    ]
  }
}

export function DemoShowcase() {
  const [selected, setSelected] = useState<'seth' | 'trujillo'>('seth')
  const artist = ARTISTS_DATA[selected]

  return (
    <div>
      <div className="flex justify-center items-center gap-8 mb-12 border-b border-[#ebdcca]/40 pb-4 font-mono text-[11px] uppercase tracking-[2px] text-gray-500">
        <button
          onClick={() => setSelected('seth')}
          className={`pb-2 border-b transition-all duration-300 ${selected === 'seth' ? 'text-[#111111] border-[#c07b46] font-bold scale-105' : 'border-transparent hover:text-[#111111]'}`}
        >
          Seth Herrera (Painting)
        </button>
        <button
          onClick={() => setSelected('trujillo')}
          className={`pb-2 border-b transition-all duration-300 ${selected === 'trujillo' ? 'text-[#111111] border-[#c07b46] font-bold scale-105' : 'border-transparent hover:text-[#111111]'}`}
        >
          El Trujillo (Woodcarving)
        </button>
      </div>

      <div className="demo-panel bg-[#f8f5f0]/85 border border-[#ebdcca] shadow-sm transition-all duration-500 ease-in-out">
        <div>
          <h2>See a demo artist site</h2>
          <div className="accent-line" aria-hidden="true"></div>
          <div className="portrait relative w-full aspect-[1/1.05] overflow-hidden bg-[#e5d9cb] border border-[#ebdcca] rounded">
            <img
              key={artist.portrait}
              src={artist.portrait}
              alt={`Portrait of ${artist.name}`}
              className="w-full h-full object-cover animate-[fadeIn_0.5s_ease]"
            />
          </div>
        </div>

        <div className="demo-copy">
          <h3 className="font-serif text-2xl tracking-wide uppercase text-[#111111] mb-3">{artist.name}</h3>
          <p className="text-sm text-[#443a33] leading-relaxed mb-6">{artist.bio}</p>
          <Link href={artist.link} className="text-link text-[#c07b46] font-extrabold hover:text-[#9e5f32] no-underline transition-colors">
            View demo site &rarr;
          </Link>
        </div>

        <div className="recent">
          <h4 className="font-mono text-xs uppercase tracking-wider text-[#666666] mb-4">Recent work</h4>
          <div className="recent-grid grid grid-cols-2 md:grid-cols-4 gap-4">
            {artist.recentWork.map((work, idx) => (
              <div key={work.title} className="group">
                <div className="art-thumb relative aspect-square bg-[#f3efe9] border border-[#ebdcca]/60 overflow-hidden rounded">
                  <img
                    key={`${selected}-${idx}`}
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-[0.85] contrast-[1.05]"
                  />
                </div>
                <p className="caption text-[10px] text-[#4f453d] mt-2 leading-snug">
                  <strong className="block text-[#111111] font-semibold truncate">{work.title}</strong>
                  {work.medium}<br />{work.dimensions}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
