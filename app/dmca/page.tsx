import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'DramaFlix';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dramaflix.top';
const contactEmail = `dramaflixsuppot@gmail.com`;

export const metadata: Metadata = {
  title: `DMCA Policy | ${siteName}`,
  description: `DMCA Policy for ${siteName}.`,
};

export default function DMCAPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="bg-white border border-portal-border rounded-3xl shadow-sm p-6 sm:p-10">
        <div className="space-y-3 border-b border-portal-border pb-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-portal-accent">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-portal-text">DMCA Policy</h1>
          <p className="text-sm text-portal-muted">Last Updated: May 17, 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-portal-text">
          <section className="space-y-3">
            <p>
              {siteName} respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). This policy outlines how we handle copyright infringement claims.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">1. Copyright Infringement Claims</h2>
            <p>
              If you believe that content on {siteName} infringes your copyright or intellectual property rights, you may submit a DMCA takedown notice.
            </p>
            <p>
              To file a valid DMCA notice, your submission must include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your name and contact information</li>
              <li>A description of the copyrighted work you claim has been infringed</li>
              <li>The specific URL(s) or location of the infringing content</li>
              <li>A statement that you have a good faith belief the content is not authorized</li>
              <li>Your physical or electronic signature</li>
              <li>A statement under penalty of perjury that the information is accurate</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">2. Submitting a DMCA Notice</h2>
            <p>Please send your DMCA notice to:</p>
            <div className="bg-portal-bg border border-portal-border rounded-lg p-4 space-y-2">
              <p className="font-bold">Email: <a href={`mailto:${contactEmail}`} className="text-portal-accent hover:underline">{contactEmail}</a></p>
              <p className="text-xs text-portal-muted">Subject line: "DMCA Takedown Notice"</p>
            </div>
            <p>
              Include all required information to ensure your notice is processed promptly. Incomplete notices may be ignored.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">3. Our Response</h2>
            <p>Upon receipt of a valid DMCA notice, {siteName} will:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Investigate the claim</li>
              <li>Remove or disable access to infringing content if valid</li>
              <li>Notify the content uploader of the removal (if applicable)</li>
              <li>Preserve evidence and comply with applicable laws</li>
            </ul>
            <p>
              We aim to respond to valid DMCA notices within 24-48 hours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">4. Counter-Notice</h2>
            <p>
              If your content was removed and you believe it was removed in error, you may submit a counter-notice.
            </p>
            <p>
              A valid counter-notice must include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your name and contact information</li>
              <li>Identification of the content that was removed</li>
              <li>A statement under penalty of perjury that the removal was in error</li>
              <li>Your physical or electronic signature</li>
              <li>A statement that you consent to jurisdiction of your local court</li>
            </ul>
            <p>
              Counter-notices should be sent to the same email address as DMCA notices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">5. Repeat Infringers</h2>
            <p>
              {siteName} reserves the right to terminate the access of users who repeatedly infringe copyrights or intellectual property rights.
            </p>
            <p>
              We maintain records of DMCA notices and may enforce account restrictions or permanent bans for repeat violations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">6. Third-Party Content</h2>
            <p>
              {siteName} provides access to information about movies and TV shows. We do not host, store, or directly control third-party streaming content, posters, or media.
            </p>
            <p>
              For content hosted on third-party platforms, please submit DMCA notices directly to those service providers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">7. Disclaimer</h2>
            <p>
              {siteName} complies with the DMCA in good faith. However, we are not responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Delays in processing notices</li>
              <li>Third-party content or services</li>
              <li>False or fraudulent DMCA claims</li>
            </ul>
            <p>
              False DMCA notices may result in legal liability for the claimant.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black tracking-tight">8. Contact Information</h2>
            <p>For DMCA-related inquiries:</p>
            <p className="font-bold">Email: <a href={`mailto:${contactEmail}`} className="text-portal-accent hover:underline">{contactEmail}</a></p>
            <p className="text-xs text-portal-muted">Include "DMCA" in the subject line for faster processing.</p>
          </section>

          <section className="pt-2 border-t border-portal-border/60 text-portal-muted space-y-2">
            <p>Website: <a href={siteUrl} className="hover:text-portal-accent hover:underline">{siteUrl}</a></p>
            <p className="text-xs">This DMCA policy is provided for informational purposes and does not constitute legal advice.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
