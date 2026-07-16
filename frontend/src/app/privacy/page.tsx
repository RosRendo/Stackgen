import { Header } from '@/components/marketing/header';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-24 sm:py-32">
        <h1 className="text-4xl font-bold text-zinc-100 tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-zinc-400">
          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when you create an account, such as your name and email address (typically retrieved via OAuth providers like Google or GitHub). We also collect the project descriptions and inputs you provide to generate architectures.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about products, services, offers, and promotions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">3. Data Storage and Third Parties</h2>
            <p>We use third-party services such as Supabase for database hosting and Google Gemini for AI generation. Your project descriptions are sent to Google Gemini APIs strictly for the purpose of generating your architecture blueprints. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">4. Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet or email transmission is ever fully secure or error free.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">5. Your Rights</h2>
            <p>Depending on your location, you may have the right to access, correct, or delete your personal data. You can usually manage this directly within your account settings or by contacting us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact@stackgen.site" className="text-purple-400 hover:text-purple-300">contact@stackgen.site</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
