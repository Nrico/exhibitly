'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, X, SquaresFour, Image as ImageIcon, Palette, Gear, Users, PresentationChart } from '@phosphor-icons/react'

export function MobileNav({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <div className="md:hidden">
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-[#111111] flex items-center justify-between px-4 z-40">
                <div className="text-white font-serif text-xl tracking-wide">
                    Exhibitly.
                </div>
                <button onClick={toggleMenu} className="text-white p-2">
                    {isOpen ? <X size={24} /> : <List size={24} />}
                </button>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-16" />

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 top-16 bg-[#111111] z-30 p-4 flex flex-col animate-[fadeIn_0.2s_ease]">
                    <nav className="flex flex-col gap-2">
                        <Link href="/dashboard" onClick={toggleMenu} className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${pathname === '/dashboard' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                            <SquaresFour size={20} />
                            Dashboard
                        </Link>

                        {user?.user_metadata?.account_type === 'gallery' && (
                            <>
                                <Link href="/dashboard/roster" onClick={toggleMenu} className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${pathname === '/dashboard/roster' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                                    <Users size={20} />
                                    Roster
                                </Link>
                                <Link href="/dashboard/exhibitions" onClick={toggleMenu} className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${pathname === '/dashboard/exhibitions' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                                    <PresentationChart size={20} />
                                    Exhibitions
                                </Link>
                            </>
                        )}

                        <Link href="/dashboard/inventory" onClick={toggleMenu} className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${pathname === '/dashboard/inventory' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                            <ImageIcon size={20} />
                            Inventory
                        </Link>
                        <Link href="/dashboard/design" onClick={toggleMenu} className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${pathname === '/dashboard/design' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                            <Palette size={20} />
                            Site Design
                        </Link>
                        <Link href="/dashboard/settings" onClick={toggleMenu} className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${pathname === '/dashboard/settings' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                            <Gear size={20} />
                            Settings
                        </Link>
                    </nav>

                    <div className="mt-auto mb-8 text-xs opacity-50 leading-relaxed text-[#888888]">
                        Logged in as<br />
                        <span className="text-white opacity-100 font-medium">
                            {user?.user_metadata?.full_name || user?.email}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
