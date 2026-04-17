import React from 'react';
import { motion } from 'motion/react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-bg-light z-[100] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="loader-ring mb-8" />
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-serif font-black text-accent-brown tracking-tighter"
        >
          SUPPLY AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-text-secondary uppercase tracking-[4px] mt-2"
        >
          Calibrating Network intelligence
        </motion.p>
      </motion.div>
      
      <div className="absolute bottom-12 left-0 w-full flex justify-center">
         <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-accent-brown"
              />
            ))}
         </div>
      </div>
    </div>
  );
};
