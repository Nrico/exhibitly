'use client'

import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { FilePdf } from '@phosphor-icons/react'
import { WallLabelsDocument, PriceListDocument } from './PrintDocuments'
import { Exhibition, Artwork } from '@/types'

export function PDFDownloadButtons({ exhibition, items }: { exhibition: Exhibition, items: Artwork[] }) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    const pdfItems = items.map(a => ({ exhibition_id: exhibition.id, artwork_id: a.id, position: 0, artwork: a }))

    return (
        <>
            <PDFDownloadLink
                document={<WallLabelsDocument exhibition={exhibition} items={pdfItems} />}
                fileName={`${exhibition.title.replace(/\s+/g, '_')}_Labels.pdf`}
                className="px-3 py-2 bg-white border border-gray-200 text-[#111] rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
                {({ loading }) => (
                    <>
                        <FilePdf size={16} />
                        {loading ? 'Generating...' : 'Labels'}
                    </>
                )}
            </PDFDownloadLink>
            <PDFDownloadLink
                document={<PriceListDocument exhibition={exhibition} items={pdfItems} />}
                fileName={`${exhibition.title.replace(/\s+/g, '_')}_PriceList.pdf`}
                className="px-3 py-2 bg-white border border-gray-200 text-[#111] rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
                {({ loading }) => (
                    <>
                        <FilePdf size={16} />
                        {loading ? 'Generating...' : 'Price List'}
                    </>
                )}
            </PDFDownloadLink>
        </>
    )
}
