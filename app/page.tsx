import Link from 'next/link'

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
                <div className="eyebrow">For working artists</div>
                <h1>Turn your Instagram feed into a real artist portfolio.</h1>
                <div className="accent-line" aria-hidden="true"></div>
                <p className="lede">Exhibitly gives artists a clean website, artwork archive, available-works page and shareable portfolio packets, without learning web design.</p>
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

          {/* --- FEATURES SECTION --- */}
          <section className="section" id="features">
            <div className="shell">
              <div className="section-head">
                <div>
                  <h2>Built for working artists</h2>
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
                  <h3>Artist website</h3>
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
                  <p>A beautiful, mobile-friendly site that is easy to update.</p>
                </article>

                <article className="feature-card">
                  <svg className="card-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M8 15h12l4 5h16v17H8V15Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 22h32" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <h3>Artwork archive</h3>
                  <div className="mini-ui">
                    <div className="mini-row"><span>Desert Light</span><span>2024</span></div>
                    <div className="mini-row"><span>Mesa Study</span><span>2024</span></div>
                    <div className="mini-row"><span>Wind Line</span><span>2023</span></div>
                  </div>
                  <p>Catalog your work with dates, details and images.</p>
                </article>

                <article className="feature-card">
                  <svg className="card-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M10 23 24 9h14v14L24 37 10 23Z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="32" cy="16" r="2" fill="currentColor"/>
                  </svg>
                  <h3>Available works</h3>
                  <div className="mini-ui">
                    <div className="mini-row"><span>Desert Light</span><span>$1,800</span></div>
                    <div className="mini-row"><span>Mesa Study</span><span>$1,400</span></div>
                    <div className="mini-row"><span>Salt Flats</span><span>Inquire</span></div>
                  </div>
                  <p>Show available works with prices and inquiry options.</p>
                </article>

                <article className="feature-card">
                  <svg className="card-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <path d="M14 7h14l8 8v26H14V7Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M28 7v9h8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M19 27h12M19 33h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h3>Studio packets</h3>
                  <div className="mini-ui">
                    <div className="mini-row"><span>Portfolio PDF</span><span>Ready</span></div>
                    <div className="mini-row"><span>Price list</span><span>Ready</span></div>
                    <div className="mini-row"><span>Statement</span><span>Included</span></div>
                  </div>
                  <p>Export a beautiful PDF of your best work.</p>
                </article>
              </div>
            </div>
          </section>

          {/* --- DEMO SECTION --- */}
          <section className="section" id="demo">
            <div className="shell">
              <div className="demo-panel">
                <div>
                  <h2>See a demo artist site</h2>
                  <div className="accent-line" aria-hidden="true"></div>
                  <div className="portrait">
                    <svg viewBox="0 0 300 315" role="img" aria-label="Portrait of a sample artist named Maya Ellison">
                      <defs>
                        <linearGradient id="skin" x1="0" x2="1"><stop stopColor="#caa184"/><stop offset="1" stopColor="#ecd4be"/></linearGradient>
                        <linearGradient id="bg" x1="0" x2="1"><stop stopColor="#cfc3b4"/><stop offset="1" stopColor="#efe4d5"/></linearGradient>
                      </defs>
                      <rect width="300" height="315" fill="url(#bg)"/>
                      <circle cx="150" cy="108" r="54" fill="url(#skin)"/>
                      <path d="M96 105c-3-50 32-80 72-76 40 4 61 41 55 89-31-26-72-17-127-13Z" fill="#2d211c"/>
                      <path d="M112 157c39 26 81 22 109-7l24 103H71l41-96Z" fill="#eee7dc"/>
                      <path d="M71 253c20-62 50-89 86-89s70 28 88 89v62H71v-62Z" fill="#f6f0e7"/>
                      <path d="M117 180c17 16 47 18 66 3" stroke="#b69076" strokeWidth="4" fill="none" strokeLinecap="round"/>
                      <circle cx="132" cy="114" r="4" fill="#2a221f"/><circle cx="171" cy="114" r="4" fill="#2a221f"/>
                      <path d="M149 124c-4 9-7 17-3 23" stroke="#9c725d" strokeWidth="3" fill="none" strokeLinecap="round"/>
                      <path d="M127 145c14 9 32 9 47 0" stroke="#8b5f52" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                <div className="demo-copy">
                  <h3>Maya Ellison</h3>
                  <p>Maya Ellison is a painter based in Santa Fe, New Mexico. Her work explores desert landscapes and the memory, light and transformation they hold.</p>
                  <Link href="/demo" className="text-link">View demo site →</Link>
                </div>

                <div className="recent">
                  <h4>Recent work</h4>
                  <div className="recent-grid">
                    <div>
                      <div className="art-thumb">
                        <img src="/images/home_detail.png" alt="Desert Light" className="w-full h-full object-cover" />
                      </div>
                      <p className="caption"><strong>Desert Light, 2024</strong>Oil on panel<br />24 x 30 in</p>
                    </div>
                    <div>
                      <div className="art-thumb">
                        <img src="/images/home_detail2.png" alt="Mesa Study" className="w-full h-full object-cover" />
                      </div>
                      <p className="caption"><strong>Mesa Study, 2024</strong>Oil on canvas<br />36 x 36 in</p>
                    </div>
                    <div>
                      <div className="art-thumb">
                        <img src="/images/home_detail1.png" alt="Wind Line" className="w-full h-full object-cover" />
                      </div>
                      <p className="caption"><strong>Wind Line, 2023</strong>Mixed media<br />22 x 30 in</p>
                    </div>
                    <div>
                      <div className="art-thumb">
                        <img src="/images/home_detail.png" alt="Salt Flats" className="w-full h-full object-cover" />
                      </div>
                      <p className="caption"><strong>Salt Flats, 2023</strong>Oil on panel<br />24 x 24 in</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- PRICING SECTION --- */}
          <section className="section pricing" id="pricing">
            <div className="shell">
              <div className="section-head">
                <div>
                  <h2>Simple pricing</h2>
                  <div className="accent-line" aria-hidden="true"></div>
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
            </div>
          </section>

          {/* --- CTA STRIP --- */}
          <section className="cta-strip">
            <div className="fabric" aria-hidden="true"></div>
            <svg className="vase" viewBox="0 0 170 180" aria-hidden="true">
              <defs>
                <radialGradient id="vaseGrad" cx="50%" cy="35%" r="70%"><stop stopColor="#b99f80"/><stop offset="1" stopColor="#6f5947"/></radialGradient>
              </defs>
              <path d="M67 19h36c-5 23 1 38 17 51 25 22 30 72 2 91-22 15-55 15-76 0-28-20-23-70 2-91 16-13 21-28 19-51Z" fill="url(#vaseGrad)"/>
              <ellipse cx="85" cy="20" rx="31" ry="10" fill="#5f4c3e"/>
              <ellipse cx="85" cy="20" rx="20" ry="5" fill="#9a8065"/>
              <path d="M52 91c21-10 46-10 70 0" stroke="#493b30" strokeWidth="3" opacity="0.36" fill="none"/>
            </svg>
            <div className="shell">
              <h2>Build the portfolio your work deserves.</h2>
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
