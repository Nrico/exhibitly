'use client'

import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { FilePdf } from '@phosphor-icons/react'
import { ArtistPortfolioDocument } from './ArtistPortfolioDocument'
import { Artwork } from '@/types'

type ExportPdfButtonProps = {
    profile: {
        full_name: string | null
        email: string
    }
    settings: {
        site_title: string | null
        site_bio: string | null
        site_bio_long?: string | null
    }
    artworks: Artwork[]
}

export function ExportPdfButton({ profile, settings, artworks }: ExportPdfButtonProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <button
                disabled
                className="opacity-50 border border-gray-200 text-[#111111] px-4 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 cursor-not-allowed bg-white"
            >
                <FilePdf size={16} /> Loading Packet...
            </button>
        )
    }

    const artistName = settings?.site_title || profile?.full_name || 'Artist'

    return (
        <PDFDownloadLink
            document={<ArtistPortfolioDocument profile={profile} settings={settings} items={artworks} />}
            fileName={`${artistName.replace(/\s+/g, '_')}_Portfolio.pdf`}
            className="bg-white border border-gray-200 text-[#111111] px-4 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 no-underline"
        >
            {({ loading }: any) => (
                <>
                    <FilePdf size={16} className="text-[#111111]" />
                    {loading ? 'Generating PDF...' : 'Export PDF Packet'}
                </>
            )}
        </PDFDownloadLink>
    )
}
