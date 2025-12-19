import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Developer 2050',
  description: 'Terms of Service for Developer 2050 - Learn about our terms and conditions.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Developer 2050, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of the materials on Developer 2050&apos;s 
            website for personal, non-commercial transitory viewing only.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>This is the grant of a license, not a transfer of title</li>
            <li>Under this license you may not modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you must provide information that is accurate, 
            complete, and current at all times.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
          <p className="mb-4">You may not use our service:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Content</h2>
          <p className="mb-4">
            Our service allows you to post, link, store, share and otherwise make available certain 
            information, text, graphics, videos, or other material. You are responsible for the content 
            that you post to the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability, 
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
          <p className="mb-4">
            The information on this website is provided on an as is basis. To the fullest extent 
            permitted by law, this Company excludes all representations, warranties, conditions and 
            terms relating to our website and the use of this website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mb-4">
            Email: terms@developer2050.com<br />
            Website: https://v2050.vercel.app
          </p>
        </section>
      </div>
    </div>
  )
}