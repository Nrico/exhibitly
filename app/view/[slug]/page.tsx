import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr'

export default async function ViewingRoomPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    // Fetch Room
    const { data: room } = await supabase
        .from('viewing_rooms')
        .select(`
            *,
            gallery:profiles(*)
        `)
        .eq('slug', params.slug)
        .eq('status', 'active')
        .single()

    if (!room) notFound()

    // Fetch Items
    const { data: items } = await supabase
        .from('room_items')
        .select(`
            *,
            artwork:artworks(*)
        `)
        .eq('room_id', room.id)
        .order('sort_order', { ascending: true })

    if (!items || items.length === 0) return <div>Room is empty</div>

    const heroItem = items[0]
    const supportingItems = items.slice(1)

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#111] selection:bg-[#111] selection:text-white font-sans">
            {/* Floating Inquire Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <a
                    href={`mailto:${room.gallery.email}?subject=Inquiry: ${room.title}`}
                    className="bg-[#111] text-white px-6 py-3 rounded-full shadow-xl hover:bg-[#333] transition-all flex items-center gap-2 text-sm font-medium tracking-wide"
                >
                    <EnvelopeSimple size={18} /> Inquire
                </a>
            </div>

            {/* Cover / Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center p-10 relative">
                <div className="absolute top-10 left-10 text-xs uppercase tracking-[3px] text-gray-400">
                    Private Viewing Room
                </div>

                <div className="max-w-4xl w-full text-center z-10">
                    <h1 className="font-serif text-5xl md:text-7xl mb-6">{room.title}</h1>
                    <div className="text-sm uppercase tracking-widest text-gray-500 mb-12">
                        Presented by {room.gallery.full_name || 'The Gallery'}
                    </div>
                </div>

                <div className="absolute bottom-10 animate-bounce text-gray-400 text-xs uppercase tracking-widest">
                    Scroll to Enter
                </div>
            </section>

            {/* Hero Artwork */}
            {heroItem.artwork && (
                <section className="min-h-screen flex items-center justify-center p-10 md:p-20 bg-white">
                    <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
                        <div className="relative aspect-[3/4] md:aspect-square bg-gray-50">
                            <Image
                                src={heroItem.artwork.image_url || ''}
                                alt={heroItem.artwork.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-widest text-gray-400 mb-4">Featured Work</div>
                            <h2 className="font-serif text-4xl mb-2">{heroItem.artwork.title}</h2>
                            <div className="text-lg text-gray-600 mb-6 font-serif italic">{heroItem.artwork.medium}</div>
                            <div className="space-y-1 text-sm text-gray-500 font-mono">
                                <div>{heroItem.artwork.dimensions}</div>
                                <div>{heroItem.artwork.year}</div>
                            </div>
                            <div className="mt-8 text-xl font-medium">
                                {heroItem.artwork.price ? `$${heroItem.artwork.price.toLocaleString()}` : 'Price on Request'}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Supporting Works */}
            <section className="max-w-[1600px] mx-auto px-10 py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
                    {supportingItems.map(item => (
                        <div key={item.id} className="group cursor-default">
                            <div className="aspect-square bg-gray-50 mb-6 relative">
                                {item.artwork?.image_url && (
                                    <Image
                                        src={item.artwork.image_url}
                                        alt={item.artwork.title}
                                        fill
                                        className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                                    />
                                )}
                            </div>
                            <div className="text-center">
                                <h3 className="font-serif text-xl mb-1">{item.artwork?.title}</h3>
                                <div className="text-sm text-gray-500 italic mb-2">{item.artwork?.medium}</div>
                                <div className="text-sm font-medium">
                                    {item.artwork?.price ? `$${item.artwork.price.toLocaleString()}` : 'Inquire'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="py-20 text-center text-gray-400 text-xs uppercase tracking-widest">
                &copy; {new Date().getFullYear()} {room.gallery.full_name}
            </footer>
        </div>
    )
}
