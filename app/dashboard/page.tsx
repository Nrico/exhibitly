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
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="font-serif text-4xl text-[#0f172a] mb-1 tracking-tight">Welcome, {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Artist'}.</h1>
                        <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">{currentDate}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/inventory?new=true" className="bg-[#111111] text-white border-none px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 hover:bg-[#333] transition-all no-underline shadow-sm">
                            <PlusCircle size={16} /> Upload New Work
                        </Link>
                        <form action={signOut}>
                            <button className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-50 transition-colors">
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
                        <div className="dashboard-glass-card rounded-xl p-6">
                            <h3 className="dashboard-mono-label mb-4">Plan Usage</h3>
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

                <h2 className="text-xl font-serif mb-5 text-[#0f172a] tracking-tight">Recent Uploads</h2>
                <div className="dashboard-glass-card rounded-xl overflow-hidden mb-10">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200/60 text-left">
                                <th className="p-4 pl-6"><span className="dashboard-mono-label">Image</span></th>
                                <th className="p-4"><span className="dashboard-mono-label">Title</span></th>
                                <th className="p-4"><span className="dashboard-mono-label">Uploaded</span></th>
                                <th className="p-4"><span className="dashboard-mono-label">Price</span></th>
                                <th className="p-4"><span className="dashboard-mono-label">Status</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUploads?.map((item: any) => (
                                <tr key={item.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden relative border border-slate-200/50">
                                            {item.image_url && <Image src={item.image_url} alt={item.title} fill className="object-cover" />}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-sm text-slate-800">{item.title}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-0.5">{item.medium}</div>
                                    </td>
                                    <td className="p-4 text-xs font-mono text-slate-600">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-xs font-mono text-slate-700">{item.price ? `$${item.price.toLocaleString()}` : '--'}</td>
                                    <td className="p-4">
                                        <span className={`
                      px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1
                      ${item.status === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ''}
                      ${item.status === 'sold' ? 'bg-rose-50 text-rose-700 border border-rose-100' : ''}
                      ${item.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                    `}>
                                            {item.status === 'draft' && <MagicWand size={10} weight="fill" />}
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
