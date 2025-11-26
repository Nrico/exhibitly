'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, UploadSimple } from '@phosphor-icons/react'
import { Exhibition } from '@/types'

type ExhibitionFormProps = {
    isOpen: boolean
    isCreating: boolean
    selectedItem: Exhibition | null
    previewUrl: string | null
    onClose: () => void
    onSave: (formData: FormData) => Promise<void>
    onDelete: () => Promise<void>
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ExhibitionForm({
    isOpen,
    isCreating,
    selectedItem,
    previewUrl,
    onClose,
    onSave,
    onDelete,
    onFileSelect
}: ExhibitionFormProps) {
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
                className={`fixed top-0 right-0 w-[500px] h-full bg-white border-l border-gray-200 shadow-[-5px_0_30px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <form action={handleSubmit} className="flex flex-col h-full">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#fafafa]">
                        <h3 className="font-semibold text-lg text-[#111111]">
                            {isCreating ? 'Create Exhibition' : 'Edit Exhibition'}
                        </h3>
                        <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-[#111111]">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-5 overflow-y-auto flex-1">
                        <div className="text-center mb-5">
                            <div className="relative w-full h-[250px] bg-[#eee] rounded-md overflow-hidden group cursor-pointer">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Cover Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-2">
                                        <UploadSimple size={32} />
                                        <span className="text-xs">Upload Cover Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-sm font-medium">Change Cover</span>
                                </div>
                                <input
                                    type="file"
                                    name="coverImage"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={onFileSelect}
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold mb-1.5 text-[#444]">Exhibition Title</label>
                            <input
                                name="title"
                                type="text"
                                defaultValue={selectedItem?.title || ''}
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 text-[#444]">Start Date</label>
                                <input
                                    name="startDate"
                                    type="date"
                                    defaultValue={selectedItem?.start_date || ''}
                                    className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 text-[#444]">End Date</label>
                                <input
                                    name="endDate"
                                    type="date"
                                    defaultValue={selectedItem?.end_date || ''}
                                    className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold mb-1.5 text-[#444]">Description</label>
                            <div className="text-xs text-[#888] mb-1">Supports HTML (e.g. &lt;p&gt;, &lt;b&gt;)</div>
                            <textarea
                                name="description"
                                defaultValue={selectedItem?.description || ''}
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors min-h-[150px]"
                                placeholder="Describe the exhibition concept..."
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold mb-1.5 text-[#444]">Status</label>
                            <select
                                name="status"
                                defaultValue={selectedItem?.status || 'draft'}
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors bg-white"
                            >
                                <option value="draft">Draft (Hidden)</option>
                                <option value="published">Published (Visible)</option>
                                <option value="archived">Archived (Past)</option>
                            </select>
                        </div>
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
                                {isSaving ? 'Saving...' : (isCreating ? 'Create Exhibition' : 'Save Changes')}
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
