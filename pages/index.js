import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

// --- FIREBASE CONFIG (Teri apni config) ---
const firebaseConfig = {
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo",
  authDomain: "flavourstown-83891.firebaseapp.com",
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  projectId: "flavourstown-83891",
  storageBucket: "flavourstown-83891.firebasestorage.app",
  messagingSenderId: "631949771733",
  appId: "1:631949771733:web:16e025bbc443493242735c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const ADMIN_PASS = "aashray778";

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [userDetails, setUserDetails] = useState({ name: '', phone: '', type: 'Takeaway' });
  const [lang, setLang] = useState('pu');
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    onValue(ref(db, 'menu'), (snap) => snap.val() && setMenu(snap.val()));
    onValue(ref(db, 'orders'), (snap) => {
      const data = snap.val();
      if (data) setLiveOrders(Object.keys(data).map(k => ({...data[k], firebaseKey: k})));
    });
  }, []);

  // --- 📊 ANALYTICS LOGIC (THE BRAIN) ---
  const getAnalytics = () => {
    const stats = { totalSales: 0, itemsCount: {}, peakHour: 'N/A' };
    const hours = Array(24).fill(0);

    liveOrders.forEach(order => {
      stats.totalSales += order.total;
      // Item frequency
      order.items.forEach(item => {
        stats.itemsCount[item.name.en] = (stats.itemsCount[item.name.en] || 0) + 1;
      });
      // Time tracking
      const hour = new Date(order.timestamp).getHours();
      hours[hour]++;
    });

    const bestSeller = Object.entries(stats.itemsCount).sort((a,b) => b[1] - a[1])[0];
    const peakHour = hours.indexOf(Math.max(...hours));

    return { 
      sales: stats.totalSales, 
      best: bestSeller ? bestSeller[0] : 'N/A', 
      peak: peakHour ? `${peakHour}:00` : 'N/A' 
    };
  };

  const analytics = getAnalytics();

  const placeOrder = (method) => {
    if (!userDetails.name || !userDetails.phone) return alert("Details?");
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    set(ref(db, 'orders/' + orderId), {
        id: orderId, user: userDetails, items: cart,
        total: cart.reduce((acc, i) => acc + i.price, 0),
        status: 'Pending', method, timestamp: new Date().toISOString()
    });
    setCart([]); setShowCheckout(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <header className="fixed top-0 w-full z-[100] px-6 py-4 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
        <div className="font-black text-orange-500 tracking-tighter italic">FLAVOURS TOWN</div>
        <button onClick={() => { const p=prompt("Pass:"); if(p===ADMIN_PASS) setIsAdmin(!isAdmin); }} className="opacity-20 text-xs">⚙️</button>
      </header>

      <main className="pt-24 pb-32 px-4 max-w-5xl mx-auto">
        {isAdmin ? (
          <div className="animate-in fade-in space-y-6">
            {/* --- ANALYTICS DASHBOARD --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
                    <p className="text-[10px] uppercase opacity-40 font-black mb-1">Total Sales</p>
                    <h2 className="text-2xl font-black text-green-500">₹{analytics.sales}</h2>
                </div>
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
                    <p className="text-[10px] uppercase opacity-40 font-black mb-1">Best Seller</p>
                    <h2 className="text-xl font-black text-orange-500 truncate">{analytics.best}</h2>
                </div>
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
                    <p className="text-[10px] uppercase opacity-40 font-black mb-1">Peak Hour</p>
                    <h2 className="text-2xl font-black text-blue-500">{analytics.peak}</h2>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-xs font-black uppercase opacity-30 tracking-[0.2em] px-2">Live Orders</h3>
                {liveOrders.slice().reverse().map(o => (
                    <div key={o.id} className="p-5 rounded-[2rem] bg-zinc-900/50 border border-white/5">
                        <div className="flex justify-between font-bold mb-1">
                            <span className="text-sm">{o.user.name} <span className="text-[9px] opacity-40 px-2 border border-white/10 rounded-full">{o.user.type}</span></span>
                            <span className="text-orange-500">₹{o.total}</span>
                        </div>
                        <p className="text-[10px] opacity-40 mb-4 truncate">{o.items.map(i=>i.name.en).join(', ')}</p>
                        <div className="flex gap-2">
                            {['Pending', 'Cooking', 'Ready'].map(s => (
                                <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), { status: s })} className={`flex-1 py-2 rounded-xl text-[9px] font-black border transition-all ${o.status===s ? 'bg-orange-600 border-orange-600' : 'opacity-20 border-white/10'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        ) : (
          /* --- USER INTERFACE --- */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {menu.map(p => (
              <div key={p.id} className={`rounded-[2.5rem] bg-white/5 border border-white/5 overflow-hidden ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                <div className="h-40 overflow-hidden relative">
                    <img src={p.img} className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-4 font-black text-sm">₹{p.price}</span>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-[11px] font-black uppercase tracking-tight mb-3">{p.name[lang]}</h3>
                  <button onClick={() => setCart([...cart, p])} disabled={!p.inStock} className="w-full py-3 bg-white text-black rounded-2xl text-[9px] font-black uppercase active:bg-orange-600 active:text-white transition-all">Add +</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-white/5 text-center opacity-20">
         <p className="text-[9px] font-black uppercase tracking-[0.3em]">Built for Business by Aashray</p>
      </footer>

      {cart.length > 0 && (
        <button onClick={() => setShowCheckout(true)} className="fixed bottom-8 left-6 right-6 p-5 bg-orange-600 text-white rounded-3xl font-black flex justify-between items-center shadow-2xl">
          <span className="text-[10px] font-black uppercase tracking-widest">Review Tray ({cart.length})</span>
          <span>₹{cart.reduce((acc, i) => acc + i.price, 0)} →</span>
        </button>
      )}

      {/* --- CHECKOUT DRAWER --- */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{y: '100%'}} animate={{y: 0}} exit={{y: '100%'}} className="fixed inset-0 z-[200] bg-black p-8 pt-20 flex flex-col">
            <h2 className="text-4xl font-black italic mb-10 tracking-tighter uppercase">Order Details</h2>
            <div className="flex gap-2 mb-6">
                {['Dine-in', 'Takeaway'].map(t => (
                    <button key={t} onClick={() => setUserDetails({...userDetails, type: t})} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase border transition-all ${userDetails.type === t ? 'border-orange-600 bg-orange-600/10 text-orange-500' : 'border-white/10 opacity-30'}`}>{t}</button>
                ))}
            </div>
            <input placeholder="Name" className="w-full p-5 rounded-2xl bg-white/5 mb-4 font-bold border border-white/10 outline-none focus:border-orange-500" onChange={e => setUserDetails({...userDetails, name: e.target.value})} />
            <input placeholder="Phone" className="w-full p-5 rounded-2xl bg-white/5 mb-8 font-bold border border-white/10 outline-none focus:border-orange-500" onChange={e => setUserDetails({...userDetails, phone: e.target.value})} />
            <button onClick={() => placeOrder('COD')} className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xl mb-4">CONFIRM ORDER</button>
            <button onClick={() => setShowCheckout(false)} className="py-4 opacity-30 text-[10px] font-black text-center uppercase">Cancel</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}