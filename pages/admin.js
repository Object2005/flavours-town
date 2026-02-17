import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, update, remove, set } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);
const auth = getAuth(app);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders'); // orders, inventory, stats
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const ADMIN_EMAIL = "narangaashray34@gmail.com";

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u && u.email === ADMIN_EMAIL) setUser(u);
    });

    // 1. Live Orders & Sound Logic
    onValue(ref(db, 'live_orders'), (snap) => {
      if (snap.exists()) {
        const data = Object.entries(snap.val()).map(([id, val]) => ({ id, ...val }));
        setOrders(data);
        // Sound Trigger for New Order
        new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3').play().catch(() => {});
      } else setOrders([]);
    });

    // 2. Real-time Menu Sync
    onValue(ref(db, 'menu'), (snap) => {
      if (snap.exists()) setMenu(Object.entries(snap.val()).map(([id, val]) => ({ id, ...val })));
    });

    // 3. Revenue Calculator (Using a separate completed_orders ref for safety)
    onValue(ref(db, 'daily_stats'), (snap) => {
      if (snap.exists()) setRevenue(snap.val().totalSales || 0);
    });
  }, []);

  const handleStatus = (order, status) => {
    if (status === 'Served') {
      // Add to Daily Revenue
      const newTotal = revenue + order.total;
      update(ref(db, 'daily_stats'), { totalSales: newTotal });
      remove(ref(db, `live_orders/${order.id}`));
    } else if (status === 'Cancelled') {
      remove(ref(db, `live_orders/${order.id}`));
    } else {
      update(ref(db, `live_orders/${order.id}`), { status });
    }
  };

  const toggleStock = (id, current) => update(ref(db, `menu/${id}`), { inStock: !current });

  if (!user) return <div className="h-screen flex items-center justify-center bg-black text-white font-black italic">ACCESS RESTRICTED 🛑</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      <Head><title>FT COMMANDER | MALOUT 👑</title></Head>

      {/* --- TOP HUD (Stats) --- */}
      <header className="p-6 bg-zinc-900 border-b border-white/10 flex justify-between items-center sticky top-0 z-[100]">
        <div>
          <h1 className="text-2xl font-black italic text-orange-600 uppercase tracking-tighter leading-none">Command Center</h1>
          <p className="text-[10px] font-bold opacity-30 uppercase mt-1 tracking-widest">Live Operations • Malout</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black opacity-30 uppercase leading-none">Daily Revenue</p>
          <p className="text-3xl font-black italic text-green-500 tracking-tighter">₹{revenue}</p>
        </div>
      </header>

      {/* --- TAB NAVIGATION --- */}
      <nav className="flex bg-zinc-900 border-b border-white/5 p-2 sticky top-[84px] z-[90]">
        {['orders', 'inventory'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest italic transition-all ${activeTab === tab ? 'bg-orange-600 text-white rounded-xl' : 'opacity-30'}`}>
            {tab === 'orders' ? `Live Orders (${orders.length})` : 'Manage Menu'}
          </button>
        ))}
      </nav>

      <main className="p-6 max-w-5xl mx-auto pb-40">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {orders.length === 0 && <div className="py-20 text-center opacity-20 font-black italic uppercase">No orders currently...</div>}
              {orders.map(order => (
                <div key={order.id} className="bg-zinc-900 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <img src={order.photo} className="w-12 h-12 rounded-full border-2 border-orange-500" />
                       <div><p className="font-black text-sm uppercase italic">{order.customer}</p><p className="text-[9px] opacity-40 uppercase">{order.time}</p></div>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${order.status === 'Ready' ? 'bg-green-600' : 'bg-orange-600'}`}>{order.status}</div>
                  </div>
                  <div className="space-y-2 mb-6 border-y border-white/5 py-4">
                    {order.items.map((it, i) => (
                      <p key={i} className="text-xs font-bold opacity-70 italic">• {it.name?.en || it.name}</p>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleStatus(order, 'Ready')} className="py-3 bg-white text-black rounded-xl font-black text-[9px] uppercase">Ready</button>
                    <button onClick={() => handleStatus(order, 'Served')} className="py-3 bg-green-600 text-white rounded-xl font-black text-[9px] uppercase">Served</button>
                    <button onClick={() => handleStatus(order, 'Cancelled')} className="py-3 bg-red-600/20 text-red-500 rounded-xl font-black text-[9px] uppercase border border-red-500/30">Cancel</button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {menu.map(item => (
                <div key={item.id} className={`p-5 rounded-[2.5rem] border transition-all ${item.inStock ? 'bg-zinc-900 border-white/5' : 'bg-red-950/20 border-red-900/40 grayscale'}`}>
                  <div className="text-3xl mb-3">{item.img}</div>
                  <p className="font-black text-[11px] uppercase italic leading-none">{item.name?.en || item.name}</p>
                  <p className="text-orange-500 font-bold text-xs mb-4 mt-1">₹{item.price}</p>
                  <button onClick={() => toggleStock(item.id, item.inStock)} className={`w-full py-3 rounded-xl text-[9px] font-black uppercase ${item.inStock ? 'bg-white text-black' : 'bg-red-600 text-white'}`}>
                    {item.inStock ? 'In Stock' : 'Sold Out'}
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}