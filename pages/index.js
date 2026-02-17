import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from '../components/Navbar';
import MenuGrid from '../components/MenuGrid';
import CartDock from '../components/CartDock';
import OrderTracker from '../components/OrderTracker';

export default function Home() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('home'); // home, orders, profile
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('ft_user');
    if (!savedUser) {
      window.location.href = '/auth';
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) return <div className="h-screen flex items-center justify-center font-black italic animate-pulse text-orange-600">ENTERING THE TOWN...</div>;

  return (
    <div className="min-h-screen bg-[#fcfbf7] pb-32">
      <Head><title>Flavours Town | Welcome {user.name}</title></Head>

      {/* 1. Professional Header */}
      <header className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md p-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-[8px] font-black uppercase opacity-30 tracking-[0.3em]">Ordering From</p>
          <h2 className="text-sm font-black italic text-orange-600 uppercase">Malout, Punjab 📍</h2>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black uppercase opacity-30 tracking-[0.3em]">Town ID</p>
          <p className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 rounded-md tracking-tighter">{user.townId}</p>
        </div>
      </header>

      {/* 2. Main Content Tabs */}
      <main className="pt-24 px-5">
        {tab === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
             <MenuGrid setCart={setCart} cart={cart} />
          </motion.div>
        )}
        
        {tab === 'orders' && (
          <OrderTracker user={user} />
        )}
      </main>

      {/* 3. Zomato Style Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 p-6 flex justify-around items-center z-[200]">
        {[
          { id: 'home', icon: '🍔', label: 'Menu' },
          { id: 'orders', icon: '🥡', label: 'Orders' },
          { id: 'profile', icon: '👤', label: 'Profile' }
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${tab === item.id ? 'scale-110 opacity-100' : 'opacity-20'}`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* 4. Floating Cart System */}
      <CartDock cart={cart} user={user} />
    </div>
  );
}