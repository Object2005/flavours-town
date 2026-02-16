import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- SETTINGS & INFO ---
const OWNER_NUM = "919877474778"; 
const DEV_NAME = "Aashray Narang";
const DEV_LINKS = { git: "https://github.com/aashray", linkedin: "https://linkedin.com/in/aashray" };

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [userOrder, setUserOrder] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [lang, setLang] = useState('EN'); // EN, HI, PB
  const [darkMode, setDarkMode] = useState(false);

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
    const bill = cart.reduce((a,b)=>a+b.price,0);
    const orderData = { id: orderId, user, items: cart, total: bill, status: 'Received', timestamp: new Date().toISOString() };
    
    set(ref(db, 'orders/' + orderId), orderData);
    setCart([]);
    // Notification to Owner
    window.open(`https://wa.me/${OWNER_NUM}?text=New Order from ${user.name}! ID: ${orderId}, Total: ₹${bill}`, '_blank');
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen font-sans pb-44 transition-colors duration-500 ${darkMode ? 'bg-[#121212] text-white' : 'bg-[#fcfbf7] text-[#1a1a1a]'}`}>
      <Head><title>The Flavours Town</title></Head>
      
      {/* --- HEADER --- */}
      <header className={`fixed top-0 w-full z-50 border-b px-6 py-4 flex justify-between items-center ${darkMode ? 'bg-[#121212]/80 border-white/10' : 'bg-white/80 border-gray-100'} backdrop-blur-md`}>
        <div className="flex flex-col">
            <h1 className="font-black text-orange-600 italic leading-none">THE FLAVOURS TOWN</h1>
            <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest mt-1">By {DEV_NAME}</span>
        </div>
        <div className="flex gap-3">
            <button onClick={()=>setDarkMode(!darkMode)} className="text-lg">{darkMode ? '☀️' : '🌙'}</button>
            <button onClick={()=>setLang(lang === 'EN' ? 'PB' : 'EN')} className="text-[10px] font-black border px-2 py-1 rounded-md">{lang}</button>
        </div>
      </header>

      <main className="pt-24 px-4 max-w-4xl mx-auto">
        {/* --- LIVE WHATSAPP STYLE ALERT --- */}
        {userOrder && (
          <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="mb-8 p-5 bg-green-600 text-white rounded-[2rem] shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full italic font-black text-xs">FT</div>
                <div>
                    <p className="text-[10px] font-black uppercase opacity-60 leading-none mb-1 tracking-tighter">Live Update</p>
                    <p className="text-sm font-bold italic">Order #{userOrder.id} is {userOrder.status}!</p>
                </div>
            </div>
            <span className="text-xl">🔥</span>
          </motion.div>
        )}

        {/* --- MENU --- */}
        <div className="grid grid-cols-2 gap-4">
          {menu.map(p => (
            <div key={p.id} className={`rounded-[2.5rem] p-4 border transition-all ${darkMode ? 'bg-[#1e1e1e] border-white/5' : 'bg-white border-gray-50'} ${!p.inStock || !isShopOpen ? 'opacity-30 grayscale' : ''}`}>
              <img src={p.img} className="w-full h-32 object-cover rounded-[1.5rem] mb-3" />
              <h3 className="text-[11px] font-black uppercase mb-1">{lang === 'EN' ? p.name.en : 'ਪਨੀਰ ਟਿੱਕਾ'}</h3>
              <p className="text-orange-600 font-black italic">₹{p.price}</p>
              <button onClick={() => setCart([...cart, p])} disabled={!isShopOpen || !p.inStock} className={`w-full mt-3 py-3 rounded-xl text-[10px] font-black uppercase ${darkMode ? 'bg-orange-600 text-white' : 'bg-[#1a1a1a] text-white'}`}>Add +</button>
            </div>
          ))}
        </div>

        {/* --- DEVELOPER FOOTER --- */}
        <footer className="mt-20 py-10 border-t border-gray-100 text-center opacity-30">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-4">Developed by {DEV_NAME}</p>
            <div className="flex justify-center gap-6">
                <a href={DEV_LINKS.git} className="text-[10px] font-black underline">GITHUB</a>
                <a href={DEV_LINKS.linkedin} className="text-[10px] font-black underline">LINKEDIN</a>
            </div>
        </footer>
      </main>

      {/* --- CART --- */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{y:100}} animate={{y:0}} className={`fixed bottom-0 left-0 right-0 p-8 border-t rounded-t-[3rem] shadow-2xl z-[100] ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-100'}`}>
             <button onClick={placeOrder} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase flex justify-between px-10 items-center shadow-xl shadow-orange-600/30">
                <span>Confirm Tray</span>
                <span className="text-lg italic font-black">₹{cart.reduce((a,b)=>a+b.price,0)} →</span>
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}