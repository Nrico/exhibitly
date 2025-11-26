import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ImpersonationBanner } from '@/components/dashboard/impersonation-banner'
import { getImpersonatedUser } from '@/utils/impersonation'
import { MobileNav } from '@/components/dashboard/mobile-nav'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { user, isImpersonating, realUser } = await getImpersonatedUser(supabase)

    if (!user) {
        redirect('/auth')
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f9fa]">
            <Sidebar user={user} />
            <MobileNav user={user} />
            <main className="flex-1 p-6 md:ml-[260px] md:p-[50px_60px]">
                {children}
            </main>
            <ImpersonationBanner isImpersonating={isImpersonating} realUserEmail={realUser?.email} />
        </div>
    )
}
