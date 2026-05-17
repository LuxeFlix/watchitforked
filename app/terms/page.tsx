import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'CineVault';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dramaflix.top';
const contactEmail = `dramaflixsuppot@gmail.com`;

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteName}`,
  description: `Terms & Conditions for ${siteName}.`,
};

export default function TermsConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="bg-white border border-portal-border rounded-3xl shadow-sm p-6 sm:p-10">
        <div className="space-y-3 border-b border-portal-border pb-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-portal-accent">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-portal-text">Terms &amp; Conditions</h1>
          <p className="text-sm text-portal-muted">Last Updated: May 17, 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-portal-text">
          <section className="space-y-3">
            <p>
              Welcome to {siteName}. By accessing or using this website, you agree to comply with and be bound by the following Terms &amp; Conditions.
            </p>
            <p>If you do not agree with these terms, please do not use the website.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">1. Use of Website</h2>
            <p>This website is provided for informational and entertainment purposes only.</p>
            <p>Users agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the website for illegal activities</li>
              <li>Attempt unauthorized access to the website or servers</li>
              <li>Copy, scrape, or redistribute website content without permission</li>
              <li>Interfere with the website’s operation or security</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">2. Content Disclaimer</h2>
            <p>{siteName} may display movie or series information including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Titles</li>
              <li>Posters</li>
              <li>Trailers</li>
              <li>Ratings</li>
              <li>Descriptions</li>
              <li>Embedded media</li>
            </ul>
            <p>All trademarks, logos, posters, and media belong to their respective owners.</p>
            <p>We do not claim ownership of third-party copyrighted content unless explicitly stated.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">3. Third-Party Links</h2>
            <p>The website may contain links to third-party websites, streaming providers, or external services.</p>
            <p>We are not responsible for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Availability of third-party content</li>
              <li>Accuracy of external information</li>
              <li>Privacy policies or practices of third-party websites</li>
              <li>Any damages or issues caused by third-party services</li>
            </ul>
            <p>Users access third-party websites at their own risk.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">4. No Guarantees</h2>
            <p>We do not guarantee:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Continuous website availability</li>
              <li>Accuracy or completeness of information</li>
              <li>Error-free operation</li>
              <li>Uninterrupted access</li>
            </ul>
            <p>Content may be updated, removed, or modified at any time without notice.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">5. Intellectual Property</h2>
            <p>Unless otherwise stated, the website design, branding, and original content are the property of {siteName}.</p>
            <p>Unauthorized reproduction or redistribution of original website materials is prohibited.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">6. Limitation of Liability</h2>
            <p>{siteName} and its owners shall not be held liable for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Any direct or indirect damages</li>
              <li>Data loss</li>
              <li>Service interruptions</li>
              <li>Third-party content issues</li>
              <li>User reliance on website information</li>
            </ul>
            <p>Use of the website is entirely at the user’s own risk.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">7. Copyright Complaints</h2>
            <p>If you believe any content on the website infringes your copyright or rights, you may contact us with proper details for review or removal requests.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">8. Changes to Terms</h2>
            <p>We reserve the right to update or modify these Terms &amp; Conditions at any time without prior notice.</p>
            <p>Continued use of the website after changes means you accept the updated terms.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">9. Governing Law</h2>
            <p>These Terms &amp; Conditions shall be governed by and interpreted according to the applicable laws of your jurisdiction.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">10. Contact</h2>
            <p>For any questions regarding these Terms &amp; Conditions:</p>
            <p className="font-bold">Email: <a href={`mailto:${contactEmail}`} className="text-portal-accent hover:underline">{contactEmail}</a></p>
          </section>

          <section className="pt-2 border-t border-portal-border/60 text-portal-muted space-y-2">
            <p>Website: <a href={siteUrl} className="hover:text-portal-accent hover:underline">{siteUrl}</a></p>
            <p>If you need this policy aligned to a different domain or support mailbox, update the site environment variables and contact address accordingly.</p>
          </section>
        </div>
      </div>
    </div>
  );
}