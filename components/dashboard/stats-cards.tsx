import { Archive, TrendUp, Globe, ArrowSquareOut, LockKey } from '@phosphor-icons/react/dist/ssr'

type Props = {
    totalViews: number
    totalArtworks: number
    soldArtworks: number
    availableArtworks: number
    username?: string
}

export function StatsCards({ totalViews, totalArtworks, soldArtworks, availableArtworks, username }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            {/* Card 1: Inventory Health */}
            <div className="dashboard-glass-card dashboard-glass-card-hover rounded-xl p-6 transition-all relative">
                <div className="dashboard-mono-label mb-4 flex justify-between items-center">
                    Inventory Health
                    <Archive size={16} />
                </div>
                <div className="font-serif text-4xl font-semibold text-gray-900 mb-3 leading-none">
                    {totalArtworks} Items
                </div>
                <div className="flex gap-4 pt-4 mt-4 border-t border-slate-200/50 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        {availableArtworks} Available
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                        {soldArtworks} Sold
                    </div>
                </div>
            </div>

            {/* Card 2: Visitor Interest */}
            <div className="dashboard-glass-card dashboard-glass-card-hover rounded-xl p-6 transition-all relative">
                <div className="dashboard-mono-label mb-4 flex justify-between items-center">
                    Visitor Interest (All Time)
                    <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 font-mono uppercase tracking-wider">
                        <TrendUp size={12} weight="bold" /> Live
                    </span>
                </div>
                <div className="font-serif text-4xl font-semibold text-gray-900 mb-3 leading-none">
                    {totalViews.toLocaleString()} Views
                </div>
                <div className="h-[50px] w-full mt-3 relative opacity-85">
                    {/* Simple SVG Sparkline */}
                    <svg width="100%" height="100%" viewBox="0 0 300 50" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(15,23,42,0.08)" stopOpacity="1" />
                                <stop offset="100%" stopColor="rgba(15,23,42,0)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0,40 Q30,45 60,30 T120,25 T180,35 T240,10 T300,20 V50 H0 Z" fill="url(#grad)" stroke="none" />
                        <path d="M0,40 Q30,45 60,30 T120,25 T180,35 T240,10 T300,20" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            {/* Card 3: Site Status */}
            <div className="dashboard-glass-card dashboard-glass-card-hover rounded-xl p-6 transition-all relative">
                <div className="dashboard-mono-label mb-4 flex justify-between items-center">
                    Site Status
                    <Globe size={16} />
                </div>
                <div className="flex items-center gap-2.5 mt-1 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"></div>
                    <span className="font-medium text-sm text-gray-900">Online & Healthy</span>
                </div>

                <div>
                    {username ? (
                        <a href={`/${username}`} target="_blank" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded text-xs font-mono text-slate-700 hover:text-slate-900 transition-all border border-slate-200/50">
                            exhibit.ly/{username} <ArrowSquareOut size={12} />
                        </a>
                    ) : (
                        <span className="text-sm text-gray-400 italic">No public site yet</span>
                    )}
                </div>
                <div className="text-xs text-slate-500 mt-4 flex items-center gap-1.5 font-mono">
                    <LockKey size={12} /> SSL Active
                </div>
            </div>

        </div>
    )
}
