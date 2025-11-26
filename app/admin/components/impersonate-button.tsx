'use client'

import { impersonateUser } from '../actions'
import { Eye } from '@phosphor-icons/react'
import { useState } from 'react'

export function ImpersonateButton({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleImpersonate = async () => {
        if (!confirm('Are you sure you want to impersonate this user?')) return

        setIsLoading(true)
        try {
            await impersonateUser(id)
        } catch (error) {
            console.error('Failed to impersonate:', error)
            alert('Failed to impersonate user')
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleImpersonate}
            disabled={isLoading}
            className="text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
            title="Impersonate User"
        >
            <Eye size={20} weight="duotone" />
        </button>
    )
}
