import { getPublicProfileData, recordView } from '@/app/actions/public-profile'
import { PortfolioLayout } from '@/components/public/portfolio-layout'
import { notFound } from 'next/navigation'

import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    const { username } = await params
    const { profile, settings, artworks } = await getPublicProfileData(username)

    if (!profile) {
        return {
            title: 'Artist Not Found | Exhibitly',
        }
    }

    const title = settings?.site_title || profile.full_name || username
    const description = settings?.site_bio || `View the portfolio of ${profile.full_name || username} on Exhibitly.`
    const image = artworks?.[0]?.image_url || profile.avatar_url || '/og-default.jpg'

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
