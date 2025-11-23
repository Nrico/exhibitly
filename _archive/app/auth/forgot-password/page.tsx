import Image from 'next/image';
import ForgotPasswordForm from '@/components/auth/forgot-password-form'; // Import the new client component
import Link from 'next/link';

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { message: string, error: string };
}) {
  return (
    <div className="flex min-h-screen">
      {/* Visual Panel */}
      <div className="relative flex-1 bg-visual-panel flex flex-col justify-end p-16 max-md:hidden">
        <Image
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000"
          alt="Fine Art"
          fill={true} // Use fill prop
          style={{objectFit: 'cover'}} // Use style prop for objectFit
          className="filter brightness-85"
        />
        <div className="relative z-10 text-white max-w-md">
          <p className="font-display text-4xl italic leading-tight mb-5">
            "Every artist dips his brush in his own soul, and paints his own nature into his pictures."
          </p>
          <p className="text-sm uppercase tracking-wider opacity-80">
            — Henry Ward Beecher
          </p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-[550px] bg-white flex flex-col justify-center p-20 max-md:w-full max-md:p-8 overflow-y-auto">
        <div className="font-display text-2xl font-semibold mb-10 text-text-main">
          Exhibitly.
        </div>
        <ForgotPasswordForm message={searchParams?.message || searchParams?.error || ''} /> {/* Use the new component and pass message */}
      </div>
    </div>
  );
}