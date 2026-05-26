'use client'

import { useState } from 'react'
import { InstagramLogo, Spinner, CheckCircle, Warning, LinkBreak, ArrowClockwise } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { syncInstagramFeed, disconnectInstagram } from '@/app/actions/instagram'
import { useRouter } from 'next/navigation'

type InstagramSyncModalProps = {
    isOpen: boolean
    onClose: () => void
    initialHandle?: string
    instagramIntegration?: { instagram_username: string; expires_at: string } | null
}

export function InstagramSyncModal({ 
    isOpen, 
    onClose, 
    initialHandle = '', 
    instagramIntegration 
}: InstagramSyncModalProps) {
    const router = useRouter()
    const [handle, setHandle] = useState(initialHandle)
    const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'completed' | 'error'>('idle')
    const [statusMessage, setStatusMessage] = useState('')
    const [syncCount, setSyncCount] = useState(0)
    const [isDisconnecting, setIsDisconnecting] = useState(false)

    if (!isOpen) return null

    // 1. Direct Oauth Flow Redirect
    const handleConnectOAuth = () => {
        window.location.href = '/api/auth/instagram/connect'
    }

    // 2. Disconnect/Delete Connection
    const handleDisconnect = async () => {
        setIsDisconnecting(true)
        const res = await disconnectInstagram()
        setIsDisconnecting(false)
        if (res.success) {
            toast.success('Instagram connection removed.')
            router.refresh()
        } else {
            toast.error(res.error || 'Failed to disconnect Instagram.')
        }
    }

    // 3. Live Synced Feed Execution (Meta API + Gemini Parser)
    const handleRealSync = async () => {
        setSyncState('syncing')
        setStatusMessage('Connecting to Meta Graph API...')

        const res = await syncInstagramFeed()
        if (res.success) {
            setSyncCount(res.count ?? 0)
            setSyncState('completed')
            toast.success(res.message)
            router.refresh()
        } else {
            setSyncState('error')
            setStatusMessage(res.error || 'Failed to run live feed sync.')
            toast.error(res.error || 'Live sync failed.')
        }
    }

    // 4. Fallback Simulator (Local developer mock)
    const handleSimulationSync = (e: React.FormEvent) => {
        e.preventDefault()
        if (!handle.trim()) {
            toast.error('Please enter a valid Instagram handle')
            return
        }

        setSyncState('syncing')
        setStatusMessage('Initializing simulation bridge...')

        setTimeout(() => {
            setStatusMessage('Parsing simulated captions with Gemini AI...')

            setTimeout(() => {
                setSyncCount(6)
                setSyncState('completed')
                toast.success('Sync completed! 6 new drafts generated.')
                router.refresh()
            }, 1500)

        }, 1200)
    }

    const resetAndClose = () => {
        setSyncState('idle')
        setStatusMessage('')
        setSyncCount(0)
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
                        <p className="text-xs text-gray-500 font-mono">
                            Status: {instagramIntegration ? `Connected as @${instagramIntegration.instagram_username}` : 'Not Connected'}
                        </p>
                    </div>
                </div>

                {syncState === 'idle' && (
                    <div className="space-y-6">
                        {instagramIntegration ? (
                            // Connected View
                            <div className="space-y-4">
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Your account is securely linked to the Meta Graph API. Click below to pull your latest images and run the Gemini caption extractor.
                                </p>
                                <div className="p-3 bg-green-50 border border-green-100 rounded text-xs text-green-800 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span>Authorized connection active</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={handleRealSync}
                                        className="w-full py-3 bg-[#111111] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors border-none cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <ArrowClockwise size={14} className="animate-spin" /> Sync Live Feed
                                    </button>
                                    <button
                                        onClick={handleDisconnect}
                                        disabled={isDisconnecting}
                                        className="w-full py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold uppercase tracking-wider transition-colors border-none cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <LinkBreak size={14} /> {isDisconnecting ? 'Disconnecting...' : 'Disconnect Account'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Disconnected View (Option to select real connect vs simulator)
                            <div className="space-y-4">
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Connect your live Instagram feed via OAuth secure link, or run a simulated import using Taos sculptor El Trujillo's archive.
                                </p>

                                <div className="space-y-3">
                                    {/* Direct OAuth Connection */}
                                    <button
                                        onClick={handleConnectOAuth}
                                        className="w-full py-3 bg-[#111111] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors border-none cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        Connect with Instagram (OAuth)
                                    </button>

                                    <div className="relative flex py-2 items-center">
                                        <div className="flex-grow border-t border-gray-200"></div>
                                        <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-mono tracking-wider">or test simulator</span>
                                        <div className="flex-grow border-t border-gray-200"></div>
                                    </div>

                                    {/* Local developer Mock Simulator Form */}
                                    <form onSubmit={handleSimulationSync} className="space-y-3">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">@</span>
                                            <input
                                                type="text"
                                                value={handle.replace(/^@/, '')}
                                                onChange={(e) => setHandle(e.target.value)}
                                                placeholder="yourusername"
                                                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-black transition-colors"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-[11px] font-bold uppercase tracking-wider transition-colors border-none cursor-pointer"
                                        >
                                            Run Simulation Sync
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {syncState === 'syncing' && (
                    <div className="py-10 text-center space-y-6">
                        <Spinner size={36} className="animate-spin text-[#111111] mx-auto" />
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Synchronizing Feed...</h4>
                            <p className="text-xs text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                                {statusMessage}
                            </p>
                        </div>
                    </div>
                )}

                {syncState === 'completed' && (
                    <div className="py-8 text-center space-y-5">
                        <CheckCircle size={44} className="text-green-600 mx-auto" weight="fill" />
                        <div className="space-y-2">
                            <h4 className="font-serif text-lg text-black">Sync Complete</h4>
                            <p className="text-xs text-gray-600 max-w-[320px] mx-auto leading-relaxed">
                                Successfully synchronized feed records. We created **{syncCount} new draft records** in your inventory based on parsed caption descriptions.
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

                {syncState === 'error' && (
                    <div className="py-8 text-center space-y-5">
                        <Warning size={44} className="text-red-600 mx-auto" weight="fill" />
                        <div className="space-y-2">
                            <h4 className="font-serif text-lg text-black">Sync Failed</h4>
                            <p className="text-xs text-red-600 max-w-[320px] mx-auto leading-relaxed">
                                {statusMessage}
                            </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-100 p-3 rounded text-left">
                            <p className="text-[10px] text-yellow-800 leading-normal">
                                <strong>Setup Note:</strong> Make sure your Meta credentials and `GEMINI_API_KEY` are properly defined in your `.env.local` file.
                            </p>
                        </div>

                        <button
                            onClick={() => setSyncState('idle')}
                            className="w-full py-3 bg-[#111111] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors border-none cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
