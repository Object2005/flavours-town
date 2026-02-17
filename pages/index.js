import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, push, set, update } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function Home() {
  // --- STATES ---
  const [view, setView] = useState('menu');
  const [cart, setCart] = useState([]);
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [prepTime, setPrepTime] = useState(20);
  const [userProfile, setUserProfile] = useState({ name: '', phone: '', email: '', dob: '' });

  // --- DATA SYNC ---
  useEffect(() => {
    onValue(ref(db, 'menu'), (snap) => {
      if (snap.exists()) setMenu(Object.values(snap.val()));
      setLoading(false);
    });
    onValue(ref(db, 'prep_config/time'), (snap) => {
      if (snap.exists()) setPrepTime(snap.val());
    });
    const saved = localStorage.getItem('ft_user_profile');
    if (saved) setUserProfile(JSON.parse(saved));
  }, []);

  // --- LOGIC ---
  const total = useMemo(() => cart.reduce((a, b) => a + (b.price || 0), 0), [cart]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      let name = typeof item.name === 'object' ? (item.name.en || item.name.pu || "") : (item.name || "");
      return name.toString().toLowerCase().includes(search.toLowerCase());
    });
  }, [menu, search]);

  const placeOrder = (method) => {
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = {
      orderId,
      customer: userProfile.name || "Guest",
      phone: userProfile.phone || "N/A",
      items: cart,
      total: total + 16, // Packing/Service
      status: 'Accepted',
      method,
      time: new Date().toLocaleTimeString(),
      timer: prepTime
    };
    push(ref(db, 'live_orders'), orderData);
    if(method === 'WA') window.open(`https://wa.me/919877474778?text=Order ID: ${orderId}%0ATotal: ₹${total + 16}`);
    setCart([]); setView('menu'); alert("Order Placed! Check Live Timer on Admin Panel.");
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-red-600 animate-pulse">LOADING THE FLAVOUR TOWN...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Head><title>The Flavour Town | Malout</title></Head>

      {/* HEADER & LOGO (Step-1) */}
      <header className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-[100] shadow-sm">
        <div className="flex items-center gap-2">
           <div className="bg-red-600 text-white p-2 rounded-lg font-black italic">FT</div>
           <h1 className="text-sm font-black uppercase italic tracking-tighter">The Flavour Town</h1>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setLang(lang==='en'?'pu':'en')} className="text-[10px] font-black border px-2 py-1 rounded-lg uppercase">{lang==='en'?'ਪੰ':'EN'}</button>
           <button onClick={() => setView('profile')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border shadow-sm transition-all active:scale-90">👤</button>
        </div>
      </header>

      {view === 'menu' && (
        <div className="animate-in fade-in duration-500 pb-40">
          {/* SEARCH (Zomato UI) */}
          <div className="p-4">
             <div className="bg-gray-100 p-4 rounded-2xl flex items-center gap-3 border border-gray-200 shadow-inner">
                <span className="opacity-30 text-lg">🔍</span>
                <input type="text" placeholder='Search "Malai Chaap"...' className="bg-transparent w-full outline-none text-xs font-bold uppercase" onChange={(e)=>setSearch(e.target.value)} />
             </div>
          </div>

          {/* MENU (19 ITEMS LOGIC) */}
          <main className="p-4 space-y-4 max-w-2xl mx-auto">
            {filteredMenu.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-5 border rounded-[2.5rem] shadow-sm bg-white hover:border-red-50 transition-all">
                <div className="w-2/3">
                  <div className="w-3 h-3 border border-green-600 p-[1px] mb-2"><div className="w-full h-full bg-green-600 rounded-full" /></div>
                  <h3 className="font-black text-sm uppercase italic leading-tight">{typeof item.name === 'object' ? item.name.en : item.name}</h3>
                  <p className="text-red-600 font-black text-base mt-1 italic tracking-tighter">₹{item.price}</p>
                </div>
                <div className="relative">
                  <img src={item.img} className="w-24 h-24 rounded-3xl object-cover shadow-inner" />
                  <button onClick={() => setCart([...cart, item])} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-green-600 font-black px-6 py-2 rounded-xl shadow-lg border text-[9px] uppercase italic active:scale-90 transition-all">Add +</button>
                </div>
              </div>
            ))}
          </main>

          {/* STICKY CART (Step 2.8) */}
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-6 left-4 right-4 bg-red-600 p-6 rounded-3xl flex justify-between items-center text-white shadow-[0_20px_50px_rgba(220,38,38,0.3)] z-[150]">
                <div>
                   <p className="text-2xl font-black italic leading-none">₹{total + 16}</p>
                   <p className="text-[8px] font-bold opacity-60 uppercase mt-1 italic tracking-widest">Packing & Processing Added 📦</p>
                </div>
                <button onClick={() => setView('cart')} className="bg-white text-red-600 px-8 py-3 rounded-2xl font-black text-[11px] uppercase italic tracking-widest shadow-xl active:scale-95 transition-all">Checkout →</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* CHECKOUT & PAYMENTS (Step 2.1 & 2.8) */}
      {view === 'cart' && (
        <div className="min-h-screen bg-gray-50 p-6 animate-in slide-in-from-right duration-300">
           <button onClick={()=>setView('menu')} className="text-xl mb-6 flex items-center gap-2 font-black italic uppercase text-[10px] opacity-40">← Back to Menu</button>
           <h2 className="text-3xl font-black italic uppercase mb-8 tracking-tighter">Your <span className="text-red-600">Tray</span></h2>
           <div className="bg-white p-8 rounded-[3rem] shadow-sm mb-8 border border-red-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-2 text-[8px] font-black uppercase italic tracking-widest">ORDER TRACKER LIVE</div>
              {cart.map((i, idx) => (
                 <div key={idx} className="flex justify-between py-3 border-b border-gray-50 last:border-0 text-xs font-black uppercase italic text-gray-400">
                    <span>{typeof i.name === 'object' ? i.name.en : i.name}</span>
                    <span className="text-black">₹{i.price}</span>
                 </div>
              ))}
              <div className="mt-8 pt-8 border-t-2 border-dashed flex justify-between text-2xl font-black italic tracking-tighter text-red-600">
                 <span>TOTAL</span>
                 <span>₹{total + 16}</span>
              </div>
           </div>
           <div className="space-y-3">
              <button onClick={()=>placeOrder('GPAY')} className="w-full bg-[#1A73E8] text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] italic shadow-xl shadow-blue-100">Direct Google Pay 💳</button>
              <button onClick={()=>placeOrder('WA')} className="w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] italic shadow-xl shadow-green-100">Order via WhatsApp 📱</button>
              <button onClick={()=>placeOrder('COD')} className="w-full bg-black text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] italic shadow-xl">Cash on Packing 📦</button>
           </div>
        </div>
      )}

      {/* PROFILE & USER SETTINGS (Step 2.6) */}
      {view === 'profile' && (
        <div className="min-h-screen bg-white p-8 animate-in slide-in-from-bottom duration-300">
           <div className="flex justify-between items-center mb-12">
             <button onClick={()=>setView('menu')} className="text-3xl">✕</button>
             <h2 className="text-lg font-black uppercase italic tracking-widest">Account Details</h2>
             <div />
           </div>
           <div className="space-y-8">
              <div className="group">
                 <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Full Name</label>
                 <input type="text" value={userProfile.name} onChange={(e)=>setUserProfile({...userProfile, name:e.target.value})} className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-red-600 font-black text-xl italic" placeholder="Enter Name" />
              </div>
              <div className="group">
                 <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Phone Number</label>
                 <input type="number" value={userProfile.phone} onChange={(e)=>setUserProfile({...userProfile, phone:e.target.value})} className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-red-600 font-black text-xl italic" placeholder="Phone" />
              </div>
              <button onClick={()=>{localStorage.setItem('ft_user_profile', JSON.stringify(userProfile)); alert("Profile Saved!");}} className="w-full bg-red-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] italic shadow-2xl shadow-red-200 mt-10">Update Profile</button>
              
              <div className="pt-12 space-y-6 border-t">
                  <p className="text-[10px] font-black text-gray-300 uppercase italic">Support & Theme</p>
                  <button className="w-full text-left font-black text-sm uppercase italic flex justify-between">Customer Support 📞 <span className="opacity-20">›</span></button>
                  <button className="w-full text-left font-black text-sm uppercase italic flex justify-between">Language Settings 🌐 <span className="opacity-20">›</span></button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}