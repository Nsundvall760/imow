import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onOpenModManager }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Clips', href: '#clips' },
    { name: 'Social', href: '#social' },
    { name: 'PC Specs', href: '#pc-specs' },
    { name: 'Gun Builds', href: '/gun-builds', isRoute: true },
    { name: 'Contact', href: '#contact' }
  ];

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Helper to scroll to section after navigation
  const scrollToSection = (href) => {
    if (href.startsWith('/')) return; // handled by Link
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  // Handle nav click from any page
  const handleNavClick = (href) => {
    if (href.startsWith('/')) return; // handled by Link
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection(href), 50);
    } else {
      scrollToSection(href);
    }
    setIsOpen(false);
  };

  // Handle logo click
  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection('#home'), 50);
    } else {
      scrollToSection('#home');
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUsername');
    window.location.reload();
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-dark-bg/90 backdrop-blur-custom border-b border-neon-blue/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={handleLogoClick}
              className="text-2xl font-gaming font-bold glow-text hover:text-neon-blue transition-colors duration-300"
            >
              IMOW
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-neon-blue px-3 py-2 text-sm font-medium transition-colors duration-300 hover:text-shadow"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="text-gray-300 hover:text-neon-blue px-3 py-2 text-sm font-medium transition-colors duration-300 hover:text-shadow"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex items-center gap-2 ml-4">
                {isAdmin && (
                  <button
                    className="text-xs text-gray-400 hover:text-neon-blue border border-neon-blue rounded px-3 py-1 transition-colors duration-200"
                    onClick={onOpenModManager}
                  >
                    Admin
                  </button>
                )}
                {isAdmin && (
                  <button
                    className="text-xs text-red-400 border border-red-400 rounded px-3 py-1 transition-colors duration-200 hover:bg-red-500/20"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a 
              href="https://discord.gg/imow"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-button focus:outline-none focus:ring-0 px-6 py-2 text-base font-gaming font-bold"
              style={{ minWidth: 180 }}
            >
              JOIN COMMUNITY
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-neon-blue transition-colors duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-dark-bg/95 backdrop-blur-custom border-t border-neon-blue/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => item.isRoute ? (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-neon-blue block px-3 py-2 text-base font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-300 hover:text-neon-blue block px-3 py-2 text-base font-medium transition-colors duration-300"
              >
                {item.name}
              </button>
            ))}
            {isAdmin && (
              <button
                className="text-xs text-red-400 border border-red-400 rounded px-3 py-1 mt-2 w-full transition-colors duration-200 hover:bg-red-500/20"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
            <a 
              href="https://discord.gg/imow"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-button w-full mt-4 focus:outline-none focus:ring-0"
            >
              Join Community
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 