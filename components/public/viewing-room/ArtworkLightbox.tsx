'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from '@phosphor-icons/react'

interface ArtworkLightboxProps {
    src: string
    alt: string
}

export function ArtworkLightbox({ src, alt }: ArtworkLightboxProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Thumbnail / In-page Image */}
            <div
                className="relative aspect-[3/4] md:aspect-square bg-gray-50 cursor-zoom-in group"
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider backdrop-blur-sm">
                        Click to Expand
                    </div>
                </div>
            </div>

            {/* Fullscreen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex items-center justify-center cursor-zoom-out"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full h-full max-w-[95vw] max-h-[95vh] p-4 flex items-center justify-center"
                        >
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                            />
                        </motion.div>

                        <button
                            className="absolute top-6 right-6 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsOpen(false)
                            }}
                        >
                            <X size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
