import React from 'react';
import { motion } from 'motion/react';
import { Warehouse } from '../types';
import { MapPin, Boxes, DollarSign, ShieldCheck, ShoppingCart, Info } from 'lucide-react';

interface MarketplaceProps {
  warehouses: Warehouse[];
}

export const Marketplace: React.FC<MarketplaceProps> = ({ warehouses }) => {
  return (
    <div className="space-y-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={24} className="text-accent-brown" />
              <h1 className="text-4xl font-serif font-black text-accent-brown uppercase tracking-tight">Capacity Exchange</h1>
           </div>
           <p className="text-text-secondary font-serif italic text-lg opacity-80">
              Securing on-demand buffer nodes across the Chandigarh logistic mesh.
           </p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="text-[0.7rem] font-black text-text-secondary uppercase tracking-[3px] bg-accent-tan/5 px-4 py-2 border border-border-light rounded-full">
             {warehouses.filter(w => w.available).length} Partners Live
           </div>
           <p className="text-[0.6rem] text-text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
              <Info size={10} /> Certified Security Protocols Active
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {warehouses.map((wh, i) => (
          <motion.div 
            key={wh.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10, borderColor: '#5D4037' }}
            className={`panel p-8 bg-surface relative flex flex-col group ${!wh.available ? 'opacity-40 grayscale pointer-events-none' : 'cursor-pointer'}`}
          >
            <div className="flex justify-between items-start mb-8">
               <div className="space-y-1">
                  <h4 className="text-xl font-serif font-black text-accent-brown group-hover:tracking-wider transition-all">{wh.name}</h4>
                  <div className="flex items-center gap-1.5 text-[0.7rem] text-text-secondary font-bold uppercase tracking-wider">
                    <MapPin size={12} className="text-accent-tan" /> {wh.location}, {wh.city}
                  </div>
               </div>
               {wh.available && (
                 <motion.div 
                   animate={{ scale: [1, 1.2, 1] }} 
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="w-2.5 h-2.5 rounded-full bg-accent-brown shadow-[0_0_15px_var(--color-accent-brown)]" 
                 />
               )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-bg-light/50 border border-border-light rounded-2xl flex flex-col items-center">
                <Boxes size={18} className="text-accent-tan mb-2" />
                <p className="text-[0.6rem] uppercase font-bold text-text-secondary tracking-widest mb-1">Capacity</p>
                <p className="text-xl font-serif font-black text-accent-brown">{wh.capacity.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-bg-light/50 border border-border-light rounded-2xl flex flex-col items-center">
                <DollarSign size={18} className="text-accent-tan mb-2" />
                <p className="text-[0.6rem] uppercase font-bold text-text-secondary tracking-widest mb-1">Daily Rate</p>
                <p className="text-xl font-serif font-black text-accent-brown">${wh.price}</p>
              </div>
            </div>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              disabled={!wh.available}
              className={`w-full py-3.5 rounded-2xl font-black text-[0.75rem] uppercase tracking-[2px] transition-all flex items-center justify-center gap-3
                ${wh.available 
                  ? 'bg-accent-brown text-white shadow-lg shadow-accent-brown/20 hover:shadow-xl' 
                  : 'bg-border-light text-text-secondary'}`}
            >
              {wh.available ? (
                 <>
                   Instant Reserve <ShoppingCart size={16} />
                 </>
              ) : 'Capacity Locked'}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Partnership Program */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="panel p-12 bg-accent-brown text-white border-none flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative"
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-tan/20 rounded-full blur-3xl" />
        
        <div className="max-w-xl relative z-10 text-center md:text-left">
           <h3 className="text-3xl font-serif font-black mb-4 uppercase tracking-tighter">Certified Capacity Provider</h3>
           <p className="text-[0.9rem] opacity-70 leading-relaxed font-serif text-white/90">
             Monetize your idle storage space. Supply AI dynamically bridges local warehouse owners with global e-commerce demand surges in Chandigarh.
           </p>
        </div>
        <button className="relative z-10 px-10 py-4 bg-white text-accent-brown rounded-full font-black text-[0.75rem] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
           Register Facility
        </button>
      </motion.div>
    </div>
  );
};
