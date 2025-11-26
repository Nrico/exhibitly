'use client'

import Image from 'next/image'
import { Artist } from '@/types'

type GalleryRosterProps = {
    artists: Artist[]
}

export function GalleryRoster({ artists }: GalleryRosterProps) {
    if (artists.length === 0) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <p className="text-gray-500">No artists listed yet.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-6 py-20">
            <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center">Artists</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {artists.map(artist => (
                    <div key={artist.id} className="group">
                        <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-100">
                            {artist.avatar_url ? (
                                <Image
                                    src={artist.avatar_url}
                                    alt={artist.full_name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        <h2 className="font-serif text-2xl mb-2">{artist.full_name}</h2>
                        {artist.bio && (
                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
                                {artist.bio}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
