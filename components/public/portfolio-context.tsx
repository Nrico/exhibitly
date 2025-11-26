'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Profile, SiteSettings, Artwork, Artist, Exhibition } from '@/types'

type PortfolioContextType = {
    profile: Profile
    settings: SiteSettings
    artworks: Artwork[]
    selectedArtwork: Artwork | null
    setSelectedArtwork: (artwork: Artwork | null) => void
    theme: string
    view?: string
    artists?: Artist[]
    exhibitions?: Exhibition[]
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({
    children,
    value
}: {
    children: ReactNode
    value: PortfolioContextType
}) {
    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    )
}

export function usePortfolio() {
    const context = useContext(PortfolioContext)
    if (context === undefined) {
        throw new Error('usePortfolio must be used within a PortfolioProvider')
    }
    return context
}
