import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Play, Terminal, Table as TableIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SqlEditor = () => {
  const [query, setQuery] = useState('SELECT * FROM users;');
  const [result, setResult] = useState<{ rows: any[], fields: string[], rowCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: query }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Execution failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end bg-bg-light/30 p-6 rounded-3xl border border-border-light backdrop-blur-sm">
         <div>
            <div className="flex items-center gap-3 mb-2">
               <Database className="text-accent-brown" size={24} />
               <h1 className="text-3xl font-serif font-black text-accent-brown uppercase tracking-tight">Neon Database Control</h1>
            </div>
            <p className="text-[0.7rem] font-bold text-text-secondary uppercase tracking-[3px]">Partner & Admin Logic Management Terminal</p>
         </div>
         <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full border text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2
              ${error ? 'bg-risk-high/10 border-risk-high/30 text-risk-high' : 'bg-risk-low/10 border-risk-low/30 text-risk-low'}`}>
               {error ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
               {error ? 'Protocol Error' : 'System Synced'}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1 overflow-hidden min-h-[500px]">
        {/* SQL Input Panel */}
        <div className="lg:col-span-2 panel flex flex-col bg-surface overflow-hidden">
           <div className="panel-header bg-accent-brown text-white border-none py-4">
              <div className="flex items-center gap-2">
                 <Terminal size={16} />
                 <span className="panel-title text-white">SQL Interface</span>
              </div>
              <button 
                onClick={handleExecute}
                disabled={loading}
                className="bg-white text-accent-brown px-4 py-1.5 rounded-full text-[0.6rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : <><Play size={10} fill="currentColor" /> Execute Query</>}
              </button>
           </div>
           <textarea 
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             className="flex-1 p-6 font-mono text-sm bg-bg-light/20 focus:outline-none resize-none text-accent-brown leading-relaxed"
             spellCheck={false}
           />
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3 panel flex flex-col bg-surface overflow-hidden border-dashed border-2">
           <div className="panel-header py-4">
              <div className="flex items-center gap-2">
                 <TableIcon size={16} className="text-accent-tan" />
                 <span className="panel-title">Output Stream</span>
              </div>
              {result && (
                <span className="text-[0.6rem] font-black text-text-secondary uppercase tracking-widest">
                  {result.rowCount} Rows Returned
                </span>
              )}
           </div>
           <div className="flex-1 overflow-auto scrolling-logs p-2">
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="m-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-mono text-xs leading-relaxed"
                >
                  <p className="font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <AlertCircle size={14} /> Database Exception
                  </p>
                  {error}
                </motion.div>
              )}

              {result ? (
                <div className="min-w-full inline-block align-middle">
                   <table className="min-w-full">
                      <thead className="bg-bg-light/50 sticky top-0">
                         <tr>
                            {result.fields.map((field, i) => (
                               <th key={i} className="px-6 py-3 text-left text-[0.65rem] font-black text-text-secondary uppercase tracking-widest border-b border-border-light">
                                  {field}
                               </th>
                            ))}
                         </tr>
                      </thead>
                      <tbody>
                         {result.rows.map((row, i) => (
                            <tr key={i} className="hover:bg-bg-light/30 transition-colors border-b border-border-light last:border-0">
                               {result.fields.map((field, j) => (
                                  <td key={j} className="px-6 py-4 text-[0.75rem] font-mono text-accent-brown whitespace-nowrap">
                                     {row[field]?.toString() || 'NULL'}
                                  </td>
                               ))}
                            </tr>
                         ))}
                      </tbody>
                   </table>
                   {result.rows.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <TableIcon size={48} className="mb-4 text-accent-tan" />
                        <p className="text-[0.7rem] font-black uppercase tracking-[3px]">Empty ResultSet</p>
                     </div>
                   )}
                </div>
              ) : !error && (
                <div className="flex flex-col items-center justify-center h-full opacity-20">
                   <div className="w-16 h-16 border-4 border-accent-tan/20 border-t-accent-tan rounded-full animate-spin mb-4" />
                   <p className="text-[0.7rem] font-black uppercase tracking-[4px]">Awaiting Instructions</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
