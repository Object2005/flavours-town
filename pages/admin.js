import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";

// 1. Firebase Initialization (CRITICAL FIX)
const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

// Pehla check karo ki app bani hai ya nahi
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function Admin() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState({});

  useEffect(() => {
    setMounted(true);
    
    // Auth Check
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
        window.location.href = "/login";
        return;
    }

    // 2. Safe Data Fetching inside useEffect
    const ordersRef = ref(db, 'live_orders');
    const unsubscribeOrders = onValue(ordersRef, (snap) => {
      if(snap.exists()) {
          setOrders(Object.entries(snap.val()).map(([id, v]) => ({ id, ...v })));
      } else {
          setOrders([]);
      }
    });

    const menuRef = ref(db, 'menu');
    const unsubscribeMenu = onValue(menuRef, (snap) => {
      if(snap.exists()) setMenu(snap.val());
    });

    return () => {
        unsubscribeOrders();
        unsubscribeMenu();
    };
  }, []);

  // Hydration fix for Next.js
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <Head><title>Commander | FT Admin</title></Head>

      <header className="mb-16 border-b border-white/10 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black italic uppercase text-red-600 tracking-tighter leading-none">Commander</h1>
            <p className="text-[10px] font-bold opacity-30 tracking-[0.6em] uppercase mt-2 text-white">Live Operations</p>
          </div>
          <div className="text-right">
              <span className="bg-red-600 text-[10px] font-black px-4 py-1 rounded-full italic animate-pulse">LIVE SYNC</span>
          </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-12">
          {/* ORDERS SECTION */}
          <section>
              <h2 className="text-[11px] font-black uppercase mb-8 opacity-40 italic tracking-widest underline decoration-red-600 underline-offset-8">Incoming Orders ({orders.length})</h2>
              <div className="space-y-6">
                  {orders.length === 0 && <p className="opacity-20 italic text-sm">No live orders right now...</p>}
                  {orders.slice().reverse().map(o => (
                      <div key={o.id} className="bg-zinc-900/50 p-8 rounded-[3.5rem] border border-white/5 shadow-2xl transition-all hover:border-red-600/30">
                          <div className="flex justify-between items-start mb-6">
                              <div>
                                <h3 className="font-black text-xl uppercase italic leading-none">{o.customer || "Guest"}</h3>
                                <p className="text-[10px] opacity-30 uppercase mt-2 font-bold">{o.time}</p>
                              </div>
                              <span className="text-3xl font-black italic text-orange-500 tracking-tighter">₹{o.total}</span>
                          </div>
                          <button 
                            onClick={() => remove(ref(db, `live_orders/${o.id}`))} 
                            className="w-full py-5 bg-green-600 rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                          >
                            Mark Served ✅
                          </button>
                      </div>
                  ))}
              </div>
          </section>
          
          {/* STOCK CONTROL */}
          <section>
              <h2 className="text-[11px] font-black uppercase mb-8 opacity-40 italic tracking-widest underline decoration-blue-600 underline-offset-8">Kitchen Stock</h2>
              <div className="grid grid-cols-2 gap-5">
                  {Object.entries(menu).map(([key, item]) => (
                      <div key={key} className={`p-6 rounded-[2.5rem] border transition-all duration-500 ${item.inStock ? 'bg-zinc-900/40 border-white/5' : 'bg-red-950/20 border-red-900/40 grayscale'}`}>
                          <p className="text-[12px] font-black uppercase italic mb-6 leading-none">{typeof item.name === 'object' ? item.name.en : item.name}</p>
                          <button 
                            onClick={() => update(ref(db, `menu/${key}`), {inStock: !item.inStock})} 
                            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl transition-all ${item.inStock ? 'bg-white text-black' : 'bg-red-600 text-white shadow-red-600/20'}`}
                          >
                              {item.inStock ? 'IN STOCK' : 'SOLD OUT'}
                          </button>
                      </div>
                  ))}
              </div>
          </section>
      </div>
    </div>
  );
}