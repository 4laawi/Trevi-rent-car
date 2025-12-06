import React from 'react';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white pt-12 md:pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16 items-start">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-serif font-bold tracking-wider text-white mb-4">
              TREVI <span className="text-gold-500">RENTAL</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Services de location de voitures modernes partout au Maroc. 
              Fiable, abordable et confortable. Votre voyage commence avec nous.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a 
                href="https://www.instagram.com/trevi_rent_car/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/trevi_rent_car/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-4 text-gold-500">Liens Rapides</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#home" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">Notre Flotte</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">Réservation</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Avis</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-4 text-gold-500">Contactez-nous</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin size={18} className="text-gold-500 mt-0.5 shrink-0" />
                <span>123 Boulevard Mohammed V,<br/>Casablanca, Maroc</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone size={18} className="text-gold-500 shrink-0" />
                <span>+212 6 16 92 55 72</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone size={18} className="text-gold-500 shrink-0" />
                <span>+212 5 22 53 20 62</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Mail size={18} className="text-gold-500 shrink-0" />
                <span>Trevirentcar@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Trevi Car Rental Maroc. Tous droits réservés.</p>
          <p className="mt-2">
            Site web créé par{' '}
            <a 
              href="https://www.sitepro.ma" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold-500 hover:text-gold-400 transition-colors underline"
            >
              sitepro.ma
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;