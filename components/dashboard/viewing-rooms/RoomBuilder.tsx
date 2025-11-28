'use client'

import { useState } from 'react'
import { ViewingRoom, RoomItem, Artwork } from '@/types'
import { updateViewingRoom, addRoomItem, removeRoomItem, updateRoomItemOrder } from '@/app/dashboard/viewing-rooms/actions'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash, Star, ArrowLeft, Copy, Check, ArrowSquareOut } from '@phosphor-icons/react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { EmailGenerator } from '@/components/dashboard/email/EmailGenerator'

// Sortable Item Component
function SortableItem({ item, onRemove }: { item: RoomItem, onRemove: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white border border-gray-200 p-3 rounded-md flex items-center gap-4 mb-2 group">
            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                {item.artwork?.image_url && <Image src={item.artwork.image_url} alt="" fill className="object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{item.artwork?.title}</div>
                <div className="text-xs text-gray-500">{item.artwork?.medium}</div>
            </div>
            {item.is_highlight && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] uppercase font-bold rounded">Hero</span>
            )}
            <button
                onClick={(e) => {
                    e.stopPropagation() // Prevent drag start
                    onRemove(item.id)
                }}
                className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash size={16} />
            </button>
        </div>
    )
}

export function RoomBuilder({ room, initialItems, inventory }: { room: ViewingRoom, initialItems: RoomItem[], inventory: Artwork[] }) {
    const [items, setItems] = useState<RoomItem[]>(initialItems)
    const [title, setTitle] = useState(room.title)
    const [status, setStatus] = useState(room.status)
    const [isSaving, setIsSaving] = useState(false)
    const [copied, setCopied] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleSaveSettings = async () => {
        setIsSaving(true)
        await updateViewingRoom(room.id, { title, status })
        setIsSaving(false)
        toast.success('Room settings saved')
    }

    const handleAddItem = async (artworkId: string) => {
        // Check if already exists
        if (items.find(i => i.artwork_id === artworkId)) {
            toast.error('Artwork already in room')
            return
        }

        // First item is highlight by default if none exist
        const isHighlight = items.length === 0

        await addRoomItem(room.id, artworkId, isHighlight)
        // Optimistic update would be complex due to needing the new ID, so we rely on revalidatePath in action + router.refresh() if we were using router. 
        // For simplicity in this "Builder", we might want to reload or fetch. 
        // But here, let's just refresh the page logic or assume the parent server component refreshes.
        // Actually, since we are in a client component, we should probably use router.refresh().
        window.location.reload() // Brute force refresh to get new item with ID
    }

    const handleRemoveItem = async (itemId: string) => {
        setItems(items.filter(i => i.id !== itemId))
        await removeRoomItem(itemId)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)

            const newItems = arrayMove(items, oldIndex, newIndex)
            setItems(newItems)

            // Persist order
            const updates = newItems.map((item, index) => ({
                id: item.id,
                sort_order: index
            }))
            await updateRoomItemOrder(updates)
        }
    }

    const copyLink = () => {
        const url = `${window.location.origin}/view/${room.slug}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('Link copied to clipboard')
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm">

            {/* Left: Configuration */}
            <div className="w-[400px] bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <Link href="/dashboard/viewing-rooms" className="text-xs text-gray-500 hover:text-black flex items-center gap-1 mb-4">
                        <ArrowLeft /> Back to Rooms
                    </Link>
                    <h1 className="font-serif text-2xl mb-4">Room Builder</h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Room Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full border border-gray-300 rounded p-2 text-sm"
                            >
                                <option value="draft">Draft (Private)</option>
                                <option value="active">Active (Public)</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveSettings}
                                disabled={isSaving}
                                className="flex-1 bg-black text-white rounded py-2 text-sm hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Settings'}
                            </button>
                            <a
                                href={`/view/${room.slug}`}
                                target="_blank"
                                className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50 text-gray-700 flex items-center justify-center"
                                title="Preview Room"
                            >
                                <ArrowSquareOut size={18} />
                            </a>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Public Link</label>
                            <div className="flex gap-2">
                                <a
                                    href={`/view/${room.slug}`}
                                    target="_blank"
                                    className="flex-1 bg-gray-100 p-2 rounded text-xs truncate hover:bg-gray-200 hover:underline text-gray-600 flex items-center gap-1"
                                >
                                    /view/{room.slug} <ArrowSquareOut size={12} />
                                </a>
                                <button onClick={copyLink} className="p-2 border border-gray-200 rounded hover:bg-gray-50">
                                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <EmailGenerator room={room} heroItem={items[0]} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-sm font-semibold mb-3">Room Content</h3>
                    <p className="text-xs text-gray-500 mb-4">Drag to reorder. The first item is the "Hero" work.</p>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map(i => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map(item => (
                                <SortableItem key={item.id} item={item} onRemove={handleRemoveItem} />
                            ))}
                        </SortableContext>
                    </DndContext>

                    {items.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                            Room is empty.
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Inventory Picker */}
            <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Available Inventory</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {inventory.map(artwork => {
                        const isAdded = items.some(i => i.artwork_id === artwork.id)
                        return (
                            <div key={artwork.id} className={cn(
                                "bg-white rounded-lg border overflow-hidden transition-all group relative",
                                isAdded ? "opacity-50 border-gray-200" : "border-gray-200 hover:border-black hover:shadow-md cursor-pointer"
                            )}>
                                <div className="aspect-square relative bg-gray-100">
                                    {artwork.image_url && <Image src={artwork.image_url} alt="" fill className="object-cover" />}
                                    {!isAdded && (
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => handleAddItem(artwork.id)}
                                                className="bg-white text-black px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                                            >
                                                <Plus size={12} /> Add
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <div className="font-medium text-sm truncate">{artwork.title}</div>
                                    <div className="text-xs text-gray-500">{artwork.medium}</div>
                                </div>
                                {isAdded && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                                        <Check size={12} />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
