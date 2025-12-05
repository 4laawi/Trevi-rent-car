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
  const [isMobile, setIsMobile] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  
  // Fix Bug 1: Store callback in ref to avoid effect re-runs
  const onVideoLoadedRef = useRef(onVideoLoaded);
  
  useEffect(() => {
    onVideoLoadedRef.current = onVideoLoaded;
  }, [onVideoLoaded]);

  // Detect mobile device - use Pexels URL for mobile, local video for desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fix mobile viewport height issue - prevent hero from resizing on scroll
  useEffect(() => {
    if (!isMobile) return;

    // Lock viewport height to prevent resize on scroll (iOS Safari address bar issue)
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, [isMobile]);

  // Optimized loading: Show page immediately, don't wait for video
  useEffect(() => {
    // For mobile, show immediately since they use an image
    if (isMobile) {
      setIsVideoLoaded(true);
      if (onVideoLoadedRef.current) {
        onVideoLoadedRef.current();
      }
      return;
    }

    // For desktop: Show page immediately, video loads in background
    // Set a maximum wait time of 1.5 seconds, then show page anyway
    const maxWaitTimeout = setTimeout(() => {
      setIsVideoLoaded(true);
      if (onVideoLoadedRef.current) {
        onVideoLoadedRef.current();
      }
    }, 1500);

    const video = videoElementRef.current;
    if (!video) {
      clearTimeout(maxWaitTimeout);
      setIsVideoLoaded(true);
      if (onVideoLoadedRef.current) {
        onVideoLoadedRef.current();
      }
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;
    let hasCalledCallback = false;

    const handleVideoReady = () => {
      if (hasCalledCallback) return;
      hasCalledCallback = true;
      clearTimeout(maxWaitTimeout);
      
      // Set slightly slower playback speed for smooth effect (0.85 = 85% speed)
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
        video.playbackRate = 0.85;
      }
      
      // Mark video as ready to play (will fade in smoothly)
      setVideoReady(true);
      setIsVideoLoaded(true);
      if (onVideoLoadedRef.current) {
        onVideoLoadedRef.current();
      }
    };

    const handleVideoError = () => {
      if (hasCalledCallback) return;
      console.warn('Video failed to load, showing page anyway');
      clearTimeout(maxWaitTimeout);
      handleVideoReady();
    };

    // Force video to start loading immediately - don't wait
    const forceVideoLoad = () => {
      if (video && video.readyState === 0) {
        video.load(); // Force browser to start loading the video
      }
    };
    
    // Start loading video immediately (no delay)
    forceVideoLoad();

    // Check if video already has enough data to play
    if (video.readyState >= 2) { // HAVE_CURRENT_DATA (can start playing)
      handleVideoReady();
    } else {
      // Use 'loadeddata' instead of 'canplaythrough' for faster loading
      // 'loadeddata' fires when first frame is ready (much faster)
      video.addEventListener('loadeddata', handleVideoReady, { once: true });
      video.addEventListener('canplay', handleVideoReady, { once: true });
      video.addEventListener('error', handleVideoError, { once: true });
    }

    return () => {
      clearTimeout(maxWaitTimeout);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      video.removeEventListener('loadeddata', handleVideoReady);
      video.removeEventListener('canplay', handleVideoReady);
      video.removeEventListener('error', handleVideoError);
    };
  }, [isMobile]); // Include isMobile to re-run when mobile state changes

  useEffect(() => {
    // Completely disable parallax effects on mobile for better performance and to prevent scroll issues
    // Also disable on desktop to prevent any scroll-related jank
    if (isMobile) {
      // On mobile, ensure content stays visible and no transforms are applied
      if (contentRef.current) {
        contentRef.current.style.opacity = '1';
        contentRef.current.style.transform = 'none';
        contentRef.current.style.WebkitTransform = 'none';
      }
      return;
    }

    let ticking = false;
    let rafId: number | null = null;
    let lastScrollY = 0;
    const throttleDelay = 16; // ~60fps
    let lastUpdateTime = 0;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentTime = performance.now();

      // Throttle updates to prevent excessive calculations
      if (currentTime - lastUpdateTime < throttleDelay && Math.abs(scrollY - lastScrollY) < 5) {
        ticking = false;
        return;
      }

      lastScrollY = scrollY;
      lastUpdateTime = currentTime;

      // Only update content fade, remove video parallax for better performance
      if (scrollY <= windowHeight * 1.5) {
        if (contentRef.current) {
          // Only fade out content, no movement for smoother performance
          const opacity = 1 - Math.min(1, scrollY / (windowHeight * 0.5));
          contentRef.current.style.opacity = `${opacity}`;
          // Ensure no transforms are applied
          contentRef.current.style.transform = 'translateZ(0)';
          contentRef.current.style.WebkitTransform = 'translateZ(0)';
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
  }, [isMobile]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed navbar (approx 80px)
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      // Use instant scroll on mobile to prevent conflicts with momentum scrolling
      window.scrollTo({
        top: offsetPosition,
        behavior: isMobile ? 'auto' : 'smooth'
      });
    }
  };

  return (
    <section 
      id="home" 
      className={`relative w-full flex items-center justify-center overflow-hidden bg-black ${isMobile ? '' : 'min-h-[100dvh]'}`}
      style={isMobile ? { minHeight: 'calc(var(--vh, 1vh) * 100)' } : {}}
    >
      {/* Background Image/Video Overlay with Parallax Ref */}
      <div 
        ref={videoRef}
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          willChange: 'auto',
          transform: 'none', // Completely remove transforms on all devices to prevent scroll issues
          backfaceVisibility: 'hidden',
          WebkitTransform: 'none', // Prevent iOS scaling issues
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {isMobile ? (
          // Mobile: Use static image for faster loading - no transforms to prevent scaling issues
          <img 
            src="/Untitled design (1).webp"
            alt="Hero background"
            className="w-full h-full object-cover opacity-80"
            style={{ 
              backgroundColor: '#000000',
              pointerEvents: 'none',
              transform: 'none', // No transforms on mobile to prevent scaling issues
              willChange: 'auto',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              WebkitTransform: 'none', // Explicitly prevent iOS transforms
              objectFit: 'cover',
              objectPosition: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            loading="eager"
            decoding="async"
          />
        ) : (
          <>
            {/* Poster image - shows immediately while video loads */}
            <img 
              src="/Untitled design (1).webp"
              alt="Hero background"
              className="w-full h-full object-cover opacity-80 absolute inset-0"
              style={{ 
                backgroundColor: '#000000',
                pointerEvents: 'none',
                transform: 'none',
                backfaceVisibility: 'hidden',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 1,
                opacity: videoReady ? 0 : 0.8,
                transition: 'opacity 1s ease-in-out',
              }}
              loading="eager"
              decoding="async"
            />
            {/* Video - loads in background, fades in when ready */}
            <video 
              ref={videoElementRef}
              autoPlay 
              muted 
              loop 
              playsInline
              preload="auto"
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              className={`w-full h-full object-cover [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-panel]:hidden [&::-webkit-media-controls-play-button]:hidden [&::-webkit-media-controls-start-playback-button]:hidden transition-opacity duration-1000 ${videoReady ? 'opacity-80' : 'opacity-0'}`}
              style={{ 
                backgroundColor: '#000000',
                pointerEvents: 'none',
                WebkitPlaysinline: 'true',
                transform: 'none', // Remove transform to prevent zoom
                backfaceVisibility: 'hidden',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                minWidth: '100%',
                minHeight: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                zIndex: 2,
              }}
            onLoadedData={(e) => {
              // Force play when data is loaded
              const video = e.currentTarget;
              // Lock dimensions immediately to prevent zoom
              video.style.transform = 'none';
              video.style.scale = '1';
              video.style.width = '100%';
              video.style.height = '100%';
              video.style.minWidth = '100%';
              video.style.minHeight = '100%';
              video.style.maxWidth = '100%';
              video.style.maxHeight = '100%';
              video.style.objectFit = 'cover';
              video.style.objectPosition = 'center';
              
              // Start playing video
              if (video.paused) {
                video.play().catch(err => {
                  console.warn('Video autoplay failed:', err);
                });
              }
            }}
            onLoadedMetadata={(e) => {
              // Lock dimensions when metadata loads to prevent layout shift
              const video = e.currentTarget;
              video.style.transform = 'none';
              video.style.scale = '1';
              video.style.width = '100%';
              video.style.height = '100%';
              video.style.minWidth = '100%';
              video.style.minHeight = '100%';
              video.style.maxWidth = '100%';
              video.style.maxHeight = '100%';
              // Prevent any browser zoom/scale behavior
              video.style.objectFit = 'cover';
              video.style.objectPosition = 'center';
            }}
            onCanPlay={(e) => {
              // Ensure no zoom when video can play
              const video = e.currentTarget;
              video.style.transform = 'none';
              video.style.scale = '1';
            }}
            onError={(e) => {
              console.error('Video failed to load, falling back to poster image');
              // Keep poster image visible if video fails
              setVideoReady(false);
            }}
          >
            <source src="/hero_bg.mp4" type="video/mp4" />
          </video>
          </>
        )}
        {/* Dark overlay for text readability - above video/poster, below content */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
          style={{ zIndex: 3 }}
        ></div>
      </div>

      {/* Content with Parallax Ref */}
      <div 
        ref={contentRef}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16 md:mt-0 opacity-100"
        style={{
          willChange: isMobile ? 'auto' : 'opacity', // Only hint opacity changes on desktop
          transform: isMobile ? 'none' : 'translateZ(0)', // No transform on mobile to prevent scroll issues
          WebkitTransform: isMobile ? 'none' : 'translateZ(0)', // Prevent iOS transform issues
        }}
      >
        <h2 className="text-gold-400 font-medium tracking-[0.2em] text-xs md:text-sm lg:text-base mb-3 md:mb-4 uppercase animate-fade-in-up">
          Bienvenue chez Trevi Car Rental
        </h2>
        <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-serif font-bold mb-4 md:mb-6 leading-tight drop-shadow-lg">
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