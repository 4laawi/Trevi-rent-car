import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import BookingForm from './BookingForm';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import LoadingSpinner from './LoadingSpinner';
import { 
  MapPin, Phone, Calendar, Star, Award, ShieldCheck, 
  ThumbsUp, HelpCircle, ChevronRight, Compass, ShieldAlert 
} from 'lucide-react';
import { LOCATIONS } from '../lib/locationsData';
import { supabase } from '../lib/supabaseClient';
import { Car, SupabaseCar } from '../types';

const LocationLandingPage: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Find the current location data
  const locationInfo = LOCATIONS.find(loc => loc.slug === citySlug);

  // Disable static Casablanca-centric schemas when location landing page is active
  useEffect(() => {
    const staticCarRental = document.getElementById('schema-car-rental');
    const staticBreadcrumb = document.getElementById('schema-breadcrumb');
    const staticFaq = document.getElementById('schema-faq');
    
    if (staticCarRental) staticCarRental.setAttribute('type', 'application/ld+json-disabled');
    if (staticBreadcrumb) staticBreadcrumb.setAttribute('type', 'application/ld+json-disabled');
    if (staticFaq) staticFaq.setAttribute('type', 'application/ld+json-disabled');
    
    return () => {
      if (staticCarRental) staticCarRental.setAttribute('type', 'application/ld+json');
      if (staticBreadcrumb) staticBreadcrumb.setAttribute('type', 'application/ld+json');
      if (staticFaq) staticFaq.setAttribute('type', 'application/ld+json');
    };
  }, []);

  // Save and Restore Original Metadata + Dynamic Browser Metadata Hook
  useEffect(() => {
    if (!locationInfo || !citySlug) return;
    
    const canonicalUrl = `https://www.trevirentcarlocation.ma/location/${citySlug}`;
    
    // Save original values for restoration on unmount
    const originalTitle = "Location de Voiture Casablanca | Agence Trevi Car Rental Maroc";
    const originalDescription = "Location de voiture à Casablanca. Louez au meilleur prix à l'aéroport et en centre-ville. Flotte de véhicules récents, service 24/7. Réservez en ligne.";
    const originalCanonical = "https://www.trevirentcarlocation.ma/";
    
    // Apply dynamic location metadata
    document.title = locationInfo.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', locationInfo.metaDescription);
    }
    
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonicalLink);
    }
    
    // Update Open Graph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', locationInfo.title);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', locationInfo.metaDescription);
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
    
    // Update Twitter Tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', locationInfo.title);
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', locationInfo.metaDescription);
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', canonicalUrl);
    
    window.scrollTo(0, 0);

    return () => {
      // Restore original home values on unmount
      document.title = originalTitle;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', originalDescription);
      
      const canonLink = document.querySelector('link[rel="canonical"]');
      if (canonLink) canonLink.setAttribute('href', originalCanonical);
      
      const oTitle = document.querySelector('meta[property="og:title"]');
      if (oTitle) oTitle.setAttribute('content', originalTitle);
      
      const oDesc = document.querySelector('meta[property="og:description"]');
      if (oDesc) oDesc.setAttribute('content', originalDescription);
      
      const oUrl = document.querySelector('meta[property="og:url"]');
      if (oUrl) oUrl.setAttribute('content', originalCanonical);
      
      const tTitle = document.querySelector('meta[name="twitter:title"]');
      if (tTitle) tTitle.setAttribute('content', originalTitle);
      
      const tDesc = document.querySelector('meta[name="twitter:description"]');
      if (tDesc) tDesc.setAttribute('content', originalDescription);
      
      const tUrl = document.querySelector('meta[name="twitter:url"]');
      if (tUrl) tUrl.setAttribute('content', originalCanonical);
    };
  }, [locationInfo, citySlug]);

  // Dynamic JSON-LD Branch, Breadcrumb & FAQ Schemas Hook
  useEffect(() => {
    if (!locationInfo || !citySlug) return;
    
    const canonicalUrl = `https://www.trevirentcarlocation.ma/location/${citySlug}`;
    
    // 1. Localized CarRentalService Schema
    const carRentalSchema = {
      "@context": "https://schema.org",
      "@type": "CarRentalService",
      "name": `Trevi Car Rental ${locationInfo.cityName}`,
      "alternateName": `Location de voiture ${locationInfo.cityName} - Trevi Car Rental`,
      "description": locationInfo.metaDescription,
      "url": canonicalUrl,
      "image": "https://www.trevirentcarlocation.ma/logo.png",
      "telephone": locationInfo.phone,
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": locationInfo.branchAddress,
        "addressLocality": locationInfo.cityName,
        "addressCountry": "MA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": locationInfo.latitude,
        "longitude": locationInfo.longitude
      },
      "areaServed": {
        "@type": "City",
        "name": locationInfo.cityName
      },
      "serviceType": "Location de voiture",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
      "sameAs": [
        "https://www.instagram.com/trevi_rent_car/"
      ]
    };

    // 2. Localized BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "item": "https://www.trevirentcarlocation.ma/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": `Location de Voiture ${locationInfo.cityName}`,
          "item": canonicalUrl
        }
      ]
    };

    // 3. Localized FAQPage Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": locationInfo.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    // Helper function to inject schemas dynamically
    const injectSchema = (id: string, data: object) => {
      let script = document.getElementById(id) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    injectSchema('dynamic-location-schema', carRentalSchema);
    injectSchema('dynamic-breadcrumb-schema', breadcrumbSchema);
    injectSchema('dynamic-faq-schema', faqSchema);

    return () => {
      ['dynamic-location-schema', 'dynamic-breadcrumb-schema', 'dynamic-faq-schema'].forEach(id => {
        const existingScript = document.getElementById(id);
        if (existingScript) {
          existingScript.remove();
        }
      });
    };
  }, [locationInfo]);

  // Fetch cars from Supabase for live rendering
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('cars').select('*');

        if (error) throw error;

        if (data) {
          const mappedCars: Car[] = (data as SupabaseCar[]).map((row, index) => {
            let accentColor = '#2C7873';
            let badgeIcon = 'Star';
            let badge = undefined;

            const catLower = row.category.toLowerCase();
            if (catLower.includes('suv') || catLower.includes('4x4')) {
              accentColor = '#E27D60';
              badgeIcon = 'Fire';
            } else if (catLower.includes('luxe') || catLower.includes('luxury') || row.price_per_day > 600) {
              accentColor = '#E8B44A';
              badgeIcon = 'Crown';
              badge = 'Luxe';
            } else if (catLower.includes('eco') || catLower.includes('citadine')) {
              accentColor = '#2C7873';
              badgeIcon = 'Sparkles';
              if (row.price_per_day < 300) badge = 'Meilleur Prix';
            } else {
              accentColor = '#1A3C5A';
              badgeIcon = 'Zap';
            }

            if (row.promo_price && row.promo_price < row.price_per_day) {
              badge = 'Promo';
              badgeIcon = 'Zap';
            }

            return {
              id: row.id.toString(),
              make: row.brand,
              model: row.name,
              type: row.category,
              transmission: row.gearbox,
              fuel: row.fuel_type,
              pricePerDay: row.price_per_day,
              promoPrice: row.promo_price,
              features: ['Climatisation', 'Bluetooth', 'Sécurité ABS', 'GPS'],
              accessories: ['Sièges auto', 'JAWAZ'],
              image: row.image_url,
              description: row.description || undefined,
              isAvailable: row.is_available,
              accentColor,
              rating: 4.5 + (index % 5) * 0.1,
              reviewCount: 40 + (index * 12),
              availableCount: row.is_available ? (3 + (index % 5)) : 0,
              badge,
              badgeIcon
            };
          });

          // Sort cars by model
          const priorityOrder = ['kardian', 'accent', 'duster', 'creta'];
          const sortedCars = mappedCars.sort((a, b) => {
            const modelA = a.model.toLowerCase();
            const modelB = b.model.toLowerCase();
            const indexA = priorityOrder.findIndex(p => modelA.includes(p));
            const indexB = priorityOrder.findIndex(p => modelB.includes(p));

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
          });

          setCars(sortedCars);
        }
      } catch (err: any) {
        console.error('Error fetching cars:', err.message);
        setError('Impossible de charger les véhicules.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleCarSelection = (carId: string) => {
    setSelectedCarId(carId);
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Safe redirect on invalid slugs (avoid broken URLs or crawl errors)
  if (!locationInfo) {
    return <Navigate to="/" replace />;
  }

  const { cityName, h1, introDescription, bodyText1, bodyText2, deliveryDetails, branchAddress, phone, faqs } = locationInfo;

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[65vh] md:h-[75vh] flex items-center justify-center text-white overflow-hidden bg-gray-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="/first-frame.webp" 
            alt={`Location de voiture à ${cityName}`} 
            className="w-full h-full object-cover opacity-35" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <ScrollReveal animation="fade-up" duration={800}>
            <span className="bg-gold-500/20 text-gold-400 border border-gold-500/30 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase mb-4 inline-block">
              Trevi Rental Maroc
            </span>
            <h1 className="text-3xl md:text-6xl font-serif font-black leading-tight mb-4 tracking-tight">
              {h1}
            </h1>
            <p className="text-sm md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
              {introDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#booking" 
                className="bg-gold-600 hover:bg-gold-700 text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-gold-500/20 text-sm md:text-base"
              >
                Réserver Maintenant
              </a>
              <a 
                href="#fleet-section" 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-3.5 rounded-full transition-all duration-300 text-sm md:text-base"
              >
                Voir la Flotte
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Presentation Block */}
      <section className="py-16 md:py-24 bg-luxury-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal animation="slide-left" duration={800}>
              <div>
                <span className="text-gold-600 font-bold tracking-wider uppercase text-sm">Services Premium</span>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mt-2 mb-6">
                  Louer une voiture à {cityName} avec Trevi Rental
                </h2>
                <div className="w-16 h-1 bg-gold-500 mb-6"></div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                  {bodyText1}
                </p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                  {bodyText2}
                </p>
                
                {/* Local Branch Info */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gold-500 mt-1 shrink-0" size={18} />
                    <div>
                      <span className="block font-bold text-xs text-gray-400 uppercase">Point de Livraison / Agence</span>
                      <span className="text-sm font-semibold text-gray-800">{branchAddress}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gold-500 shrink-0" size={18} />
                    <div>
                      <span className="block font-bold text-xs text-gray-400 uppercase">Assistance & Support</span>
                      <span className="text-sm font-semibold text-gray-800">{phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Unique Selling Proposition Cards */}
            <ScrollReveal animation="slide-right" duration={800}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-gold-50 text-gold-600 rounded-xl flex items-center justify-center font-bold">
                    <Compass size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Livraison Gratuite</h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    {deliveryDetails}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-gold-50 text-gold-600 rounded-xl flex items-center justify-center font-bold">
                    <Star size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Zéro Frais Cachés</h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    Les tarifs sont fermes et garantis. Kilométrage illimité et assurance tout risque inclus.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-gold-50 text-gold-600 rounded-xl flex items-center justify-center font-bold">
                    <Award size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Flotte Récente</h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    Des citadines maniables, des berlines professionnelles et des SUV 4x4 robustes à l'hygiène impeccable.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-gold-50 text-gold-600 rounded-xl flex items-center justify-center font-bold">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Assistance 24/7</h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    Notre assistance intervient immédiatement partout au Maroc en cas de besoin.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Fleet Component Section */}
      <section id="fleet-section" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <ScrollReveal animation="fade-up" duration={800}>
            <div className="text-center mb-10 md:mb-16">
              <span className="text-gold-600 font-bold tracking-wider uppercase text-sm">Notre Flotte</span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mt-2">
                Véhicules disponibles à {cityName}
              </h2>
              <div className="w-20 h-1 bg-gold-500 mx-auto mt-4"></div>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="py-12"><LoadingSpinner /></div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {cars.map((car, index) => {
                const displayPrice = car.promoPrice && car.promoPrice < car.pricePerDay 
                  ? car.promoPrice 
                  : car.pricePerDay;

                return (
                  <ScrollReveal key={car.id} animation="fade-up" delay={index * 100} duration={800}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-300">
                      {/* Car Image with Badge */}
                      <div className="relative h-44 md:h-52 overflow-hidden bg-gray-50">
                        <img 
                          src={car.image} 
                          alt={`${car.make} ${car.model}`} 
                          className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                        />
                        {car.badge && (
                          <span className="absolute top-4 left-4 bg-gold-500 text-white text-[10px] md:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                            {car.badge}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {car.make} {car.model}
                          </h3>
                        </div>

                        <div className="text-xs text-gray-400 uppercase font-semibold mb-4 tracking-wider">
                          {car.type}
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs md:text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gold-500 font-bold">•</span>
                            <span>{car.transmission}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-gold-500 font-bold">•</span>
                            <span>{car.fuel}</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2">
                            <span className="text-gold-500 font-bold">•</span>
                            <span>Assurance Tout Risque</span>
                          </div>
                        </div>

                        {/* Price & Booking Trigger */}
                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                          <div>
                            <span className="block text-[10px] text-gray-400 uppercase font-bold">À partir de</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl md:text-2xl font-black text-gray-900">{displayPrice}</span>
                              <span className="text-xs text-gray-500 font-bold">MAD/jour</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleCarSelection(car.id)}
                            className="bg-gold-600 hover:bg-gold-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs md:text-sm transition-all shadow hover:shadow-gold-500/20"
                          >
                            Réserver
                          </button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Booking Form Component */}
      <BookingForm cars={cars} selectedCarId={selectedCarId} defaultCity={cityName} />

      {/* Localized FAQ Section */}
      <section className="py-16 md:py-24 bg-luxury-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollReveal animation="fade-up" duration={800}>
            <div className="text-center mb-10 md:mb-16">
              <span className="text-gold-600 font-bold tracking-wider uppercase text-sm">FAQ {cityName}</span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mt-2">
                Questions Fréquentes — {cityName}
              </h2>
              <div className="w-16 h-1 bg-gold-500 mx-auto mt-4"></div>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100} duration={800}>
                <details className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm group">
                  <summary className="font-bold text-gray-900 text-sm md:text-base cursor-pointer list-none flex justify-between items-center outline-none">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="text-gold-500 shrink-0" size={18} />
                      {faq.question}
                    </span>
                    <ChevronRight className="text-gray-400 group-open:rotate-90 transition-transform" size={18} />
                  </summary>
                  <p className="mt-4 text-gray-600 text-xs md:text-sm leading-relaxed border-t border-gray-50 pt-4">
                    {faq.answer}
                  </p>
                </details>
              </ScrollReveal>
            ))}
          </div>

          {/* Hub-and-Spoke Internal Link Infrastructure */}
          <ScrollReveal animation="fade-up" duration={800}>
            <div className="bg-white border border-gray-100 p-6 md:p-10 rounded-2xl text-center mt-20 shadow-md">
              <h3 className="text-lg md:text-xl font-serif font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
                <Compass className="text-gold-500" size={20} />
                Nos autres agences de location de voiture au Maroc
              </h3>
              <p className="text-gray-500 text-xs md:text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
                Trevi Car Rental livre vos véhicules gratuitement dans de nombreuses villes et aéroports internationaux à travers le Royaume. Explorez d'autres destinations :
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
                {LOCATIONS.filter(loc => loc.slug !== citySlug).map(loc => (
                  <Link 
                    key={loc.slug} 
                    to={`/location/${loc.slug}`} 
                    className="bg-gray-50 border border-gray-200 hover:border-gold-500 hover:text-gold-600 hover:bg-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all shadow-sm hover:shadow"
                  >
                    Location de voiture {loc.cityName}
                  </Link>
                ))}
                <Link 
                  to="/" 
                  className="bg-gold-50 text-gold-700 hover:bg-gold-500 hover:text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all shadow-sm"
                >
                  Retour à l'Accueil
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationLandingPage;
