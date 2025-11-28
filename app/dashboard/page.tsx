import { createClient } from '@/utils/supabase/server'
import { OnboardingChecklist } from '@/components/dashboard/onboarding-checklist'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { PlusCircle, MagicWand } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/auth/actions'
import { getImpersonatedUser } from '@/utils/impersonation'

import { getUsage } from '@/utils/limits'
import { UsageIndicator, UpgradePrompt } from '@/components/dashboard/usage-indicator'

export default async function Dashboard() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) {
        return redirect('/auth')
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch Site Settings
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Fetch Usage
    const { status, usage, limits } = await getUsage(supabase, user.id)

    // Fetch recent uploads
    const { data: recentUploads } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    // Fetch Analytics Stats
    const { count: totalViews } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)

    const { count: totalArtworks } = await supabase
        .from('artworks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const { count: soldArtworks } = await supabase
        .from('artworks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'sold')

    const { count: availableArtworks } = await supabase
        .from('artworks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'available')

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="font-serif text-4xl text-[#111111] mb-1">Welcome, {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Artist'}.</h1>
                        <div className="text-sm text-[#666666]">{currentDate}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/inventory?new=true" className="bg-[#111111] text-white border-none px-6 py-3 rounded-md text-sm cursor-pointer flex items-center gap-2 hover:bg-[#333] transition-colors no-underline">
                            <PlusCircle size={18} /> Upload New Work
                        </Link>
                        <form action={signOut}>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50">
                                Sign Out
                            </button>
                        </form>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="md:col-span-2 space-y-8">
                        <OnboardingChecklist
                            profile={profile}
                            settings={settings}
                            artworkCount={recentUploads?.length || 0}
                            username={profile?.username}
                        />

                        <StatsCards
                            totalViews={totalViews || 0}
                            totalArtworks={totalArtworks || 0}
                            soldArtworks={soldArtworks || 0}
                            availableArtworks={availableArtworks || 0}
                            username={profile?.username}
                        />
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Plan Usage</h3>
                            <div className="space-y-6">
                                <UsageIndicator type="artworks" count={usage.artworks} limit={limits.artworks} label="Artworks" />
                                {profile?.account_type === 'gallery' && (
                                    <>
                                        <UsageIndicator type="artists" count={usage.artists} limit={limits.artists} label="Artists" />
                                        <UsageIndicator type="exhibitions" count={usage.exhibitions} limit={limits.exhibitions} label="Exhibitions" />
                                    </>
                                )}
                            </div>
                        </div>
                        {status === 'free' && <UpgradePrompt />}
                    </div>
                </div>

                <h2 className="text-lg font-semibold mb-5 text-[#111111]">Recent Uploads</h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#fafafa] border-b border-gray-200 text-left">
                                <th className="p-4 pl-6 text-xs uppercase text-[#666666] font-semibold">Image</th>
                                <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Title</th>
                                <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Uploaded</th>
                                <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Price</th>
                                <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUploads?.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden relative">
                                            {item.image_url && <Image src={item.image_url} alt={item.title} fill className="object-cover" />}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-sm text-[#111111]">{item.title}</div>
                                        <div className="text-xs text-[#888888]">{item.medium}</div>
                                    </td>
                                    <td className="p-4 text-sm text-[#111111]">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm text-[#111111]">{item.price ? `$${item.price}` : '--'}</td>
                                    <td className="p-4">
                                        <span className={`
                      px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5
                      ${item.status === 'available' ? 'bg-green-50 text-green-700' : ''}
                      ${item.status === 'sold' ? 'bg-red-50 text-red-700' : ''}
                      ${item.status === 'draft' ? 'bg-yellow-50 text-yellow-700' : ''}
                    `}>
                                            {item.status === 'draft' && <MagicWand size={12} weight="fill" />}
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
