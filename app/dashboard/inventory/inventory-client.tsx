'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { createArtwork, updateArtwork, deleteArtwork, reorderArtworks } from '@/app/dashboard/inventory/actions'
import { processImage } from '@/utils/image-processing'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { Artwork } from '@/types'
import { ArtworkTable } from '@/components/dashboard/inventory/ArtworkTable'
import { ArtworkEditor } from '@/components/dashboard/inventory/ArtworkEditor'
import { BatchUpload } from '@/components/dashboard/inventory/BatchUpload'
import { InventoryToolbar } from '@/components/dashboard/inventory/InventoryToolbar'

export function InventoryClient({ initialArtworks, initialArtists = [] }: { initialArtworks: Artwork[], initialArtists?: any[] }) {
    const router = useRouter()

    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Artwork | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks)
    const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'sold' | 'draft'>('all')
    const [mounted, setMounted] = useState(false)
    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState<{ current: number, total: number } | null>(null)

    const searchParams = useSearchParams()

    useEffect(() => {
        setMounted(true)
        if (searchParams.get('new') === 'true') {
            // Small delay to ensure UI is ready
            setTimeout(() => openCreateEditor(), 100)
        }
    }, [searchParams])

    useEffect(() => {
        setArtworks(initialArtworks)
    }, [initialArtworks])

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = artworks.findIndex((item) => item.id === active.id)
            const newIndex = artworks.findIndex((item) => item.id === over.id)

            const newItems = arrayMove(artworks, oldIndex, newIndex)

            // Optimistic update
            setArtworks(newItems)

            // Call server action to persist order
            const updates = newItems.map((item, index) => ({
                id: item.id,
                position: index
            }))

            await reorderArtworks(updates)
            toast.success('Order saved')
        }
    }

    const filteredArtworks = artworks.filter(item => {
        if (filterStatus === 'all') return true
        return item.status === filterStatus
    })

    const uniqueCollections = Array.from(new Set(initialArtworks.map(item => item.collection).filter(Boolean))) as string[]

    const openEditor = (item: Artwork) => {
        setSelectedItem(item)
        setPreviewUrl(item.image_url)
        setIsCreating(false)
        setIsEditorOpen(true)
    }

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
                const processedFile = await processImage(file)
                const url = URL.createObjectURL(processedFile)
                setPreviewUrl(url)
                setPendingFile(processedFile)
            } catch (error) {
                console.error('Error processing image:', error)
                alert('Error processing image. Please try another file.')
            }
        }
    }

    const handleSave = async (formData: FormData) => {
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

        if (selectedItem) {
            setArtworks(prev => prev.map(item =>
                item.id === selectedItem.id
                    ? { ...item, ...Object.fromEntries(formData), price: formData.get('price') ? parseFloat(formData.get('price') as string) : null } as any
                    : item
            ))
        }

        router.refresh()
        closeEditor()
    }

    const handleDelete = async () => {
        if (selectedItem) {
            if (confirm('Are you sure you want to delete this artwork?')) {
                const result = await deleteArtwork(selectedItem.id)
                if (result?.error) {
                    alert(`Error: ${result.error}`)
                    return
                }
                setArtworks(prev => prev.filter(item => item.id !== selectedItem.id))
                router.refresh()
                closeEditor()
            }
        }
    }

    // Drag and Drop Handlers for Batch Upload
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
            const imageFiles = files.filter(file => file.type.startsWith('image/'))

            if (imageFiles.length === 0) {
                alert('Please upload image files.')
                return
            }

            setUploadProgress({ current: 0, total: imageFiles.length })

            try {
                let successCount = 0

                for (let i = 0; i < imageFiles.length; i++) {
                    const file = imageFiles[i]
                    setUploadProgress({ current: i + 1, total: imageFiles.length })

                    try {
                        const processedFile = await processImage(file)
                        const formData = new FormData()
                        formData.set('image', processedFile)
                        const title = file.name.replace(/\.[^/.]+$/, "")
                        formData.set('title', title)
                        formData.set('status', 'draft')

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

                if (successCount !== imageFiles.length) {
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

            <BatchUpload
                isDragging={isDragging}
                uploadProgress={uploadProgress}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            />

            <InventoryToolbar
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                draftCount={initialArtworks.filter(i => i.status === 'draft').length}
            />

            <ArtworkTable
                artworks={filteredArtworks}
                mounted={mounted}
                openEditor={openEditor}
                handleDragEnd={handleDragEnd}
                artists={initialArtists}
            />

            <ArtworkEditor
                isOpen={isEditorOpen}
                isCreating={isCreating}
                selectedItem={selectedItem}
                previewUrl={previewUrl}
                uniqueCollections={uniqueCollections}
                onClose={closeEditor}
                onSave={handleSave}
                onDelete={handleDelete}
                onFileSelect={handleFileSelect}
                artists={initialArtists}
            />
        </div>
    )
}
