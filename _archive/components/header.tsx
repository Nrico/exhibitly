import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-10 border-b border-b-transparent">
      <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight">
          Exhibitly.
        </Link>
        <nav className="flex items-center gap-x-8">
          <Link href="/auth/signin" className="text-sm font-medium hover:opacity-70 transition-opacity text-text-main">
            Login
          </Link>
          <Link href="/auth/signup" className="inline-block px-5 py-2 text-sm uppercase tracking-wider font-medium cursor-pointer border border-text-main transition-all duration-300 bg-text-main text-white">
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}