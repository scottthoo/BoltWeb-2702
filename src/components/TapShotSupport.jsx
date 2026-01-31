import React, { useState, useEffect } from 'react';
import { Mail, Bug, Shield, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Smartphone, Watch } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-4 px-2 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-600 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const TapShotSupport = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showBugForm, setShowBugForm] = useState(false);
  const [bugFormSubmitted, setBugFormSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Support - Tap Shot";
  }, []);

  const faqs = [
    {
      question: "How do I play?",
      answer: "Open the app on your Apple Watch. Tap anywhere on the screen to shoot. Aim to hit the targets as they appear."
    },
    {
      question: "The watch doesn’t respond to taps — what do I do?",
      answer: "Ensure the water lock is off. If the issue persists, force quit the app by pressing the side button and swiping left on the Tap Shot card."
    },
    {
      question: "How do I enable haptics/sound?",
      answer: "Go to Settings within the Tap Shot app on your watch. Toggle 'Haptics' and 'Sound' to ON."
    },
    {
      question: "Does Tap Shot work offline?",
      answer: "Yes! Tap Shot is fully functional without an internet connection."
    },
    {
      question: "Which Apple Watch models are supported?",
      answer: "Tap Shot supports Apple Watch Series 4 and newer, running watchOS 9 or later."
    },
    {
      question: "I bought the app but it’s not showing — what now?",
      answer: "On your watch, open the App Store, scroll down to 'Account', tap 'Purchased', and download Tap Shot from there."
    },
    {
      question: "How do I request a refund?",
      answer: "Apple handles all refunds directly. Go to reportaproblem.apple.com, sign in, and select 'Request a refund'."
    }
  ];

  const handleBugSubmit = (e) => {
    e.preventDefault();
    setBugFormSubmitted(true);
    // Simulate API call
    setTimeout(() => {
      // Logic handled by UI state
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="bg-gray-50 pt-20 pb-16 px-6 text-center border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">Tap Shot Support</h1>
          <p className="text-xl text-gray-500 font-light">Need help? Find answers fast or contact us.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="mailto:scott@bolt-interactive.com" className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-blue-300 group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Email Support</h3>
            <span className="text-sm text-gray-500">Get in touch directly</span>
          </a>
          
          <button onClick={() => setShowBugForm(true)} className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-red-300 group">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Report a Bug</h3>
            <span className="text-sm text-gray-500">Let us fix it for you</span>
          </button>
          
          <Link to="/privacy" className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-green-300 group">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Privacy Policy</h3>
            <span className="text-sm text-gray-500">How we protect your data</span>
          </Link>
        </section>

        {/* Bug Report Form (Conditionally Rendered) */}
        {showBugForm && (
          <section id="bug-report" className="bg-gray-50 rounded-3xl p-8 border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Bug className="w-6 h-6 text-red-500" />
                Report a Bug
              </h2>
              <button onClick={() => setShowBugForm(false)} className="text-gray-400 hover:text-gray-600">
                Close
              </button>
            </div>

            {!bugFormSubmitted ? (
              <form onSubmit={handleBugSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                      <option>Crash</option>
                      <option>Performance</option>
                      <option>Controls</option>
                      <option>Audio/Haptics</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Info</label>
                  <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Apple Watch Series 8, watchOS 10.1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows="4" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Describe what happened..."></textarea>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm">
                  Submit Report
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Thanks for your report!</h3>
                <p className="text-gray-600 mb-6">Please email us with the details so we can follow up.</p>
                <a href="mailto:scott@bolt-interactive.com" className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Email scott@bolt-interactive.com
                </a>
              </div>
            )}
          </section>
        )}

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === index}
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              />
            ))}
          </div>
        </section>

        {/* Troubleshooting Checklist */}
        <section className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm hidden md:block">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Troubleshooting Checklist</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Restart Apple Watch</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Update watchOS</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Reinstall the app</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Check Focus/Do Not Disturb</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Check haptics settings</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Free storage</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Try on Wi-Fi</li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-100">
                <strong>Note:</strong> If you contact support, include your watchOS version and model.
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">We usually reply within 1–2 business days.</p>
          <a href="mailto:scott@bolt-interactive.com" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
            scott@bolt-interactive.com
          </a>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400 text-sm text-center">
        <div className="mb-4">
          <span className="font-semibold text-white">Tap Shot</span> — Watch Shooter
        </div>
        <div className="flex justify-center gap-6 mb-8">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <a href="mailto:scott@bolt-interactive.com" className="hover:text-white transition-colors">Contact</a>
        </div>
        <p>Version 1.0.2 • Last updated: Jan 2026</p>
      </footer>
    </div>
  );
};

export default TapShotSupport;
