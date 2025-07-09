import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using this gaming platform, you accept and agree to be bound by the terms 
              and provision of this agreement. Please read these terms carefully before using our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Account</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              When you create an account with us, you must provide information that is accurate, complete, 
              and current at all times. You are responsible for safeguarding the password and for all 
              activities that occur under your account.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>You must be at least 13 years old to create an account</li>
              <li>One account per person is allowed</li>
              <li>You are responsible for maintaining account security</li>
              <li>We reserve the right to suspend accounts that violate our terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Content Guidelines</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Users are expected to maintain a respectful and positive environment. The following content 
              is prohibited:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Harassment, bullying, or hate speech</li>
              <li>Spam or promotional content without permission</li>
              <li>Copyright infringement</li>
              <li>Inappropriate or offensive material</li>
              <li>False or misleading information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the service, to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend access to our service immediately, without prior notice or 
              liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days notice prior to any new 
              terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through our 
              support channels.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;