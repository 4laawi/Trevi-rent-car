import React from 'react';
import { Wallet, Car, Headphones, Plane, ShieldCheck, Eye } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const features = [
  {
    icon: <Wallet size={28} />,
    title: "Prix Compétitifs",
    description: "Le confort accessible. Nous garantissons les meilleurs tarifs du marché pour cette gamme de véhicules."
  },
  {
    icon: <Car size={28} />,
    title: "Véhicules Récents",
    description: "Une flotte de moins de 12 mois, rigoureusement entretenue pour une fiabilité absolue."
  },
  {
    icon: <Headphones size={28} />,
    title: "Service Client 24/7",
    description: "Une assistance dévouée jour et nuit. En cas de besoin, nous sommes juste au bout du fil."
  },
  {
    icon: <Plane size={28} />,
    title: "Livraison Aéroport",
    description: "Votre voiture vous attend dès l'atterrissage. Livraison gratuite à l'aéroport de Casablanca."
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Assurance Complète",
    description: "Roulez l'esprit tranquille. Assurance tout risque avec franchise de minimum 5%."
  },
  {
    icon: <Eye size={28} />,
    title: "Transparence Totale",
    description: "Pas de frais cachés, pas de surprises. Le prix affiché est le prix exact que vous payez."
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-12 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal animation="fade-up" duration={800}>
          <div className="text-center mb-8 md:mb-20">
            <span className="text-gold-600 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-2 md:mb-3 block">Pourquoi Nous Choisir ?</span>
            <h2 className="text-2xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              L'Excellence <span className="text-gold-500">Trevi</span> Rental
            </h2>
          </div>
        </ScrollReveal>

        {/* 
            Optimized Mobile Grid:
            - grid-cols-2 on mobile (was 1): Cuts vertical rows from 6 to 3.
            - Reduced padding (p-3) on mobile.
            - Smaller text on mobile.
        */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {features.map((feature, index) => (
            <ScrollReveal 
              key={index} 
              animation="fade-up" 
              delay={index * 100} // Staggered delay for cascade effect
              duration={600}
            >
              <div 
                className="group h-full p-3 md:p-8 rounded-xl md:rounded-[2rem] bg-gray-50 border border-transparent hover:border-gold-100 hover:bg-white transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(234,179,8,0.15)] relative overflow-hidden text-center md:text-left"
              >
                {/* Hover Glow Effect (Desktop Only) */}
                <div className="hidden md:block absolute -right-10 -top-10 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center md:items-start">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gold-600 mb-3 md:mb-6 group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-white group-hover:border-gold-500 transition-all duration-300">
                      {/* Clone element to force size override on mobile if needed */}
                      {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 20, className: "md:w-7 md:h-7" })}
                  </div>
                  
                  <h3 className="text-sm md:text-xl font-serif font-bold text-gray-900 mb-1.5 md:mb-3 group-hover:text-gold-700 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-500 leading-tight md:leading-relaxed text-[10px] md:text-sm group-hover:text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;