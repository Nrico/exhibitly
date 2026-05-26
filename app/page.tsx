import Link from 'next/link'
import { DemoShowcase } from '@/components/public/demo-showcase'

export default function Home() {
  return (
    <div className="redesign-wrapper">
      <div className="page">
        {/* --- HEADER --- */}
        <header className="site-header">
          <div className="shell nav" aria-label="Main navigation">
            <Link className="brand" href="/">Exhibitly</Link>
            <nav className="nav-links">
              <a href="#features">Features</a>
              <a href="#demo">Demo</a>
              <a href="#pricing">Pricing</a>
              <Link href="/auth">Sign in</Link>
              <Link className="button" href="/auth?view=signup">Start your portfolio</Link>
            </nav>
          </div>
        </header>

        <main>
          {/* --- HERO SECTION --- */}
          <section className="hero section">
            <div className="shell hero-grid">
              <div>
                <div className="eyebrow">For independent artists</div>
                <h1>A clean portfolio system for artists who would rather make work than manage a website.</h1>
                <div className="accent-line" aria-hidden="true"></div>
                <p className="lede">Organize your artwork once. Instantly publish a beautiful website, share private viewing rooms, and export studio packets—no code, no plugins, no updates.</p>
                <div className="hero-actions">
                  <Link className="button" href="/auth?view=signup">Start your portfolio</Link>
                  <Link className="button secondary" href="/demo">View demo artist site</Link>
                </div>
                <div className="tiny-flow" aria-label="Instagram posts become organized artwork records">
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <rect x="10" y="10" width="28" height="28" rx="8" stroke="currentColor" strokeWidth="2" />
                    <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2" />
                    <circle cx="32.5" cy="15.5" r="2" fill="currentColor" />
                  </svg>
                  <span className="arrow"></span>
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <g fill="currentColor">
                      <circle cx="14" cy="14" r="3" /><circle cx="24" cy="14" r="3" /><circle cx="34" cy="14" r="3" />
                      <circle cx="14" cy="24" r="3" /><circle cx="24" cy="24" r="3" /><circle cx="34" cy="24" r="3" />
                      <circle cx="14" cy="34" r="3" /><circle cx="24" cy="34" r="3" /><circle cx="34" cy="34" r="3" />
                    </g>
                  </svg>
                  <span className="arrow"></span>
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M10 18h28v20H10V18Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M14 12h20l4 6H10l4-6Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M19 26h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="hero-visual" aria-label="Product preview">
                <div className="torn-paper" aria-hidden="true"></div>

                {/* Simulated Artist Site Frame */}
                <div className="browser-card">
                  <div className="window-dots" aria-hidden="true"><span></span><span></span><span></span></div>
                  <div className="mini-site-head">
                    <strong>MAYA ELLISON</strong>
                    <div className="mini-links"><span>Work</span><span>About</span><span>Journal</span><span>Contact</span></div>
                  </div>
                  <div className="art-grid">
                    <div className="art-thumb">
                      <img src="/images/home_detail.png" alt="Desert Light" className="w-full h-full object-cover" />
                    </div>
                    <div className="art-thumb">
                      <img src="/images/home_detail1.png" alt="Gray Landscape" className="w-full h-full object-cover" />
                    </div>
                    <div className="art-thumb">
                      <img src="/images/home_detail2.png" alt="Mesa Study" className="w-full h-full object-cover" />
                    </div>
                    <div className="art-thumb">
                      <img src="/images/home_detail.png" alt="Salt Flats" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Simulated Detail Card */}
                <div className="detail-card">
                  <div className="back-link">← Back to work</div>
                  <div className="detail-inner">
                    <div className="art-thumb">
                      <img src="/images/home_detail.png" alt="Desert Light" className="w-full h-full object-cover" />
                    </div>
                    <div className="detail-text">
                      <strong>DESERT LIGHT, 2024</strong>
                      <div>Oil on panel<br />24 x 30 in<br />2024</div>
                      <div className="price">$1,800</div>
                      <Link href="/auth?view=signup" className="dark-button">Inquire</Link>
                      <div>Add to viewing room</div>
                      <div className="small-rule"><span>Details</span><span>+</span></div>
                    </div>
                  </div>
                </div>

                {/* Simulated PDF Card */}
                <div className="pdf-card">
                  <span className="pdf-badge">PDF</span>
                  <div className="label">Studio packet</div>
                  <h4>MAYA ELLISON</h4>
                  <div className="art-thumb">
                    <img src="/images/home_detail1.png" alt="Gray Landscape" className="w-full h-full object-cover" />
                  </div>
                  <div className="small">Selection of recent work<br />Spring 2024</div>
                </div>
              </div>
            </div>
          </section>

          {/* --- COMPARISON SECTION --- */}
          <section className="section comparison" id="comparison">
            <div className="shell">
              <div className="section-head text-center">
                <div>
                  <span className="eyebrow">A Sharper Direction</span>
                  <h2>Instagram is for discovery. <br />Exhibitly is for your body of work.</h2>
                  <div className="accent-line mx-auto" aria-hidden="true"></div>
                </div>
              </div>

              <div className="comparison-grid">
                <div className="comparison-card instagram">
                  <div className="card-header">
                    <span className="platform-tag">Instagram</span>
                    <span className="platform-status">Discovery Feed</span>
                  </div>
                  <ul className="comparison-list">
                    <li>
                      <strong>Buries past works</strong>
                      <span className="desc">Your best artwork is quickly lost under daily stories, reels, and algorithm updates.</span>
                    </li>
                    <li>
                      <strong>Mixes personal & professional</strong>
                      <span className="desc">Finished artwork sits directly next to studio updates, announcements, and personal posts.</span>
                    </li>
                    <li>
                      <strong>Offers only a social profile</strong>
                      <span className="desc">Provides a single links page rather than an organized archive or professional website.</span>
                    </li>
                  </ul>
                </div>

                <div className="comparison-card exhibitly-comparison">
                  <div className="card-header">
                    <span className="platform-tag active">Exhibitly</span>
                    <span className="platform-status highlight">Structured Archive</span>
                  </div>
                  <ul className="comparison-list">
                    <li>
                      <strong>Maintains your complete body of work</strong>
                      <span className="desc">A structured archive categorized by collections, media, year, and status.</span>
                    </li>
                    <li>
                      <strong>Keeps presentation pure</strong>
                      <span className="desc">Separates finished work from active announcements, showcasing only your art.</span>
                    </li>
                    <li>
                      <strong>Delivers a complete portfolio system</strong>
                      <span className="desc">Instantly generates a public site, private viewing rooms, and high-res PDF studio packets.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* --- WORKFLOW SECTION --- */}
          <section className="section workflow" id="workflow">
            <div className="shell">
              <div className="section-head text-center">
                <div>
                  <span className="eyebrow">The Process</span>
                  <h2>How Exhibitly Works</h2>
                  <div className="accent-line mx-auto" aria-hidden="true"></div>
                </div>
                <p className="max-w-[600px] mx-auto text-sm text-[#475569]">
                  No coding, no database maintenance, no custom design cycles. Upload your artwork once and distribute it everywhere.
                </p>
              </div>

              <div className="workflow-grid">
                <div className="workflow-step">
                  <div className="step-num">01</div>
                  <h3>Connect & Upload</h3>
                  <p>Drop your artwork images into your dashboard, or connect your Instagram feed to automatically synchronize new posts as structured records.</p>
                </div>
                <div className="workflow-step">
                  <div className="step-num">02</div>
                  <h3>Archive & Organize</h3>
                  <p>Add metadata fields—title, year, medium, size, price, and status—to compile a permanent, searchable archive of your career.</p>
                </div>
                <div className="workflow-step">
                  <div className="step-num">03</div>
                  <h3>Share & Export</h3>
                  <p>In one click, turn your records into a public website, compile custom private viewing rooms for collectors, or export PDF studio packets.</p>
                </div>
              </div>
            </div>
          </section>

          {/* --- FEATURES SECTION --- */}
          <section className="section" id="features">
            <div className="shell">
              <div className="section-head">
                <div>
                  <h2>A structured system for your art</h2>
                  <div className="accent-line" aria-hidden="true"></div>
                </div>
                <p>Everything you need to turn your artwork into a clear, shareable portfolio, without managing a complicated website.</p>
              </div>

              <div className="feature-grid">
                <article className="feature-card">
                  <svg className="card-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <rect x="8" y="11" width="32" height="26" rx="3" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 18h32" stroke="currentColor" strokeWidth="2"/>
                    <path d="M15 29h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h3>A real home for your artwork</h3>
                  <div className="mini-ui">
                    <div className="mini-ui-grid">
                      <div className="art-thumb">
                        <img src="/images/home_detail.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="art-thumb">
                        <img src="/images/home_detail1.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="art-thumb">
                        <img src="/images/home_detail2.png" alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                  <p>Keep finished work separate from posts, reels, and announcements.</p>
                </article>

                <article className="feature-card">
                  <svg className="card-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M8 15h12l4 5h16v17H8V15Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 22h32" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <h3>Artwork records that stay organized</h3>
                  <div className="mini-ui">
                    <div className="mini-row"><span>Desert Light</span><span>2024</span></div>
                    <div className="mini-row"><span>Mesa Study</span><span>2024</span></div>
                    <div className="mini-row"><span>Wind Line</span><span>2023</span></div>
                  </div>
                  <p>Track title, year, medium, size, price, and availability.</p>
                </article>

                <article className="feature-card">
                  <svg className="card-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M10 23 24 9h14v14L24 37 10 23Z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="32" cy="16" r="2" fill="currentColor"/>
                  </svg>
                  <h3>Share work without rebuilding anything</h3>
                  <div className="mini-ui">
                    <div className="mini-row"><span>Desert Light</span><span>$1,800</span></div>
                    <div className="mini-row"><span>Mesa Study</span><span>$1,400</span></div>
                    <div className="mini-row"><span>Salt Flats</span><span>Inquire</span></div>
                  </div>
                  <p>Create portfolio pages, viewing rooms, and PDF packets from the same archive.</p>
                </article>

                <article className="feature-card">
                  <svg className="card-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M14 7h14l8 8v26H14V7Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M28 7v9h8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M19 27h12M19 33h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h3>Zero-maintenance infrastructure</h3>
                  <div className="mini-ui">
                    <div className="mini-row"><span>Portfolio PDF</span><span>Ready</span></div>
                    <div className="mini-row"><span>Price list</span><span>Ready</span></div>
                    <div className="mini-row"><span>Statement</span><span>Included</span></div>
                  </div>
                  <p>No updates, plugins, or broken layouts. Built for art in the Cloud.</p>
                </article>
              </div>
            </div>
          </section>

          {/* --- DEMO SECTION --- */}
          <section className="section" id="demo">
            <div className="shell">
              <DemoShowcase />
            </div>
          </section>

          {/* --- PRICING SECTION --- */}
          <section className="section pricing" id="pricing">
            <div className="shell">
              <div className="section-head text-center">
                <div>
                  <h2>Simple pricing</h2>
                  <div className="accent-line mx-auto" aria-hidden="true"></div>
                </div>
              </div>

              <div className="price-card">
                <div>
                  <h3>Artist plan</h3>
                  <div className="price">$12<span>/month</span></div>
                </div>
                <ul className="check-list">
                  <li>Public artist website</li>
                  <li>Artwork archive</li>
                  <li>Available works page</li>
                  <li>Portfolio PDF export</li>
                  <li>Private viewing rooms</li>
                  <li>Bio, statement and CV tools</li>
                </ul>
                <div>
                  <Link className="button" href="/auth?view=signup">Start your portfolio</Link>
                  <p className="cancel">Cancel anytime.</p>
                </div>
              </div>

              <div className="text-center mt-8 font-mono text-[10px] uppercase tracking-[1.5px] text-[#666666]">
                Are you a gallery or art collective? <Link href="/gallery" className="underline hover:text-black transition-colors">Learn about our gallery toolkits &rarr;</Link>
              </div>
            </div>
          </section>

          {/* --- CTA STRIP --- */}
          <section className="cta-strip">
            <div className="shell py-8">
              <h2 className="mb-4">Build the portfolio your work deserves.</h2>
              <Link className="button" href="/auth?view=signup">Start your portfolio</Link>
            </div>
          </section>
        </main>

        {/* --- FOOTER --- */}
        <footer className="site-footer">
          <div className="shell footer-grid">
            <div>
              <div className="footer-brand">Exhibitly</div>
              <p>Built for artists. Made for opportunities.</p>
            </div>
            <nav className="footer-links" aria-label="Footer navigation">
              <a href="#features">Features</a>
              <a href="#demo">Demo</a>
              <a href="#pricing">Pricing</a>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>
            <div>
              <p>© 2026 Exhibitly, LLC<br />All rights reserved.</p>
              <div className="social" aria-label="Social links">
                <Link href="#" aria-label="Instagram">
                  <svg viewBox="0 0 48 48" fill="none">
                    <rect x="10" y="10" width="28" height="28" rx="8" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="32.5" cy="15.5" r="2" fill="currentColor"/>
                  </svg>
                </Link>
                <Link href="mailto:hello@exhibitly.art" aria-label="Email">
                  <svg viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="13" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2"/>
                    <path d="m10 16 14 11 14-11" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
