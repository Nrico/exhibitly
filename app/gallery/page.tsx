import Link from 'next/link'
import Image from 'next/image'

export default function GalleryFeatures() {
    return (
        <div className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-black selection:text-white">

            {/* --- HEADER --- */}
            <header className="py-10 border-b border-transparent">
                <div className="max-w-[1200px] mx-auto px-8 flex justify-between items-center">
                    <Link href="/" className="font-serif text-3xl font-semibold tracking-tighter hover:opacity-70 transition-opacity">
                        Exhibitly.
                    </Link>
                    <nav className="flex items-center">
                        <Link href="/auth" className="ml-8 text-sm font-medium text-[#1a1a1a] hover:opacity-70 transition-opacity">
                            Login
                        </Link>
                        <Link href="/auth?view=signup" className="ml-5 px-5 py-2 bg-[#1a1a1a] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#333] transition-colors">
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="pt-16 pb-24 text-center">
                <div className="max-w-[1200px] mx-auto px-8">
                    <div className="max-w-[900px] mx-auto mb-16 aspect-video bg-[#f0f0f0] overflow-hidden relative">
                        <Image
                            src="https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=2000&auto=format&fit=crop"
                            alt="Gallery Interior"
                            fill
                            className="object-cover saturate-[0.8] contrast-[1.1]"
                            priority
                        />
                    </div>

                    <span className="text-xs uppercase tracking-[2px] text-[#666666] mb-5 block">For Galleries & Collectives</span>
                    <h1 className="font-serif text-4xl md:text-6xl font-normal tracking-wide mb-8 uppercase leading-[1.1]">
                        The Gallery Platform.
                    </h1>

                    <p className="text-lg text-[#666666] max-w-[700px] mx-auto mb-12 font-light leading-relaxed">
                        Manage your roster of artists, curate digital exhibitions, and highlight seasonal events from one unified dashboard.
                        Designed for the modern art world.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-8">
                        <div className="text-center">
                            <span className="font-sans font-semibold text-3xl block mb-2">$79 / month</span>
                            <span className="text-sm text-[#666666]">Includes unlimited artists and exhibitions.</span>
                        </div>

                        <Link href="/auth?view=signup" className="px-10 py-5 bg-[#1a1a1a] text-white text-sm font-medium uppercase tracking-[1.5px] border border-[#1a1a1a] hover:bg-[#333] hover:border-[#333] transition-all">
                            Start Gallery Trial
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section className="py-36 border-t border-[#e5e5e5] bg-[#fafafa]">
                <div className="max-w-[1200px] mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div>
                            <span className="font-serif text-3xl text-[#666666] opacity-30 mb-5 block">01.</span>
                            <h3 className="font-serif text-3xl mb-4 font-normal">Roster Management</h3>
                            <p className="text-[#666666] leading-relaxed">
                                Centralize your artist data. Upload inventories, manage biographies, and keep track of available works across your entire roster in one secure place.
                            </p>
                        </div>
                        <div>
                            <span className="font-serif text-3xl text-[#666666] opacity-30 mb-5 block">02.</span>
                            <h3 className="font-serif text-3xl mb-4 font-normal">Digital Exhibitions</h3>
                            <p className="text-[#666666] leading-relaxed">
                                Create immersive online viewing rooms for your exhibitions. Curate works, add curatorial text, and launch shows that reach collectors globally.
                            </p>
                        </div>
                        <div>
                            <span className="font-serif text-3xl text-[#666666] opacity-30 mb-5 block">03.</span>
                            <h3 className="font-serif text-3xl mb-4 font-normal">Unified Dashboard</h3>
                            <p className="text-[#666666] leading-relaxed">
                                Streamline your operations. From inquiry management to portfolio updates, control every aspect of your digital presence from a single, intuitive interface.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-16 border-t border-[#e5e5e5] text-xs text-[#666666]">
                <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-5 text-center md:text-left">
                    <div className="font-serif text-xl font-semibold text-[#1a1a1a]">Exhibitly.</div>
                    <div>Made for art in Santa Fe & the Cloud.</div>
                    <div className="flex gap-5">
                        <Link href="/privacy" className="hover:text-[#1a1a1a] transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-[#1a1a1a] transition-colors">Terms</Link>
                        <a href="mailto:support@exhibitly.app" className="hover:text-[#1a1a1a] transition-colors">Contact</a>
                    </div>
                </div>
            </footer>

        </div>
    )
}
