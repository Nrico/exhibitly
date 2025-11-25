'use client'

import { UserCircle, CreditCard, MapPin, Warning, ArrowSquareOut, FileCsv } from '@phosphor-icons/react'
import Image from 'next/image'
import { updateProfile, updateSiteSettings } from './actions'
import { useState, useRef } from 'react'
import { processImage } from '@/utils/image-processing'
import { exportSiteData } from '@/utils/site-export'
import { DownloadSimple } from '@phosphor-icons/react'

type Profile = {
    full_name: string | null
    email: string
    avatar_url: string | null
    subscription_status?: string | null
}

type SiteSettings = {
    site_title: string | null
    site_bio: string | null
    custom_domain: string | null
}

export function SettingsForm({
    initialProfile,
    initialSettings,
    artworks = []
}: {
    initialProfile: Profile,
    initialSettings: SiteSettings,
    artworks?: any[]
}) {
    const [isSaving, setIsSaving] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isCsvExporting, setIsCsvExporting] = useState(false)
    const [isLoadingCheckout, setIsLoadingCheckout] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialProfile.avatar_url)
    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                // Process image immediately
                const processedFile = await processImage(file)
                const url = URL.createObjectURL(processedFile)
                setPreviewUrl(url)
                setPendingFile(processedFile)
            } catch (error) {
                console.error('Error processing image:', error)
                alert('Error processing image. Please try another file.')
            }
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setIsSaving(true)

        // Update Profile
        if (pendingFile) {
            formData.set('avatar', pendingFile)
        }
        await updateProfile(formData)

        // Update Site Settings - Moved to Design Tab
        // await updateSiteSettings(formData)

        setIsSaving(false)
        alert('Settings saved successfully!')
    }

    const handleExport = async () => {
        setIsExporting(true)
        try {
            await exportSiteData()
            alert('Export started! Your download will begin shortly.')
        } catch (error) {
            console.error('Export failed:', error)
            alert('Export failed. Please try again.')
        } finally {
            setIsExporting(false)
        }
    }

    const handleCsvExport = () => {
        setIsCsvExporting(true)

        // Define headers
        const headers = ['id', 'title', 'medium', 'dimensions', 'price', 'status', 'collection', 'created_at']

        // Convert to CSV string
        const csvContent = [
            headers.join(','),
            ...artworks.map(item => headers.map(header => {
                const val = item[header] || ''
                // Escape quotes and wrap in quotes if needed
                return `"${String(val).replace(/"/g, '""')}"`
            }).join(','))
        ].join('\n')

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setTimeout(() => setIsCsvExporting(false), 1000)
    }

    const handleUpgrade = async () => {
        setIsLoadingCheckout(true)
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
            })
            const data = await response.json()

            if (data.url) {
                window.location.href = data.url
            } else {
                alert('Error starting checkout')
            }
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Error starting checkout')
        } finally {
            setIsLoadingCheckout(false)
        }
    }

    const isPro = initialProfile.subscription_status === 'active'

    return (
        <div className="max-w-[1200px] mx-auto">
            <header className="mb-10 border-b border-gray-200 pb-5">
                <h1 className="font-serif text-4xl text-[#111111] mb-2">Account Settings</h1>
                <p className="text-[#666666] text-sm">Manage your profile, billing preferences, and gallery details.</p>
            </header>

            <form action={handleSubmit}>

                {/* Personal Profile */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <div className="font-semibold text-lg flex items-center gap-2.5 text-[#111111]">
                                <UserCircle size={24} /> Personal Profile
                            </div>
                            <div className="text-sm text-[#666666] mt-1">This information is used for your account login and support.</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 mb-5">
                        <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200">
                            <Image
                                src={previewUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200"}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white border border-gray-200 px-4 py-2 rounded-md text-sm text-[#111111] hover:border-gray-400 transition-colors"
                            >
                                Change Photo
                            </button>
                            <input
                                type="file"
                                name="avatar"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />
                            <div className="text-xs text-[#999999] mt-1.5">JPG or PNG. Max 2MB.</div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium mb-2 text-[#333333]">Full Name</label>
                        <input
                            name="full_name"
                            type="text"
                            defaultValue={initialProfile.full_name || ''}
                            className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#333333]">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            defaultValue={initialProfile.email || ''}
                            readOnly
                            className="w-full p-3 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Site Settings (Moved to Design) */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="font-semibold text-lg flex items-center gap-2.5 text-[#111111]">
                                <MapPin size={24} /> Artist Identity & Site Design
                            </div>
                            <div className="text-sm text-[#666666] mt-1">
                                Manage your public portfolio appearance, bio, and contact info in the Site Design tab.
                            </div>
                        </div>
                        <a href="/dashboard/design" className="bg-white border border-gray-200 px-4 py-2 rounded-md text-sm text-[#111111] hover:border-gray-400 transition-colors flex items-center gap-2 no-underline">
                            Go to Site Design <ArrowSquareOut size={16} />
                        </a>
                    </div>
                </div>

                {/* Subscription */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <div className="font-semibold text-lg flex items-center gap-2.5 text-[#111111]">
                                <CreditCard size={24} /> Subscription
                            </div>
                            <div className="text-sm text-[#666666] mt-1">Manage your plan tier and payment methods.</div>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-xs uppercase tracking-wider font-medium ${isPro ? 'bg-[#111111] text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {isPro ? 'Professional Plan' : 'Free Plan'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-5 bg-[#f9fafb] rounded-md border border-gray-200">
                        <div>
                            <div className="font-semibold text-sm text-[#111111]">{isPro ? '$12.00 / month' : '$0.00 / month'}</div>
                            <div className="text-xs text-[#666666] mt-0.5">{isPro ? 'Next invoice: December 20, 2025' : 'Upgrade to remove limits.'}</div>
                        </div>
                        {isPro ? (
                            <a href="#" className="bg-white border border-gray-200 px-4 py-2 rounded-md text-sm text-[#111111] hover:border-gray-400 transition-colors flex items-center gap-2 no-underline">
                                Manage Billing on Stripe <ArrowSquareOut size={16} />
                            </a>
                        ) : (
                            <button
                                type="button"
                                onClick={handleUpgrade}
                                disabled={isLoadingCheckout}
                                className="bg-[#111111] text-white px-4 py-2 rounded-md text-sm hover:bg-[#333] transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isLoadingCheckout ? 'Loading...' : 'Upgrade to Pro'} <ArrowSquareOut size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Data Portability */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="font-semibold text-lg flex items-center gap-2.5 text-[#111111]">
                                <DownloadSimple size={24} /> Data Portability
                            </div>
                            <div className="text-sm text-[#666666] mt-1">
                                Download a ZIP file containing your site as static HTML and all your artwork images.
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleCsvExport}
                                disabled={isCsvExporting || artworks.length === 0}
                                className="bg-white border border-gray-200 px-4 py-2 rounded-md text-sm text-[#111111] hover:border-gray-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isCsvExporting ? 'Generating...' : 'Export Inventory CSV'} <FileCsv size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={handleExport}
                                disabled={isExporting}
                                className="bg-white border border-gray-200 px-4 py-2 rounded-md text-sm text-[#111111] hover:border-gray-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isExporting ? 'Exporting...' : 'Export Full Site'} <DownloadSimple size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white border border-red-200 rounded-lg p-8 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="font-semibold text-lg flex items-center gap-2.5 text-red-700">
                                <Warning size={24} /> Danger Zone
                            </div>
                            <div className="text-sm text-[#666666] mt-1">
                                Once you delete your account, there is no going back. Please be certain.
                            </div>
                        </div>
                        <button type="button" className="bg-white border border-red-700 text-red-700 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-red-50 transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>

                <div className="flex justify-end mt-5">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-[#111111] text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-[#333333] transition-colors border-none cursor-pointer disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

            </form>
        </div>
    )
}
