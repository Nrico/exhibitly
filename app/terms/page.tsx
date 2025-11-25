import Link from 'next/link'

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-black selection:text-white">
            <header className="py-10 border-b border-gray-100">
                <div className="max-w-[800px] mx-auto px-8 flex justify-between items-center">
                    <Link href="/" className="font-serif text-2xl font-semibold tracking-tighter">Exhibitly.</Link>
                </div>
            </header>

            <main className="max-w-[800px] mx-auto px-8 py-20">
                <h1 className="font-serif text-4xl mb-2">Terms of Service</h1>
                <p className="text-gray-500 mb-12 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-gray max-w-none">
                    <p className="mb-6">
                        Please read these Terms of Service ("Terms") carefully before using the Exhibitly website and service operated by Exhibitly ("us", "we", or "our").
                    </p>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-6">
                        By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                    </p>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">2. Accounts</h2>
                    <p className="mb-6">
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">3. Content</h2>
                    <p className="mb-6">
                        Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                    </p>
                    <p className="mb-6">
                        By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.
                    </p>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">4. Prohibited Uses</h2>
                    <p className="mb-6">
                        You agree not to use the Service:
                    </p>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                        <li>In any way that violates any applicable national or international law or regulation.</li>
                        <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                        <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
                    </ul>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">5. Termination</h2>
                    <p className="mb-6">
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">6. Limitation of Liability</h2>
                    <p className="mb-6">
                        In no event shall Exhibitly, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">7. Changes</h2>
                    <p className="mb-6">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
                    </p>

                    <h2 className="text-xl font-serif font-medium mt-8 mb-4">8. Contact Us</h2>
                    <p className="mb-6">
                        If you have any questions about these Terms, please contact us at: <a href="mailto:hello@exhibitly.co" className="underline hover:text-black">hello@exhibitly.co</a>
                    </p>
                </div>
            </main>

            <footer className="py-10 border-t border-gray-100 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Exhibitly. All rights reserved.
            </footer>
        </div>
    )
}
