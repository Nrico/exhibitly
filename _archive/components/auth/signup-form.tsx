'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GoogleLogo, PaintBrush, Storefront, CheckCircle } from '@phosphor-icons/react'; // Assuming Phosphor Icons

export default function SignUpForm({ message }: { message: string }) {
  const [accountType, setAccountType] = useState('artist');
  const [handleAvailability, setHandleAvailability] = useState(true); // Placeholder for handle availability

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      // Redirect to a verification message page or login
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const checkHandleAvailability = (event: React.ChangeEvent<HTMLInputElement>) => {
    // This would typically be an API call to check if the handle exists
    // For now, it's just a placeholder.
    const currentHandle = event.target.value;
    setHandleAvailability(currentHandle.length > 3 && currentHandle !== 'taken'); // Example logic
  };

  return (
    <div className="auth-container active">
      <h1 className="font-display text-3xl font-medium mb-3">Claim your space.</h1>
      <p className="text-text-muted text-base mb-8 leading-relaxed">Start your free portfolio. No credit card required.</p>

      <form onSubmit={handleSignUp}>
        <label className="block text-xs font-medium mb-2 text-text-main">I am an:</label>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            className={`border border-border-color rounded-lg p-4 cursor-pointer text-center transition-all ${
              accountType === 'artist' ? 'border-auth-accent bg-bg-alt shadow' : 'hover:border-gray-400'
            }`}
            onClick={() => setAccountType('artist')}
          >
            <PhPaintBrush size={24} className="mb-2 text-auth-accent mx-auto" />
            <div className="font-semibold text-sm">Artist</div>
            <div className="text-xs text-text-muted mt-1">Independent Creator</div>
          </div>
          <div
            className={`border border-border-color rounded-lg p-4 cursor-pointer text-center transition-all ${
              accountType === 'gallery' ? 'border-auth-accent bg-bg-alt shadow' : 'hover:border-gray-400'
            }`}
            onClick={() => setAccountType('gallery')}
          >
            <PhStorefront size={24} className="mb-2 text-auth-accent mx-auto" />
            <div className="font-semibold text-sm">Gallery</div>
            <div className="text-xs text-text-muted mt-1">Curator / Collective</div>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="fullName" className="block text-xs font-medium mb-2 text-text-main">Full Name / Gallery Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="input-field w-full p-3 border border-border-color rounded-md text-base transition-colors focus:outline-none focus:border-auth-accent"
            placeholder="e.g. Enrico Trujillo"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="handle" className="block text-xs font-medium mb-2 text-text-main">Claim your URL</label>
          <div className="flex items-center border border-border-color rounded-md overflow-hidden">
            <div className="bg-bg-alt p-3 text-sm text-text-muted border-r border-border-color">exhibitly.com/</div>
            <input
              type="text"
              id="handle"
              name="handle"
              className="input-field border-none p-3 flex-grow focus:outline-none text-base"
              placeholder={accountType === 'artist' ? 'enrico' : 'high-desert-arts'}
              onChange={checkHandleAvailability}
              required
            />
          </div>
          {handleAvailability && (
            <div className="text-xs text-accent-green-dashboard mt-1 flex items-center gap-1">
              <PhCheckCircle size={14} /> Available
            </div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block text-xs font-medium mb-2 text-text-main">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field w-full p-3 border border-border-color rounded-md text-base transition-colors focus:outline-none focus:border-auth-accent"
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block text-xs font-medium mb-2 text-text-main">Create Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="input-field w-full p-3 border border-border-color rounded-md text-base transition-colors focus:outline-none focus:border-auth-accent"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="w-full py-3 bg-auth-accent text-white rounded-md text-base font-medium cursor-pointer mt-3 hover:bg-auth-accent-dark bg-text-main">
          Create Account
        </button>

        {message && (
            <p className="mt-4 p-4 bg-auth-error/10 text-auth-error text-center rounded-md">
                {message}
            </p>
        )}

        <div className="text-center mt-8 text-sm">
          Already have an account? <Link href="/auth/signin" className="text-text-main font-semibold no-underline hover:underline">Sign In</Link>
        </div>
      </form>
    </div>
  );
}
