'use client'

import Image from 'next/image'
import { createSingleArtworkRoom } from '@/app/dashboard/viewing-rooms/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    CaretRight,
    CheckCircle,
    DotsSixVertical,
    Eye
} from '@phosphor-icons/react'
import {
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Artwork } from '@/types'

export function RowContent({ item, openEditor, dragHandle, artists = [] }: { item: Artwork, openEditor: (item: Artwork) => void, dragHandle?: React.ReactNode, artists?: any[] }) {
    const artistName = item.artist_id ? artists.find(a => a.id === item.artist_id)?.full_name : null
    const router = useRouter()

    async function onCreateRoom(e: React.MouseEvent) {
        e.stopPropagation()
        toast.promise(createSingleArtworkRoom(item.id), {
            loading: 'Creating Private View...',
            success: (result) => {
                if (result.error) throw new Error(result.error)
                router.push(`/dashboard/viewing-rooms/${result.roomId}`)
                return 'Private View created'
            },
            error: (err) => err.message
        })
    }

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
            <td className="p-4 text-sm text-[#111111] cursor-pointer" onClick={() => openEditor(item)}>
                {artistName || <span className="text-[#ccc]">--</span>}
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
            <td className="p-4 text-[#ccc] flex items-center justify-end gap-2">
                <button
                    onClick={onCreateRoom}
                    className="p-2 text-gray-400 hover:text-[#111] hover:bg-gray-100 rounded-full transition-colors"
                    title="Create Private View"
                >
                    <Eye size={18} />
                </button>
                <div onClick={() => openEditor(item)} className="p-2 cursor-pointer hover:text-[#111]">
                    <CaretRight size={16} />
                </div>
            </td>
        </>
    )
}

export function SortableRow({ item, openEditor, artists = [] }: { item: Artwork, openEditor: (item: Artwork) => void, artists?: any[] }) {
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
                artists={artists}
                dragHandle={
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-2">
                        <DotsSixVertical size={20} />
                    </div>
                }
            />
        </tr>
    )
}

export function StaticRow({ item, openEditor, artists = [] }: { item: Artwork, openEditor: (item: Artwork) => void, artists?: any[] }) {
    return (
        <tr className="border-b border-gray-50 last:border-none hover:bg-[#fcfcfc] transition-colors">
            <RowContent
                item={item}
                openEditor={openEditor}
                artists={artists}
                dragHandle={
                    <div className="text-gray-300 p-2 cursor-not-allowed">
                        <DotsSixVertical size={20} />
                    </div>
                }
            />
        </tr>
    )
}
