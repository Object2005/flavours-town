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
    if (saved) try { setUserDetails(JSON.parse(saved)); } catch(e) {}

    onValue(ref(db, 'menu'), (snap) => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'orders'), (snap) => {
      if (snap.exists()) {
        const orders = Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k}));
        setLiveOrders(orders);
        setUserOrder(orders.find(o => o.user?.phone === userDetails.phone) || null);
      }
    });
  }, [userDetails.phone]);

  // --- 💡 RECOMMENDATION LOGIC ---
  const suggestions = menu?.filter(item => 
    (item.category === "Rolls" || item.category === "Sweets" || item.name.en.includes("Roti")) && 
    !cart.find(c => c.id === item.id)
  ).slice(0, 3);

  const itemTotal = cart.reduce((a, b) => a + b.price, 0);
  const packingCharge = itemTotal > 0 ? 10 : 0;
  const grandTotal = itemTotal + packingCharge;

  const placeOrder = () => {
    if (!userDetails.name || userDetails.phone.length < 10) return alert("Sahi details bharo!");
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    set(ref(db, 'orders/' + orderId), {
        id: orderId, user: userDetails, items: cart,
        total: grandTotal, status: 'Pending', timestamp: new Date().toISOString()
    });
    localStorage.setItem('ft_user', JSON.stringify(userDetails));
    setCart([]); setShowCheckout(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fcfcfc] text-black'} font-sans`}>
      <Head><title>{APP_NAME}</title></Head>

      <header className="fixed top-0 w-full z-[150] backdrop-blur-3xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <h1 className="font-black text-sm italic text-orange-500 uppercase tracking-tighter">{APP_NAME}</h1>
        <div className="flex gap-4 items-center">
            <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="text-[10px] font-black opacity-60 uppercase">{lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English'}</button>
            <button onClick={() => { const p=prompt("Pass:"); if(p===ADMIN_PASS) setIsAdmin(!isAdmin); }} className="opacity-10 text-[8px]">⚙️</button>
        </div>
      </header>

      <main className="pt-24 pb-40 px-4 max-w-5xl mx-auto">
        {isAdmin ? (
          <div className="space-y-6">
             <div className="p-6 rounded-[2rem] bg-orange-600/10 border border-orange-600/20">
                <p className="text-[10px] font-black opacity-60 uppercase mb-1 tracking-widest">Live Revenue</p>
                <h2 className="text-3xl font-black text-orange-500 italic">₹{liveOrders.reduce((a,b)=>a+(b.total||0),0)}</h2>
             </div>
             {liveOrders.slice().reverse().map(o => (
               <div key={o.id} className="p-5 rounded-3xl bg-zinc-900/40 border border-white/5 mb-4">
                  <div className="flex justify-between font-bold text-sm mb-4">
                    <span>{o.user?.name} ({o.user?.phone})</span>
                    <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="text-red-500 text-[10px] font-black">X</button>
                  </div>
                  <div className="flex gap-2">
                    {['Pending', 'Cooking', 'Ready'].map(s => (
                      <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status:s})} className={`flex-1 py-3 rounded-xl text-[9px] font-black ${o.status===s ? 'bg-orange-600' : 'bg-white/5 opacity-20'}`}>{s}</button>
                    ))}
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {menu.map(p => (
              <motion.div whileTap={{scale:0.95}} key={p.id} className={`rounded-[2.5rem] bg-white/5 border border-white/5 overflow-hidden ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                <div className="h-40 bg-zinc-800"><img src={p.img} className="w-full h-full object-cover" /></div>
                <div className="p-4 text-center">
                  <h3 className="text-[11px] font-black uppercase mb-1">{p.name[lang]}</h3>
                  <p className="text-orange-500 font-black mb-4 italic">₹{p.price}</p>
                  <button onClick={() => setCart([...cart, p])} className="w-full py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase">Add +</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* --- CART & BILLING (BLINKIT STYLE) --- */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{y:100}} animate={{y:0}} className={`fixed bottom-0 left-0 right-0 z-[200] p-6 rounded-t-[3rem] border-t border-white/10 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white shadow-2xl'}`}>
            <div className="max-w-xl mx-auto">
              {/* RECOMMENDATIONS */}
              <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-3">Add on for better taste?</p>
              <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
                {suggestions.map(s => (
                  <button key={s.id} onClick={() => setCart([...cart, s])} className="flex-shrink-0 px-4 py-2 rounded-full border border-orange-600/30 text-[9px] font-black uppercase text-orange-500">+ {s.name[lang]}</button>
                ))}
              </div>

              {/* COMPACT BILL */}
              <div className="space-y-2 mb-6 opacity-80">
                <div className="flex justify-between text-[10px] font-bold uppercase"><span>Item Total</span><span>₹{itemTotal}</span></div>
                <div className="flex justify-between text-[10px] font-bold uppercase text-green-500"><span>Packing Fee</span><span>₹{packingCharge}</span></div>
                <div className="flex justify-between text-lg font-black italic border-t border-white/5 pt-2"><span>GRAND TOTAL</span><span>₹{grandTotal}</span></div>
              </div>

              <button onClick={() => setShowCheckout(true)} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-600/30">Proceed to Checkout →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CHECKOUT DRAWER --- */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 z-[300] bg-black p-8 flex flex-col justify-center">
            <h2 className="text-5xl font-black italic mb-10 text-orange-500 uppercase tracking-tighter">Your Info</h2>
            <div className="space-y-4 mb-8">
              <input placeholder="Name" value={userDetails.name} onChange={e=>setUserDetails({...userDetails, name:e.target.value})} className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 font-black outline-none focus:border-orange-500" />
              <input type="number" placeholder="Mobile No." value={userDetails.phone} onChange={e=>setUserDetails({...userDetails, phone:e.target.value})} className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 font-black outline-none focus:border-orange-500" />
            </div>
            <button onClick={placeOrder} className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black text-xl mb-4 shadow-2xl">CONFIRM ORDER</button>
            <button onClick={()=>setShowCheckout(false)} className="opacity-30 text-[10px] font-black uppercase tracking-[0.3em] text-center">Go Back</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}