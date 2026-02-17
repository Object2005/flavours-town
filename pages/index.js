import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, push, set } from "firebase/database";

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
  const [view, setView] = useState('menu'); // menu, cart, profile, support
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState('en');
  const [userProfile, setUserProfile] = useState({ name: '', phone: '', email: '', dob: '' });
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [prepTime, setPrepTime] = useState(20);

  useEffect(() => {
    // Sync Menu & Prep Time
    onValue(ref(db, 'menu'), (snap) => { if(snap.exists()) setMenu(Object.values(snap.val())); });
    onValue(ref(db, 'prep_config'), (snap) => { if(snap.exists()) setPrepTime(snap.val().time); });
    
    // Load local profile if exists
    const saved = localStorage.getItem('ft_profile');
    if(saved) setUserProfile(JSON.parse(saved));
  }, []);

  const total = cart.reduce((a, b) => a + b.price, 0);

  const placeOrder = (method) => {
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = {
        orderId,
        customer: userProfile.name || "Guest User",
        phone: userProfile.phone || "Not Provided",
        items: cart,
        total,
        status: 'Accepted',
        method: method,
        time: new Date().toLocaleTimeString(),
        targetTime: Date.now() + (prepTime * 60000)
    };
    push(ref(db, 'live_orders'), orderData);
    
    if(method === 'WA') {
        window.open(`https://wa.me/919877474778?text=Order ID: ${orderId}%0AItems: ${cart.length}%0ATotal: ₹${total}`);
    } else if (method === 'GPAY') {
        window.location.href = `upi://pay?pa=narangaashray34@okaxis&pn=FlavoursTown&am=${total}&cu=INR`;
    }
    setCart([]); setView('menu'); alert("Order Sent! Track on live timer.");
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-red-100">
      <Head><title>The Flavour Town | Malout</title></Head>

      {/* HEADER */}
      <header className="p-4 bg-white sticky top-0 z-[100] border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="bg-red-600 text-white p-2 rounded-lg font-black italic">FT</div>
           <h1 className="text-sm font-black uppercase italic tracking-tighter">The Flavour Town</h1>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setLang(lang==='en'?'pu':'en')} className="text-[10px] font-black border px-2 py-1 rounded-lg uppercase">{lang==='en'?'ਪੰ':'EN'}</button>
           <button onClick={() => setView('profile')} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">👤</button>
        </div>
      </header>

      {/* STEP 1 & 2 UI LOGIC */}
      {view === 'menu' && (
        <div className="animate-in fade-in duration-500">
            {/* SEARCH */}
            <div className="p-4">
                <div className="bg-gray-100 p-4 rounded-2xl flex items-center gap-3">
                    <span className="opacity-30">🔍</span>
                    <input type="text" placeholder='Search Malai Chaap, Paneer...' className="bg-transparent w-full outline-none text-xs font-bold uppercase" onChange={(e)=>setSearch(e.target.value)} />
                </div>
            </div>

            {/* MENU GRID (19 ITEMS) */}
            <main className="p-4 grid grid-cols-2 gap-4">
                {menu.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map((item, idx) => (
                    <div key={idx} className="bg-white border rounded-[2rem] p-3 shadow-sm relative overflow-hidden">
                        {item.bestSeller && <span className="absolute top-0 right-0 bg-red-600 text-white text-[8px] px-2 py-1 font-black italic">BEST SELLER</span>}
                        <img src={item.img} className="w-full h-24 object-cover rounded-2xl mb-2" />
                        <h3 className="text-[11px] font-black uppercase leading-tight h-8 line-clamp-2">{item.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-black text-red-600">₹{item.price}</span>
                            <button onClick={() => setCart([...cart, item])} className="bg-white border-red-600 border text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Add</button>
                        </div>
                    </div>
                ))}
            </main>
        </div>
      )}

      {/* CART & MULTIPLE PAYMENT OPTIONS (Step 2.8) */}
      <AnimatePresence>
        {cart.length > 0 && view === 'menu' && (
            <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-6 left-4 right-4 bg-red-600 p-5 rounded-2xl flex justify-between items-center text-white shadow-2xl z-[200]">
                <div><p className="text-xl font-black italic">₹{total}</p><p className="text-[9px] font-bold opacity-60 uppercase">Packing Charge Included 📦</p></div>
                <button onClick={() => setView('cart')} className="bg-white text-red-600 px-8 py-3 rounded-xl font-black text-[11px] uppercase italic">Checkout →</button>
            </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT PAGE (Step 2.1) */}
      {view === 'cart' && (
          <div className="min-h-screen bg-gray-50 p-6 animate-in slide-in-from-right duration-300">
              <button onClick={()=>setView('menu')} className="text-xl mb-6">← Back</button>
              <h2 className="text-3xl font-black italic uppercase mb-8">Confirm <span className="text-red-600">Order</span></h2>
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-8">
                  {cart.map((i, idx) => <div key={idx} className="flex justify-between py-2 border-b text-xs font-bold uppercase italic text-gray-500"><span>{i.name}</span><span>₹{i.price}</span></div>)}
                  <div className="flex justify-between mt-6 text-2xl font-black italic"><span>TOTAL</span><span>₹{total}</span></div>
              </div>
              <div className="space-y-3">
                  <button onClick={()=>placeOrder('GPAY')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs">Direct Google Pay 💳</button>
                  <button onClick={()=>placeOrder('WA')} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase text-xs">Order on WhatsApp 📱</button>
                  <button onClick={()=>placeOrder('COD')} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-xs">Cash on Counter 💵</button>
              </div>
          </div>
      )}

      {/* PROFILE & SETTINGS (Step 2.6) */}
      {view === 'profile' && (
          <div className="min-h-screen bg-white p-6 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-10">
                <button onClick={()=>setView('menu')} className="text-2xl">✕</button>
                <h2 className="text-xl font-black uppercase italic">Settings</h2>
                <div />
              </div>
              <div className="space-y-6">
                  <div className="group"><label className="text-[10px] font-black text-gray-400 uppercase">Your Name</label><input type="text" value={userProfile.name} onChange={(e)=>setUserProfile({...userProfile, name:e.target.value})} className="w-full border-b-2 border-gray-100 p-2 outline-none focus:border-red-600 font-bold" /></div>
                  <div className="group"><label className="text-[10px] font-black text-gray-400 uppercase">Phone Number</label><input type="number" value={userProfile.phone} onChange={(e)=>setUserProfile({...userProfile, phone:e.target.value})} className="w-full border-b-2 border-gray-100 p-2 outline-none focus:border-red-600 font-bold" /></div>
                  <button onClick={()=>{localStorage.setItem('ft_profile', JSON.stringify(userProfile)); alert("Profile Saved!");}} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-xs mt-10">Save Details</button>
                  <div className="pt-10 space-y-4 border-t">
                      <button className="w-full text-left font-bold text-sm uppercase opacity-40">📞 Customer Support</button>
                      <button className="w-full text-left font-bold text-sm uppercase opacity-40">🌙 Dark Mode (Coming Soon)</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}