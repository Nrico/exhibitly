'use client'

import { CheckCircle, Circle, ArrowRight } from '@phosphor-icons/react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type Props = {
    profile: any
    settings: any
    artworkCount: number
    username: string
}

export function OnboardingChecklist({ profile, settings, artworkCount, username }: Props) {
    const steps = [
        {
            id: 'profile',
            label: 'Set up your Profile',
            description: 'Add your full name to your account.',
            isComplete: !!profile?.full_name,
            href: '/dashboard/settings',
            cta: 'Go to Settings'
        },
        {
            id: 'site',
            label: 'Name your Gallery',
            description: 'Give your public portfolio a title.',
            isComplete: !!settings?.site_title,
            href: '/dashboard/design',
            cta: 'Design Site'
        },
        {
            id: 'art',
            label: 'Upload your first Artwork',
            description: 'Add at least one piece to your inventory.',
            isComplete: artworkCount > 0,
            href: '/dashboard/inventory',
            cta: 'Add Artwork'
        }
    ]

    const completedCount = steps.filter(s => s.isComplete).length
    const progress = (completedCount / steps.length) * 100
    const isAllComplete = completedCount === steps.length



    if (isAllComplete) {
        return (
            <div className="bg-[#111111] text-white rounded-xl p-6 mb-8 shadow-sm flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-serif mb-1">You're all set! 🎉</h2>
                    <p className="text-sm text-gray-400">Your portfolio is ready to share with the world.</p>
                </div>
                <Link
                    href={`/${username}`}
                    target="_blank"
                    className="bg-white text-[#111111] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                    View Public Site <ArrowRight size={16} />
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-xl font-serif text-[#111111] mb-1">Getting Started</h2>
                    <p className="text-sm text-[#666666]">Complete these steps to launch your portfolio.</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-[#111111]">{Math.round(progress)}%</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#111111]"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`relative border rounded-lg p-4 transition-all ${step.isComplete
                            ? 'bg-gray-50 border-gray-200 opacity-75'
                            : 'bg-white border-gray-300 hover:border-[#111111] hover:shadow-md'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-1.5 rounded-full ${step.isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                {step.isComplete ? <CheckCircle size={20} weight="fill" /> : <Circle size={20} />}
                            </div>
                        </div>

                        <h3 className={`font-medium mb-1 ${step.isComplete ? 'text-gray-500 line-through' : 'text-[#111111]'}`}>
                            {step.label}
                        </h3>
                        <p className="text-xs text-[#666666] mb-4 min-h-[32px]">
                            {step.description}
                        </p>

                        {!step.isComplete && (
                            <Link
                                href={step.href}
                                className="inline-flex items-center text-xs font-bold text-[#111111] hover:underline"
                            >
                                {step.cta} <ArrowRight size={12} className="ml-1" />
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
