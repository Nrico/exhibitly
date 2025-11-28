'use client'

import { useState } from 'react'
import Image from 'next/image'
import { usePortfolio } from '@/components/public/portfolio-context'
import { AboutView, ContactView } from '@/components/public/shared-views'

import { GalleryHome } from '@/components/public/gallery/GalleryHome'
import { GalleryRoster } from '@/components/public/gallery/GalleryRoster'
import { GalleryExhibitions } from '@/components/public/gallery/GalleryExhibitions'

export default function CinemaTheme({ view }: { view?: string }) {
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
            if (view === 'artists') return <GalleryRoster artists={artists || []} variant="masonry" mutedTextClass="text-cinema-text-muted" />
            if (view === 'exhibitions') return <GalleryExhibitions exhibitions={exhibitions || []} variant="masonry" mutedTextClass="text-cinema-text-muted" />
            if (view === 'about') return <AboutView />
            if (view === 'contact') return <ContactView />
        }

        if (currentView === 'about') return <AboutView />
        if (currentView === 'contact') return <ContactView />

        // Default Gallery View (Artworks)
        return (
            <div className="columns-1 md:columns-2 gap-10 space-y-10">
                {filteredArtworks.map((artwork, index) => (
                    <article
                        key={artwork.id}
                        className="break-inside-avoid mb-10 opacity-0 animate-[fadeUp_1s_forwards] cursor-pointer group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => setSelectedArtwork(artwork)}
                    >
                        <div className="bg-zinc-900 p-2 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                            {artwork.image_url && (
                                <Image
                                    src={artwork.image_url}
                                    alt={artwork.title}
                                    width={0}
                                    height={0}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ width: '100%', height: 'auto' }}
                                    className="block contrast-[1.05]"
                                />
                            )}
                        </div>
                        <div className="mt-4 border-b border-gray-800 pb-2">
                            <h2 className="font-[family-name:var(--font-cinzel)] text-xl text-gray-200 mb-1">{artwork.title}</h2>
                            <div className="flex justify-between items-baseline text-xs font-serif text-gray-500">
                                <span>{artwork.medium}</span>
                                {artwork.status === 'sold' ? (
                                    <span className="text-cinema-red">Sold</span>
                                ) : (
                                    <span className="text-cinema-gold">{artwork.price ? `$${artwork.price.toLocaleString()}` : 'Inquire'}</span>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-gray-200 font-[family-name:var(--font-fauna)] selection:bg-cinema-gold selection:text-black">
            <div className="flex flex-col md:flex-row min-h-screen">

                {/* Fixed Sidebar */}
                <aside className="w-full md:w-[35%] md:h-screen md:fixed left-0 top-0 flex flex-col justify-center p-10 md:p-[60px] border-b md:border-b-0 md:border-r border-cinema-border z-10 bg-black">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-cinzel)] leading-[1.1] mb-5 tracking-widest text-gray-100 cursor-pointer" onClick={() => setCurrentView('gallery')}>
                            {settings.site_title?.split(' ').map((word, i) => <span key={i} className="block">{word}</span>) || <span className="block">Untitled<br />Artist</span>}
                        </h1>
                        <div className="text-cinema-gold uppercase tracking-[3px] text-sm mb-12">
                            {settings.site_subtitle || `Collection ${new Date().getFullYear()}`}
                        </div>

                        <nav className="space-y-4 font-[family-name:var(--font-cinzel)] text-lg text-cinema-text-muted">
                            {isGalleryAccount ? (
                                <>
                                    <a href="?view=home" className={`block hover:text-gray-200 hover:translate-x-2 transition-all text-left w-full ${view === 'home' ? 'text-gray-100 border-l-2 border-cinema-gold pl-3' : 'text-cinema-text-muted'}`}>Home</a>
                                    <a href="?view=artists" className={`block hover:text-gray-200 hover:translate-x-2 transition-all text-left w-full ${view === 'artists' ? 'text-gray-100 border-l-2 border-cinema-gold pl-3' : 'text-cinema-text-muted'}`}>Artists</a>
                                    <a href="?view=exhibitions" className={`block hover:text-gray-200 hover:translate-x-2 transition-all text-left w-full ${view === 'exhibitions' ? 'text-gray-100 border-l-2 border-cinema-gold pl-3' : 'text-cinema-text-muted'}`}>Exhibitions</a>
                                    <a href="?view=about" className={`block hover:text-gray-200 hover:translate-x-2 transition-all text-left w-full ${view === 'about' ? 'text-gray-100 border-l-2 border-cinema-gold pl-3' : 'text-cinema-text-muted'}`}>About</a>
                                    <a href="?view=contact" className={`block hover:text-gray-200 hover:translate-x-2 transition-all text-left w-full ${view === 'contact' ? 'text-gray-100 border-l-2 border-cinema-gold pl-3' : 'text-cinema-text-muted'}`}>Contact</a>
                                </>
                            ) : (
                                <button onClick={() => setCurrentView('gallery')} className={`block hover:text-gray-200 hover:translate-x-2 transition-all text-left w-full ${currentView === 'gallery' ? 'text-gray-100 border-l-2 border-cinema-gold pl-3' : 'text-cinema-text-muted'}`}>Gallery</button>
                            )}

                            {/* Collection Sub-nav for Cinema (Only for Artist Gallery View) */}
                            {!isGalleryAccount && currentView === 'gallery' && uniqueCollections.length > 0 && (
                                <div className="pl-6 space-y-2 mt-2 mb-4 text-sm font-sans tracking-wider">
                                    <button
                                        onClick={() => setSelectedCollection('All')}
                                        className={`block text-left transition-colors ${selectedCollection === 'All' ? 'text-cinema-gold' : 'text-cinema-text-muted hover:text-gray-300'}`}
                                    >
                                        All Works
                                    </button>
                                    {uniqueCollections.map(col => (
                                        <button
                                            key={col}
                                            onClick={() => setSelectedCollection(col)}
                                            className={`block text-left transition-colors ${selectedCollection === col ? 'text-cinema-gold' : 'text-cinema-text-muted hover:text-gray-300'}`}
                                        >
                                            {col}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {!isGalleryAccount && (
                                <>
                                    <button onClick={() => setCurrentView('about')} className={`block hover:text-gray-200 hover:translate-x-2 transition-all text-left w-full ${currentView === 'about' ? 'text-gray-100 border-l-2 border-cinema-gold pl-3' : 'text-cinema-text-muted'}`}>About</button>
                                    <button onClick={() => setCurrentView('contact')} className={`block hover:text-gray-200 hover:translate-x-2 transition-all text-left w-full ${currentView === 'contact' ? 'text-gray-100 border-l-2 border-cinema-gold pl-3' : 'text-cinema-text-muted'}`}>Contact</button>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="mt-12 md:mt-auto text-cinema-text-muted text-xs">
                        &copy; {new Date().getFullYear()} {profile.full_name} Studio
                    </div>
                </aside>

                {/* Scrollable Gallery */}
                <main className="w-full md:w-[65%] md:ml-[35%] p-8 md:p-[80px_60px]">
                    {renderContent()}
                </main>
            </div>
        </div>
    )
}
