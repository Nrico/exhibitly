'use client'

import Image from 'next/image'
import { Artist, Artwork } from '@/types'
import { usePortfolio } from '@/components/public/portfolio-context'

export function ArtistDetail({ artist, onBack }: { artist: Artist, onBack: () => void }) {
    const { setSelectedArtwork } = usePortfolio()

    return (
        <div className="animate-[fadeIn_0.5s_ease]">
            <button
                onClick={onBack}
                className="mb-8 text-sm uppercase tracking-widest hover:underline flex items-center gap-2"
            >
                &larr; Back to Artists
            </button>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-12 md:mb-16">
                {artist.avatar_url && (
                    <div className="w-full md:w-1/3 relative aspect-[3/4] bg-gray-100 shadow-lg">
                        <Image
                            src={artist.avatar_url}
                            alt={artist.full_name}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="flex-1">
                    <h1 className="font-serif text-3xl md:text-5xl mb-4 md:mb-6">{artist.full_name}</h1>

                    {artist.bio ? (
                        <div
                            className="prose prose-base md:prose-lg text-gray-600 font-light leading-relaxed whitespace-pre-wrap"
                        >
                            {artist.bio}
                        </div>
                    ) : (
                        <p className="text-gray-400 italic">No biography available.</p>
                    )}
                </div>
            </div>

            <h2 className="font-serif text-xl md:text-2xl mb-6 md:mb-8 border-b border-gray-200 pb-4">Available Works</h2>

            {artist.artworks && artist.artworks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {artist.artworks.map((artwork) => (
                        <div
                            key={artwork.id}
                            className="group cursor-pointer"
                            onClick={() => setSelectedArtwork(artwork)}
                        >
                            <div className="relative aspect-[4/5] mb-4 bg-gray-100 overflow-hidden">
                                {artwork.image_url && (
                                    <Image
                                        src={artwork.image_url}
                                        alt={artwork.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                )}
                            </div>
                            <div className="text-center">
                                <h3 className="font-serif text-lg mb-1">{artwork.title}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                    {artwork.medium}
                                </p>
                                <div className="text-xs font-semibold uppercase tracking-wide mt-2">
                                    {artwork.status === 'sold' ? (
                                        <span className="text-red-600">Sold</span>
                                    ) : (
                                        <span className="text-gray-900">{artwork.price ? `$${artwork.price.toLocaleString()}` : 'Inquire'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-400 italic">No artworks listed for this artist.</p>
                </div>
            )}
        </div>
    )
}
