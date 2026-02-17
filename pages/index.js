import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, 
  setPersistence, browserLocalPersistence 
} from "firebase/auth";
import { getDatabase, ref, onValue, push, update, remove } from "firebase/database";

// --- FIREBASE CONFIG ---
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
  const [view, setView] = useState('menu'); 
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vegMode, setVegMode] = useState(true);

  const carouselRef = useRef(null);

  // --- BUSINESS LOGIC: PERSISTENCE & DATA SYNC ---
  useEffect(() => {
    const initApp = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
      } catch (err) { setLoading(false); }
    };
    initApp();

    // Sync Menu
    onValue(ref(db, 'menu'), (snap) => {
      if (snap.exists()) setMenu(Object.values(snap.val()));
    });

    // Sync Admin Orders
    onValue(ref(db, 'live_orders'), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setLiveOrders(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      } else { setLiveOrders([]); }
    });
  }, []);

  // --- COMPUTED PROPERTIES ---
  const total = useMemo(() => cart.reduce((t, i) => t + i.price, 0), [cart]);
  
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const name = typeof item.name === 'object' ? (item.name.en || "") : (item.name || "");
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [menu, search]);

  // --- ACTIONS ---
  const handleOrder = async () => {
    if (!user) return signInWithPopup(auth, provider);
    const orderObj = {
      customer: user.displayName,
      email: user.email,
      photo: user.photoURL,
      items: cart,
      total,
      status: 'Pending',
      timestamp: new Date().toLocaleTimeString(),
      rawTime: Date.now()
    };
    await push(ref(db, 'live_orders'), orderObj);
    const waMsg = `*FLAVOURS TOWN ORDER*%0A*Items:* ${cart.length}%0A*Total:* ₹${total}%0A*Customer:* ${user.displayName}`;
    window.open(`https://wa.me/919877474778?text=${waMsg}`);
    setCart([]);
    setView('menu');
  };

  const updateOrder = (id, status) => {
    if (status === 'Served') remove(ref(db, `live_orders/${id}`));
    else update(ref(db, `live_orders/${id}`), { status });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-orange-100">
      <Head>
        <title>Flavours Town | Professional Build</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      </Head>

      {/* --- GLOBAL HEADER (BASED ON ZOMATO PRO) --- */}
      <header className="sticky top-0 z-[200] bg-white/90 backdrop-blur-md border-b px-5 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">FT</div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Delivering to ▾</p>
            <h1 className="text-sm font-black tracking-tight">{view === 'admin' ? 'ADMIN DASHBOARD' : 'Green Valley, Malout'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setView('admin')} className="text-[10px] font-black opacity-20 hover:opacity-100 transition-opacity uppercase">Admin</button>
          {user ? (
            <img 
              src={user.photoURL} 
              onClick={() => setView('profile')} 
              className="w-10 h-10 rounded-full border-2 border-orange-500 cursor-pointer hover:scale-110 transition-transform shadow-md" 
            />
          ) : (
            <button onClick={() => signInWithPopup(auth, provider)} className="bg-black text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase">Login</button>
          )}
        </div>
      </header>

      {/* --- VIEW: MENU (HOME) --- */}
      {view === 'menu' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-44">
          {/* Professional Carousel */}
          <div className="p-5 flex gap-4 overflow-x-auto no-scrollbar snap-x">
            {[1, 2].map((i) => (
              <div key={i} className="min-w-[90%] h-48 bg-gradient-to-br from-orange-600 to-red-700 rounded-[3rem] relative overflow-hidden snap-center shadow-xl">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                 <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                    <h2 className="text-4xl font-black italic uppercase leading-none tracking-tighter">Flat 50% OFF</h2>
                    <p className="text-xs font-bold uppercase mt-2 opacity-70 tracking-[0.2em]">Malout's Special Offer</p>
                    <button className="mt-6 bg-white text-black w-fit px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg">Claim Now</button>
                 </div>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="px-6 py-4 flex justify-between items-center border-b bg-white sticky top-[73px] z-[150]">
            <div className="bg-gray-100 flex-1 mr-4 p-3 rounded-2xl flex items-center gap-3 border border-gray-200">
               <span className="opacity-30">🔍</span>
               <input type="text" placeholder="Search Malai Chaap..." className="bg-transparent outline-none w-full text-xs font-bold uppercase" onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-green-600 uppercase italic">Veg</span>
              <button onClick={() => setVegMode(!vegMode)} className={`w-10 h-5 rounded-full relative transition-all ${vegMode ? 'bg-green-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${vegMode ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <main className="p-5 space-y-6 max-w-2xl mx-auto">
            {filteredMenu.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="w-2/3 pr-4">
                  <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center mb-3"><div className="w-2 h-2 bg-green-600 rounded-full"></div></div>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter leading-none mb-1">
                    {typeof item.name === 'object' ? item.name.en : item.name}
                  </h3>
                  <p className="text-orange-600 font-black text-lg italic">₹{item.price}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-3 line-clamp-2 uppercase italic leading-tight">Freshly prepared with authentic town flavours and premium spices.</p>
                </div>
                <div className="relative">
                  <img src={item.img} className="w-28 h-28 rounded-3xl object-cover shadow-inner border border-gray-50" />
                  <button onClick={() => setCart([...cart, item])} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-green-600 font-black px-8 py-2.5 rounded-xl shadow-xl border border-gray-100 text-[10px] uppercase active:scale-90 transition-all">Add +</button>
                </div>
              </div>
            ))}
          </main>

          {/* Floating Sticky Cart Bar */}
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-10 left-4 right-4 z-[300]">
                <div className="bg-orange-600 p-6 rounded-[2.5rem] shadow-[0_30px_60px_rgba(234,88,12,0.4)] flex justify-between items-center text-white border-t border-orange-400">
                  <div className="italic leading-none">
                    <p className="text-3xl font-black tracking-tighter">₹{total}</p>
                    <p className="text-[9px] font-black uppercase opacity-60 mt-1">{cart.length} Item Selected</p>
                  </div>
                  <button onClick={() => setView('cart')} className="bg-white text-orange-600 px-10 py-5 rounded-[2rem] font-black text-[12px] uppercase italic tracking-widest shadow-lg active:scale-95 transition-all">View Cart →</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* --- VIEW: CART (CHECKOUT) --- */}
      {view === 'cart' && (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="min-h-screen bg-gray-50 pb-40">
           <div className="bg-white p-6 flex items-center gap-4 border-b">
              <button onClick={() => setView('menu')} className="text-2xl">←</button>
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Your Tray</h2>
           </div>
           
           <div className="p-5 max-w-xl mx-auto space-y-6">
              <div className="bg-white p-8 rounded-[3rem] border border-orange-100 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 text-[9px] font-black uppercase italic tracking-widest shadow-lg">Gold Saver ✅</div>
                 <h3 className="text-[10px] font-black text-gray-400 uppercase italic mb-6">Bill Details</h3>
                 {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-center mb-5 pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                       <div className="flex items-center gap-3">
                         <div className="w-3 h-3 border border-green-600 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div></div>
                         <p className="font-black text-xs uppercase italic">{typeof item.name === 'object' ? item.name.en : item.name}</p>
                       </div>
                       <p className="font-black text-sm italic tracking-tighter">₹{item.price}</p>
                    </div>
                 ))}
                 <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                    <p className="text-lg font-black italic uppercase leading-none">Grand Total</p>
                    <p className="text-4xl font-black italic tracking-tighter text-orange-600 leading-none">₹{total}</p>
                 </div>
              </div>

              {/* Order Context Card */}
              <div className="bg-white p-6 rounded-[2.5rem] border flex items-center gap-4 shadow-sm">
                 <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">💳</div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black opacity-30 uppercase leading-none">Payment Mode</p>
                    <p className="font-bold text-xs mt-1">GPay UPI • narang...34@okaxis</p>
                 </div>
                 <span className="text-gray-300">▾</span>
              </div>
           </div>

           <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
              <button onClick={handleOrder} className="w-full bg-green-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] italic shadow-2xl shadow-green-200 active:scale-95 transition-all">Confirm Order & Pay</button>
           </div>
        </motion.div>
      )}

      {/* --- VIEW: PROFILE (AASHRAY NARANG) --- */}
      {view === 'profile' && (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="min-h-screen bg-black text-white p-8 pb-32 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <button onClick={() => setView('menu')} className="text-2xl">←</button>
            <h2 className="text-lg font-black italic uppercase tracking-widest">My Account</h2>
            <div />
          </div>

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="relative">
               <img src={user?.photoURL} className="w-28 h-28 rounded-full border-4 border-orange-600 shadow-[0_0_30px_rgba(234,88,12,0.5)]" />
               <div className="absolute -bottom-2 -right-2 bg-green-600 p-3 rounded-full border-4 border-black text-xs shadow-lg">👑</div>
            </div>
            <h3 className="text-3xl font-black italic uppercase mt-6 tracking-tighter leading-none">{user?.displayName || "Aashray Narang"}</h3>
            <p className="text-xs font-bold opacity-30 uppercase tracking-[0.2em] mt-3">{user?.email}</p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
             <div className="bg-zinc-900/50 p-7 rounded-[2.5rem] border border-white/5 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                   <div className="text-3xl">🎖️</div>
                   <div><p className="text-[10px] opacity-40 uppercase font-black">Elite Status</p><p className="font-bold italic text-orange-500 uppercase">Town Gold Member</p></div>
                </div>
                <p className="text-[10px] font-black bg-orange-950 text-orange-400 px-3 py-1 rounded-full uppercase">Saved ₹420</p>
             </div>
             {['Order History', 'Zomato Money', 'Address Book', 'Support'].map((opt) => (
                <div key={opt} className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center active:bg-zinc-800 transition-colors cursor-pointer">
                   <span className="text-xs font-black uppercase tracking-[0.15em] opacity-70">{opt}</span>
                   <span className="opacity-20">›</span>
                </div>
             ))}
             <button onClick={() => { auth.signOut(); setView('menu'); }} className="w-full py-6 text-red-600 font-black uppercase text-xs tracking-[0.4em] mt-10 opacity-60 hover:opacity-100 transition-opacity italic underline">Logout Account</button>
          </div>
        </motion.div>
      )}

      {/* --- VIEW: ADMIN (LIVE ORDER TRACKER) --- */}
      {view === 'admin' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#050505] text-white p-6 pb-40">
           <header className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-orange-600">Live Orders</h2>
              <button onClick={() => setView('menu')} className="text-[10px] font-black bg-white/10 px-6 py-3 rounded-2xl uppercase">Exit</button>
           </header>

           <div className="grid gap-4 max-w-lg mx-auto">
              {liveOrders.length === 0 && <div className="text-center py-40 opacity-20 font-black italic uppercase tracking-[0.5em]">No Pending Orders...</div>}
              {liveOrders.slice().reverse().map((order) => (
                 <div key={order.id} className="bg-zinc-900/80 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-4">
                          <img src={order.photo} className="w-12 h-12 rounded-full border border-orange-500 shadow-md" />
                          <div><p className="font-black text-xs uppercase italic">{order.customer}</p><p className="text-[9px] opacity-30 uppercase font-bold">{order.timestamp}</p></div>
                       </div>
                       <span className="text-xl font-black italic text-orange-500 tracking-tighter">₹{order.total}</span>
                    </div>
                    <div className="space-y-2 mb-6 border-t border-white/5 pt-4">
                       {order.items.map((it, i) => (
                          <p key={i} className="text-[10px] font-bold opacity-60 uppercase italic leading-none">• {typeof it.name === 'object' ? it.name.en : it.name}</p>
                       ))}
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => updateOrder(order.id, 'Ready')} className="flex-1 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">Mark Ready</button>
                       <button onClick={() => updateOrder(order.id, 'Served')} className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">Served ✅</button>
                    </div>
                 </div>
              ))}
           </div>
        </motion.div>
      )}
    </div>
  );
}