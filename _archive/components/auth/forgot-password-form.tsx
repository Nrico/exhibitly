'use client';

import Link from 'next/link';
import { GoogleLogo } from '@phosphor-icons/react'; // Assuming you have Phosphor Icons installed

export default function ForgotPasswordForm({ message }: { message: string }) {
  return (
    <div className="auth-container active">
      <h1 className="font-display text-3xl font-medium mb-3">Forgot Password?</h1>
      <p className="text-text-muted text-base mb-8 leading-relaxed">Enter your email to receive a password reset link.</p>

      <form action="/api/auth/forgot-password" method="post">
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

        <button type="submit" className="w-full py-3 bg-auth-accent text-white rounded-md text-base font-medium cursor-pointer mt-3 hover:bg-auth-accent-dark bg-text-main">
          Send Reset Link
        </button>
        {message && (
            <p className="mt-4 p-4 bg-green-100 text-green-800 text-center rounded-md">
                {message}
            </p>
        )}

        <div className="text-center mt-8 text-sm">
          Remember your password? <Link href="/auth/signin" className="text-text-main font-semibold no-underline hover:underline">Sign In</Link>
        </div>
      </form>
    </div>
  );
}
