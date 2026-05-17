import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'DramaFlix';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dramaflix.top';
const contactEmail = `dramaflixsuppot@gmail.com`;

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteName}`,
  description: `Privacy Policy for ${siteName}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="bg-white border border-portal-border rounded-3xl shadow-sm p-6 sm:p-10">
        <div className="space-y-3 border-b border-portal-border pb-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-portal-accent">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-portal-text">Privacy Policy</h1>
          <p className="text-sm text-portal-muted">Last Updated: May 17, 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-portal-text">
          <section className="space-y-3">
            <p>
              Welcome to {siteName} (“we,” “our,” or “us”). This Privacy Policy explains how information may be collected and used when you access our movie and series website.
            </p>
            <p>By using this website, you agree to this Privacy Policy.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">1. Information We Collect</h2>
            <p>This website is publicly accessible and does not require users to create an account or provide:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Personal contact information</li>
            </ul>
            <p>However, certain non-personal information may automatically be collected by browsers, servers, or third-party services, including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Time spent on the website</li>
              <li>Referring pages</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">2. Cookies and Analytics</h2>
            <p>We may use cookies or similar technologies to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Improve website performance</li>
              <li>Analyze traffic and usage</li>
              <li>Remember basic preferences</li>
              <li>Serve advertisements</li>
            </ul>
            <p>Third-party analytics or advertising providers may also use cookies according to their own privacy policies.</p>
            <p>You can disable cookies through your browser settings.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">3. Third-Party Services</h2>
            <p>Our website may use third-party services such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Analytics providers</li>
              <li>Advertising networks</li>
              <li>Video players or embeds</li>
              <li>CDN and hosting services</li>
            </ul>
            <p>These services may automatically collect technical information necessary for their functionality.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">4. External Links</h2>
            <p>This website may contain links to third-party websites or streaming sources. We are not responsible for the privacy policies, content, or practices of external websites.</p>
            <p>Users should review third-party privacy policies separately.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">5. Copyright Disclaimer</h2>
            <p>{siteName} does not claim ownership of third-party media content, trademarks, posters, or trailers displayed on the platform unless explicitly stated.</p>
            <p>If you believe any content violates your rights, you may contact us for review or removal requests.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">6. Data Security</h2>
            <p>We use reasonable measures to maintain website security. However, no method of transmission or storage over the internet is completely secure.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">7. Children's Privacy</h2>
            <p>This website is not intended for children under 13 years of age. We do not knowingly collect personal information from children.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy at any time without prior notice. Updates will be reflected on this page with a revised “Last Updated” date.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">9. Contact</h2>
            <p>For questions or concerns regarding this Privacy Policy:</p>
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
