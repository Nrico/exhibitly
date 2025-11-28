'use client'

import { useState } from 'react'
import { Trash, X } from '@phosphor-icons/react'
import { deleteViewingRoom } from '@/app/dashboard/viewing-rooms/actions'
import { toast } from 'sonner'

export function DeleteRoomButton({ roomId, title }: { roomId: string, title: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation to room
        e.stopPropagation()

        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        const result = await deleteViewingRoom(roomId)

        if (result.error) {
            toast.error(result.error)
            setIsDeleting(false)
        } else {
            toast.success('Room deleted')
            // Router refresh is handled by revalidatePath in the action, 
            // but since this is a client component inside a server component, 
            // the UI might not update immediately without a router.refresh().
            // However, revalidatePath usually works for server components.
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
            title="Delete Room"
        >
            {isDeleting ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
            ) : (
                <X size={20} />
            )}
        </button>
    )
}
