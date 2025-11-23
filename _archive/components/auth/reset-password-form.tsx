'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GoogleLogo } from '@phosphor-icons/react'; // Assuming you have Phosphor Icons installed

export default function ResetPasswordForm({ message, error }: { message: string, error: string }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordsMatch = password === confirmPassword;

  return (
    <div className="auth-container active">
      <h1 className="font-display text-3xl font-medium mb-3">Reset Password</h1>
      <p className="text-text-muted text-base mb-8 leading-relaxed">Enter a new password for your account.</p>

      <form action="/api/auth/reset-password" method="post">
        <div className="mb-5">
          <label htmlFor="password" className="block text-xs font-medium mb-2 text-text-main">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="input-field w-full p-3 border border-border-color rounded-md text-base transition-colors focus:outline-none focus:border-auth-accent"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="confirmPassword" className="block text-xs font-medium mb-2 text-text-main">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`input-field w-full p-3 border rounded-md text-base transition-colors focus:outline-none ${!passwordsMatch ? 'border-auth-error' : 'border-border-color focus:border-auth-accent'}`}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {!passwordsMatch && (
            <p className="text-xs text-auth-error mt-1">Passwords do not match.</p>
          )}
        </div>

        <button type="submit" className="w-full py-3 bg-auth-accent text-white rounded-md text-base font-medium cursor-pointer mt-3 hover:bg-auth-accent-dark bg-text-main" disabled={!passwordsMatch}>
          Reset Password
        </button>
        {message && (
            <p className="mt-4 p-4 bg-green-100 text-green-800 text-center rounded-md">
                {message}
            </p>
        )}
        {error && (
            <p className="mt-4 p-4 bg-auth-error/10 text-auth-error text-center rounded-md">
                {error}
            </p>
        )}

        <div className="text-center mt-8 text-sm">
          Remember your password? <Link href="/auth/signin" className="text-text-main font-semibold no-underline hover:underline">Sign In</Link>
        </div>
      </form>
    </div>
  );
}
