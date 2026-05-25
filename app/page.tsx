import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-warm-white text-brand-charcoal font-sans selection:bg-brand-clay selection:text-white">

      {/* --- HEADER --- */}
      <header className="py-8 border-b border-brand-sand-line">
        <div className="max-w-[1200px] mx-auto px-8 flex justify-between items-center">
          <div className="font-serif text-3xl font-normal tracking-tight">
            Exhibitly<span className="text-brand-clay">.art</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/demo" className="text-sm font-medium text-brand-graphite hover:text-brand-charcoal transition-colors">
              View Demo
            </Link>
            <Link href="/auth" className="text-sm font-medium text-brand-graphite hover:text-brand-charcoal transition-colors">
              Login
            </Link>
            <Link href="/auth?view=signup" className="px-5 py-2.5 bg-brand-charcoal text-brand-warm-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-clay transition-colors border border-brand-charcoal">
              Start Portfolio
            </Link>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="pt-16 pb-24 border-b border-brand-sand-line">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay border-b border-brand-clay pb-1">
                Born in Santa Fe. Built for artists everywhere.
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide uppercase leading-[1.1] text-brand-black">
                Turn your Instagram feed into a real artist portfolio.
              </h1>
              <p className="text-lg text-brand-graphite font-light leading-relaxed">
                Exhibitly gives artists a clean website, artwork archive, available-works page, and shareable portfolio packets—without learning web design. 
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth?view=signup" className="px-8 py-4 bg-brand-charcoal text-brand-warm-white text-xs font-semibold uppercase tracking-[2px] hover:bg-brand-clay hover:border-brand-clay border border-brand-charcoal transition-all text-center">
                  Start your portfolio
                </Link>
                <Link href="/demo" className="px-8 py-4 bg-transparent text-brand-charcoal text-xs font-semibold uppercase tracking-[2px] border border-brand-charcoal hover:bg-brand-bone transition-all text-center">
                  View demo artist site
                </Link>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="lg:col-span-6 bg-brand-bone p-6 border border-brand-sand-line shadow-sm relative overflow-hidden">
              <div className="absolute top-2 right-2 text-[9px] uppercase tracking-widest text-brand-graphite opacity-30">
                Visual Archive Mock
              </div>
              <div className="space-y-4">
                {/* Simulated Artist Wall Row */}
                <div className="border border-brand-sand-line bg-brand-warm-white p-4">
                  <div className="flex justify-between items-center mb-3 border-b border-brand-sand-line pb-2">
                    <span className="font-serif italic text-xs">Elena Lujan Studio &mdash; Taos, NM</span>
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-brand-bone border border-brand-sand-line text-brand-copper font-bold">
                      Available Works
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="aspect-square bg-gray-200 relative overflow-hidden border border-brand-sand-line">
                      <Image src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=300" fill alt="" className="object-cover saturate-[0.8]" />
                    </div>
                    <div className="aspect-square bg-gray-200 relative overflow-hidden border border-brand-sand-line">
                      <Image src="https://images.unsplash.com/photo-1507643179173-4463bd0ed3fa?q=80&w=300" fill alt="" className="object-cover saturate-[0.8]" />
                    </div>
                    <div className="aspect-square bg-gray-200 relative overflow-hidden border border-brand-sand-line">
                      <div className="w-full h-full flex flex-col justify-center items-center p-2 text-center bg-brand-bone">
                        <span className="text-[10px] font-semibold text-brand-clay font-mono">+8 Works</span>
                        <span className="text-[8px] text-brand-graphite">Imported</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Flat File Artwork Label */}
                <div className="border border-brand-sand-line bg-brand-warm-white p-4 font-mono text-xs text-brand-graphite space-y-2">
                  <div className="flex justify-between border-b border-brand-sand-line pb-1.5 font-bold text-brand-charcoal">
                    <span>LABEL // FLAT_FILE_022</span>
                    <span className="text-brand-clay">AVAILABLE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-4">
                    <div>TITLE: <span className="text-brand-charcoal font-sans font-semibold">Adobe Study II</span></div>
                    <div>YEAR: <span className="text-brand-charcoal">2025</span></div>
                    <div>MEDIUM: <span className="text-brand-charcoal font-sans italic">Clay & Beeswax</span></div>
                    <div>SIZE: <span className="text-brand-charcoal">12" x 12" x 16"</span></div>
                  </div>
                </div>

                {/* Simulated Private Viewing Room Badge */}
                <div className="border border-brand-sand-line bg-brand-warm-white p-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-copper"></div>
                    <span className="font-mono text-brand-graphite">exhibitly.art/view/elena-preview</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-graphite">
                    Private Room
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PROBLEM SECTION --- */}
      <section className="py-24 border-b border-brand-sand-line bg-brand-bone/30">
        <div className="max-w-[800px] mx-auto px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-black">
            Your work deserves more than a feed.
          </h2>
          <p className="text-lg text-brand-graphite font-light leading-relaxed">
            Instagram is excellent for getting attention, but it is a poor archive. Older work gets buried, and finished pieces are mixed with process posts, personal updates, and reels. 
          </p>
          <p className="text-base text-brand-graphite font-light leading-relaxed">
            Exhibitly gives your artwork a clean, lasting home. Keep Instagram for reach, and use Exhibitly as your professional archive, available-works list, and packet builder.
          </p>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 border-b border-brand-sand-line">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-clay">Archival Tools</span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-black">Built for the artist's studio workflow.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Website */}
            <div className="bg-brand-warm-white border border-brand-sand-line p-8 flex flex-col justify-between hover:border-brand-clay transition-colors group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-brand-graphite block">01 / PUBLIC PORTFOLIO</span>
                <h3 className="font-serif text-2xl font-normal group-hover:text-brand-clay transition-colors">Artist Website (Wall)</h3>
                <p className="text-sm text-brand-graphite leading-relaxed">
                  A minimal public site showcasing selected works, artist bio, statement, CV, and contact options. No web design skills required.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-sand-line text-xs font-mono text-brand-graphite">
                theme: White Cube / Archive / Cinema
              </div>
            </div>

            {/* Flat File */}
            <div className="bg-brand-warm-white border border-brand-sand-line p-8 flex flex-col justify-between hover:border-brand-clay transition-colors group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-brand-graphite block">02 / CORE ARCHIVE</span>
                <h3 className="font-serif text-2xl font-normal group-hover:text-brand-clay transition-colors">Flat File Archive</h3>
                <p className="text-sm text-brand-graphite leading-relaxed">
                  A structured repository for your inventory. Log titles, years, mediums, sizes, prices, availability status, and private studio notes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-sand-line text-xs font-mono text-brand-graphite">
                logs: Available / Sold / Archived
              </div>
            </div>

            {/* Available Works */}
            <div className="bg-brand-warm-white border border-brand-sand-line p-8 flex flex-col justify-between hover:border-brand-clay transition-colors group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-brand-graphite block">03 / SALES SHEET</span>
                <h3 className="font-serif text-2xl font-normal group-hover:text-brand-clay transition-colors">Available Works Page</h3>
                <p className="text-sm text-brand-graphite leading-relaxed">
                  An auto-generating catalog page showcasing only pieces currently for sale. Easily share the link with collectors, curators, or art consultants.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-sand-line text-xs font-mono text-brand-graphite">
                action: Inquire / Purchase Link
              </div>
            </div>

            {/* Viewing Rooms */}
            <div className="bg-brand-warm-white border border-brand-sand-line p-8 flex flex-col justify-between hover:border-brand-clay transition-colors group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-brand-graphite block">04 / SECURE PREVIEWS</span>
                <h3 className="font-serif text-2xl font-normal group-hover:text-brand-clay transition-colors">Private Viewing Rooms</h3>
                <p className="text-sm text-brand-graphite leading-relaxed">
                  Curate select artworks into a private page to send directly to a client, collector, or gallery. Perfect for pre-exhibition previews or private collections.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-sand-line text-xs font-mono text-brand-graphite">
                access: Unique Link Share
              </div>
            </div>

            {/* Studio Packets */}
            <div className="bg-brand-warm-white border border-brand-sand-line p-8 flex flex-col justify-between hover:border-brand-clay transition-colors group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-brand-graphite block">05 / PORTFOLIO EXPORT</span>
                <h3 className="font-serif text-2xl font-normal group-hover:text-brand-clay transition-colors">Studio Packets (PDF)</h3>
                <p className="text-sm text-brand-graphite leading-relaxed">
                  Export elegant portfolio PDFs, price lists, available works checklists, or gallery submission packets. Complete with captions, bios, and contact info.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-sand-line text-xs font-mono text-brand-graphite">
                export: checklist.pdf / catalog.pdf
              </div>
            </div>

            {/* Submission Packet Builder */}
            <div className="bg-brand-warm-white border border-brand-sand-line p-8 flex flex-col justify-between hover:border-brand-clay transition-colors group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-brand-graphite block">06 / APPLICATION SUITE</span>
                <h3 className="font-serif text-2xl font-normal group-hover:text-brand-clay transition-colors">Submission Builder</h3>
                <p className="text-sm text-brand-graphite leading-relaxed">
                  Apply to grants, residencies, and juried opportunities. Build a digital packet of 5-20 selected works, bio, statement, CV, and a quick export option.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-sand-line text-xs font-mono text-brand-graphite">
                target: Residencies / Grants / Juries
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- USE CASE SECTION --- */}
      <section className="py-24 border-b border-brand-sand-line bg-brand-bone/10">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="font-serif text-3xl mb-12 text-center text-brand-black">How artists use Exhibitly daily:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-brand-bone border border-brand-sand-line space-y-3">
              <h4 className="font-serif text-lg font-bold">1. Collector Inquiry</h4>
              <p className="text-xs text-brand-graphite leading-relaxed">
                "A collector saw a piece on Instagram and DMed me. Instead of texting messy screenshots, I sent them my Available Works link showing sizes, prices, and high-res details."
              </p>
            </div>
            <div className="p-6 bg-brand-bone border border-brand-sand-line space-y-3">
              <h4 className="font-serif text-lg font-bold">2. Residency Application</h4>
              <p className="text-xs text-brand-graphite leading-relaxed">
                "I needed to submit a 10-image portfolio packet, bio, and statement. I selected the works in the Submission Builder, clicked export, and had a clean, labeled PDF in seconds."
              </p>
            </div>
            <div className="p-6 bg-brand-bone border border-brand-sand-line space-y-3">
              <h4 className="font-serif text-lg font-bold">3. Gallery Preview</h4>
              <p className="text-xs text-brand-graphite leading-relaxed">
                "Before publishing my new series, I put them in a Private Viewing Room and shared the link with my gallery representative so they could reserve works for their top clients."
              </p>
            </div>
            <div className="p-6 bg-brand-bone border border-brand-sand-line space-y-3">
              <h4 className="font-serif text-lg font-bold">4. Instagram Migration</h4>
              <p className="text-xs text-brand-graphite leading-relaxed">
                "I used my Instagram feed as a makeshift website for years. Exhibitly let me quickly transfer my posts into a neat, stable archive with proper inventory labels."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMPARISON SECTION --- */}
      <section className="py-24 border-b border-brand-sand-line">
        <div className="max-w-[1000px] mx-auto px-8">
          <h2 className="font-serif text-3xl mb-12 text-center text-brand-black">Finding your digital home</h2>
          
          <div className="overflow-x-auto border border-brand-sand-line bg-brand-warm-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-brand-bone border-b border-brand-sand-line text-xs uppercase tracking-wider text-brand-graphite">
                  <th className="p-4 font-semibold">Capability</th>
                  <th className="p-4 font-semibold">Instagram</th>
                  <th className="p-4 font-semibold">Squarespace/Wix</th>
                  <th className="p-4 font-semibold">Exhibitly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand-line">
                <tr>
                  <td className="p-4 font-medium">Web design needed?</td>
                  <td className="p-4 text-brand-graphite">None</td>
                  <td className="p-4 text-brand-red-earth font-medium">High effort</td>
                  <td className="p-4 text-brand-copper font-medium">None &mdash; Auto-built</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Art-specific fields?</td>
                  <td className="p-4 text-brand-red-earth">No (just captions)</td>
                  <td className="p-4 text-brand-red-earth">No (generic stores)</td>
                  <td className="p-4 text-brand-copper font-medium">Yes (medium, dimensions, year)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Available-works only page?</td>
                  <td className="p-4 text-brand-red-earth">No (mixed feed)</td>
                  <td className="p-4 text-brand-graphite">Requires custom filters</td>
                  <td className="p-4 text-brand-copper font-medium">Yes (One-click filter)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Export PDF studio packets?</td>
                  <td className="p-4 text-brand-red-earth">No</td>
                  <td className="p-4 text-brand-red-earth">No</td>
                  <td className="p-4 text-brand-copper font-medium">Yes (One-click PDFs)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Private viewing rooms?</td>
                  <td className="p-4 text-brand-graphite">Requires private account</td>
                  <td className="p-4 text-brand-graphite">Password pages only</td>
                  <td className="p-4 text-brand-copper font-medium">Yes (Time-limited links)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- LIVE DEMO LINK SECTION --- */}
      <section className="py-24 border-b border-brand-sand-line bg-brand-bone/20">
        <div className="max-w-[1200px] mx-auto px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-clay">Experience the Archive</span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-black">See a live, active portfolio.</h2>
          <p className="text-brand-graphite font-light max-w-[600px] mx-auto text-sm md:text-base leading-relaxed">
            Explore the public Wall, Available Works list, and private Viewing Room simulator of Taos-based ceramicist **Elena Lujan**.
          </p>
          <div className="pt-2">
            <Link href="/demo" className="inline-block px-10 py-5 bg-brand-charcoal text-brand-warm-white text-xs font-semibold uppercase tracking-[2px] hover:bg-brand-clay transition-all border border-brand-charcoal">
              Explore Elena's Demo Site &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="py-24 border-b border-brand-sand-line">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-clay">Straightforward pricing</span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-black">One plan. Everything you need.</h2>
          </div>

          <div className="max-w-[450px] mx-auto bg-brand-bone border border-brand-sand-line p-10 text-center space-y-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-normal">Artist Plan</h3>
              <div className="text-4xl font-bold text-brand-black">$12<span className="text-sm font-light text-brand-graphite">/mo</span></div>
              <p className="text-xs text-brand-graphite">Cancel or pause subscription anytime.</p>
            </div>
            
            <ul className="text-left text-xs text-brand-graphite space-y-3.5 border-t border-b border-brand-sand-line py-6 font-mono">
              <li className="flex gap-2.5">
                <span className="text-brand-clay font-bold">&check;</span> Public Artist Website (Wall)
              </li>
              <li className="flex gap-2.5">
                <span className="text-brand-clay font-bold">&check;</span> Unlimited Flat File artwork archive
              </li>
              <li className="flex gap-2.5">
                <span className="text-brand-clay font-bold">&check;</span> Instant Available Works sales page
              </li>
              <li className="flex gap-2.5">
                <span className="text-brand-clay font-bold">&check;</span> Private Viewing Rooms (Share links)
              </li>
              <li className="flex gap-2.5">
                <span className="text-brand-clay font-bold">&check;</span> Export PDF Studio Packets & Checklists
              </li>
              <li className="flex gap-2.5">
                <span className="text-brand-clay font-bold">&check;</span> Custom Domain connectivity (yourname.com)
              </li>
            </ul>

            <div className="pt-2">
              <Link href="/auth?view=signup" className="block w-full py-4 bg-brand-charcoal text-brand-warm-white text-xs font-semibold uppercase tracking-[2px] hover:bg-brand-clay transition-all border border-brand-charcoal text-center no-underline">
                Start your 14-day trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-28 text-center bg-brand-bone">
        <div className="max-w-[800px] mx-auto px-8 space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl text-brand-black leading-tight">
            Build the portfolio your work deserves.
          </h2>
          <p className="text-brand-graphite text-lg font-light leading-relaxed max-w-[550px] mx-auto">
            Escape the scrolling feed. Give your artwork a clean, curated, professional home.
          </p>
          <div className="pt-2">
            <Link href="/auth?view=signup" className="inline-block px-10 py-5 bg-brand-charcoal text-brand-warm-white text-xs font-semibold uppercase tracking-[2px] hover:bg-brand-clay transition-all border border-brand-charcoal">
              Start your portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 border-t border-brand-sand-line text-xs text-brand-graphite bg-brand-warm-white">
        <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="font-serif text-xl font-normal text-brand-black">Exhibitly.art</div>
          <div className="font-light">Born in Santa Fe & Taos. Built for independent artists everywhere.</div>
          <div className="flex gap-6 font-mono text-[10px]">
            <Link href="/privacy" className="hover:text-brand-clay transition-colors">PRIVACY</Link>
            <Link href="/terms" className="hover:text-brand-clay transition-colors">TERMS</Link>
            <a href="mailto:support@exhibitly.art" className="hover:text-brand-clay transition-colors">CONTACT</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
