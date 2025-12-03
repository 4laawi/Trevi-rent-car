import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in';
  duration?: number;
  delay?: number;
  offset?: number;
  className?: string;
  width?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  duration = 800,
  delay = 0,
  offset = 50, // pixels before element is considered visible
  className = '',
  width = 'w-full',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Use requestAnimationFrame to batch state updates
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect(); // Animate only once
            }
          });
        });
      },
      {
        root: null,
        rootMargin: `0px 0px -${offset}px 0px`, // Trigger slightly before the element hits the bottom
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [offset]);

  const getInitialStyle = () => {
    switch (animation) {
      case 'fade-up':
        return 'opacity-0 translate-y-10';
      case 'fade-in':
        return 'opacity-0';
      case 'slide-left':
        return 'opacity-0 -translate-x-10';
      case 'slide-right':
        return 'opacity-0 translate-x-10';
      case 'zoom-in':
        return 'opacity-0 scale-95';
      default:
        return 'opacity-0';
    }
  };

  const getVisibleStyle = () => {
    switch (animation) {
      case 'fade-up':
        return 'opacity-100 translate-y-0';
      case 'fade-in':
        return 'opacity-100';
      case 'slide-left':
        return 'opacity-100 translate-x-0';
      case 'slide-right':
        return 'opacity-100 translate-x-0';
      case 'zoom-in':
        return 'opacity-100 scale-100';
      default:
        return 'opacity-100';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-opacity transition-transform ease-out ${className} ${width} ${
        isVisible ? getVisibleStyle() : getInitialStyle()
      }`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;