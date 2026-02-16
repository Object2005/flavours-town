import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Home() {
  const router = useRouter();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [userOrder, setUserOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds
  const [isShopOpen, setIsShopOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (!saved) router.push('/auth'); else setUser(JSON.parse(saved));

    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.exists() ? snap.val() : true));
    
    onValue(ref(db, 'orders'), snap => {
      if (snap.exists() && saved) {
        const u = JSON.parse(saved);
        const orders = Object.values(snap.val());
        const current = orders.find(o => o.user?.phone === u.phone && o.status !== 'Ready');
        setUserOrder(current || null);
      }
    });
  }, []);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (userOrder?.status === 'Cooking' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [userOrder?.status, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans pb-44 text-[#1a1a1a]">
      <Head><title>The Flavours Town</title></Head>
      
      <header className="fixed top-0 w-full z-[150] bg-white/90 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="font-black italic text-orange-600 text-sm uppercase tracking-tighter tracking-widest italic">The Flavours Town</h1>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black uppercase">
          {user.name.charAt(0)}
        </div>
      </header>

      <main className="pt-24 px-4 max-w-4xl mx-auto">
        {/* --- LIVE ORDER STATUS & TIMER --- */}
        {userOrder && (
          <motion.div initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="mb-8 p-6 rounded-[2.5rem] bg-[#1a1a1a] text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10 flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">Live Tracking</span>
                <span className="bg-orange-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{userOrder.status}</span>
             </div>
             
             <h2 className="relative z-10 text-2xl font-black italic mb-4">
               {userOrder.status === 'Pending' ? '👨‍🍳 Kitchen Received' : '🔥 Chef is Cooking'}
             </h2>

             {/* TIMER DISPLAY */}
             {userOrder.status === 'Cooking' && (
               <div className="relative z-10 flex items-center gap-4">
                  <div className="text-4xl font-black text-orange-500 tabular-nums">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-[10px] font-black uppercase opacity-40 leading-tight">
                    Estimated<br/>Wait Time
                  </div>
               </div>
             )}

             {/* PROGRESS BAR */}
             <div className="absolute bottom-0 left-0 h-1 bg-orange-600 transition-all duration-1000" 
                  style={{ width: userOrder.status === 'Cooking' ? `${((900 - timeLeft) / 900) * 100}%` : '10%' }} 
             />
          </motion.div>
        )}

        {/* --- MENU GRID --- */}
        <div className="grid grid-cols-2 gap-4">
          {menu.map(p => (
            <div key={p.id} className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all ${!p.inStock ? 'opacity-30 grayscale' : ''}`}>
              <div className="h-44 overflow-hidden"><img src={p.img} className="w-full h-full object-cover" /></div>
              <div className="p-5 text-center">
                <h3 className="text-[11px] font-black uppercase mb-1 tracking-tight">{p.name.en}</h3>
                <p className="text-orange-600 font-black text-lg mb-4 italic">₹{p.price}</p>
                <button onClick={() => setCart([...cart, p])} disabled={!isShopOpen || !p.inStock} className="w-full py-3 bg-[#1a1a1a] text-white rounded-2xl text-[10px] font-black uppercase shadow-lg">Add +</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- CART BUTTON --- */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-[200]">
             <div className="max-w-md mx-auto flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black opacity-30 uppercase">Items: {cart.length}</p>
                  <h2 className="text-2xl font-black italic">₹{cart.reduce((a,b)=>a+b.price,0)}</h2>
                </div>
                <button onClick={() => {/* Checkout Logic */}} className="px-10 py-5 bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase shadow-xl shadow-orange-600/20">Review Tray →</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}