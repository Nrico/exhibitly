'use client'

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
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { Artwork } from '@/types'
import { SortableRow, StaticRow } from './ArtworkRow'

type ArtworkTableProps = {
    artworks: Artwork[]
    mounted: boolean
    openEditor: (item: Artwork) => void
    handleDragEnd: (event: DragEndEvent) => void
    artists?: any[]
}

export function ArtworkTable({ artworks, mounted, openEditor, handleDragEnd, artists = [] }: ArtworkTableProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    if (!mounted) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#fafafa] border-b border-gray-200 text-left">
                            <th className="p-4 w-[40px]"></th>
                            <th className="p-4 pl-0 text-xs uppercase text-[#666666] font-semibold w-[60px]">Image</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Title / Description</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Collection</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Artist</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Medium</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Price</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Status</th>
                            <th className="p-4 w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {artworks.length === 0 && (
                            <tr>
                                <td colSpan={9} className="p-8 text-center text-[#666666]">
                                    No artworks found. Add one to get started.
                                </td>
                            </tr>
                        )}
                        {artworks.map((item) => (
                            <StaticRow key={item.id} item={item} openEditor={openEditor} artists={artists} />
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Artist</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Medium</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Price</th>
                            <th className="p-4 text-xs uppercase text-[#666666] font-semibold">Status</th>
                            <th className="p-4 w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {artworks.length === 0 && (
                            <tr>
                                <td colSpan={9} className="p-8 text-center text-[#666666]">
                                    No artworks found. Add one to get started.
                                </td>
                            </tr>
                        )}
                        <SortableContext
                            items={artworks.map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {artworks.map((item) => (
                                <SortableRow key={item.id} item={item} openEditor={openEditor} artists={artists} />
                            ))}
                        </SortableContext>
                    </tbody>
                </table>
            </DndContext>
        </div>
    )
}
