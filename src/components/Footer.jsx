import { Fingerprint, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FabricID</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              AI-powered textile authentication platform protecting MSME manufacturers
              from counterfeiting. Building trust in India&apos;s textile ecosystem through
              digital fingerprinting technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/verify" className="hover:text-white transition-colors">Verify Fabric</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Register as Manufacturer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                contact@fabricid.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                +91-422-2345678
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                Coimbatore, Tamil Nadu
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} FabricID. Empowering Indian MSME Textiles.</p>
        </div>
      </div>
    </footer>
  );
}
