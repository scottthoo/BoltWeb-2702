import { FaBolt, FaLinkedin, FaTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
              <FaBolt className="text-orange-500" />
              <span>BOLT</span>
            </div>
            <p className="max-w-md leading-relaxed">
              We partner with forward-thinking executives to build AI-driven
              organizations. Reducing operational friction and accelerating
              execution speed through strategic intelligence systems.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">
              Strategic Initiatives
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/#services"
                  className="hover:text-white transition-colors"
                >
                  CEO Consultation
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="hover:text-white transition-colors"
                >
                  Implementation Roadmaps
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="hover:text-white transition-colors"
                >
                  Operational Transformation
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="hover:text-white transition-colors"
                >
                  AI Governance
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Connect</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/#contact"
                  className="hover:text-white transition-colors"
                >
                  Request Briefing
                </a>
              </li>
              <li>
                <a
                  href="mailto:scott@bolt-interactive.com"
                  className="hover:text-white transition-colors"
                >
                  Email Leadership
                </a>
              </li>
              <li className="flex gap-4 pt-2">
                <a
                  href="#"
                  className="text-xl hover:text-white transition-colors"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="#"
                  className="text-xl hover:text-white transition-colors"
                >
                  <FaTwitter />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>
            © {new Date().getFullYear()} Bolt Interactive PLT. All rights
            reserved.
          </p>
          <div className="flex gap-8">
            <a
              href="/number-energy-converter-privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
