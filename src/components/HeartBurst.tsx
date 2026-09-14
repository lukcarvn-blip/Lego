import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type HeartParticle = {
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

export const HeartBurst = () => {
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  useEffect(() => {
    const handleBurst = (e: any) => {
      const { x, y } = e.detail;
      const colors = ['#ef4444', '#f43f5e', '#ec4899', '#d946ef', '#ffb5a7', '#ff6b6b'];
      const newParticles: HeartParticle[] = [];
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

    window.addEventListener('heart-burst', handleBurst);
    return () => window.removeEventListener('heart-burst', handleBurst);
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
            <Heart size={p.size} fill={p.color} color={p.color} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
