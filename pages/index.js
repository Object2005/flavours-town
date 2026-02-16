import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- DEVELOPER & OWNER INFO ---
const OWNER_NUM = "919877474778"; 
const DEV_NAME = "Aashray Narang";
const DEV_LINKS = { git: "https://github.com/aashray", linkedin: "https://linkedin.com/in/aashray" };

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [userOrder, setUserOrder] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState('EN'); 
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (saved) setUser(JSON.parse(saved));

    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.val() === true));
    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'orders'), snap => {
      if (snap.exists() && saved) {
        const u = JSON.parse(saved);
        const active = Object.values(snap.val()).find(o => o.user?.phone === u.phone && o.status !== 'Delivered');
        setUserOrder(active || null);
      }
    });
  }, []);

  const placeOrder = () => {
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const total = cart.reduce((a, b) => a + b.price, 0);
    const orderData = { id: orderId, user, items: cart, total, status: 'Received', timestamp: new Date().toISOString() };
    set(ref(db, 'orders/' + orderId), orderData);
    window.open(`https://wa.me/${OWNER_NUM}?text=New Order: ${orderId}, Total: ₹${total}`, '_blank');
    setCart([]);
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen font-sans pb-44 transition-all duration-500 ${darkMode ? 'bg-[#121212] text-white' : 'bg-[#fcfbf7] text-[#1a1a1a]'}`}>
      <Head><title>The Flavours Town</title></Head>

      {/* --- HEADER --- */}
      <header className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center border-b transition-colors ${darkMode ? 'bg-[#121212]/80 border-white/10' : 'bg-white/80 border-gray-100'} backdrop-blur-xl`}>
        <div className="flex flex-col">
          <h1 className="font-black italic text-orange-600 leading-none">THE FLAVOURS TOWN</h1>
          <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest mt-1 italic">Dev by {DEV_NAME}</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowSettings(!showSettings)} className="text-xl">⚙️</button>
          <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-[10px] font-black text-white">{user.name[0]}</div>
        </div>
      </header>

      {/* --- SETTINGS DRAWER (ZOMATO STYLE) --- */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className={`fixed inset-y-0 right-0 w-80 z-[200] p-8 shadow-2xl transition-colors ${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
             <button onClick={() => setShowSettings(false)} className="mb-10 text-xs font-black uppercase tracking-widest opacity-40">← Back</button>
             <h2 className="text-2xl font-black italic mb-8 uppercase tracking-tighter text-orange-600 underline decoration-4 underline-offset-4">Settings</h2>
             
             <div className="space-y-8">
                <div className="flex justify-between items-center">
                   <span className="text-xs font-black uppercase tracking-widest italic">Language</span>
                   <button onClick={() => setLang(lang === 'EN' ? 'PB' : 'EN')} className="bg-gray-100 px-4 py-1 rounded-full text-[10px] font-black">{lang}</button>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs font-black uppercase tracking-widest italic">Theme</span>
                   <button onClick={() => setDarkMode(!darkMode)} className="text-xl">{darkMode ? '☀️' : '🌙'}</button>
                </div>
                <div className="pt-10 border-t border-gray-100">
                   <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.3em] mb-4 text-center">Developer Profile</p>
                   <div className="flex flex-col gap-3">
                      <a href={DEV_LINKS.linkedin} className="py-4 bg-blue-600 text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest">LinkedIn</a>
                      <a href={DEV_LINKS.git} className="py-4 bg-[#1a1a1a] text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest border border-white/10">GitHub</a>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-28 px-4 max-w-4xl mx-auto">
        {/* --- LIVE WHATSAPP ALERT --- */}
        {userOrder && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8 p-6 bg-green-600 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">Live Alert</span>
                <span className="text-xl opacity-40">💬</span>
             </div>
             <p className="text-sm font-black italic">Order #{userOrder.id} is {userOrder.status}! 🥘🔥</p>
             <div className="absolute top-0 right-0 w-20 h-full bg-white/10 skew-x-12 translate-x-10 pointer-events-none" />
          </motion.div>
        )}

        {/* --- MENU GRID --- */}
        <div className="grid grid-cols-2 gap-4">
          {menu.map(p => (
            <div key={p.id} className={`rounded-[2.5rem] border overflow-hidden p-4 transition-all duration-300 ${darkMode ? 'bg-[#1e1e1e] border-white/5 shadow-white/5 shadow-lg' : 'bg-white border-gray-100 shadow-sm'} ${(!p.inStock || !isShopOpen) ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
               <div className="h-32 rounded-3xl overflow-hidden mb-4"><img src={p.img} className="w-full h-full object-cover" /></div>
               <h3 className="text-[11px] font-black uppercase tracking-tighter mb-1 truncate">{lang === 'EN' ? p.name.en : 'ਪਨੀਰ ਟਿੱਕਾ'}</h3>
               <p className="text-orange-600 font-black italic text-lg mb-4">₹{p.price}</p>
               <button onClick={() => setCart([...cart, p])} className="w-full py-3 bg-[#1a1a1a] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors">Add +</button>
            </div>
          ))}
        </div>
      </main>

      {/* --- CART DRAWER --- */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className={`fixed bottom-0 left-0 right-0 p-8 border-t rounded-t-[3.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-[100] ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
            <div className="max-w-md mx-auto flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">Grand Total</p>
                <h2 className="text-3xl font-black italic text-orange-600 tracking-tighter">₹{cart.reduce((a, b) => a + b.price, 0)}</h2>
              </div>
              <button onClick={placeOrder} className="px-10 py-5 bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-600/30">Order Now →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}