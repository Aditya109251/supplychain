import React from 'react';
import { motion } from 'motion/react';
import { Hub, SimulationLog } from '../types';
import { Network, Activity, List, ShieldAlert } from 'lucide-react';

interface LiveControlProps {
  hubs: Hub[];
  logs: SimulationLog[];
}

export const LiveControl: React.FC<LiveControlProps> = ({ hubs, logs }) => {
  return (
    <div className="flex flex-col h-full gap-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Network Mesh Map */}
        <div className="lg:col-span-2 panel relative overflow-hidden h-[500px] bg-[#FAF7F2]">
           <div className="panel-header absolute top-0 left-0 w-full z-10 bg-surface/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                 <Network size={16} className="text-accent-brown" />
                 <span className="panel-title">Chandigarh Logic Grid</span>
              </div>
           </div>
           
           {/* Decorative SVG Grid */}
           <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
              <defs>
                 <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3E2723" strokeWidth="1"/>
                 </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>

           {/* Nodes with Enhanced Animations */}
           <div className="absolute inset-0 pt-20 p-10">
             {hubs.map((hub, i) => {
               const pos = [
                 { top: '25%', left: '15%' },
                 { top: '40%', left: '65%' },
                 { top: '75%', left: '35%' },
               ][i] || { top: `${20 + i*15}%`, left: `${10 + i*20}%` };

               return (
                 <motion.div 
                   key={hub.id}
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ delay: i * 0.1, type: 'spring' }}
                   style={{ ...pos }}
                   className="absolute group"
                 >
                    <div className={`relative w-28 h-28 rounded-3xl border-2 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500 shadow-xl
                      ${hub.status === 'red' ? 'bg-risk-high/10 border-risk-high animate-float shadow-risk-high/10' : 
                        hub.status === 'yellow' ? 'bg-risk-med/10 border-risk-med shadow-risk-med/10' : 
                        'bg-surface/80 border-accent-tan shadow-accent-tan/10'}`}>
                      
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-inherit flex items-center justify-center text-[0.6rem] font-black">
                         {Math.round((hub.currentLoad / hub.capacity) * 100)}%
                      </div>

                      <span className="text-[0.65rem] font-bold tracking-tighter text-text-secondary mb-1">{hub.id}</span>
                      <span className="text-[0.7rem] font-black text-accent-brown uppercase text-center px-2 leading-none">{hub.name.split(' ')[0]}</span>
                      <Activity size={14} className={`mt-2 ${hub.status === 'red' ? 'text-risk-high' : 'text-accent-tan'}`} />
                    </div>
                    
                    {/* Ripple effect for Critical */}
                    {hub.status === 'red' && (
                       <div className="absolute inset-0 rounded-3xl border-4 border-risk-high animate-ping opacity-20 pointer-events-none" />
                    )}
                 </motion.div>
               );
             })}

             {/* Dynamic Connection Lines (Static for Demo) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <motion.line x1="25%" y1="35%" x2="65%" y2="50%" stroke="var(--color-accent-tan)" strokeWidth="2" strokeDasharray="5 5" animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
                <motion.line x1="65%" y1="50%" x2="45%" y2="85%" stroke="var(--color-accent-tan)" strokeWidth="2" strokeDasharray="5 5" animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
                <motion.line x1="45%" y1="85%" x2="25%" y2="35%" stroke="var(--color-accent-tan)" strokeWidth="2" strokeDasharray="5 5" animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
             </svg>
           </div>
        </div>

        {/* Action Panel */}
        <div className="panel flex flex-col h-[500px]">
          <div className="panel-header">
            <span className="panel-title">Asset Orchestration</span>
          </div>
          <div className="p-6 space-y-4 flex-1 overflow-y-auto scrolling-logs">
            {hubs.map(hub => (
              <motion.div 
                key={hub.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="p-4 bg-bg-light/40 border border-border-light rounded-2xl group hover:border-accent-tan transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[0.85rem] font-serif font-black text-accent-brown">{hub.name}</h4>
                  <span className={`text-[0.6rem] px-2 py-1 rounded-full font-black uppercase ${
                    hub.status === 'red' ? 'bg-risk-high text-white' : 
                    hub.status === 'yellow' ? 'bg-risk-med/10 text-risk-med' : 'bg-risk-low/10 text-risk-low'
                  }`}>
                    {hub.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                   <div className="flex justify-between text-[0.7rem] font-bold text-text-secondary uppercase tracking-tight">
                      <span>Flow Rate</span>
                      <span className="text-accent-brown">{(hub.incomingRate / hub.processingRate).toFixed(2)}x</span>
                   </div>
                   <div className="h-1 bg-border-light rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (hub.currentLoad / hub.capacity) * 100)}%` }}
                        className={`h-full ${hub.status === 'red' ? 'bg-risk-high' : 'bg-accent-tan'}`}
                      />
                   </div>
                </div>

                {hub.status === 'red' && (
                  <button className="w-full mt-4 py-2 bg-accent-brown text-white text-[0.65rem] font-black rounded-full uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                    Trigger Reroute <ShieldAlert size={12} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Synchronized Operations Log */}
      <div className="panel h-56 flex flex-col">
        <div className="panel-header">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-tan/10 flex items-center justify-center text-accent-brown">
                 <List size={16} />
              </div>
              <span className="panel-title">Network Telemetry</span>
           </div>
           <span className="text-[0.7rem] font-bold text-text-secondary opacity-50 uppercase tracking-[2px]">Encrypted Stream Active</span>
        </div>
        <div className="flex-1 p-6 overflow-y-auto scrolling-logs space-y-4 font-mono">
           {logs.map((log, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex gap-6 text-[0.75rem] items-start border-l-2 border-border-light pl-6 group"
             >
                <span className="text-text-secondary opacity-40 shrink-0 font-bold group-hover:opacity-100 transition-opacity">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={`${
                  log.type === 'error' ? 'text-risk-high font-black uppercase tracking-tighter' : 
                  log.type === 'warning' ? 'text-risk-med font-bold' : 'text-text-secondary'
                }`}>
                  {log.message}
                </span>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};
