    <div className="bg-white text-text-main">
      <nav className="p-8 lg:px-16 flex justify-between items-center">
        <div className="font-display text-2xl font-semibold">Exhibitly.</div>
        <Link href="/dashboard" className="text-sm text-text-muted no-underline hover:underline">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto my-16 text-center px-5">
        <h1 className="font-display text-5xl font-normal mb-4">Invest in your art.</h1>
        <p className="text-text-muted text-lg mb-10">Simple, transparent pricing. Cancel anytime.</p>

        <div className="inline-flex items-center bg-[#f4f4f4] rounded-full p-1 mb-16 relative">
          <button
            onClick={() => setBillingInterval('monthly')}
            className={`toggle-btn px-5 py-2 rounded-full text-sm font-medium ${
              billingInterval === 'monthly' ? 'bg-white text-text-main shadow' : 'text-text-muted'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingInterval('yearly')}
            className={`toggle-btn px-5 py-2 rounded-full text-sm font-medium ${
              billingInterval === 'yearly' ? 'bg-white text-text-main shadow' : 'text-text-muted'
            }`}
          >
            Yearly Billing
          </button>
          <div className="absolute right-[-85px] top-1 bg-accent-green-dashboard/10 text-accent-green-dashboard text-xs font-semibold px-2 py-1 rounded">
            Save 25%
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          {/* Featured Plan */}
          <div className="plan-card border border-auth-accent rounded-xl p-10 bg-auth-accent text-white relative transform hover:-translate-y-1 transition-transform">
            <h2 className="font-display text-3xl mb-2">Independent Artist</h2>
            <div className="text-5xl font-semibold mb-1">{billingInterval === 'monthly' ? '$12' : '$9'}</div>
            <div className="text-base text-text-muted mb-8">per month</div>

            <button
              onClick={() => handleCheckout(billingInterval === 'monthly' ? prices.monthly : prices.yearly)}
              className="btn-plan w-full py-4 rounded-md text-sm font-semibold bg-white text-auth-accent mb-8 hover:bg-gray-200 border border-text-main"
            >
              Subscribe Now
            </button>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm pb-3 border-b border-white/[0.1]">
                <Check size={20} className="text-white" /> Unlimited Artworks
              </li>
              <li className="flex items-center gap-3 text-sm pb-3 border-b border-white/[0.1]">
                <Check size={20} className="text-white" /> Custom Domain (yourname.com)
              </li>
              <li className="flex items-center gap-3 text-sm pb-3 border-b border-white/[0.1]">
                <Check size={20} className="text-white" /> 0% Commission on Sales
              </li>
              <li className="flex items-center gap-3 text-sm pb-3 border-b border-white/[0.1]">
                <Check size={20} className="text-white" /> Password Protected Rooms
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check size={20} className="text-white" /> Export Data (PDF & Zip)
              </li>
            </ul>
          </div>

          {/* Standard Plan */}
          <div className="plan-card border border-border-color rounded-xl p-10 transform hover:-translate-y-1 transition-transform hover:border-auth-accent">
            <h2 className="font-display text-3xl mb-2">Gallery & Studio</h2>
            <div className="text-5xl font-semibold mb-1">{billingInterval === 'monthly' ? '$79' : '$65'}</div>
            <div className="text-base text-text-muted mb-8">per month</div>

            <button className="btn-plan w-full py-4 rounded-md text-sm font-semibold bg-auth-accent text-white border border-auth-accent hover:bg-auth-accent-dark">
              Contact Sales
            </button>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm pb-3 border-b border-border-color">
                <Check size={20} className="text-auth-accent" /> Up to 50 Artists
              </li>
              <li className="flex items-center gap-3 text-sm pb-3 border-b border-border-color">
                <Check size={20} className="text-auth-accent" /> Exhibition Management
              </li>
              <li className="flex items-center gap-3 text-sm pb-3 border-b border-border-color">
                <Check size={20} className="text-auth-accent" /> Location & Map Integration
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check size={20} className="text-auth-accent" /> Priority Onboarding Support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>