import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getDatabase, ref, onValue, push, update, remove } from "firebase/database";

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
  const [view, setView] = useState('menu'); // 'menu', 'cart', 'admin'
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await setPersistence(auth, browserLocalPersistence);
      onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    };
    init();

    // Load Menu Data
    onValue(ref(db, 'menu'), (snap) => {
      if (snap.exists()) setMenu(Object.values(snap.val()));
    });

    // Load Live Orders for Admin
    onValue(ref(db, 'live_orders'), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setOrders(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      } else { setOrders([]); }
    });
  }, []);

  const total = useMemo(() => cart.reduce((t, i) => t + i.price, 0), [cart]);

  const placeOrder = () => {
    if (!user) return signInWithPopup(auth, provider);
    const orderData = {
      customer: user.displayName,
      photo: user.photoURL,
      items: cart,
      total,
      status: 'Pending',
      time: new Date().toLocaleTimeString()
    };
    push(ref(db, 'live_orders'), orderData);
    setCart([]);
    alert("Order Placed! Please wait at the counter.");
    setView('menu');
  };

  const updateStatus = (id, status) => {
    if (status === 'Completed') {
      remove(ref(db, `live_orders/${id}`));
    } else {
      update(ref(db, `live_orders/${id}`), { status });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black font-sans">
      <Head><title>Flavours Town | Smart Cart</title></Head>

      {/* --- ADMIN VIEW (Road-side Owner Panel) --- */}
      {view === 'admin' && (
        <div className="min-h-screen bg-black text-white p-6 pb-32">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic text-orange-500 uppercase">Live Orders</h2>
            <button onClick={() => setView('menu')} className="text-xs bg-white/10 px-4 py-2 rounded-xl uppercase font-bold">Back to Menu</button>
          </div>
          <div className="space-y-4">
            {orders.length === 0 && <p className="text-center opacity-30 mt-20 font-bold uppercase italic">No live orders yet...</p>}
            {orders.map((order) => (
              <div key={order.id} className="bg-zinc-900 p-5 rounded-[2rem] border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <img src={order.photo} className="w-10 h-10 rounded-full border border-orange-500" />
                    <div><p className="font-black text-sm uppercase leading-none">{order.customer}</p><p className="text-[9px] opacity-40 uppercase">{order.time}</p></div>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${order.status === 'Ready' ? 'bg-green-600' : 'bg-orange-600'}`}>{order.status}</span>
                </div>
                <div className="space-y-1 mb-4">
                  {order.items.map((it, idx) => (
                    <p key={idx} className="text-xs font-bold opacity-70 italic">• {it.name?.en || it.name} x 1</p>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(order.id, 'Ready')} className="flex-1 bg-white text-black py-3 rounded-xl font-black text-[10px] uppercase">Mark Ready</button>
                  <button onClick={() => updateStatus(order.id, 'Completed')} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black text-[10px] uppercase">Served</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CUSTOMER MENU VIEW --- */}
      {view === 'menu' && (
        <div className="pb-40">
          <header className="p-5 bg-white sticky top-0 z-50 flex justify-between items-center border-b">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase leading-none italic">Roadside Special</p>
               <h1 className="text-xl font-black italic tracking-tighter">FLAVOURS TOWN</h1>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => setView('admin')} className="text-[10px] font-bold opacity-20 uppercase">Admin</button>
               {user ? <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-orange-500" /> : <button onClick={() => signInWithPopup(auth, provider)} className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Login</button>}
            </div>
          </header>

          <main className="p-4 space-y-4 max-w-xl mx-auto">
            {menu.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-5 flex justify-between items-center shadow-sm border border-gray-50">
                <div className="w-2/3">
                  <div className="w-3 h-3 border border-green-600 p-[1px] mb-2"><div className="w-full h-full bg-green-600 rounded-full"></div></div>
                  <h3 className="font-black text-sm uppercase italic">{typeof item.name === 'object' ? item.name.en : item.name}</h3>
                  <p className="text-orange-600 font-black text-sm mt-1">₹{item.price}</p>
                </div>
                <div className="relative">
                  <img src={item.img} className="w-20 h-20 rounded-2xl object-cover" />
                  <button onClick={() => setCart([...cart, item])} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-green-600 font-black px-4 py-1.5 rounded-xl shadow-md border text-[9px] uppercase">Add +</button>
                </div>
              </div>
            ))}
          </main>

          {cart.length > 0 && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-6 left-4 right-4 bg-orange-600 p-6 rounded-[2rem] flex justify-between items-center text-white shadow-2xl z-[100]">
              <div className="italic"><p className="text-2xl font-black leading-none">₹{total}</p><p className="text-[9px] font-bold opacity-60 uppercase">{cart.length} Item in Tray</p></div>
              <button onClick={() => setView('cart')} className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase italic tracking-widest">Next →</button>
            </motion.div>
          )}
        </div>
      )}

      {/* --- CUSTOMER CART VIEW --- */}
      {view === 'cart' && (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="min-h-screen bg-gray-50 p-5">
           <header className="flex items-center gap-4 mb-8">
             <button onClick={() => setView('menu')} className="text-2xl">←</button>
             <h2 className="text-xl font-black italic uppercase">Confirm Order</h2>
           </header>
           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-6 border border-orange-100">
              {cart.map((i, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <p className="font-black text-xs uppercase italic">{typeof i.name === 'object' ? i.name.en : i.name}</p>
                  <p className="text-xs font-bold opacity-40">₹{i.price}</p>
                </div>
              ))}
              <div className="mt-6 flex justify-between items-center">
                 <p className="text-sm font-black italic uppercase">Total</p>
                 <p className="text-2xl font-black italic tracking-tighter">₹{total}</p>
              </div>
           </div>
           <button onClick={placeOrder} className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] italic shadow-xl">Place Order Now</button>
        </motion.div>
      )}
    </div>
  );
}