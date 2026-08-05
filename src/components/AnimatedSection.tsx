import React, { useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right';
  delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 120px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getInitialClass = () => {
    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return 'opacity-0 translate-y-10 scale-[0.985]';
        case 'fade-in':
          return 'opacity-0';
        case 'scale-up':
          return 'opacity-0 scale-95';
        case 'slide-left':
          return 'opacity-0 -translate-x-10';
        case 'slide-right':
          return 'opacity-0 translate-x-10';
        default:
          return 'opacity-0 translate-y-10 scale-[0.985]';
      }
    }

    return 'opacity-100 translate-y-0 translate-x-0 scale-100';
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }}
      className={`transition-all duration-850 transform will-change-transform ${getInitialClass()} ${className}`}
    >
      {children}
    </div>
  );
};
