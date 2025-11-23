import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-black selection:text-white">

      {/* --- HEADER --- */}
      <header className="py-10 border-b border-transparent">
        <div className="max-w-[1200px] mx-auto px-8 flex justify-between items-center">
          <div className="font-serif text-3xl font-semibold tracking-tighter">Exhibitly.</div>
          <nav className="flex items-center">
            <Link href="/auth" className="ml-8 text-sm font-medium text-[#1a1a1a] hover:opacity-70 transition-opacity">
              Login
            </Link>
            <Link href="/auth" className="ml-5 px-5 py-2 bg-[#1a1a1a] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#333] transition-colors">
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
              src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2000&auto=format&fit=crop"
              alt="Abstract Fine Art"
              fill
              className="object-cover saturate-[0.8] contrast-[1.1]"
              priority
            />
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-normal tracking-wide mb-5 uppercase leading-[1.1]">
            The Digital Standard <br /> for Fine Art.
          </h1>

          <p className="text-lg text-[#666666] max-w-[600px] mx-auto mb-10 font-light leading-relaxed">
            Escape the clutter of generic website builders. Exhibitly is the minimalist platform designed specifically for independent artists and curated galleries.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/auth" className="px-8 py-4 bg-[#1a1a1a] text-white text-sm font-medium uppercase tracking-[1.5px] border border-[#1a1a1a] hover:bg-[#333] hover:border-[#333] transition-all">
              Build Artist Portfolio
            </Link>
            <Link href="#" className="px-8 py-4 bg-transparent text-[#1a1a1a] text-sm font-medium uppercase tracking-[1.5px] border border-[#1a1a1a] hover:bg-[#fafafa] transition-all">
              Explore Gallery Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* --- VALUE PROP (TRIPTYCH) --- */}
      <section className="py-36 border-t border-[#e5e5e5]">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div>
              <span className="font-serif text-3xl text-[#666666] opacity-30 mb-5 block">01.</span>
              <h3 className="font-serif text-3xl mb-4 font-normal">Uncompromising Curation</h3>
              <p className="text-[#666666] leading-relaxed">
                Your work deserves a quiet room. Our templates are intentionally restrained, removing all clutter to place total focus on the art itself.
              </p>
            </div>
            <div>
              <span className="font-serif text-3xl text-[#666666] opacity-30 mb-5 block">02.</span>
              <h3 className="font-serif text-3xl mb-4 font-normal">Museum-Grade Performance</h3>
              <p className="text-[#666666] leading-relaxed">
                Built on next-generation infrastructure to serve ultra-high-resolution images instantly, globally, on any device without compression artifacts.
              </p>
            </div>
            <div>
              <span className="font-serif text-3xl text-[#666666] opacity-30 mb-5 block">03.</span>
              <h3 className="font-serif text-3xl mb-4 font-normal">Zero-Maintenance Design</h3>
              <p className="text-[#666666] leading-relaxed">
                A platform you don't have to manage. No plugins, no updates, no broken themes. Just a pristine environment that always works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SHOWCASE (Selected Exhibitions) --- */}
      <section className="py-36 bg-[#fafafa] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="mb-16 text-left">
            <h2 className="font-serif text-4xl md:text-5xl font-normal">Selected Exhibitions.</h2>
          </div>

          <div className="flex gap-10 overflow-x-auto pb-5 scrollbar-hide -mx-8 px-8 md:mx-0 md:px-0">

            <div className="min-w-[85vw] md:min-w-[600px] flex-shrink-0">
              <div className="w-full aspect-[16/10] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[#eee] overflow-hidden mb-4 relative">
                <Image
                  src="https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?q=80&w=1000&auto=format&fit=crop"
                  alt="Minimalist Portfolio"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="font-serif italic text-[#666666] text-sm">Elena Kogan Studio, Berlin.</div>
            </div>

            <div className="min-w-[85vw] md:min-w-[600px] flex-shrink-0">
              <div className="w-full aspect-[16/10] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[#eee] overflow-hidden mb-4 relative">
                <Image
                  src="https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=1000&auto=format&fit=crop"
                  alt="Gallery Site"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="font-serif italic text-[#666666] text-sm">The High Desert Collective, Santa Fe.</div>
            </div>

            <div className="min-w-[85vw] md:min-w-[600px] flex-shrink-0">
              <div className="w-full aspect-[16/10] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[#eee] overflow-hidden mb-4 relative">
                <Image
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop"
                  alt="Sculpture Portfolio"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="font-serif italic text-[#666666] text-sm">Hiroshi T. Works, Tokyo.</div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SEGMENTATION (Two Doors) --- */}
      <section className="border-t border-[#e5e5e5]">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">

          <div className="p-16 md:p-20 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#e5e5e5] hover:bg-[#fafafa] transition-colors duration-500 group">
            <span className="text-xs uppercase tracking-[2px] text-[#666666] mb-5">For the Solo Practitioner</span>
            <h2 className="font-serif text-5xl mb-5 font-normal leading-[1.1]">The Artist<br />Portfolio.</h2>
            <p className="text-lg text-[#666666] mb-10 max-w-[400px] leading-relaxed">
              An elegant digital calling card. Connect your domain, upload your best work, and present yourself professionally in minutes.
            </p>
            <span className="font-sans font-semibold mb-8 block text-xl">$12 / month</span>
            <div>
              <Link href="/auth" className="inline-block px-8 py-4 bg-[#1a1a1a] text-white text-sm font-medium uppercase tracking-[1.5px] border border-[#1a1a1a] hover:bg-[#333] hover:border-[#333] transition-all">
                Start Artist Trial &rarr;
              </Link>
            </div>
          </div>

          <div className="p-16 md:p-20 flex flex-col justify-center hover:bg-[#fafafa] transition-colors duration-500 group">
            <span className="text-xs uppercase tracking-[2px] text-[#666666] mb-5">For Galleries & Collectives</span>
            <h2 className="font-serif text-5xl mb-5 font-normal leading-[1.1]">The Gallery<br />Platform.</h2>
            <p className="text-lg text-[#666666] mb-10 max-w-[400px] leading-relaxed">
              Manage your roster of artists, curate digital exhibitions, and highlight seasonal events from one unified dashboard.
            </p>
            <span className="font-sans font-semibold mb-8 block text-xl">$79 / month</span>
            <div>
              <Link href="#" className="inline-block px-8 py-4 bg-transparent text-[#1a1a1a] text-sm font-medium uppercase tracking-[1.5px] border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all">
                View Gallery Features &rarr;
              </Link>
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
            <Link href="#" className="hover:text-[#1a1a1a] transition-colors">Contact</Link>
            <Link href="#" className="hover:text-[#1a1a1a] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
