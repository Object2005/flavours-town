import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";

// --- FIREBASE CONFIG ---
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
const OWNER_CONTACT = "+91 9877474778"; // Tera Number

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [userOrder, setUserOrder] = useState(null);
  const [userDetails, setUserDetails] = useState({ name: '', phone: '', type: 'Takeaway' });
  const [isDark, setIsDark] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [lang, setLang] = useState('pu');

  // Sounds
  const playSound = (type) => {
    const url = type === 'new' ? 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' : 'https://assets.mixkit.co/active_storage/sfx/1111/1111-preview.mp3';
    new Audio(url).play().catch(() => {});
  };

  useEffect(() => {
    // Persistent Login
    const saved = localStorage.getItem('ft_user');
    if (saved) setUserDetails(JSON.parse(saved));

    onValue(ref(db, 'menu'), (snap) => snap.val() && setMenu(snap.val()));
    
    onValue(ref(db, 'orders'), (snap) => {
      const data = snap.val();
      if (data) {
        const orders = Object.keys(data).map(k => ({...data[k], firebaseKey: k}));
        
        // Sound for User on Status Change
        const myOrder = orders.find(o => o.user.phone === userDetails.phone);
        if (myOrder && userOrder && myOrder.status !== userOrder.status) playSound('status');
        
        setUserOrder(myOrder);
        setLiveOrders(orders);
        
        // Sound for Admin on New Order
        if (isAdmin && orders.length > liveOrders.length) playSound('new');
      }
    });
  }, [userDetails.phone, isAdmin]);

  const placeOrder = () => {
    if (!userDetails.name || userDetails.phone.length !== 10) return alert("Sahi Name te 10-digit Phone bharo!");
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = {
        id: orderId, user: userDetails, items: cart,
        total: cart.reduce((acc, i) => acc + i.price, 0),
        status: 'Pending', timestamp: new Date().toISOString()
    };
    localStorage.setItem('ft_user', JSON.stringify(userDetails));
    set(ref(db, 'orders/' + orderId), orderData);
    setCart([]); setShowCheckout(false);
  };

  const cancelOrder = (key) => { if(confirm("Cancel karda?")) remove(ref(db, `orders/${key}`)); };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#f5f5f7] text-black'}`}>
      <Head><title>Flavour's Town | Siraa UI</title></Head>

      {/* --- PREMIUM NAVBAR --- */}
      <header className="fixed top-0 w-full z-[100] backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <motion.div animate={{rotate: 360}} transition={{duration: 20, repeat: Infinity}} className="w-8 h-8 bg-gradient-to-tr from-orange-600 to-yellow-400 rounded-full shadow-lg shadow-orange-500/40" />
            <h1 className="font-black text-lg tracking-tighter uppercase italic text-orange-500">Flavour's Town</h1>
        </div>
        <div className="flex gap-4 items-center">
            <button onClick={() => setIsDark(!isDark)} className="text-lg">{isDark ? '☀️' : '🌙'}</button>
            <button onClick={() => { const p=prompt("Admin Pass:"); if(p===ADMIN_PASS) setIsAdmin(!isAdmin); }} className="opacity-30">⚙️</button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-4 max-w-6xl mx-auto">
        
        {/* --- USER DASHBOARD (YOUR ORDER) --- */}
        {userOrder && !isAdmin && (
          <motion.div layout initial={{y: 20}} animate={{y: 0}} className="mb-8 p-6 rounded-[2.5rem] bg-orange-600 text-white shadow-2xl shadow-orange-600/30">
            <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-4">
                <span className="text-[10px] font-black tracking-widest uppercase">Your Live Order</span>
                <span className="bg-white text-orange-600 px-4 py-1 rounded-full text-[10px] font-black animate-pulse">{userOrder.status}</span>
            </div>
            <div className="space-y-2">
                {userOrder.items.map((i,idx) => (
                    <div key={idx} className="flex justify-between text-sm font-bold">
                        <span>{i.name.en}</span><span>₹{i.price}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between font-black text-xl italic">
                <span>TOTAL BILL</span><span>₹{userOrder.total}</span>
            </div>
          </motion.div>
        )}

        {isAdmin ? (
          /* --- ADVANCED ADMIN PANEL --- */
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-black italic">COMMAND CENTER</h2>
                <div className="text-right">
                    <p className="text-[10px] opacity-40 font-bold uppercase">Total Earnings</p>
                    <p className="text-xl font-black text-green-500">₹{liveOrders.reduce((a,b)=>a+b.total,0)}</p>
                </div>
            </div>
            
            <div className="space-y-4">
                {liveOrders.slice().reverse().map(o => (
                    <div key={o.id} className="p-6 rounded-3xl bg-zinc-900 border border-white/10">
                        <div className="flex justify-between font-bold text-sm mb-4">
                            <span>{o.user.name} ({o.user.phone})</span>
                            <button onClick={() => cancelOrder(o.firebaseKey)} className="text-red-500 text-[10px] font-black uppercase">Cancel X</button>
                        </div>
                        <div className="flex gap-2">
                            {['Pending', 'Cooking', 'Ready'].map(s => (
                                <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status: s})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${o.status===s ? 'bg-orange-600 border-orange-600' : 'bg-white/5 opacity-20'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        ) : (
          /* --- DYNAMIC GRID MENU --- */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((p, idx) => (
              <motion.div key={p.id} whileHover={{y: -5}} className={`relative rounded-[3rem] overflow-hidden border ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5 shadow-xl'} ${!p.inStock ? 'grayscale' : ''}`}>
                <div className="h-48 overflow-hidden"><img src={p.img} className="w-full h-full object-cover" /></div>
                <div className="p-5 text-center">
                    <h3 className="font-black text-xs uppercase tracking-tight mb-1">{p.name[lang]}</h3>
                    <p className="text-orange-500 font-black text-lg mb-4 italic">₹{p.price}</p>
                    {isAdmin ? (
                        <button onClick={() => update(ref(db, `menu/${idx}`), {inStock: !p.inStock})} className="w-full py-2 rounded-2xl border border-white/20 text-[10px] font-bold">
                            {p.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                        </button>
                    ) : (
                        <button onClick={() => setCart([...cart, p])} disabled={!p.inStock} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-transform">Add to Tray</button>
                    )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 text-center">
          <p className="text-[10px] font-black opacity-20 uppercase tracking-[0.5em] mb-4">Masterpiece by Aashray Narang</p>
          <p className="text-[10px] font-bold opacity-60">Owner Support: {OWNER_CONTACT}</p>
      </footer>

      {/* --- CART BUTTON --- */}
      {cart.length > 0 && (
          <button onClick={() => setShowCheckout(true)} className="fixed bottom-8 left-8 right-8 p-6 bg-white text-black rounded-[2.5rem] font-black flex justify-between items-center shadow-2xl z-[150]">
              <span className="text-[10px] uppercase">Review Tray ({cart.length})</span>
              <span className="text-xl italic font-black">₹{cart.reduce((a,b)=>a+b.price,0)} →</span>
          </button>
      )}

      {/* --- FULLSCREEN CHECKOUT (BLINKIT STYLE) --- */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{y: '100%'}} animate={{y: 0}} exit={{y: '100%'}} transition={{type: 'spring', damping: 25}} className="fixed inset-0 z-[200] bg-orange-600 p-8 flex flex-col justify-center">
              <h2 className="text-6xl font-black italic text-white mb-10 tracking-tighter">FINISH <br/> <span className="opacity-40 text-black">ORDER</span></h2>
              <div className="space-y-4">
                  <input placeholder="Your Name" value={userDetails.name} onChange={e=>setUserDetails({...userDetails, name: e.target.value})} className="w-full p-6 rounded-3xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-black outline-none" />
                  <input type="number" placeholder="Phone Number (10 digits)" value={userDetails.phone} onChange={e=>setUserDetails({...userDetails, phone: e.target.value})} className="w-full p-6 rounded-3xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-black outline-none" />
              </div>
              <button onClick={placeOrder} className="w-full mt-8 py-6 bg-white text-orange-600 rounded-[2.5rem] font-black text-2xl shadow-2xl">ORDER NOW</button>
              <button onClick={() => setShowCheckout(false)} className="mt-6 font-black uppercase text-[10px] opacity-40 text-black tracking-widest text-center">Go Back</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}