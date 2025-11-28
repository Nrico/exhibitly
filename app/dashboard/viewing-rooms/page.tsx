import { createClient } from '@/utils/supabase/server'
import { getImpersonatedUser } from '@/utils/impersonation'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Eye } from '@phosphor-icons/react/dist/ssr'
import { createViewingRoom } from './actions'
import { DeleteRoomButton } from '@/components/dashboard/viewing-rooms/DeleteRoomButton'

export default async function ViewingRoomsPage() {
    const supabase = await createClient()
    const { user } = await getImpersonatedUser(supabase)

    if (!user) redirect('/auth')

    // Gate access to galleries only
    const { data: profile } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', user.id)
        .single()

    if (profile?.account_type !== 'gallery') {
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-serif mb-4">Gallery Access Required</h1>
                <p className="text-gray-600">Private Viewing Rooms are available exclusively to Gallery partners.</p>
                <Link href="/dashboard" className="text-blue-600 mt-4 inline-block">Return to Dashboard</Link>
            </div>
        )
    }

    const { data: rooms } = await supabase
        .from('viewing_rooms')
        .select('*')
        .eq('gallery_id', user.id)
        .order('created_at', { ascending: false })

    async function handleCreate(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        const { data, error } = await createViewingRoom(title)
        if (data) {
            redirect(`/dashboard/viewing-rooms/${data.id}`)
        }
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="font-serif text-3xl text-[#111] mb-2">Private Viewing Rooms</h1>
                    <p className="text-gray-500 text-sm">Create exclusive, time-limited sales rooms for collectors.</p>
                </div>
                <form action={handleCreate} className="flex gap-2">
                    <input
                        name="title"
                        placeholder="New Room Title..."
                        className="border border-gray-300 rounded px-3 py-2 text-sm"
                        required
                    />
                    <button type="submit" className="bg-[#111] text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-[#333]">
                        <Plus size={16} /> Create Room
                    </button>
                </form>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms?.map(room => (
                    <Link key={room.id} href={`/dashboard/viewing-rooms/${room.id}`} className="block group no-underline">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-all shadow-sm hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-2 py-1 rounded text-xs uppercase tracking-wider font-medium ${room.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {room.status}
                                </div>
                                <DeleteRoomButton roomId={room.id} title={room.title} />
                            </div>
                            <h3 className="font-serif text-xl text-[#111] mb-2 group-hover:underline decoration-1 underline-offset-4">{room.title}</h3>
                            <div className="text-xs text-gray-500 font-mono">
                                /{room.slug}
                            </div>
                            <div className="mt-4 text-xs text-gray-400">
                                Created {new Date(room.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </Link>
                ))}
                {rooms?.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                        No viewing rooms yet. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
