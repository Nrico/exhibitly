'use client'

import { useState } from 'react'
import Image from 'next/image'
import { InstagramLogo, Globe, EnvelopeSimple, X } from '@phosphor-icons/react'

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
    const theme = settings.theme || 'minimal'

    // Helper to render the modal for any theme
    const renderModal = () => (
        selectedArtwork && (
            <DetailModal
                artwork={selectedArtwork}
                onClose={() => setSelectedArtwork(null)}
                settings={settings}
                profile={profile}
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
                        {currentView === 'gallery' && artworks.map((artwork, index) => (
                            <article
                                key={artwork.id}
                                className="mb-24 opacity-0 animate-[fadeUp_1s_forwards]"
                                style={{ animationDelay: `${index * 0.2}s` }}
                                onClick={() => setSelectedArtwork(artwork)}
                            >
                                <div className="p-4 bg-white shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-500">
                                    <div className="relative aspect-[4/3] w-full">
                                        {artwork.image_url && (
                                            <Image
                                                src={artwork.image_url}
                                                alt={artwork.title}
                                                fill
                                                className="object-cover contrast-[1.05]"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-between items-end border-b border-[#333] pb-4">
                                    <div>
                                        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl mb-1">{artwork.title}</h2>
                                        <p className="text-[#888] text-sm italic">{artwork.medium}, {artwork.dimensions}</p>
                                    </div>
                                    <div className="text-right font-[family-name:var(--font-cinzel)] text-sm">
                                        {artwork.status === 'sold' ? (
                                            <div>
                                                <span className="text-[#555] line-through mr-2">Sold</span>
                                                <span className="inline-block w-2 h-2 rounded-full bg-[#aa3a3a]"></span>
                                            </div>
                                        ) : (
                                            <span className="text-[#c5a059] block mt-1">{artwork.price ? `$${artwork.price.toLocaleString()}` : 'Inquire'}</span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
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

                    {currentView === 'gallery' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
                            {artworks.map((artwork) => (
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
                </header>

                {/* Masonry Layout for White Cube */}
                {currentView === 'gallery' && (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10 mb-24 px-5">
                        {artworks.map((artwork) => (
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

function DetailModal({ artwork, onClose, settings, profile }: { artwork: Artwork, onClose: () => void, settings: SiteSettings, profile: Profile }) {
    return (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-[fadeIn_0.3s_ease]">
            <button
                onClick={onClose}
                className="absolute top-8 right-8 text-4xl text-[#aaa] hover:text-[#2a2a2a] font-[family-name:var(--font-display)] leading-none transition-colors z-50"
            >
                &times;
            </button>

            <div className="w-full max-w-5xl flex flex-col items-center">
                <div className="relative w-full max-h-[70vh] aspect-[4/3] mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white p-2 md:p-4">
                    {artwork.image_url && (
                        <Image
                            src={artwork.image_url}
                            alt={artwork.title}
                            fill
                            className="object-contain"
                        />
                    )}
                </div>

                <div className="text-center max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-[#2a2a2a] mb-2">{artwork.title}</h2>
                    <div className="text-[#888] text-sm mb-6">
                        {artwork.medium} &bull; {artwork.dimensions}
                    </div>

                    {artwork.description && (
                        <div
                            className="text-[#555] mb-8 leading-relaxed whitespace-pre-wrap [&>p]:mb-4"
                            dangerouslySetInnerHTML={{ __html: artwork.description }}
                        />
                    )}

                    {artwork.status === 'available' ? (
                        <a
                            href={`mailto:${settings.contact_email || profile.email}?subject=Inquiry: ${artwork.title}&body=Hi, I am interested in "${artwork.title}".`}
                            className="inline-block bg-black text-white px-8 py-3 text-sm uppercase tracking-widest hover:opacity-80 transition-opacity"
                        >
                            Inquire to Acquire
                        </a>
                    ) : (
                        <span className="text-[#888] italic">This piece is in a private collection.</span>
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
