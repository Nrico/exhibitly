'use client'

import { useState } from 'react'

export function ExportButton({ artworks }: { artworks: any[] }) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = () => {
        setIsExporting(true)

        // Define headers
        const headers = ['id', 'title', 'medium', 'dimensions', 'price', 'status', 'collection', 'created_at']

        // Convert to CSV string
        const csvContent = [
            headers.join(','),
            ...artworks.map(item => headers.map(header => {
                const val = item[header] || ''
                // Escape quotes and wrap in quotes if needed
                return `"${String(val).replace(/"/g, '""')}"`
            }).join(','))
        ].join('\n')

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setTimeout(() => setIsExporting(false), 1000)
    }

    return (
        <button
            onClick={handleExport}
            disabled={isExporting || artworks.length === 0}
            className="bg-[#111111] text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {isExporting ? 'Generating...' : 'Download CSV'}
        </button>
    )
}
