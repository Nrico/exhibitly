'use client'

import { useState } from 'react'
import Image from 'next/image'
import { usePortfolio } from '@/components/public/portfolio-context'
import { AboutView, ContactView } from '@/components/public/shared-views'

import { GalleryHome } from '@/components/public/gallery/GalleryHome'
import { GalleryRoster } from '@/components/public/gallery/GalleryRoster'
import { GalleryExhibitions } from '@/components/public/gallery/GalleryExhibitions'

export default function ArchiveTheme({ view }: { view?: string }) {
    const { profile, settings, artworks, setSelectedArtwork, artists, exhibitions } = usePortfolio()
    const [currentView, setCurrentView] = useState<'gallery' | 'about' | 'contact'>('gallery')
    const [selectedCollection, setSelectedCollection] = useState<string>('All')

    // Extract unique collections
    const uniqueCollections = Array.from(new Set(artworks.map(item => item.collection).filter(Boolean))) as string[]

    // Filter artworks
    const filteredArtworks = selectedCollection === 'All'
        ? artworks
        : artworks.filter(item => item.collection === selectedCollection)

    // Gallery Logic
    const isGalleryAccount = profile.account_type === 'gallery'

    const renderContent = () => {
        if (isGalleryAccount) {
            if (view === 'home') return <GalleryHome profile={profile} settings={settings} artists={artists || []} exhibitions={exhibitions || []} />
            if (view === 'artists') return <GalleryRoster artists={artists || []} />
            if (view === 'exhibitions') return <GalleryExhibitions exhibitions={exhibitions || []} />
            if (view === 'about') return <AboutView />
            if (view === 'contact') return <ContactView />
        }

        if (currentView === 'about') return <AboutView />
        if (currentView === 'contact') return <ContactView />

        // Default Gallery View (Artworks)
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
                {filteredArtworks.map((artwork) => (
                    <div key={artwork.id} className="group cursor-pointer" onClick={() => setSelectedArtwork(artwork)}>
                        {/* Buffer Block */}
                        <div className="w-full aspect-square bg-archive-bg-secondary flex items-center justify-center mb-5 relative transition-colors duration-300 group-hover:bg-archive-bg-hover">
                            <div className="relative w-[85%] h-[85%] transition-transform duration-400 group-hover:scale-[1.02]">
                                {artwork.image_url && (
                                    <Image
                                        src={artwork.image_url}
                                        alt={artwork.title}
                                        fill
                                        className="object-contain drop-shadow-xl"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="pl-1">
                            <div className="font-semibold text-base mb-1 text-archive-text">{artwork.title}</div>
                            <div className="text-archive-text-muted text-sm mb-2">{artwork.medium}</div>
                            <div className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
                                {artwork.status === 'sold' ? (
                                    <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-archive-red"></span>
                                        <span className="text-[#999]">Sold</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-1.5 h-1.5 rounded-full bg-archive-green"></span>
                                        <span className="text-archive-text">Available — {artwork.price ? `$${artwork.price.toLocaleString()}` : 'Inquire'}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-archive-bg text-archive-text font-[family-name:var(--font-sans)] selection:bg-black selection:text-white">
            <div className="max-w-[1600px] mx-auto px-10 pb-24">
                <header className="py-[60px] flex flex-col md:flex-row justify-between items-baseline border-b border-archive-border mb-[60px]">
                    <div className="font-semibold text-2xl tracking-tight">
                        {settings.site_title || profile.full_name || 'Untitled Artist'}
                    </div>
                    <nav className="flex gap-8 text-archive-text-muted text-sm mt-4 md:mt-0">
                        {isGalleryAccount ? (
                            <>
                                <a href="?view=home" className={`hover:text-black transition-colors ${view === 'home' ? 'text-black font-semibold' : ''}`}>Home</a>
                                <a href="?view=artists" className={`hover:text-black transition-colors ${view === 'artists' ? 'text-black font-semibold' : ''}`}>Artists</a>
                                <a href="?view=exhibitions" className={`hover:text-black transition-colors ${view === 'exhibitions' ? 'text-black font-semibold' : ''}`}>Exhibitions</a>
                                <a href="?view=about" className={`hover:text-black transition-colors ${view === 'about' ? 'text-black font-semibold' : ''}`}>About</a>
                                <a href="?view=contact" className={`hover:text-black transition-colors ${view === 'contact' ? 'text-black font-semibold' : ''}`}>Contact</a>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setCurrentView('gallery')} className={`hover:text-black transition-colors ${currentView === 'gallery' ? 'text-black font-semibold' : ''}`}>Work</button>
                                <button onClick={() => setCurrentView('about')} className={`hover:text-black transition-colors ${currentView === 'about' ? 'text-black font-semibold' : ''}`}>About</button>
                                <button onClick={() => setCurrentView('contact')} className={`hover:text-black transition-colors ${currentView === 'contact' ? 'text-black font-semibold' : ''}`}>Contact</button>
                            </>
                        )}
                    </nav>
                </header>

                {/* Collection Filter for Archive (Only for Artist Gallery View) */}
                {!isGalleryAccount && currentView === 'gallery' && uniqueCollections.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-10 text-sm">
                        <button
                            onClick={() => setSelectedCollection('All')}
                            className={`px-3 py-1 rounded-full border transition-all ${selectedCollection === 'All' ? 'bg-black text-white border-black' : 'bg-white text-archive-text-muted border-archive-border hover:border-[#ccc]'}`}
                        >
                            All
                        </button>
                        {uniqueCollections.map(col => (
                            <button
                                key={col}
                                onClick={() => setSelectedCollection(col)}
                                className={`px-3 py-1 rounded-full border transition-all ${selectedCollection === col ? 'bg-black text-white border-black' : 'bg-white text-archive-text-muted border-archive-border hover:border-[#ccc]'}`}
                            >
                                {col}
                            </button>
                        ))}
                    </div>
                )}

                {renderContent()}

                <footer className="mt-24 pt-12 border-t border-archive-border text-center text-archive-text-muted text-xs">
                    &copy; {new Date().getFullYear()} {profile.full_name}
                </footer>
            </div>
        </div>
    )
}
