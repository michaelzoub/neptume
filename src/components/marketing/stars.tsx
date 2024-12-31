import { useEffect, useState } from 'react';
import { stars } from '../../interfaces/Stars';

const StarBackground = () => {
  const [stars, setStars] = useState<stars[]>([]);
  
  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 0.07 + 0.03,
          opacity: Math.random() * 0.8 + 0.5,
          speed: Math.random() * 0.01 + 0.05
        });
      }
      return newStars;
    };
    
    setStars(generateStars());
  }, []);
  
  useEffect(() => {
    const animateStars = () => {
      setStars((prevStars) => 
        prevStars.map(star => ({
          ...star,
          x: star.x + star.speed,
          ...(star.x > 100 && { x: 0 })
        }))
      );
    };
    
    const intervalId = setInterval(animateStars, 50);
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="z-[-0] w-full h-screen bg- fixed overflow-hidden opacity-100"
    style={{ pointerEvents: 'none' }}
    >
      <svg 
        className="w-full h-full absolute top-0 left-0 z-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {stars.map(star => (
          <circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill="white"
            opacity={star.opacity}
            className="shadow shadow-white"
          />
        ))}
      </svg>
    </div>
  );
};

export default StarBackground;