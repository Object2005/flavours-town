import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, push } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function LuxuryCafe() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('menu');
  const [cart, setCart] = useState([]);
  const [menu, setMenu] = useState([]);
  const [servingToken, setServingToken] = useState(0);

  useEffect(() => {
    setMounted(true);
    onValue(ref(db, 'menu'), (snap) => { if(snap.exists()) setMenu(Object.values(snap.val())); });
    onValue(ref(db, 'queue/current'), (snap) => { if(snap.exists()) setServingToken(snap.val()); });
  }, []);

  const total = cart.reduce((a, b) => a + (Number(b.price) || 0), 0);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-serif selection:bg-[#d4af37]">
      <Head><title>FT | The Royal Lounge</title></Head>

      {/* --- ELITE TOP NAV --- */}
      <header className="p-8 flex flex-col items-center border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 mb-2">Est. 2026 • Malout</p>
        <h1 className="text-4xl font-light italic tracking-widest text-[#1a1a1a]">The Flavour Town</h1>
        <div className="w-12 h-[1px] bg-[#d4af37] mt-4"></div>
      </header>

      {/* --- LIVE QUEUE HUD (Royal Style) --- */}
      <div className="p-8 text-center bg-white">
        <p className="text-[10px] uppercase tracking-widest opacity-40">Currently Hosting Sequence</p>
        <h2 className="text-5xl font-light italic mt-2 text-[#d4af37]">#{servingToken}</h2>
      </div>

      {/* --- MENU VIEW --- */}
      {view === 'menu' && (
        <main className="max-w-xl mx-auto p-6 space-y-20 pb-40">
          {menu.map((item, idx) => (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} key={idx} className="group text-center">
              <div className="overflow-hidden rounded-sm mb-6 shadow-xl">
                <img src={item.img} className="w-full h-[400px] object-cover transition-transform duration-1000 group-hover:scale-110" />
              </div>
              <h3 className="text-2xl font-normal italic tracking-tight mb-2 uppercase">{item.name}</h3>
              <p className="text-xs uppercase tracking-widest opacity-40 mb-4 px-10 leading-relaxed italic">Handcrafted with premium ingredients, prepared fresh on your command.</p>
              <div className="flex justify-center items-center gap-6">
                <span className="text-xl font-light text-[#d4af37]">₹{item.price}</span>
                <button 
                  onClick={() => setCart([...cart, item])}
                  className="border border-black px-8 py-2 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500"
                >
                  Reserve Item
                </button>
              </div>
            </motion.div>
          ))}
        </main>
      )}

      {/* --- MINIMAL CART (Floating Bar) --- */}
      {cart.length > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 p-8 flex justify-between items-center z-[100] shadow-2xl">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] opacity-40 mb-1">Your Selection</p>
            <p className="text-2xl font-light italic">₹{total + 25} <span className="text-[10px] opacity-30 not-italic">Inc. Service</span></p>
          </div>
          <button 
            onClick={() => setView('checkout')}
            className="bg-black text-white px-12 py-4 text-[10px] uppercase tracking-[0.4em] hover:bg-[#d4af37] transition-all"
          >
            Confirm Reservation
          </button>
        </motion.div>
      )}

      {/* --- CHECKOUT (Luxury Form) --- */}
      {view === 'checkout' && (
        <div className="fixed inset-0 bg-white z-[200] p-12 overflow-y-auto animate-in fade-in duration-700">
           <button onClick={() => setView('menu')} className="text-xs uppercase tracking-widest border-b border-black pb-1 mb-20 italic">← Back to Gallery</button>
           <h2 className="text-6xl font-light italic mb-16 tracking-tighter">Confirm <br/><span className="text-[#d4af37]">Experience</span></h2>
           
           <div className="space-y-6 mb-20">
             {cart.map((i, idx) => (
               <div key={idx} className="flex justify-between border-b border-black/5 pb-4 italic text-sm">
                  <span>{i.name}</span>
                  <span className="text-[#d4af37]">₹{i.price}</span>
               </div>
             ))}
             <div className="flex justify-between text-2xl font-light pt-10">
                <span>Total Invitation</span>
                <span className="text-[#d4af37]">₹{total + 25}</span>
             </div>
           </div>

           <button className="w-full bg-black text-white py-6 text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:bg-[#d4af37] transition-all">
             Place Order Now
           </button>
        </div>
      )}
    </div>
  );
}