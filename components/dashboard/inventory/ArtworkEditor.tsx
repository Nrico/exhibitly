'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, UploadSimple } from '@phosphor-icons/react'
import { Artwork } from '@/types'

type ArtworkEditorProps = {
    isOpen: boolean
    isCreating: boolean
    selectedItem: Artwork | null
    previewUrl: string | null
    uniqueCollections: string[]
    onClose: () => void
    onSave: (formData: FormData) => Promise<void>
    onDelete: () => Promise<void>
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
    artists: any[]
}

export function ArtworkEditor({
    isOpen,
    isCreating,
    selectedItem,
    previewUrl,
    uniqueCollections,
    onClose,
    onSave,
    onDelete,
    onFileSelect,
    artists = []
}: ArtworkEditorProps) {
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsSaving(true)
        try {
            await onSave(formData)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <>
            <div
                className={`fixed top-0 right-0 w-[450px] h-full bg-white border-l border-gray-200 shadow-[-5px_0_30px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <form key={selectedItem?.id || 'new'} action={handleSubmit} className="flex flex-col h-full">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#fafafa]">
                        <h3 className="font-semibold text-lg text-[#111111]">
                            {isCreating ? 'Add New Artwork' : 'Edit Artwork'}
                        </h3>
                        <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-[#111111]">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-5 overflow-y-auto flex-1">
                        <div className="text-center mb-5">
                            <div className="relative w-full h-[200px] bg-[#eee] rounded-md overflow-hidden group cursor-pointer">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Preview"
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <UploadSimple size={32} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-sm font-medium">Change Image</span>
                                </div>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={onFileSelect}
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold mb-1.5 text-[#444]">Artist</label>
                            <select
                                name="artist_id"
                                defaultValue={selectedItem?.artist_id || ''}
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors bg-white"
                            >
                                <option value="">Select Artist (Optional)</option>
                                {artists.map((artist: any) => (
                                    <option key={artist.id} value={artist.id}>
                                        {artist.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold mb-1.5 text-[#444]">Title</label>
                            <input
                                name="title"
                                type="text"
                                defaultValue={selectedItem?.title || ''}
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold mb-1.5 text-[#444]">Description</label>
                            <div className="text-xs text-[#888] mb-1">Supports HTML (e.g. &lt;p&gt;, &lt;b&gt;)</div>
                            <textarea
                                name="description"
                                defaultValue={selectedItem?.description || ''}
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors min-h-[100px]"
                                placeholder="Describe the artwork..."
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold mb-1.5 text-[#444]">Collection / Series</label>
                            <input
                                name="collection"
                                type="text"
                                list="collection-options"
                                defaultValue={selectedItem?.collection || ''}
                                placeholder="Select or type new collection..."
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors"
                            />
                            <datalist id="collection-options">
                                {uniqueCollections.map(collection => (
                                    <option key={collection} value={collection} />
                                ))}
                            </datalist>
                            <div className="text-xs text-[#888888] mt-1.5 font-mono">
                                Group artworks into series. Clear text to remove.
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 text-[#444]">Medium</label>
                                <input
                                    name="medium"
                                    type="text"
                                    defaultValue={selectedItem?.medium || ''}
                                    className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 text-[#444]">Price ($)</label>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={selectedItem?.price || ''}
                                    placeholder="0.00"
                                    className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold mb-1.5 text-[#444]">Dimensions</label>
                            <input
                                name="dimensions"
                                type="text"
                                defaultValue={selectedItem?.dimensions || ''}
                                placeholder='24" x 36"'
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors"
                            />
                        </div>

                        <select
                            name="status"
                            defaultValue={selectedItem?.status || 'draft'}
                            className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors bg-white"
                        >
                            <option value="available">Available</option>
                            <option value="sold">Sold</option>
                            <option value="hidden">Hidden</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    {/* Notify Subscribers Option */}
                    <div className="mb-5 p-4 bg-[#f8f9fa] rounded-md border border-gray-200 mx-5">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="notify_subscribers"
                                value="true"
                                className="mt-1 w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                            />
                            <div>
                                <span className="block text-sm font-semibold text-[#111]">Notify Subscribers?</span>
                                <span className="block text-xs text-[#666] mt-0.5">
                                    Send an email blast to everyone who has inquired about your work.
                                    Only works if status is set to <strong>Available</strong>.
                                </span>
                            </div>
                        </label>
                    </div>

                    <div className="p-5 border-t border-gray-200 flex justify-between gap-2.5 bg-white">
                        {!isCreating && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-md text-sm cursor-pointer hover:bg-red-50 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                        <div className="flex gap-2.5 ml-auto">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-gray-200 rounded-md text-sm cursor-pointer hover:bg-gray-50 transition-colors text-[#111111]">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-5 py-2.5 bg-[#111111] text-white border-none rounded-md text-sm font-medium cursor-pointer hover:bg-[#333] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {isSaving ? 'Saving...' : (isCreating ? 'Create Artwork' : 'Save Changes')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                />
            )}
        </>
    )
}
