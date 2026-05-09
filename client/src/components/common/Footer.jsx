import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-white mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⚖️</span>
              <span className="font-bold text-lg">{t('appName')}</span>
            </div>
            <p className="text-blue-200 text-sm">
              {t('tagline')}
            </p>
          </div>

          {/* Free Legal Help */}
          <div>
            <h4 className="font-semibold mb-3">Free Legal Aid</h4>
            <ul className="text-blue-200 text-sm space-y-2">
              <li>NALSA Helpline: <span className="text-white font-medium">15100</span></li>
              <li>Karnataka SLSA: <span className="text-white font-medium">080-22113111</span></li>
              <li>Lok Adalat: Available every Saturday</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-semibold mb-3">⚠️ Disclaimer</h4>
            <p className="text-blue-200 text-sm">
              {t('disclaimer')}
            </p>
          </div>

        </div>

        <div className="border-t border-blue-800 mt-8 pt-4 text-center text-blue-300 text-xs">
          Built for Karnataka Legal Literacy Hackathon 2024 — Nyaya Mitra
        </div>
      </div>
    </footer>
  );
};

export default Footer;