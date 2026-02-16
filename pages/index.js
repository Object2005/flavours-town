import { useState, useEffect } from 'react';
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
const APP_NAME = "The Flavours Town";

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

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (saved) setUserDetails(JSON.parse(saved));

    onValue(ref(db, 'menu'), (snap) => {
      if (snap.exists()) setMenu(snap.val());
    });
    
    onValue(ref(db, 'orders'), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const orders = Object.keys(data).map(k => ({...data[k], firebaseKey: k}));
        const myOrder = orders.find(o => o.user.phone === userDetails.phone);
        setUserOrder(myOrder);
        setLiveOrders(orders);
      } else {
        setLiveOrders([]);
        setUserOrder(null);
      }
    });
  }, [userDetails.phone]);

  const placeOrder = () => {
    if (!userDetails.name || userDetails.phone.length !== 10) {
      alert(lang === 'en' ? "Invalid Details!" : "ਸਹੀ ਜਾਣਕਾਰੀ ਭਰੋ ਜੀ!");
      return;
    }
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

  return (
    <div className={`min-h-screen transition-all ${isDark ? 'bg-[#050505] text-white' : 'bg-[#f5f5f7] text-black'}`}>
      <Head><title>{APP_NAME}</title></Head>

      <header className="fixed top-0 w-full z-[150] backdrop-blur-3xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/30 font-black flex items-center justify-center text-white italic">F</div>
            <h1 className="font-black text-sm uppercase tracking-tighter italic text-orange-500">{APP_NAME}</h1>
        </div>
        <div className="flex gap-3 items-center">
            <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="px-3 py-1 rounded-full bg-orange-600/10 text-[9px] font-black border border-orange-600/30 text-orange-500 uppercase">
                {lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English'}
            </button>
            <button onClick={() => setIsDark(!isDark)} className="text-sm">{isDark ? '☀️' : '🌙'}</button>
            <button onClick={() => { const p=prompt("Pass:"); if(p===ADMIN_PASS) setIsAdmin(!isAdmin); }} className="opacity-10 text-[8px]">⚙️</button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-4 max-w-6xl mx-auto">
        
        {userOrder && !isAdmin && (
          <motion.div initial={{y: 20}} animate={{y: 0}} className="mb-8 p-6 rounded-[2.5rem] bg-orange-600 text-white shadow-2xl">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status Tracking</span>
                <span className="bg-white text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">{userOrder.status}</span>
            </div>
            <h2 className="text-2xl font-black italic">{userOrder.status === 'Ready' ? '🔥 Ready to Eat!' : '👨‍🍳 Preparing...'}</h2>
            <p className="text-[10px] mt-2 font-bold opacity-80">Order ID: {userOrder.id} | Total: ₹{userOrder.total}</p>
          </motion.div>
        )}

        {isAdmin ? (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-end px-2">
                <h2 className="text-2xl font-black italic uppercase">Live Orders</h2>
                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Revenue: ₹{liveOrders.reduce((a,b)=>a+b.total,0)}</p>
             </div>
             <div className="space-y-4">
                {liveOrders?.slice().reverse().map(o => (
                    <div key={o.id} className="p-5 rounded-3xl bg-zinc-900 border border-white/5">
                        <div className="flex justify-between font-bold text-sm mb-4">
                            <span>{o.user.name} ({o.user.phone})</span>
                            <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="text-red-500 text-[9px] font-black italic">DELETE</button>
                        </div>
                        <div className="flex gap-2">
                            {['Pending', 'Cooking', 'Ready'].map(s => (
                                <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status: s})} className={`flex-1 py-3 rounded-xl text-[9px] font-black ${o.status===s ? 'bg-orange-600' : 'bg-white/5 opacity-20'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {menu?.map((p, idx) => (
              <div key={p.id} className={`relative rounded-[2.5rem] overflow-hidden border transition-all ${isDark ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-xl'} ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                <div className="h-44 overflow-hidden"><img src={p.img} alt={p.name.en} className="w-full h-full object-cover" /></div>
                <div className="p-5 text-center">
                    <h3 className="font-black text-[11px] uppercase tracking-tight mb-1">{p.name[lang]}</h3>
                    <p className="text-orange-500 font-black text-lg italic mb-4">₹{p.price}</p>
                    {isAdmin ? (
                        <button onClick={() => update(ref(db, `menu/${idx}`), {inStock: !p.inStock})} className="w-full py-2 rounded-2xl bg-white/5 text-[9px] font-black uppercase tracking-widest">{p.inStock ? 'In Stock' : 'Out of Stock'}</button>
                    ) : (
                        <button onClick={() => setCart([...cart, p])} disabled={!p.inStock} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Add +</button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
          <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.5em] mb-4 italic">{APP_NAME}</p>
          <p className="text-[9px] font-bold opacity-40">Built by Aashray Narang</p>
      </footer>

      {cart.length > 0 && (
          <button onClick={() => setShowCheckout(true)} className="fixed bottom-8 left-8 right-8 p-6 bg-white text-black rounded-[2.5rem] font-black flex justify-between items-center shadow-2xl z-[100]">
              <span className="text-[10px] uppercase font-black">{lang === 'en' ? 'Tray' : 'ਟ੍ਰੇ'} ({cart.length})</span>
              <span className="text-xl italic font-black">₹{cart.reduce((a,b)=>a+b.price,0)} →</span>
          </button>
      )}

      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{y: '100%'}} animate={{y: 0}} exit={{y: '100%'}} className="fixed inset-0 z-[200] bg-orange-600 p-8 flex flex-col justify-center text-white">
              <h2 className="text-6xl font-black italic mb-10 tracking-tighter uppercase">{lang === 'en' ? 'Order' : 'ਆਰਡਰ'}</h2>
              <div className="space-y-4">
                  <input placeholder={lang === 'en' ? 'Name' : 'ਨਾਮ'} value={userDetails.name} onChange={e=>setUserDetails({...userDetails, name: e.target.value})} className="w-full p-6 rounded-3xl bg-white/10 border border-white/20 font-black placeholder:text-white/40 outline-none" />
                  <input type="number" placeholder={lang === 'en' ? 'Mobile' : 'ਮੋਬਾਈਲ'} value={userDetails.phone} onChange={e=>setUserDetails({...userDetails, phone: e.target.value})} className="w-full p-6 rounded-3xl bg-white/10 border border-white/20 font-black placeholder:text-white/40 outline-none" />
              </div>
              <button onClick={placeOrder} className="w-full mt-8 py-6 bg-white text-orange-600 rounded-[2.5rem] font-black text-2xl shadow-2xl uppercase">Submit</button>
              <button onClick={() => setShowCheckout(false)} className="mt-8 font-black uppercase text-[10px] opacity-40 text-black tracking-widest text-center">Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}