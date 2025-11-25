'use client'

import { useState } from 'react'
import Image from 'next/image'
import { InstagramLogo, Globe, EnvelopeSimple, X, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'

type Profile = {
    full_name: string | null
    avatar_url: string | null
    username: string | null
    email: string | null
}

type SiteSettings = {
    site_title: string | null
    site_bio: string | null
    site_bio_long: string | null
    theme: string | null
    custom_domain: string | null
    contact_email: string | null
    phone: string | null
    address: string | null
    social_instagram: string | null
    social_twitter: string | null
    social_facebook: string | null
}

type Artwork = {
    id: string
    title: string
    medium: string | null
    dimensions: string | null
    price: number | null
    status: string | null
    image_url: string | null
    description: string | null
    collection: string | null
}

export function PortfolioLayout({
    profile,
    settings,
    artworks
}: {
    profile: Profile,
    settings: SiteSettings,
    artworks: Artwork[]
}) {
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
    const [currentView, setCurrentView] = useState<'gallery' | 'about' | 'contact'>('gallery')
    const [selectedCollection, setSelectedCollection] = useState<string>('All')
    const theme = settings.theme || 'minimal'

    // Extract unique collections
    const uniqueCollections = Array.from(new Set(artworks.map(item => item.collection).filter(Boolean))) as string[]

    // Filter artworks
    const filteredArtworks = selectedCollection === 'All'
        ? artworks
        : artworks.filter(item => item.collection === selectedCollection)

    // Helper to render the modal for any theme
    const renderModal = () => (
        selectedArtwork && (
            <DetailModal
                artwork={selectedArtwork}
                onClose={() => setSelectedArtwork(null)}
                settings={settings}
                profile={profile}
                theme={theme}
            />
        )
    )

    if (theme === 'dark') {
        // "The Cinema" Theme - Split Screen
        return (
            <div className="min-h-screen bg-[#121212] text-[#e0e0e0] font-[family-name:var(--font-fauna)] selection:bg-[#c5a059] selection:text-black">
                <div className="flex flex-col md:flex-row min-h-screen">

                    {/* Fixed Sidebar */}
                    <aside className="w-full md:w-[35%] md:h-screen md:fixed left-0 top-0 flex flex-col justify-center p-10 md:p-[60px] border-b md:border-b-0 md:border-r border-[#333] z-10 bg-[#121212]">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-cinzel)] leading-[1.1] mb-5 tracking-widest text-[#e0e0e0] cursor-pointer" onClick={() => setCurrentView('gallery')}>
                                {settings.site_title?.split(' ').map((word, i) => <span key={i} className="block">{word}</span>) || <span className="block">Untitled<br />Artist</span>}
                            </h1>
                            <div className="text-[#c5a059] uppercase tracking-[3px] text-sm mb-12">
                                Collection {new Date().getFullYear()}
                            </div>

                            <nav className="space-y-4 font-[family-name:var(--font-cinzel)] text-lg text-[#888]">
                                <button onClick={() => setCurrentView('gallery')} className={`block hover:text-[#e0e0e0] hover:translate-x-2 transition-all text-left w-full ${currentView === 'gallery' ? 'text-[#e0e0e0] border-l-2 border-[#c5a059] pl-3' : ''}`}>Gallery</button>

                                {/* Collection Sub-nav for Cinema */}
                                {currentView === 'gallery' && uniqueCollections.length > 0 && (
                                    <div className="pl-6 space-y-2 mt-2 mb-4 text-sm font-sans tracking-wider">
                                        <button
                                            onClick={() => setSelectedCollection('All')}
                                            className={`block text-left transition-colors ${selectedCollection === 'All' ? 'text-[#c5a059]' : 'text-[#666] hover:text-[#999]'}`}
                                        >
                                            All Works
                                        </button>
                                        {uniqueCollections.map(col => (
                                            <button
                                                key={col}
                                                onClick={() => setSelectedCollection(col)}
                                                className={`block text-left transition-colors ${selectedCollection === col ? 'text-[#c5a059]' : 'text-[#666] hover:text-[#999]'}`}
                                            >
                                                {col}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <button onClick={() => setCurrentView('about')} className={`block hover:text-[#e0e0e0] hover:translate-x-2 transition-all text-left w-full ${currentView === 'about' ? 'text-[#e0e0e0] border-l-2 border-[#c5a059] pl-3' : ''}`}>Biography</button>
                                <button onClick={() => setCurrentView('contact')} className={`block hover:text-[#e0e0e0] hover:translate-x-2 transition-all text-left w-full ${currentView === 'contact' ? 'text-[#e0e0e0] border-l-2 border-[#c5a059] pl-3' : ''}`}>Contact</button>
                            </nav>
                        </div>

                        <div className="mt-12 md:mt-auto text-[#444] text-xs">
                            &copy; {new Date().getFullYear()} {profile.full_name} Studio
                        </div>
                    </aside>

                    {/* Scrollable Gallery */}
                    <main className="w-full md:w-[65%] md:ml-[35%] p-8 md:p-[80px_60px]">
                        {currentView === 'gallery' && (
                            <div className="columns-1 md:columns-2 gap-10 space-y-10">
                                {filteredArtworks.map((artwork, index) => (
                                    <article
                                        key={artwork.id}
                                        className="break-inside-avoid mb-10 opacity-0 animate-[fadeUp_1s_forwards] cursor-pointer group"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                        onClick={() => setSelectedArtwork(artwork)}
                                    >
                                        <div className="bg-white p-2 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
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
                                        <div className="mt-4 border-b border-[#333] pb-2">
                                            <h2 className="font-[family-name:var(--font-cinzel)] text-xl text-[#e0e0e0] mb-1">{artwork.title}</h2>
                                            <div className="flex justify-between items-baseline text-xs font-serif text-[#888]">
                                                <span>{artwork.medium}</span>
                                                {artwork.status === 'sold' ? (
                                                    <span className="text-[#aa3a3a]">Sold</span>
                                                ) : (
                                                    <span className="text-[#c5a059]">{artwork.price ? `$${artwork.price.toLocaleString()}` : 'Inquire'}</span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                        {currentView === 'about' && <AboutView profile={profile} settings={settings} theme="dark" />}
                        {currentView === 'contact' && <ContactView profile={profile} settings={settings} theme="dark" />}
                    </main>
                </div>
                {renderModal()}
            </div>
        )
    }

    if (theme === 'archive') {
        // "The Archive" Theme - Buffer Blocks
        return (
            <div className="min-h-screen bg-white text-[#111] font-[family-name:var(--font-sans)] selection:bg-black selection:text-white">
                <div className="max-w-[1600px] mx-auto px-10 pb-24">
                    <header className="py-[60px] flex flex-col md:flex-row justify-between items-baseline border-b border-[#eee] mb-[60px]">
                        <div className="font-semibold text-2xl tracking-tight">
                            {settings.site_title || profile.full_name || 'Untitled Artist'}
                        </div>
                        <nav className="flex gap-8 text-[#777] text-sm mt-4 md:mt-0">
                            <button onClick={() => setCurrentView('gallery')} className={`hover:text-black transition-colors ${currentView === 'gallery' ? 'text-black font-semibold' : ''}`}>Work</button>
                            <button onClick={() => setCurrentView('about')} className={`hover:text-black transition-colors ${currentView === 'about' ? 'text-black font-semibold' : ''}`}>About</button>
                            <button onClick={() => setCurrentView('contact')} className={`hover:text-black transition-colors ${currentView === 'contact' ? 'text-black font-semibold' : ''}`}>Contact</button>
                        </nav>
                    </header>

                    {/* Collection Filter for Archive */}
                    {currentView === 'gallery' && uniqueCollections.length > 0 && (
                        <div className="flex flex-wrap gap-4 mb-10 text-sm">
                            <button
                                onClick={() => setSelectedCollection('All')}
                                className={`px-3 py-1 rounded-full border transition-all ${selectedCollection === 'All' ? 'bg-black text-white border-black' : 'bg-white text-[#777] border-[#eee] hover:border-[#ccc]'}`}
                            >
                                All
                            </button>
                            {uniqueCollections.map(col => (
                                <button
                                    key={col}
                                    onClick={() => setSelectedCollection(col)}
                                    className={`px-3 py-1 rounded-full border transition-all ${selectedCollection === col ? 'bg-black text-white border-black' : 'bg-white text-[#777] border-[#eee] hover:border-[#ccc]'}`}
                                >
                                    {col}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentView === 'gallery' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
                            {filteredArtworks.map((artwork) => (
                                <div key={artwork.id} className="group cursor-pointer" onClick={() => setSelectedArtwork(artwork)}>
                                    {/* Buffer Block */}
                                    <div className="w-full aspect-square bg-[#f4f4f4] flex items-center justify-center mb-5 relative transition-colors duration-300 group-hover:bg-[#efefef]">
                                        <div className="relative w-[85%] h-[85%] shadow-lg transition-transform duration-400 group-hover:scale-[1.02] group-hover:shadow-xl">
                                            {artwork.image_url && (
                                                <Image
                                                    src={artwork.image_url}
                                                    alt={artwork.title}
                                                    fill
                                                    className="object-contain"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="pl-1">
                                        <div className="font-semibold text-base mb-1 text-[#111]">{artwork.title}</div>
                                        <div className="text-[#777] text-sm mb-2">{artwork.medium}</div>
                                        <div className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
                                            {artwork.status === 'sold' ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#d9534f]"></span>
                                                    <span className="text-[#999]">Sold</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#5cb85c]"></span>
                                                    <span className="text-[#111]">Available — {artwork.price ? `$${artwork.price.toLocaleString()}` : 'Inquire'}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {currentView === 'about' && <AboutView profile={profile} settings={settings} theme="archive" />}
                    {currentView === 'contact' && <ContactView profile={profile} settings={settings} theme="archive" />}

                    <footer className="mt-24 pt-12 border-t border-[#eee] text-center text-[#777] text-xs">
                        &copy; {new Date().getFullYear()} {profile.full_name}
                    </footer>
                </div>
                {renderModal()}
            </div>
        )
    }

    // Default 'minimal' theme - "The White Cube"
    return (
        <div className="min-h-screen bg-[#fdfdfd] text-[#2a2a2a] font-[family-name:var(--font-montserrat)] selection:bg-[#c5a059] selection:text-white">
            <div className="max-w-[1200px] mx-auto p-5 md:p-10">
                <header className="text-center py-[60px] mb-10">
                    <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-display)] font-normal tracking-[2px] mb-2 uppercase">
                        {settings.site_title || profile.full_name || 'Untitled Artist'}
                    </h1>
                    <div className="text-[#888] text-sm uppercase tracking-[3px]">
                        Fine Art & Illustration
                    </div>

                    <nav className="mt-8 py-4 border-t border-b border-[#eee] flex justify-center gap-8 text-sm uppercase tracking-wider">
                        <button onClick={() => setCurrentView('gallery')} className={`hover:text-[#c5a059] transition-colors ${currentView === 'gallery' ? 'text-[#c5a059]' : ''}`}>Portfolio</button>
                        <button onClick={() => setCurrentView('about')} className={`hover:text-[#c5a059] transition-colors ${currentView === 'about' ? 'text-[#c5a059]' : ''}`}>About</button>
                        <button onClick={() => setCurrentView('contact')} className={`hover:text-[#c5a059] transition-colors ${currentView === 'contact' ? 'text-[#c5a059]' : ''}`}>Contact</button>
                    </nav>

                    {/* Collection Filter for White Cube */}
                    {currentView === 'gallery' && uniqueCollections.length > 0 && (
                        <div className="flex justify-center gap-6 mt-6 text-xs uppercase tracking-widest text-[#999]">
                            <button
                                onClick={() => setSelectedCollection('All')}
                                className={`hover:text-[#2a2a2a] transition-colors ${selectedCollection === 'All' ? 'text-[#2a2a2a] border-b border-[#2a2a2a]' : ''}`}
                            >
                                All
                            </button>
                            {uniqueCollections.map(col => (
                                <button
                                    key={col}
                                    onClick={() => setSelectedCollection(col)}
                                    className={`hover:text-[#2a2a2a] transition-colors ${selectedCollection === col ? 'text-[#2a2a2a] border-b border-[#2a2a2a]' : ''}`}
                                >
                                    {col}
                                </button>
                            ))}
                        </div>
                    )}
                </header>

                {/* Masonry Layout for White Cube */}
                {currentView === 'gallery' && (
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
                                    <p className="text-[#888] text-xs italic mb-2">{artwork.medium}, {artwork.dimensions}</p>
                                    <div className="flex justify-center items-center gap-2 text-xs uppercase tracking-wider">
                                        {artwork.status === 'sold' ? (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-[#c94c4c]"></span>
                                                <span className="text-[#a0a0a0]">Sold</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-semibold text-[#2a2a2a]">Available</span>
                                                <span className="text-[#ccc]">&mdash;</span>
                                                <span className="text-[#c5a059]">{artwork.price ? `$${artwork.price.toLocaleString()}` : 'Inquire'}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {currentView === 'about' && <AboutView profile={profile} settings={settings} theme="minimal" />}
                {currentView === 'contact' && <ContactView profile={profile} settings={settings} theme="minimal" />}

                <footer className="text-center py-12 border-t border-[#eee] text-[#888] text-xs">
                    &copy; {new Date().getFullYear()} {profile.full_name}. All Rights Reserved.
                </footer>
            </div>
            {renderModal()}
        </div>
    )
}

function DetailModal({ artwork, onClose, settings, profile, theme }: { artwork: Artwork, onClose: () => void, settings: SiteSettings, profile: Profile, theme: string }) {

    // Helper for the inquiry button to avoid code duplication
    const InquiryButton = ({ className, iconColor }: { className?: string, iconColor?: string }) => (
        <div className="flex flex-col gap-3 items-start">
            <a
                href={`mailto:${settings.contact_email || profile.email}?subject=Inquiry: ${artwork.title}&body=Hi, I am interested in "${artwork.title}".`}
                onClick={(e) => {
                    const email = settings.contact_email || profile.email
                    if (email) {
                        navigator.clipboard.writeText(email)
                        toast.success('Email copied to clipboard!')
                    }
                }}
                className={className}
            >
                Inquire to Acquire
            </a>
            <div className={`text-[10px] uppercase tracking-wider flex items-center gap-1 ${iconColor || 'text-[#888]'}`}>
                <EnvelopeSimple size={12} />
                {settings.contact_email || profile.email}
            </div>
        </div>
    )

    // CINEMA THEME (Dark, Split Screen)
    if (theme === 'dark') {
        return (
            <div className="fixed inset-0 z-50 bg-[#0a0a0a]/98 backdrop-blur-md flex items-center justify-center animate-[fadeIn_0.3s_ease]">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-4xl text-[#666] hover:text-[#c5a059] transition-colors z-50"
                >
                    <X size={32} />
                </button>

                <div className="w-full h-full flex flex-col md:flex-row">
                    {/* Image Side */}
                    <div className="w-full md:w-2/3 h-[50vh] md:h-full relative bg-black flex items-center justify-center p-8">
                        {artwork.image_url && (
                            <div className="relative w-full h-full">
                                <Image
                                    src={artwork.image_url}
                                    alt={artwork.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </div>

                    {/* Details Side */}
                    <div className="w-full md:w-1/3 h-[50vh] md:h-full bg-[#111] text-[#e0e0e0] p-8 md:p-12 overflow-y-auto flex flex-col justify-center border-l border-[#222]">
                        <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] mb-2 text-[#c5a059]">{artwork.title}</h2>
                        <div className="text-[#888] text-sm italic mb-8 font-serif">
                            {artwork.medium} &mdash; {artwork.dimensions}
                        </div>

                        {artwork.description && (
                            <div
                                className="text-[#ccc] mb-10 leading-relaxed whitespace-pre-wrap [&>p]:mb-4 font-light tracking-wide"
                                dangerouslySetInnerHTML={{ __html: artwork.description }}
                            />
                        )}

                        <div className="mt-auto">
                            {artwork.status === 'available' ? (
                                <InquiryButton
                                    className="inline-block border border-[#c5a059] text-[#c5a059] px-8 py-3 text-sm uppercase tracking-[3px] hover:bg-[#c5a059] hover:text-black transition-all duration-300 cursor-pointer"
                                    iconColor="text-[#666]"
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-[#666] italic border-t border-[#333] pt-4">
                                    <span className="w-2 h-2 rounded-full bg-[#aa3a3a]"></span>
                                    Private Collection
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ARCHIVE THEME (Clean, Structured)
    if (theme === 'archive') {
        return (
            <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-[fadeIn_0.3s_ease]">
                <div className="bg-white w-full max-w-6xl min-h-[600px] shadow-2xl border border-[#eee] relative flex flex-col md:flex-row">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-[#111] hover:text-[#666] z-50 p-2 bg-white/80 rounded-full"
                    >
                        <X size={24} />
                    </button>

                    {/* Image Area */}
                    <div className="w-full md:w-3/5 bg-[#f4f4f4] p-8 md:p-12 flex items-center justify-center relative min-h-[400px]">
                        {artwork.image_url && (
                            <div className="relative w-full h-full shadow-lg">
                                <Image
                                    src={artwork.image_url}
                                    alt={artwork.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </div>

                    {/* Info Area */}
                    <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col bg-white">
                        <div className="mb-8 pb-8 border-b border-[#eee]">
                            <h2 className="text-2xl font-bold text-[#111] mb-2">{artwork.title}</h2>
                            <div className="text-[#555] text-sm font-mono">
                                {artwork.medium}<br />
                                {artwork.dimensions}
                            </div>
                        </div>

                        {artwork.description && (
                            <div
                                className="text-[#333] mb-8 leading-relaxed whitespace-pre-wrap [&>p]:mb-4 text-sm"
                                dangerouslySetInnerHTML={{ __html: artwork.description }}
                            />
                        )}

                        <div className="mt-auto pt-8">
                            {artwork.status === 'available' ? (
                                <InquiryButton
                                    className="block w-full text-center bg-black text-white px-6 py-4 text-sm font-bold uppercase tracking-wide hover:bg-[#333] transition-colors cursor-pointer"
                                />
                            ) : (
                                <div className="bg-[#f9f9f9] p-4 text-center text-[#999] text-sm font-semibold uppercase tracking-wide">
                                    Sold
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // WHITE CUBE / MINIMAL (Default)
    return (
        <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-[fadeIn_0.3s_ease]">
            <button
                onClick={onClose}
                className="absolute top-8 right-8 text-4xl text-[#ddd] hover:text-[#2a2a2a] font-[family-name:var(--font-display)] leading-none transition-colors z-50"
            >
                &times;
            </button>

            <div className="w-full max-w-5xl flex flex-col items-center">
                <div className="relative w-full max-h-[70vh] aspect-[4/3] mb-10 p-2 md:p-4">
                    {artwork.image_url && (
                        <Image
                            src={artwork.image_url}
                            alt={artwork.title}
                            fill
                            className="object-contain drop-shadow-xl"
                        />
                    )}
                </div>

                <div className="text-center max-w-2xl animate-[fadeUp_0.5s_ease-out]">
                    <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-[#2a2a2a] mb-3">{artwork.title}</h2>
                    <div className="text-[#888] text-xs uppercase tracking-[2px] mb-8">
                        {artwork.medium} &bull; {artwork.dimensions}
                    </div>

                    {artwork.description && (
                        <div
                            className="text-[#555] mb-10 leading-relaxed whitespace-pre-wrap [&>p]:mb-4 font-light"
                            dangerouslySetInnerHTML={{ __html: artwork.description }}
                        />
                    )}

                    {artwork.status === 'available' ? (
                        <InquiryButton
                            className="inline-block bg-transparent border border-[#2a2a2a] text-[#2a2a2a] px-10 py-3 text-xs uppercase tracking-[3px] hover:bg-[#2a2a2a] hover:text-white transition-all duration-300 cursor-pointer"
                        />
                    ) : (
                        <span className="text-[#ccc] text-sm uppercase tracking-widest">Private Collection</span>
                    )}
                </div>
            </div>
        </div>
    )
}

function AboutView({ profile, settings, theme }: { profile: Profile, settings: SiteSettings, theme: string }) {
    return (
        <div className="max-w-3xl mx-auto py-12 animate-[fadeIn_0.5s_ease]">
            <div className="flex flex-col md:flex-row gap-12 items-start">
                {profile.avatar_url && (
                    <div className="w-full md:w-1/3 relative aspect-square bg-[#eee]">
                        <Image
                            src={profile.avatar_url}
                            alt={profile.full_name || 'Artist'}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="flex-1">
                    <h2 className={`text-3xl mb-6 ${theme === 'dark' ? 'font-[family-name:var(--font-cinzel)]' : theme === 'archive' ? 'font-sans font-bold' : 'font-[family-name:var(--font-display)]'}`}>
                        About the Artist
                    </h2>
                    {settings.site_bio_long ? (
                        <div
                            className={`whitespace-pre-wrap leading-relaxed ${theme === 'dark' ? 'text-[#aaa]' : 'text-[#444]'} [&>p]:mb-4`}
                            dangerouslySetInnerHTML={{ __html: settings.site_bio_long }}
                        />
                    ) : (
                        <div className={`whitespace-pre-wrap leading-relaxed ${theme === 'dark' ? 'text-[#aaa]' : 'text-[#444]'}`}>
                            {settings.site_bio || "No biography available."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ContactView({ profile, settings, theme }: { profile: Profile, settings: SiteSettings, theme: string }) {
    return (
        <div className="max-w-2xl mx-auto py-12 animate-[fadeIn_0.5s_ease] text-center">
            <h2 className={`text-3xl mb-8 ${theme === 'dark' ? 'font-[family-name:var(--font-cinzel)]' : theme === 'archive' ? 'font-sans font-bold' : 'font-[family-name:var(--font-display)]'}`}>
                Get in Touch
            </h2>

            <div className="space-y-6 mb-12">
                {settings.contact_email && (
                    <div>
                        <div className={`text-xs uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-[#666]' : 'text-[#999]'}`}>Email</div>
                        <a href={`mailto:${settings.contact_email}`} className="text-xl hover:underline">{settings.contact_email}</a>
                    </div>
                )}

                {settings.phone && (
                    <div>
                        <div className={`text-xs uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-[#666]' : 'text-[#999]'}`}>Phone</div>
                        <div className="text-lg">{settings.phone}</div>
                    </div>
                )}

                {settings.address && (
                    <div>
                        <div className={`text-xs uppercase tracking-widest mb-1 ${theme === 'dark' ? 'text-[#666]' : 'text-[#999]'}`}>Studio</div>
                        <div className="text-lg">{settings.address}</div>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-6">
                {settings.social_instagram && (
                    <a href={`https://instagram.com/${settings.social_instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                        <InstagramLogo size={32} />
                    </a>
                )}
                {settings.social_twitter && (
                    <a href={`https://twitter.com/${settings.social_twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                        <span className="text-2xl font-bold">X</span>
                    </a>
                )}
                {settings.social_facebook && (
                    <a href={`https://facebook.com/${settings.social_facebook}`} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                        <Globe size={32} />
                    </a>
                )}
            </div>
        </div>
    )
}
