'use client'

import { stopImpersonation } from '@/app/admin/actions'

export function ImpersonationBanner({ isImpersonating, realUserEmail }: { isImpersonating: boolean, realUserEmail?: string }) {
    if (!isImpersonating) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white py-3 px-6 z-50 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-xs bg-white/20 px-2 py-1 rounded">Admin Mode</span>
                <span className="text-sm">You are currently impersonating a user. {realUserEmail && <span className="opacity-75 text-xs">(Admin: {realUserEmail})</span>}</span>
            </div>
            <button
                onClick={() => stopImpersonation()}
                className="bg-white text-indigo-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-indigo-50 transition-colors"
            >
                Exit Impersonation
            </button>
        </div>
    )
}
