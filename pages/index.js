import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState('en'); // 'en' or 'pu'
  const [activeCat, setActiveCat] = useState('All');
  const [vegOnly, setVegOnly] = useState(true);

  useEffect(() => {
    setMounted(true);
    const initAuth = async () => {
      await setPersistence(auth, browserLocalPersistence);
      onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    };
    initAuth();
    onValue(ref(db, 'menu'), (snap) => { if (snap.exists()) setMenu(Object.values(snap.val())); });
  }, []);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const nameStr = typeof item.name === 'object' ? (item.name.en + item.name.pu) : item.name;
      const matchesSearch = nameStr.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCat === 'All' || item.category === activeCat;
      const matchesVeg = vegOnly ? item.isVeg !== false : true;
      return matchesSearch && matchesCat && matchesVeg;
    });
  }, [menu, search, activeCat, vegOnly]);

  if (!mounted || loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className={`min-h-screen bg-[#F8F8F8] text-black font-sans pb-40`}>
      <Head><title>The Flavour's Town | Malout</title></Head>

      {!user ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
          <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black italic mb-6 shadow-2xl">FT</div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Flavour's Town</h1>
          <button onClick={() => signInWithPopup(auth, provider)} className="w-full max-w-xs py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Continue with Google</button>
        </div>
      ) : (
        <>
          {/* HEADER SECTION (Based on Screenshot 11.44.29) */}
          <header className="bg-white p-5 sticky top-0 z-50 border-b shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <span className="text-orange-600 text-xl">📍</span>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase leading-none">Home • Malout ▾</p>
                  <h1 className="text-sm font-black tracking-tight">Green Valley, Punjab</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="text-[10px] font-black bg-gray-100 px-3 py-2 rounded-lg uppercase">{lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English'}</button>
                <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-orange-500 shadow-md" />
              </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="relative mb-5">
              <input type="text" placeholder={lang === 'en' ? "Search 'Malai Chaap'..." : "ਮਲਾਈ ਚਾਪ ਲੱਭੋ..."} onChange={(e) => setSearch(e.target.value)} className="w-full bg-gray-100 border-none p-4 pl-12 rounded-2xl text-sm font-bold outline-none ring-1 ring-gray-200 focus:ring-orange-500 transition-all" />
              <span className="absolute left-4 top-4 opacity-30 text-lg">🔍</span>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)} className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase transition-all whitespace-nowrap border ${activeCat === cat ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}>{cat}</button>
              ))}
            </div>
          </header>

          {/* VEG MODE TOGGLE */}
          <div className="px-6 py-4 flex justify-between items-center bg-white mt-2 border-b">
             <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center"><div className="w-2 h-2 bg-green-600 rounded-full" /></div>
                <span className="text-xs font-black uppercase tracking-tight">Veg Mode Only</span>
             </div>
             <button onClick={() => setVegOnly(!vegOnly)} className={`w-10 h-5 rounded-full transition-all relative ${vegOnly ? 'bg-green-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${vegOnly ? 'right-1' : 'left-1'}`} />
             </button>
          </div>

          {/* MENU ENGINE (Fixed Object Error #31) */}
          <main className="p-4 grid gap-6 max-w-2xl mx-auto">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Recommended Dishes</h2>
            {filteredMenu.map((item, idx) => (
              <motion.div layout key={idx} className="bg-white rounded-[2.5rem] p-5 border border-gray-100 flex justify-between items-center shadow-sm">
                <div className="w-2/3 pr-4 text-left">
                  <div className="w-3 h-3 border border-green-600 p-[1px] mb-2"><div className="w-full h-full bg-green-600 rounded-full" /></div>
                  <h3 className="font-black text-base uppercase leading-tight italic">
                    {typeof item.name === 'object' ? (lang === 'en' ? item.name.en : item.name.pu) : item.name}
                  </h3>
                  <p className="text-orange-600 font-black text-lg mt-1 tracking-tighter italic">₹{item.price}</p>
                  <p className="text-[10px] text-gray-400 mt-2 line-clamp-2 leading-tight font-bold italic">Authentic taste of Malout, prepared with secret ingredients.</p>
                </div>
                <div className="relative">
                  <img src={item.img} className="w-28 h-28 rounded-[2rem] object-cover shadow-inner border border-gray-50" />
                  <button onClick={() => setCart([...cart, item])} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-green-600 font-black px-6 py-2 rounded-xl shadow-xl border border-gray-100 text-[10px] uppercase active:scale-90 transition-all">Add <span className="text-[8px] align-top ml-1">+</span></button>
                </div>
              </motion.div>
            ))}
          </main>

          {/* CHECKOUT BAR */}
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-8 left-4 right-4 bg-orange-600 p-6 rounded-[2.5rem] flex justify-between items-center text-white shadow-[0_25px_60px_rgba(234,88,12,0.4)] z-[100] border-t border-orange-400">
                <div className="italic">
                   <p className="text-2xl font-black tracking-tighter leading-none">₹{cart.reduce((t, i) => t + i.price, 0)}</p>
                   <p className="text-[9px] font-black uppercase opacity-60">{cart.length} Item Added</p>
                </div>
                <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest italic shadow-lg active:scale-95 transition-all">View Cart →</button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}