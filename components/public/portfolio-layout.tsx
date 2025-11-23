'use client'

import Image from 'next/image'
import { InstagramLogo, Globe, EnvelopeSimple } from '@phosphor-icons/react'

type Profile = {
    full_name: string | null
    avatar_url: string | null
    username: string | null
    email: string | null
}

type SiteSettings = {
    site_title: string | null
    site_bio: string | null
    theme: string | null
    custom_domain: string | null
    contact_email: string | null
}

type Artwork = {
    id: string
    title: string
    medium: string | null
    dimensions: string | null
    price: number | null
    status: string | null
    image_url: string | null
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
    const theme = settings.theme || 'minimal'

    if (theme === 'dark') {
        return (
            <div className="min-h-screen bg-[#111111] text-white font-sans selection:bg-white selection:text-black">
                <div className="max-w-[1600px] mx-auto p-5 md:p-10">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                                {settings.site_title || profile.full_name || 'Untitled Artist'}
                            </h1>
                            <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                                {settings.site_bio || 'No bio available.'}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-2 rounded-full border border-gray-800 hover:bg-white hover:text-black transition-colors">
                                <InstagramLogo size={24} />
                            </button>
                            <button className="p-2 rounded-full border border-gray-800 hover:bg-white hover:text-black transition-colors">
                                <Globe size={24} />
                            </button>
                            <button className="p-2 rounded-full border border-gray-800 hover:bg-white hover:text-black transition-colors">
                                <EnvelopeSimple size={24} />
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {artworks.map((artwork) => (
                            <div key={artwork.id} className="group cursor-pointer">
                                <div className="relative aspect-[4/5] bg-gray-900 mb-4 overflow-hidden">
                                    {artwork.image_url && (
                                        <Image
                                            src={artwork.image_url}
                                            alt={artwork.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        />
                                    )}
                                    {artwork.status === 'sold' && (
                                        <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-2 py-1 uppercase tracking-wider">
                                            Sold
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-1">{artwork.title}</h3>
                                    <div className="text-gray-500 text-sm flex justify-between">
                                        <span>{artwork.medium}</span>
                                        <span>{artwork.price ? `$${artwork.price}` : 'Inquire'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <footer className="border-t border-gray-900 pt-10 text-center text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} {profile.full_name}. Powered by Exhibitly.
                    </footer>
                </div>
            </div>
        )
    }

    if (theme === 'archive') {
        return (
            <div className="min-h-screen bg-[#f4f4f4] text-black font-mono selection:bg-black selection:text-white">
                <div className="p-4 md:p-8">
                    <header className="mb-12 border-b border-black pb-4 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter">
                                {settings.site_title || profile.full_name || 'Untitled Artist'}
                            </h1>
                            <p className="text-xs max-w-md mt-2 leading-relaxed">
                                {settings.site_bio || 'No bio available.'}
                            </p>
                        </div>
                        <div className="flex gap-4 text-xs">
                            <a href="#" className="hover:underline">[IG]</a>
                            <a href="#" className="hover:underline">[WEB]</a>
                            <a href="#" className="hover:underline">[MAIL]</a>
                        </div>
                    </header>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                        {artworks.map((artwork) => (
                            <div key={artwork.id} className="group cursor-pointer">
                                <div className="relative aspect-square bg-gray-200 mb-2 border border-black overflow-hidden">
                                    {artwork.image_url && (
                                        <Image
                                            src={artwork.image_url}
                                            alt={artwork.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                        />
                                    )}
                                </div>
                                <div className="text-[10px] leading-tight border-t border-black pt-1">
                                    <div className="font-bold truncate">{artwork.title}</div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>{artwork.medium}</span>
                                        <span>{artwork.price ? `$${artwork.price}` : 'NFS'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <footer className="border-t border-black pt-4 text-[10px] uppercase flex justify-between">
                        <div>Index: {new Date().getFullYear()}</div>
                        <div>Powered by Exhibitly</div>
                    </footer>
                </div>
            </div>
        )
    }

    // Default 'minimal' theme
    return (
        <div className="min-h-screen bg-white text-[#111] font-serif selection:bg-[#111] selection:text-white">
            <div className="max-w-[1200px] mx-auto p-8 md:p-16">
                <header className="text-center mb-24">
                    <h1 className="text-4xl md:text-5xl mb-6 tracking-tight">
                        {settings.site_title || profile.full_name || 'Untitled Artist'}
                    </h1>
                    <div className="w-12 h-0.5 bg-[#111] mx-auto mb-8"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-sans">
                        {settings.site_bio || 'No bio available.'}
                    </p>

                    <div className="flex justify-center gap-6 mt-8">
                        <a href="#" className="text-gray-400 hover:text-black transition-colors"><InstagramLogo size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-black transition-colors"><Globe size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-black transition-colors"><EnvelopeSimple size={20} /></a>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 mb-24">
                    {artworks.map((artwork) => (
                        <div key={artwork.id} className="group cursor-pointer">
                            <div className="relative aspect-square bg-gray-50 mb-6 overflow-hidden">
                                {artwork.image_url && (
                                    <Image
                                        src={artwork.image_url}
                                        alt={artwork.title}
                                        fill
                                        className="object-cover transition-all duration-500 group-hover:grayscale-0 grayscale"
                                    />
                                )}
                                {artwork.status === 'sold' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="font-sans text-sm tracking-widest uppercase border border-black px-4 py-2">Sold</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-center font-sans">
                                <h3 className="text-base font-medium text-black mb-1">{artwork.title}</h3>
                                <div className="text-gray-500 text-xs uppercase tracking-wide">
                                    {artwork.medium} &bull; {artwork.dimensions}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="max-w-xl mx-auto mb-24">
                    <h2 className="text-2xl font-serif text-center mb-8">Contact the Artist</h2>
                    <form action={async (formData) => {
                        const result = await import('@/app/contact/actions').then(mod => mod.sendContactEmail(formData));
                        if (result.success) {
                            alert('Message sent!');
                        } else {
                            alert('Error sending message: ' + result.error);
                        }
                    }} className="space-y-4">
                        <input type="hidden" name="artistEmail" value={settings.contact_email || profile.email || ''} />
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Name</label>
                            <input name="name" type="text" required className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
                            <input name="email" type="email" required className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Message</label>
                            <textarea name="message" required rows={4} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent resize-none"></textarea>
                        </div>
                        <div className="text-center pt-4">
                            <button type="submit" className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>

                <footer className="text-center text-gray-400 text-xs font-sans uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} {profile.full_name}
                </footer>
            </div>
        </div>
    )
}
