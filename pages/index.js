// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = { /* Teri Config Same Rahegi */ };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const APP_NAME = "The Flavours Town";
const OWNER_PHONE = "919877474778";

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [userOrder, setUserOrder] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [userDetails, setUserDetails] = useState({ name: '', phone: '', note: '' });
  const [showCheckout, setShowCheckout] = useState(false);
  const [lang, setLang] = useState('pu');

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (saved) setUserDetails(JSON.parse(saved));
    onValue(ref(db, 'menu'), (snap) => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'shopStatus'), (snap) => setIsShopOpen(snap.exists() ? snap.val() : true));
    onValue(ref(db, 'orders'), (snap) => {
      if (snap.exists()) {
        const orders = Object.keys(snap.val()).map(k => ({...snap.val()[k]}));
        setUserOrder(orders.find(o => o.user?.phone === userDetails.phone) || null);
      }
    });
  }, [userDetails.phone]);

  const placeOrder = () => {
    if (!userDetails.name || userDetails.phone.length < 10) return alert("Sahi Details!");
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = { id: orderId, user: userDetails, items: cart, total: cart.reduce((a,b)=>a+b.price,0)+10, status: 'Pending', timestamp: new Date().toISOString() };
    set(ref(db, 'orders/' + orderId), orderData);
    localStorage.setItem('ft_user', JSON.stringify(userDetails));
    window.open(`https://wa.me/${OWNER_PHONE}?text=New Order ID: ${orderId}`, '_blank');
    setCart([]); setShowCheckout(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#1a1a1a] font-sans pb-32">
      <Head><title>{APP_NAME}</title></Head>
      <header className="fixed top-0 w-full z-[150] bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="font-black text-sm italic text-orange-600 uppercase italic">{APP_NAME}</h1>
        <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="text-[10px] font-black opacity-50 uppercase">{lang === 'en' ? 'ਪੰ' : 'EN'}</button>
      </header>

      <main className="pt-24 px-4 max-w-5xl mx-auto">
        {!isShopOpen && <div className="p-4 bg-red-50 text-red-600 text-center rounded-2xl font-bold mb-6 text-xs">🏠 Currently Closed</div>}
        
        {userOrder && (
          <div className="mb-8 p-6 rounded-[2.5rem] bg-orange-600 text-white shadow-xl">
            <span className="text-[9px] font-black uppercase opacity-60">Live Order: {userOrder.status}</span>
            <h2 className="text-xl font-black italic">{userOrder.status === 'Ready' ? '🔥 Pick Up Now!' : '👨‍🍳 Cooking...'}</h2>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {menu.map(p => (
            <div key={p.id} className={`rounded-[2rem] bg-white border border-gray-100 shadow-sm overflow-hidden ${!p.inStock ? 'opacity-30 grayscale' : ''}`}>
              <div className="h-40 bg-gray-100"><img src={p.img} className="w-full h-full object-cover" /></div>
              <div className="p-4 text-center">
                <h3 className="text-[10px] font-black uppercase mb-1">{p.name[lang]}</h3>
                <p className="text-orange-600 font-black text-sm italic mb-3">₹{p.price}</p>
                <button onClick={() => setCart([...cart, p])} disabled={!p.inStock || !isShopOpen} className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl text-[9px] font-black uppercase">Add +</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart & Checkout Drawers ... same logic as v29 */}
    </div>
  );
}