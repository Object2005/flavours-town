import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, update } from "firebase/database";

// Firebase Config (Keep as is)
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
  const [step, setStep] = useState('menu'); // 'menu', 'cart', 'profile'
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [vegMode, setVegMode] = useState(true);

  const RECO_ITEMS = [
    { id: 'r1', name: "Gulab Jamun [2 Pieces]", price: 70, img: "🍯" },
    { id: 'r2', name: "Missi Roti", price: 50, img: "🫓" },
    { id: 'r3', name: "Roti", price: 25, img: "🥯" }
  ];

  useEffect(() => {
    setMounted(true);
    onAuthStateChanged(auth, (u) => setUser(u));
    onValue(ref(db, 'menu'), (snap) => {
      if (snap.exists()) setMenu(Object.values(snap.val()));
    });
  }, []);

  const total = useMemo(() => cart.reduce((t, i) => t + i.price, 0), [cart]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      <Head><title>Flavours Town Pro</title></Head>

      {/* --- STEP 1: MENU VIEW --- */}
      {step === 'menu' && (
        <div className="pb-32">
          <header className="bg-white p-5 sticky top-0 z-50 border-b">
            <div className="flex justify-between items-center mb-4">
              <div onClick={() => setStep('profile')} className="flex items-center gap-2 cursor-pointer">
                <span className="text-orange-600 text-xl">📍</span>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase leading-none italic">Home • Malout 📍</p>
                  <h1 className="text-sm font-black tracking-tight">House No 34 Green Valley... ▾</h1>
                </div>
              </div>
              <img src={user?.photoURL || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full border shadow-sm" onClick={() => setStep('profile')} />
            </div>
            <div className="bg-gray-100 p-3 rounded-2xl flex items-center gap-3">
              <span className="opacity-30">🔍</span>
              <input type="text" placeholder='Search "pasta" or "pizza"' className="bg-transparent outline-none w-full text-sm font-bold" />
            </div>
          </header>

          <main className="p-4 space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-sm font-black uppercase text-gray-400">Recommended for you</h2>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-green-600">VEG MODE</span>
                 <button onClick={() => setVegMode(!vegMode)} className={`w-8 h-4 rounded-full transition-all ${vegMode ? 'bg-green-600' : 'bg-gray-300'} relative`}>
                   <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${vegMode ? 'right-0.5' : 'left-0.5'}`} />
                 </button>
               </div>
            </div>

            {menu.map(item => (
              <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="w-2/3">
                  <div className="w-3 h-3 border border-green-600 p-[1px] mb-2"><div className="w-full h-full bg-green-600 rounded-full"></div></div>
                  <h3 className="font-black text-sm uppercase leading-none">{item.name}</h3>
                  <p className="text-xs font-bold text-gray-500 mt-1">₹{item.price}</p>
                  <p className="text-[9px] text-gray-400 mt-2 line-clamp-2 italic">Flavours Town special prepared with pure ingredients.</p>
                </div>
                <div className="relative">
                  <img src={item.img} className="w-24 h-24 rounded-2xl object-cover" />
                  <button onClick={() => setCart([...cart, item])} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-green-600 font-black px-5 py-2 rounded-xl shadow-md border text-[10px] uppercase">Add +</button>
                </div>
              </div>
            ))}
          </main>

          {cart.length > 0 && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-6 left-4 right-4 bg-orange-600 p-5 rounded-2xl flex justify-between items-center text-white shadow-xl z-50">
              <div><p className="text-xl font-black italic leading-none">₹{total}</p><p className="text-[9px] font-bold opacity-70">{cart.length} Item added</p></div>
              <button onClick={() => setStep('cart')} className="bg-white text-orange-600 px-6 py-3 rounded-xl font-black text-[11px] uppercase italic">Checkout →</button>
            </motion.div>
          )}
        </div>
      )}

      {/* --- STEP 2: PROFILE VIEW (BASED ON 11.46.27) --- */}
      {step === 'profile' && (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="min-h-screen bg-black text-white p-6">
          <div className="flex items-center gap-4 mb-10">
            <button onClick={() => setStep('menu')} className="text-2xl">←</button>
            <h2 className="text-xl font-black italic uppercase">Your Profile</h2>
          </div>
          <div className="flex flex-col items-center mb-10">
            <img src={user?.photoURL} className="w-24 h-24 rounded-full border-4 border-orange-500 mb-4" />
            <h3 className="text-2xl font-black italic uppercase">{user?.displayName || "Aashray Narang"}</h3>
            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">{user?.email}</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 p-5 rounded-3xl border border-white/10 flex justify-between items-center">
               <div><p className="text-[10px] opacity-40 uppercase font-black">Membership</p><p className="font-bold italic">Gold Member 👑</p></div>
               <span className="text-orange-500 font-black">Saved ₹144</span>
            </div>
            {['Your orders', 'Address book', 'Payment methods'].map(opt => (
              <div key={opt} className="bg-white/5 p-5 rounded-3xl border border-white/10 flex justify-between items-center">
                 <span className="font-bold uppercase text-xs">{opt}</span>
                 <span>›</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* --- STEP 3: CART & CHECKOUT (BASED ON 11.50.46) --- */}
      {step === 'cart' && (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="min-h-screen bg-[#F3F4F6] pb-40 p-5">
           <header className="flex items-center gap-4 mb-6">
             <button onClick={() => setStep('menu')} className="text-2xl">←</button>
             <h2 className="text-xl font-black italic">Yadvindra Garden</h2>
           </header>

           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-6 border border-orange-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-[8px] font-black uppercase">You saved ₹144</div>
              <h3 className="font-black text-xs uppercase mb-4 opacity-30">Your items</h3>
              {cart.map((i,idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-4 mb-4">
                  <div><p className="font-black text-sm uppercase">{i.name}</p><p className="text-xs font-bold text-gray-400 italic">₹{i.price}</p></div>
                  <div className="flex items-center gap-3 bg-orange-50 px-3 py-1 rounded-xl border border-orange-200"><button className="font-black text-orange-600">-</button><span className="font-bold">1</span><button className="font-black text-orange-600">+</button></div>
                </div>
              ))}
           </div>

           <div className="mb-8">
             <h3 className="text-xs font-black uppercase mb-4 ml-2 opacity-40 italic">Complete your meal with</h3>
             <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {RECO_ITEMS.map(reco => (
                  <div key={reco.id} className="min-w-[140px] bg-white p-4 rounded-3xl border shadow-sm">
                    <div className="text-3xl mb-2">{reco.img}</div>
                    <p className="text-[10px] font-black uppercase leading-tight mb-2">{reco.name}</p>
                    <div className="flex justify-between items-center"><span className="text-xs font-black">₹{reco.price}</span><button className="text-green-600 font-black text-lg">+</button></div>
                  </div>
                ))}
             </div>
           </div>

           <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t rounded-t-[3rem] shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div><p className="text-[10px] font-black opacity-30 uppercase italic leading-none">Total Bill</p><p className="text-3xl font-black italic tracking-tighter leading-none">₹{total}</p></div>
                <div className="text-right"><p className="text-[10px] font-black opacity-30 uppercase italic leading-none">Paying Using</p><p className="font-bold text-xs uppercase">Google Pay UPI ▾</p></div>
              </div>
              <button className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] italic shadow-xl active:scale-95 transition-all">Place Order →</button>
           </div>
        </motion.div>
      )}
    </div>
  );
}