'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SquaresFour, Image as ImageIcon, DownloadSimple, Palette, Gear } from '@phosphor-icons/react'

export function Sidebar({ user }: { user: any }) {
    const pathname = usePathname()

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: SquaresFour },
        { name: 'Inventory', href: '/dashboard/inventory', icon: ImageIcon },
        { name: 'Export Data', href: '/dashboard/export', icon: DownloadSimple },
        { name: 'Site Design', href: '/dashboard/design', icon: Palette },
        { name: 'Settings', href: '/dashboard/settings', icon: Gear },
    ]

    return (
        <aside className="fixed w-[260px] h-screen bg-[#111111] text-[#888888] p-[30px_20px] flex flex-col gap-2 z-10">
            <div className="text-white font-serif text-3xl mb-10 tracking-wide">
                Exhibitly.
            </div>

            <nav className="flex flex-col gap-2">
                <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${pathname === '/dashboard' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                    <SquaresFour size={18} />
                    Dashboard
                </Link>
                <Link href="/dashboard/inventory" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${pathname === '/dashboard/inventory' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                    <ImageIcon size={18} />
                    Inventory
                </Link>
                <Link href="/dashboard/export" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${pathname === '/dashboard/export' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                    <DownloadSimple size={18} />
                    Export Data
                </Link>
                <Link href="/dashboard/design" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${pathname === '/dashboard/design' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                    <Palette size={18} />
                    Site Design
                </Link>
                <Link href="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${pathname === '/dashboard/settings' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-white'}`}>
                    <Gear size={18} />
                    Settings
                </Link>
            </nav>

            <div className="mt-auto text-xs opacity-50 leading-relaxed">
                Logged in as<br />
                <span className="text-white opacity-100 font-medium">
                    {user?.user_metadata?.full_name || user?.email}
                </span>
            </div>
        </aside>
    )
}
