'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Plus, Check, DotsSixVertical } from '@phosphor-icons/react'
import { Exhibition, Artwork } from '@/types'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type ExhibitionCuratorProps = {
    isOpen: boolean
    exhibition: Exhibition | null
    allArtworks: Artwork[]
    initialSelectedIds: string[]
    onClose: () => void
    onSave: (artworkIds: string[]) => Promise<void>
}

function SortableItem({ id, artwork, onRemove }: { id: string, artwork: Artwork, onRemove: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md mb-2 group">
            <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
                <DotsSixVertical size={20} />
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                {artwork.image_url && <Image src={artwork.image_url} alt={artwork.title} fill className="object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{artwork.title}</div>
                <div className="text-xs text-gray-500 truncate">{artwork.medium}</div>
            </div>
            <button
                onClick={onRemove}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    )
}

export function ExhibitionCurator({
    isOpen,
    exhibition,
    allArtworks,
    initialSelectedIds,
    onClose,
    onSave
}: ExhibitionCuratorProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds)
    const [isSaving, setIsSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        setSelectedIds(initialSelectedIds)
    }, [initialSelectedIds, isOpen])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setSelectedIds((items) => {
                const oldIndex = items.indexOf(active.id as string)
                const newIndex = items.indexOf(over.id as string)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await onSave(selectedIds)
            onClose()
        } finally {
            setIsSaving(false)
        }
    }

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id))
        } else {
            setSelectedIds(prev => [...prev, id])
        }
    }

    const selectedArtworks = selectedIds
        .map(id => allArtworks.find(a => a.id === id))
        .filter(Boolean) as Artwork[]

    const availableArtworks = allArtworks.filter(a =>
        !selectedIds.includes(a.id) &&
        (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.artist_id?.toLowerCase().includes(searchQuery.toLowerCase())) // Ideally search by artist name too if we had it joined
    )

    return (
        <>
            <div
                className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

                <div className={`absolute inset-y-0 right-0 w-[900px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#fafafa]">
                        <div>
                            <h3 className="font-semibold text-lg text-[#111111]">Curate Exhibition</h3>
                            <p className="text-sm text-gray-500">{exhibition?.title}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-[#111111] text-white rounded-md text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {isSaving && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                Save Changes
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-md transition-colors text-[#111111]">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Left: Available Artworks */}
                        <div className="w-1/2 border-r border-gray-200 flex flex-col bg-gray-50">
                            <div className="p-4 border-b border-gray-200 bg-white">
                                <input
                                    type="text"
                                    placeholder="Search inventory..."
                                    className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#111111]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Available Inventory ({availableArtworks.length})</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableArtworks.map(artwork => (
                                        <div
                                            key={artwork.id}
                                            onClick={() => toggleSelection(artwork.id)}
                                            className="bg-white border border-gray-200 rounded-md overflow-hidden cursor-pointer hover:border-blue-500 hover:shadow-sm transition-all group relative"
                                        >
                                            <div className="relative h-32 bg-gray-100">
                                                {artwork.image_url && (
                                                    <Image src={artwork.image_url} alt={artwork.title} fill className="object-cover" />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all">
                                                        <Plus size={16} className="text-blue-600" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <div className="font-medium text-sm truncate text-[#111]">{artwork.title}</div>
                                                <div className="text-xs text-gray-500 truncate">{artwork.medium}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {availableArtworks.length === 0 && (
                                        <div className="col-span-2 text-center py-10 text-gray-400 text-sm">
                                            No matching artworks found.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Selected Artworks (Sortable) */}
                        <div className="w-1/2 flex flex-col bg-white">
                            <div className="p-4 border-b border-gray-200 bg-[#fafafa]">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase">Selected Works ({selectedIds.length})</h4>
                                    <span className="text-xs text-gray-400">Drag to reorder</span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={selectedIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {selectedArtworks.map((artwork) => (
                                            <SortableItem
                                                key={artwork.id}
                                                id={artwork.id}
                                                artwork={artwork}
                                                onRemove={() => toggleSelection(artwork.id)}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                                {selectedIds.length === 0 && (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-lg">
                                        <p className="text-gray-400 text-sm">Select artworks from the left to add them to this exhibition.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
