import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Search, 
  Map as MapIcon, 
  BarChart3, 
  Package, 
  ChevronRight,
  LayoutDashboard,
  BrainCircuit,
  Settings,
  Bell,
  Zap,
  Database
} from 'lucide-react';
import { Hub, Warehouse, SimulationLog, SimulationState } from './types';
import { PredictionDashboard } from './components/PredictionDashboard';
import { LiveControl } from './components/LiveControl';
import { Marketplace } from './components/Marketplace';
import { RevenuePanel } from './components/RevenuePanel';
import { LoadingScreen } from './components/LoadingScreen';
import { Auth } from './components/Auth';
import { SqlEditor } from './components/SqlEditor';

type UserRole = 'admin' | 'company';

interface User {
  role: UserRole;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [state, setState] = useState<SimulationState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/state');
      if (!response.ok) throw new Error('Terminal Connection Refused');
      const data = await response.json();
      setState(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching state:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (loading) return <LoadingScreen />;

  if (error && !state) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-light p-10">
        <div className="panel p-10 max-w-md text-center">
          <div className="w-16 h-16 bg-risk-high/10 rounded-full flex items-center justify-center mx-auto mb-6 text-risk-high">
            <Zap size={32} />
          </div>
          <h2 className="text-2xl font-serif font-black text-accent-brown mb-4 uppercase">Direct Link Severed</h2>
          <p className="text-text-secondary mb-8 opacity-70">Supply AI could not establish a secure handshake with the CHD Mesh. Please verify terminal access.</p>
          <button 
            onClick={() => { setLoading(true); fetchData(); }}
            className="cta-button w-full py-4 text-[0.8rem]"
          >
            Re-Establish Connection
          </button>
        </div>
      </div>
    );
  }

  if (!state) return <LoadingScreen />;

  if (!user) {
    return <Auth onLogin={(role, email) => {
      setUser({ role, email });
      setActiveTab('overview');
    }} />;
  }

  const criticalHubs = state.hubs.filter(h => h.status === 'red');

  const adminNav = [
    { id: 'overview', label: 'Monitor Grid', icon: MapIcon },
    { id: 'economics', label: 'Flow Revenue', icon: BarChart3 },
    { id: 'sim', label: 'Circuit Breaker', icon: LayoutDashboard },
    { id: 'db', label: 'Digital Ledger', icon: Database },
  ];

  const companyNav = [
    { id: 'overview', label: 'Market Forecast', icon: BrainCircuit },
    { id: 'marketplace', label: 'Book Capacity', icon: Building2 },
    { id: 'history', label: 'Supply Ledger', icon: Package },
  ];

  const currentNav = user.role === 'admin' ? adminNav : companyNav;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light">
      {/* Sidebar - Clean & Elegant */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'circOut' }}
        className="w-72 bg-surface border-r border-border-light flex flex-col z-20 shadow-2xl shadow-accent-brown/5"
      >
        <div className="p-8">
           <div className="flex items-center gap-3 mb-12">
              <div className="w-11 h-11 bg-accent-brown rounded-2xl flex items-center justify-center shadow-2xl shadow-accent-brown/30">
                 <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-black text-accent-brown tracking-tighter leading-none">SUPPLY AI</h1>
                <p className="text-[0.55rem] uppercase tracking-[3px] text-accent-tan font-bold mt-1">Intelligence Layer</p>
              </div>
           </div>

           <nav className="space-y-2">
             {currentNav.map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id as any)}
                 className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all relative group overflow-hidden
                   ${activeTab === item.id 
                     ? 'text-white' 
                     : 'text-text-secondary hover:text-accent-brown'}`}
               >
                 <item.icon size={18} className="relative z-10" strokeWidth={activeTab === item.id ? 2.5 : 2} />
                 <span className="text-[0.75rem] font-bold uppercase tracking-[1.5px] relative z-10">{item.label}</span>
                 
                 {activeTab === item.id && (
                   <motion.div 
                     layoutId="sidebar-active"
                     className="absolute inset-0 bg-accent-brown -z-0"
                     transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                   />
                 )}
               </button>
             ))}
           </nav>
        </div>

        <div className="mt-auto p-8 bg-bg-light/30 border-t border-border-light">
           <div className="stat-row p-0 border-none mb-6">
              <div className="flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full animate-pulse ${user.role === 'admin' ? 'bg-risk-high' : 'bg-risk-low'}`} />
                 <span className="text-[0.6rem] uppercase font-black text-text-secondary tracking-[2px]">
                   {user.role === 'admin' ? 'Operator: Authorized' : 'Partner: Synchronized'}
                 </span>
              </div>
           </div>
           <button 
             onClick={() => setUser(null)}
             className="secondary-button w-full py-2.5 text-[0.65rem]"
           >
              Log Out System
           </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-24 px-10 flex items-center justify-between bg-surface/40 backdrop-blur-xl z-20 border-b border-border-light">
           <div className="flex items-center gap-6">
              <div className="flex flex-col">
                 <div className="flex items-center gap-2 text-[0.6rem] font-black text-accent-tan uppercase tracking-[3px] mb-1">
                    <MapIcon size={12} /> {user.role === 'admin' ? 'Administrative Hub' : 'Partner Terminal'}: Chandigarh
                 </div>
                 <h2 className="text-2xl font-serif font-black text-accent-brown tracking-tight uppercase">
                    {currentNav.find(n => n.id === activeTab)?.label}
                 </h2>
              </div>
           </div>

           <div className="flex items-center gap-8">
              <div className="relative group hidden xl:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-brown transition-colors" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search Fleet & Buffers..." 
                   className="bg-bg-light border border-border-light rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-accent-brown w-72 transition-all shadow-inner"
                 />
              </div>
              <div className="flex items-center gap-4">
                 <button className="relative w-12 h-12 border border-border-light rounded-2xl flex items-center justify-center hover:bg-surface transition-all group">
                    <Bell size={20} className="text-text-secondary group-hover:text-accent-brown transition-colors" />
                    {criticalHubs.length > 0 && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-risk-high rounded-full border-4 border-surface" />}
                 </button>
                 <div className="flex items-center gap-3 pl-8 border-l border-border-light">
                    <div className="text-right">
                       <p className="text-[0.7rem] font-black uppercase text-accent-brown tracking-tighter">Director 102</p>
                       <p className="text-[0.6rem] text-text-secondary font-bold">Admin Privileges</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-accent-tan/10 border border-accent-tan/20 flex items-center justify-center text-accent-brown font-black shadow-inner">
                       CH
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* Dynamic View Container */}
        <div className="flex-1 overflow-y-auto p-12 scrolling-logs bg-bg-light/20 relative">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab + user.role}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className="h-full"
             >
               {user.role === 'admin' ? (
                 <>
                   {activeTab === 'overview' && <LiveControl hubs={state.hubs} logs={state.logs} />}
                   {activeTab === 'economics' && <RevenuePanel />}
                   {activeTab === 'db' && <SqlEditor />}
                   {activeTab === 'sim' && (
                      <div className="max-w-4xl mx-auto space-y-10">
                        <div className="panel p-10 bg-accent-brown text-white border-none">
                           <h3 className="text-3xl font-serif font-black mb-4 uppercase tracking-tighter">Emergency Circuit Breaker</h3>
                           <p className="text-lg opacity-70 mb-8 font-serif leading-relaxed">
                             In the event of a total network gridlock, trigger the hold logic to pause all incoming truck queues and activate overflow partners across the CHD mesh.
                           </p>
                           <button className="px-10 py-5 bg-risk-high text-white rounded-full font-black text-[0.8rem] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                              Activate Emergency Pause
                           </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="panel p-8">
                              <h4 className="stat-label mb-4">Network Pressure</h4>
                              <p className="text-4xl font-serif font-black text-accent-brown">Extreme</p>
                              <div className="mt-6 h-2 bg-border-light rounded-full overflow-hidden">
                                 <motion.div 
                                    animate={{ width: `${Math.round(state.surgeIntensity * 100)}%` }}
                                    className="h-full bg-risk-high" 
                                 />
                              </div>
                           </div>
                           <div className="panel p-8">
                              <h4 className="stat-label mb-4">Active Reroutes</h4>
                              <p className="text-4xl font-serif font-black text-accent-brown">142</p>
                              <p className="text-[0.65rem] font-bold text-accent-tan uppercase mt-4">+12 from last cycle</p>
                           </div>
                        </div>
                      </div>
                   )}
                 </>
               ) : (
                 <>
                   {activeTab === 'overview' && <PredictionDashboard />}
                   {activeTab === 'marketplace' && <Marketplace warehouses={state.warehouses} />}
                   {activeTab === 'history' && (
                      <div className="max-w-5xl mx-auto space-y-8">
                         <div className="flex justify-between items-end mb-8">
                            <h2 className="text-4xl font-serif font-black text-accent-brown uppercase tracking-tight">Supply Ledger</h2>
                            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-accent-tan bg-accent-tan/5 px-4 py-2 border border-border-light rounded-full">3 Active Bookings</p>
                         </div>
                         <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                               <motion.div 
                                 key={i}
                                 whileHover={{ x: 5 }}
                                 className="panel p-8 flex justify-between items-center group cursor-pointer"
                               >
                                  <div className="flex gap-6 items-center">
                                     <div className="w-14 h-14 rounded-2xl bg-bg-light border border-border-light flex items-center justify-center text-accent-brown">
                                        <Package size={24} />
                                     </div>
                                     <div>
                                        <p className="text-[0.65rem] font-black text-text-secondary uppercase tracking-[3px] mb-1">TRK-CHD-{4000 + i}</p>
                                        <h4 className="text-xl font-serif font-black text-accent-brown">Zirakpur Buffer A - Slot {i}</h4>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-xs font-bold text-accent-tan uppercase tracking-widest mb-1">Guaranteed Delivery</p>
                                     <p className="text-[0.6rem] text-text-secondary font-black uppercase opacity-40">Status: In Transit</p>
                                  </div>
                               </motion.div>
                            ))}
                         </div>
                      </div>
                   )}
                 </>
               )}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Global Controls Footer - Minimal */}
        <footer className="h-24 bg-surface border-t border-border-light px-12 flex items-center gap-16 shrink-0 z-20">
           <div className="flex items-center gap-6 border-r border-border-light pr-12">
              <div className="flex flex-col gap-1">
                 <p className="text-[0.6rem] font-black text-text-secondary uppercase tracking-[3px]">System Status</p>
                 <button 
                  disabled={user.role !== 'admin'}
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/simulation/toggle', { method: 'POST' });
                      const d = await res.json();
                      fetchData();
                    } catch(e) {}
                  }}
                  className={`flex items-center gap-3 px-8 py-2.5 rounded-full font-black text-[0.7rem] uppercase tracking-widest transition-all
                    ${state.isRunning 
                      ? 'bg-risk-high text-white shadow-xl shadow-risk-high/30' 
                      : 'bg-accent-brown text-white shadow-xl shadow-accent-brown/30'}
                    ${user.role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-white" />
                  {state.isRunning ? 'Cease Analytics' : 'Establish Feed'}
                </button>
              </div>
           </div>

           <div className="flex-1 flex items-center gap-12">
             <div className="flex flex-col gap-2 min-w-[300px]">
                <div className="flex justify-between items-center text-[0.65rem] font-black uppercase tracking-[3px] text-text-secondary">
                   <span>Projected Market Surge</span>
                   <span className={state.surgeIntensity > 0.8 ? 'text-risk-high' : 'text-accent-brown'}>{Math.round(state.surgeIntensity * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  disabled={user.role !== 'admin'}
                  value={state.surgeIntensity}
                  onChange={async (e) => {
                    const intensity = parseFloat(e.target.value);
                    try {
                      await fetch('/api/simulation/surge', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ intensity })
                      });
                      fetchData();
                    } catch(e) {}
                  }}
                  className={`slider ${user.role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
             </div>
             
             {state.isRunning && state.surgeIntensity > 0.7 && (
               <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-5 py-2 bg-risk-high/10 border border-risk-high/20 rounded-full flex items-center gap-3"
               >
                  <Zap size={14} className="text-risk-high animate-pulse" />
                  <span className="text-[0.6rem] font-black uppercase tracking-[3px] text-risk-high">High Load Protocol Active</span>
               </motion.div>
             )}

             <div className="ml-auto hidden xl:flex items-center gap-3 text-text-secondary">
                <span className="text-[0.6rem] font-black uppercase tracking-[2px]">Mesh Sync: 4ms</span>
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => <div key={i} className="w-9 h-9 rounded-xl border-4 border-surface bg-accent-tan/20 flex items-center justify-center text-[0.6rem] font-black">N{i}</div>)}
                </div>
             </div>
           </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
