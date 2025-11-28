'use client'

import { useState } from 'react'
import { Artwork } from '@/types'
import { Printer, CheckSquare, Cards } from '@phosphor-icons/react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function PrintTools({ inventory }: { inventory: Artwork[] }) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [viewMode, setViewMode] = useState<'checklist' | 'labels'>('checklist')

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelectedIds(newSet)
    }

    const selectedArtworks = inventory.filter(item => selectedIds.has(item.id))

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar (Hidden on Print) */}
            <div className="w-[350px] bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 print:hidden">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="font-serif text-2xl mb-2">Print Center</h1>
                    <p className="text-xs text-gray-500 mb-4">Select artworks to generate documentation.</p>

                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setViewMode('checklist')}
                            className={cn(
                                "flex-1 py-2 text-xs font-medium rounded border flex items-center justify-center gap-2",
                                viewMode === 'checklist' ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200"
                            )}
                        >
                            <CheckSquare size={16} /> Checklist
                        </button>
                        <button
                            onClick={() => setViewMode('labels')}
                            className={cn(
                                "flex-1 py-2 text-xs font-medium rounded border flex items-center justify-center gap-2",
                                viewMode === 'labels' ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200"
                            )}
                        >
                            <Cards size={16} /> Wall Labels
                        </button>
                    </div>

                    <button
                        onClick={handlePrint}
                        disabled={selectedIds.size === 0}
                        className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Printer size={18} /> Print {viewMode === 'checklist' ? 'Checklist' : 'Labels'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                        {inventory.map(item => (
                            <div
                                key={item.id}
                                onClick={() => toggleSelection(item.id)}
                                className={cn(
                                    "flex items-center gap-3 p-2 rounded cursor-pointer border transition-colors",
                                    selectedIds.has(item.id) ? "bg-blue-50 border-blue-200" : "bg-white border-transparent hover:bg-gray-50"
                                )}
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedIds.has(item.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                    {selectedIds.has(item.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                                </div>
                                <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                                    {item.image_url && <Image src={item.image_url} alt="" fill className="object-cover" />}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-sm font-medium truncate">{item.title}</div>
                                    <div className="text-xs text-gray-500 truncate">{item.medium}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview Area (The Printable Part) */}
            <div className="flex-1 p-10 print:p-0 print:bg-white">
                {selectedArtworks.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Select artworks to preview.
                    </div>
                ) : (
                    <>
                        {/* Checklist View */}
                        {viewMode === 'checklist' && (
                            <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none p-10 min-h-[11in]">
                                <h2 className="text-2xl font-serif mb-8 border-b pb-4">Exhibition Checklist</h2>
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-2 w-20">Image</th>
                                            <th className="py-2">Details</th>
                                            <th className="py-2 text-right">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedArtworks.map(item => (
                                            <tr key={item.id} className="border-b border-gray-100">
                                                <td className="py-4 align-top">
                                                    <div className="w-16 h-16 bg-gray-100 relative">
                                                        {item.image_url && <Image src={item.image_url} alt="" fill className="object-cover" />}
                                                    </div>
                                                </td>
                                                <td className="py-4 align-top pl-4">
                                                    <div className="font-bold text-base">{item.title}</div>
                                                    <div className="text-gray-600 italic">{item.medium}</div>
                                                    <div className="text-gray-500">{item.dimensions}</div>
                                                </td>
                                                <td className="py-4 align-top text-right font-mono">
                                                    {item.price ? `$${item.price.toLocaleString()}` : 'NFS'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Wall Labels View */}
                        {viewMode === 'labels' && (
                            <div className="grid grid-cols-2 gap-10 print:block">
                                {selectedArtworks.map(item => (
                                    <div key={item.id} className="bg-white shadow-lg print:shadow-none p-10 w-[5in] h-[3.5in] flex flex-col justify-center border print:border-none print:break-inside-avoid mb-8 mx-auto">
                                        <div className="font-bold text-xl mb-1">Artist Name</div> {/* Placeholder as we don't have artist name on artwork yet, assuming single artist profile or we'd need to fetch it */}
                                        <div className="font-serif text-2xl italic mb-4">{item.title}, {item.year || '2024'}</div>
                                        <div className="text-gray-600 text-sm mb-1">{item.medium}</div>
                                        <div className="text-gray-600 text-sm">{item.dimensions}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
