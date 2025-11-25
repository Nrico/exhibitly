'use client'

import { useState } from 'react'
import { updatePassword } from '../actions'
import { CheckCircle } from '@phosphor-icons/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPending(true)
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setIsPending(false)
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            setIsPending(false)
            return
        }

        const formData = new FormData()
        formData.append('password', password)

        const result = await updatePassword(null, formData)

        if (result?.error) {
            setError(result.error)
            setIsPending(false)
        } else {
            setIsSuccess(true)
            setIsPending(false)
            setTimeout(() => {
                router.push('/auth')
            }, 3000)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-medium mb-2 text-gray-900">Set New Password</h1>
                    <p className="text-gray-500 text-sm">Please enter your new password below.</p>
                </div>

                {isSuccess ? (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-center mb-3 text-green-600">
                            <CheckCircle size={48} weight="fill" />
                        </div>
                        <h3 className="font-medium text-green-900 mb-1">Password Updated</h3>
                        <p className="text-green-700 text-sm">Your password has been changed successfully. Redirecting to login...</p>
                        <Link href="/auth" className="block mt-6 text-sm font-medium text-green-800 hover:underline">
                            Click here if not redirected
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium mb-2 text-gray-800">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-900 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-2 text-gray-800">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-900 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full p-3.5 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
