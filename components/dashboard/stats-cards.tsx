'use client'

import { Archive, TrendUp, Globe, ArrowSquareOut, LockKey } from '@phosphor-icons/react'

export function StatsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            {/* Card 1: Inventory Health */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 flex justify-between items-center">
                    Inventory Health
                    <Archive size={16} />
                </div>
                <div className="font-serif text-4xl font-semibold text-gray-900 mb-3 leading-none">
                    42 Items
                </div>
                <div className="flex gap-4 pt-4 mt-4 border-t border-gray-50 text-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-700"></span>
                        12 Available
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-700"></span>
                        30 Sold
                    </div>
                </div>
            </div>

            {/* Card 2: Visitor Interest */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 flex justify-between items-center">
                    Visitor Interest (30d)
                    <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
                        <TrendUp size={12} weight="bold" /> 12%
                    </span>
                </div>
                <div className="font-serif text-4xl font-semibold text-gray-900 mb-3 leading-none">
                    1,240 Views
                </div>
                <div className="h-[50px] w-full mt-3 relative opacity-80">
                    {/* Simple SVG Sparkline */}
                    <svg width="100%" height="100%" viewBox="0 0 300 50" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(0,0,0,0.1)" stopOpacity="1" />
                                <stop offset="100%" stopColor="rgba(0,0,0,0)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0,40 Q30,45 60,30 T120,25 T180,35 T240,10 T300,20 V50 H0 Z" fill="url(#grad)" stroke="none" />
                        <path d="M0,40 Q30,45 60,30 T120,25 T180,35 T240,10 T300,20" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            {/* Card 3: Site Status */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 flex justify-between items-center">
                    Site Status
                    <Globe size={16} />
                </div>
                <div className="flex items-center gap-2.5 mt-1 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-700 animate-pulse shadow-[0_0_0_4px_rgba(46,125,50,0.1)]"></div>
                    <span className="font-semibold text-gray-900">Online & Healthy</span>
                </div>

                <div>
                    <a href="#" className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800 hover:bg-gray-200 transition-colors">
                        enricotrujillo.com <ArrowSquareOut size={14} />
                    </a>
                </div>
                <div className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                    <LockKey size={12} /> SSL Certificate Active
                </div>
            </div>

        </div>
    )
}
