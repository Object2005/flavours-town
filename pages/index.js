import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const OWNER_NAME = "Aashray Narang";
const OWNER_PHONE = "919877474778"; 

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [userOrder, setUserOrder] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [payMethod, setPayMethod] = useState('UPI');

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (saved) setUser(JSON.parse(saved));

    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.exists() ? snap.val() : true));
    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    
    // Live Tracking
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
    const orderData = { id: orderId, user, items: cart, total, status: 'Received', method: payMethod, timestamp: new Date().toISOString() };
    
    set(ref(db, 'orders/' + orderId), orderData);
    setCart([]);
    alert("Order Placed! Tracking Live Now.");
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] pb-40">
      <header className="p-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <h1 className="font-black italic text-orange-600">THE FLAVOURS TOWN</h1>
        {!isShopOpen && <span className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-black">CLOSED</span>}
      </header>

      <main className="p-6">
        {/* BLINKIT STYLE LIVE STATUS */}
        {userOrder && (
          <div className="mb-8 p-6 bg-white rounded-[2rem] border border-orange-100 shadow-xl shadow-orange-600/5">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-black text-xs uppercase tracking-widest text-orange-600 italic">Live Tracking</h3>
               <span className="text-[10px] font-bold opacity-30">#{userOrder.id}</span>
            </div>
            <div className="flex gap-2 mb-4">
              {['Received', 'Cooking', 'Ready'].map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full ${userOrder.status === s || (i < 1 && userOrder.status === 'Cooking') || (i < 2 && userOrder.status === 'Ready') ? 'bg-orange-600' : 'bg-gray-100'}`} />
              ))}
            </div>
            <p className="text-xl font-black italic uppercase tracking-tighter">
                {userOrder.status === 'Received' && '📦 Order Received'}
                {userOrder.status === 'Cooking' && '👨‍🍳 Chef is Frying'}
                {userOrder.status === 'Ready' && '🔥 Ready for Pickup'}
            </p>
          </div>
        )}

        {/* MENU */}
        <div className="grid grid-cols-2 gap-4">
          {menu.map(p => (
            <div key={p.id} className={`bg-white p-4 rounded-[2rem] border border-gray-50 ${!p.inStock || !isShopOpen ? 'opacity-40' : ''}`}>
               <img src={p.img} className="w-full h-32 object-cover rounded-2xl mb-3" />
               <h4 className="font-black text-[11px] uppercase">{p.name.en}</h4>
               <p className="text-orange-600 font-black italic">₹{p.price}</p>
               <button onClick={() => setCart([...cart, p])} disabled={!isShopOpen || !p.inStock} className="mt-2 w-full py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase">Add +</button>
            </div>
          ))}
        </div>
      </main>

      {/* CHECKOUT WITH PAYMENT */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-0 left-0 right-0 p-8 bg-white rounded-t-[3rem] shadow-2xl border-t z-[100]">
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
               {['UPI', 'CASH'].map(m => (
                 <button key={m} onClick={() => setPayMethod(m)} className={`px-6 py-3 rounded-full text-[10px] font-black ${payMethod === m ? 'bg-orange-600 text-white' : 'bg-gray-100 opacity-40'}`}>{m}</button>
               ))}
            </div>
            <button onClick={placeOrder} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase flex justify-between px-10">
               <span>Pay with {payMethod}</span>
               <span className="italic font-black text-lg">₹{cart.reduce((a,b)=>a+b.price,0)} →</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}