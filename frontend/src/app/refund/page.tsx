import { Header } from '@/components/marketing/header';

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-24 sm:py-32">
        <h1 className="text-4xl font-bold text-zinc-100 tracking-tight mb-8">Refund Policy</h1>
        <p className="text-sm text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-zinc-400">
          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">1. General Refund Policy</h2>
            <p>We want you to be completely satisfied with StackGen. If you are not satisfied with your purchase, we offer a 14-day money-back guarantee for all new subscriptions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">2. Eligibility for Refund</h2>
            <p>To be eligible for a refund, you must request it within 14 days of your initial purchase. Refunds are only applicable to your first subscription charge. Renewal charges are generally non-refundable unless required by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">3. How to Request a Refund</h2>
            <p>To request a refund, please contact our support team at <a href="mailto:contact@stackgen.site" className="text-purple-400 hover:text-purple-300">contact@stackgen.site</a> with your account email address and a brief reason for the cancellation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">4. Processing Time</h2>
            <p>Once your refund request is approved, the refund will be processed and automatically applied to your original method of payment. This typically takes 5-10 business days to reflect on your bank statement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">5. Abuse of Refund Policy</h2>
            <p>We reserve the right to deny refund requests if we detect abuse of our policy, such as generating an excessive amount of architectures and immediately requesting a refund.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
