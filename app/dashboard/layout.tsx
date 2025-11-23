import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth')
    }

    return (
        <div className="flex min-h-screen bg-[#f8f9fa]">
            <Sidebar user={user} />
            <main className="ml-[260px] flex-1 p-[50px_60px]">
                {children}
            </main>
        </div>
    )
}
