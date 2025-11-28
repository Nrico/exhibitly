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

    // Gallery View State
    const view = searchParams.get('view') || 'home'

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
        // If it's a gallery, we might need a different layout wrapper or just pass the view
        // For now, let's assume the Theme components handle the 'view' prop if passed, 
        // OR we handle the gallery views OUTSIDE the theme if they are standard.
        // Actually, the requirement is to have a standard Gallery layout.

        // Let's pass the 'view' to the context or handle it here.
        // But wait, the Themes (Cinema, Archive, WhiteCube) are currently built for Artists (Grid of Artworks).
        // We need to either update them to support Gallery views OR render Gallery components directly here.

        if (profile.account_type === 'gallery') {
            // We'll render the Gallery components directly, bypassing the Artist Themes for the main views.
            // But we still want the Theme's "Shell" (Nav + Footer).
            // This is tricky because the Themes encapsulate the Shell.

            // Strategy: Pass 'view' and 'children' to the Theme? 
            // Or just use WhiteCube as the default for Galleries for now and inject content?

            // Let's update the Themes to accept 'customContent' or similar?
            // Or better: The Themes currently just render the grid.
            // Let's make the Themes accept a 'view' prop.

            if (theme === 'dark') return <CinemaTheme view={view} />
            if (theme === 'archive') return <ArchiveTheme view={view} />
            return <WhiteCubeTheme view={view} />
        }

        if (theme === 'dark') {
            return <CinemaTheme />
        }

        if (theme === 'archive') {
            return <ArchiveTheme />
        }

        // Default 'minimal' theme - "The White Cube"
        return <WhiteCubeTheme />
    }

    return (
        <PortfolioProvider value={{ profile, settings, artworks, selectedArtwork, setSelectedArtwork, theme, view, artists, exhibitions }}>
            {renderTheme()}
            {renderModal()}
        </PortfolioProvider>
    )
}
