import React from 'react';
import { Twitch, Twitter, Youtube, MessageCircle, Heart, ArrowUp, Instagram, Video } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Community': [
      { name: 'Discord Server', href: 'https://discord.gg/imow' },
      { name: 'Twitch Channel', href: 'https://twitch.tv/imow' },
      { name: 'YouTube Channel', href: 'https://youtube.com/@ImOwPC' },
      { name: 'Twitter/X', href: 'https://x.com/ImOwFromYT' }
    ],
    'Content': [
      { name: 'Live Streams', href: '#home' },
      { name: 'Best Clips', href: '#clips' },
      { name: 'Guides', href: '/gun-builds', isRoute: true },
      { name: 'Tournaments', href: '#about' }
    ],
    'Support': [
      { name: 'Contact', href: '#contact' },
      { name: 'FAQ', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Twitch', icon: Twitch, href: 'https://www.twitch.tv/imow', color: 'hover:text-neon-blue' },
    { name: 'Twitter/X', icon: Twitter, href: 'https://x.com/ImOwFromYT', color: 'hover:text-neon-blue' },
    { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@ImOwPC', color: 'hover:text-neon-blue' },
    { name: 'Discord', icon: MessageCircle, href: 'https://discord.gg/imow', color: 'hover:text-neon-blue' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/imowfromyt/', color: 'hover:text-neon-blue' },
    { name: 'TikTok', icon: Video, href: 'https://www.tiktok.com/@imowfromyt', color: 'hover:text-neon-blue' }
  ];

  return (
    <footer className="relative bg-darker-bg border-t border-gray-800">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-darker-bg"></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-3xl font-gaming font-bold glow-text mb-4">
                  IMOW
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Professional ABI player and Twitch streamer dedicated to competitive gaming excellence. 
                  Join the community and be part of the journey to the top.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-card-bg border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:border-neon-blue hover:scale-110`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="bg-card-bg border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-2">
                  Stay updated with the latest news
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-neon-blue"
                  />
                  <button className="px-4 py-2 bg-neon-blue text-dark-bg rounded-r-lg text-sm font-gaming font-bold hover:bg-neon-blue/80 transition-colors duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], idx) => (
              <div key={category} className="relative">
                <h4 className="text-lg font-gaming font-bold text-white mb-4">
                  {category}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-neon-blue transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
                {/* Admin Button under Terms of Service in Support column */}
                {category === 'Support' && (
                  <div className="flex justify-start mt-4">
                    <button
                      className="text-gray-400 hover:text-neon-blue transition-colors duration-300 text-sm"
                      onClick={() => window.openAdminLogin && window.openAdminLogin()}
                    >
                      Admin
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>© {currentYear} Imow. All rights reserved.</span>
                <span>•</span>
                <span>Made with</span>
                <Heart size={14} className="text-red-400 animate-pulse" />
                <span>for the gaming community</span>
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 text-gray-400 hover:text-neon-blue transition-colors duration-300 text-sm"
              >
                <span>Back to Top</span>
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-1 h-1 bg-neon-blue rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-2 h-2 bg-neon-green rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-20 w-1 h-1 bg-neon-purple rounded-full animate-float"></div>
    </footer>
  );
};

export default Footer; 