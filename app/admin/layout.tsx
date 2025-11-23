import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { House, Users, PaintBrushBroad, SignOut } from '@phosphor-icons/react/dist/ssr'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth')
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-[#111111] text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="font-serif text-xl font-bold tracking-wide">Exhibitly <span className="text-red-500 text-xs align-top">ADMIN</span></h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
                        <Users size={20} />
                        Users
                    </Link>
                    <Link href="/admin/artworks" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
                        <PaintBrushBroad size={20} />
                        All Artworks
                    </Link>
                    <div className="pt-4 mt-4 border-t border-gray-800">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
                            <House size={20} />
                            Back to App
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
                    Super Admin Console
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
