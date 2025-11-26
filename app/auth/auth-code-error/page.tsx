'use client'

import Link from 'next/link'
import { Warning } from '@phosphor-icons/react'

export default function AuthCodeError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Warning size={32} />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Authentication Error</h1>
                <p className="text-gray-500 mb-6">
                    There was a problem signing you in. This link may have expired or is invalid.
                </p>
                <div className="space-y-3">
                    <Link
                        href="/auth"
                        className="block w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Try Again
                    </Link>
                    <Link
                        href="/"
                        className="block w-full text-gray-500 py-3 rounded-lg font-medium hover:text-black transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
