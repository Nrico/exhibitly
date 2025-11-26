'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Exhibition } from '@/types'

type GalleryExhibitionsProps = {
    exhibitions: Exhibition[]
}

export function GalleryExhibitions({ exhibitions }: GalleryExhibitionsProps) {
    const currentExhibitions = exhibitions.filter(e => {
        const now = new Date()
        const start = e.start_date ? new Date(e.start_date) : null
        const end = e.end_date ? new Date(e.end_date) : null
        return start && end && now >= start && now <= end
    })

    const upcomingExhibitions = exhibitions.filter(e => {
        const now = new Date()
        const start = e.start_date ? new Date(e.start_date) : null
        return start && now < start
    })

    const pastExhibitions = exhibitions.filter(e => {
        const now = new Date()
        const end = e.end_date ? new Date(e.end_date) : null
        return end && now > end
    })

    const ExhibitionCard = ({ exhibition }: { exhibition: Exhibition }) => (
        <Link href={`?view=exhibitions&id=${exhibition.id}`} className="group block">
            <div className="relative aspect-video mb-4 overflow-hidden bg-gray-100">
                {exhibition.cover_image_url ? (
                    <Image
                        src={exhibition.cover_image_url}
                        alt={exhibition.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
            </div>
            <h3 className="font-serif text-2xl mb-2 group-hover:underline">{exhibition.title}</h3>
            <div className="text-sm text-gray-500 uppercase tracking-wide">
                {exhibition.start_date ? new Date(exhibition.start_date).toLocaleDateString() : 'TBD'}
                {' — '}
                {exhibition.end_date ? new Date(exhibition.end_date).toLocaleDateString() : 'TBD'}
            </div>
        </Link>
    )

    return (
        <div className="container mx-auto px-6 py-20 space-y-20">
            {currentExhibitions.length > 0 && (
                <section>
                    <h2 className="font-serif text-3xl mb-10 border-b border-black pb-4">Current Exhibitions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {currentExhibitions.map(e => <ExhibitionCard key={e.id} exhibition={e} />)}
                    </div>
                </section>
            )}

            {upcomingExhibitions.length > 0 && (
                <section>
                    <h2 className="font-serif text-3xl mb-10 border-b border-black pb-4">Upcoming</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {upcomingExhibitions.map(e => <ExhibitionCard key={e.id} exhibition={e} />)}
                    </div>
                </section>
            )}

            {pastExhibitions.length > 0 && (
                <section>
                    <h2 className="font-serif text-3xl mb-10 border-b border-black pb-4">Past Exhibitions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {pastExhibitions.map(e => <ExhibitionCard key={e.id} exhibition={e} />)}
                    </div>
                </section>
            )}

            {exhibitions.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500">No exhibitions found.</p>
                </div>
            )}
        </div>
    )
}
