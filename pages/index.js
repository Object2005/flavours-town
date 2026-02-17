import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, push, update } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

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
const provider = new GoogleAuthProvider();

export default function Home() {
  const [view, setView] = useState('menu'); // menu, cart, profile
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [menu, setMenu] = useState([]);
  const [lang, setLang] = useState('en'); 
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
    onValue(ref(db, 'menu'), (snap) => {
      if (snap.exists()) setMenu(Object.values(snap.val()));
      setLoading(false);
    });
    // Sync User Orders
    if(user) {
      onValue(ref(db, 'live_orders'), (snap) => {
        if(snap.exists()) {
          const allOrders = Object.values(snap.val());
          setOrders(allOrders.filter(o => o.email === user.email));
        }
      });
    }
  }, [user]);

  const total = useMemo(() => cart.reduce((a, b) => a + (b.price || 0), 0), [cart]);

  // Safe Search Filter (Fixes toLowerCase Crash)
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const name = typeof item.name === 'object' ? (lang === 'en' ? item.name.en : item.name.pu) : item.name;
      return (name || "").toString().toLowerCase().includes(search.toLowerCase());
    });
  }, [menu, search, lang]);

  const placeOrder = (method) => {
    const orderData = {
      customer: user?.displayName || "Guest",
      email: user?.email || "guest@ft.com",
      items: cart,
      total: total + 16,
      status: 'Preparing',
      method,
      time: new Date().toLocaleTimeString(),
    };
    push(ref(db, 'live_orders'), orderData);
    
    if(method === 'GPAY') {
        window.location.href = `upi://pay?pa=narangaashray34@okaxis&pn=FlavourTown&am=${total+16}&cu=INR`;
    } else if(method === 'WA') {
        window.open(`https://wa.me/919877474778?text=OrderID: FT-${Date.now()}%20Total: ₹${total+16}`);
    }
    setCart([]); setView('menu');
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white font-black animate-pulse text-4xl italic">FT.</div>;

  return (
    <div className={`min-h-screen ${lang === 'pu' ? 'font-serif' : 'font-sans'} bg-[#0a0a0a] text-white selection:bg-red-600`}>
      <Head><title>Flavours Town | Agg Edition</title></Head>

      {/* --- FUNKY BOTTOM NAV --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 px-8 py-5 rounded-[3rem] flex gap-12 z-[1000] shadow-2xl">
        <button onClick={() => setView('menu')} className={`text-xl ${view === 'menu' ? 'text-red-500 scale-125' : 'opacity-40'} transition-all`}>🍕</button>
        <button onClick={() => setView('cart')} className={`text-xl ${view === 'cart' ? 'text-red-500 scale-125' : 'opacity-40'} transition-all relative`}>
            🛍️ {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
        </button>
        <button onClick={() => setView('profile')} className={`text-xl ${view === 'profile' ? 'text-red-500 scale-125' : 'opacity-40'} transition-all`}>👤</button>
      </nav>

      {/* --- MENU VIEW --- */}
      {view === 'menu' && (
        <div className="p-6 pb-40">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-black italic tracking-tighter text-red-600">FT.</h1>
            <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="bg-zinc-900 px-4 py-2 rounded-2xl text-[10px] font-black border border-white/5 uppercase">
                {lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English'}
            </button>
          </header>

          <div className="bg-zinc-900 p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 mb-8">
             <span className="opacity-20 text-xl">🔍</span>
             <input type="text" placeholder={lang === 'en' ? "Craving something?" : "ਕੁਝ ਖਾਣਾ ਹੈ?"} className="bg-transparent outline-none w-full font-bold italic" onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="grid gap-6">
            {filteredMenu.map((item, idx) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={idx} className="bg-zinc-900 p-5 rounded-[2.5rem] border border-white/5 flex justify-between items-center group overflow-hidden relative">
                <div className="w-2/3">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-2">
                    {typeof item.name === 'object' ? (lang === 'en' ? item.name.en : item.name.pu) : item.name}
                  </h3>
                  <p className="text-red-500 font-black text-2xl italic tracking-tighter">₹{item.price}</p>
                </div>
                <div className="relative">
                  <img src={item.img} className="w-28 h-28 rounded-[2rem] object-cover border-2 border-white/10 group-hover:scale-110 transition-transform" />
                  <button onClick={() => setCart([...cart, item])} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-black font-black px-6 py-2 rounded-xl text-[10px] uppercase shadow-2xl">Add +</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* --- PROFILE & SETTINGS TAB --- */}
      {view === 'profile' && (
        <div className="p-8 pb-40 animate-in slide-in-from-bottom duration-500">
          <h2 className="text-5xl font-black italic uppercase mb-10 tracking-tighter">My <span className="text-red-600">Soul</span></h2>
          
          {!user ? (
            <div className="bg-zinc-900 p-10 rounded-[3rem] text-center border border-red-900/20 shadow-2xl">
              <p className="text-xs font-bold opacity-40 uppercase mb-6 tracking-widest">Login for Order History</p>
              <button onClick={() => signInWithPopup(auth, provider)} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em]">Sign In with Google</button>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex items-center gap-6 bg-zinc-900 p-8 rounded-[3rem] border border-white/5">
                  <img src={user.photoURL} className="w-20 h-20 rounded-full border-4 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]" />
                  <div>
                    <h3 className="text-2xl font-black italic uppercase">{user.displayName}</h3>
                    <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest italic">{user.email}</p>
                  </div>
               </div>

               {/* Live Order Status for User */}
               <div className="p-2"><h4 className="text-[10px] font-black opacity-30 uppercase italic tracking-[0.3em]">Recent Trackers</h4></div>
               {orders.length === 0 && <p className="opacity-20 text-xs italic p-4 text-center">No active orders...</p>}
               {orders.slice(-3).reverse().map((o, i) => (
                 <div key={i} className="bg-zinc-900 p-6 rounded-[2.5rem] border border-red-600/20 flex justify-between items-center">
                    <div><p className="text-[10px] font-black opacity-40 uppercase">{o.time}</p><p className="font-black italic uppercase text-sm">Status: <span className="text-red-600">{o.status}</span></p></div>
                    <div className="text-right"><p className="text-xl font-black italic">₹{o.total}</p></div>
                 </div>
               ))}

               <div className="bg-zinc-900 p-8 rounded-[3rem] border border-white/5 flex justify-between items-center group cursor-pointer" onClick={() => setLang(lang==='en'?'pu':'en')}>
                  <div className="flex items-center gap-4"><span>🌐</span><p className="text-sm font-black italic uppercase">Change Language</p></div>
                  <span className="opacity-20">›</span>
               </div>
               
               <button onClick={() => signOut(auth)} className="w-full py-6 text-red-600 font-black uppercase text-xs tracking-[0.5em] italic opacity-40 hover:opacity-100 transition-opacity">Logout Account</button>
            </div>
          )}
        </div>
      )}

      {/* --- CART VIEW --- */}
      {view === 'cart' && (
        <div className="p-8 pb-40 animate-in slide-in-from-right duration-500">
           <h2 className="text-5xl font-black italic uppercase mb-10 tracking-tighter">My <span className="text-red-600">Tray</span></h2>
           {cart.length === 0 ? (
             <div className="py-20 text-center opacity-20 font-black italic uppercase tracking-[0.5em]">Tray is empty...</div>
           ) : (
             <div className="space-y-6">
                <div className="bg-zinc-900 p-8 rounded-[3rem] border border-white/5">
                   {cart.map((i, idx) => (
                     <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                        <p className="font-black text-sm uppercase italic opacity-70">{typeof i.name === 'object' ? i.name.en : i.name}</p>
                        <p className="font-black italic">₹{i.price}</p>
                     </div>
                   ))}
                   <div className="flex justify-between items-end mt-10">
                      <div><p className="text-[10px] font-black opacity-30 uppercase mb-1 italic">Total Bill</p><p className="text-4xl font-black italic text-red-600">₹{total + 16}</p></div>
                      <p className="text-[8px] font-black opacity-20 uppercase">Incl. Packing 📦</p>
                   </div>
                </div>
                <div className="grid gap-4">
                   <button onClick={() => placeOrder('GPAY')} className="bg-[#1a73e8] py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] italic shadow-2xl">Open GPay UPI 💳</button>
                   <button onClick={() => placeOrder('WA')} className="bg-[#25D366] py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] italic shadow-2xl">WhatsApp Order 📱</button>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
}