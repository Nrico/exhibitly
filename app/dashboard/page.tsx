import { createClient } from '@/utils/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { PlusCircle, MagicWand } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/auth/actions'

export default async function Dashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/auth')
    }

    // Fetch recent uploads
    const { data: recentUploads } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="font-serif text-4xl text-[#111111] mb-1">Welcome, {user?.user_metadata?.full_name?.split(' ')[0] || 'Artist'}.</h1>
                        <div className="text-sm text-[#666666]">{currentDate}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="bg-[#111111] text-white border-none px-6 py-3 rounded-md text-sm cursor-pointer flex items-center gap-2 hover:bg-[#333] transition-colors">
                            <PlusCircle size={18} /> Upload New Work
                        </button>
                        <form action={signOut}>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50">
                                Sign Out
                            </button>
                        </form>
                    </div>
                </header>

                <StatsCards />

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
                                <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Action</th>
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
                                    <td className="p-4">
                                        <button className="text-[#666666] text-sm hover:text-[#111111] hover:underline">
                                            Edit
                                        </button>
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
