import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'DramaFlix';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dramaflix.top';
const contactEmail = 'dramaflixsuppot@gmail.com';

export const metadata: Metadata = {
  title: `Contact | ${siteName}`,
  description: `Contact ${siteName} for support, DMCA, and general inquiries.`,
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="bg-white border border-portal-border rounded-3xl shadow-sm p-6 sm:p-10">
        <div className="space-y-3 border-b border-portal-border pb-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-portal-accent">Support</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-portal-text">Contact Us</h1>
          <p className="text-sm text-portal-muted">Questions, feedback, and takedown requests</p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-portal-text">
          <section className="space-y-3">
            <p>
              If you need help with the site, want to report an issue, or have a copyright-related request, use the details below.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tight">Email</h2>
            <div className="bg-portal-bg border border-portal-border rounded-2xl p-4 sm:p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-portal-muted">Support inbox</p>
              <p className="font-bold text-base">
                <a href={`mailto:${contactEmail}`} className="text-portal-accent hover:underline">
                  {contactEmail}
                </a>
              </p>
              <p className="text-portal-muted">
                Include a clear subject line so your message reaches the right team faster.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">What to include</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Movie or series title</li>
              <li>Page URL or screenshot if the issue is visual</li>
              <li>Short description of the problem</li>
              <li>Your contact details if you need a reply</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">Quick links</h2>
            <div className="flex flex-wrap gap-3">
              <a href="/privacy" className="inline-flex items-center rounded-full border border-portal-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-portal-text hover:border-portal-accent hover:text-portal-accent transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="inline-flex items-center rounded-full border border-portal-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-portal-text hover:border-portal-accent hover:text-portal-accent transition-colors">
                Terms
              </a>
              <a href="/dmca" className="inline-flex items-center rounded-full border border-portal-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-portal-text hover:border-portal-accent hover:text-portal-accent transition-colors">
                DMCA
              </a>
            </div>
          </section>

          <section className="pt-2 border-t border-portal-border/60 text-portal-muted space-y-2">
            <p>Website: <a href={siteUrl} className="hover:text-portal-accent hover:underline">{siteUrl}</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
