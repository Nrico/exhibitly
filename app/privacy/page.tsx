import Link from 'next/link'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-black selection:text-white">
            <header className="py-10 border-b border-gray-100">
                <div className="max-w-[800px] mx-auto px-8 flex justify-between items-center">
                    <Link href="/" className="font-serif text-2xl font-semibold tracking-tighter">Exhibitly.</Link>
                </div>
            </header>

            <main className="max-w-[800px] mx-auto px-8 py-20">
                <h1 className="font-serif text-4xl mb-2">Privacy Policy</h1>
                <p className="text-gray-500 mb-12 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-gray max-w-none">
                    <p className="mb-6">
                        At Exhibitly, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website or use our service.
                    </p>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">1. Information We Collect</h2>
                    <p className="mb-4">
                        We collect information that you provide directly to us when you register for an account, create a portfolio, or communicate with us. This includes:
                    </p>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                        <li><strong>Account Information:</strong> Name, email address, and password.</li>
                        <li><strong>Portfolio Content:</strong> Images, text, and other content you upload to your portfolio.</li>
                        <li><strong>Payment Information:</strong> If you subscribe to a paid plan, our payment processor (Stripe) collects your payment details. We do not store full credit card numbers.</li>
                    </ul>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">2. How We Use Your Information</h2>
                    <p className="mb-6">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Process transactions and send related information.</li>
                        <li>Send you technical notices, updates, security alerts, and support messages.</li>
                        <li>Respond to your comments, questions, and requests.</li>
                    </ul>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">3. Data Storage and Security</h2>
                    <p className="mb-6">
                        We use industry-standard measures to help protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. Your data is stored securely using Supabase and Google Cloud Platform services.
                    </p>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">4. Third-Party Services</h2>
                    <p className="mb-6">
                        We may share information with third-party vendors that provide services on our behalf, such as:
                    </p>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                        <li><strong>Stripe:</strong> For payment processing.</li>
                        <li><strong>Supabase:</strong> For database and authentication services.</li>
                        <li><strong>Vercel:</strong> For hosting and deployment.</li>
                    </ul>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">5. Your Rights</h2>
                    <p className="mb-6">
                        You have the right to access, correct, or delete your personal information at any time. You can manage your account settings directly within the Exhibitly dashboard or contact us for assistance.
                    </p>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">6. Contact Us</h2>
                    <p className="mb-6">
                        If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:hello@exhibitly.co" className="underline hover:text-black">hello@exhibitly.co</a>
                    </p>
                </div>
            </main>

            <footer className="py-10 border-t border-gray-100 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Exhibitly. All rights reserved.
            </footer>
        </div>
    )
}
