'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Plus,
    UploadSimple,
    MagicWand,
    WarningCircle,
    CaretRight,
    CheckCircle,
    X,
    DotsSixVertical
} from '@phosphor-icons/react'
import Image from 'next/image'
import { createArtwork, updateArtwork, deleteArtwork, reorderArtworks } from '@/app/dashboard/inventory/actions'
import { processImage } from '@/utils/image-processing'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Artwork = {
    id: string
    title: string
    medium: string | null
    dimensions: string | null
    price: number | null
    collection: string | null
    status: string | null
    image_url: string | null
    description: string | null
    position?: number
}

function RowContent({ item, openEditor, dragHandle }: { item: Artwork, openEditor: (item: Artwork) => void, dragHandle?: React.ReactNode }) {
    return (
        <>
            <td className="p-4 w-[40px]">
                {dragHandle}
            </td>
            <td className="p-4 pl-0" onClick={() => openEditor(item)}>
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative cursor-pointer">
                    {item.image_url && <Image src={item.image_url} alt={item.title} fill className="object-cover" />}
                </div>
            </td>
            <td className="p-4 cursor-pointer" onClick={() => openEditor(item)}>
                <div className="font-medium text-sm text-[#111111]">{item.title}</div>
                <div className="text-xs text-[#888888]">{item.dimensions}</div>
            </td>
            <td className="p-4 cursor-pointer" onClick={() => openEditor(item)}>
                {item.collection ? (
                    <span className="text-xs bg-[#f0f0f0] px-2 py-0.5 rounded text-[#555] font-mono">
                        {item.collection}
                    </span>
                ) : (
                    <span className="text-[#ccc] text-sm">--</span>
                )}
            </td>
            <td className="p-4 text-sm text-[#111111] cursor-pointer" onClick={() => openEditor(item)}>{item.medium}</td>
            <td className={`p-4 text-sm cursor-pointer ${!item.price ? 'text-[#aaa]' : 'text-[#111111]'}`} onClick={() => openEditor(item)}>
                {item.price ? `$${item.price}` : '--'}
            </td>
            <td className="p-4 cursor-pointer" onClick={() => openEditor(item)}>
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
            <td className="p-4 text-[#ccc] cursor-pointer" onClick={() => openEditor(item)}>
                <CaretRight size={16} />
            </td>
        </>
    )
}

function SortableRow({ item, openEditor }: { item: Artwork, openEditor: (item: Artwork) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: isDragging ? 'relative' as const : undefined,
    }

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`border-b border-gray-50 last:border-none hover:bg-[#fcfcfc] transition-colors ${isDragging ? 'bg-gray-50 shadow-md' : ''}`}
        >
            <RowContent
                item={item}
                openEditor={openEditor}
                dragHandle={
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-2">
                        <DotsSixVertical size={20} />
                    </div>
                }
            />
        </tr>
    )
}

function StaticRow({ item, openEditor }: { item: Artwork, openEditor: (item: Artwork) => void }) {
    return (
        <tr className="border-b border-gray-50 last:border-none hover:bg-[#fcfcfc] transition-colors">
            <RowContent
                item={item}
                openEditor={openEditor}
                dragHandle={
                    <div className="text-gray-300 p-2 cursor-not-allowed">
                        <DotsSixVertical size={20} />
                    </div>
                }
            />
        </tr>
    )
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

    const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks)
    const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'sold' | 'draft'>('all')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Update local state when initialArtworks changes (e.g. after server action refresh)
    useEffect(() => {
        setArtworks(initialArtworks)
    }, [initialArtworks])
    // Sync with server state on re-render if needed, but careful with drag state.
    // For now, we'll initialize state.

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setArtworks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)

                // Call server action to persist order
                // We need to send the new order of IDs
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    position: index
                }))

                reorderArtworks(updates)

                return newItems
            })
        }
    }

    const filteredArtworks = artworks.filter(item => {
        if (filterStatus === 'all') return true
        return item.status === filterStatus
    })

    // Derive unique collections from existing artworks
    const uniqueCollections = Array.from(new Set(initialArtworks.map(item => item.collection).filter(Boolean))) as string[]

    const openEditor = (item: Artwork) => {
        setSelectedItem(item)
        setPreviewUrl(item.image_url)
        setIsCreating(false)
        setIsEditorOpen(true)
    }

    const [pendingFile, setPendingFile] = useState<File | null>(null)

    const openCreateEditor = (file?: File) => {
        setSelectedItem(null)
        setIsCreating(true)
        setIsEditorOpen(true)

        if (file) {
            setPendingFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        } else {
            setPendingFile(null)
            setPreviewUrl(null)
        }
    }

    const closeEditor = () => {
        setIsEditorOpen(false)
        setTimeout(() => {
            setSelectedItem(null)
            setPreviewUrl(null)
            setPendingFile(null)
            setIsCreating(false)
        }, 300)
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                // Process image immediately upon selection
                const processedFile = await processImage(file)
                const url = URL.createObjectURL(processedFile)
                setPreviewUrl(url)
                setPendingFile(processedFile) // Store the processed file
            } catch (error) {
                console.error('Error processing image:', error)
                alert('Error processing image. Please try another file.')
            }
        }
    }

    const [isSaving, setIsSaving] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<{ current: number, total: number } | null>(null)

    const handleSave = async (formData: FormData) => {
        if (isSaving) return // Prevent double submission
        setIsSaving(true)

        try {
            // If we have a pending processed file (from drag-drop or manual select), use it
            // We prioritize pendingFile because it contains the optimized version
            if (pendingFile) {
                formData.set('image', pendingFile)
            }

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

            // Optimistic Update
            if (isCreating) {
                // We can't easily guess the ID, so we'll rely on router.refresh() for creation
                // But we can force a re-fetch or just wait. 
                // Actually, for creation, the router.refresh() usually works well enough because the list grows.
                // But let's rely on the useEffect above to catch the new prop.
            } else if (selectedItem) {
                // For updates, we can update the local state immediately
                setArtworks(prev => prev.map(item =>
                    item.id === selectedItem.id
                        ? { ...item, ...Object.fromEntries(formData), price: formData.get('price') ? parseFloat(formData.get('price') as string) : null } as any // Cast for simplicity, ideally stricter
                        : item
                ))
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
                // Optimistic Delete
                setArtworks(prev => prev.filter(item => item.id !== selectedItem.id))

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
            // Filter for images only
            const imageFiles = files.filter(file => file.type.startsWith('image/'))

            if (imageFiles.length === 0) {
                alert('Please upload image files.')
                return
            }

            // Batch Upload Logic
            setUploadProgress({ current: 0, total: imageFiles.length })

            try {
                let successCount = 0

                for (let i = 0; i < imageFiles.length; i++) {
                    const file = imageFiles[i]
                    setUploadProgress({ current: i + 1, total: imageFiles.length })

                    try {
                        // 1. Process Image
                        const processedFile = await processImage(file)

                        // 2. Prepare Form Data
                        const formData = new FormData()
                        formData.set('image', processedFile)
                        // Use filename as title (remove extension)
                        const title = file.name.replace(/\.[^/.]+$/, "")
                        formData.set('title', title)
                        formData.set('status', 'draft')

                        // 3. Create Artwork
                        const result = await createArtwork(formData)

                        if (!result?.error) {
                            successCount++
                        } else {
                            console.error(`Failed to upload ${file.name}:`, result.error)
                        }
                    } catch (err) {
                        console.error(`Error processing ${file.name}:`, err)
                    }
                }

                router.refresh()

                if (successCount === imageFiles.length) {
                    // All good
                } else {
                    alert(`Uploaded ${successCount} of ${imageFiles.length} images. Check console for errors.`)
                }

            } catch (error) {
                console.error('Batch upload error:', error)
                alert('An error occurred during batch upload.')
            } finally {
                setUploadProgress(null)
            }
        }
    }

    return (
        <div className="relative min-h-screen">
            <header className="flex justify-between items-center mb-8">
                <h1 className="font-serif text-4xl text-[#111111]">Inventory</h1>
                <button
                    onClick={() => openCreateEditor()}
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
                {uploadProgress ? (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#111] rounded-full animate-spin mb-4"></div>
                        <div className="font-semibold text-lg text-[#111111]">Uploading...</div>
                        <div className="text-[#666666] text-sm mt-1">
                            Processing image {uploadProgress.current} of {uploadProgress.total}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-2.5">
                            <UploadSimple size={32} className={`transition-colors ${isDragging ? 'text-[#111]' : 'text-[#ccc] group-hover:text-[#111]'}`} />
                        </div>
                        <div className="font-semibold text-lg mb-1.5 text-[#111111]">Drag & Drop Batch Upload</div>
                        <div className="text-[#666666] text-sm">
                            Drop multiple images to create draft artworks.
                        </div>
                    </>
                )}
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
                <div className="flex gap-2.5 opacity-50 pointer-events-none grayscale">
                    {/* Placeholder buttons removed */}
                </div>
            </div>

            {/* DATA GRID */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {mounted ? (
                    <DndContext
                        id="inventory-dnd-context"
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#fafafa] border-b border-gray-200 text-left">
                                    <th className="p-4 w-[40px]"></th>
                                    <th className="p-4 pl-0 text-xs uppercase text-[#666666] font-semibold w-[60px]">Image</th>
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
                                        <td colSpan={8} className="p-8 text-center text-[#666666]">
                                            No artworks found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                                <SortableContext
                                    items={filteredArtworks.map(item => item.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {filteredArtworks.map((item) => (
                                        <SortableRow key={item.id} item={item} openEditor={openEditor} />
                                    ))}
                                </SortableContext>
                            </tbody>
                        </table>
                    </DndContext>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#fafafa] border-b border-gray-200 text-left">
                                <th className="p-4 w-[40px]"></th>
                                <th className="p-4 pl-0 text-xs uppercase text-[#666666] font-semibold w-[60px]">Image</th>
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
                                    <td colSpan={8} className="p-8 text-center text-[#666666]">
                                        No artworks found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                            {filteredArtworks.map((item) => (
                                <StaticRow key={item.id} item={item} openEditor={openEditor} />
                            ))}
                        </tbody>
                    </table>
                )}
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

                    {/* AI Warning Banner REMOVED */}

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
