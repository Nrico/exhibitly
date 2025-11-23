'use client'

import { UserCircle, CreditCard, MapPin, Warning, ArrowSquareOut } from '@phosphor-icons/react'
import Image from 'next/image'
import { updateProfile, updateSiteSettings } from './actions'
import { useState } from 'react'

type Profile = {
    full_name: string | null
    email: string
    avatar_url: string | null
}

type SiteSettings = {
    site_title: string | null
    site_bio: string | null
    custom_domain: string | null
}

export function SettingsForm({
    initialProfile,
    initialSettings
}: {
    initialProfile: Profile,
    initialSettings: SiteSettings
}) {
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsSaving(true)

        // Update Profile
        await updateProfile(formData)

        // Update Site Settings
        await updateSiteSettings(formData)

        setIsSaving(false)
        alert('Settings saved successfully!')
    }

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
                        <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden relative">
                            <Image
                                src={initialProfile.avatar_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200"}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <button type="button" className="bg-white border border-gray-200 px-4 py-2 rounded-md text-sm text-[#111111] hover:border-gray-400 transition-colors">
                                Change Photo
                            </button>
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

                {/* Site Settings (Merged into Settings for simplicity in this MVP) */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <div className="font-semibold text-lg flex items-center gap-2.5 text-[#111111]">
                                <MapPin size={24} /> Site Details
                            </div>
                            <div className="text-sm text-[#666666] mt-1">
                                Basic information for your public portfolio.
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium mb-2 text-[#333333]">Site Title</label>
                        <input
                            name="site_title"
                            type="text"
                            defaultValue={initialSettings.site_title || ''}
                            placeholder="e.g. Enrico Trujillo Art"
                            className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium mb-2 text-[#333333]">Artist Bio (Short)</label>
                        <textarea
                            name="site_bio"
                            defaultValue={initialSettings.site_bio || ''}
                            className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors min-h-[100px]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[#333333]">Custom Domain</label>
                        <input
                            name="custom_domain"
                            type="text"
                            defaultValue={initialSettings.custom_domain || ''}
                            placeholder="e.g. enricotrujillo.com"
                            className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111] transition-colors"
                        />
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
                        <span className="bg-[#111111] text-white px-2.5 py-1 rounded text-xs uppercase tracking-wider font-medium">
                            Professional Plan
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-5 bg-[#f9fafb] rounded-md border border-gray-200">
                        <div>
                            <div className="font-semibold text-sm text-[#111111]">$12.00 / month</div>
                            <div className="text-xs text-[#666666] mt-0.5">Next invoice: December 20, 2025</div>
                        </div>
                        <a href="#" className="bg-white border border-gray-200 px-4 py-2 rounded-md text-sm text-[#111111] hover:border-gray-400 transition-colors flex items-center gap-2 no-underline">
                            Manage Billing on Stripe <ArrowSquareOut size={16} />
                        </a>
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
