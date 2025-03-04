'use client';

import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      
      // Don't do anything if scroll position is less than 10px
      if (currentScroll < 10) {
        setScrollDirection('up');
        return;
      }

      if (currentScroll > lastScroll) {
        // Scrolling down
        if (scrollDirection !== 'down') {
          setScrollDirection('down');
        }
      } else {
        // Scrolling up
        if (scrollDirection !== 'up') {
          setScrollDirection('up');
        }
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollDirection, lastScroll]);

  return scrollDirection;
} 