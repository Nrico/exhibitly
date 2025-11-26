'use client'

import { UploadSimple } from '@phosphor-icons/react'

type BatchUploadProps = {
    isDragging: boolean
    uploadProgress: { current: number, total: number } | null
    onDragOver: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
}

export function BatchUpload({ isDragging, uploadProgress, onDragOver, onDragLeave, onDrop }: BatchUploadProps) {
    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`bg-white border-2 border-dashed rounded-lg p-10 text-center mb-10 transition-all cursor-pointer group ${isDragging ? 'border-[#111] bg-[#fafafa]' : 'border-[#ccc] hover:border-[#111] hover:bg-[#fafafa]'}`}
        >
            {uploadProgress ? (
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#111] rounded-full animate-spin mb-4"></div>
                    <div className="font-semibold text-lg text-[#111111]">Uploading...</div>
                    <div className="text-[#666666] text-sm mt-1">
                        Processing image {uploadProgress.current} of {uploadProgress.total}
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-center mb-2.5">
                        <UploadSimple size={32} className={`transition-colors ${isDragging ? 'text-[#111]' : 'text-[#ccc] group-hover:text-[#111]'}`} />
                    </div>
                    <div className="font-semibold text-lg mb-1.5 text-[#111111]">Drag & Drop Batch Upload</div>
                    <div className="text-[#666666] text-sm">
                        Drop multiple images to create draft artworks.
                    </div>
                </>
            )}
        </div>
    )
}
