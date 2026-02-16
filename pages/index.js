import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo",
  authDomain: "flavourstown-83891.firebaseapp.com",
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  projectId: "flavourstown-83891",
  storageBucket: "flavourstown-83891.firebasestorage.app",
  messagingSenderId: "631949771733",
  appId: "1:631949771733:web:16e025bbc443493242735c",
  measurementId: "G-8LP1YVF8X2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const ADMIN_PASS = "aashray778";

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [userOrder, setUserOrder] = useState(null); // Tracking User's Active Order
  const [sessionOrderId, setSessionOrderId] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', phone: '', type: 'Takeaway' });
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const sId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    setSessionOrderId(sId);

    onValue(ref(db, 'menu'), (snap) => {
      if (snap.val()) setMenu(snap.val());
    });

    onValue(ref(db, 'orders'), (snap) => {
      const data = snap.val();
      if (data) {
        const orders = Object.keys(data).map(k => ({...data[k], firebaseKey: k}));
        setLiveOrders(orders);
        // Check if current user has an active order
        const myOrder = orders.find(o => o.id === sessionOrderId || (userDetails.phone && o.user.phone === userDetails.phone));
        if (myOrder) setUserOrder(myOrder);
      }
    });
  }, [userDetails.phone]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0);

  const placeOrder = (method) => {
    if (!userDetails.name || !userDetails.phone) return alert("Fill Details!");
    const newOrder = {
        id: sessionOrderId, user: userDetails, items: cart,
        total: subtotal, status: 'Pending', method, timestamp: new Date().toISOString()
    };
    set(ref(db, 'orders/' + sessionOrderId), newOrder);
    setCart([]); setShowCheckout(false);
  };

  const updateStatus = (key, s) => update(ref(db, `orders/${key}`), { status: s });

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-[#080808] text-white' : 'bg-[#f8f9fa] text-black'}`}>
      <header className="fixed top-0 w-full z-[100] px-6 py-4 backdrop-blur-md border-b border-white/5 flex justify-between items-center bg-black/20">
        <div className="font-black text-xl tracking-tighter text-orange-500">FLAVOURS TOWN</div>
        <div className="flex gap-3">
          <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="text-[10px] font-bold uppercase tracking-widest opacity-60">{lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English'}</button>
          <button onClick={() => { const p=prompt("Pass:"); if(p===ADMIN_PASS) setIsAdmin(!isAdmin); }}>⚙️</button>
        </div>
      </header>

      <main className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
        {/* --- LIVE ORDER STATUS SECTION --- */}
        {userOrder && !isAdmin && (
          <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="mb-8 p-6 rounded-3xl bg-orange-600 text-white shadow-2xl shadow-orange-600/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Active Order: {userOrder.id}</span>
              <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-[10px] font-black">{userOrder.status}</span>
            </div>
            <h3 className="text-2xl font-black italic">
              {userOrder.status === 'Pending' && (lang === 'en' ? "We received it!" : "ਆਰਡਰ ਮਿਲ ਗਿਆ ਹੈ!")}
              {userOrder.status === 'Cooking' && (lang === 'en' ? "Chef is cooking..." : "ਬਣ ਰਿਹਾ ਹੈ ਜੀ...")}
              {userOrder.status === 'Ready' && (lang === 'en' ? "Ready to Pick!" : "ਤਿਆਰ ਹੈ ਜੀ, ਲੈ ਜਾਓ!")}
            </h3>
          </motion.div>
        )}

        {isAdmin ? (
          <div className="space-y-4">
            {liveOrders.slice().reverse().map(o => (
              <div key={o.id} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex justify-between font-bold"><span>{o.user.name} ({o.user.type})</span><span>₹{o.total}</span></div>
                <div className="flex gap-2 mt-4">{['Pending', 'Cooking', 'Ready'].map(s => (
                  <button key={s} onClick={() => updateStatus(o.firebaseKey, s)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${o.status===s ? 'bg-orange-600' : 'bg-white/10 opacity-40'}`}>{s}</button>
                ))}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {menu.map(p => (
              <div key={p.id} className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden group">
                <div className="h-40 overflow-hidden"><img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                <div className="p-4 text-center">
                  <div className="text-[11px] font-black mb-1">{p.name[lang]}</div>
                  <div className="text-orange-500 font-black mb-3">₹{p.price}</div>
                  <button onClick={() => setCart([...cart, p])} className="w-full py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase">Add +</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- FOOTER (As Requested) --- */}
      <footer className="py-10 text-center opacity-30 border-t border-white/5">
        <div className="text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">Developed by Aashray Narang</div>
        <div className="flex justify-center gap-6 text-[10px] font-bold">
          <a href="https://github.com/AashrayNarang" className="hover:text-orange-500">GITHUB</a>
          <a href="https://linkedin.com/in/aashraynarang" className="hover:text-orange-500">LINKEDIN</a>
          <a href="mailto:aashray@example.com" className="hover:text-orange-500">EMAIL</a>
        </div>
      </footer>

      {/* --- CHECKOUT WITH DINING/TAKEAWAY --- */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div className="fixed inset-0 z-[200] bg-black/95 p-8 flex flex-col justify-center">
            <h2 className="text-4xl font-black italic mb-8">CHECKOUT</h2>
            <div className="flex gap-2 mb-6">
              {['Dine-in', 'Takeaway'].map(t => (
                <button key={t} onClick={() => setUserDetails({...userDetails, type: t})} className={`flex-1 py-4 rounded-2xl font-bold border transition-all ${userDetails.type === t ? 'border-orange-500 bg-orange-500/20 text-orange-500' : 'border-white/10 opacity-40'}`}>{t}</button>
              ))}
            </div>
            <input placeholder="Name" className="w-full p-4 rounded-xl bg-white/5 mb-4 outline-none border border-white/10 focus:border-orange-500" onChange={e => setUserDetails({...userDetails, name: e.target.value})} />
            <input placeholder="Phone" className="w-full p-4 rounded-xl bg-white/5 mb-8 outline-none border border-white/10 focus:border-orange-500" onChange={e => setUserDetails({...userDetails, phone: e.target.value})} />
            <button onClick={() => placeOrder('COD')} className="w-full py-5 bg-orange-600 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/30 mb-4">CONFIRM ORDER</button>
            <button onClick={() => setShowCheckout(false)} className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Cancel</button>
          </motion.div>
        )}
      </AnimatePresence>

      {cart.length > 0 && (
        <button onClick={() => setShowCheckout(true)} className="fixed bottom-6 left-6 right-6 p-5 bg-white text-black rounded-2xl font-black flex justify-between items-center shadow-2xl">
          <span className="text-xs uppercase tracking-tighter">View Cart ({cart.length})</span>
          <span>₹{subtotal} →</span>
        </button>
      )}
    </div>
  );
}