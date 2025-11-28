import { getPublicProfileData, recordView } from '@/app/actions/public-profile'
import { PortfolioLayout } from '@/components/public/portfolio-layout'
import { notFound } from 'next/navigation'

import { Metadata } from 'next'

export async function generateMetadata({
    params,
    searchParams
}: {
    params: Promise<{ username: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
    const { username } = await params
    const { view, id } = await searchParams
    const { profile, settings, artworks, exhibitions, artists } = await getPublicProfileData(username)

    if (!profile) {
        return {
            title: 'Artist Not Found | Exhibitly',
        }
    }

    let title = settings?.site_title || profile.full_name || username
    let description = settings?.site_bio || `View the portfolio of ${profile.full_name || username} on Exhibitly.`
    let image = artworks?.[0]?.image_url || profile.avatar_url || '/og-default.jpg'

    // Dynamic Metadata based on View
    if (view === 'exhibitions' && id && typeof id === 'string') {
        const exhibition = exhibitions?.find(e => e.id === id)
        if (exhibition) {
            title = `${exhibition.title} | ${title}`
            description = exhibition.description?.replace(/<[^>]*>?/gm, '').substring(0, 160) || `View the exhibition "${exhibition.title}" at ${settings?.site_title || profile.full_name}.`
            if (exhibition.cover_image_url) image = exhibition.cover_image_url
        }
    } else if (view === 'artists' && id && typeof id === 'string') {
        const artist = artists?.find(a => a.id === id)
        if (artist) {
            title = `${artist.full_name} | ${title}`
            description = artist.bio?.substring(0, 160) || `View the works of ${artist.full_name} at ${settings?.site_title || profile.full_name}.`
            if (artist.avatar_url) image = artist.avatar_url
        }
    } else {
        // Check for Artwork Deep Link (artwork_id)
        const artworkId = (await searchParams).artwork_id
        if (artworkId && typeof artworkId === 'string') {
            const artwork = artworks?.find(a => a.id === artworkId)
            if (artwork) {
                title = `${artwork.title} | ${title}`
                description = `${artwork.title} (${artwork.year || 'n.d.'}) by ${profile.full_name}. ${artwork.medium}, ${artwork.dimensions}.`
                if (artwork.image_url) image = artwork.image_url
            }
        }
    }

    return {
        title: `${title} | Exhibitly`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [image],
        },
    }
}

export default async function ArtistPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const { profile, settings, artworks, artists, exhibitions, error } = await getPublicProfileData(username)

    if (error || !profile) {
        notFound()
    }

    // Record view (fire and forget)
    recordView(profile.id)

    console.log('--- Public Profile Debug ---')
    console.log('Username:', username)
    console.log('Account Type:', profile.account_type)
    console.log('Exhibitions Count:', exhibitions?.length)
    console.log('Artists Count:', artists?.length)
    console.log('----------------------------')

    return (
        <PortfolioLayout
            profile={profile}
            settings={settings}
            artworks={artworks as any[]}
            artists={artists}
            exhibitions={exhibitions}
        />
    )
}
