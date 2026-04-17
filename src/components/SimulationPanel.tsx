import React from 'react';
import { motion } from 'motion/react';
import { Play, Square, Zap, Sliders, Info } from 'lucide-react';

interface SimulationPanelProps {
  isRunning: boolean;
  onToggle: () => void;
  intensity: number;
  onIntensityChange: (val: number) => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({ 
  isRunning, 
  onToggle, 
  intensity, 
  onIntensityChange 
}) => {
  return (
    <div className="glass-card p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={20} className="text-royal-gold" />
        <h3 className="text-lg font-serif font-medium uppercase tracking-widest text-royal-gold">System Controls</h3>
      </div>

      <div className="space-y-8">
        <button 
          onClick={onToggle}
          className={`w-full py-4 rounded-xl font-bold uppercase flex items-center justify-center gap-3 transition-all ${
            isRunning 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
          }`}
        >
          {isRunning ? (
            <><Square size={18} fill="currentColor" /> Stop Simulation</>
          ) : (
            <><Play size={18} fill="currentColor" /> Start Simulation</>
          )}
        </button>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-gray-400 uppercase font-bold tracking-tighter">
            <div className="flex items-center gap-1">
              <Sliders size={14} /> Surge Intensity
            </div>
            <span className="text-royal-gold">{Math.round(intensity * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={intensity}
            onChange={(e) => onIntensityChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-royal-gold"
          />
          <div className="flex justify-between text-[10px] text-gray-600 font-medium">
            <span>OFF-PEAK</span>
            <span>CRITICAL SURGE</span>
          </div>
        </div>

        <div className="p-4 bg-royal-gold/5 rounded-xl border border-royal-gold/10">
          <div className="flex items-center gap-2 text-royal-gold mb-2">
            <Info size={14} />
            <span className="text-[10px] font-bold uppercase italic">Logistics Note</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed italic">
            Increasing surge intensity will simulate black Friday level incoming traffic. 
            Hubs will prioritize processing based on AI-calculated distance and risk scores.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="py-2 text-[10px] font-bold uppercase rounded bg-white/5 border border-white/10 hover:border-royal-gold/30 transition-all">
            Reset Data
          </button>
          <button className="py-2 text-[10px] font-bold uppercase rounded bg-white/5 border border-white/10 hover:border-royal-gold/30 transition-all">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};
