'use client';

import { useEffect } from 'react';

export function useGradientScroll() {
  useEffect(() => {
    const handleScroll = () => {
      const gradient = document.getElementById('heroGradient');
      if (gradient) {
        const scrollPercent = window.scrollY / (window.innerHeight * 0.3);
        gradient.style.opacity = Math.max(0, 1 - scrollPercent).toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
} 