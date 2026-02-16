import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG ---
const ADMIN_PASS = "aashray778";
const UPI_ID = "9877474778@paytm"; // Tera UPI ID (Direct Payment Layi)

// --- MENU DATA (LOCAL IMAGES) ---
const initialMenuData = [
  { id: 1, category: "Chaap", isBest: true, name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 120, rating: 4.8, img: "/img/malai-chaap.jpg" },
  { id: 2, category: "Chaap", isBest: false, name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 110, rating: 4.7, img: "/img/masala-chaap.jpg" },
  { id: 3, category: "Chaap", isBest: true, name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 130, rating: 4.9, img: "/img/afghani-chaap.jpg" },
  { id: 4, category: "Chaap", isBest: false, name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 110, rating: 4.6, img: "/img/achari-chaap.jpg" },
  { id: 5, category: "Tikka", isBest: true, name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 160, rating: 4.9, img: "/img/paneer-tikka.jpg" },
  { id: 6, category: "Tikka", isBest: false, name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 150, rating: 4.5, img: "/img/mushroom-tikka.jpg" },
  { id: 7, category: "Rolls", isBest: false, name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 60, rating: 4.4, img: "/img/frankie.jpg" },
  { id: 8, category: "Rolls", isBest: true, name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 100, rating: 4.7, img: "/img/paneer-roll.jpg" },
  { id: 9, category: "Rolls", isBest: false, name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 90, rating: 4.6, img: "/img/chaap-roll.jpg" },
  { id: 10, category: "Rolls", isBest: false, name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, img: "/img/mushroom-roll.jpg" },
  { id: 11, category: "Snacks", isBest: true, name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 80, rating: 4.8, img: "/img/pav-bhaji.jpg" },
  { id: 12, category: "Rolls", isBest: false, name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 80, rating: 4.3, img: "/img/twister.jpg" },
  { id: 13, category: "Snacks", isBest: false, name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 140, rating: 4.7, img: "/img/kulcha.jpg" },
  { id: 14, category: "Snacks", isBest: true, name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 220, rating: 4.9, img: "/img/cheese-chilli.jpg" },
  { id: 15, category: "Snacks", isBest: false, name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 100, rating: 4.2, img: "/img/kacha-paneer.jpg" },
  { id: 16, category: "Snacks", isBest: false, name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 180, rating: 4.7, img: "/img/paneer-fry.jpg" },
  { id: 17, category: "Sweets", isBest: true, name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 40, rating: 4.9, img: "/img/gulab-jamun.jpg" },
  { id: 18, category: "Sweets", isBest: true, name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 60, rating: 5.0, img: "/img/rabri-jamun.jpg" },
  { id: 19, category: "Sweets", isBest: false, name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 60, rating: 4.9, img: "/img/gajrela.jpg" }
];

// --- ADDONS DATA ---
const addonsData = [
  { id: 'r1', name: "Rumali Roti", price: 10 },
  { id: 'r2', name: "Butter Naan", price: 40 },
  { id: 'p1', name: "Salad & Sauce", price: 0 },
  { id: 'p2', name: "Packing Charge", price: 10 }
];

// --- COUNTDOWN TIMER ---
const CountdownTimer = ({ targetDate }) => {
  const [display, setDisplay] = useState("Wait...");
  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) { setDisplay("READY! ✅"); clearInterval(interval); } 
      else {
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        setDisplay(`${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return <span className="font-mono text-orange-500 font-bold tracking-widest">{display}</span>;
};

export default function Home() {
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [myOrder, setMyOrder] = useState(null);
  const [sessionOrderId, setSessionOrderId] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', phone: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [prepTime, setPrepTime] = useState(20);
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [menu, setMenu] = useState(initialMenuData.map(i => ({...i, inStock: true})));

  // --- INIT ---
  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    if ("Notification" in window) Notification.requestPermission();
    
    // Load Local Data
    const savedMenu = localStorage.getItem('ft_v18_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));

    // SYNC LOOP
    const interval = setInterval(() => {
        const storedOrders = JSON.parse(localStorage.getItem('ft_v18_orders') || '[]');
        setLiveOrders(storedOrders);
        const myActive = storedOrders.find(o => o.id === sessionOrderId);
        if (myActive) setMyOrder(myActive);
        
        // Admin Sound
        if (isAdmin && storedOrders.length > liveOrders.length) {
             try { new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play(); } catch(e){}
        }
    }, 1000);
    return () => clearInterval(interval);
  }, [isAdmin, sessionOrderId, liveOrders.length]);

  // --- LOGIC ---
  const subtotal = cart.reduce((acc, i) => acc + i.price, 0) + 
                   addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  // --- DIRECT PAYMENT HANDLERS ---
  const handleDirectPayment = () => {
      if (!userDetails.name || !userDetails.phone) return alert("Please enter Name & Phone first!");
      
      // Construct UPI Deep Link
      const upiUrl = `upi://pay?pa=${UPI_ID}&pn=FlavoursTown&am=${subtotal}&cu=INR`;
      
      // Open App
      window.location.href = upiUrl;
      
      // Also place order as Pending
      placeOrder('UPI_DIRECT');
  };

  const placeOrder = (method) => {
    if (!userDetails.name || !userDetails.phone) return alert("Please enter Name & Phone!");
    if (!isKitchenOpen) return alert("Shop is Closed!");
    
    const addonsStr = addonsData.filter(a => addons[a.id]).map(a => `${a.name} x${addons[a.id]}`).join(', ');
    
    if (method === 'WA') {
        const text = `*Order: ${sessionOrderId}*\nName: ${userDetails.name}\nTotal: ₹${subtotal}\nItems: ${cart.map(i=>i.name.en).join(', ')}\n${addonsStr ? 'Addons: ' + addonsStr : ''}`;
        window.location.href = `https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(text)}`;
        return;
    }

    const newOrder = {
        id: sessionOrderId,
        user: userDetails,
        items: cart,
        addons: addons,
        total: subtotal,
        status: 'Pending',
        targetTime: new Date().getTime() + (prepTime * 60 * 1000),
        method: method,
        timestamp: new Date().toISOString()
    };

    const currentOrders = JSON.parse(localStorage.getItem('ft_v18_orders') || '[]');
    localStorage.setItem('ft_v18_orders', JSON.stringify([...currentOrders, newOrder]));
    setMyOrder(newOrder); setCart([]); setAddons({}); setShowCheckout(false);
  };

  const updateStatus = (id, status) => {
      const allOrders = JSON.parse(localStorage.getItem('ft_v18_orders') || '[]');
      const updated = allOrders.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem('ft_v18_orders', JSON.stringify(updated));
      setLiveOrders(updated);
  };

  const toggleStock = (id) => {
      const updatedMenu = menu.map(i => i.id === id ? { ...i, inStock: !i.inStock } : i);
      setMenu(updatedMenu);
      localStorage.setItem('ft_v18_menu', JSON.stringify(updatedMenu));
  };

  const filteredItems = menu.filter(i => {
      const searchMatch = i.name.en.toLowerCase().includes(searchQuery.toLowerCase());
      const catMatch = activeCategory === "All" || i.category === activeCategory;
      return searchMatch && catMatch;
  });

  return (
    <div className={`min-h-screen font-sans selection:bg-orange-500/30 overflow-x-hidden transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fcfbf7] text-black'}`}>
      <Head><title>Flavour's Town V18</title></Head>

      {/* --- HEADER --- */}
      <header className={`fixed top-0 w-full z-[100] px-4 py-3 backdrop-blur-xl border-b flex justify-between items-center transition-all ${isDark ? 'bg-black/60 border-white/5' : 'bg-white/80 border-black/5'}`}>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-orange-600 to-red-600 h-9 w-9 rounded-lg flex items-center justify-center font-black shadow-lg text-white">FT</div>
          <div><h1 className="text-xs font-black uppercase tracking-tight">Flavour's Town</h1><p className={`text-[9px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>MALOUT</p></div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setIsDark(!isDark)} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}>{isDark ? '☀️' : '🌙'}</button>
            {!isAdmin && <button onClick={() => setLang(lang==='pu'?'en':'pu')} className={`px-3 py-1 border rounded-lg text-[9px] font-black ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>{lang==='pu'?'EN':'ਪੰ'}</button>}
            <button onClick={() => { const p=prompt("Pass:"); if(p===ADMIN_PASS) setIsAdmin(!isAdmin); }} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs hover:bg-orange-600 transition-all ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>⚙️</button>
        </div>
      </header>

      <div className="pt-20 px-3 md:px-8 max-w-[1400px] mx-auto pb-32">
        
        {isAdmin ? (
            // ================= ADMIN DASHBOARD =================
            <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black italic text-orange-500">LIVE ORDERS</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setIsKitchenOpen(!isKitchenOpen)} className={`px-4 py-2 rounded-full text-[10px] font-bold ${isKitchenOpen ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{isKitchenOpen ? 'OPEN' : 'CLOSED'}</button>
                        <button onClick={() => { if(confirm("Reset?")) localStorage.removeItem('ft_v18_orders'); }} className="text-[10px] text-red-500 underline">RESET</button>
                    </div>
                </div>
                
                {/* PREP TIME */}
                <div className={`p-4 rounded-2xl border mb-6 flex justify-between items-center ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/10 shadow-sm'}`}>
                    <span className="text-xs font-bold uppercase opacity-50">Set Prep Time</span>
                    <div className="flex gap-3 items-center">
                        <button onClick={()=>setPrepTime(p=>Math.max(5, p-5))} className="w-8 h-8 rounded-full bg-gray-500/10">-</button>
                        <span className="font-mono font-bold text-xl text-orange-500">{prepTime}m</span>
                        <button onClick={()=>setPrepTime(p=>p+5)} className="w-8 h-8 rounded-full bg-gray-500/10">+</button>
                    </div>
                </div>

                <div className="space-y-3 mb-10">
                    {liveOrders.length === 0 && <p className="text-center opacity-50 py-10">No orders yet...</p>}
                    {liveOrders.slice().reverse().map((order) => (
                       <div key={order.id} className={`p-5 rounded-[1.5rem] border ${isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-black/10 shadow-md'} ${order.status === 'Ready' ? 'border-green-500/50' : ''}`}>
                           <div className="flex justify-between items-start mb-3">
                               <div>
                                   <h3 className="font-bold text-base">{order.user.name}</h3>
                                   <a href={`tel:${order.user.phone}`} className="text-[10px] text-orange-500 underline">{order.user.phone}</a>
                                   <div className="mt-2 bg-gray-500/10 px-3 py-1 rounded-lg inline-block">
                                      <CountdownTimer targetDate={order.targetTime} />
                                   </div>
                               </div>
                               <div className="text-right">
                                   <p className="text-xl font-black">₹{order.total}</p>
                                   <span className="text-[9px] uppercase font-bold bg-gray-500/10 px-2 py-1 rounded opacity-70 block mt-1">{order.method}</span>
                               </div>
                           </div>
                           <div className="text-xs opacity-60 border-t border-gray-500/20 pt-2 mt-2">
                               {order.items.map(i => i.name.en).join(', ')}
                               {Object.keys(order.addons || {}).map(key => {
                                   const ad = addonsData.find(a => a.id === key);
                                   return order.addons[key] > 0 ? <div key={key} className="text-orange-500">+ {ad.name} (x{order.addons[key]})</div> : null;
                               })}
                           </div>
                           <div className="grid grid-cols-4 gap-2 mt-4">
                               {['Pending', 'Accepted', 'Cooking', 'Ready'].map((status) => (
                                   <button key={status} onClick={() => updateStatus(order.id, status)} className={`py-2 rounded-lg text-[9px] font-black uppercase border ${order.status === status ? 'bg-orange-600 border-orange-500 text-white' : 'bg-transparent border-gray-500/20 opacity-50'}`}>{status}</button>
                               ))}
                           </div>
                       </div> 
                    ))}
                </div>

                {/* STOCK MANAGER */}
                <h3 className="text-xs font-black uppercase opacity-50 mb-4">STOCK CONTROL</h3>
                <div className="grid grid-cols-2 gap-3">
                    {menu.map(m => (
                        <button key={m.id} onClick={()=>toggleStock(m.id)} className={`p-3 rounded-xl border text-left text-[10px] font-bold uppercase ${m.inStock ? 'border-green-500/30 text-green-500' : 'border-red-500/30 text-red-500 grayscale'}`}>
                            {m.name.en} <br/> {m.inStock ? 'IN STOCK' : 'SOLD OUT'}
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            // ================= USER INTERFACE =================
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-8 items-start">
                
                {/* SIDEBAR */}
                <aside className="hidden lg:block sticky top-24 space-y-2">
                    <button onClick={() => setActiveCategory("All")} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-xs border transition-all ${activeCategory === "All" ? 'bg-orange-600 text-white border-orange-600' : 'border-transparent opacity-50 hover:opacity-100'}`}>ALL ITEMS</button>
                    {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-xs border transition-all ${activeCategory === cat ? 'bg-orange-600 text-white border-orange-600' : 'border-transparent opacity-50 hover:opacity-100'}`}>{cat}</button>
                    ))}
                </aside>

                {/* MAIN FEED */}
                <main className="w-full">
                    <div className="relative mb-6">
                        <input type="text" placeholder="Search menu..." onChange={e=>setSearchQuery(e.target.value)} className={`w-full border p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm font-bold ${isDark ? 'bg-[#0a0a0a] border-white/10 text-white' : 'bg-white border-black/10 text-black shadow-sm'}`} />
                    </div>

                    <div className="flex lg:hidden gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
                        <button onClick={() => setActiveCategory("All")} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border ${activeCategory==="All" ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-500/20 opacity-60'}`}>All</button>
                        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap border ${activeCategory===cat ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-500/20 opacity-60'}`}>{cat}</button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                        {filteredItems.map(p => (
                            <motion.div whileTap={{scale:0.97}} key={p.id} className={`border rounded-[1.5rem] overflow-hidden relative group ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/5 shadow-md'} ${!p.inStock ? 'grayscale opacity-60' : ''}`}>
                                <div className="h-32 md:h-48 overflow-hidden relative bg-gray-800">
                                    <img src={p.img} className="w-full h-full object-cover" />
                                    <span className="absolute bottom-2 left-3 z-20 text-white font-black text-xs md:text-sm drop-shadow-md">₹{p.price}</span>
                                    <span className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] text-white">★ {p.rating}</span>
                                </div>
                                <div className="p-3">
                                    <h3 className={`text-[11px] md:text-sm font-bold uppercase mb-2 leading-tight line-clamp-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{p.name[lang]}</h3>
                                    {p.inStock ? (
                                        <button onClick={() => setCart([...cart, p])} disabled={!isKitchenOpen} className={`w-full py-2 rounded-lg border text-[10px] font-black transition-all ${isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-orange-600 hover:text-white' : 'bg-black/5 border-black/5 text-gray-600 hover:bg-black hover:text-white'}`}>ADD +</button>
                                    ) : (
                                        <div className="text-[10px] text-red-500 font-bold text-center py-2 border border-red-500/20 rounded-lg bg-red-500/5">SOLD OUT</div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>

                {/* DESKTOP CART */}
                <aside className={`hidden lg:block sticky top-24 border rounded-[2rem] p-5 h-fit ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/10 shadow-lg'}`}>
                    <h3 className="font-black italic mb-4">YOUR TRAY <span className="text-orange-500">({cart.length})</span></h3>
                    {cart.length > 0 && (
                        <div>
                            <div className="space-y-2 mb-4 max-h-[30vh] overflow-auto custom-scrollbar">
                                {cart.map((c, i) => <div key={i} className="flex justify-between text-xs border-b border-gray-500/10 pb-1"><span className="opacity-70">{c.name.en}</span><span>₹{c.price}</span></div>)}
                            </div>
                            <button onClick={() => setShowCheckout(true)} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-xs hover:scale-105 transition-all">CHECKOUT ₹{subtotal}</button>
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
                        <span className="font-black text-lg italic">₹{subtotal} <span className="text-xs font-normal opacity-70 ml-1">Place Order ></span></span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- LIVE STATUS HUD --- */}
        <AnimatePresence>
            {myOrder && !isAdmin && (
                <motion.div drag dragConstraints={{top:0, bottom:0, left:0, right:0}} className="fixed top-20 right-4 z-[90] lg:right-10 cursor-grab active:cursor-grabbing">
                    <div className="bg-black/90 backdrop-blur-xl border border-orange-500/40 p-4 rounded-2xl shadow-[0_0_40px_rgba(234,88,12,0.2)] w-48">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-black text-orange-500 uppercase animate-pulse">● LIVE</span>
                            <button onClick={()=>setMyOrder(null)} className="text-xs text-gray-400">✕</button>
                        </div>
                        <h3 className="text-2xl font-black text-white leading-none mb-1"><CountdownTimer targetDate={myOrder.targetTime} /></h3>
                        <div className="mt-2 text-[10px] uppercase font-bold text-gray-300 bg-white/5 px-2 py-1 rounded text-center">Status: {myOrder.status}</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- CHECKOUT DRAWER (UPDATED FOR DIRECT UPI) --- */}
        <AnimatePresence>
            {showCheckout && (
                <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 z-[200] p-6 pt-12 overflow-y-auto lg:flex lg:items-center lg:justify-center bg-black/80 backdrop-blur-sm">
                    <div className={`lg:w-[450px] p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/10'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-3xl font-black italic ${isDark ? 'text-white' : 'text-black'}`}>CONFIRM <span className="text-orange-500">ORDER</span></h2>
                            <button onClick={() => setShowCheckout(false)} className="text-xs font-bold text-gray-500">CANCEL</button>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                            <input type="text" value={userDetails.name} onChange={e=>setUserDetails({...userDetails, name:e.target.value})} className={`w-full border p-4 rounded-xl outline-none font-bold text-sm ${isDark ? 'bg-[#111] border-white/10 text-white' : 'bg-gray-50 border-black/10 text-black'}`} placeholder="Your Name" />
                            <input type="number" value={userDetails.phone} onChange={e=>setUserDetails({...userDetails, phone:e.target.value})} className={`w-full border p-4 rounded-xl outline-none font-bold text-sm ${isDark ? 'bg-[#111] border-white/10 text-white' : 'bg-gray-50 border-black/10 text-black'}`} placeholder="Phone Number" />
                        </div>

                        {/* ADD-ONS SECTION */}
                        <div className="mb-6">
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">ADD EXTRAS</p>
                            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                {addonsData.map(ad => (
                                    <div key={ad.id} className={`flex-shrink-0 p-4 rounded-2xl border text-center min-w-[120px] ${addons[ad.id] > 0 ? 'border-orange-500 bg-orange-500/10' : 'border-gray-500/20'}`}>
                                        <p className="text-[10px] font-bold mb-1 opacity-70">{ad.name}</p>
                                        <p className="text-sm font-black mb-2">₹{ad.price}</p>
                                        <div className="flex justify-center gap-3 items-center">
                                            <button onClick={() => setAddons({...addons, [ad.id]: Math.max(0, (addons[ad.id]||0)-1)})} className="text-xl font-bold opacity-50">-</button>
                                            <span className="font-bold">{addons[ad.id]||0}</span>
                                            <button onClick={() => setAddons({...addons, [ad.id]: (addons[ad.id]||0)+1})} className="text-xl font-bold text-orange-500">+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`p-5 rounded-2xl mb-6 border space-y-2 ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'}`}>
                            {cart.map((c, i) => (<div key={i} className="flex justify-between text-xs opacity-70"><span>{c.name.en}</span><span>₹{c.price}</span></div>))}
                            {Object.keys(addons).map(k => addons[k]>0 && <div key={k} className="flex justify-between text-xs text-orange-500"><span>{addonsData.find(a=>a.id===k).name} (x{addons[k]})</span><span>₹{addonsData.find(a=>a.id===k).price * addons[k]}</span></div>)}
                            <div className="border-t border-gray-500/20 pt-3 flex justify-between text-lg font-black mt-1"><span>TOTAL</span><span>₹{subtotal}</span></div>
                        </div>
                        
                        <div className="space-y-3">
                            {/* --- DIRECT PAYMENT BUTTON --- */}
                            <button onClick={handleDirectPayment} className="w-full bg-zinc-800 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest border border-white/10 flex items-center justify-center gap-2 hover:bg-zinc-700 animate-pulse">
                                ⚡ PAY VIA UPI (GPay / Paytm)
                            </button>
                            <button onClick={() => placeOrder('COD')} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 shadow-lg">PAY CASH ON DELIVERY</button>
                            <button onClick={() => placeOrder('WA')} className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:opacity-90">WHATSAPP ORDER</button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}