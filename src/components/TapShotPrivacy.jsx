import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Eye, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TapShotPrivacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - Tap Shot";
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <Link to="/support" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Link>
        
        <header className="mb-12">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">Privacy Policy</h1>
          <p className="text-xl text-gray-500 font-light">Last updated: January 15, 2026</p>
        </header>

        <div className="prose prose-lg prose-gray max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-400" />
              Data Collection
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Tap Shot is a paid game designed to respect your privacy. We do not collect, store, or share any personal data by default. Your game progress and settings are stored locally on your device or synced via your personal iCloud account, to which we have no access.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500">
              If analytics are enabled in future updates to help us improve the game, we will update this policy to transparently reflect those changes.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-400" />
              Device Permissions
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tap Shot requests access to certain device features to provide the core gameplay experience:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600"><strong>Haptics:</strong> Used to provide tactile feedback during gameplay (e.g., shooting effects).</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600"><strong>Audio:</strong> Used for sound effects. You can disable this in the app settings.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not use third-party advertising frameworks or tracking SDKs. Payments and restoration of purchases are handled directly by Apple's App Store. We do not see or process your payment details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Children’s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Tap Shot does not knowingly collect data from children. As the app does not collect personal data, it is safe for users of all ages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. If we make significant changes, we will notify you through an app update or by updating the date at the top of this policy.
            </p>
          </section>

          <section className="pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:scott@bolt-interactive.com" className="text-blue-600 hover:text-blue-800 font-medium">scott@bolt-interactive.com</a>
            </p>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-12 bg-gray-50 text-gray-400 text-sm text-center border-t border-gray-100">
        <p>© 2026 Tap Shot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TapShotPrivacy;
