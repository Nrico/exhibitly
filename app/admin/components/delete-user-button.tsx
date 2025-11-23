'use client'

import { Trash } from '@phosphor-icons/react'
import { useState } from 'react'
import { deleteUser } from '../actions'

export function DeleteUserButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this USER? All their data (artworks, settings) will be wiped.')) return

        setIsDeleting(true)
        const result = await deleteUser(id)

        if (result.error) {
            alert(result.error)
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            title="Delete User"
        >
            <Trash size={18} />
        </button>
    )
}
