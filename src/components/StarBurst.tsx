import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type StarParticle = {
  id: number;
  startX: number;
  startY: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  tx: number;
  ty: number;
  rotation: number;
};

export const StarBurst = () => {
  const [particles, setParticles] = useState<StarParticle[]>([]);

  useEffect(() => {
    const handleBurst = (e: any) => {
      const { x, y } = e.detail;
      const colors = ['#f59e0b', '#fbbf24', '#fcd34d', '#ffb84d'];
      const newParticles: StarParticle[] = [];
      const numHearts = 25; // More hearts for "khắp màn hình"

      for (let i = 0; i < numHearts; i++) {
        // Randomize burst direction (circle)
        const angle = Math.random() * Math.PI * 2;
        // Explode outward laterally
        const distance = 50 + Math.random() * 250;
        const tx = Math.cos(angle) * distance;
        
        // Fly up significantly
        const floatUp = 200 + Math.random() * (window.innerHeight * 0.7);
        // Combine explosion radius with float up
        const ty = (Math.sin(angle) * (distance * 0.5)) - floatUp;

        newParticles.push({
          id: Date.now() + i,
          startX: x - 20, // Center relative to cursor
          startY: y - 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 16 + Math.random() * 32, // 16 to 48px
          duration: 1.5 + Math.random() * 2, // 1.5s to 3.5s (float up slowly)
          delay: Math.random() * 0.2,
          tx,
          ty,
          rotation: -45 + Math.random() * 90 // random rotation twist
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);

      // cleanup old particles after max duration
      setTimeout(() => {
        setParticles((prev) => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 4000);
    };

    window.addEventListener('star-burst', handleBurst);
    return () => window.removeEventListener('star-burst', handleBurst);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              opacity: 1, 
              scale: 0.2, 
              x: p.startX, 
              y: p.startY,
              rotate: 0
            }}
            animate={{ 
              opacity: 0, 
              scale: 1, 
              x: p.startX + p.tx, 
              y: p.startY + p.ty,
              rotate: p.rotation
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: p.duration, 
              delay: p.delay,
              ease: [0.25, 1, 0.5, 1], // Decelerate smoothly
              opacity: {
                ease: 'circIn', // fade out at the very end
                duration: p.duration,
                delay: p.delay
              }
            }}
            style={{ position: 'absolute', transformOrigin: 'center center' }}
          >
            <div style={{ 
    width: p.size, height: p.size, 
    background: p.color, 
    borderRadius: '50%', 
    display: 'flex', alignItems: 'center', justifyContent: 'center' 
  }}>
    <Star size={p.size * 0.6} fill="#fff" color="#fff" />
  </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
