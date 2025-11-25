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
            <div className="w-[500px] flex-shrink-0 p-[50px_60px] overflow-y-auto bg-[#f8f9fa] border-r border-gray-200">
                <header className="mb-10 flex justify-between items-start">
                    <div>
                        <h1 className="font-serif text-4xl text-[#111111] mb-2">Site Design</h1>
                        <p className="text-[#666666] text-sm max-w-[500px] leading-relaxed">
                            Customize the "container" for your art. Changes are saved automatically to draft, but require publishing to go live.
                        </p>
                    </div>
                </header>

                <form onSubmit={(e) => e.preventDefault()}>

                    {/* Aesthetic Archetype */}
                    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                        <div className="font-semibold text-lg mb-5 flex items-center gap-2.5 text-[#111111]">
                            <PaintBrushBroad size={24} /> Aesthetic Archetype
                        </div>
                        <div className="grid grid-cols-1 gap-4">

                            <div
                                onClick={() => setActiveTheme('white')}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex items-center gap-4 ${activeTheme === 'white'
                                    ? 'border-[#111111] bg-[#fcfcfc]'
                                    : 'border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                <div className="h-12 w-12 border border-gray-100 flex items-center justify-center font-serif text-xl bg-white text-black flex-shrink-0">
                                    Aa
                                </div>
                                <div>
                                    <div className="font-semibold text-sm text-[#111111]">The White Cube</div>
                                    <div className="text-xs text-[#666666]">Classic, Serif, Airy</div>
                                </div>
                            </div>

                            <div
                                onClick={() => setActiveTheme('dark')}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex items-center gap-4 ${activeTheme === 'dark'
                                    ? 'border-[#111111] bg-[#fcfcfc]'
                                    : 'border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                <div className="h-12 w-12 border border-gray-100 flex items-center justify-center font-sans text-xl bg-[#111111] text-white flex-shrink-0">
                                    Aa
                                </div>
                                <div>
                                    <div className="font-semibold text-sm text-[#111111]">The Cinema</div>
                                    <div className="text-xs text-[#666666]">Dark Mode, Immersive</div>
                                </div>
                            </div>

                            <div
                                onClick={() => setActiveTheme('archive')}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex items-center gap-4 ${activeTheme === 'archive'
                                    ? 'border-[#111111] bg-[#fcfcfc]'
                                    : 'border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                <div className="h-12 w-12 border border-black flex items-center justify-center font-mono text-xl bg-[#f4f4f4] text-black flex-shrink-0">
                                    Aa
                                </div>
                                <div>
                                    <div className="font-semibold text-sm text-[#111111]">The Archive</div>
                                    <div className="text-xs text-[#666666]">Raw, Grid, Mono</div>
                                </div>
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
                    </div>

                    {/* Contact & Social */}
                    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                        <div className="font-semibold text-lg mb-5 flex items-center gap-2.5 text-[#111111]">
                            <IdentificationCard size={24} /> Contact & Social
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-4">
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
                        </div>
                        <div className="grid grid-cols-1 gap-4">
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
                        </div>
                    </div>

                    <div className="h-[100px]"></div>
                </form>

                {/* Save Bar */}
                <div className="sticky bottom-0 bg-white p-[20px_60px] border-t border-gray-200 flex justify-between items-center -mx-[60px] -mb-[50px]">
                    <a
                        href={`/${username}?preview=${activeTheme}`}
                        target="_blank"
                        className="flex items-center gap-2 text-sm font-medium text-[#111111] hover:text-[#666] transition-colors"
                    >
                        Preview Full Site <ArrowSquareOut size={16} />
                    </a>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#111111] text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Publishing...' : 'Publish Changes'}
                    </button>
                </div>
            </div>

            {/* --- RIGHT COLUMN: PREVIEW --- */}
            <div className="flex-1 bg-[#e5e5e5] p-10 flex flex-col items-center justify-center relative overflow-hidden">

                <div className="bg-white/80 p-1.5 rounded-[20px] flex gap-1.5 mb-5 backdrop-blur-sm shadow-sm absolute top-10 z-20">
                    <button
                        onClick={() => setDeviceView('mobile')}
                        className={`p-2 rounded-[15px] border-none cursor-pointer transition-all ${deviceView === 'mobile' ? 'bg-white text-[#111] shadow-sm' : 'bg-transparent text-[#666]'
                            }`}
                        title="Mobile View"
                    >
                        <DeviceMobile size={20} />
                    </button>
                    <button
                        onClick={() => setDeviceView('desktop')}
                        className={`p-2 rounded-[15px] border-none cursor-pointer transition-all ${deviceView === 'desktop' ? 'bg-white text-[#111] shadow-sm' : 'bg-transparent text-[#666]'
                            }`}
                        title="Desktop View"
                    >
                        <Monitor size={20} />
                    </button>
                </div>

                <div className={`transition-all duration-500 ease-in-out relative bg-white overflow-hidden ${deviceView === 'mobile'
                        ? 'w-[375px] h-[812px] rounded-[40px] border-[12px] border-[#111] shadow-[0_30px_80px_rgba(0,0,0,0.2)]'
                        : 'w-full h-full rounded-md border border-gray-200 shadow-xl'
                    }`}>
                    {deviceView === 'mobile' && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-[#111] rounded-b-[15px] z-10 pointer-events-none"></div>
                    )}

                    <iframe
                        key={activeTheme}
                        src={`/${username}?preview=${activeTheme}`}
                        className="w-full h-full border-none"
                        title="Site Preview"
                    />
                </div>

                <div className="mt-5 text-xs text-[#888888] absolute bottom-4">
                    Live Preview: {deviceView === 'mobile' ? 'Mobile' : 'Desktop'}
                </div>
            </div>

        </div>
    )
}
