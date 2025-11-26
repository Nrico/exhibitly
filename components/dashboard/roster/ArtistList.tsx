'use client'

import Image from 'next/image'
import { Artist } from '@/types'
import { PencilSimple, Trash } from '@phosphor-icons/react'

type ArtistListProps = {
    artists: Artist[]
    onEdit: (artist: Artist) => void
    onDelete: (artist: Artist) => void
}

export function ArtistList({ artists, onEdit, onDelete }: ArtistListProps) {
    if (artists.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">No artists found.</p>
                <p className="text-sm text-gray-400">Add your first artist to get started.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                        <th className="p-4 w-[80px]">Image</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Bio Excerpt</th>
                        <th className="p-4 w-[100px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {artists.map((artist) => (
                        <tr key={artist.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="p-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden relative">
                                    {artist.avatar_url ? (
                                        <Image
                                            src={artist.avatar_url}
                                            alt={artist.full_name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                                            {artist.full_name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 font-medium text-gray-900">
                                {artist.full_name}
                            </td>
                            <td className="p-4 text-sm text-gray-500 max-w-md truncate">
                                {artist.bio ? artist.bio.replace(/<[^>]*>?/gm, '') : <span className="text-gray-300 italic">No bio</span>}
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(artist)}
                                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Edit"
                                    >
                                        <PencilSimple size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(artist)}
                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
