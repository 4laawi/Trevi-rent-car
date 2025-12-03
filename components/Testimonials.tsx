import React from 'react';
import { REVIEWS } from '../constants';
import { Star, Quote } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="py-16 md:py-24 bg-luxury-50">
      <div className="container mx-auto px-6">
        <ScrollReveal animation="fade-up" duration={800}>
          <div className="text-center mb-10 md:mb-16">
            <span className="text-gold-600 font-bold tracking-wider uppercase text-sm">Témoignages</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">La Confiance de nos Clients</h2>
            <div className="w-20 h-1 bg-gold-500 mx-auto mt-4"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {REVIEWS.map((review, index) => (
            <ScrollReveal key={review.id} animation="fade-up" delay={index * 150} duration={800}>
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 hover:-translate-y-2 transition-transform duration-300 relative h-full">
                <Quote className="absolute top-6 right-6 text-gold-100" size={32} />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < review.rating ? "fill-gold-400 text-gold-400" : "text-gray-300"} 
                    />
                  ))}
                </div>

                <p className="text-gray-600 italic mb-6 leading-relaxed relative z-10 text-sm md:text-base">
                  "{review.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{review.date}</span>
                      {review.language === 'darija' && (
                          <span className="text-[10px] bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Darija</span>
                      )}
                    </div>
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

export default Testimonials;