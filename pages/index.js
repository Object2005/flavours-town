import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set, serverTimestamp } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function GlobalApp() {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [payMethod, setPayMethod] = useState('COD');
  const [ui, setUi] = useState({ lang: 'EN', dark: false, tab: 'home', search: '', category: 'All' });

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (!saved) window.location.href = '/auth';
    const parsedUser = JSON.parse(saved);
    setUser(parsedUser);

    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'orders'), snap => {
      if (snap.exists()) {
        const allOrders = Object.values(snap.val());
        const userOrders = allOrders.filter(o => o.user?.phone === parsedUser.phone);
        setHistory(userOrders);
        setActiveOrder(userOrders.find(o => o.status !== 'Delivered') || null);
      }
    });
  }, []);

  const filteredItems = useMemo(() => {
    return menu.filter(item => 
      item.name?.en.toLowerCase().includes(ui.search.toLowerCase()) && 
      (ui.category === 'All' || item.category === ui.category)
    );
  }, [menu, ui.search, ui.category]);

  const placeOrder = async () => {
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      id: orderId, user, items: cart,
      total: cart.reduce((a, b) => a + b.price, 0),
      status: 'Received', method: payMethod, createdAt: serverTimestamp()
    };
    await set(ref(db, `orders/${orderId}`), payload);
    setCart([]);
    alert(`Order Placed via ${payMethod}!`);
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen transition-all ${ui.dark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fcfbf7] text-black'} font-sans pb-40`}>
      <Head><title>The Flavours Town</title></Head>

      {/* --- HEADER --- */}
      <header className={`sticky top-0 z-[100] px-6 py-5 border-b flex justify-between items-center ${ui.dark ? 'bg-black/90 border-white/5' : 'bg-white/90 border-gray-100'} backdrop-blur-2xl`}>
        <div>
          <h1 className="text-2xl font-black italic text-orange-600 tracking-tighter uppercase leading-none">The Flavours Town</h1>
          <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.4em] mt-1">Dev: Aashray Narang</p>
        </div>
        <button onClick={() => setUi({...ui, dark: !ui.dark})} className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl">{ui.dark ? '☀️' : '🌙'}</button>
      </header>

      <main className="p-5 max-w-5xl mx-auto">
        {/* --- TABS SYSTEM --- */}
        {ui.tab === 'home' && (
          <>
            {/* Search */}
            <div className="mb-8"><input type="text" placeholder="Search Chaap..." className="w-full p-6 rounded-[2rem] bg-white dark:bg-white/5 shadow-sm outline-none font-bold" onChange={e=>setUi({...ui, search: e.target.value})} /></div>
            
            {/* Menu Grid */}
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((p, idx) => (
                <div key={idx} className={`bg-white dark:bg-[#1a1a1a] p-4 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm`}>
                  <img src={p.img} className="w-full h-32 object-cover rounded-[1.5rem] mb-3" />
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2.5 h-2.5 border border-green-600 flex items-center justify-center p-[2px]"><div className="w-full h-full bg-green-600 rounded-full"></div></div>
                    <h3 className="text-[10px] font-black uppercase truncate">{p.name?.en}</h3>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-black italic text-orange-600">₹{p.price}</span>
                    <button onClick={() => setCart([...cart, p])} className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black">+</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* --- ORDER HISTORY TAB --- */}
        {ui.tab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black italic uppercase mb-6">Order History</h2>
            {history.slice().reverse().map((o, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                <div className="flex justify-between mb-2">
                   <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{o.id}</span>
                   <span className="text-orange-600 font-black text-[10px] uppercase bg-orange-50 dark:bg-orange-600/10 px-3 py-1 rounded-full">{o.status}</span>
                </div>
                <p className="text-xs font-black uppercase mb-4">{o.items?.map(i => i.name?.en).join(', ')}</p>
                <div className="flex justify-between items-center">
                   <span className="text-lg font-black italic">₹{o.total}</span>
                   <button onClick={() => setCart(o.items)} className="px-5 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase">Repeat Order</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- PREMIUM CHECKOUT DOCK --- */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="fixed bottom-24 left-4 right-4 z-[200] bg-black text-white p-6 rounded-[3rem] shadow-2xl">
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
               {['COD', 'Online Pay', 'Pre-Order'].map(m => (
                 <button key={m} onClick={()=>setPayMethod(m)} className={`px-5 py-2 rounded-full text-[9px] font-black whitespace-nowrap ${payMethod === m ? 'bg-orange-600' : 'bg-white/10 opacity-40'}`}>{m}</button>
               ))}
            </div>
            <div className="flex justify-between items-center">
               <div>
                 <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">{cart.length} Items</p>
                 <p className="text-2xl font-black italic text-orange-500">₹{cart.reduce((a,b)=>a+b.price,0)}</p>
               </div>
               <button onClick={placeOrder} className="bg-orange-600 px-10 py-5 rounded-2xl font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">Order Now →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOTTOM TABS (ZOMATO STYLE) --- */}
      <nav className={`fixed bottom-0 w-full py-5 border-t flex justify-around items-center z-[250] ${ui.dark ? 'bg-black border-white/5 shadow-2xl shadow-orange-600/10' : 'bg-white border-gray-100 shadow-xl'}`}>
         {[{id:'home',icon:'🏠'}, {id:'search',icon:'🔍'}, {id:'orders',icon:'🥡'}, {id:'settings',icon:'⚙️'}].map(tab => (
           <button key={tab.id} onClick={()=>setUi({...ui, tab: tab.id})} className={`flex flex-col items-center transition-all ${ui.tab === tab.id ? 'scale-110 opacity-100' : 'opacity-20'}`}>
             <span className="text-xl">{tab.icon}</span>
             <span className="text-[8px] font-black uppercase mt-1">{tab.id}</span>
           </button>
         ))}
      </nav>
    </div>
  );
}