'use client'

import Image from 'next/image'
import { Exhibition } from '@/types'
import { PencilSimple, Trash, SquaresFour } from '@phosphor-icons/react'

type ExhibitionListProps = {
    exhibitions: Exhibition[]
    onEdit: (exhibition: Exhibition) => void
    onDelete: (exhibition: Exhibition) => void
    onCurate: (exhibition: Exhibition) => void
}

export function ExhibitionList({ exhibitions, onEdit, onDelete, onCurate }: ExhibitionListProps) {
    if (exhibitions.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">No exhibitions found.</p>
                <p className="text-sm text-gray-400">Create your first exhibition to get started.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitions.map((exhibition) => (
                <div key={exhibition.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group flex flex-col">
                    <div className="relative h-48 bg-gray-100">
                        {exhibition.cover_image_url ? (
                            <Image
                                src={exhibition.cover_image_url}
                                alt={exhibition.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No Cover Image
                            </div>
                        )}
                        <div className="absolute top-3 right-3">
                            <span className={`
                                px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm
                                ${exhibition.status === 'published' ? 'bg-green-100 text-green-700' : ''}
                                ${exhibition.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : ''}
                                ${exhibition.status === 'archived' ? 'bg-gray-100 text-gray-700' : ''}
                            `}>
                                {exhibition.status.charAt(0).toUpperCase() + exhibition.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg text-[#111111] mb-1">{exhibition.title}</h3>
                        <div className="text-xs text-gray-500 mb-4">
                            {exhibition.start_date ? new Date(exhibition.start_date).toLocaleDateString() : 'TBD'}
                            {' - '}
                            {exhibition.end_date ? new Date(exhibition.end_date).toLocaleDateString() : 'TBD'}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                            {exhibition.description ? exhibition.description.replace(/<[^>]*>?/gm, '') : <span className="italic text-gray-400">No description</span>}
                        </p>

                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                            <button
                                onClick={() => onCurate(exhibition)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#111111] text-white rounded-md text-sm hover:bg-[#333] transition-colors"
                            >
                                <SquaresFour size={16} />
                                Curate
                            </button>
                            <button
                                onClick={() => onEdit(exhibition)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-gray-200"
                                title="Edit Details"
                            >
                                <PencilSimple size={18} />
                            </button>
                            <button
                                onClick={() => onDelete(exhibition)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-gray-200"
                                title="Delete"
                            >
                                <Trash size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
