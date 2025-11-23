'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Plus,
    UploadSimple,
    MagicWand,
    WarningCircle,
    FilePdf,
    FileArchive,
    CaretRight,
    CheckCircle,
    X
} from '@phosphor-icons/react'
import Image from 'next/image'
import { createArtwork, updateArtwork, deleteArtwork } from '@/app/dashboard/inventory/actions'

type Artwork = {
    id: string
    title: string
    medium: string | null
    dimensions: string | null
    price: number | null
    collection: string | null
    status: string | null
    image_url: string | null
}

export function InventoryClient({ initialArtworks }: { initialArtworks: Artwork[] }) {
    const router = useRouter()

    // Debug logging
    console.log('InventoryClient rendered with artworks:', initialArtworks)

    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Artwork | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'sold' | 'draft'>('all')

    const filteredArtworks = initialArtworks.filter(item => {
        if (filterStatus === 'all') return true
        return item.status === filterStatus
    })

    const openEditor = (item: Artwork) => {
        setSelectedItem(item)
        setPreviewUrl(item.image_url)
        setIsCreating(false)
        setIsEditorOpen(true)
    }

    const openCreateEditor = () => {
        setSelectedItem(null)
        setPreviewUrl(null)
        setIsCreating(true)
        setIsEditorOpen(true)
    }

    const closeEditor = () => {
        setIsEditorOpen(false)
        setTimeout(() => {
            setSelectedItem(null)
            setPreviewUrl(null)
            setIsCreating(false)
        }, 300)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async (formData: FormData) => {
        if (isSaving) return // Prevent double submission
        setIsSaving(true)

        try {
            let result
            if (isCreating) {
                result = await createArtwork(formData)
            } else if (selectedItem) {
                result = await updateArtwork(selectedItem.id, formData)
            }

            if (result?.error) {
                alert(`Error: ${result.error}`)
                return
            }

            router.refresh()
            closeEditor()
        } finally {
            setIsSaving(false)
        }
    }



    const handleDelete = async () => {
        if (selectedItem) {
            if (confirm('Are you sure you want to delete this artwork?')) {
                const result = await deleteArtwork(selectedItem.id)
                if (result?.error) {
                    alert(`Error: ${result.error}`)
                    return
                }
                router.refresh()
                closeEditor()
            }
        }
    }

    // Drag and Drop Handlers
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            // For MVP, we'll just take the first file and open the create editor with it
            // In a real app, we'd handle batch uploads
            const file = files[0]
            if (file.type.startsWith('image/')) {
                openCreateEditor()
                // We need a small delay to let the editor render before setting the preview
                // Ideally we'd pass the file to the editor, but for now we'll just set the preview
                // and let the user re-select the file in the input (limitation of file inputs)
                // OR we can use a hidden file input and manually set files, but that's tricky in React.
                // Better UX for now: Open editor and show the preview, but user has to drop again or select.
                // Actually, let's just alert for now as batch upload is complex.
                alert('Batch upload coming soon! Please use "Add Single Item" to upload images.')
            }
        }
    }

    return (
        <div className="relative min-h-screen">
            <header className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl text-[#111111]">Inventory</h1>
                <button
                    onClick={openCreateEditor}
                    className="bg-[#111111] text-white border-none px-4 py-2.5 rounded-md text-sm cursor-pointer flex items-center gap-2 hover:bg-[#333] transition-colors"
                >
                    <Plus size={16} weight="bold" /> Add Single Item
                </button>
            </header>

            {/* SMART DROPZONE */}
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`bg-white border-2 border-dashed rounded-lg p-10 text-center mb-10 transition-all cursor-pointer group ${isDragging ? 'border-[#111] bg-[#fafafa]' : 'border-[#ccc] hover:border-[#111] hover:bg-[#fafafa]'}`}
            >
                <div className="flex justify-center mb-2.5">
                    <UploadSimple size={32} className={`transition-colors ${isDragging ? 'text-[#111]' : 'text-[#ccc] group-hover:text-[#111]'}`} />
                </div>
                <div className="font-semibold text-lg mb-1.5 text-[#111111]">Drag & Drop Batch Upload</div>
                <div className="text-[#666666] text-sm">
                    Max 20 images per batch.
                    <span className="text-[#f57f17] font-medium ml-1.5 inline-flex items-center gap-1">
                        <MagicWand size={16} weight="fill" /> AI Auto-Tagging Enabled
                    </span>
                </div>
            </div>

            {/* TOOLBAR */}
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
                        <WarningCircle size={16} /> Needs Review ({initialArtworks.filter(i => i.status === 'draft').length})
                    </div>
                </div>
                <div className="flex gap-2.5">
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 bg-white rounded-md text-sm text-[#111111] hover:bg-gray-50 hover:border-gray-300 transition-colors">
                        <FilePdf size={16} /> PDF Sheet
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 bg-white rounded-md text-sm text-[#111111] hover:bg-gray-50 hover:border-gray-300 transition-colors">
                        <FileArchive size={16} /> Export .zip
                    </button>
                </div>
            </div>

            {/* DATA GRID */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#fafafa] border-b border-gray-200 text-left">
                            <th className="p-4 pl-5 text-xs uppercase text-[#666666] font-semibold w-[60px]">Image</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Title / Description</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Collection</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Medium</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Price</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Status</th>
                            <th className="p-4 w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArtworks.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-[#666666]">
                                    No artworks found. Add one to get started.
                                </td>
                            </tr>
                        )}
                        {filteredArtworks.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => openEditor(item)}
                                className="border-b border-gray-50 last:border-none hover:bg-[#fcfcfc] cursor-pointer transition-colors"
                            >
                                <td className="p-4 pl-5">
                                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative">
                                        {item.image_url && <Image src={item.image_url} alt={item.title} fill className="object-cover" />}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-sm text-[#111111]">{item.title}</div>
                                    <div className="text-xs text-[#888888]">{item.dimensions}</div>
                                </td>
                                <td className="p-4">
                                    {item.collection ? (
                                        <span className="text-xs bg-[#f0f0f0] px-2 py-0.5 rounded text-[#555] font-mono">
                                            {item.collection}
                                        </span>
                                    ) : (
                                        <span className="text-[#ccc] text-sm">--</span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-[#111111]">{item.medium}</td>
                                <td className={`p-4 text-sm ${!item.price ? 'text-[#aaa]' : 'text-[#111111]'}`}>
                                    {item.price ? `$${item.price}` : '--'}
                                </td>
                                <td className="p-4">
                                    <span className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                    ${item.status === 'available' ? 'bg-[#e8f5e9] text-[#2e7d32]' : ''}
                    ${item.status === 'sold' ? 'bg-[#ffebee] text-[#c62828]' : ''}
                    ${item.status === 'draft' ? 'bg-[#fff8e1] text-[#f57f17]' : ''}
                  `}>
                                        {item.status === 'available' && <CheckCircle size={14} weight="fill" />}
                                        {item.status === 'draft' && (
                                            <span className="relative flex h-2 w-2 mr-0.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f57f17] opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f57f17]"></span>
                                            </span>
                                        )}
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-[#ccc]">
                                    <CaretRight size={16} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* SLIDE-OVER EDIT PANEL */}
            <div
                className={`fixed top-0 right-0 w-[450px] h-full bg-white border-l border-gray-200 shadow-[-5px_0_30px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-in-out flex flex-col ${isEditorOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <form action={handleSave} className="flex flex-col h-full">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#fafafa]">
                        <h3 className="font-semibold text-lg text-[#111111]">
                            {isCreating ? 'Add New Artwork' : 'Edit Artwork'}
                        </h3>
                        <button type="button" onClick={closeEditor} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-[#111111]">
                            <X size={20} />
                        </button>
                    </div>

                    {/* AI Warning Banner (Only show for drafts/new items for now as a demo) */}
                    {(isCreating || selectedItem?.status === 'draft') && (
                        <div className="bg-[#fff8e1] text-[#f57f17] px-5 py-2.5 text-xs font-medium flex items-center gap-2 border-b border-black/5">
                            <MagicWand size={16} weight="fill" />
                            Data generated by AI. Please verify.
                        </div>
                    )}

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
                                    onChange={handleFileSelect}
                                />
                            </div>
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
                            <label className="block text-xs font-semibold mb-1.5 text-[#444]">Collection / Series</label>
                            <input
                                name="collection"
                                type="text"
                                defaultValue={selectedItem?.collection || ''}
                                placeholder="e.g. Desert Series"
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm font-sans focus:outline-none focus:border-[#111111] transition-colors"
                            />
                            <div className="text-xs text-[#888888] mt-1.5 font-mono">
                                Used for file export renaming: Title_Collection.jpg
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

                        <div className="mb-5">
                            <label className="block text-xs font-semibold mb-1.5 text-[#444]">Status</label>
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
                    </div>

                    <div className="p-5 border-t border-gray-200 flex justify-between gap-2.5 bg-white">
                        {!isCreating && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-md text-sm cursor-pointer hover:bg-red-50 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                        <div className="flex gap-2.5 ml-auto">
                            <button type="button" onClick={closeEditor} className="px-5 py-2.5 bg-white border border-gray-200 rounded-md text-sm cursor-pointer hover:bg-gray-50 transition-colors text-[#111111]">
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
            {isEditorOpen && (
                <div
                    onClick={closeEditor}
                    className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                />
            )}
        </div>
    )
}
