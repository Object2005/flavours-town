import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, push, onValue, update } from "firebase/database";

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
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [myOrder, setMyOrder] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const ADMIN_EMAIL = "narangaashray34@gmail.com";

  useEffect(() => {
    // 1. Auth Sync
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        if (u.email === ADMIN_EMAIL) setIsAdmin(true);
      }
    });

    // 2. Real-time Menu Sync
    const menuRef = ref(db, 'menu');
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setMenu(Object.values(data));
    });

    // 3. Real-time Orders Sync (Admin only sees all, User sees their own)
    const ordersRef = ref(db, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setLiveOrders(ordersList);
        
        // Find current user's latest order
        if (user) {
          const userOrder = ordersList.filter(o => o.userEmail === user.email).pop();
          setMyOrder(userOrder);
        }
      }
    });
  }, [user]);

  const handleLogin = () => signInWithPopup(auth, provider);

  const placeOrder = (method) => {
    if (!user) return handleLogin();
    
    const newOrder = {
      userEmail: user.email,
      userName: user.displayName,
      items: cart,
      total: cart.reduce((a, b) => a + b.price, 0),
      status: 'Pending',
      method: method,
      timestamp: Date.now(),
      targetTime: Date.now() + (20 * 60 * 1000) // 20 min prep
    };

    // PUSH TO FIREBASE (Real Functional Logic)
    push(ref(db, 'orders'), newOrder);
    
    // WhatsApp Format
    if (method === 'WA') {
      const text = `*ORDER FROM ${user.displayName.toUpperCase()}*%0A*Total:* ₹${newOrder.total}%0A*Method:* ${method}`;
      window.open(`https://wa.me/919877474778?text=${text}`);
    }

    setCart([]);
    setShowCheckout(false);
    alert("Order Placed Successfully! ✅");
  };

  const updateOrderStatus = (orderId, newStatus) => {
    update(ref(db, `orders/${orderId}`), { status: newStatus });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Head><title>Flavours Town | Sovereign Build</title></Head>

      {/* Modern Header */}
      <header className="fixed top-0 w-full z-[100] px-6 py-4 backdrop-blur-xl border-b border-white/10 flex justify-between items-center bg-black/60">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center font-black">FT</div>
          <h1 className="text-sm font-black italic uppercase tracking-tighter">The Flavour's Town</h1>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            {isAdmin && <span className="text-[8px] bg-white text-black px-2 py-1 rounded-full font-black">ADMIN</span>}
            <img src={user.photoURL} className="w-8 h-8 rounded-full border border-orange-500" />
          </div>
        ) : (
          <button onClick={handleLogin} className="text-[10px] font-black uppercase bg-white text-black px-4 py-2 rounded-lg">Login</button>
        )}
      </header>

      <main className="pt-24 px-6 max-w-5xl mx-auto pb-40">
        {isAdmin ? (
          // ADMIN VIEW
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic text-orange-500 uppercase">Live Kitchen Dashboard</h2>
            {liveOrders.slice().reverse().map(order => (
              <div key={order.id} className="p-6 bg-zinc-900 rounded-3xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">{order.userName}</h3>
                  <p className="text-xl font-black text-orange-500">₹{order.total}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Pending', 'Cooking', 'Ready', 'Delivered'].map(s => (
                    <button key={s} onClick={() => updateOrderStatus(order.id, s)} className={`py-3 rounded-xl text-[10px] font-black uppercase ${order.status === s ? 'bg-orange-600' : 'bg-white/5 opacity-40'}`}>{s}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // USER VIEW
          <>
            <div className="mb-10"><h2 className="text-6xl font-black italic uppercase leading-none tracking-tighter">Fresh<br/><span className="text-orange-500">Arrivals</span></h2></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {menu.map(p => (
                <div key={p.id} className="bg-zinc-900 p-4 rounded-3xl border border-white/5 relative">
                   <img src={p.img} className="w-full h-32 object-cover rounded-2xl mb-4" />
                   <h3 className="text-[11px] font-bold uppercase mb-2">{p.name.en}</h3>
                   <div className="flex justify-between items-center">
                     <span className="text-orange-500 font-black">₹{p.price}</span>
                     <button onClick={() => setCart([...cart, p])} className="bg-white text-black px-4 py-2 rounded-lg text-[9px] font-black uppercase">Add +</button>
                   </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Floating Status Bar for User */}
      {myOrder && !isAdmin && (
        <div className="fixed top-20 right-6 bg-orange-600 p-4 rounded-2xl shadow-2xl z-50">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Order Status</p>
          <p className="text-xl font-black italic uppercase">{myOrder.status}</p>
        </div>
      )}

      {/* Cart Logic (V15 logic applies here) */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-6 right-6 z-[100]">
           <button onClick={() => setShowCheckout(true)} className="w-full bg-white text-black p-6 rounded-[2.5rem] flex justify-between items-center shadow-2xl">
              <span className="font-black italic text-2xl uppercase">Total: ₹{cart.reduce((a,b)=>a+b.price, 0)}</span>
              <span className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px]">Checkout →</span>
           </button>
        </div>
      )}
    </div>
  );
}