import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import { Send, Calendar, MapPin, User, Car as CarIcon, Clock, Calculator, AlertCircle } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface BookingFormProps {
  cars: Car[];
  selectedCarId: string | null;
}

const DELIVERY_CITIES = [
  "Aéroport Casablanca",
  "Sur place Casablanca",
  "Tangier",
  "Marrakech",
  "Fes",
  "Agadir"
  
];

const BookingForm: React.FC<BookingFormProps> = ({ cars, selectedCarId }) => {
  // Helper to get date string YYYY-MM-DD
  const getToday = () => new Date().toISOString().split('T')[0];
  const getTomorrow = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carId: selectedCarId || '',
    pickupDate: getToday(),
    dropoffDate: getTomorrow(),
    delivery: ''
  });

  const [days, setDays] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Update form when prop changes
  useEffect(() => {
    if (selectedCarId) {
      setFormData(prev => ({ ...prev, carId: selectedCarId }));
      const element = document.getElementById('booking');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedCarId]);

  // Recalculate days and totals
  useEffect(() => {
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.dropoffDate);
    const selectedCar = cars.find(c => c.id === formData.carId);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setIsValid(false);
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Check if start date is in past (allow today)
    const startCheck = new Date(start);
    startCheck.setHours(0,0,0,0); // compare dates only
    
    if (startCheck < today) {
        setErrorMessage("La date de départ ne peut pas être dans le passé.");
        setIsValid(false);
        return;
    }

    if (end <= start) {
      setErrorMessage("La date de retour doit être après la date de départ.");
      setIsValid(false);
      setDays(0);
      setTotalPrice(0);
      return;
    }

    setErrorMessage('');
    setIsValid(true);

    // Calculate diff
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    setDays(diffDays);

    if (selectedCar) {
      const price = selectedCar.promoPrice && selectedCar.promoPrice < selectedCar.pricePerDay 
        ? selectedCar.promoPrice 
        : selectedCar.pricePerDay;
      setTotalPrice(diffDays * price);
    } else {
      setTotalPrice(0);
    }

  }, [formData.pickupDate, formData.dropoffDate, formData.carId, cars]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getSelectedCar = (): Car | undefined => {
    return cars.find(c => c.id === formData.carId);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    if (!formData.name) {
        setErrorMessage("Veuillez entrer votre nom.");
        return;
    }
    if (!formData.carId) {
        setErrorMessage("Veuillez sélectionner une voiture.");
        return;
    }
    if (!formData.delivery) {
        setErrorMessage("Veuillez sélectionner un lieu de livraison.");
        return;
    }

    const car = getSelectedCar();
    const carName = car ? `${car.make} ${car.model}` : 'Non Sélectionné';
    
    // Construct WhatsApp Message
    const message = `Bonjour, je suis ${formData.name}.
  
Je souhaite réserver une ${carName} pour ${days} jours.
  
Détails:
- Livraison: ${formData.delivery}
- Date de départ: ${formatDateDisplay(formData.pickupDate)}
- Date de retour: ${formatDateDisplay(formData.dropoffDate)}
- Prix total: ${totalPrice} MAD
  
Merci de me confirmer la disponibilité.`;
    
    // Encode and open
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/212616925572?text=${encodedMessage}`, '_blank');
  };

  const selectedCar = getSelectedCar();
  
  // Common Input Style - Compact on mobile
  const inputStyle = "w-full px-3 py-2.5 md:px-4 md:py-3.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-sm md:text-base";
  const labelStyle = "block text-xs md:text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5 md:gap-2";

  return (
    <section id="booking" className="py-12 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Left Side: Form */}
          <div className="lg:w-3/5 p-5 md:p-12 relative">
             <ScrollReveal animation="slide-left" duration={800} className="h-full">
                <h2 className="text-xl md:text-3xl font-serif font-bold text-gray-900 mb-2">Réservez Votre Véhicule</h2>
                <p className="text-gray-500 mb-6 md:mb-8 text-xs md:text-base">Remplissez le formulaire ci-dessous pour calculer votre devis.</p>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  
                  {/* Name */}
                  <div>
                    <label className={labelStyle}>
                      <User size={16} className="text-gold-500 md:w-[18px] md:h-[18px]"/> Nom Complet
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="Ex: Mohammed Alami"
                    />
                  </div>

                  {/* Car Selection */}
                  <div>
                    <label className={labelStyle}>
                      <CarIcon size={16} className="text-gold-500 md:w-[18px] md:h-[18px]"/> Véhicule Souhaité
                    </label>
                    <select
                      name="carId"
                      value={formData.carId}
                      onChange={handleChange}
                      className={inputStyle}
                      required
                    >
                      <option value="" disabled>-- Choisir une voiture --</option>
                      {cars.map(car => (
                        <option key={car.id} value={car.id}>
                            {car.make} {car.model} — {car.promoPrice || car.pricePerDay} MAD/jour
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery */}
                  <div>
                    <label className={labelStyle}>
                      <MapPin size={16} className="text-gold-500 md:w-[18px] md:h-[18px]"/> Livraison
                    </label>
                    <select
                      name="delivery"
                      value={formData.delivery}
                      onChange={handleChange}
                      className={inputStyle}
                      required
                    >
                      <option value="">-- Choisir une ville --</option>
                      {DELIVERY_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Dates - FORCED 2 COLUMNS ON MOBILE */}
                  <div className="grid grid-cols-2 gap-3 md:gap-6">
                    <div>
                      <label className={labelStyle}>
                        <Calendar size={16} className="text-gold-500 md:w-[18px] md:h-[18px]"/> Départ
                      </label>
                      <input
                        required
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>
                        <Calendar size={16} className="text-gold-500 md:w-[18px] md:h-[18px]"/> Retour
                      </label>
                      <input
                        required
                        type="date"
                        name="dropoffDate"
                        value={formData.dropoffDate}
                        onChange={handleChange}
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {!isValid && errorMessage && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-xs md:text-sm">
                          <AlertCircle size={16} />
                          {errorMessage}
                      </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isValid || !formData.carId || !formData.name || !formData.delivery}
                    className={`w-full font-bold py-3.5 md:py-4 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 mt-2 text-white text-sm md:text-base
                        ${(!isValid || !formData.carId || !formData.name || !formData.delivery) 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600 hover:shadow-green-500/30 hover:-translate-y-1'}`}
                  >
                    <Send size={18} />
                    Demander la Réservation via WhatsApp
                  </button>
                </form>
            </ScrollReveal>
          </div>

          {/* Right Side: Live Summary */}
          <div className="lg:w-2/5 bg-gray-900 p-0 text-white flex flex-col justify-between relative overflow-hidden">
             <ScrollReveal animation="slide-right" duration={800} delay={200} className="h-full w-full p-6 md:p-12 flex flex-col justify-between">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gold-500 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-gold-500 rounded-full opacity-10 blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <h3 className="text-lg md:text-2xl font-serif mb-4 md:mb-8 border-b border-gray-700 pb-4 flex items-center gap-3">
                        <Calculator className="text-gold-500 w-5 h-5 md:w-6 md:h-6" />
                        Résumé <span className="hidden md:inline">de la Réservation</span>
                    </h3>
                    
                    {/* On mobile, we hide the redundant details to save space */}
                    <div className="space-y-4 md:space-y-6">
                        {/* Client Name (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center gap-4 transition-all duration-300">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <User size={20} className="text-gold-400"/>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 uppercase tracking-wider">Client</span>
                                <span className="font-medium text-lg truncate block max-w-[200px]">
                                    {formData.name || 'Nom du client...'}
                                </span>
                            </div>
                        </div>

                        {/* Selected Car (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center gap-4 transition-all duration-300">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <CarIcon size={20} className="text-gold-400"/>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 uppercase tracking-wider">Véhicule</span>
                                <span className="font-medium text-lg">
                                    {selectedCar ? `${selectedCar.make} ${selectedCar.model}` : 'En attente...'}
                                </span>
                            </div>
                        </div>
                        
                        {/* Delivery (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center gap-4 transition-all duration-300">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <MapPin size={20} className="text-gold-400"/>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 uppercase tracking-wider">Livraison</span>
                                <span className="font-medium text-lg">
                                    {formData.delivery || 'En attente...'}
                                </span>
                            </div>
                        </div>

                        {/* Dates & Duration (Always Visible) */}
                        <div className="flex items-center gap-3 md:gap-4 transition-all duration-300">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <Clock size={16} className="text-gold-400 md:w-[18px] md:h-[18px]"/>
                            </div>
                            <div className="flex-1">
                                <span className="block text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Durée</span>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-sm md:text-base">
                                        {formatDateDisplay(formData.pickupDate)} → {formatDateDisplay(formData.dropoffDate)}
                                    </span>
                                    {days > 0 && (
                                        <span className="bg-gold-500/20 text-gold-400 text-[10px] md:text-xs px-2 py-1 rounded w-fit">
                                            {days} Jours
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-700 my-4 md:my-8" />

                    {/* Calculation */}
                    {selectedCar && days > 0 ? (
                        <div className="animate-fade-in">
                            <div className="flex justify-between text-gray-400 text-xs md:text-sm mb-1.5 md:mb-2">
                                <span>Prix journalier</span>
                                <span>{selectedCar.promoPrice || selectedCar.pricePerDay} MAD</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs md:text-sm mb-3 md:mb-4">
                                <span>Durée</span>
                                <span>x {days} jours</span>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-700 pt-3 md:pt-4">
                                <span className="font-bold text-white text-sm md:text-base">TOTAL ESTIMÉ</span>
                                <span className="text-2xl md:text-4xl font-black text-gold-500 leading-none">
                                    {totalPrice.toLocaleString()} <span className="text-sm md:text-lg text-gold-500/70 font-medium">MAD</span>
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-4 bg-white/5 rounded-lg border border-white/5 border-dashed text-sm md:text-base">
                            Complétez le formulaire
                        </div>
                    )}
                </div>

                {/* Footer Help */}
                <div className="mt-4 md:mt-8 z-10 text-[10px] md:text-xs text-gray-500 text-center">
                Paiement à la livraison. Annulation gratuite.
                </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;