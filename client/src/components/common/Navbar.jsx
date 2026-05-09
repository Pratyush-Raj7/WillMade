import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/rental', label: t('nav.rental') },
    { path: '/schemes', label: t('nav.schemes') },
    { path: '/rights', label: t('nav.rights') },
    { path: '/property', label: t('nav.property') },
  ];

  return (
    <>
      {/* Government stripe */}
      <div className="gov-stripe" />

      {/* Top bar */}
      <div className="bg-primary text-white px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl">⚖️</span>
          <div>
            <div className="font-bold text-lg leading-tight">
              {t('appName')}
            </div>
            <div className="text-xs text-blue-200">
              {t('tagline')}
            </div>
          </div>
        </Link>

        {/* Language switcher + mobile menu */}
        <div className="flex items-center gap-3">
          {/* Language buttons */}
          <div className="flex gap-1">
            {['en', 'kn', 'hi'].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                  i18n.language === lang
                    ? 'bg-saffron text-white'
                    : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'kn' ? 'ಕನ್ನಡ' : 'हिंदी'}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        {/* Desktop nav */}
        <div className="hidden md:flex px-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                location.pathname === link.path
                  ? 'border-saffron text-primary font-semibold'
                  : 'border-transparent text-gray-600 hover:text-primary hover:border-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden flex flex-col border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-6 py-3 text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-blue-50 text-primary font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;