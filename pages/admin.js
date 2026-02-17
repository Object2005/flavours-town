import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // 1. Password/Auth Check
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
        window.location.href = "/login";
    } else {
        setAuthChecked(true);
    }

    // 2. Safe Live Orders Sync
    const ordersRef = ref(db, 'live_orders');
    onValue(ordersRef, (snap) => {
      try {
        if (snap.exists()) {
          const data = snap.val();
          setOrders(Object.entries(data).map(([id, val]) => ({ id, ...val })));
          // Sound Alert
          new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3').play().catch(() => {});
        } else {
          setOrders([]);
        }
      } catch (err) { console.error("Order Sync Error:", err); }
      setLoading(false);
    });

    // 3. Safe Menu Sync (For Stock)
    const menuRef = ref(db, 'menu');
    onValue(menuRef, (snap) => {
      if (snap.exists()) setMenu(snap.val());
    });
  }, []);

  const updateStatus = (id, status) => {
    if (status === 'Served' || status === 'Cancelled') {
      remove(ref(db, `live_orders/${id}`));
    } else {
      update(ref(db, `live_orders/${id}`), { status });
    }
  };

  const toggleStock = (key, current) => {
    update(ref(db, `menu/${key}`), { inStock: !current });
  };

  if (!authChecked || loading) return <div className="h-screen bg-black flex items-center justify-center text-red-600 font-black text-2xl italic animate-pulse">BOOTING COMMANDER...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6">
      <Head><title>FT Admin | War Room</title></Head>

      <header className="mb-10 flex justify-between items-center bg-zinc-900/50 p-8 rounded-[3rem] border border-white/5">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-red-600 leading-none">Commander</h1>
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.4em] mt-2">The Flavour Town Operations</p>
        </div>
        <div className="text-right">
            <p className="text-[9px] font-black opacity-30 uppercase italic">Live Sync</p>
            <div className="flex items-center gap-2 justify-end text-green-500 font-black italic">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> ONLINE
            </div>
        </div>
      </header>

      {/* TABS */}
      <div className="flex bg-zinc-900 rounded-3xl p-2 mb-10 border border-white/5">
        <button onClick={() => setActiveTab('orders')} className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase italic transition-all ${activeTab === 'orders' ? 'bg-red-600 shadow-xl' : 'opacity-20'}`}>Live Orders ({orders.length})</button>
        <button onClick={() => setActiveTab('inventory')} className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase italic transition-all ${activeTab === 'inventory' ? 'bg-red-600 shadow-xl' : 'opacity-20'}`}>Manage Stock</button>
      </div>

      <main className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {orders.length === 0 && <p className="text-center py-20 opacity-20 font-black italic uppercase tracking-[0.4em]">Zero Active Orders</p>}
              {orders.slice().reverse().map((order) => (
                <div key={order.id} className="bg-zinc-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">{order.customer || "Guest"}</h3>
                      <p className="text-xs font-bold text-red-600 uppercase italic">{order.phone || "No Phone"}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black opacity-30 uppercase italic">{order.time}</p>
                        <p className="text-2xl font-black italic text-green-500">₹{order.total}</p>
                    </div>
                  </div>
                  
                  <div className="border-y border-white/5 py-6 my-6 space-y-2">
                    {order.items?.map((it, idx) => (
                      <p key={idx} className="text-xs font-black uppercase italic opacity-60">• {typeof it.name === 'object' ? it.name.en : it.name}</p>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => updateStatus(order.id, 'Preparing')} className={`py-4 rounded-2xl font-black text-[9px] uppercase border ${order.status === 'Preparing' ? 'bg-white text-black' : 'border-white/10 opacity-40'}`}>Preparing</button>
                    <button onClick={() => updateStatus(order.id, 'Ready')} className={`py-4 rounded-2xl font-black text-[9px] uppercase border ${order.status === 'Ready' ? 'bg-orange-600 text-white' : 'border-white/10 opacity-40'}`}>Ready</button>
                    <button onClick={() => updateStatus(order.id, 'Served')} className="py-4 rounded-2xl bg-green-600 text-white font-black text-[9px] uppercase shadow-lg">Serve ✅</button>
                  </div>
                  <button onClick={() => updateStatus(order.id, 'Cancelled')} className="w-full mt-3 py-3 rounded-xl border border-red-900/30 text-red-900 text-[8px] font-black uppercase italic opacity-40 hover:opacity-100 transition-opacity">Cancel Order</button>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(menu).map(([key, item]) => (
                <div key={key} className={`p-6 rounded-[2.5rem] border transition-all duration-500 ${item.inStock ? 'bg-zinc-900 border-white/5' : 'bg-red-950/20 border-red-900/40 grayscale'}`}>
                   <span className="text-4xl block mb-4">{item.img}</span>
                   <p className="font-black text-[11px] uppercase italic leading-none mb-6">{typeof item.name === 'object' ? item.name.en : item.name}</p>
                   <button 
                    onClick={() => toggleStock(key, item.inStock)} 
                    className={`w-full py-4 rounded-xl text-[9px] font-black uppercase shadow-xl transition-all active:scale-90 ${item.inStock ? 'bg-white text-black' : 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]'}`}
                   >
                     {item.inStock ? 'IN STOCK' : 'SOLD OUT'}
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