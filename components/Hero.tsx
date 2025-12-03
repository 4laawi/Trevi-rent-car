import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onVideoLoaded?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onVideoLoaded }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoElementRef.current;
    if (!video) return;

    const handleVideoLoaded = () => {
      setIsVideoLoaded(true);
      if (onVideoLoaded) {
        onVideoLoaded();
      }
    };

    const handleVideoError = () => {
      // If video fails to load, still show the page after a short delay
      console.warn('Video failed to load, showing page anyway');
      setTimeout(() => {
        handleVideoLoaded();
      }, 2000); // Wait 2 seconds then show page even if video didn't load
    };

    // Check if video is already loaded
    if (video.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
      handleVideoLoaded();
    } else {
      video.addEventListener('canplaythrough', handleVideoLoaded, { once: true });
      video.addEventListener('loadeddata', handleVideoLoaded, { once: true });
      video.addEventListener('error', handleVideoError, { once: true });
    }

    return () => {
      video.removeEventListener('canplaythrough', handleVideoLoaded);
      video.removeEventListener('loadeddata', handleVideoLoaded);
      video.removeEventListener('error', handleVideoError);
    };
  }, [onVideoLoaded]);

  useEffect(() => {
    let ticking = false;
    let rafId: number | null = null;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Only update content fade, remove video parallax for better performance
      // Video parallax causes lag because video elements are expensive to transform
      if (scrollY <= windowHeight * 1.5) {
        if (contentRef.current) {
          // Only fade out content, no movement for smoother performance
          const opacity = 1 - Math.min(1, scrollY / (windowHeight * 0.5));
          contentRef.current.style.opacity = `${opacity}`;
        }
      } else {
        // Reset when hero is out of view
        if (contentRef.current) {
          contentRef.current.style.opacity = '0';
        }
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call to set initial state
    updateParallax();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed navbar (approx 80px)
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video Overlay with Parallax Ref */}
      <div 
        ref={videoRef}
        className="absolute inset-0 z-0"
      >
        <video 
          ref={videoElementRef}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-80"
          style={{ 
            backgroundColor: '#000000',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform'
          }}
        >
            <source src="https://www.pexels.com/download/video/18984288/" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>

      {/* Content with Parallax Ref */}
      <div 
        ref={contentRef}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16 md:mt-0 opacity-100"
      >
        <h2 className="text-gold-400 font-medium tracking-[0.2em] text-xs md:text-sm lg:text-base mb-3 md:mb-4 uppercase animate-fade-in-up">
          Bienvenue chez Trevi Car Rental
        </h2>
        <h1 className="text-3xl md:text-6xl lg:text-7xl text-white font-serif font-bold mb-4 md:mb-6 leading-tight drop-shadow-lg">
          Découvrez le Maroc <br />
          <span className="italic text-gold-500">Avec Confort et Confiance</span>
        </h1>
        <p className="text-gray-200 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed px-2">
          Flotte de véhicules neufs, tarifs transparents et service client disponible 24/7. 
          À Casablanca et ses environs, louez en toute sérénité.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
          <a 
            href="#booking"
            onClick={(e) => scrollToSection(e, 'booking')}
            className="w-full sm:w-auto bg-gold-600 hover:bg-gold-700 text-white px-8 py-3.5 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-gold-500/30 min-w-[200px] cursor-pointer"
          >
            Réserver
          </a>
          <a 
            href="#fleet"
            onClick={(e) => scrollToSection(e, 'fleet')}
            className="w-full sm:w-auto bg-transparent border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3.5 rounded-full text-lg font-medium transition-all min-w-[200px] cursor-pointer"
          >
            Voir la Flotte
          </a>
        </div>
      </div>

      {/* Scroll Indicator - Fades out naturally with contentRef logic, but we can give it distinct behavior if needed */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce hidden sm:block">
        <a 
          href="#fleet" 
          onClick={(e) => scrollToSection(e, 'fleet')}
          className="text-white opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronDown size={32} />
        </a>
      </div>
    </section>
  );
};

export default Hero;