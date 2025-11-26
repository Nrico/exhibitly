'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Profile, SiteSettings, Exhibition, Artist } from '@/types'
import { ArrowRight } from '@phosphor-icons/react'

type GalleryHomeProps = {
    profile: Profile
    settings: SiteSettings
    exhibitions: Exhibition[]
    artists: Artist[]
}

export function GalleryHome({ profile, settings, exhibitions, artists }: GalleryHomeProps) {
    const featuredExhibition = exhibitions.find(e => e.is_featured) || exhibitions[0]
    const recentExhibitions = exhibitions.filter(e => e.id !== featuredExhibition?.id).slice(0, 3)
    const featuredArtists = artists.slice(0, 4)

    return (
        <div className="space-y-20 pb-20">
            {/* Hero / Featured Exhibition */}
            {featuredExhibition ? (
                <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
                    {featuredExhibition.cover_image_url && (
                        <Image
                            src={featuredExhibition.cover_image_url}
                            alt={featuredExhibition.title}
                            fill
                            className="object-cover opacity-90"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative z-10 text-center text-white max-w-4xl px-6">
                        <span className="uppercase tracking-widest text-sm mb-4 block">Current Exhibition</span>
                        <h1 className="font-serif text-5xl md:text-7xl mb-6">{featuredExhibition.title}</h1>
                        <div className="flex items-center justify-center gap-4 text-lg mb-8">
                            <span>{featuredExhibition.start_date ? new Date(featuredExhibition.start_date).toLocaleDateString() : 'Now Open'}</span>
                            <span>—</span>
                            <span>{featuredExhibition.end_date ? new Date(featuredExhibition.end_date).toLocaleDateString() : 'Until...'}</span>
                        </div>
                        <Link
                            href={`?view=exhibitions&id=${featuredExhibition.id}`}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors"
                        >
                            View Exhibition <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>
            ) : (
                <section className="h-[50vh] flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h1 className="font-serif text-4xl mb-4">{settings.site_title || profile.full_name}</h1>
                        <p className="text-gray-500 max-w-lg mx-auto px-6">{settings.site_bio || 'Welcome to our gallery.'}</p>
                    </div>
                </section>
            )}

            {/* Roster Highlights */}
            {artists.length > 0 && (
                <section className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="font-serif text-3xl">Represented Artists</h2>
                        <Link href="?view=artists" className="text-sm uppercase tracking-wider border-b border-black pb-1 hover:opacity-60 transition-opacity">
                            View All
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredArtists.map(artist => (
                            <div key={artist.id} className="group cursor-pointer">
                                <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                                    {artist.avatar_url ? (
                                        <Image
                                            src={artist.avatar_url}
                                            alt={artist.full_name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                    )}
                                </div>
                                <h3 className="font-serif text-xl mb-1">{artist.full_name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{artist.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent Exhibitions */}
            {recentExhibitions.length > 0 && (
                <section className="container mx-auto px-6">
                    <h2 className="font-serif text-3xl mb-12">Recent Exhibitions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentExhibitions.map(exhibition => (
                            <Link key={exhibition.id} href={`?view=exhibitions&id=${exhibition.id}`} className="group block">
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
                                <h3 className="font-serif text-xl mb-2 group-hover:underline">{exhibition.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {exhibition.start_date ? new Date(exhibition.start_date).getFullYear() : ''}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
