'use client'

import { useState } from 'react'
import { resetPassword } from '../actions'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPending(true)
        setError('')

        const formData = new FormData()
        formData.append('email', email)

        const result = await resetPassword(null, formData)

        if (result?.error) {
            setError(result.error)
            setIsPending(false)
        } else {
            setIsSuccess(true)
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <Link href="/auth" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-medium mb-2 text-gray-900">Reset Password</h1>
                    <p className="text-gray-500 text-sm">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {isSuccess ? (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-center mb-3 text-green-600">
                            <CheckCircle size={48} weight="fill" />
                        </div>
                        <h3 className="font-medium text-green-900 mb-1">Check your email</h3>
                        <p className="text-green-700 text-sm">We've sent a password reset link to <strong>{email}</strong>.</p>
                        <Link href="/auth" className="block mt-6 text-sm font-medium text-green-800 hover:underline">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium mb-2 text-gray-800">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-900 transition-colors"
                                placeholder="name@example.com"
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
                            {isPending ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
