import { useState } from 'react';
import Head from 'next/head';

export default function Admin() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <Head><title>Admin Dashboard | The Flavour's Town</title></Head>
      <div className="max-w-xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-orange-500 tracking-tighter">ADMIN</h1>
          <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-sm">Control Center</p>
        </div>
        
        <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl border border-slate-800 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-inner ${isOpen ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {isOpen ? "✓" : "✕"}
          </div>
          <h2 className="text-2xl font-bold mb-2">Restaurant Status</h2>
          <p className="text-slate-400 mb-10">Toggle this to stop or start receiving orders from customers.</p>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full py-6 rounded-[30px] font-black text-2xl shadow-2xl transition-all active:scale-95 ${isOpen ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' : 'bg-green-600 hover:bg-green-500 shadow-green-900/20'}`}
          >
            {isOpen ? "CLOSE RESTAURANT" : "OPEN RESTAURANT"}
          </button>
        </div>
      </div>
    </div>
  );
}