'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, EnvelopeSimple, Eye, FilePdf, LinkSimple, CheckSquare, Sparkle } from '@phosphor-icons/react'

const DEMO_ARTWORKS = [
  {
    id: 'seth-art-1',
    title: 'Trail to the Moon',
    year: '1938',
    medium: 'Oil on pine panel',
    dimensions: '12" x 12"',
    price: 950,
    status: 'available',
    image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.08821344127910269.jpg',
    collection: 'Devotional Series',
    location: 'Santa Fe Studio',
    edition: 'Unique piece',
  },
  {
    id: 'seth-art-2',
    title: 'Blinded',
    year: '1935',
    medium: 'Oil on pine panel',
    dimensions: '16" x 20"',
    price: 1200,
    status: 'sold',
    image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.767166483680785.jpg',
    collection: 'Devotional Series',
    location: 'Private Collection, Denver',
    edition: 'Unique piece',
  },
  {
    id: 'seth-art-3',
    title: 'A Step Away',
    year: '1939',
    medium: 'Oil on canvas',
    dimensions: '24" x 30"',
    price: 1800,
    status: 'available',
    image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.1439771331160673.jpg',
    collection: 'High Desert Landscapes',
    location: 'Santa Fe Studio',
    edition: 'Unique piece',
  },
  {
    id: 'seth-art-4',
    title: 'Village Visitors',
    year: '1932',
    medium: 'Oil on pine panel',
    dimensions: '18" x 24"',
    price: 1400,
    status: 'available',
    image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.536189758092916.jpg',
    collection: 'Devotional Series',
    location: 'Santa Fe Studio',
    edition: 'Unique piece',
  },
  {
    id: 'seth-art-5',
    title: 'Afield',
    year: '1942',
    medium: 'Oil on pine panel',
    dimensions: '14" x 18"',
    price: 1100,
    status: 'available',
    image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.8895845909369582.jpg',
    collection: 'High Desert Landscapes',
    location: 'Santa Fe Studio',
    edition: 'Unique piece',
  },
  {
    id: 'seth-art-6',
    title: 'Waiting',
    year: '1937',
    medium: 'Oil on pine panel',
    dimensions: '16" x 16"',
    price: 1050,
    status: 'available',
    image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.3304782566425537.jpg',
    collection: 'Devotional Series',
    location: 'Santa Fe Studio',
    edition: 'Unique piece',
  },
  {
    id: 'seth-art-7',
    title: 'Unweighted',
    year: '1946',
    medium: 'Mixed media on plaster',
    dimensions: '20" x 20"',
    price: 1500,
    status: 'available',
    image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.9485456189138799.jpg',
    collection: 'Erosions',
    location: 'Santa Fe Studio',
    edition: 'Unique piece',
  },
  {
    id: 'seth-art-8',
    title: 'Lifted',
    year: '1945',
    medium: 'Mixed media on canvas',
    dimensions: '24" x 24"',
    price: 1650,
    status: 'sold',
    image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.7540313757342361.jpg',
    collection: 'Erosions',
    location: 'Private Collection, Taos',
    edition: 'Unique piece',
  },
  {
    id: 'seth-art-9',
    title: 'Aria',
    year: '1940',
    medium: 'Pigment and plaster on wood',
    dimensions: '12" x 12"',
    price: 800,
    status: 'available',
    image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.8350907023923659.jpg',
    collection: 'Erosions',
    location: 'Santa Fe Studio',
    edition: 'Unique piece',
  },
  {
    id: 'seth-art-10',
    title: 'Pushed',
    year: '1941',
    medium: 'Pigment on plaster',
    dimensions: '18" x 18"',
    price: 900,
    status: 'available',
    image_url: 'https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.8204712740782429.jpg',
    collection: 'Erosions',
    location: 'Santa Fe Studio',
    edition: 'Unique piece',
  }
]

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'wall' | 'available' | 'bio' | 'room' | 'packet'>('wall')
  const [selectedArtwork, setSelectedArtwork] = useState<any | null>(null)
  const [inquirySuccess, setInquirySuccess] = useState(false)
  const [selectedViewingRoomId, setSelectedViewingRoomId] = useState<string>('room-1')

  const availableArtworks = DEMO_ARTWORKS.filter(art => art.status === 'available')

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setInquirySuccess(true)
    setTimeout(() => {
      setInquirySuccess(false)
      setSelectedArtwork(null)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-brand-warm-white text-brand-charcoal font-sans selection:bg-brand-clay selection:text-white">
      
      {/* Redirection banner to platform */}
      <div className="bg-brand-bone border-b border-brand-sand-line py-3 px-8 text-center text-xs font-mono flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-brand-clay hover:underline no-underline">
          <ArrowLeft size={12} /> Back to Exhibitly.art
        </Link>
        <span className="hidden sm:inline text-brand-graphite">
          <Sparkle size={12} className="inline mr-1 text-brand-clay" /> 
          This is a live demo of an Exhibitly-generated artist website.
        </span>
        <Link href="/auth?view=signup" className="text-brand-charcoal font-semibold hover:underline no-underline">
          Start your own portfolio &rarr;
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto p-8 md:p-16">
        
        {/* --- ARTIST HEADER --- */}
        <header className="text-center py-12 border-b border-brand-sand-line mb-10">
          <h1 className="text-5xl font-serif font-normal tracking-wide text-brand-black uppercase">
            Seth Herrera
          </h1>
          <div className="text-brand-clay text-xs font-semibold uppercase tracking-[3px] mt-2">
            Santa Fe, New Mexico &mdash; Southwest Modern Painting & Devotional Panels
          </div>

          {/* Navigation Tabs */}
          <nav className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-mono uppercase tracking-widest text-brand-graphite">
            <button 
              onClick={() => setActiveTab('wall')} 
              className={`pb-1.5 border-b hover:text-brand-black transition-colors ${activeTab === 'wall' ? 'text-brand-black border-brand-clay font-bold' : 'border-transparent'}`}
            >
              The Wall (Portfolio)
            </button>
            <button 
              onClick={() => setActiveTab('available')} 
              className={`pb-1.5 border-b hover:text-brand-black transition-colors ${activeTab === 'available' ? 'text-brand-black border-brand-clay font-bold' : 'border-transparent'}`}
            >
              Available Works ({availableArtworks.length})
            </button>
            <button 
              onClick={() => setActiveTab('bio')} 
              className={`pb-1.5 border-b hover:text-brand-black transition-colors ${activeTab === 'bio' ? 'text-brand-black border-brand-clay font-bold' : 'border-transparent'}`}
            >
              Bio & Statement
            </button>
            <button 
              onClick={() => setActiveTab('room')} 
              className={`pb-1.5 border-b hover:text-brand-clay hover:border-brand-clay/30 transition-all ${activeTab === 'room' ? 'text-brand-clay border-brand-clay font-bold' : 'border-transparent text-brand-clay/80'}`}
            >
              <Eye size={12} className="inline mr-1" /> Viewing Rooms (Demo)
            </button>
            <button 
              onClick={() => setActiveTab('packet')} 
              className={`pb-1.5 border-b hover:text-brand-clay hover:border-brand-clay/30 transition-all ${activeTab === 'packet' ? 'text-brand-clay border-brand-clay font-bold' : 'border-transparent text-brand-clay/80'}`}
            >
              <FilePdf size={12} className="inline mr-1" /> Studio Packets (Demo)
            </button>
          </nav>
        </header>

        {/* --- TAB CONTENT --- */}
        <main className="min-h-[500px]">
          
          {/* 1. THE WALL TAB */}
          {activeTab === 'wall' && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 mb-24">
              {DEMO_ARTWORKS.map(artwork => (
                <div 
                  key={artwork.id} 
                  className="bg-brand-bone/50 border border-brand-sand-line p-4 break-inside-avoid cursor-pointer group hover:border-brand-clay transition-all"
                  onClick={() => setSelectedArtwork(artwork)}
                >
                  <div className="w-full relative bg-brand-bone overflow-hidden mb-4 aspect-square">
                    <Image 
                      src={artwork.image_url} 
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-102 saturate-[0.85] contrast-[1.05]"
                    />
                  </div>
                  <div className="border-t border-brand-sand-line pt-3 flex justify-between items-baseline font-mono text-xs">
                    <div className="font-sans font-bold text-sm text-brand-charcoal">{artwork.title}</div>
                    <div>{artwork.year}</div>
                  </div>
                  <div className="text-xs text-brand-graphite italic mt-1">{artwork.medium}</div>
                  <div className="mt-3 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                    <span className={artwork.status === 'sold' ? 'text-brand-red-earth' : 'text-brand-copper'}>
                      {artwork.status}
                    </span>
                    <span>{artwork.status === 'available' ? `$${artwork.price.toLocaleString()}` : 'n.f.s.'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. AVAILABLE WORKS TAB */}
          {activeTab === 'available' && (
            <div className="space-y-12 mb-24 max-w-4xl mx-auto">
              <div className="bg-brand-bone border border-brand-sand-line p-6 text-center text-xs font-mono text-brand-graphite">
                Showing available works in Seth Herrera's Flat File archive. Click "Inquire" to send a formal purchase request.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {availableArtworks.map(artwork => (
                  <div 
                    key={artwork.id} 
                    className="border border-brand-sand-line bg-brand-bone/30 p-6 flex flex-col justify-between hover:border-brand-clay transition-all"
                  >
                    <div>
                      <div className="w-full relative aspect-[4/3] bg-brand-bone mb-4 border border-brand-sand-line">
                        <Image src={artwork.image_url} alt={artwork.title} fill className="object-cover saturate-[0.8]" />
                      </div>
                      <h3 className="font-serif text-2xl text-brand-black">{artwork.title}</h3>
                      <div className="font-mono text-xs text-brand-graphite mt-1.5 border-b border-brand-sand-line pb-2.5">
                        {artwork.year} &bull; {artwork.medium} &bull; {artwork.dimensions}
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                      <span className="font-mono text-lg font-bold text-brand-charcoal">${artwork.price.toLocaleString()}</span>
                      <button 
                        onClick={() => setSelectedArtwork(artwork)}
                        className="px-5 py-2.5 bg-brand-charcoal text-brand-warm-white hover:bg-brand-clay transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                      >
                        <EnvelopeSimple size={14} /> Inquire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. BIO & STATEMENT TAB */}
          {activeTab === 'bio' && (
            <div className="max-w-3xl mx-auto space-y-16 mb-24">
              
              {/* Biography Section */}
              <div className="space-y-6">
                <h3 className="font-serif text-3xl border-b border-brand-sand-line pb-3 text-brand-black">Biography</h3>
                <p className="text-base text-brand-graphite leading-relaxed font-light">
                  Seth Herrera worked across the Southwest from the 1910s to the late 1940s. He focused on small devotional panels, carved frames, and oil portraits of rural families. He traveled by rail and wagon, taking seasonal jobs while painting at night.
                </p>
                <p className="text-base text-brand-graphite leading-relaxed font-light">
                  His notebooks show careful studies of light on adobe walls and figures at work. Museums later recognized his paintings for their steady observation and simple technique. His surviving pieces appear in regional collections, church offices, and a few private homes that kept his work for generations.
                </p>
              </div>

              {/* Artist Statement */}
              <div className="space-y-6">
                <h3 className="font-serif text-3xl border-b border-brand-sand-line pb-3 text-brand-black">Artist Statement</h3>
                <p className="text-base text-brand-graphite leading-relaxed font-light italic">
                  "My work is an observation of quiet moments in the high-desert valleys. Through the use of devotional panel structures, hand-built pine frames, and classic oil techniques, I hope to anchor the light and daily labor of rural families in a timeless space."
                </p>
              </div>

              {/* Curriculum Vitae (CV) */}
              <div className="space-y-6">
                <h3 className="font-serif text-3xl border-b border-brand-sand-line pb-3 text-brand-black">Curriculum Vitae</h3>
                <div className="font-mono text-xs text-brand-graphite space-y-6">
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm mb-2">SELECTED EXHIBITIONS</h4>
                    <ul className="space-y-2">
                      <li>1938 &bull; *Devotional Panels*, Santa Fe Museum of Fine Arts, Santa Fe, NM (Solo)</li>
                      <li>1932 &bull; *Southwest Regional Exhibition*, Albuquerque, NM (Group)</li>
                      <li>1928 &bull; *New Mexico Guild Exhibition*, Taos, NM (Group)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-charcoal text-sm mb-2">RESIDENCIES & AWARDS</h4>
                    <ul className="space-y-2">
                      <li>1941 &bull; New Mexico Historical Society Honor</li>
                      <li>1935 &bull; WPA Federal Art Project Commission</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 4. PRIVATE VIEWING ROOMS TAB */}
          {activeTab === 'room' && (
            <div className="max-w-4xl mx-auto space-y-10 mb-24">
              
              {/* Educational Banner */}
              <div className="bg-brand-bone border border-brand-sand-line p-6 rounded space-y-3">
                <div className="flex items-center gap-2 text-brand-clay font-bold text-sm">
                  <Sparkle size={16} /> PRIVATE VIEWING ROOMS FUNCTION
                </div>
                <p className="text-xs text-brand-graphite leading-relaxed">
                  In Exhibitly, artists can bundle a private selection of works and generate a password-free, shareable URL to present to a specific curator, gallery, or VIP collector. You also track real-time analytics such as view counters.
                </p>
              </div>

              {/* The Simulator */}
              <div className="border border-brand-sand-line bg-white shadow-sm overflow-hidden">
                {/* Simulator Header */}
                <div className="bg-brand-charcoal text-brand-warm-white p-4 font-mono text-xs flex justify-between items-center">
                  <span>PREVIEW // ACTIVE PRIVATE VIEWING ROOM</span>
                  <span className="flex items-center gap-1.5 text-brand-clay font-bold">
                    <Eye size={14} /> LIVE ANALYTICS ACTIVED
                  </span>
                </div>

                <div className="p-8 space-y-8 bg-brand-warm-white">
                  <div className="border-b border-brand-sand-line pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2">
                    <div>
                      <h2 className="font-serif text-3xl text-brand-black">Preview: Sylvia Vance Pre-acquisition Review</h2>
                      <div className="text-xs text-brand-graphite mt-1 font-mono">
                        URL: <span className="underline">exhibitly.art/view/seth-sylvia-room</span>
                      </div>
                    </div>
                    
                    {/* Simulated Analytics Counter */}
                    <div className="bg-brand-bone border border-brand-sand-line p-2 text-right font-mono text-[10px] text-brand-graphite">
                      <div>VIEWS: <span className="text-brand-clay font-bold">14</span></div>
                      <div>LAST VIEW: <span className="text-brand-black font-semibold">2m ago</span></div>
                    </div>
                  </div>

                  <p className="text-sm text-brand-graphite italic font-light">
                    "Sylvia, here is a preview of the newest devotional panels and oil paintings from my Santa Fe studio. Let me know if you would like me to reserve any of these for your collection before the official exhibition opening next month." &mdash; Seth
                  </p>

                  {/* Simulated Artworks in Room */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {DEMO_ARTWORKS.slice(0, 4).map(artwork => (
                      <div key={artwork.id} className="border border-brand-sand-line p-4 bg-white flex gap-4">
                        <div className="w-20 h-20 bg-brand-bone relative flex-shrink-0 border border-brand-sand-line">
                          <Image src={artwork.image_url} alt="" fill className="object-cover saturate-[0.8]" />
                        </div>
                        <div className="min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-lg font-normal truncate">{artwork.title}</h4>
                            <p className="text-[10px] text-brand-graphite font-mono truncate">{artwork.medium}</p>
                          </div>
                          <div className="flex justify-between items-center text-xs font-mono pt-2">
                            <span className="text-brand-clay font-bold">${artwork.price}</span>
                            <span className="text-brand-copper uppercase font-bold text-[9px]">{artwork.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Curatorial comment connector */}
                  <div className="border-t border-dashed border-brand-sand-line pt-4 text-center">
                    <span className="text-[10px] font-mono text-brand-graphite bg-brand-bone px-3 py-1 border border-brand-sand-line">
                      [Developer Hook: Stripe inquiry connector will bind to 'mailto' or active checkout portal]
                    </span>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* 5. STUDIO PACKETS TAB */}
          {activeTab === 'packet' && (
            <div className="max-w-4xl mx-auto space-y-10 mb-24">
              
              {/* Educational Banner */}
              <div className="bg-brand-bone border border-brand-sand-line p-6 rounded space-y-3">
                <div className="flex items-center gap-2 text-brand-clay font-bold text-sm">
                  <Sparkle size={16} /> STUDIO PACKET / PDF EXPORTER FUNCTION
                </div>
                <p className="text-xs text-brand-graphite leading-relaxed">
                  Generate professional, beautifully formatted PDF documents containing catalog pages, price sheets, biography statements, or residency submission dossiers in one click.
                </p>
              </div>

              {/* The Mock PDF Page */}
              <div className="bg-brand-graphite/10 p-8 border border-brand-sand-line flex flex-col items-center">
                <div className="mb-4">
                  <button 
                    onClick={() => alert("Simulation: In the live application, this generates a high-resolution PDF download using our @react-pdf/renderer module.")}
                    className="px-6 py-3 bg-brand-charcoal text-brand-warm-white hover:bg-brand-clay transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md"
                  >
                    <FilePdf size={16} /> Export PDF Portfolio Packet
                  </button>
                </div>

                {/* PDF Document Visual Representation */}
                <div className="w-full max-w-[600px] bg-white shadow-xl border border-brand-sand-line p-12 aspect-[1/1.414] font-mono text-[9px] text-brand-graphite space-y-8 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="border-b border-brand-charcoal pb-4 mb-8 flex justify-between items-baseline">
                      <span className="text-brand-charcoal font-sans font-bold text-sm uppercase">Seth Herrera Portfolio Packet</span>
                      <span>Santa Fe, New Mexico</span>
                    </div>

                    {/* Bio Statement Block */}
                    <div className="mb-8 font-sans font-light leading-relaxed text-[10px] space-y-2">
                      <span className="font-mono text-[8px] font-bold text-brand-clay block mb-1">ARTIST BIOGRAPHY</span>
                      <p>
                        Seth Herrera focused on small devotional panels, carved frames, and oil portraits of rural families. His notebooks show careful studies of light on adobe walls and figures at work in the high-desert valleys.
                      </p>
                    </div>

                    {/* Selected Artworks Section */}
                    <span className="font-mono text-[8px] font-bold text-brand-clay block mb-3">SELECTED WORKS CATALOG</span>
                    
                    <div className="grid grid-cols-2 gap-6">
                      
                      {/* Item 1 */}
                      <div className="border border-brand-sand-line p-3 bg-brand-warm-white/20">
                        <div className="w-full aspect-square relative bg-brand-bone mb-2">
                          <Image src="https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.08821344127910269.jpg" alt="" fill className="object-cover saturate-50" />
                        </div>
                        <div className="font-bold text-brand-charcoal font-sans text-[10px]">Trail to the Moon</div>
                        <div>Oil on pine panel</div>
                        <div>12" x 12" &bull; 1938</div>
                        <div className="mt-1.5 font-bold text-brand-charcoal">$950 (Available)</div>
                      </div>

                      {/* Item 2 */}
                      <div className="border border-brand-sand-line p-3 bg-brand-warm-white/20">
                        <div className="w-full aspect-square relative bg-brand-bone mb-2">
                          <Image src="https://zdfxzjjvjddsdmkrihgl.supabase.co/storage/v1/object/public/artworks/d58d3215-4cf4-49fb-9b09-fca65ea7da1b/0.1439771331160673.jpg" alt="" fill className="object-cover saturate-50" />
                        </div>
                        <div className="font-bold text-brand-charcoal font-sans text-[10px]">A Step Away</div>
                        <div>Oil on canvas</div>
                        <div>24" x 30" &bull; 1939</div>
                        <div className="mt-1.5 font-bold text-brand-charcoal">$1,800 (Available)</div>
                      </div>

                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-brand-sand-line pt-3 flex justify-between text-[7px] text-brand-graphite">
                    <span>Generated via Exhibitly.art Studio Exporter</span>
                    <span>Page 1 of 4</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* --- INQUIRY MODAL --- */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-brand-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-warm-white border border-brand-sand-line p-8 max-w-lg w-full relative animate-fadeIn shadow-2xl">
            <button 
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 text-brand-graphite hover:text-brand-black font-mono text-sm"
            >
              [X] CLOSE
            </button>

            {inquirySuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-brand-copper/20 text-brand-copper rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  &check;
                </div>
                <h3 className="font-serif text-2xl text-brand-black">Inquiry Submitted</h3>
                <p className="text-sm text-brand-graphite">
                  Seth Herrera will receive your request directly at his Santa Fe studio email.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-brand-clay font-bold block uppercase tracking-wider mb-1">
                    ARTWORK INQUIRY
                  </span>
                  <h3 className="font-serif text-3xl text-brand-black">{selectedArtwork.title}</h3>
                  <p className="text-xs text-brand-graphite italic mt-1">
                    {selectedArtwork.medium} &bull; {selectedArtwork.dimensions} &bull; {selectedArtwork.year}
                  </p>
                </div>

                <div className="w-full relative aspect-video bg-brand-bone border border-brand-sand-line overflow-hidden">
                  <Image src={selectedArtwork.image_url} alt="" fill className="object-cover saturate-[0.8]" />
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-brand-graphite mb-1.5">YOUR NAME</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2.5 border border-brand-sand-line bg-brand-warm-white text-brand-charcoal focus:outline-none focus:border-brand-clay"
                      />
                    </div>
                    <div>
                      <label className="block text-brand-graphite mb-1.5">EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        required 
                        className="w-full p-2.5 border border-brand-sand-line bg-brand-warm-white text-brand-charcoal focus:outline-none focus:border-brand-clay"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-brand-graphite mb-1.5">MESSAGE / INQUIRY DETAILS</label>
                    <textarea 
                      rows={3} 
                      required 
                      defaultValue={`Hello Seth, I am interested in acquiring your work "${selectedArtwork.title}" ($${selectedArtwork.price ? selectedArtwork.price.toLocaleString() : 'N/A'}). Please let me know shipping options.`}
                      className="w-full p-2.5 border border-brand-sand-line bg-brand-warm-white text-brand-charcoal focus:outline-none focus:border-brand-clay"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-brand-charcoal text-brand-warm-white font-sans font-semibold uppercase tracking-[2px] hover:bg-brand-clay transition-all"
                  >
                    Submit Purchase Inquiry
                  </button>
                </form>

                {/* Developer hooks comments */}
                <div className="text-[8px] font-mono text-center text-brand-graphite pt-2 border-t border-brand-sand-line border-dashed">
                  [Developer Hook: This form dispatches a server action to record inquiry in supabase and email the artist via Resend]
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
