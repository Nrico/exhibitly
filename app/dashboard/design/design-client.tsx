'use client'

import { useState } from 'react'
import {
    PaintBrushBroad,
    IdentificationCard,
    Globe,
    DeviceMobile,
    Monitor,
    ArrowSquareOut
} from '@phosphor-icons/react'
import Image from 'next/image'
import { saveSiteSettings } from './actions'
import Link from 'next/link'

type Theme = 'white' | 'dark' | 'archive'

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
    image_url: string | null
}

export default function DesignClient({ initialSettings, username, artworks }: { initialSettings: SiteSettings, username: string, artworks: Artwork[] }) {
    const [activeTheme, setActiveTheme] = useState<Theme>((initialSettings.theme as Theme) || 'white')
    const [siteTitle, setSiteTitle] = useState(initialSettings.site_title || 'Enrico Trujillo')
    const [siteBio, setSiteBio] = useState(initialSettings.site_bio || 'Fine Art & Digital Fabrication based in Taos, NM. Exploring the intersection of traditional saint carving and modern manufacturing.')
    const [siteBioLong, setSiteBioLong] = useState(initialSettings.site_bio_long || '')
    const [customDomain, setCustomDomain] = useState(initialSettings.custom_domain || '')
    const [contactEmail, setContactEmail] = useState(initialSettings.contact_email || '')
    const [phone, setPhone] = useState(initialSettings.phone || '')
    const [address, setAddress] = useState(initialSettings.address || '')
    const [socialInstagram, setSocialInstagram] = useState(initialSettings.social_instagram || '')
    const [socialTwitter, setSocialTwitter] = useState(initialSettings.social_twitter || '')
    const [socialFacebook, setSocialFacebook] = useState(initialSettings.social_facebook || '')
    const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile')
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        const formData = new FormData()
        formData.append('site_title', siteTitle)
        formData.append('site_title', siteTitle)
        formData.append('site_bio', siteBio)
        formData.append('site_bio_long', siteBioLong)
        formData.append('theme', activeTheme)
        formData.append('custom_domain', customDomain)
        formData.append('contact_email', contactEmail)
        formData.append('phone', phone)
        formData.append('address', address)
        formData.append('social_instagram', socialInstagram)
        formData.append('social_twitter', socialTwitter)
        formData.append('social_facebook', socialFacebook)

        const result = await saveSiteSettings(formData)
        setIsSaving(false)

        if (result?.error) {
            alert(`Error saving settings: ${result.error}`)
        } else {
            alert('Settings saved successfully!')
        }
    }

    return (
        <div className="flex h-[calc(100vh-60px)] overflow-hidden -m-[50px_60px]"> {/* Negative margin to break out of dashboard padding */}

            {/* --- LEFT COLUMN: CONTROLS --- */}
            <div className="flex-1 p-[50px_60px] overflow-y-auto bg-[#f8f9fa]">
                <header className="mb-10 flex justify-between items-start">
                    <div>
                        <h1 className="font-serif text-4xl text-[#111111] mb-2">Site Design</h1>
                        <p className="text-[#666666] text-sm max-w-[500px] leading-relaxed">
                            Customize the "container" for your art. Changes are saved automatically to draft, but require publishing to go live.
                        </p>
                    </div>
                    <div className="flex items-center">
                        <Link
                            href={`/${username}`}
                            target="_blank"
                            className="flex items-center gap-2 text-sm font-medium text-[#111111] hover:text-[#666] transition-colors border border-gray-200 bg-white px-4 py-2 rounded-md"
                        >
                            View Live Site <ArrowSquareOut size={16} />
                        </Link>
                    </div>
                </header>

                <form onSubmit={(e) => e.preventDefault()}>

                    {/* Aesthetic Archetype */}
                    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                        <div className="font-semibold text-lg mb-5 flex items-center gap-2.5 text-[#111111]">
                            <PaintBrushBroad size={24} /> Aesthetic Archetype
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div
                                onClick={() => setActiveTheme('white')}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all text-center ${activeTheme === 'white'
                                    ? 'border-[#111111] bg-[#fcfcfc]'
                                    : 'border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                <div className="h-20 mb-4 border border-gray-100 flex items-center justify-center font-serif text-2xl bg-white text-black">
                                    Aa
                                </div>
                                <div className="font-semibold text-sm text-[#111111]">The White Cube</div>
                                <div className="text-xs text-[#666666] mt-1">Classic, Serif, Airy</div>
                            </div>

                            <div
                                onClick={() => setActiveTheme('dark')}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all text-center ${activeTheme === 'dark'
                                    ? 'border-[#111111] bg-[#fcfcfc]'
                                    : 'border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                <div className="h-20 mb-4 border border-gray-100 flex items-center justify-center font-sans text-2xl bg-[#111111] text-white">
                                    Aa
                                </div>
                                <div className="font-semibold text-sm text-[#111111]">The Cinema</div>
                                <div className="text-xs text-[#666666] mt-1">Dark Mode, Immersive</div>
                            </div>

                            <div
                                onClick={() => setActiveTheme('archive')}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all text-center ${activeTheme === 'archive'
                                    ? 'border-[#111111] bg-[#fcfcfc]'
                                    : 'border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                <div className="h-20 mb-4 border border-black flex items-center justify-center font-mono text-2xl bg-[#f4f4f4] text-black">
                                    Aa
                                </div>
                                <div className="font-semibold text-sm text-[#111111]">The Archive</div>
                                <div className="text-xs text-[#666666] mt-1">Raw, Grid, Mono</div>
                            </div>

                        </div>
                    </div>

                    {/* Identity */}
                    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                        <div className="font-semibold text-lg mb-5 flex items-center gap-2.5 text-[#111111]">
                            <IdentificationCard size={24} /> Identity
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2 text-[#333333]">Site Title</label>
                            <input
                                type="text"
                                value={siteTitle}
                                onChange={(e) => setSiteTitle(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#333333]">Artist Bio (Short)</label>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors min-h-[100px]"
                                value={siteBio}
                                onChange={(e) => setSiteBio(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#333333]">Artist Bio (Long)</label>
                            <div className="text-xs text-[#666] mb-2">Appears on the "About" page. Supports HTML.</div>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors min-h-[200px] font-mono"
                                value={siteBioLong}
                                onChange={(e) => setSiteBioLong(e.target.value)}
                                placeholder="<p>Write your detailed biography here...</p>"
                            />
                        </div>
                    </div>

                    {/* Contact & Social */}
                    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                        <div className="font-semibold text-lg mb-5 flex items-center gap-2.5 text-[#111111]">
                            <IdentificationCard size={24} /> Contact & Social
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#333333]">Contact Email</label>
                                <input
                                    type="email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors"
                                    placeholder="hello@artist.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#333333]">Phone (Optional)</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-[#333333]">Mailing Address (Optional)</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors"
                                placeholder="123 Art St, City, Country"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#333333]">Instagram</label>
                                <input
                                    type="text"
                                    value={socialInstagram}
                                    onChange={(e) => setSocialInstagram(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors"
                                    placeholder="@username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#333333]">Twitter / X</label>
                                <input
                                    type="text"
                                    value={socialTwitter}
                                    onChange={(e) => setSocialTwitter(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors"
                                    placeholder="@username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#333333]">Facebook</label>
                                <input
                                    type="text"
                                    value={socialFacebook}
                                    onChange={(e) => setSocialFacebook(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors"
                                    placeholder="username"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Custom Domain */}
                    <div className="bg-white border border-[#c5a059] rounded-lg p-8 mb-8 relative overflow-hidden">
                        <div className="font-semibold text-lg mb-5 flex items-center gap-2.5 text-[#111111]">
                            <Globe size={24} /> Custom Domain
                            <span className="text-[10px] bg-[#c5a059] text-white px-1.5 py-0.5 rounded ml-auto font-bold tracking-wider">PRO</span>
                        </div>

                        <div className="bg-[#f8f9fa] p-5 rounded-md border border-dashed border-[#ccc]">
                            <div className="flex gap-2.5 mb-2.5">
                                <input
                                    type="text"
                                    value={customDomain}
                                    onChange={(e) => setCustomDomain(e.target.value)}
                                    placeholder="yourdomain.com"
                                    className="w-full p-3 border border-gray-200 rounded-md text-sm bg-white"
                                />
                                <button className="bg-[#333] text-white px-5 rounded-md text-sm font-medium hover:bg-black transition-colors">
                                    Verify
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-xs mt-2.5">
                                <span className="w-2 h-2 rounded-full bg-[#2e7d32]"></span>
                                <span className="text-[#2e7d32] font-medium">Active & Secured (SSL)</span>
                            </div>

                            <div className="mt-4 text-xs text-[#666666]">
                                <strong>DNS Instructions:</strong> Login to your registrar (e.g. GoDaddy) and create a CNAME record pointing <code>www</code> to <code>cname.exhibitly.co</code>.
                            </div>
                        </div>
                    </div>

                    <div className="h-[100px]"></div>
                </form>

                {/* Save Bar */}
                <div className="sticky bottom-0 bg-white p-[20px_60px] border-t border-gray-200 flex justify-end gap-4 -mx-[60px] -mb-[50px]">
                    <button className="bg-transparent border-none text-[#666666] text-sm cursor-pointer hover:text-[#111111]">Discard</button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#111111] text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Publish Changes'}
                    </button>
                </div>
            </div>

            {/* --- RIGHT COLUMN: PREVIEW --- */}
            <div className="w-[420px] bg-[#e5e5e5] border-l border-[#ccc] p-10 flex flex-col items-center justify-center relative">

                <div className="bg-white/80 p-1.5 rounded-[20px] flex gap-1.5 mb-5 backdrop-blur-sm">
                    <button
                        onClick={() => setDeviceView('mobile')}
                        className={`p-2 rounded-[15px] border-none cursor-pointer transition-all ${deviceView === 'mobile' ? 'bg-white text-[#111] shadow-sm' : 'bg-transparent text-[#666]'
                            }`}
                    >
                        <DeviceMobile size={20} />
                    </button>
                    <button
                        onClick={() => setDeviceView('desktop')}
                        className={`p-2 rounded-[15px] border-none cursor-pointer transition-all ${deviceView === 'desktop' ? 'bg-white text-[#111] shadow-sm' : 'bg-transparent text-[#666]'
                            }`}
                    >
                        <Monitor size={20} />
                    </button>
                </div>

                <div className="w-[375px] h-[812px] bg-white rounded-[40px] border-[12px] border-[#111] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.2)] relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-[#111] rounded-b-[15px] z-10"></div>

                    {/* MOCK SITE CONTENT */}
                    <div
                        className={`h-full overflow-y-auto p-5 transition-colors duration-300
              ${activeTheme === 'white' ? 'bg-white text-[#111111]' : ''}
              ${activeTheme === 'dark' ? 'bg-[#1a1a1a] text-white' : ''}
              ${activeTheme === 'archive' ? 'bg-[#f0f0f0] text-black' : ''}
            `}
                    >
                        <div className="text-center mt-8 mb-8">
                            <div
                                className={`text-2xl mb-2
                  ${activeTheme === 'white' ? 'font-serif' : ''}
                  ${activeTheme === 'dark' ? 'font-sans' : ''}
                  ${activeTheme === 'archive' ? 'font-mono' : ''}
                `}
                            >
                                {siteTitle}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest opacity-60">
                                Portfolio &nbsp; About &nbsp; Contact
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                            {artworks.length > 0 ? (
                                artworks.map((artwork) => (
                                    <div key={artwork.id}>
                                        <div className="relative aspect-square w-full bg-[#eee] mb-1.5">
                                            {artwork.image_url ? (
                                                <Image src={artwork.image_url} alt={artwork.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                            )}
                                        </div>
                                        <div className={`text-xs ${activeTheme === 'archive' ? 'font-mono' : 'font-sans'}`}>
                                            {artwork.title}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Fallback if no artworks
                                [
                                    { src: 'https://images.unsplash.com/photo-1579783902614-a3fb39279cdb?q=80&w=400', title: 'Example Artwork 1' },
                                    { src: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400', title: 'Example Artwork 2' }
                                ].map((img, i) => (
                                    <div key={i}>
                                        <div className="relative aspect-square w-full bg-[#eee] mb-1.5">
                                            <Image src={img.src} alt={img.title} fill className="object-cover grayscale opacity-50" />
                                        </div>
                                        <div className={`text-xs ${activeTheme === 'archive' ? 'font-mono' : 'font-sans'} text-gray-400`}>
                                            {img.title} (Placeholder)
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="text-center mt-10 text-[10px] opacity-40">
                            Powered by Exhibitly
                        </div>
                    </div>

                </div>
                <div className="mt-5 text-xs text-[#888888]">
                    Live Preview: Mobile View
                </div>
            </div>

        </div>
    )
}
