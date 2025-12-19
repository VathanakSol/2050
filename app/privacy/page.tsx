import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Developer 2050',
  description: 'Privacy Policy for Developer 2050 - Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account, 
            use our services, or contact us for support.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Account information (email, username)</li>
            <li>Usage data and analytics</li>
            <li>Device and browser information</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and improve our services</li>
            <li>Personalize your experience</li>
            <li>Communicate with you</li>
            <li>Analyze usage patterns</li>
            <li>Display relevant advertisements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Google AdSense</h2>
          <p className="mb-4">
            This website uses Google AdSense, a web advertising service provided by Google Inc. 
            Google AdSense uses cookies and web beacons to serve ads based on your prior visits 
            to this website and other websites.
          </p>
          <p className="mb-4">
            You can opt out of personalized advertising by visiting 
            <a href="https://www.google.com/settings/ads" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
              Google&apos;s Ads Settings
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
          <p className="mb-4">
            We use cookies to enhance your browsing experience, serve personalized ads or content, 
            and analyze our traffic. You can choose to accept or decline cookies through your 
            browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
          <p className="mb-4">
            Our website may contain links to third-party websites or services. We are not 
            responsible for the privacy practices of these external sites.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-4">
            Email: privacy@developer2050.com<br />
            Website: https://developer2050.com
          </p>
        </section>
      </div>
    </div>
  )
}