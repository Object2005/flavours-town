import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, push } from "firebase/database";
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
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('menu');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [menu, setMenu] = useState([]);
  const [lang, setLang] = useState('en'); 
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setMounted(true);
    onAuthStateChanged(auth, (u) => setUser(u));
    
    const menuRef = ref(db, 'menu');
    onValue(menuRef, (snap) => {
      if (snap.exists()) setMenu(Object.values(snap.val()));
    });
  }, []);

  const total = useMemo(() => cart.reduce((a, b) => a + (Number(b.price) || 0), 0), [cart]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const name = typeof item.name === 'object' ? (lang === 'en' ? item.name.en : item.name.pu) : item.name;
      return (name || "").toString().toLowerCase().includes(search.toLowerCase());
    });
  }, [menu, search, lang]);

  if (!mounted) return null; // CRITICAL: Fixes Client-side exception

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-red-600 pb-32">
      <Head><title>FT | The Flavour Town</title></Head>

      {/* --- FUNKY GLASS NAV --- */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/10 px-10 py-5 rounded-[3rem] flex gap-12 z-[1000] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <button onClick={() => setView('menu')} className={`text-2xl ${view === 'menu' ? 'scale-150 text-red-500' : 'opacity-30'} transition-all`}>🍕</button>
        <button onClick={() => setView('cart')} className={`text-2xl ${view === 'cart' ? 'scale-150 text-red-500' : 'opacity-30'} transition-all relative`}>
            🛍️ {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
        </button>
        <button onClick={() => setView('profile')} className={`text-2xl ${view === 'profile' ? 'scale-150 text-red-500' : 'opacity-30'} transition-all`}>👤</button>
      </nav>

      {/* --- MENU VIEW --- */}
      {view === 'menu' && (
        <div className="p-6">
          <header className="flex justify-between items-center mb-8 pt-4">
            <h1 className="text-5xl font-black italic tracking-tighter text-red-600">FT.</h1>
            <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-[10px] font-black uppercase italic">
                {lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English'}
            </button>
          </header>

          <div className="bg-zinc-900/50 p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 mb-10 shadow-inner">
             <span className="opacity-20 text-xl">🔍</span>
             <input type="text" placeholder={lang === 'en' ? "Search flavours..." : "ਲੱਭੋ..."} className="bg-transparent outline-none w-full font-bold italic text-sm" onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="grid gap-6 max-w-2xl mx-auto">
            {filteredMenu.map((item, idx) => (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key={idx} className="bg-zinc-900/40 p-5 rounded-[2.5rem] border border-white/5 flex justify-between items-center group relative overflow-hidden backdrop-blur-sm">
                <div className="w-2/3">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-2">
                    {typeof item.name === 'object' ? (lang === 'en' ? item.name.en : item.name.pu) : item.name}
                  </h3>
                  <p className="text-red-500 font-black text-2xl italic">₹{item.price}</p>
                </div>
                <div className="relative">
                  <img src={item.img} className="w-28 h-28 rounded-[2rem] object-cover border border-white/10" />
                  <button onClick={() => setCart([...cart, item])} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-black font-black px-6 py-2 rounded-xl text-[10px] uppercase shadow-2xl active:scale-90 transition-all">Add +</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* --- PROFILE TAB (Gen-Z Style) --- */}
      {view === 'profile' && (
        <div className="p-8 animate-in slide-in-from-bottom duration-500">
          <h2 className="text-6xl font-black italic uppercase mb-10 tracking-tighter">My <span className="text-red-600">Account</span></h2>
          {!user ? (
            <div className="bg-zinc-900/50 p-10 rounded-[3rem] text-center border border-white/5 shadow-2xl">
              <p className="text-xs font-bold opacity-30 uppercase mb-8 tracking-[0.3em]">Login for Order History</p>
              <button onClick={() => signInWithPopup(auth, provider)} className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Sign In with Google</button>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex items-center gap-6 bg-zinc-900 p-8 rounded-[3rem] border border-white/5 shadow-lg">
                  <img src={user.photoURL} className="w-20 h-20 rounded-full border-4 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]" />
                  <div>
                    <h3 className="text-2xl font-black italic uppercase leading-none">{user.displayName}</h3>
                    <p className="text-[10px] font-bold opacity-30 uppercase mt-2">{user.email}</p>
                  </div>
               </div>
               <div className="bg-zinc-900/50 p-8 rounded-[3rem] border border-white/5 flex justify-between items-center group cursor-pointer" onClick={() => setLang(lang==='en'?'pu':'en')}>
                  <div className="flex items-center gap-4"><span>🌍</span><p className="text-sm font-black italic uppercase">Change Language</p></div>
                  <span className="opacity-20 text-2xl">›</span>
               </div>
               <button onClick={() => signOut(auth)} className="w-full py-6 text-red-600 font-black uppercase text-xs tracking-[0.5em] italic opacity-40 hover:opacity-100 transition-opacity underline underline-offset-8">Logout</button>
            </div>
          )}
        </div>
      )}

      {/* --- CART VIEW --- */}
      {view === 'cart' && (
        <div className="p-8 animate-in slide-in-from-right duration-500">
           <h2 className="text-6xl font-black italic uppercase mb-10 tracking-tighter">Your <span className="text-red-600">Tray</span></h2>
           {cart.length === 0 ? (
             <div className="py-20 text-center opacity-20 font-black italic uppercase tracking-[0.5em]">Tray is empty...</div>
           ) : (
             <div className="space-y-6">
                <div className="bg-zinc-900 p-8 rounded-[3rem] border border-white/10 shadow-inner">
                   {cart.map((i, idx) => (
                     <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                        <p className="font-black text-xs uppercase italic opacity-60">{typeof i.name === 'object' ? i.name.en : i.name}</p>
                        <p className="font-black italic text-sm">₹{i.price}</p>
                     </div>
                   ))}
                   <div className="flex justify-between items-end mt-12 pt-6 border-t border-dashed border-white/10">
                      <div><p className="text-[10px] font-black opacity-30 uppercase mb-2 italic">Grand Total</p><p className="text-5xl font-black italic text-red-600 tracking-tighter">₹{total + 16}</p></div>
                      <p className="text-[9px] font-black opacity-30 uppercase italic mb-2">Incl. Packing</p>
                   </div>
                </div>
                <div className="grid gap-4">
                   <button onClick={() => window.location.href = `upi://pay?pa=narangaashray34@okaxis&pn=FlavourTown&am=${total+16}&cu=INR`} className="bg-[#1a73e8] py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] italic shadow-2xl active:scale-95 transition-all">Google Pay UPI 💳</button>
                   <button onClick={() => window.open(`https://wa.me/919877474778?text=OrderID: FT-${Date.now()}`)} className="bg-[#25D366] py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] italic shadow-2xl active:scale-95 transition-all">WhatsApp Order 📱</button>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
}