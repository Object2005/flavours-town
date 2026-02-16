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
const OWNER_PHONE = "919877474778";

export default function Home() {
  const router = useRouter();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [userOrder, setUserOrder] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [lang, setLang] = useState('pu');

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (!saved) router.push('/auth');
    else setUser(JSON.parse(saved));

    onValue(ref(db, 'menu'), (snap) => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'shopStatus'), (snap) => setIsShopOpen(snap.exists() ? snap.val() : true));
    onValue(ref(db, 'orders'), (snap) => {
      if (snap.exists() && saved) {
        const u = JSON.parse(saved);
        const orders = Object.values(snap.val());
        setUserOrder(orders.find(o => o.user?.phone === u.phone && o.status !== 'Ready') || null);
      }
    });
  }, []);

  const placeOrder = () => {
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const bill = cart.reduce((a,b)=>a+b.price,0) + 10;
    const orderData = { id: orderId, user, items: cart, total: bill, status: 'Pending', timestamp: new Date().toISOString() };
    set(ref(db, 'orders/' + orderId), orderData);
    window.open(`https://wa.me/${OWNER_PHONE}?text=Order ID: ${orderId} - Confirm please!`, '_blank');
    setCart([]);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-sans pb-40">
      <Head><title>The Flavours Town</title></Head>
      <header className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <h1 className="font-black italic text-orange-600 text-sm uppercase">The Flavours Town</h1>
        <div className="flex gap-4 items-center">
            <span className="text-[9px] font-bold opacity-40 uppercase">Hi, {user.name.split(' ')[0]}</span>
            <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="text-[10px] font-black">{lang === 'en' ? 'ਪੰ' : 'EN'}</button>
        </div>
      </header>

      <main className="pt-24 px-4 max-w-4xl mx-auto">
        {userOrder && (
          <motion.div initial={{scale:0.9}} animate={{scale:1}} className="mb-8 p-6 rounded-[2.5rem] bg-orange-600 text-white shadow-xl">
             <p className="text-[10px] font-black uppercase opacity-60">Live Status</p>
             <h2 className="text-2xl font-black italic">{userOrder.status === 'Cooking' ? '👨‍🍳 Cooking Your Meal...' : '⏳ Order Received'}</h2>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {menu.map(p => (
            <div key={p.id} className={`bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden ${!p.inStock ? 'opacity-30' : ''}`}>
              <div className="h-36 bg-gray-50"><img src={p.img} className="w-full h-full object-cover" /></div>
              <div className="p-4 text-center">
                <h3 className="text-[10px] font-black uppercase mb-1">{p.name[lang]}</h3>
                <p className="text-orange-600 font-black text-sm mb-3">₹{p.price}</p>
                <button onClick={() => setCart([...cart, p])} disabled={!p.inStock || !isShopOpen} className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl text-[9px] font-black uppercase">Add +</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 rounded-t-[3rem] shadow-2xl z-[150]">
          <button onClick={placeOrder} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase flex justify-between px-8 items-center">
            <span>Checkout ({cart.length})</span>
            <span>₹{cart.reduce((a,b)=>a+b.price,0)+10} →</span>
          </button>
        </div>
      )}
    </div>
  );
}