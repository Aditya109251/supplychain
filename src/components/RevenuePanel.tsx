import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Users, BarChart3, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';

export const RevenuePanel = () => {
  return (
    <div className="space-y-10 max-w-7xl mx-auto w-full">
      {/* Financial Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'SaaS ARR', value: '$1.48M', icon: Users, trend: '+12.4%', color: 'bg-blue-400/10 text-blue-600' },
          { label: 'Exchange Fees', value: '$242k', icon: Wallet, trend: '+34.2%', color: 'bg-accent-tan/10 text-accent-brown' },
          { label: 'Client Savings', value: '$840k', icon: BarChart3, trend: '+15.1%', color: 'bg-green-400/10 text-green-600' },
          { label: 'Market Cap', value: '$12.4B', icon: PieChart, trend: '+2.1%', color: 'bg-purple-400/10 text-purple-600' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="panel p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className="flex items-center gap-1 text-[0.65rem] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <ArrowUpRight size={10} /> {stat.trend}
              </div>
            </div>
            <p className="stat-label mb-1 opacity-60 tracking-[2px]">{stat.label}</p>
            <p className="text-3xl font-serif font-black text-accent-brown">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Dynamic Pricing Engine Card */}
        <div className="panel">
          <div className="panel-header py-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-brown/10 flex items-center justify-center text-accent-brown">
                   <TrendingUp size={20} />
                </div>
                <span className="panel-title text-base font-black">Algorithmic Pricing Matrix</span>
             </div>
          </div>
          <div className="p-8 space-y-4">
            {[
              { tier: 'Off-Peak Baseline', load: '< 60% Capacity', multiplier: '1.0x', price: '$4.20 / unit', desc: 'Standard logistics operations' },
              { tier: 'Strategic Reservoir', load: '60% - 85%', multiplier: '1.5x', price: '$6.30 / unit', desc: 'Accelerated processing active' },
              { tier: 'Peak Surge Protocol', load: '> 85%', multiplier: '2.8x', price: '$11.80 / unit', desc: 'Critical buffer locking engaged' },
            ].map((p, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-5 bg-bg-light/40 border border-border-light rounded-3xl group hover:border-accent-tan transition-all"
              >
                <div className="space-y-1">
                  <p className="text-[0.9rem] font-serif font-black text-accent-brown">{p.tier}</p>
                  <p className="text-[0.65rem] text-text-secondary uppercase font-bold tracking-wider">{p.load}</p>
                  <p className="text-[0.6rem] text-text-secondary italic opacity-60">{p.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-serif font-black text-accent-brown">{p.price}</p>
                  <p className="text-[0.6rem] font-black text-accent-tan uppercase tracking-widest">Multiplier: {p.multiplier}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Impact Visualizer */}
        <div className="panel p-10 bg-[#FAF7F2] flex flex-col justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-accent-tan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-accent-brown flex items-center justify-center shadow-xl shadow-accent-brown/20 text-white">
                    <BarChart3 size={24} />
                 </div>
                 <h3 className="text-2xl font-serif font-black text-accent-brown uppercase tracking-tight leading-none">Efficiency Impact</h3>
              </div>
              
              <div className="space-y-8">
                 <div>
                    <div className="flex justify-between items-end mb-3">
                       <p className="text-[0.7rem] font-black uppercase text-text-secondary tracking-widest">Supply Sustainability Score</p>
                       <p className="text-2xl font-serif font-black text-accent-brown">92%</p>
                    </div>
                    <div className="h-2 w-full bg-border-light rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: '92%' }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-accent-brown rounded-full"
                       />
                    </div>
                    <p className="text-[0.6rem] text-text-secondary mt-2 opacity-60 font-serif italic">Optimizing for resource longevity and reduced logistics waste.</p>
                 </div>

                 <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="space-y-1 p-4 bg-white rounded-2xl border border-border-light">
                       <p className="text-[0.6rem] font-bold text-text-secondary uppercase">Carbon Reduction</p>
                       <p className="text-xl font-serif font-black text-green-600">-12.4%</p>
                    </div>
                    <div className="space-y-1 p-4 bg-white rounded-2xl border border-border-light">
                       <p className="text-[0.6rem] font-bold text-text-secondary uppercase">Operational Delta</p>
                       <p className="text-xl font-serif font-black text-accent-brown">+28.5%</p>
                    </div>
                 </div>
              </div>

              <button className="cta-button mt-10 w-full group">
                 Export Financial Study <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
