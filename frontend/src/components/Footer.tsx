import { Mail, Shield, Zap, ExternalLink, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: The Quick Community */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-2xl">
                Quick Community
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              We are a community-driven platform providing{" "}
              <strong>100% free, offline-first financial tools</strong>. Our
              mission is to provide privacy-focused software that belongs to
              you, not the cloud.
            </p>
          </div>

          {/* Column 2: Our Free Services */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-lg underline decoration-blue-500 underline-offset-4">
              Free Services
            </h4>
            <ul className="space-y-4">
              {/* Tool 1: Expense Tracker */}
              <li className="group">
                <a
                  href="https://quicksuite.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-semibold text-sm transition-colors"
                >
                  <ExternalLink
                    size={16}
                    className="text-blue-600 group-hover:text-blue-600"
                  />
                  <span className="text-blue-600">1. Quick Suite</span>
                </a>
                <p className="text-xs  text-blue-600 ml-7">
                  PDF, Images & OCR Engine
                </p>
              </li>
              <li className="group">
                <div className="flex items-center gap-3  font-semibold text-sm">
                  <Zap size={16} />
                  <span>2. QuickTrack (Expense Manager)</span>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  Track daily spending offline with zero tracking.
                </p>
              </li>

              {/* Tool 2: Invoice Generator */}
              <li className="group">
                <a
                  href="https://quickinvoices.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-semibold text-sm transition-colors"
                >
                  <ExternalLink
                    size={16}
                    className="text-gray-400 group-hover:text-blue-600"
                  />
                  <span>3. QuickInvoice (Invoice Generator)</span>
                </a>
                <p className="text-xs text-gray-500 ml-7">
                  Create professional invoices for free, anywhere.
                </p>
              </li>
            </ul>
          </div>

          {/* Column 3: Privacy & Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-lg">
              Community Support
            </h4>
            <p className="text-sm text-gray-600">
              Our tools are free and always will be. Need help or have an idea
              for a new tool?
            </p>
            <a
              href="mailto:md.faizan.ahmad.web.com"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
            >
              <Mail size={18} />
              Contact Community
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Shield size={12} />
            <span>Privacy Focused • Local Storage • Open Access</span>
          </div>
          <p>© 2025 Quick Community. All Tools are Free.</p>
        </div>
      </div>
    </footer>
  );
}
