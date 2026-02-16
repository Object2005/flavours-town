import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// --- CONFIG ---
const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const APP_NAME = "The Flavours Town";

export default function Home() {
  const router = useRouter();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (!saved) router.push('/auth');
    else setUser(JSON.parse(saved));

    onValue(ref(db, 'menu'), snap => {
      setMenu(snap.exists() ? snap.val() : []);
      setLoading(false);
    });
  }, [router]);

  const total = cart.reduce((a, b) => a + (b.price || 0), 0);

  if (loading || !user) return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#1a1a1a] font-sans">
      <Head><title>{APP_NAME}</title></Head>

      {/* --- FLOATING HEADER --- */}
      <header className="fixed top-5 left-5 right-5 z-[100] bg-white/80 backdrop-blur-xl border border-white/20 px-6 py-4 flex justify-between items-center rounded-3xl shadow-sm">
        <h1 className="font-black italic text-orange-600 text-lg uppercase tracking-tighter">
          {APP_NAME}
        </h1>
        <div className="flex items-center gap-2 bg-gray-100/50 px-4 py-2 rounded-full">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Hi, {user.name.split(' ')[0]}</span>
        </div>
      </header>

      <main className="pt-32 pb-44 px-6 max-w-5xl mx-auto">
        {/* --- HERO SECTION --- */}
        <section className="mb-12">
            <h2 className="text-5xl font-black italic tracking-tighter leading-[0.9] mb-4 text-gray-900 uppercase">
                Malout’s Most <br/> 
                <span className="text-orange-600 relative inline-block">
                  Wanted
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-orange-600/10 -z-10"></span>
                </span> Taste.
            </h2>
            <p className="text-[11px] font-bold opacity-40 uppercase tracking-[0.2em]">Freshly cooked every single day</p>
        </section>

        {/* --- MENU GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menu.map((p, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              key={p.id} 
              className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative h-60 overflow-hidden bg-gray-50">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={p.img} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black italic shadow-sm">
                  ₹{p.price}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-black uppercase tracking-tight text-gray-800 mb-1">{p.name?.en}</h3>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-6 italic">Fresh & Hot</p>

                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCart([...cart, p])}
                  disabled={!p.inStock}
                  className="w-full py-4 bg-[#1a1a1a] hover:bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                >
                  {p.inStock ? 'Add to Tray +' : 'Sold Out'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- FLOATING CHECKOUT BAR --- */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-5 right-5 z-[200] max-w-lg mx-auto"
          >
            <div className="bg-white/90 backdrop-blur-2xl border border-white/20 p-5 rounded-[2.5rem] shadow-2xl flex justify-between items-center px-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Tray Total</span>
                <span className="text-2xl font-black italic text-gray-900">₹{total}</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 text-white px-10 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/30"
              >
                Place Order →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}