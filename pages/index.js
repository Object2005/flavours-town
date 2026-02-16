import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";

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
    if (saved) {
        try { setUserDetails(JSON.parse(saved)); } catch(e) { console.error("User Parse Error"); }
    }

    // SYNC MENU
    onValue(ref(db, 'menu'), (snap) => {
      setMenu(snap.exists() ? snap.val() : []);
    });
    
    // SYNC ORDERS
    onValue(ref(db, 'orders'), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const orders = Object.keys(data).map(k => ({...data[k], firebaseKey: k}));
        setLiveOrders(orders);
        // Safety check for user order tracking
        const myOrder = orders.find(o => o.user?.phone === userDetails.phone);
        setUserOrder(myOrder || null);
      } else {
        setLiveOrders([]);
        setUserOrder(null);
      }
    });
  }, [userDetails.phone]);

  const placeOrder = () => {
    if (!userDetails.name || !userDetails.phone || userDetails.phone.length < 10) {
      alert(lang === 'en' ? "Fill Name & 10-digit Phone!" : "ਨਾਮ ਤੇ 10-ਅੱਖਰਾਂ ਦਾ ਫੋਨ ਭਰੋ!");
      return;
    }
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = {
        id: orderId,
        user: userDetails,
        items: cart,
        total: cart.reduce((acc, i) => acc + i.price, 0),
        status: 'Pending',
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('ft_user', JSON.stringify(userDetails));
    set(ref(db, 'orders/' + orderId), orderData);
    setCart([]); setShowCheckout(false);
  };

  return (
    <div className={`min-h-screen transition-all ${isDark ? 'bg-[#050505] text-white' : 'bg-[#f5f5f7] text-black'}`}>
      <Head><title>{APP_NAME}</title></Head>

      <header className="fixed top-0 w-full z-[150] backdrop-blur-3xl border-b border-white/10 px-6 py-4 flex justify-between items-center bg-black/40">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg shadow-lg font-black flex items-center justify-center text-white italic">F</div>
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
        
        {/* --- USER STATUS --- */}
        {userOrder && !isAdmin && (
          <motion.div initial={{y: 20}} animate={{y: 0}} className="mb-8 p-6 rounded-[2.5rem] bg-orange-600 text-white shadow-xl shadow-orange-600/20">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status Update</span>
                <span className="bg-white text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{userOrder.status}</span>
            </div>
            <h2 className="text-2xl font-black italic">{userOrder.status === 'Ready' ? '🔥 Ready to Eat!' : '👨‍🍳 Cooking...'}</h2>
            <div className="mt-4 pt-4 border-t border-white/10 text-[10px] font-bold">Bill: ₹{userOrder.total} | ID: {userOrder.id}</div>
          </motion.div>
        )}

        {isAdmin ? (
          /* --- BULLETPROOF ADMIN PANEL --- */
          <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-end px-2">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-orange-500">Live Orders</h2>
                <div className="text-right">
                  <p className="text-[9px] font-black opacity-40 uppercase">Galla</p>
                  <p className="text-lg font-black text-green-500 italic">₹{liveOrders ? liveOrders.reduce((a,b)=>a+(b.total || 0),0) : 0}</p>
                </div>
             </div>
             
             <div className="space-y-4">
                {liveOrders && liveOrders.length > 0 ? (
                  liveOrders.slice().reverse().map(o => (
                    <div key={o.firebaseKey} className="p-5 rounded-3xl bg-zinc-900/60 border border-white/5">
                        <div className="flex justify-between font-bold text-sm mb-2">
                            <span>{o.user?.name || 'Unknown'} <span className="text-[10px] opacity-40">({o.user?.phone || 'No Phone'})</span></span>
                            <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="text-red-500 text-[9px] font-black">CANCEL</button>
                        </div>
                        <div className="text-[10px] opacity-40 mb-4 bg-white/5 p-2 rounded-lg">
                           {o.items ? o.items.map(i => i.name?.en || 'Item').join(', ') : 'No Items'}
                        </div>
                        <div className="flex gap-2">
                            {['Pending', 'Cooking', 'Ready'].map(s => (
                                <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), { status: s })} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${o.status===s ? 'bg-orange-600 text-white' : 'bg-white/5 opacity-20'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center opacity-20 font-black italic">Waiting for orders...</div>
                )}
             </div>

             <h3 className="pt-10 text-center text-[10px] font-black uppercase opacity-30 tracking-[0.5em]">Inventory</h3>
             <div className="grid grid-cols-2 gap-3">
                {menu && menu.map((m, idx) => (
                  <button key={m.id} onClick={() => update(ref(db, `menu/${idx}`), {inStock: !m.inStock})} className={`p-4 rounded-2xl border text-[9px] font-black uppercase transition-all ${m.inStock ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-red-500/20 text-red-500 opacity-40'}`}>
                    {m.name?.en || 'Unknown'} <br/> {m.inStock ? '● IN STOCK' : '○ SOLD OUT'}
                  </button>
                ))}
             </div>
          </div>
        ) : (
          /* --- USER UI --- */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {menu && menu.map((p, idx) => (
              <div key={p.id} className={`relative rounded-[2.5rem] overflow-hidden border transition-all ${isDark ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-lg'} ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                <div className="h-44 overflow-hidden"><img src={p.img} alt={p.name?.en} className="w-full h-full object-cover" /></div>
                <div className="p-5 text-center">
                    <h3 className="font-black text-[11px] uppercase tracking-tight mb-1">{p.name ? p.name[lang] : 'Item'}</h3>
                    <p className="text-orange-500 font-black text-lg italic mb-4">₹{p.price}</p>
                    <button onClick={() => setCart([...cart, p])} disabled={!p.inStock} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Add +</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-white/5 text-center opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">{APP_NAME}</p>
          <div className="flex justify-center gap-6 text-[10px] font-bold">
              <a href="https://github.com/AashrayNarang">GITHUB</a>
              <a href="https://linkedin.com/in/aashraynarang">LINKEDIN</a>
          </div>
      </footer>

      {cart.length > 0 && (
          <button onClick={() => setShowCheckout(true)} className="fixed bottom-8 left-8 right-8 p-6 bg-white text-black rounded-[2.5rem] font-black flex justify-between items-center shadow-2xl z-[100]">
              <span className="text-[10px] uppercase font-black">{lang === 'en' ? 'Review Tray' : 'ਟ੍ਰੇ ਦੇਖੋ'} ({cart.length})</span>
              <span className="text-xl italic font-black">₹{cart.reduce((a,b)=>a+b.price,0)} →</span>
          </button>
      )}

      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{y: '100%'}} animate={{y: 0}} exit={{y: '100%'}} className="fixed inset-0 z-[200] bg-orange-600 p-8 flex flex-col justify-center text-white">
              <h2 className="text-6xl font-black italic mb-10 tracking-tighter uppercase">{lang === 'en' ? 'Checkout' : 'ਪੱਕਾ ਕਰੋ'}</h2>
              <div className="space-y-4">
                  <input placeholder={lang === 'en' ? 'Name' : 'ਨਾਮ'} value={userDetails.name} onChange={e=>setUserDetails({...userDetails, name: e.target.value})} className="w-full p-6 rounded-3xl bg-white/10 border border-white/20 font-black placeholder:text-white/40 outline-none" />
                  <input type="number" placeholder={lang === 'en' ? 'Phone Number' : 'ਫੋਨ ਨੰਬਰ'} value={userDetails.phone} onChange={e=>setUserDetails({...userDetails, phone: e.target.value})} className="w-full p-6 rounded-3xl bg-white/10 border border-white/20 font-black placeholder:text-white/40 outline-none" />
              </div>
              <button onClick={placeOrder} className="w-full mt-8 py-6 bg-white text-orange-600 rounded-[2.5rem] font-black text-2xl shadow-2xl uppercase tracking-tighter">ORDER NOW</button>
              <button onClick={() => setShowCheckout(false)} className="mt-8 font-black uppercase text-[10px] opacity-40 text-black tracking-[0.2em] text-center">Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}