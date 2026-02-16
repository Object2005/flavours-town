import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG ---
const GEMINI_API_KEY = "AIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKw"; 

// --- ORIGINAL 19 ITEMS DATA (YOUR LOCAL IMAGES) ---
const initialMenuData = [
  { id: 1, category: "Chaap", isBest: true, name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, img: "/img/malai-chaap.jpg" },
  { id: 2, category: "Chaap", isBest: false, name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, img: "/img/masala-chaap.jpg" },
  { id: 3, category: "Chaap", isBest: true, name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, img: "/img/afghani-chaap.jpg" },
  { id: 4, category: "Chaap", isBest: false, name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, img: "/img/achari-chaap.jpg" },
  { id: 5, category: "Tikka", isBest: true, name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, img: "/img/paneer-tikka.jpg" },
  { id: 6, category: "Tikka", isBest: false, name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, img: "/img/mushroom-tikka.jpg" },
  { id: 7, category: "Rolls", isBest: false, name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, img: "/img/frankie.jpg" },
  { id: 8, category: "Rolls", isBest: true, name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, img: "/img/paneer-roll.jpg" },
  { id: 9, category: "Rolls", isBest: false, name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, img: "/img/chaap-roll.jpg" },
  { id: 10, category: "Rolls", isBest: false, name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, img: "/img/mushroom-roll.jpg" },
  { id: 11, category: "Snacks", isBest: true, name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, img: "/img/pav-bhaji.jpg" },
  { id: 12, category: "Rolls", isBest: false, name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, img: "/img/twister.jpg" },
  { id: 13, category: "Snacks", isBest: false, name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, img: "/img/kulcha.jpg" },
  { id: 14, category: "Snacks", isBest: true, name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, img: "/img/cheese-chilli.jpg" },
  { id: 15, category: "Snacks", isBest: false, name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, img: "/img/kacha-paneer.jpg" },
  { id: 16, category: "Snacks", isBest: false, name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, img: "/img/paneer-fry.jpg" },
  { id: 17, category: "Sweets", isBest: true, name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, img: "/img/gulab-jamun.jpg" },
  { id: 18, category: "Sweets", isBest: true, name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, img: "/img/rabri-jamun.jpg" },
  { id: 19, category: "Sweets", isBest: false, name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, img: "/img/gajrela.jpg" }
];

// --- COUNTDOWN COMPONENT ---
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) { setTimeLeft("READY!"); clearInterval(interval); } 
      else {
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${m}:${s < 10 ? '0' : ''}${s}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return <span className="font-mono text-orange-400 font-bold">{timeLeft}</span>;
};

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState('pu');
  
  // --- ADMIN STATE ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [liveOrders, setLiveOrders] = useState([]);
  const [prepTime, setPrepTime] = useState(20);
  
  // --- USER STATE ---
  const [myOrder, setMyOrder] = useState(null);
  const [sessionOrderId, setSessionOrderId] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', phone: '' });
  
  // --- UI STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  // --- INIT ---
  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    
    // Load Data
    const savedMenu = localStorage.getItem('ft_v13_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));

    const savedKitchen = localStorage.getItem('ft_v13_kitchen');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    if ("Notification" in window) Notification.requestPermission();

    // Sync Loop
    const interval = setInterval(() => {
        const storedOrders = JSON.parse(localStorage.getItem('ft_v13_orders') || '[]');
        setLiveOrders(prev => {
            if (storedOrders.length > prev.length && isAdmin) {
               try { new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play(); } catch(e){}
               if (Notification.permission === "granted") new Notification(`New Order: ₹${storedOrders[storedOrders.length-1].total}`);
            }
            return storedOrders;
        });
        const myActive = storedOrders.find(o => o.id === sessionOrderId);
        if (myActive) setMyOrder(myActive);
    }, 1000);
    return () => clearInterval(interval);
  }, [isAdmin, sessionOrderId]);

  // --- HANDLERS ---
  const placeOrder = (method) => {
    if (!isKitchenOpen) return alert("Shop Closed!");
    if (!userDetails.name || !userDetails.phone) return alert("Fill Details!");
    
    const finishTime = new Date().getTime() + (prepTime * 60 * 1000);
    const newOrder = {
        id: sessionOrderId, user: userDetails, items: cart,
        total: cart.reduce((a, b) => a + b.price, 0),
        status: 'Pending', targetTime: finishTime, method: method, time: new Date().toLocaleTimeString()
    };

    localStorage.setItem('ft_v13_orders', JSON.stringify([...liveOrders, newOrder]));
    setMyOrder(newOrder); setCart([]); setShowCheckout(false);
  };

  const updateStatus = (id, status) => {
      const updated = liveOrders.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem('ft_v13_orders', JSON.stringify(updated));
      setLiveOrders(updated);
  };

  const toggleStock = (id) => {
      const updated = menu.map(i => i.id === id ? { ...i, inStock: !i.inStock } : i);
      setMenu(updated);
      localStorage.setItem('ft_v13_menu', JSON.stringify(updated));
  };

  const filteredItems = menu.filter(i => {
      const matchesSearch = i.name.en.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || i.category === activeCategory;
      return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen text-white font-sans overflow-x-hidden ${isAdmin ? 'bg-[#0f1115]' : 'bg-[#050505]'}`}>
      <Head><title>Flavour's Town {isAdmin ? 'Admin' : ''}</title></Head>

      {/* --- HEADER --- */}
      <header className={`fixed top-0 w-full z-[100] px-4 py-3 backdrop-blur-xl border-b flex justify-between items-center ${isAdmin ? 'bg-zinc-900/90 border-orange-500/30' : 'bg-black/60 border-white/5'}`}>
        <div className="flex items-center gap-2">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-black shadow-lg ${isAdmin ? 'bg-orange-600 text-white' : 'bg-gradient-to-tr from-orange-600 to-red-600'}`}>FT</div>
          <div><h1 className="text-xs font-black uppercase tracking-tight">{isAdmin ? 'COMMAND CENTER' : "FLAVOUR'S TOWN"}</h1><p className="text-[9px] text-gray-400">{isAdmin ? 'ADMIN MODE' : 'MALOUT'}</p></div>
        </div>
        <div className="flex gap-2">
            {!isAdmin && <button onClick={() => setLang(lang==='pu'?'en':'pu')} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black">{lang==='pu'?'EN':'ਪੰ'}</button>}
            <button onClick={() => { const p=prompt("Admin:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${isAdmin ? 'bg-orange-600 text-white animate-pulse' : 'bg-white/5 hover:bg-orange-600'}`}>⚙️</button>
        </div>
      </header>

      <div className="pt-20 px-3 md:px-8 max-w-[1400px] mx-auto pb-32">
        
        {/* ================= ADMIN DASHBOARD (TECHNICAL THEME) ================= */}
        {isAdmin ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* 1. MASTER CONTROLS */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button onClick={() => { setIsKitchenOpen(!isKitchenOpen); localStorage.setItem('ft_v13_kitchen', !isKitchenOpen) }} className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${isKitchenOpen ? 'bg-green-900/20 border-green-500 text-green-500' : 'bg-red-900/20 border-red-500 text-red-500'}`}>
                        <span className="text-3xl mb-2">{isKitchenOpen ? '🟢' : '🔴'}</span>
                        <span className="font-black text-xs uppercase tracking-widest">{isKitchenOpen ? 'SHOP OPEN' : 'SHOP CLOSED'}</span>
                    </button>
                    <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-gray-400 uppercase mb-2">PREP TIME</span>
                        <div className="flex items-center gap-4">
                            <button onClick={()=>setPrepTime(p=>Math.max(5,p-5))} className="text-2xl text-orange-500 font-black">-</button>
                            <span className="text-3xl font-mono font-bold">{prepTime}m</span>
                            <button onClick={()=>setPrepTime(p=>p+5)} className="text-2xl text-orange-500 font-black">+</button>
                        </div>
                    </div>
                </div>

                {/* 2. LIVE ORDERS FEED */}
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 pl-2">INCOMING ORDERS ({liveOrders.filter(o=>o.status!=='Ready').length})</h3>
                <div className="space-y-3 mb-10">
                    {liveOrders.filter(o=>o.status!=='Ready').length===0 && <p className="text-center text-gray-600 text-xs py-10">No Pending Orders...</p>}
                    {liveOrders.slice().reverse().map((order) => (
                       <div key={order.id} className={`p-5 rounded-xl border relative overflow-hidden ${order.status==='Ready'?'bg-green-900/10 border-green-500/30 opacity-50':'bg-zinc-900 border-white/10'}`}>
                           <div className="flex justify-between items-start mb-3">
                               <div>
                                   <h3 className="font-bold text-base text-orange-500">{order.user.name}</h3>
                                   <a href={`tel:${order.user.phone}`} className="text-[10px] text-gray-400 hover:text-white underline">{order.user.phone}</a>
                                   <div className="mt-1"><CountdownTimer targetDate={order.targetTime}/></div>
                               </div>
                               <div className="text-right">
                                   <p className="text-xl font-black">₹{order.total}</p>
                                   <span className="text-[9px] font-bold bg-white/10 px-2 py-1 rounded">{order.method}</span>
                               </div>
                           </div>
                           <div className="bg-black/30 p-3 rounded-lg text-xs text-gray-300 mb-3 space-y-1">
                               {order.items.map((i,idx) => <div key={idx} className="flex justify-between"><span>{i.name.en}</span><span>₹{i.price}</span></div>)}
                           </div>
                           <div className="grid grid-cols-4 gap-2">
                               {['Pending', 'Accepted', 'Cooking', 'Ready'].map(s => (
                                   <button key={s} onClick={()=>updateStatus(order.id, s)} className={`py-2 rounded text-[8px] font-black uppercase border transition-all ${order.status===s ? 'bg-orange-600 border-orange-500 text-white' : 'bg-transparent border-white/10 text-gray-500'}`}>{s}</button>
                               ))}
                           </div>
                       </div> 
                    ))}
                </div>

                {/* 3. STOCK MANAGEMENT (The Control You Wanted) */}
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 pl-2">STOCK MANAGER</h3>
                <div className="grid grid-cols-2 gap-3">
                    {menu.map(m => (
                        <button key={m.id} onClick={()=>toggleStock(m.id)} className={`relative p-3 rounded-xl border text-left overflow-hidden ${m.inStock ? 'bg-zinc-900 border-green-900/50' : 'bg-red-900/10 border-red-500/50'}`}>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={`w-2 h-2 rounded-full ${m.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-300">{m.name.en}</p>
                                    <p className={`text-[8px] font-black uppercase ${m.inStock ? 'text-green-600' : 'text-red-500'}`}>{m.inStock ? 'IN STOCK' : 'SOLD OUT'}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            
        /* ================= USER INTERFACE (GLASS THEME) ================= */
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-8 items-start">
                
                {/* SIDEBAR (Desktop) */}
                <aside className="hidden lg:block sticky top-24 space-y-2">
                    <button onClick={() => setActiveCategory("All")} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-xs border ${activeCategory === "All" ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-500'}`}>ALL ITEMS</button>
                    {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-xs border ${activeCategory === cat ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-500'}`}>{cat}</button>
                    ))}
                </aside>

                {/* MAIN FEED */}
                <main className="w-full">
                    <div className="relative mb-6">
                        <input type="text" placeholder="Search craving..." onChange={e=>setSearchQuery(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500/50 text-sm font-bold text-white placeholder:text-gray-700" />
                    </div>

                    <div className="flex lg:hidden gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
                        <button onClick={() => setActiveCategory("All")} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border ${activeCategory==="All" ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>All</button>
                        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap border ${activeCategory===cat ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>{cat}</button>
                        ))}
                    </div>

                    {!isKitchenOpen && <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl text-center text-red-500 font-black text-xs uppercase tracking-widest mb-6">🚫 Kitchen is currently Closed</div>}

                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                        {filteredItems.map(p => (
                            <motion.div whileTap={{scale:0.97}} key={p.id} className={`bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] overflow-hidden relative group ${!p.inStock ? 'grayscale opacity-50' : ''}`}>
                                <div className="h-32 md:h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                    <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <span className="absolute bottom-2 left-3 z-20 text-white font-black text-xs md:text-sm">₹{p.price}</span>
                                    <span className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] text-yellow-400">★ {p.rating}</span>
                                </div>
                                <div className="p-3 relative z-20">
                                    <h3 className="text-[11px] md:text-sm font-bold uppercase mb-2 leading-tight text-gray-200 line-clamp-1">{p.name[lang]}</h3>
                                    {p.inStock ? (
                                        <button onClick={() => setCart([...cart, p])} disabled={!isKitchenOpen} className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-gray-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all">ADD +</button>
                                    ) : (
                                        <div className="w-full py-2 rounded-lg bg-red-900/20 border border-red-900/50 text-[10px] font-black text-red-500 text-center">SOLD OUT</div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>

                {/* DESKTOP CART */}
                <aside className="hidden lg:block sticky top-24 bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-5 h-fit">
                    <h3 className="font-black italic text-white mb-4">YOUR TRAY <span className="text-orange-500">({cart.length})</span></h3>
                    {cart.length > 0 && (
                        <div>
                            <div className="space-y-2 mb-4 max-h-[30vh] overflow-auto custom-scrollbar">
                                {cart.map((c, i) => <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-1"><span className="text-gray-400">{c.name.en}</span><span>₹{c.price}</span></div>)}
                            </div>
                            <button onClick={() => setShowCheckout(true)} className="w-full bg-white text-black py-3 rounded-xl font-bold text-xs hover:bg-orange-500 hover:text-white transition-all">CHECKOUT ₹{cart.reduce((a,b)=>a+b.price, 0)}</button>
                        </div>
                    )}
                </aside>
            </div>
        )}

        {/* --- MOBILE FLOATING CART --- */}
        <AnimatePresence>
            {cart.length > 0 && !isAdmin && (
                <motion.div initial={{y:100}} animate={{y:0}} className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
                    <button onClick={() => setShowCheckout(true)} className="w-full bg-orange-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center">
                        <span className="font-bold text-[10px] uppercase bg-black/20 px-3 py-1 rounded-lg">{cart.length} Items</span>
                        <span className="font-black text-lg italic">₹{cart.reduce((a,b)=>a+b.price, 0)} <span className="text-xs font-normal opacity-70 ml-1">Place Order </span></span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- LIVE STATUS HUD (TIMER) --- */}
        <AnimatePresence>
            {myOrder && !isAdmin && (
                <motion.div drag dragConstraints={{top:0, bottom:0, left:0, right:0}} className="fixed top-20 right-4 z-[90] lg:right-10 cursor-grab active:cursor-grabbing">
                    <div className="bg-black/90 backdrop-blur-xl border border-orange-500/40 p-4 rounded-2xl shadow-[0_0_40px_rgba(234,88,12,0.2)] w-48">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-black text-orange-500 uppercase animate-pulse">● PREPARING</span>
                            <button onClick={()=>setMyOrder(null)} className="text-xs text-gray-600">✕</button>
                        </div>
                        <h3 className="text-2xl font-black text-white leading-none mb-1"><CountdownTimer targetDate={myOrder.targetTime} /></h3>
                        <p className="text-[10px] text-gray-500">Estimated Ready Time</p>
                        <div className="mt-2 text-[10px] uppercase font-bold text-gray-300 bg-white/5 px-2 py-1 rounded text-center">Status: {myOrder.status}</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- CHECKOUT DRAWER --- */}
        <AnimatePresence>
            {showCheckout && (
                <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 z-[200] bg-[#050505] p-6 pt-12 overflow-y-auto lg:flex lg:items-center lg:justify-center lg:bg-black/90 lg:backdrop-blur-sm">
                    <div className="lg:w-[400px] lg:bg-[#0a0a0a] lg:p-8 lg:rounded-[2.5rem] lg:border lg:border-white/10">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black italic text-white">CONFIRM <span className="text-orange-500">DETAILS</span></h2>
                            <button onClick={() => setShowCheckout(false)} className="text-xs font-bold text-gray-500">CANCEL</button>
                        </div>
                        <div className="space-y-5 mb-8">
                            <div className="group"><label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Your Name</label><input type="text" value={userDetails.name} onChange={e=>setUserDetails({...userDetails, name:e.target.value})} className="w-full bg-[#111] border border-white/10 p-4 rounded-xl outline-none font-bold text-white focus:border-orange-500 transition-all text-sm" placeholder="e.g. Aashray" /></div>
                            <div className="group"><label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Phone Number</label><input type="number" value={userDetails.phone} onChange={e=>setUserDetails({...userDetails, phone:e.target.value})} className="w-full bg-[#111] border border-white/10 p-4 rounded-xl outline-none font-bold text-white focus:border-orange-500 transition-all text-sm" placeholder="+91 987..." /></div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl mb-6 border border-white/5 space-y-2">
                            {cart.map((c, i) => (<div key={i} className="flex justify-between text-xs text-gray-400"><span>{c.name.en}</span><span>₹{c.price}</span></div>))}
                            <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-black text-white mt-1"><span>TOTAL</span><span>₹{cart.reduce((a,b)=>a+b.price, 0)}</span></div>
                        </div>
                        <button onClick={() => placeOrder('COD')} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase mb-3 hover:bg-gray-200 transition-all text-xs tracking-widest shadow-lg">PAY CASH ON DELIVERY</button>
                        <button onClick={() => placeOrder('UPI')} className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black uppercase hover:opacity-90 transition-all text-xs tracking-widest shadow-lg">CONFIRM & WHATSAPP</button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}