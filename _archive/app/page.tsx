import Header from "@/components/header";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero py-24 pt-16 text-center">
          <div className="max-w-6xl mx-auto px-8">
            <div className="hero-image-frame max-w-5xl mx-auto mb-16 aspect-video bg-[#f0f0f0] overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2000&auto=format&fit=crop"
                alt="Abstract Fine Art"
                fill={true}
                style={{objectFit: 'cover'}}
                className="filter saturate-80 contrast-110"
              />
            </div>

            <h1 className="font-serif text-6xl font-normal tracking-widest uppercase leading-tight mb-5">
              The Digital Standard <br /> for Fine Art.
            </h1>

            <p className="text-lg text-text-muted max-w-xl mx-auto mb-10 font-light">
              Escape the clutter of generic website builders. Exhibitly is the minimalist platform designed specifically for independent artists and curated galleries.
            </p>

            <div className="flex justify-center gap-5">
              <Link href="#" className="inline-block px-8 py-4 text-sm uppercase tracking-wider font-medium cursor-pointer border border-text-main transition-all duration-300 bg-text-main text-white">Build Artist Portfolio</Link>
              <Link href="#" className="inline-block px-8 py-4 text-sm uppercase tracking-wider font-medium cursor-pointer border border-text-main transition-all duration-300 hover:bg-bg-alt">Explore Gallery Solutions</Link>
            </div>
          </div>
        </section>

        {/* Value Prop (Triptych) Section */}
        <section className="py-36 border-t border-border-color">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="prop-card">
                <span className="font-serif text-3xl text-text-muted opacity-30 mb-5 block">01.</span>
                <h3 className="font-serif text-2xl mb-4 font-normal">Uncompromising Curation</h3>
                <p className="text-base text-text-muted leading-relaxed">Your work deserves a quiet room. Our templates are intentionally restrained, removing all clutter to place total focus on the art itself.</p>
              </div>
              <div className="prop-card">
                <span className="font-serif text-3xl text-text-muted opacity-30 mb-5 block">02.</span>
                <h3 className="font-serif text-2xl mb-4 font-normal">Museum-Grade Performance</h3>
                <p className="text-base text-text-muted leading-relaxed">Built on next-generation infrastructure to serve ultra-high-resolution images instantly, globally, on any device without compression artifacts.</p>
              </div>
              <div className="prop-card">
                <span className="font-serif text-3xl text-text-muted opacity-30 mb-5 block">03.</span>
                <h3 className="font-serif text-2xl mb-4 font-normal">Zero-Maintenance Design</h3>
                <p className="text-base text-text-muted leading-relaxed">A platform you don't have to manage. No plugins, no updates, no broken themes. Just a pristine environment that always works.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase (Selected Exhibitions) Section */}
        <section className="py-36 bg-bg-alt overflow-hidden">
          <div className="max-w-6xl mx-auto px-8">
            <div className="section-header mb-16 text-left">
              <h2 className="font-serif text-4xl font-normal">Selected Exhibitions.</h2>
            </div>
            
            <div className="flex gap-10 pb-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <div className="min-w-[600px] flex-shrink-0">
                <div className="w-full aspect-video bg-white shadow-xl border border-border-color overflow-hidden mb-4 relative">
                  <Image src="https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?q=80&w=1000" alt="Minimalist Portfolio" fill={true} style={{objectFit: 'cover', objectPosition: 'top'}} />
                </div>
                <div className="font-serif italic text-text-muted text-sm">Elena Kogan Studio, Berlin.</div>
              </div>

              <div className="min-w-[600px] flex-shrink-0">
                <div className="w-full aspect-video bg-white shadow-xl border border-border-color overflow-hidden mb-4 relative">
                  <Image src="https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=1000" alt="Gallery Site" fill={true} style={{objectFit: 'cover', objectPosition: 'top'}} />
                </div>
                <div className="font-serif italic text-text-muted text-sm">The High Desert Collective, Santa Fe.</div>
              </div>

              <div className="min-w-[600px] flex-shrink-0">
                <div className="w-full aspect-video bg-white shadow-xl border border-border-color overflow-hidden mb-4 relative">
                  <Image src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000" alt="Sculpture Portfolio" fill={true} style={{objectFit: 'cover', objectPosition: 'top'}} />
                </div>
                <div className="font-serif italic text-text-muted text-sm">Hiroshi T. Works, Tokyo.</div>
              </div>

            </div>
          </div>
        </section>

        {/* Segmentation (Two Doors) Section */}
        <section className="border-t border-border-color">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            <div className="p-16 lg:p-20 flex flex-col justify-center border-r border-border-color transition-colors duration-300 hover:bg-bg-alt">
              <span className="text-xs uppercase tracking-wider text-text-muted mb-5">For the Solo Practitioner</span>
              <h2 className="font-serif text-5xl font-normal leading-tight mb-5">The Artist<br/>Portfolio.</h2>
              <p className="text-lg text-text-muted mb-10 max-w-md">An elegant digital calling card. Connect your domain, upload your best work, and present yourself professionally in minutes.</p>
              <span className="font-sans font-semibold mb-8 block text-xl">$12 / month</span>
              <div>
                <Link href="#" className="inline-block px-8 py-4 text-sm uppercase tracking-wider font-medium cursor-pointer border border-text-main transition-all duration-300 bg-text-main text-white">Start Artist Trial &rarr;</Link>
              </div>
            </div>

            <div className="p-16 lg:p-20 flex flex-col justify-center transition-colors duration-300 hover:bg-bg-alt">
              <span className="text-xs uppercase tracking-wider text-text-muted mb-5">For Galleries & Collectives</span>
              <h2 className="font-serif text-5xl font-normal leading-tight mb-5">The Gallery<br/>Platform.</h2>
              <p className="text-lg text-text-muted mb-10 max-w-md">Manage your roster of artists, curate digital exhibitions, and highlight seasonal events from one unified dashboard.</p>
              <span className="font-sans font-semibold mb-8 block text-xl">$79 / month</span>
              <div>
                <Link href="#" className="inline-block px-8 py-4 text-sm uppercase tracking-wider font-medium cursor-pointer border border-text-main transition-all duration-300 text-text-main hover:bg-bg-alt">View Gallery Features &rarr;</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 border-t border-border-color text-sm text-text-muted">
          <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
            <div className="font-serif text-lg">Exhibitly.</div>
            <div>Made for art in Santa Fe & the Cloud.</div>
            <div>
                <Link href="#" className="ml-5">Contact</Link>
                <Link href="#" className="ml-5">Terms</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}