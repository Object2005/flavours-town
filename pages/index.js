import { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set, serverTimestamp, update } from "firebase/database";

// --- PROFESSIONAL ENGINE CONFIG ---
const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", 
  projectId: "flavourstown-83891", 
  storageBucket: "flavourstown-83891.firebasestorage.app", 
  messagingSenderId: "631949771733", 
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// --- ENTERPRISE CONSTANTS ---
const OWNER_CONTACT = "919877474778";
const DEV_INFO = { name: "Aashray Narang", git: "github.com/aashray", linkedin: "linkedin.com/in/aashray" };

const TRANSLATIONS = {
  EN: { welcome: "Welcome to FT", search: "Search food in Malout...", explore: "Explore Categories", add: "ADD", cart: "View Cart", checkout: "Place Order", status: "Tracking", shopClosed: "Kitchen is currently closed", empty: "No items found" },
  PB: { welcome: "ਜੀ ਆਇਆਂ ਨੂੰ", search: "ਖਾਣਾ ਲੱਭੋ...", explore: "ਕੈਟੇਗਰੀਜ਼", add: "ਜੋੜੋ", cart: "ਕਾਰਟ ਦੇਖੋ", checkout: "ਆਰਡਰ ਕਰੋ", status: "ਟਰੈਕਿੰਗ", shopClosed: "ਕਿਚਨ ਇਸ ਸਮੇਂ ਬੰਦ ਹੈ", empty: "ਕੋਈ ਆਈਟਮ ਨਹੀਂ ਮਿਲੀ" }
};

export default function EnterpriseApp() {
  // --- MASTER STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [shopStatus, setShopStatus] = useState(true);
  const [ui, setUi] = useState({ lang: 'EN', dark: false, tab: 'home', search: '', category: 'All', loading: true });

  // --- HAPTIC & AUDIO ENGINE ---
  const haptic = (type = 'light') => {
    if (!window.navigator.vibrate) return;
    type === 'heavy' ? window.navigator.vibrate([30, 50, 30]) : window.navigator.vibrate(10);
  };

  const playSound = (type) => {
    const src = type === 'order' ? 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' : 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';
    new Audio(src).play().catch(() => {});
  };

  // --- DATA SYNCHRONIZATION ---
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('ft_user'));
    if (!localUser) window.location.href = '/auth';
    setUser(localUser);

    onValue(ref(db, 'shopStatus'), snap => setShopStatus(snap.val()));
    onValue(ref(db, 'menu'), snap => {
      setMenu(snap.exists() ? snap.val() : []);
      setUi(prev => ({ ...prev, loading: false }));
    });

    onValue(ref(db, 'orders'), snap => {
      if (snap.exists() && localUser) {
        const orders = Object.values(snap.val());
        const active = orders.find(o => o.user?.phone === localUser.phone && o.status !== 'Delivered');
        if (active && activeOrder && active.status !== activeOrder.status) {
          haptic('heavy');
          playSound('order');
        }
        setActiveOrder(active || null);
      }
    });
  }, [activeOrder?.status]);

  // --- LOGIC HANDLERS ---
  const filteredItems = useMemo(() => {
    return menu.filter(item => 
      item.name?.en.toLowerCase().includes(ui.search.toLowerCase()) && 
      (ui.category === 'All' || item.category === ui.category)
    );
  }, [menu, ui.search, ui.category]);

  const toggleCart = (item) => {
    haptic();
    playSound('add');
    const exists = cart.find(i => i.id === item.id);
    if (exists) setCart(cart.filter(i => i.id !== item.id));
    else setCart([...cart, item]);
  };

  const submitOrder = async () => {
    haptic('heavy');
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      id: orderId, user, items: cart,
      total: cart.reduce((a, b) => a + b.price, 0),
      status: 'Received',
      method: 'COD',
      createdAt: serverTimestamp()
    };

    try {
      await set(ref(db, `orders/${orderId}`), payload);
      setCart([]);
      playSound('order');
      window.open(`https://wa.me/${OWNER_CONTACT}?text=New Order: ${orderId}, Total: ₹${payload.total}`, '_blank');
    } catch (e) { alert("Network Error: Order Failed"); }
  };

  if (ui.loading) return <div className="h-screen flex items-center justify-center font-black italic opacity-20 text-4xl">LOADING FT...</div>;

  return (
    <div className={`min-h-screen transition-all duration-500 ${ui.dark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fcfbf7] text-[#1a1a1a]'} font-sans`}>
      <Head><title>The Flavours Town | Premium</title></Head>

      {/* --- ZOMATO STYLE HEADER --- */}
      <header className={`sticky top-0 z-[100] px-6 py-5 border-b flex justify-between items-center transition-colors ${ui.dark ? 'bg-black/90 border-white/5' : 'bg-white/90 border-gray-100'} backdrop-blur-2xl`}>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black italic text-orange-600 tracking-tighter uppercase leading-none">The Flavours Town</h1>
          <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.4em] mt-1 italic">Engineered by {DEV_INFO.name}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setUi({...ui, dark: !ui.dark})} className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl">{ui.dark ? '☀️' : '🌙'}</button>
          <button onClick={() => setUi({...ui, lang: ui.lang === 'EN' ? 'PB' : 'EN'})} className="bg-orange-600 text-white px-4 rounded-2xl text-[10px] font-black">{ui.lang}</button>
        </div>
      </header>

      <main className="p-5 max-w-5xl mx-auto pb-48">
        
        {/* --- LIVE ORDER STATUS (BLINKIT STYLE) --- */}
        
        <AnimatePresence>
          {activeOrder && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-10 p-8 rounded-[3rem] bg-[#1a1a1a] dark:bg-orange-600 text-white shadow-2xl relative overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">{TRANSLATIONS[ui.lang].status}</span>
                 <span className="px-5 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase animate-pulse tracking-widest">{activeOrder.status}</span>
               </div>
               <div className="h-1.5 w-full bg-white/10 rounded-full mb-6 overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: activeOrder.status === 'Ready' ? '100%' : '60%' }} className="h-full bg-white shadow-[0_0_15px_white]" />
               </div>
               <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-2">
                 {activeOrder.status === 'Received' ? 'Order Confirmed' : activeOrder.status === 'Cooking' ? 'Chef is Frying...' : 'Ready to Pick!'}
               </h2>
               <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Order ID: #{activeOrder.id}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SEARCH & CATEGORIES --- */}
        {ui.tab === 'home' && (
          <div className="mb-10 space-y-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder={TRANSLATIONS[ui.lang].search} 
                className={`w-full p-6 pl-16 rounded-[2.5rem] outline-none font-bold text-sm shadow-sm transition-all ${ui.dark ? 'bg-white/5 focus:bg-white/10' : 'bg-white focus:shadow-xl'}`}
                onChange={(e) => setUi({...ui, search: e.target.value})}
              />
              <span className="absolute left-6 top-6 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {['All', 'Chaap', 'Tikka', 'Rolls', 'Paneer'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setUi({...ui, category: cat})}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${ui.category === cat ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/30' : 'bg-white dark:bg-white/5 border border-transparent'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- PREMIUM MENU GRID --- */}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((p, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`group rounded-[3rem] p-5 transition-all duration-500 border ${ui.dark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-black/5 hover:shadow-2xl'} ${(!p.inStock || !shopStatus) ? 'opacity-30 grayscale pointer-events-none' : ''}`}
            >
              <div className="h-40 rounded-[2.5rem] overflow-hidden mb-5 relative">
                {p.bestseller && <div className="absolute top-4 left-4 bg-orange-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full z-10 shadow-lg">BESTSELLER</div>}
                <img src={p.img} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={p.name?.en} />
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-3 h-3 border border-green-600 flex items-center justify-center p-[2px]"><div className="w-full h-full bg-green-600 rounded-full"></div></div>
                <h3 className="text-xs font-black uppercase tracking-tight truncate">{ui.lang === 'EN' ? p.name?.en : p.name?.pb || p.name?.en}</h3>
              </div>
              <div className="flex justify-between items-center mt-5">
                <span className="text-xl font-black italic tracking-tighter text-orange-600">₹{p.price}</span>
                <button 
                  onClick={() => toggleCart(p)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${cart.find(i => i.id === p.id) ? 'bg-black text-white' : 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 active:scale-90'}`}
                >
                  {cart.find(i => i.id === p.id) ? '✓' : '+'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- ZOMATO STYLE BOTTOM DOCK --- */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{ y: 150 }} animate={{ y: 0 }} exit={{ y: 150 }} className="fixed bottom-24 left-5 right-5 z-[200] max-w-lg mx-auto">
            <div className={`p-6 rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.3)] flex justify-between items-center px-10 border ${ui.dark ? 'bg-[#1a1a1a] border-white/10' : 'bg-black text-white border-white/10'}`}>
              <div>
                <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">{cart.length} {TRANSLATIONS[ui.lang].cart}</p>
                <p className="text-3xl font-black italic tracking-tighter text-orange-500 leading-none mt-1">₹{cart.reduce((a, b) => a + b.price, 0)}</p>
              </div>
              <button onClick={submitOrder} className="bg-orange-600 px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-xl shadow-orange-600/30 active:scale-95 transition-all">
                {TRANSLATIONS[ui.lang].checkout} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BOTTOM NAVIGATION TABS --- */}
      <nav className={`fixed bottom-0 w-full py-6 border-t flex justify-around items-center z-[250] transition-colors ${ui.dark ? 'bg-black border-white/5' : 'bg-white border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]'}`}>
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'search', icon: '🔍', label: 'Search' },
          { id: 'orders', icon: '🥡', label: 'Orders' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => { haptic(); setUi({...ui, tab: tab.id}); }}
            className={`flex flex-col items-center gap-1.5 transition-all ${ui.tab === tab.id ? 'scale-110 opacity-100' : 'opacity-20'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${ui.tab === tab.id ? 'text-orange-600' : ''}`}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}