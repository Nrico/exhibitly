'use client'

import { WarningCircle } from '@phosphor-icons/react'
import { Artwork } from '@/types'

type InventoryToolbarProps = {
    filterStatus: 'all' | 'available' | 'sold' | 'draft'
    setFilterStatus: (status: 'all' | 'available' | 'sold' | 'draft') => void
    draftCount: number
}

export function InventoryToolbar({ filterStatus, setFilterStatus, draftCount }: InventoryToolbarProps) {
    return (
        <div className="flex justify-between items-center mb-5 bg-white p-2.5 border border-gray-200 rounded-lg">
            <div className="flex gap-1.5">
                <div
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 text-sm rounded-md cursor-pointer font-medium transition-colors ${filterStatus === 'all' ? 'bg-[#111111] text-white' : 'text-[#666666] hover:bg-gray-100 hover:text-[#111111]'}`}
                >
                    All Items
                </div>
                <div
                    onClick={() => setFilterStatus('available')}
                    className={`px-4 py-2 text-sm rounded-md cursor-pointer font-medium transition-colors ${filterStatus === 'available' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'text-[#666666] hover:bg-gray-100 hover:text-[#111111]'}`}
                >
                    Available
                </div>
                <div
                    onClick={() => setFilterStatus('sold')}
                    className={`px-4 py-2 text-sm rounded-md cursor-pointer font-medium transition-colors ${filterStatus === 'sold' ? 'bg-[#ffebee] text-[#c62828]' : 'text-[#666666] hover:bg-gray-100 hover:text-[#111111]'}`}
                >
                    Sold
                </div>
                <div
                    onClick={() => setFilterStatus('draft')}
                    className={`px-4 py-2 text-sm rounded-md cursor-pointer font-medium transition-colors flex items-center gap-1.5 ${filterStatus === 'draft' ? 'bg-[#fff8e1] text-[#f57f17]' : 'text-[#f57f17] hover:bg-gray-100'}`}
                >
                    <WarningCircle size={16} /> Needs Review ({draftCount})
                </div>
            </div>
            <div className="flex gap-2.5 opacity-50 pointer-events-none grayscale">
                {/* Placeholder buttons removed */}
            </div>
        </div>
    )
}
