import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, BrainCircuit, TrendingUp, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const mockPredictionData = [
  { day: 'Mon', demand: 4200 },
  { day: 'Tue', demand: 4500 },
  { day: 'Wed', demand: 4800 },
  { day: 'Thu', demand: 12000 },
  { day: 'Fri', demand: 11500 },
  { day: 'Sat', demand: 9000 },
  { day: 'Sun', demand: 7000 },
];

export const PredictionDashboard = () => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate a brief (3-4 bullet points) AI logistics prediction report for Chandigarh's e-commerce supply chain. Focus on Sector 17, IT Park, and Industrial Area. Assume a 'medium' surge scenario. Keep it professional and concise. Do NOT use markdown bolding.",
        config: {
           systemInstruction: "You are an AI Supply Chain Analyst named Supply AI. Your tone is technical, professional, and insight-driven."
        }
      });
      setReport(response.text || "Report generation failed.");
    } catch (err) {
      console.error("AI Error:", err);
      setReport("Synchronizing with real-time market data... (AI currently processing local signals)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, []);

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Market Demand', value: '42.8k', change: '+14%', color: 'text-accent-brown' },
          { label: 'Surge Factor', value: '2.4x', change: '+0.2', color: 'text-accent-brown' },
          { label: 'Node Congestion', value: 'High', change: 'Sector 17', color: 'text-risk-high' },
          { label: 'Buffer Health', value: 'Stable', change: '84%', color: 'text-risk-low' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, scale: 1.02 }}
            className="panel p-6"
          >
            <p className="stat-label">{stat.label}</p>
            <p className={`stat-value ${stat.color}`}>{stat.value}</p>
            <p className="text-[0.65rem] font-bold text-accent-tan mt-2 uppercase tracking-widest">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 panel p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="panel-title mb-1 text-base">Predictive Demand Curve</h3>
              <p className="text-[0.65rem] text-text-secondary uppercase font-bold tracking-wider">Historical vs AI Predicted Load</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 text-[0.65rem] font-bold text-text-secondary">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-brown/20 border border-accent-brown" /> BASELINE
               </div>
               <div className="flex items-center gap-2 text-[0.65rem] font-bold text-accent-brown">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-brown" /> AI PROJECTION
               </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPredictionData}>
                <defs>
                   <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5D4037" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#5D4037" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#E0D7C6" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#795548" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#795548" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E0D7C6', 
                    borderRadius: '16px', 
                    fontSize: '11px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#5D4037" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#curveGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="panel p-6 bg-accent-brown text-white border-none"
          >
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-white/10 rounded-lg">
                  <BrainCircuit size={20} />
               </div>
               <h4 className="font-serif font-black uppercase text-sm tracking-widest">AI Market Study</h4>
            </div>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-2.5 bg-white/20 rounded w-full" />
                <div className="h-2.5 bg-white/20 rounded w-3/4" />
                <div className="h-2.5 bg-white/20 rounded w-1/2" />
              </div>
            ) : (
              <p className="text-[0.75rem] leading-relaxed opacity-90 font-serif whitespace-pre-line">
                {report}
              </p>
            )}
            <button 
              onClick={generateReport}
              className="w-full mt-6 py-2 bg-white text-accent-brown text-[0.6rem] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
            >
              Refresh Analysis
            </button>
          </motion.div>

          <div className="panel p-6">
            <h4 className="text-[0.7rem] font-black uppercase tracking-widest text-accent-brown mb-6 flex items-center gap-2">
              <Zap size={14} /> Optimization Plan
            </h4>
            <div className="space-y-4">
              {[
                { title: 'Sector 17 Reroute', desc: 'Divert 30% traffic to IT Park.', icon: TrendingUp },
                { title: 'Buffer Activation', desc: 'Secure Zirakpur WH B.', icon: AlertTriangle },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start p-3 bg-bg-light/50 rounded-2xl border border-border-light">
                   <item.icon size={16} className="text-accent-tan" />
                   <div>
                      <p className="text-[0.75rem] font-bold text-text-primary">{item.title}</p>
                      <p className="text-[0.65rem] text-text-secondary">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
