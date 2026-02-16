import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG ---
const GEMINI_API_KEY = "AIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKw"; 

// --- FULL MENU DATA (19 ITEMS) ---
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

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState('pu');
  
  // --- ADMIN & SYSTEM STATE ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  
  // --- USER STATE ---
  const [myOrder, setMyOrder] = useState(null);
  const [sessionOrderId, setSessionOrderId] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', phone: '' });
  
  // --- UI STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Chaap");

  // --- INIT & REAL-TIME SYNC ---
  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    
    // Load Menu & Kitchen Status
    const savedMenu = localStorage.getItem('ft_god_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));

    const savedKitchen = localStorage.getItem('ft_god_kitchen');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    if ("Notification" in window) Notification.requestPermission();

    // 🔄 THE SYNC LOOP (1 Second Heartbeat)
    const interval = setInterval(() => {
        const storedOrders = JSON.parse(localStorage.getItem('ft_god_orders') || '[]');
        
        // Admin: Detect New Orders
        setLiveOrders(prev => {
            if (storedOrders.length > prev.length && isAdmin) {
               try { new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play(); } catch(e){}
               if (Notification.permission === "granted") new Notification(`New Order! ₹${storedOrders[storedOrders.length-1].total}`);
            }
            return storedOrders;
        });

        // User: Update My Status
        const myActive = storedOrders.find(o => o.id === sessionOrderId);
        if (myActive) setMyOrder(myActive);

    }, 1000);

    return () => clearInterval(interval);
  }, [isAdmin, sessionOrderId]);

  // --- ACTIONS ---
  const toggleStock = (id) => {
      const updatedMenu = menu.map(item => item.id === id ? { ...item, inStock: !item.inStock } : item);
      setMenu(updatedMenu);
      localStorage.setItem('ft_god_menu', JSON.stringify(updatedMenu));
  };

  const placeOrder = (method) => {
    if (!userDetails.name || !userDetails.phone) return alert("Veer, Name te Phone Number zaroori hai!");
    if (!isKitchenOpen) return alert("Kitchen Closed hai veer!");

    const newOrder = {
        id: sessionOrderId,
        user: userDetails,
        items: cart,
        total: cart.reduce((a, b) => a + b.price, 0),
        status: 'Pending', // Pending -> Accepted -> Cooking -> Ready
        time: new Date().toLocaleTimeString(),
        method: method
    };

    const updatedOrders = [...liveOrders, newOrder];
    localStorage.setItem('ft_god_orders', JSON.stringify(updatedOrders));
    setMyOrder(newOrder);
    setCart([]);
    setShowCheckout(false);
  };

  const updateStatus = (id, status) => {
      const updated = liveOrders.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem('ft_god_orders', JSON.stringify(updated));
      setLiveOrders(updated);
  };

  const filteredItems = menu.filter(i => i.name.en.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      <Head><title>Flavour's Town | Ultimate</title></Head>

      {/* --- HEADER (GLASS + NEON) --- */}
      <header className="fixed top-0 w-full z-[100] px-4 py-4 backdrop-blur-xl bg-black/40 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-600 to-red-700 h-11 w-11 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_25px_rgba(234,88,12,0.6)]">FT</div>
          <div><h1 className="text-sm font-black italic uppercase tracking-tighter">Flavour's Town</h1><p className="text-[9px] text-gray-400 tracking-[0.3em]">EST. 2026</p></div>
        </div>
        <div className="flex gap-3">
            {!isAdmin && <button onClick={() => setLang(lang==='pu'?'en':'pu')} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black hover:bg-white/10 transition-all">{lang==='pu'?'EN':'ਪੰ'}</button>}
            <button onClick={() => { const p=prompt("Admin Pass:"); if(p==="aashray778") setIsAdmin(true); }} className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-orange-600 transition-all">⚙️</button>
        </div>
      </header>

      <div className="pt-28 px-4 md:px-8 max-w-[1400px] mx-auto pb-40">
        
        {/* --- ADMIN COMMAND CENTER --- */}
        {isAdmin ? (
            <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">COMMAND CENTER</h2>
                        <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Live Kitchen Dashboard</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => { setIsKitchenOpen(!isKitchenOpen); localStorage.setItem('ft_god_kitchen', !isKitchenOpen) }} className={`px-6 py-3 rounded-full font-black text-xs border ${isKitchenOpen ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-red-500/20 border-red-500 text-red-500'}`}>
                            {isKitchenOpen ? '● KITCHEN OPEN' : '○ KITCHEN CLOSED'}
                        </button>
                        <button onClick={() => setIsAdmin(false)} className="bg-white/10 px-6 py-3 rounded-full text-xs font-bold hover:bg-white/20">EXIT</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT: ORDER FEED */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">🔥 Live Orders <span className="bg-orange-600 text-white text-[10px] px-2 rounded-full">{liveOrders.filter(o=>o.status!=='Ready').length}</span></h3>
                        {liveOrders.length === 0 ? <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center text-gray-600">No Orders Yet...</div> : (
                            <div className="space-y-4">
                                {liveOrders.slice().reverse().map((order) => (
                                   <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key={order.id} className={`p-6 rounded-[2rem] border relative overflow-hidden ${order.status === 'Ready' ? 'bg-green-900/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                                       <div className="flex justify-between items-start mb-4 relative z-10">
                                           <div>
                                               <h3 className="font-bold text-lg text-white">{order.user.name}</h3>
                                               <a href={`tel:${order.user.phone}`} className="text-sm text-orange-400 hover:underline">📞 {order.user.phone}</a>
                                               <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{order.id} • {order.time}</p>
                                           </div>
                                           <div className="text-right">
                                               <p className="text-2xl font-black text-white">₹{order.total}</p>
                                               <span className="text-[9px] uppercase font-bold bg-white/10 px-2 py-1 rounded text-gray-300">{order.method}</span>
                                           </div>
                                       </div>
                                       <div className="bg-black/40 p-4 rounded-xl mb-4 text-sm space-y-1 border border-white/5 relative z-10">
                                           {order.items.map((item, idx) => (
                                               <div key={idx} className="flex justify-between text-gray-300"><span>• {item.name.en}</span><span>₹{item.price}</span></div>
                                           ))}
                                       </div>
                                       <div className="grid grid-cols-4 gap-2 relative z-10">
                                           {['Pending', 'Accepted', 'Cooking', 'Ready'].map((status) => (
                                               <button key={status} onClick={() => updateStatus(order.id, status)} className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all border ${order.status === status ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_10px_orange]' : 'bg-transparent border-white/10 text-gray-600 hover:bg-white/5'}`}>{status}</button>
                                           ))}
                                       </div>
                                   </motion.div> 
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: STOCK MANAGER */}
                    <div className="bg-zinc-900/30 p-6 rounded-[2.5rem] border border-white/5 h-fit">
                        <h3 className="text-xl font-bold mb-6">📦 Stock Control</h3>
                        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                            {menu.map(m => (
                                <button key={m.id} onClick={() => toggleStock(m.id)} className={`p-4 rounded-2xl border text-xs font-black uppercase text-left transition-all ${m.inStock ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500 grayscale'}`}>
                                    {m.name.en}
                                    <span className="block text-[9px] mt-1 opacity-60">{m.inStock ? 'IN STOCK' : 'SOLD OUT'}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            /* --- USER INTERFACE (SEXY UI) --- */
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-10 items-start">
                
                {/* 1. SIDEBAR CATEGORIES (Laptop) */}
                <aside className="hidden lg:block sticky top-28 space-y-3">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4 pl-2">Menu</p>
                    {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left px-6 py-4 rounded-2xl font-black uppercase text-xs transition-all border ${activeCategory === cat ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}>
                            {cat}
                        </button>
                    ))}
                </aside>

                {/* 2. MAIN MENU FEED */}
                <main className="w-full">
                    {/* Search Bar */}
                    <div className="relative mb-10 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                        <input type="text" placeholder="Search for crave..." onChange={e=>setSearchQuery(e.target.value)} className="relative w-full bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl outline-none focus:border-orange-500/50 transition-all font-bold text-white placeholder:text-gray-700" />
                    </div>

                    {/* Mobile Tabs */}
                    <div className="flex lg:hidden gap-3 overflow-x-auto pb-6 no-scrollbar mb-4">
                        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase whitespace-nowrap border transition-all ${activeCategory===cat ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>{cat}</button>
                        ))}
                    </div>

                    {!isKitchenOpen && <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-2xl mb-8 text-center text-red-500 font-black uppercase text-xs tracking-widest animate-pulse">🔴 Kitchen is currently closed</div>}

                    {/* 3D Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredItems.filter(i => i.category === activeCategory).map(p => (
                            <motion.div whileHover={{y:-8}} whileTap={{scale:0.98}} key={p.id} className={`group bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden relative transition-all duration-500 ${!p.inStock ? 'grayscale opacity-50' : 'hover:border-orange-500/30'}`}>
                                <div className="h-44 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 opacity-90"></div>
                                    <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <span className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">₹{p.price}</span>
                                </div>
                                <div className="p-5 relative z-20 -mt-12">
                                    <h3 className="text-xl font-black italic uppercase mb-1 leading-none text-white">{p.name[lang]}</h3>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex gap-1 text-orange-600 text-[10px]">{'★'.repeat(Math.floor(p.rating))}</div>
                                        {p.inStock ? (
                                            <button onClick={() => setCart([...cart, p])} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-black text-xl hover:bg-orange-500 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]">+</button>
                                        ) : (
                                            <span className="text-[9px] font-bold text-red-500 border border-red-500 px-2 py-1 rounded">SOLD OUT</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>

                {/* 3. STICKY CART (Laptop) */}
                <aside className="hidden lg:block sticky top-28 h-fit bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
                    <h3 className="text-lg font-black italic text-white mb-6 pb-4 border-b border-white/10 flex justify-between">YOUR TRAY <span className="text-orange-500">{cart.length}</span></h3>
                    {cart.length === 0 ? <p className="text-gray-700 text-xs text-center py-10 italic">Hungry? Add items...</p> : (
                        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((c, i) => (
                                <div key={i} className="flex justify-between items-center text-xs border-b border-white/5 pb-2 group">
                                    <span className="font-bold text-gray-400 group-hover:text-white transition-colors">{c.name.en}</span>
                                    <span className="text-orange-500 font-bold">₹{c.price}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {cart.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-xl font-black mb-6"><span>TOTAL</span><span className="text-orange-500">₹{cart.reduce((a,b)=>a+b.price, 0)}</span></div>
                            <button onClick={() => setShowCheckout(true)} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all text-xs tracking-widest hover:bg-orange-500 hover:text-white">Checkout</button>
                        </div>
                    )}
                </aside>
            </div>
        )}

        {/* --- MOBILE FLOATING CART --- */}
        <AnimatePresence>
            {cart.length > 0 && !isAdmin && (
                <motion.div initial={{y:100}} animate={{y:0}} className="lg:hidden fixed bottom-6 left-6 right-6 z-40">
                    <button onClick={() => setShowCheckout(true)} className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-600 h-10 w-10 rounded-full flex items-center justify-center font-black text-sm">{cart.length}</div>
                            <span className="font-black text-lg italic">₹{cart.reduce((a,b)=>a+b.price, 0)}</span>
                        </div>
                        <span className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase">Checkout</span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- LIVE STATUS WIDGET (HUD) --- */}
        <AnimatePresence>
            {myOrder && !isAdmin && (
                <motion.div drag dragConstraints={{top:0, bottom:0, left:0, right:0}} className="fixed top-24 right-4 z-[90] lg:right-10 cursor-grab active:cursor-grabbing">
                    <div className="bg-black/80 backdrop-blur-xl border border-orange-500/30 p-5 rounded-[2rem] shadow-[0_0_40px_rgba(234,88,12,0.3)] w-56 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600"></div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest animate-pulse">● LIVE UPDATE</span>
                            <button onClick={()=>setMyOrder(null)} className="text-xs text-gray-600 hover:text-white">✕</button>
                        </div>
                        <h3 className="text-2xl font-black italic text-white mb-1 leading-none">{myOrder.status === 'Pending' ? 'WAIT...' : myOrder.status === 'Accepted' ? 'ACCEPTED' : myOrder.status === 'Cooking' ? 'COOKING 🔥' : 'READY ✅'}</h3>
                        <p className="text-[10px] text-gray-500 uppercase mb-3">Order ID: {myOrder.id}</p>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <motion.div animate={{width: myOrder.status==='Pending'?'25%': myOrder.status==='Accepted'?'50%': myOrder.status==='Cooking'?'75%':'100%'}} className="h-full bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_15px_orange]"></motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- CHECKOUT DRAWER --- */}
        <AnimatePresence>
            {showCheckout && (
                <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 z-[200] bg-[#050505] p-6 pt-12 overflow-y-auto lg:p-0 lg:flex lg:items-center lg:justify-center lg:bg-black/90 lg:backdrop-blur-md">
                    <div className="lg:w-[450px] lg:bg-[#0a0a0a] lg:p-8 lg:rounded-[3rem] lg:border lg:border-white/10 lg:relative lg:shadow-[0_0_60px_rgba(0,0,0,0.8)]">
                        <button onClick={() => setShowCheckout(false)} className="mb-8 text-gray-500 font-bold lg:absolute lg:top-8 lg:right-8">✕ CANCEL</button>
                        <h2 className="text-4xl font-black italic text-white mb-8">CONFIRM <span className="text-orange-500">DETAILS</span></h2>
                        
                        <div className="space-y-5 mb-8">
                            <div className="group">
                                <label className="text-[9px] font-bold text-gray-500 uppercase ml-2 mb-1 block group-focus-within:text-orange-500">Your Name</label>
                                <input type="text" value={userDetails.name} onChange={e=>setUserDetails({...userDetails, name:e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none font-bold text-white focus:border-orange-500 transition-all placeholder:text-gray-800" placeholder="e.g. Aashray" />
                            </div>
                            <div className="group">
                                <label className="text-[9px] font-bold text-gray-500 uppercase ml-2 mb-1 block group-focus-within:text-orange-500">Phone Number</label>
                                <input type="number" value={userDetails.phone} onChange={e=>setUserDetails({...userDetails, phone:e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none font-bold text-white focus:border-orange-500 transition-all placeholder:text-gray-800" placeholder="e.g. 987..." />
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-3xl mb-8 border border-white/5 space-y-2">
                            {cart.map((c, i) => (<div key={i} className="flex justify-between text-xs text-gray-400"><span>{c.name.en}</span><span>₹{c.price}</span></div>))}
                            <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-black text-white mt-2"><span>TOTAL</span><span>₹{cart.reduce((a,b)=>a+b.price, 0)}</span></div>
                        </div>

                        <button onClick={() => placeOrder('COD')} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase mb-3 hover:bg-gray-200 transition-all text-xs tracking-widest">Pay Cash on Delivery</button>
                        <button onClick={() => placeOrder('UPI')} className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase shadow-lg hover:scale-105 transition-all text-xs tracking-widest">Confirm & WhatsApp</button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>

      {/* FOOTER */}
      <footer className="mt-20 px-10 py-10 border-t border-white/5 text-center text-[10px] text-gray-600 uppercase tracking-[0.2em]">
        <p>ENGINEERED BY <span className="text-orange-600 font-bold">AASHRAY NARANG</span> • MALOUT</p>
      </footer>
    </div>
  );
}