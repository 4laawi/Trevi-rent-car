import React from 'react';
import { Car } from '../types';
import { 
  Fuel, 
  Settings, 
  Star, 
  ArrowRight, 
  Zap, 
  Crown, 
  Flame, 
  Sparkles,
  Check,
  CircleDot,
  AlertCircle
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface FleetProps {
  cars: Car[];
  onSelectCar: (carId: string) => void;
}

const Fleet: React.FC<FleetProps> = ({ cars, onSelectCar }) => {
  // Helper to get the correct icon component
  const getBadgeIcon = (iconName?: string) => {
    switch(iconName) {
      case 'Fire': return <Flame size={14} className="fill-current" />;
      case 'Crown': return <Crown size={14} className="fill-current" />;
      case 'Zap': return <Zap size={14} className="fill-current" />;
      case 'Sparkles': return <Sparkles size={14} className="fill-current" />;
      default: return <Star size={14} className="fill-current" />;
    }
  };

  const buttonColor = '#2C7873'; // Warm Teal constant for all buttons

  return (
    <section id="fleet" className="py-12 md:py-24 bg-[#F5F5F5] relative overflow-hidden">
      {/* Background Texture (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollReveal animation="fade-up" duration={800}>
          <div className="text-center mb-10 md:mb-20">
            <span className="text-gold-600 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Notre Flotte</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Choisissez Votre <br/>Compagnon de Route
            </h2>
            <p className="mt-4 md:mt-6 text-gray-500 max-w-2xl mx-auto font-light text-base md:text-lg">
              Une sélection rigoureuse de véhicules récents, entretenus à la perfection pour votre confort et sécurité au Maroc.
            </p>
          </div>
        </ScrollReveal>

        {/* Dynamic Grid Layout */}
        <div id="car-list" className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 md:gap-y-16">
          {cars.map((car, index) => (
            <ScrollReveal 
              key={car.id} 
              animation="fade-up" 
              delay={Math.min(index * 100, 500)} 
              duration={500}
              className={`${index % 2 !== 0 ? 'md:mt-16' : ''}`}
            >
              <div 
                className={`group relative bg-white rounded-[24px] overflow-hidden border border-black/5 h-full flex flex-col ${!car.isAvailable ? 'opacity-80 grayscale-[0.5]' : ''}`}
                style={{ 
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  willChange: 'transform'
                }}
              >
                {/* Hover Shadow Effect */}
                <div className="absolute inset-0 rounded-[24px] pointer-events-none transition-shadow duration-300 group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)]"></div>

                {/* Top Accent Stripe */}
                <div 
                  className="h-2 w-full" 
                  style={{ backgroundColor: car.isAvailable ? car.accentColor : '#9ca3af' }}
                />

                {/* Image Section */}
                <div className="relative h-72 md:h-96 overflow-hidden bg-gray-100 shrink-0">
                  <img 
                    src={car.image} 
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    style={{ willChange: 'transform' }}
                  />
                  
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none"></div>

                  {/* Floating Badge (Only if available) */}
                  {car.isAvailable && car.badge && (
                    <div 
                      className="absolute top-4 right-4 md:top-6 md:right-6 text-white text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg uppercase tracking-wide flex items-center gap-2 shadow-lg"
                      style={{ backgroundColor: `${car.accentColor}ee` }}
                    >
                      {getBadgeIcon(car.badgeIcon)}
                      {car.badge}
                    </div>
                  )}

                  {/* Unavailable Overlay */}
                  {!car.isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <div className="bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl border-2 border-white">
                             Indisponible
                         </div>
                    </div>
                  )}

                  {/* Rating Overlay */}
                  <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                    <div className="flex items-center gap-1.5 mb-1 bg-black/50 px-3 py-1.5 rounded-full border border-white/20">
                      <Star size={14} className="fill-gold-400 text-gold-400" />
                      <span className="font-bold text-base leading-none">{car.rating.toFixed(1)}</span>
                      <span className="text-gray-200 text-xs font-normal ml-1 border-l border-white/30 pl-2">{car.reviewCount} avis</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4 md:mb-5">
                    <div>
                      <span 
                        className="block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] mb-1 md:mb-2 opacity-80"
                        style={{ color: car.isAvailable ? car.accentColor : '#6b7280' }}
                      >
                        {car.type}
                      </span>
                      <h3 className="text-xl md:text-3xl font-serif text-gray-900 leading-none tracking-tight">
                        <span className="font-semibold text-gray-600 text-base md:text-xl block mb-0.5">{car.make}</span>
                        <span className="font-bold">{car.model}</span>
                      </h3>
                    </div>
                    
                    {/* Availability Pill */}
                    <div className="flex flex-col items-end">
                      {car.isAvailable ? (
                        <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-emerald-100 shadow-sm">
                            <CircleDot size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
                            {car.availableCount} dispo
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-red-700 bg-red-50 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-red-100 shadow-sm">
                            <AlertCircle size={10} className="text-red-500" />
                            Rupture
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features Grid - 2 Columns */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 md:gap-y-3 md:gap-x-6 mb-4 md:mb-6 flex-grow">
                    {/* Transmission */}
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        <Settings size={14} className="text-gray-600 md:w-4 md:h-4" />
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-gray-700">{car.transmission}</span>
                    </div>
                    
                    {/* Fuel */}
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        <Fuel size={14} className="text-gray-600 md:w-4 md:h-4" />
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-gray-700">{car.fuel}</span>
                    </div>

                    {/* Top 2 Custom Features */}
                    {car.features.slice(0, 2).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 md:gap-3">
                        <div 
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 border border-opacity-10"
                          style={{ 
                            backgroundColor: car.isAvailable ? `${car.accentColor}10` : '#f3f4f6',
                            borderColor: car.isAvailable ? car.accentColor : '#e5e7eb' 
                            }}
                        >
                          <Check size={14} style={{ color: car.isAvailable ? car.accentColor : '#9ca3af' }} className="md:w-4 md:h-4" />
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-gray-700 truncate">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <hr className="border-dashed border-gray-200 mb-4 md:mb-5" />

                  {/* Price & Action */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 block">
                        À partir de
                      </span>
                      <div className="flex items-baseline gap-1.5" style={{ color: car.isAvailable ? car.accentColor : '#6b7280' }}>
                         {car.promoPrice && car.promoPrice < car.pricePerDay ? (
                           <>
                             <span className="text-base line-through text-gray-400 font-medium mr-2">{car.pricePerDay} MAD</span>
                             <span className="text-4xl md:text-5xl font-black leading-none tracking-tighter shadow-gray-200 drop-shadow-sm text-red-500">
                                {car.promoPrice}
                             </span>
                             <span className="text-lg md:text-xl font-bold" style={{ color: '#FA8072' }}>MAD</span>
                           </>
                         ) : (
                           <>
                            <span className="text-4xl md:text-5xl font-black leading-none tracking-tighter shadow-gray-200 drop-shadow-sm">
                                {car.pricePerDay}
                            </span>
                            <span className="text-lg md:text-xl font-bold opacity-80">MAD</span>
                           </>
                         )}
                      </div>
                    </div>

                    <button 
                      onClick={() => car.isAvailable && onSelectCar(car.id)}
                      disabled={!car.isAvailable}
                      className={`w-full md:flex-grow md:max-w-[200px] h-[48px] md:h-[56px] rounded-xl text-white font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-3 
                        ${car.isAvailable ? 'hover:shadow-xl cursor-pointer' : 'bg-gray-400 cursor-not-allowed grayscale'}`}
                      style={{ 
                        background: car.isAvailable ? `linear-gradient(135deg, ${buttonColor}, #1f5f5b)` : undefined,
                        boxShadow: car.isAvailable ? `0 10px 25px -5px ${buttonColor}66` : undefined,
                        transition: 'box-shadow 0.3s ease-out, transform 0.3s ease-out',
                        willChange: 'transform'
                      }}
                      onMouseEnter={(e) => {
                        if (car.isAvailable) {
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {car.isAvailable ? 'RÉSERVER' : 'INDISPONIBLE'}
                      {car.isAvailable && <ArrowRight size={20} className="opacity-80 transition-transform duration-300 group-hover:translate-x-1.5" />}
                    </button>
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

export default Fleet;