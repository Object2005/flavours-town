import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Component Imports
import Navbar from '../components/Navbar';
import MenuCard from '../components/MenuCard'; // Named MenuCard in your explorer
import CartDock from '../components/CartDock';
import OrderTracker from '../components/OrderTracker';

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (!saved) { window.location.href = '/auth'; } 
    else { setUser(JSON.parse(saved)); }
  }, []);

  if (!user) return <div className="h-screen flex items-center justify-center font-black text-orange-600 animate-pulse">ENTERING TOWN...</div>;

  return (
    <div className="min-h-screen bg-[#fcfbf7] pb-32">
      <Head><title>Flavours Town | {user.name}</title></Head>

      {/* Modern Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md p-5 border-b border-gray-100 z-[100] flex justify-between items-center">
        <div>
          <p className="text-[7px] font-black opacity-30 uppercase tracking-[0.3em]">Welcome back,</p>
          <h2 className="text-sm font-black italic text-orange-600 leading-none uppercase">{user.name.split(' ')[0]}</h2>
        </div>
        <div className="bg-black text-white px-3 py-1.5 rounded-xl text-center">
           <p className="text-[6px] font-bold opacity-50 uppercase tracking-widest">Member ID</p>
           <p className="text-[10px] font-black tracking-tighter">{user.townId}</p>
        </div>
      </header>

      {/* Tab Content */}
      <main className="pt-24 px-5 max-w-lg mx-auto">
        {activeTab === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
             <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-6">Fresh Flavours 🍔</h3>
             {/* Dummy Menu Placeholder */}
             <div className="grid grid-cols-1 gap-4 opacity-50 border-2 border-dashed border-gray-200 p-10 rounded-[2.5rem] text-center">
                <p className="font-bold text-[10px] uppercase tracking-widest">Menu Components Connection Pending...</p>
             </div>
          </motion.div>
        )}

        {activeTab === 'orders' && <OrderTracker user={user} />}
      </main>

      {/* Cart Dock Connection */}
      <CartDock cart={cart} user={user} />

      {/* Navigation (Zomato Style) */}
      <nav className="fixed bottom-0 w-full bg-white border-t p-6 flex justify-around items-center z-[200]">
        {[
          { id: 'home', icon: '🏠', label: 'Menu' },
          { id: 'orders', icon: '🥡', label: 'Orders' },
          { id: 'profile', icon: '👤', label: 'Profile' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex flex-col items-center transition-all ${activeTab === t.id ? 'opacity-100 scale-110' : 'opacity-20'}`}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-[8px] font-black uppercase mt-1 tracking-widest">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}