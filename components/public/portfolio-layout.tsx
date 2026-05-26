'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Profile, SiteSettings, Artwork, Artist, Exhibition } from '@/types'
import { DetailModal } from '@/components/public/shared-views'
import { PortfolioProvider } from '@/components/public/portfolio-context'
import CinemaTheme from '@/components/themes/CinemaTheme'
import ArchiveTheme from '@/components/themes/ArchiveTheme'
import WhiteCubeTheme from '@/components/themes/WhiteCubeTheme'

export function PortfolioLayout({
    profile,
    settings,
    artworks,
    artists = [],
    exhibitions = []
}: {
    profile: Profile,
    settings: SiteSettings,
    artworks: Artwork[],
    artists?: Artist[],
    exhibitions?: Exhibition[]
}) {
    const searchParams = useSearchParams()
    const previewTheme = searchParams.get('preview')
    const theme = previewTheme || settings.theme || 'minimal'

    // Deep Linking for Artworks
    const artworkId = searchParams.get('artwork_id')
    const initialArtwork = artworkId ? artworks.find(a => a.id === artworkId) : null

    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(initialArtwork || null)

    // Gallery/Artist View State
    const view = searchParams.get('view') || (profile.account_type === 'gallery' ? 'home' : 'gallery')

    // Helper to render the modal for any theme
    const renderModal = () => (
        selectedArtwork && (
            <DetailModal
                artwork={selectedArtwork}
                onClose={() => setSelectedArtwork(null)}
            />
        )
    )

    const renderTheme = () => {
        if (theme === 'dark') {
            return <CinemaTheme view={view} />
        }

        if (theme === 'archive') {
            return <ArchiveTheme view={view} />
        }

        // Default 'minimal' theme - "The White Cube"
        return <WhiteCubeTheme view={view} />
    }

    return (
        <PortfolioProvider value={{ profile, settings, artworks, selectedArtwork, setSelectedArtwork, theme, view, artists, exhibitions }}>
            {renderTheme()}
            {renderModal()}
        </PortfolioProvider>
    )
}
