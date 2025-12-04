import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Quels sont les documents nécessaires pour louer une voiture ?",
    answer: "Carte d'identité ou passeport, permis de conduire valide"
  },
  {
    question: "Quel est l'âge minimum pour louer une voiture ?",
    answer: "L'âge minimum est de 21 ans. Certains modèles peuvent nécessiter 23 ans ou plus."
  },
  {
    question: "Quelle ancienneté du permis est exigée ?",
    answer: "Un permis valide depuis au moins 2 ans est obligatoire."
  },
  {
    question: "Est-ce que je dois payer une caution ?",
    answer: "Oui, une caution peut être exigée selon le modèle choisi. Elle est restituée après le retour du véhicule."
  },
  {
    question: "Est-ce que vous offrez la livraison à l'aéroport ?",
    answer: "Oui, la livraison et la récupération à l'Aéroport de Casablanca sont disponibles sur demande."
  },
  {
    question: "Le kilométrage est-il limité ?",
    answer: "Nous offrons kilométrage illimité."
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Espèces, virement bancaire"
  },
  {
    question: "Puis-je ajouter un deuxième conducteur ?",
    answer: "Oui, un conducteur additionnel est possible avec présentation de son permis."
  },
  {
    question: "Que faire en cas de panne ou d'accident ?",
    answer: "Contactez-nous immédiatement. Assistance 24/7 incluse avec chaque location."
  },
  {
    question: "Les voitures sont-elles assurées ?",
    answer: "Oui, toutes nos voitures sont assurées assurance tout risque."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <ScrollReveal animation="fade-up" duration={800}>
          <div className="text-center mb-10 md:mb-16">
            <span className="text-gold-600 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-2 md:mb-3 block">
              Questions Fréquentes
            </span>
            <h2 className="text-2xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Besoin d'<span className="text-gold-500">Informations</span> ?
            </h2>
            <p className="text-gray-600 mt-4 text-sm md:text-base max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur la location de véhicules au Maroc
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <ScrollReveal 
              key={index} 
              animation="fade-up" 
              delay={index * 50} 
              duration={600}
            >
              <div className="bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-gold-200 hover:shadow-md">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left outline-none focus:outline-none active:outline-none rounded-xl md:rounded-2xl transition-colors group"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-base md:text-lg font-serif font-semibold text-gray-900 pr-4 group-hover:text-gold-700 transition-colors">
                    {item.question}
                  </h3>
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 text-gold-600 transition-transform duration-300 ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 md:px-8 pb-5 md:pb-6 pt-0">
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

