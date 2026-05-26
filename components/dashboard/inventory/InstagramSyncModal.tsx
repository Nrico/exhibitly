'use client'

import { useState } from 'react'
import { InstagramLogo, Spinner, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'

type InstagramSyncModalProps = {
    isOpen: boolean
    onClose: () => void
    initialHandle?: string
}

export function InstagramSyncModal({ isOpen, onClose, initialHandle = '' }: InstagramSyncModalProps) {
    const [handle, setHandle] = useState(initialHandle)
    const [syncState, setSyncState] = useState<'idle' | 'connecting' | 'fetching' | 'completed'>('idle')
    const [progress, setProgress] = useState(0)

    if (!isOpen) return null

    const handleSyncStart = (e: React.FormEvent) => {
        e.preventDefault()
        if (!handle.trim()) {
            toast.error('Please enter a valid Instagram handle')
            return
        }

        setSyncState('connecting')
        setProgress(15)

        // Mock Step 1: Connecting to Meta Graph API
        setTimeout(() => {
            setSyncState('fetching')
            setProgress(60)

            // Mock Step 2: Fetching posts & resolving images
            setTimeout(() => {
                setProgress(100)
                setSyncState('completed')
                toast.success('Sync completed! 6 new drafts generated.')
            }, 1500)

        }, 1200)
    }

    const resetAndClose = () => {
        setSyncState('idle')
        setProgress(0)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 p-8 max-w-md w-full relative rounded-lg shadow-2xl font-sans text-gray-800">
                <button
                    onClick={resetAndClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black font-mono text-sm border-none bg-transparent cursor-pointer"
                >
                    [X] CLOSE
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white">
                        <InstagramLogo size={22} weight="bold" />
                    </div>
                    <div>
                        <h3 className="font-serif text-xl text-black">Instagram Synchronizer</h3>
                        <p className="text-xs text-gray-500 font-mono">Status: Connected to Meta Graph API</p>
                    </div>
                </div>

                {syncState === 'idle' && (
                    <form onSubmit={handleSyncStart} className="space-y-4">
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Connect your Instagram account to automatically import your posts. Exhibitly parses descriptions to extract titles, medium details, and sizes, generating draft archive records.
                        </p>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Instagram Handle</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">@</span>
                                <input
                                    type="text"
                                    value={handle.replace(/^@/, '')}
                                    onChange={(e) => setHandle(e.target.value)}
                                    placeholder="yourusername"
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#111111] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors border-none cursor-pointer"
                        >
                            Sync Feed & Import Drafts
                        </button>
                    </form>
                )}

                {(syncState === 'connecting' || syncState === 'fetching') && (
                    <div className="py-10 text-center space-y-6">
                        <Spinner size={36} className="animate-spin text-[#111111] mx-auto" />
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">
                                {syncState === 'connecting' ? 'Initializing Secure Bridge...' : 'Parsing Instagram Feed...'}
                            </h4>
                            <p className="text-xs text-gray-500 max-w-[280px] mx-auto">
                                {syncState === 'connecting' 
                                    ? 'Connecting with Meta developer credentials...' 
                                    : 'Reading media URLs and matching text records...'}
                            </p>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className="bg-[#111111] h-full transition-all duration-500 rounded-full" 
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {syncState === 'completed' && (
                    <div className="py-8 text-center space-y-5">
                        <CheckCircle size={44} className="text-green-600 mx-auto" weight="fill" />
                        <div className="space-y-2">
                            <h4 className="font-serif text-lg text-black">Synchronization Complete</h4>
                            <p className="text-xs text-gray-600 max-w-[320px] mx-auto leading-relaxed">
                                Imported **6 recent posts** as draft inventory items. Descriptions have been pre-filled. Review them in your draft collection to publish them on your site.
                            </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-100 p-3 rounded flex gap-3 text-left">
                            <Warning size={20} className="text-yellow-600 flex-shrink-0" />
                            <p className="text-[10px] text-yellow-800 leading-normal">
                                <strong>Developer Note:</strong> This import is simulated using mock records for demonstration. Full OAuth token registration is in Meta review sandbox.
                            </p>
                        </div>

                        <button
                            onClick={resetAndClose}
                            className="w-full py-3 bg-[#111111] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors border-none cursor-pointer"
                        >
                            Return to Inventory
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
