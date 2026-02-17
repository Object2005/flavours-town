import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getDatabase, ref, onValue, push } from "firebase/database";

// Firebase Config
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
  const [view, setView] = useState('menu'); // 'menu', 'cart', 'profile'
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState('en');
  const [vegMode, setVegMode] = useState(true);

  // Banners for Carousel (Based on Screenshot 11.44.29)
  const banners = [
    { id: 1, img: "https://b.zmtcdn.com/webFrontend/e5b8785c25163918ec062ba1ca08b1f31556085331.png", text: "Flat 50% OFF" },
    { id: 2, img: "https://b.zmtcdn.com/webFrontend/7c53d539d91f1737f00d8329b350f58d1584438416.png", text: "Free Delivery" }
  ];

  useEffect(() => {
    const init = async () => {
      await setPersistence(auth, browserLocalPersistence);
      onAuthStateChanged(auth, (u) => setUser(u));
    };
    init();
    onValue(ref(db, 'menu'), (snap) => { if (snap.exists()) setMenu(Object.values(snap.val())); });
  }, []);

  const total = useMemo(() => cart.reduce((t, i) => t + i.price, 0), [cart]);

  const handleOrder = () => {
    if (!user) return signInWithPopup(auth, provider);
    const orderData = { user: user.displayName, items: cart, total, timestamp: Date.now() };
    push(ref(db, 'orders'), orderData);
    const msg = `*NEW ORDER - FT*%0A*Total:* ₹${total}%0A*Customer:* ${user.displayName}`;
    window.open(`https://wa.me/919877474778?text=${msg}`);
    setCart([]); setView('menu');
  };

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-center">
       <h1 className="text-4xl font-black italic text-orange-600 uppercase mb-8">Flavours Town</h1>
       <button onClick={() => signInWithPopup(auth, provider)} className="w-full max-w-sm py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl">Continue with Google</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-100">
      <Head><title>Flavours Town Pro</title></Head>

      {/* --- HEADER --- */}
      <header className="p-4 bg-white sticky top-0 z-50 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-orange-600">📍</span>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase leading-none">Home • Malout ▾</p>
            <h1 className="text-sm font-black tracking-tight">{view === 'cart' ? 'Yadvindra Garden' : 'Green Valley, Malout'}</h1>
          </div>
        </div>
        <img src={user.photoURL} onClick={() => setView('profile')} className="w-10 h-10 rounded-full border-2 border-orange-500 cursor-pointer shadow-sm" />
      </header>

      {/* --- 1. MENU VIEW --- */}
      {view === 'menu' && (
        <div className="pb-32">
          {/* CAROUSEL (Based on Screenshot 11.44.29) */}
          <div className="p-4 overflow-x-auto flex gap-4 no-scrollbar">
            {banners.map(b => (
              <div key={b.id} className="min-w-[85%] h-44 bg-orange-600 rounded-[2.5rem] relative overflow-hidden shadow-lg">
                 <img src={b.img} className="w-full h-full object-cover opacity-80" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-6 flex flex-col justify-center">
                    <p className="text-white font-black text-3xl uppercase italic leading-none">{b.text}</p>
                    <button className="mt-4 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase w-fit">Order Now</button>
                 </div>
              </div>
            ))}
          </div>

          {/* VEG TOGGLE & CATEGORIES */}
          <div className="px-5 py-4 flex justify-between items-center border-b">
             <span className="text-xs font-black uppercase text-gray-400">Recommended for you</span>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-green-600">VEG MODE</span>
                <button onClick={() => setVegMode(!vegMode)} className={`w-8 h-4 rounded-full relative ${vegMode ? 'bg-green-600' : 'bg-gray-300'}`}>
                   <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${vegMode ? 'right-0.5' : 'left-0.5'}`} />
                </button>
             </div>
          </div>

          <main className="p-4 space-y-6">
            {menu.map(item => (
              <div key={item.id} className="bg-white rounded-[2rem] p-4 flex justify-between items-center border border-gray-100 shadow-sm">
                <div className="w-2/3 pr-4">
                  <div className="w-3 h-3 border border-green-600 p-[1px] mb-2"><div className="w-full h-full bg-green-600 rounded-full" /></div>
                  <h3 className="font-black text-sm uppercase leading-tight italic">{item.name?.en || item.name}</h3>
                  <p className="text-orange-600 font-black text-sm mt-1">₹{item.price}</p>
                </div>
                <div className="relative">
                  <img src={item.img} className="w-24 h-24 rounded-2xl object-cover shadow-inner" />
                  <button onClick={() => setCart([...cart, item])} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-green-600 font-black px-5 py-2 rounded-xl shadow-lg border text-[9px] uppercase">Add +</button>
                </div>
              </div>
            ))}
          </main>

          {cart.length > 0 && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-6 left-4 right-4 bg-orange-600 p-5 rounded-2xl flex justify-between items-center text-white shadow-2xl z-[100]">
              <div className="italic"><p className="text-2xl font-black leading-none">₹{total}</p><p className="text-[9px] font-bold opacity-60 uppercase">{cart.length} Item Added</p></div>
              <button onClick={() => setView('cart')} className="bg-white text-orange-600 px-8 py-3 rounded-xl font-black text-[11px] uppercase italic tracking-widest">Next →</button>
            </motion.div>
          )}
        </div>
      )}

      {/* --- 2. CART VIEW (Based on Screenshot 11.49.27) --- */}
      {view === 'cart' && (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="min-h-screen bg-gray-50 pb-40">
          <div className="bg-white p-6 border-b flex items-center gap-4">
            <button onClick={() => setView('menu')} className="text-xl">←</button>
            <h2 className="text-xl font-black italic">Your Tray</h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-orange-100">
               <p className="text-[9px] font-black text-green-600 uppercase mb-4 text-center">Mubarkan! You saved ₹144 on this order 🥳</p>
               {cart.map((i, idx) => (
                 <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50">
                   <div><p className="font-black text-xs uppercase">{i.name?.en || i.name}</p><p className="text-xs font-bold text-gray-400">₹{i.price}</p></div>
                   <div className="bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 text-orange-600 font-black">1</div>
                 </div>
               ))}
            </div>

            <div className="p-2"><h3 className="text-[10px] font-black text-gray-400 uppercase italic">Complete your meal with</h3></div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {[{n:"Gulab Jamun", p:70, i:"🍯"}, {n:"Roti", p:25, i:"🫓"}].map(r => (
                <div key={r.n} className="min-w-[140px] bg-white p-5 rounded-3xl border text-center shadow-sm">
                   <span className="text-3xl">{r.i}</span>
                   <p className="text-[9px] font-black uppercase mt-2">{r.n}</p>
                   <p className="text-xs font-bold text-orange-600">₹{r.p}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white p-6 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t">
             <div className="flex justify-between items-end mb-6">
                <div><p className="text-[8px] font-black opacity-30 uppercase italic">Payable Amount</p><p className="text-4xl font-black italic tracking-tighter leading-none">₹{total}</p></div>
                <div className="text-right"><p className="text-[9px] font-black text-gray-400 uppercase leading-none">Using Google Pay UPI ▾</p></div>
             </div>
             <button onClick={handleOrder} className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] italic shadow-xl">Place Order →</button>
          </div>
        </motion.div>
      )}

      {/* --- 3. PROFILE VIEW (Based on Screenshot 11.44.11) --- */}
      {view === 'profile' && (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="min-h-screen bg-[#0d0d0d] text-white p-6">
          <div className="flex justify-between items-center mb-10">
            <button onClick={() => setView('menu')} className="text-2xl">←</button>
            <h2 className="text-lg font-black uppercase tracking-tighter italic">My Profile</h2>
            <div />
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative"><img src={user.photoURL} className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-[0_0_20px_orange]" /><div className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full border-2 border-black">✎</div></div>
            <h3 className="text-2xl font-black italic uppercase mt-4">{user.displayName}</h3>
            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">{user.email}</p>
          </div>

          <div className="space-y-4">
             <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3"><span>👑</span><p className="text-sm font-black italic uppercase">Gold member</p></div>
                <div className="bg-orange-950 text-orange-400 px-3 py-1 rounded-full text-[9px] font-black uppercase">Saved ₹22</div>
             </div>
             {['Zomato Money', 'Your coupons', 'Address book', 'Your orders'].map(opt => (
               <div key={opt} className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest">{opt}</span>
                  <span className="opacity-20">›</span>
               </div>
             ))}
             <button onClick={() => auth.signOut()} className="w-full py-5 text-red-500 font-black uppercase text-xs tracking-widest mt-10">Logout Account</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}