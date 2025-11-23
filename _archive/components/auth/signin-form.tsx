'use client';

import Link from 'next/link';
import { GoogleLogo } from '@phosphor-icons/react'; // Assuming you have Phosphor Icons installed

export default function SignInForm({ message }: { message: string }) {
  return (
    <div className="auth-container active">
      <h1 className="font-display text-3xl font-medium mb-3">Welcome back.</h1>
      <p className="text-text-muted text-base mb-8 leading-relaxed">Sign in to manage your portfolio.</p>

      <form action="/api/auth/signin" method="post">
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
          <div className="flex justify-between mb-2">
            <label htmlFor="password" className="block text-xs font-medium text-text-main">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-text-muted no-underline hover:underline">Forgot?</Link>
          </div>
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
          Sign In
        </button>
        {message && (
            <p className="mt-4 p-4 bg-auth-error/10 text-auth-error text-center rounded-md">
                {message}
            </p>
        )}

        <div className="relative text-center my-8 before:content-[''] before:absolute before:left-0 before:right-0 before:border-b before:border-border-color before:top-1/2 before:-translate-y-1/2">
          <span className="relative bg-bg-color px-3 text-sm text-text-muted">OR</span>
        </div>

        <button type="button" className="w-full py-3 bg-white border border-border-color text-text-main rounded-md text-base cursor-pointer flex items-center justify-center gap-3 hover:bg-bg-alt">
          <GoogleLogo size={20} /> Continue with Google
        </button>

        <div className="text-center mt-8 text-sm">
          Don't have an account? <Link href="/auth/signup" className="text-text-main font-semibold no-underline hover:underline">Create Portfolio</Link>
        </div>
      </form>
    </div>
  );
}
