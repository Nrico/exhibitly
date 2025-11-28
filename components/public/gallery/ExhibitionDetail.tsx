'use client'

import Image from 'next/image'
import { Exhibition, Artwork } from '@/types'
import { usePortfolio } from '@/components/public/portfolio-context'

export function ExhibitionDetail({ exhibition, onBack, variant = 'square', mutedTextClass = 'text-gray-600' }: { exhibition: Exhibition, onBack: () => void, variant?: 'masonry' | 'square', mutedTextClass?: string }) {
    const { setSelectedArtwork } = usePortfolio()

    return (
        <div className="animate-[fadeIn_0.5s_ease]">
            <button
                onClick={onBack}
                className="mb-8 text-sm uppercase tracking-widest hover:underline flex items-center gap-2"
            >
                &larr; Back to Exhibitions
            </button>

            <header className="mb-10 md:mb-16 text-center max-w-4xl mx-auto">
                <h1 className="font-serif text-3xl md:text-5xl mb-4 md:mb-6">{exhibition.title}</h1>
                <div className={`text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 ${mutedTextClass}`}>
                    {exhibition.start_date ? new Date(exhibition.start_date).toLocaleDateString() : 'TBD'}
                    {' — '}
                    {exhibition.end_date ? new Date(exhibition.end_date).toLocaleDateString() : 'TBD'}
                    {exhibition.location && <span className="mx-2">&bull;</span>}
                    {exhibition.location}
                </div>

                {exhibition.description && (
                    <div
                        className={`prose prose-base md:prose-lg mx-auto font-light leading-relaxed px-4 md:px-0 ${mutedTextClass}`}
                        dangerouslySetInnerHTML={{ __html: exhibition.description }}
                    />
                )}
            </header>

            {exhibition.artworks && exhibition.artworks.length > 0 ? (
                variant === 'masonry' ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {exhibition.artworks.map((artwork) => (
                            <div
                                key={artwork.id}
                                className="group cursor-pointer break-inside-avoid mb-8"
                                onClick={() => setSelectedArtwork(artwork)}
                            >
                                <div className="w-full bg-gray-100 mb-4 overflow-hidden">
                                    {artwork.image_url && (
                                        <Image
                                            src={artwork.image_url}
                                            alt={artwork.title}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{ width: '100%', height: 'auto' }}
                                            className="transition-transform duration-700 group-hover:scale-[1.03]"
                                        />
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="font-serif text-lg mb-1">{artwork.title}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                                        {artwork.artist?.full_name || artwork.medium}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {exhibition.artworks.map((artwork) => (
                            <div
                                key={artwork.id}
                                className="group cursor-pointer"
                                onClick={() => setSelectedArtwork(artwork)}
                            >
                                <div className="relative aspect-square mb-4 bg-gray-100 flex items-center justify-center">
                                    <div className="relative w-[85%] h-[85%] transition-transform duration-700 group-hover:scale-105">
                                        {artwork.image_url && (
                                            <Image
                                                src={artwork.image_url}
                                                alt={artwork.title}
                                                fill
                                                className="object-contain"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-serif text-lg mb-1">{artwork.title}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                                        {artwork.artist?.full_name || artwork.medium}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="text-center py-20 border-t border-gray-100">
                    <p className="text-gray-400 italic">No artworks listed for this exhibition.</p>
                </div>
            )}
        </div>
    )
}
