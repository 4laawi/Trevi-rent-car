import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import Fleet from './components/Fleet';
import BookingForm from './components/BookingForm';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Phone } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { Car, SupabaseCar } from './types';

// Public Home Page Component
const HomePage: React.FC = () => {
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  const handleCarSelection = (carId: string) => {
    setSelectedCarId(carId);
  };

  // Fix Bug 1: Memoize callback to prevent effect re-runs in Hero component
  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
        try {
          setIsLoading(true);
        const { data, error } = await supabase
          .from('cars')
          .select('*');

        if (error) throw error;

        if (data) {
          // Transform Supabase data to our Rich UI Car format
          const mappedCars: Car[] = (data as SupabaseCar[]).map((row, index) => {
             // Generate consistent UI visuals based on category/index
             let accentColor = '#2C7873'; // Default Teal
             let badgeIcon = 'Star';
             let badge = undefined;

             const catLower = row.category.toLowerCase();
             if (catLower.includes('suv') || catLower.includes('4x4')) {
               accentColor = '#E27D60'; // Orange
               badgeIcon = 'Fire';
             } else if (catLower.includes('luxe') || catLower.includes('luxury') || row.price_per_day > 600) {
               accentColor = '#E8B44A'; // Gold
               badgeIcon = 'Crown';
               badge = 'Luxe';
             } else if (catLower.includes('eco') || catLower.includes('citadine')) {
               accentColor = '#2C7873'; // Teal
               badgeIcon = 'Sparkles';
               if (row.price_per_day < 300) badge = 'Meilleur Prix';
             } else {
               accentColor = '#1A3C5A'; // Navy
               badgeIcon = 'Zap';
             }
             
             // Override badge if promo exists
             if (row.promo_price && row.promo_price < row.price_per_day) {
               badge = 'Promo';
               badgeIcon = 'Zap';
             }

             // Generate fake stats for UI if needed
             const rating = 4.5 + (index % 5) * 0.1;
             const reviewCount = 40 + (index * 12);
             const availableCount = row.is_available ? (3 + (index % 5)) : 0;

             return {
               id: row.id.toString(),
               make: row.brand,
               model: row.name,
               type: row.category,
               transmission: row.gearbox,
               fuel: row.fuel_type,
               pricePerDay: row.price_per_day,
               promoPrice: row.promo_price,
               features: ['Climatisation', 'Bluetooth', 'Sécurité ABS', 'GPS'], // Default features as they aren't in DB
               image: row.image_url,
               description: row.description || undefined,
               isAvailable: row.is_available,
               accentColor,
               rating,
               reviewCount,
               availableCount,
               badge,
               badgeIcon
             };
          });
          
          // Sort cars by priority: specific models first, then the rest
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
        setError('Impossible de charger les véhicules. Veuillez vérifier votre connexion.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Remove initial loader when React is ready (don't wait for video)
  useEffect(() => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      // Remove loader immediately when React hydrates
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 300);
    }
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* Show content immediately - video loads in background */}
      <Navbar />
      <Hero onVideoLoaded={handleVideoLoaded} />
      <WhyChooseUs />
      
      {isLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
            <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-bold">{error}</div>
      ) : (
        <>
            <Fleet cars={cars} onSelectCar={handleCarSelection} />
            <BookingForm cars={cars} selectedCarId={selectedCarId} />
        </>
      )}

      <Testimonials />
      <FAQ />
      <Footer />

      {/* Floating WhatsApp Action Button (Mobile/Desktop) */}
      <a 
        href="https://wa.me/212616925572"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 z-50 animate-bounce-slow"
        aria-label="Contacter sur WhatsApp"
      >
        <Phone size={24} />
      </a>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === 'admin@trevi.com') {
        setAuthenticated(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return authenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;