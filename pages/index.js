import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

const DEV_NAME = "Aashray Narang";
const OWNER_NUM = "919877474778";

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [userOrder, setUserOrder] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (saved) setUser(JSON.parse(saved));
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.val() === true));
    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'orders'), snap => {
      if (snap.exists() && saved) {
        const u = JSON.parse(saved);
        const active = Object.values(snap.val()).find(o => o.user?.phone === u.phone && o.status !== 'Delivered');
        setUserOrder(active || null);
      }
    });
  }, []);

  const filteredMenu = menu.filter(item => 
    item.name?.en.toLowerCase().includes(search.toLowerCase()) && 
    (category === 'All' || item.category === category)
  );

  const placeOrder = () => {
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = { id: orderId, user, items: cart, total: cart.reduce((a,b)=>a+b.price,0), status: 'Received', timestamp: new Date().toISOString() };
    set(ref(db, 'orders/' + orderId), orderData);
    window.open(`https://wa.me/${OWNER_NUM}?text=Nava Order: ${orderId}`, '_blank');
    setCart([]);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-sans pb-32">
      <Head><title>The Flavours Town</title></Head>

      {/* --- PREMIUM HEADER --- */}
      <header className="p-6 bg-white flex justify-between items-center sticky top-0 z-50 border-b border-gray-100">
        <div>
          <h1 className="font-black italic text-orange-600 text-lg leading-none">THE FLAVOURS TOWN</h1>
          <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] mt-1">By {DEV_NAME}</p>
        </div>
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${isShopOpen ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
           <span className="text-[10px] font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        
        {/* --- SEARCH & CATEGORIES --- */}
        {activeTab === 'home' && (
          <div className="mb-8 space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Chaap, Tikka..." 
                className="w-full p-4 pl-12 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none font-bold text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-4 top-4 opacity-30">🔍</span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              {['All', 'Chaap', 'Tikka', 'Rolls', 'Paneer'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-white border border-gray-100 opacity-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- LIVE STATUS ALERT --- */}
        {userOrder && (
          <motion.div initial={{y:-20}} animate={{y:0}} className="mb-8 p-6 bg-green-600 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black uppercase opacity-60">Zomato-Style Alert</span>
                <span className="text-xl">💬</span>
             </div>
             <p className="text-sm font-black italic uppercase tracking-tight">Order #{userOrder.id} is {userOrder.status}! 🔥</p>
          </motion.div>
        )}

        {/* --- MENU GRID --- */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-2 gap-4">
            {filteredMenu.map(p => (
              <div key={p.id} className={`bg-white rounded-[2.5rem] p-4 border border-gray-50 shadow-sm relative transition-all ${(!p.inStock || !isShopOpen) ? 'opacity-30 grayscale' : 'hover:shadow-xl'}`}>
                {p.bestseller && <div className="absolute top-6 left-6 z-10 bg-orange-500 text-white text-[7px] font-black px-2 py-1 rounded-full uppercase">Bestseller</div>}
                <img src={p.img} className="w-full h-32 object-cover rounded-[1.5rem] mb-3" />
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-2 h-2 border border-green-600 flex items-center justify-center p-[1px]"><div className="w-full h-full bg-green-600 rounded-full" /></div>
                  <h3 className="text-[10px] font-black uppercase truncate tracking-tighter">{p.name?.en}</h3>
                </div>
                <p className="text-orange-600 font-black italic text-lg mb-2">₹{p.price}</p>
                <button onClick={() => setCart([...cart, p])} disabled={!isShopOpen || !p.inStock} className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Add +</button>
              </div>
            ))}
          </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
               <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-4">{user.name[0]}</div>
               <h2 className="text-xl font-black uppercase tracking-tighter italic">{user.name}</h2>
               <p className="text-[10px] font-bold opacity-30">{user.phone}</p>
            </div>
            <div className="bg-white p-4 rounded-[2rem] border border-gray-100 flex justify-between items-center px-8">
               <span className="text-[10px] font-black uppercase opacity-40">Language</span>
               <span className="text-[10px] font-black">ENGLISH</span>
            </div>
            <div className="pt-10 text-center opacity-20 italic">
               <p className="text-[9px] font-black uppercase tracking-widest">Designed & Developed by</p>
               <p className="text-[11px] font-black uppercase mt-1">{DEV_NAME}</p>
            </div>
          </div>
        )}
      </main>

      {/* --- FLOATING CART --- */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-24 left-4 right-4 bg-[#1a1a1a] p-5 rounded-[2.5rem] shadow-2xl z-[100] flex justify-between items-center px-8 text-white">
             <div className="flex flex-col">
                <span className="text-[8px] font-black opacity-40 uppercase tracking-widest">{cart.length} Items</span>
                <span className="text-xl font-black italic uppercase">₹{cart.reduce((a,b)=>a+b.price,0)}</span>
             </div>
             <button onClick={placeOrder} className="bg-orange-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-orange-600/30">Checkout →</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ZOMATO STYLE BOTTOM TABS --- */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around py-5 z-[150]">
         {[
           {id: 'home', icon: '🏠', label: 'Home'},
           {id: 'search', icon: '🔍', label: 'Search'},
           {id: 'orders', icon: '🥡', label: 'Orders'},
           {id: 'settings', icon: '⚙️', label: 'Settings'}
         ].map(tab => (
           <button 
             key={tab.id} 
             onClick={() => setActiveTab(tab.id)}
             className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'scale-110' : 'opacity-20'}`}
           >
             <span className="text-lg">{tab.icon}</span>
             <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
           </button>
         ))}
      </nav>
    </div>
  );
}