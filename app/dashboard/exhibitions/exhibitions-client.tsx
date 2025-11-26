'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from '@phosphor-icons/react'
import { Exhibition, Artwork } from '@/types'
import { ExhibitionList } from '@/components/dashboard/exhibitions/ExhibitionList'
import { ExhibitionForm } from '@/components/dashboard/exhibitions/ExhibitionForm'
import { ExhibitionCurator } from '@/components/dashboard/exhibitions/ExhibitionCurator'
import { createExhibition, updateExhibition, deleteExhibition, getExhibitionArtworks, updateExhibitionArtworks } from '@/app/dashboard/exhibitions/actions'
import { processImage } from '@/utils/image-processing'

export function ExhibitionsClient({ initialExhibitions, allArtworks }: { initialExhibitions: Exhibition[], allArtworks: Artwork[] }) {
    const router = useRouter()
    const [exhibitions, setExhibitions] = useState<Exhibition[]>(initialExhibitions)

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [pendingFile, setPendingFile] = useState<File | null>(null)

    // Curator State
    const [isCuratorOpen, setIsCuratorOpen] = useState(false)
    const [curatorExhibition, setCuratorExhibition] = useState<Exhibition | null>(null)
    const [curatorSelectedIds, setCuratorSelectedIds] = useState<string[]>([])

    // Form Handlers
    const openCreateForm = () => {
        setSelectedExhibition(null)
        setPreviewUrl(null)
        setPendingFile(null)
        setIsCreating(true)
        setIsFormOpen(true)
    }

    const openEditForm = (exhibition: Exhibition) => {
        setSelectedExhibition(exhibition)
        setPreviewUrl(exhibition.cover_image_url)
        setPendingFile(null)
        setIsCreating(false)
        setIsFormOpen(true)
    }

    const closeForm = () => {
        setIsFormOpen(false)
        setTimeout(() => {
            setSelectedExhibition(null)
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

    const handleSaveForm = async (formData: FormData) => {
        if (pendingFile) {
            formData.set('coverImage', pendingFile)
        }

        let result
        if (isCreating) {
            result = await createExhibition(null, formData)
        } else if (selectedExhibition) {
            formData.append('id', selectedExhibition.id)
            result = await updateExhibition(null, formData)
        }

        if (result?.error) {
            alert(`Error: ${result.error}`)
            return
        }

        router.refresh()
        closeForm()
    }

    const handleDelete = async (exhibition: Exhibition) => {
        if (confirm('Are you sure you want to delete this exhibition?')) {
            const result = await deleteExhibition(exhibition.id)
            if (result?.error) {
                alert(`Error: ${result.error}`)
                return
            }
            router.refresh()
            if (isFormOpen) closeForm()
        }
    }

    // Curator Handlers
    const openCurator = async (exhibition: Exhibition) => {
        setCuratorExhibition(exhibition)
        // Fetch existing artworks for this exhibition
        const existingLinks = await getExhibitionArtworks(exhibition.id)
        const ids = existingLinks.map((link: any) => link.artwork_id)
        setCuratorSelectedIds(ids)
        setIsCuratorOpen(true)
    }

    const closeCurator = () => {
        setIsCuratorOpen(false)
        setTimeout(() => {
            setCuratorExhibition(null)
            setCuratorSelectedIds([])
        }, 300)
    }

    const handleSaveCurator = async (artworkIds: string[]) => {
        if (!curatorExhibition) return

        const result = await updateExhibitionArtworks(curatorExhibition.id, artworkIds)

        if (result?.error) {
            alert(`Error: ${result.error}`)
            return
        }

        router.refresh()
    }

    return (
        <div className="relative min-h-screen p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-serif text-4xl text-[#111111]">Exhibitions</h1>
                    <p className="text-gray-500 mt-2">Curate and publish digital shows.</p>
                </div>
                <button
                    onClick={openCreateForm}
                    className="bg-[#111111] text-white border-none px-4 py-2.5 rounded-md text-sm cursor-pointer flex items-center gap-2 hover:bg-[#333] transition-colors"
                >
                    <Plus size={16} weight="bold" /> Create Exhibition
                </button>
            </header>

            <ExhibitionList
                exhibitions={initialExhibitions}
                onEdit={openEditForm}
                onDelete={handleDelete}
                onCurate={openCurator}
            />

            <ExhibitionForm
                isOpen={isFormOpen}
                isCreating={isCreating}
                selectedItem={selectedExhibition}
                previewUrl={previewUrl}
                onClose={closeForm}
                onSave={handleSaveForm}
                onDelete={async () => {
                    if (selectedExhibition) {
                        await handleDelete(selectedExhibition)
                    }
                }}
                onFileSelect={handleFileSelect}
            />

            {curatorExhibition && (
                <ExhibitionCurator
                    isOpen={isCuratorOpen}
                    exhibition={curatorExhibition}
                    allArtworks={allArtworks}
                    initialSelectedIds={curatorSelectedIds}
                    onClose={closeCurator}
                    onSave={handleSaveCurator}
                />
            )}
        </div>
    )
}
