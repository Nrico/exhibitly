import { getArtistData } from './actions'
import { PortfolioLayout } from '@/components/public/portfolio-layout'
import { notFound } from 'next/navigation'

export default async function ArtistPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const { profile, settings, artworks, error } = await getArtistData(username)

    if (error || !profile) {
        notFound()
    }

    return (
        <PortfolioLayout
            profile={profile}
            settings={settings}
            artworks={artworks as any[]}
        />
    )
}
