import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

// Safe Firebase Init Pattern
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function LuxuryAdmin() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentServing, setCurrentServing] = useState(0);
  const [menu, setMenu] = useState({});

  useEffect(() => {
    setMounted(true); // Ensures code runs only on client browser

    // Auth Check inside useEffect
    if (!localStorage.getItem("admin_auth")) {
        window.location.href = "/login";
        return;
    }

    // Orders Listener
    onValue(ref(db, 'live_orders'), (snap) => {
      if(snap.exists()) {
        const data = snap.val();
        setOrders(Object.entries(data).map(([id, v]) => ({ id, ...v })));
      } else {
        setOrders([]);
      }
    });

    // Queue Listener
    onValue(ref(db, 'queue/current'), (snap) => {
      if(snap.exists()) setCurrentServing(snap.val());
    });

    // Menu Listener for Stock
    onValue(ref(db, 'menu'), (snap) => {
      if(snap.exists()) setMenu(snap.val());
    });
  }, []);

  const advanceQueue = () => {
    update(ref(db, 'queue'), { current: currentServing + 1 });
  };

  const toggleStock = (key, status) => {
    update(ref(db, `menu/${key}`), { inStock: !status });
  };

  // Critical for Vercel: Prevents "No Firebase App" or "localStorage undefined" errors
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10 font-serif">
      <Head><title>FT | Concierge Admin</title></Head>
      
      <header className="mb-20 flex justify-between items-end border-b border-white/10 pb-10">
        <div>
          <h1 className="text-5xl font-light italic text-[#d4af37]">Concierge</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 mt-4 font-sans">Kitchen Operations Dashboard</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest opacity-30 mb-2 font-sans">Now Serving Sequence</p>
          <h2 className="text-6xl font-light italic tracking-tighter">#{currentServing}</h2>
          <button onClick={advanceQueue} className="mt-6 border border-[#d4af37] text-[#d4af37] px-8 py-2 text-[10px] uppercase tracking-[0.3em] font-sans hover:bg-[#d4af37] hover:text-black transition-all">Next Order →</button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-20">
        {/* LIVE ORDERS */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.4em] opacity-30 mb-10 border-b border-white/5 pb-4">Pending Requests</h2>
          <div className="space-y-6">
            {orders.length === 0 && <p className="italic opacity-20">No active reservations...</p>}
            {orders.map(o => (
              <div key={o.id} className="border-l-2 border-[#d4af37] bg-white/5 p-8 backdrop-blur-md flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-light italic uppercase">{o.customer || "Guest"}</h3>
                  <p className="text-[10px] opacity-30 uppercase font-sans mt-2">{o.time}</p>
                </div>
                <button onClick={() => remove(ref(db, `live_orders/${o.id}`))} className="text-[10px] uppercase tracking-widest text-red-500 border border-red-500/20 px-4 py-2 hover:bg-red-500 hover:text-white transition-all">Clear</button>
              </div>
            ))}
          </div>
        </section>

        {/* STOCK MANAGEMENT */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.4em] opacity-30 mb-10 border-b border-white/5 pb-4">Inventory Status</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(menu).map(([key, item]) => (
              <div key={key} className={`p-4 border transition-all ${item.inStock ? 'border-white/5 bg-white/5' : 'border-red-900/40 bg-red-900/10 opacity-50'}`}>
                <p className="text-[10px] uppercase tracking-widest mb-4 truncate">{typeof item.name === 'object' ? item.name.en : item.name}</p>
                <button onClick={() => toggleStock(key, item.inStock)} className={`w-full py-2 text-[9px] uppercase font-bold tracking-widest ${item.inStock ? 'bg-white text-black' : 'bg-red-600 text-white'}`}>
                  {item.inStock ? 'In Stock' : 'Sold Out'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}