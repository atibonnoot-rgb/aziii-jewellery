import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Send, Phone, Mail, HelpCircle, Truck } from 'lucide-react';
import { DiamondIcon } from './DiamondIcon';
import { AziiJewelsLogo } from './AziiJewelsLogo';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#0a0a0a] text-white font-['Jost',sans-serif] border-t border-neutral-800">
      {/* Top Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left items-start">
        {/* Column 1: NEWSLETTER */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-[0.2em] text-white uppercase font-['Montserrat',sans-serif]">
            NEWSLETTER
          </h3>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Sign up to our newsletter to receive updates on the art of Coin.
          </p>

          <form onSubmit={handleSubscribe} className="pt-2">
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="w-full px-4 py-2.5 text-xs bg-[#181818] border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 text-[11px] font-bold tracking-[0.2em] uppercase bg-white text-black hover:bg-neutral-200 transition-colors"
              >
                {subscribed ? 'SUBSCRIBED!' : 'SUBSCRIPTION'}
              </button>
            </div>
          </form>
        </div>

        {/* Column 2: BRAND & SOCIALS */}
        <div className="flex flex-col items-center justify-center space-y-4 md:border-x border-neutral-800 md:px-8">
          <a href="#" className="hover:scale-105 transition-transform">
            <AziiJewelsLogo size="lg" />
          </a>

          <div className="pt-4">
            <p className="text-[11px] tracking-[0.2em] text-neutral-400 uppercase font-medium mb-3">
              FOLLOW US ON
            </p>
            <div className="flex items-center space-x-4 text-neutral-300">
              <a href="#" className="p-2 bg-[#181818] hover:bg-neutral-800 hover:text-white rounded-full transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="p-2 bg-[#181818] hover:bg-neutral-800 hover:text-white rounded-full transition-colors">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="p-2 bg-[#181818] hover:bg-neutral-800 hover:text-white rounded-full transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="p-2 bg-[#181818] hover:bg-neutral-800 hover:text-white rounded-full transition-colors">
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Column 3: CONCIERGE */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-[0.2em] text-white uppercase font-['Montserrat',sans-serif]">
            CONCIERGE
          </h3>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Don't hesitate in contacting us for any questions you might have.
          </p>

          <ul className="space-y-2 text-xs text-neutral-300 font-light pt-1">
            <li>
              <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors justify-center md:justify-start">
                <Truck className="w-3.5 h-3.5 text-neutral-400" />
                <span>SHIPPING & RETURNS</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors justify-center md:justify-start">
                <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </a>
            </li>
            <li>
              <a href="tel:541678311160" className="flex items-center space-x-2 hover:text-white transition-colors justify-center md:justify-start">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>+54 1678 311 160</span>
              </a>
            </li>
            <li>
              <a href="mailto:contact.7uptheme@gmail.com" className="flex items-center space-x-2 hover:text-white transition-colors justify-center md:justify-start">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>contact.7uptheme@gmail.com</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Watermark Link shown in screenshot */}
      <div className="text-center py-3 bg-[#070707] border-t border-neutral-900">
        <p className="text-[11px] text-neutral-500 font-mono tracking-wider">
          www.DownloadNewThemes.com
        </p>
      </div>

      {/* Bottom Sub-Footer Nav Links */}
      <div className="bg-[#050505] py-6 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[10px] tracking-widest text-neutral-400 uppercase font-medium">
          <a href="#" className="hover:text-white transition-colors">CONTACT US</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">SITEMAP</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">CAREERS</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">DRACK LIGHT STORE</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">REPRINTS & PERMISSIONS</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">PRIVACY & COOKIES</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">TERMS & CONDITIONS</a>
          <span>|</span>
          <a href="#" className="hover:text-white transition-colors">ABOUT US</a>
        </div>
      </div>
    </footer>
  );
};
