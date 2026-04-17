import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Lock, Mail, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (role: 'admin' | 'company', email: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'admin' | 'company'>('company');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin ? { email, password } : { email, password, role };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Authentication Failed');
      
      if (isLogin) {
        onLogin(data.user.role, data.user.email);
      } else {
        setIsLogin(true);
        setError('Node Registered. Establish connection to proceed.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-brown rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-tan rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-brown rounded-3xl shadow-2xl shadow-accent-brown/30 mb-6">
              <Package className="text-white" size={32} />
           </div>
           <h1 className="text-4xl font-serif font-black text-accent-brown tracking-tighter">SUPPLY AI</h1>
           <p className="text-text-secondary uppercase tracking-[3px] text-[0.7rem] font-bold mt-2">Intelligence for the Gridlock</p>
        </div>

        <div className="panel p-8 bg-surface shadow-2xl shadow-accent-brown/5 border-border-light">
           <div className="flex gap-2 p-1 bg-bg-light rounded-2xl mb-8 border border-border-light">
              <button 
                onClick={() => setRole('company')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.7rem] font-black uppercase tracking-widest transition-all
                  ${role === 'company' ? 'bg-accent-brown text-white shadow-lg' : 'text-text-secondary hover:text-accent-brown'}`}
              >
                <Building2 size={14} /> Partner
              </button>
              <button 
                onClick={() => setRole('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.7rem] font-black uppercase tracking-widest transition-all
                  ${role === 'admin' ? 'bg-accent-brown text-white shadow-lg' : 'text-text-secondary hover:text-accent-brown'}`}
              >
                <ShieldCheck size={14} /> Admin
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1">Email Terminal</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-tan" size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-bg-light border border-border-light rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-brown transition-all" 
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[0.65rem] font-black uppercase tracking-widest text-text-secondary ml-1">Secure Passkey</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-tan" size={18} />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-bg-light border border-border-light rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-brown transition-all" 
                    />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="cta-button w-full py-4 text-[0.8rem] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                 {loading ? 'Processing Node...' : (isLogin ? 'Establish Connection' : 'Register Node')} 
                 {!loading && <ArrowRight size={18} />}
              </button>
           </form>

           {(error || !isLogin) && (
             <div className={`mt-6 p-4 rounded-xl text-[0.65rem] font-bold uppercase tracking-widest text-center
               ${error?.includes('Registered') ? 'bg-risk-low/10 text-risk-low border border-risk-low/20' : 'bg-risk-high/10 text-risk-high border border-risk-high/20'}`}>
               {error || (!isLogin && "New node identity will be synced to Neon mesh.")}
             </div>
           )}

           <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[0.7rem] font-bold text-accent-tan uppercase tracking-widest hover:text-accent-brown transition-colors"
              >
                {isLogin ? "Request Network Access?" : "Already Authorized? Login"}
              </button>
           </div>
        </div>

        <p className="text-center mt-10 text-[0.6rem] text-text-secondary font-bold uppercase tracking-[2px] opacity-50 px-10">
           By connecting, you agree to the Supply AI Dynamic Pricing & Gridlock Liability Protocols.
        </p>
      </motion.div>
    </div>
  );
};
