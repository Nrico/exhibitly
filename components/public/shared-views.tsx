'use client'

import { useState } from 'react'
import Image from 'next/image'
import { InstagramLogo, Globe, EnvelopeSimple, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Artwork } from '@/types'
import { usePortfolio } from '@/components/public/portfolio-context'
import { sendInquiry } from '@/app/actions/inquiry'

export function AboutView() {
    const { profile, settings, theme } = usePortfolio()
    const isGallery = profile.account_type === 'gallery'

    const themeStyles = {
        cinema: {
            text: 'text-gray-200',
            muted: 'text-gray-500',
            border: 'border-cinema-border',
            accent: 'text-cinema-gold',
            button: 'bg-cinema-gold text-black hover:bg-cinema-gold-hover',
            font: 'font-[family-name:var(--font-cinzel)]'
        },
        archive: {
            text: 'text-archive-text',
            muted: 'text-archive-text-muted',
            border: 'border-archive-border',
            accent: 'text-black',
            button: 'bg-black text-white hover:bg-[#333]',
            font: 'font-sans'
        },
        minimal: {
            text: 'text-whitecube-text',
            muted: 'text-whitecube-text-muted',
            border: 'border-whitecube-border',
            accent: 'text-whitecube-accent',
            button: 'bg-whitecube-accent text-white hover:bg-[#b08d4b]',
            font: 'font-[family-name:var(--font-display)]'
        }
    }
    const styles = themeStyles[theme as keyof typeof themeStyles] || themeStyles.minimal

    return (
        <div className="max-w-4xl mx-auto py-16 px-5 animate-[fadeIn_0.5s_ease]">
            <div className="flex flex-col md:flex-row gap-16 items-start">
                {profile.avatar_url && (
                    <div className="w-full md:w-2/5 relative aspect-[3/4] bg-gray-100 shadow-lg">
                        <Image
                            src={profile.avatar_url}
                            alt={profile.full_name || 'Artist'}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="flex-1">
                    <h2 className={`text-4xl mb-8 ${styles.font} ${styles.text} uppercase tracking-wider`}>
                        {isGallery ? 'About the Gallery' : 'About the Artist'}
                    </h2>
                    {settings.site_bio_long ? (
                        <div
                            className={`whitespace-pre-wrap leading-relaxed text-lg ${styles.muted} [&>p]:mb-6 font-light`}
                            dangerouslySetInnerHTML={{ __html: settings.site_bio_long }}
                        />
                    ) : (
                        <div className={`whitespace-pre-wrap leading-relaxed text-lg ${styles.muted} font-light`}>
                            {settings.site_bio || "No biography available."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export function ContactView() {
    const { settings, theme, profile } = usePortfolio()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const themeStyles = {
        cinema: {
            text: 'text-gray-200',
            muted: 'text-gray-500',
            accent: 'text-cinema-gold',
            input: 'bg-[#1a1a1a] border-[#333] text-white focus:border-cinema-gold',
            button: 'bg-cinema-gold text-black hover:bg-cinema-gold-hover',
            font: 'font-[family-name:var(--font-cinzel)]'
        },
        archive: {
            text: 'text-archive-text',
            muted: 'text-archive-text-muted',
            accent: 'text-black',
            input: 'bg-white border-gray-200 text-black focus:border-black',
            button: 'bg-black text-white hover:bg-[#333]',
            font: 'font-sans'
        },
        minimal: {
            text: 'text-whitecube-text',
            muted: 'text-whitecube-text-muted',
            accent: 'text-whitecube-accent',
            input: 'bg-white border-gray-200 text-black focus:border-whitecube-accent',
            button: 'bg-whitecube-accent text-white hover:bg-[#b08d4b]',
            font: 'font-[family-name:var(--font-display)]'
        }
    }
    const styles = themeStyles[theme as keyof typeof themeStyles] || themeStyles.minimal

    const handleContactSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        // Reuse the inquiry action but with a generic subject
        formData.append('artworkTitle', 'General Inquiry')
        formData.append('artistEmail', settings.contact_email || '')

        const result = await sendInquiry(formData)
        setIsSubmitting(false)

        if (result.success) {
            setSubmitStatus('success')
        } else {
            setSubmitStatus('error')
            toast.error(result.error || 'Failed to send message')
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-16 px-5 animate-[fadeIn_0.5s_ease]">
            <h2 className={`text-4xl mb-16 text-center ${styles.font} ${styles.text} uppercase tracking-wider`}>
                Get in Touch
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div className={`space-y-10 ${styles.text}`}>
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 ${styles.muted}`}>Contact Information</h3>
                        <div className="space-y-6">
                            {settings.contact_email && (
                                <div>
                                    <div className={`text-xs uppercase tracking-widest mb-1 ${styles.muted}`}>Email</div>
                                    <a href={`mailto:${settings.contact_email}`} className="text-xl hover:opacity-70 transition-opacity">{settings.contact_email}</a>
                                </div>
                            )}

                            {settings.phone && (
                                <div>
                                    <div className={`text-xs uppercase tracking-widest mb-1 ${styles.muted}`}>Phone</div>
                                    <div className="text-xl">{settings.phone}</div>
                                </div>
                            )}

                            {settings.address && (
                                <div>
                                    <div className={`text-xs uppercase tracking-widest mb-1 ${styles.muted}`}>Studio / Gallery</div>
                                    <div className="text-xl whitespace-pre-wrap">{settings.address}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 ${styles.muted}`}>Social</h3>
                        <div className="flex gap-6">
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
                </div>

                {/* Contact Form */}
                <div>
                    <h3 className={`text-sm font-bold uppercase tracking-widest mb-6 ${styles.muted}`}>Send a Message</h3>

                    {submitStatus === 'success' ? (
                        <div className="bg-green-50 border border-green-100 p-8 rounded-lg text-center">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <EnvelopeSimple size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-green-800 mb-2">Message Sent</h4>
                            <p className="text-green-700">Thank you for contacting us. We will get back to you shortly.</p>
                            <button
                                onClick={() => setSubmitStatus('idle')}
                                className="mt-6 text-sm font-semibold text-green-800 underline hover:text-green-900"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form action={handleContactSubmit} className="space-y-5">
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${styles.muted}`}>Name</label>
                                <input required name="name" type="text" className={`w-full p-4 border rounded-none text-sm outline-none transition-colors ${styles.input}`} placeholder="Your Name" />
                            </div>
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${styles.muted}`}>Email</label>
                                <input required name="email" type="email" className={`w-full p-4 border rounded-none text-sm outline-none transition-colors ${styles.input}`} placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${styles.muted}`}>Message</label>
                                <textarea required name="message" rows={5} className={`w-full p-4 border rounded-none text-sm outline-none transition-colors ${styles.input}`} placeholder="How can we help you?" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 font-bold uppercase tracking-widest text-xs transition-all ${styles.button} disabled:opacity-50`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}



// Helper for the inquiry button
function InquiryButton({ className, onClick }: { className?: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={className}
        >
            Inquire to Acquire
        </button>
    )
}

export function DetailModal({ artwork, onClose }: { artwork: Artwork, onClose: () => void }) {
    const { profile, settings, theme } = usePortfolio()
    const [view, setView] = useState<'details' | 'inquire'>('details')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleInquirySubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        // Append hidden fields
        formData.append('artworkId', artwork.id)
        formData.append('artworkTitle', artwork.title)
        formData.append('artistEmail', settings.contact_email || '')

        const result = await sendInquiry(formData)
        setIsSubmitting(false)

        if (result.success) {
            setSubmitStatus('success')
        } else {
            setSubmitStatus('error')
            toast.error(result.error || 'Failed to send inquiry')
        }
    }

    // INQUIRY FORM VIEW
    if (view === 'inquire') {
        return (
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm overflow-y-auto animate-[fadeIn_0.3s_ease]">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className={`w-full max-w-md bg-white p-8 rounded-xl shadow-2xl relative ${theme === 'dark' ? 'bg-[#1a1a1a] text-[#e0e0e0] border border-[#333]' : ''}`}>
                        <button
                            onClick={() => setView('details')}
                            className="absolute top-4 right-4 text-[#999] hover:text-black transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {submitStatus === 'success' ? (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <EnvelopeSimple size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Inquiry Sent!</h3>
                                <p className="text-[#666] mb-6">The artist has received your message. check your email for a confirmation.</p>
                                <button onClick={onClose} className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium">
                                    Close
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold mb-1">Inquire about &quot;{artwork.title}&quot;</h3>
                                <p className="text-sm text-[#666] mb-6">Send a message directly to the artist.</p>

                                <form action={handleInquirySubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#666]">Your Name</label>
                                        <input required name="name" type="text" className={`w-full p-3 border rounded-md text-sm outline-none focus:border-black transition-colors ${theme === 'dark' ? 'bg-[#333] border-[#444] text-white focus:border-[#c5a059]' : 'border-gray-200'}`} placeholder="Jane Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#666]">Your Email</label>
                                        <input required name="email" type="email" className={`w-full p-3 border rounded-md text-sm outline-none focus:border-black transition-colors ${theme === 'dark' ? 'bg-[#333] border-[#444] text-white focus:border-[#c5a059]' : 'border-gray-200'}`} placeholder="jane@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#666]">Message</label>
                                        <textarea required name="message" rows={4} className={`w-full p-3 border rounded-md text-sm outline-none focus:border-black transition-colors ${theme === 'dark' ? 'bg-[#333] border-[#444] text-white focus:border-[#c5a059]' : 'border-gray-200'}`} defaultValue={`Hi, I am interested in "${artwork.title}". Is it still available?`} />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-3 rounded-md font-bold uppercase tracking-wider text-sm transition-all ${theme === 'dark' ? 'bg-[#c5a059] text-black hover:bg-[#d4b06a]' : 'bg-black text-white hover:bg-[#333]'} disabled:opacity-50`}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }


    // CINEMA THEME (Dark, Split Screen)
    if (theme === 'cinema') {
        return (
            <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex items-center justify-center animate-[fadeIn_0.3s_ease]">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-4xl text-cinema-text-muted hover:text-cinema-gold transition-colors z-50"
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
                    <div className="w-full md:w-1/3 h-[50vh] md:h-full bg-cinema-bg-secondary text-cinema-text p-8 md:p-12 overflow-y-auto flex flex-col justify-center border-l border-cinema-border">
                        <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] mb-2 text-cinema-gold">{artwork.title}</h2>
                        <div className="text-cinema-text-muted text-sm italic mb-8 font-serif">
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
                                profile.subscription_status === 'active' ? (
                                    <InquiryButton
                                        onClick={() => setView('inquire')}
                                        className="inline-block border border-cinema-gold text-cinema-gold px-8 py-3 text-sm uppercase tracking-[3px] hover:bg-cinema-gold hover:text-black transition-all duration-300 cursor-pointer"
                                    />
                                ) : (
                                    <div className="text-cinema-text-muted italic text-sm">
                                        Inquiries available for Pro members only.
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center gap-2 text-cinema-text-muted italic border-t border-cinema-border pt-4">
                                    <span className="w-2 h-2 rounded-full bg-cinema-red"></span>
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
            <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-y-auto animate-[fadeIn_0.3s_ease]">
                <div className="flex min-h-full items-center justify-center p-4 md:p-8">
                    <div className="bg-white w-full max-w-6xl min-h-[600px] shadow-2xl border border-archive-border relative flex flex-col md:flex-row">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-archive-text hover:text-archive-text-muted z-50 p-2 bg-white/80 rounded-full"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Area */}
                        <div className="w-full md:w-3/5 bg-archive-bg-secondary p-8 md:p-12 flex items-center justify-center relative min-h-[400px]">
                            {artwork.image_url && (
                                <div className="relative w-full h-[400px] md:h-full">
                                    <Image
                                        src={artwork.image_url}
                                        alt={artwork.title}
                                        fill
                                        className="object-contain drop-shadow-xl"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Info Area */}
                        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col bg-white">
                            <div className="mb-8 pb-8 border-b border-archive-border">
                                <h2 className="text-2xl font-bold text-archive-text mb-2">{artwork.title}</h2>
                                <div className="text-archive-text-muted text-sm font-mono">
                                    {artwork.medium}<br />
                                    {artwork.dimensions}
                                </div>
                            </div>

                            {artwork.description && (
                                <div
                                    className="text-archive-text mb-8 leading-relaxed whitespace-pre-wrap [&>p]:mb-4 text-sm"
                                    dangerouslySetInnerHTML={{ __html: artwork.description }}
                                />
                            )}

                            <div className="mt-auto pt-8">
                                {artwork.status === 'available' ? (
                                    profile.subscription_status === 'active' ? (
                                        <InquiryButton
                                            onClick={() => setView('inquire')}
                                            className="block w-full text-center bg-black text-white px-6 py-4 text-sm font-bold uppercase tracking-wide hover:bg-[#333] transition-colors cursor-pointer"
                                        />
                                    ) : (
                                        <div className="bg-gray-100 p-4 text-center text-gray-500 text-sm font-medium">
                                            Inquiries available for Pro members only.
                                        </div>
                                    )
                                ) : (
                                    <div className="bg-archive-bg-secondary p-4 text-center text-archive-text-muted text-sm font-semibold uppercase tracking-wide">
                                        Sold
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // WHITE CUBE / MINIMAL (Default)
    return (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-md overflow-y-auto animate-[fadeIn_0.3s_ease]">
            <div className="flex min-h-full items-center justify-center p-4 md:p-8">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-4xl text-whitecube-text-muted hover:text-whitecube-text font-[family-name:var(--font-display)] leading-none transition-colors z-50"
                >
                    &times;
                </button>

                <div className="w-full max-w-5xl flex flex-col items-center">
                    <div className="relative w-full max-h-[60vh] aspect-[4/3] mb-8 p-2 md:p-4">
                        {artwork.image_url && (
                            <Image
                                src={artwork.image_url}
                                alt={artwork.title}
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        )}
                    </div>

                    <div className="text-center max-w-2xl animate-[fadeUp_0.5s_ease-out] bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm">
                        <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-whitecube-text mb-3">{artwork.title}</h2>
                        <div className="text-whitecube-text-muted text-xs uppercase tracking-[2px] mb-8">
                            {artwork.medium} &bull; {artwork.dimensions}
                        </div>

                        {artwork.description && (
                            <div
                                className="text-whitecube-text-muted mb-10 leading-relaxed whitespace-pre-wrap [&>p]:mb-4 font-light"
                                dangerouslySetInnerHTML={{ __html: artwork.description }}
                            />
                        )}

                        {artwork.status === 'available' ? (
                            profile.subscription_status === 'active' ? (
                                <InquiryButton
                                    onClick={() => setView('inquire')}
                                    className="inline-block bg-transparent border border-whitecube-text text-whitecube-text px-10 py-3 text-xs uppercase tracking-[3px] hover:bg-whitecube-accent hover:border-whitecube-accent hover:text-white transition-all duration-300 cursor-pointer"
                                />
                            ) : (
                                <span className="text-whitecube-text-muted text-sm uppercase tracking-widest">Inquiries available for Pro members only</span>
                            )
                        ) : (
                            <span className="text-whitecube-text-muted text-sm uppercase tracking-widest">Private Collection</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
