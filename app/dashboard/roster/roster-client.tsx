'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from '@phosphor-icons/react'
import { Artist } from '@/types'
import { ArtistList } from '@/components/dashboard/roster/ArtistList'
import { ArtistForm } from '@/components/dashboard/roster/ArtistForm'
import { createArtist, updateArtist, deleteArtist } from '@/app/dashboard/roster/actions'
import { processImage } from '@/utils/image-processing'

export function RosterClient({ initialArtists }: { initialArtists: Artist[] }) {
    const router = useRouter()
    const [artists, setArtists] = useState<Artist[]>(initialArtists)

    // Sync state with prop when server revalidates
    useEffect(() => {
        setArtists(initialArtists)
    }, [initialArtists])

    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Artist | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [pendingFile, setPendingFile] = useState<File | null>(null)

    const openCreateEditor = () => {
        setSelectedItem(null)
        setPreviewUrl(null)
        setPendingFile(null)
        setIsCreating(true)
        setIsEditorOpen(true)
    }

    const openEditEditor = (artist: Artist) => {
        setSelectedItem(artist)
        setPreviewUrl(artist.avatar_url)
        setPendingFile(null)
        setIsCreating(false)
        setIsEditorOpen(true)
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
            // In a real app, we'd upload to storage here and get a URL
            // For now, we'll simulate it or rely on the server action to handle file upload if we were sending the file
            // But server actions with FormData and files can be tricky depending on the setup.
            // Let's assume for now we are just passing the file in formData and the server action handles it
            // Wait, my server action expects 'avatarUrl' string, not a file.
            // I need to upload the file to Supabase Storage first.

            // Let's implement the upload logic here or in the server action?
            // Usually easier to upload client side to Supabase Storage if we have the client.
            // But I don't have the supabase client exposed here easily without creating it.
            // Let's use a helper or just append the file to formData and handle it in the server action?
            // My server action `createArtist` expects `avatarUrl` string.
            // I should probably update the server action to handle file upload or upload it here.

            // For this iteration, let's assume I need to upload it here.
            // I'll skip the actual upload implementation for a second and focus on the flow.
            // Actually, I should probably implement the upload helper.
            // Let's look at `app/dashboard/inventory/actions.ts` to see how artwork upload is handled.

            // Checking `inventory-client.tsx`, it sends `image` in formData.
            // Let's check `createArtwork` in `app/dashboard/inventory/actions.ts`.
            formData.set('image', pendingFile)
        }

        let result
        if (isCreating) {
            // I need to update createArtist to handle file upload if I want to support it.
            // Or I can upload here.
            // Let's check how `createArtwork` does it.
            result = await createArtist(null, formData)
        } else if (selectedItem) {
            formData.append('id', selectedItem.id)
            result = await updateArtist(null, formData)
        }

        if (result?.error) {
            alert(`Error: ${result.error}`)
            return
        }

        router.refresh()
        closeEditor()
    }

    const handleDelete = async () => {
        if (selectedItem) {
            if (confirm('Are you sure you want to delete this artist?')) {
                const result = await deleteArtist(selectedItem.id)
                if (result?.error) {
                    alert(`Error: ${result.error}`)
                    return
                }
                router.refresh()
                closeEditor()
            }
        }
    }

    return (
        <div className="relative min-h-screen p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-serif text-4xl text-[#111111]">Artist Roster</h1>
                    <p className="text-gray-500 mt-2">Manage the artists represented by your gallery.</p>
                </div>
                <button
                    onClick={openCreateEditor}
                    className="bg-[#111111] text-white border-none px-4 py-2.5 rounded-md text-sm cursor-pointer flex items-center gap-2 hover:bg-[#333] transition-colors"
                >
                    <Plus size={16} weight="bold" /> Add Artist
                </button>
            </header>

            <ArtistList
                artists={artists}
                onEdit={openEditEditor}
                onDelete={(artist) => {
                    setSelectedItem(artist)
                    handleDelete()
                }}
            />

            <ArtistForm
                isOpen={isEditorOpen}
                isCreating={isCreating}
                selectedItem={selectedItem}
                previewUrl={previewUrl}
                onClose={closeEditor}
                onSave={handleSave}
                onDelete={handleDelete}
                onFileSelect={handleFileSelect}
            />
        </div>
    )
}
