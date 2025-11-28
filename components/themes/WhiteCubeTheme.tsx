'use client'

import { useState } from 'react'
import Image from 'next/image'
import { usePortfolio } from '@/components/public/portfolio-context'
import { AboutView, ContactView } from '@/components/public/shared-views'

import { GalleryHome } from '@/components/public/gallery/GalleryHome'
import { GalleryRoster } from '@/components/public/gallery/GalleryRoster'
import { GalleryExhibitions } from '@/components/public/gallery/GalleryExhibitions'

export default function WhiteCubeTheme({ view }: { view?: string }) {
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
            <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10 mb-24 px-5">
                {filteredArtworks.map((artwork) => (
                    <div key={artwork.id} className="group cursor-pointer break-inside-avoid mb-10" onClick={() => setSelectedArtwork(artwork)}>
                        <div className="w-full bg-[#eee] mb-4 overflow-hidden transition-transform duration-400 ease-out group-hover:-translate-y-1">
                            {artwork.image_url && (
                                <Image
                                    src={artwork.image_url}
                                    alt={artwork.title}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: '100%', height: 'auto' }}
                                    className="transition-transform duration-700 group-hover:scale-[1.03] grayscale-[10%] group-hover:grayscale-0"
                                />
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-1">{artwork.title}</h3>
                            <p className="text-whitecube-text-muted text-xs italic mb-2">{artwork.medium}, {artwork.dimensions}</p>
                            <div className="flex justify-center items-center gap-2 text-xs uppercase tracking-wider">
                                {artwork.status === 'sold' ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-whitecube-red"></span>
                                        <span className="text-[#a0a0a0]">Sold</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-semibold text-whitecube-text">Available</span>
                                        <span className="text-[#ccc]">&mdash;</span>
                                        <span className="text-whitecube-accent">{artwork.price ? `$${artwork.price.toLocaleString()}` : 'Inquire'}</span>
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
        <div className="min-h-screen bg-whitecube-bg text-whitecube-text font-[family-name:var(--font-montserrat)] selection:bg-whitecube-accent selection:text-white">
            <div className="max-w-[1200px] mx-auto p-5 md:p-10">
                <header className="text-center py-[60px] mb-10">
                    <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-display)] font-normal tracking-[2px] mb-2 uppercase">
                        {settings.site_title || profile.full_name || 'Untitled Artist'}
                    </h1>
                    <div className="text-whitecube-text-muted text-sm uppercase tracking-[3px]">
                        {settings.site_subtitle || 'Fine Art & Illustration'}
                    </div>

                    <nav className="mt-8 py-4 border-t border-b border-whitecube-border flex justify-center gap-8 text-sm uppercase tracking-wider">
                        {isGalleryAccount ? (
                            <>
                                <a href="?view=home" className={`hover:text-whitecube-accent transition-colors ${view === 'home' ? 'text-whitecube-accent' : ''}`}>Home</a>
                                <a href="?view=artists" className={`hover:text-whitecube-accent transition-colors ${view === 'artists' ? 'text-whitecube-accent' : ''}`}>Artists</a>
                                <a href="?view=exhibitions" className={`hover:text-whitecube-accent transition-colors ${view === 'exhibitions' ? 'text-whitecube-accent' : ''}`}>Exhibitions</a>
                                <a href="?view=about" className={`hover:text-whitecube-accent transition-colors ${view === 'about' ? 'text-whitecube-accent' : ''}`}>About</a>
                                <a href="?view=contact" className={`hover:text-whitecube-accent transition-colors ${view === 'contact' ? 'text-whitecube-accent' : ''}`}>Contact</a>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setCurrentView('gallery')} className={`hover:text-whitecube-accent transition-colors ${currentView === 'gallery' ? 'text-whitecube-accent' : ''}`}>Portfolio</button>
                                <button onClick={() => setCurrentView('about')} className={`hover:text-whitecube-accent transition-colors ${currentView === 'about' ? 'text-whitecube-accent' : ''}`}>About</button>
                                <button onClick={() => setCurrentView('contact')} className={`hover:text-whitecube-accent transition-colors ${currentView === 'contact' ? 'text-whitecube-accent' : ''}`}>Contact</button>
                            </>
                        )}
                    </nav>

                    {/* Collection Filter for White Cube (Only for Artist Gallery View) */}
                    {!isGalleryAccount && currentView === 'gallery' && uniqueCollections.length > 0 && (
                        <div className="flex justify-center gap-6 mt-6 text-xs uppercase tracking-widest text-[#999]">
                            <button
                                onClick={() => setSelectedCollection('All')}
                                className={`hover:text-whitecube-text transition-colors ${selectedCollection === 'All' ? 'text-whitecube-text border-b border-whitecube-text' : ''}`}
                            >
                                All
                            </button>
                            {uniqueCollections.map(col => (
                                <button
                                    key={col}
                                    onClick={() => setSelectedCollection(col)}
                                    className={`hover:text-whitecube-text transition-colors ${selectedCollection === col ? 'text-whitecube-text border-b border-whitecube-text' : ''}`}
                                >
                                    {col}
                                </button>
                            ))}
                        </div>
                    )}
                </header>

                {renderContent()}

                <footer className="text-center py-12 border-t border-whitecube-border text-whitecube-text-muted text-xs">
                    &copy; {new Date().getFullYear()} {profile.full_name}. All Rights Reserved.
                </footer>
            </div>
        </div>
    )
}
