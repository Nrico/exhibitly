'use client'

import { useState, useActionState, useEffect } from 'react'
import Image from 'next/image'
import { GoogleLogo, PaintBrush, Storefront, CheckCircle, XCircle } from '@phosphor-icons/react'
import { login, signup, signInWithGoogle, checkHandleAvailability } from './actions'
import { toast } from 'sonner'
import Link from 'next/link'

const initialState = {
    error: '',
}

export default function AuthPage() {
    const [view, setView] = useState<'login' | 'signup'>('login')
    const [accountType, setAccountType] = useState<'artist' | 'gallery'>('artist')
    const [handle, setHandle] = useState('')
    const [isHandleAvailable, setIsHandleAvailable] = useState(false)

    const [loginState, loginAction, isLoginPending] = useActionState(login, initialState)
    const [signupState, signupAction, isSignupPending] = useActionState(signup, initialState)

    // Handle toast notifications for server actions
    useEffect(() => {
        if (loginState?.error) {
            toast.error(loginState.error)
        }
        if (signupState?.error) {
            toast.error(signupState.error)
        }
        if (signupState?.success) {
            toast.success(signupState.message)
            // Optional: switch to login view or show success message
        }
    }, [loginState, signupState])

    const handleHandleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setHandle(value)

        if (value.length >= 3) {
            const isAvailable = await checkHandleAvailability(value)
            setIsHandleAvailable(isAvailable)
        } else {
            setIsHandleAvailable(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row overflow-hidden bg-white text-gray-900 font-sans">
            {/* --- LEFT PANEL: THE VISUAL --- */}
            <div className="relative flex-1 bg-gray-100 flex flex-col justify-end p-8 md:p-16 min-h-[300px] md:min-h-auto">
                <Image
                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000"
                    alt="Fine Art"
                    fill
                    className="object-cover brightness-90"
                    priority
                />
                <div className="relative z-10 text-white max-w-md">
                    <div className="font-serif text-3xl md:text-4xl italic leading-tight mb-5">
                        "Every artist dips his brush in his own soul, and paints his own nature into his pictures."
                    </div>
                    <div className="text-sm uppercase tracking-widest opacity-80">
                        — Henry Ward Beecher
                    </div>
                </div>
            </div>

            {/* --- RIGHT PANEL: THE FORM --- */}
            <div className="w-full md:w-[550px] bg-white flex flex-col justify-center p-8 md:p-20 overflow-y-auto">
                <div className="font-serif text-3xl font-semibold mb-10 text-gray-900">
                    Exhibitly.
                </div>

                {/* LOGIN VIEW */}
                {view === 'login' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="font-serif text-4xl font-medium mb-2">Welcome back.</h1>
                        <p className="text-gray-500 text-sm mb-8">Sign in to manage your portfolio.</p>

                        <form action={loginAction} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium mb-2 text-gray-800">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-xs font-medium text-gray-800">Password</label>
                                    <Link href="/auth/forgot-password" className="text-xs text-gray-500 hover:text-gray-900">Forgot?</Link>
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Errors handled by toast, but keeping inline for accessibility if needed */}

                            <button
                                type="submit"
                                disabled={isLoginPending}
                                className="w-full p-3.5 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50"
                            >
                                {isLoginPending ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="relative my-8 text-center border-b border-gray-100 leading-[0.1em]">
                            <span className="bg-white px-2 text-xs text-gray-400">OR</span>
                        </div>

                        <button
                            onClick={() => signInWithGoogle()}
                            className="w-full p-3 bg-white border border-gray-200 text-gray-900 rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <GoogleLogo size={20} weight="bold" />
                            Continue with Google
                        </button>

                        <div className="text-center mt-8 text-sm">
                            Don't have an account?{' '}
                            <button
                                onClick={() => setView('signup')}
                                className="font-semibold text-gray-900 hover:underline"
                            >
                                Create Portfolio
                            </button>
                        </div>
                    </div>
                )}

                {/* SIGNUP VIEW */}
                {view === 'signup' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="font-serif text-4xl font-medium mb-2">Claim your space.</h1>
                        <p className="text-gray-500 text-sm mb-8">Start your free portfolio. No credit card required.</p>

                        <form action={signupAction} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium mb-2 text-gray-800">I am an:</label>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div
                                        onClick={() => setAccountType('artist')}
                                        className={`border rounded-lg p-4 cursor-pointer text-center transition-all ${accountType === 'artist'
                                            ? 'border-gray-900 bg-gray-50 shadow-sm'
                                            : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="flex justify-center mb-2 text-gray-900">
                                            <PaintBrush size={24} weight={accountType === 'artist' ? 'fill' : 'regular'} />
                                        </div>
                                        <div className="font-semibold text-sm">Artist</div>
                                        <div className="text-xs text-gray-500 mt-1">Independent Creator</div>
                                    </div>
                                    <div
                                        onClick={() => setAccountType('gallery')}
                                        className={`border rounded-lg p-4 cursor-pointer text-center transition-all ${accountType === 'gallery'
                                            ? 'border-gray-900 bg-gray-50 shadow-sm'
                                            : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="flex justify-center mb-2 text-gray-900">
                                            <Storefront size={24} weight={accountType === 'gallery' ? 'fill' : 'regular'} />
                                        </div>
                                        <div className="font-semibold text-sm">Gallery</div>
                                        <div className="text-xs text-gray-500 mt-1">Curator / Collective</div>
                                    </div>
                                </div>
                                <input type="hidden" name="accountType" value={accountType} />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-2 text-gray-800">Full Name / Gallery Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="e.g. Enrico Trujillo"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-2 text-gray-800">Claim your URL</label>
                                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden focus-within:border-gray-900 transition-colors">
                                    <div className="bg-gray-50 px-4 py-3 text-sm text-gray-500 border-r border-gray-200">
                                        exhibitly.co/
                                    </div>
                                    <input
                                        name="handle"
                                        type="text"
                                        required
                                        value={handle}
                                        onChange={handleHandleChange}
                                        className="flex-grow p-3 outline-none text-sm"
                                        placeholder={accountType === 'gallery' ? 'high-desert-arts' : 'enrico'}
                                    />
                                </div>
                                {isHandleAvailable && handle.length >= 3 && (
                                    <div className="text-xs text-green-700 mt-1.5 flex items-center gap-1">
                                        <CheckCircle size={14} weight="fill" /> Available
                                    </div>
                                )}
                                {!isHandleAvailable && handle.length >= 3 && (
                                    <div className="text-xs text-red-700 mt-1.5 flex items-center gap-1">
                                        <XCircle size={14} weight="fill" /> Taken
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-2 text-gray-800">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-2 text-gray-800">Create Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-900 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Errors handled by toast */}

                            <button
                                type="submit"
                                disabled={isSignupPending}
                                className="w-full p-3.5 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50"
                            >
                                {isSignupPending ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <div className="text-center mt-8 text-sm">
                                Already have an account?{' '}
                                <button
                                    onClick={() => setView('login')}
                                    className="font-semibold text-gray-900 hover:underline"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
