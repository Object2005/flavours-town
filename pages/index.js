import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG ---
const GEMINI_API_KEY = "AIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKw"; 

// --- ULTIMATE 19 ITEMS DATA (FULL RESTORED) ---
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
  
  // --- ADMIN STATE ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  
  // --- USER STATE ---
  const [myOrder, setMyOrder] = useState(null);
  const [sessionOrderId, setSessionOrderId] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', phone: '' });
  
  // --- UI STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  // --- INIT & SYNC ENGINE ---
  useEffect(() => {
    // Initialize ID & Menu
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_v7_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));

    // Request Notification Permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // REAL-TIME SYNC LOOP (Every 1s)
    const interval = setInterval(() => {
        const storedOrders = JSON.parse(localStorage.getItem('ft_v7_orders') || '[]');
        
        // ADMIN: Check for NEW orders
        setLiveOrders(prev => {
            if (storedOrders.length > prev.length && isAdmin) {
               playNotificationSound();
               showSystemNotification(storedOrders[storedOrders.length - 1]);
            }
            return storedOrders;
        });

        // USER: Track My Order
        const myActive = storedOrders.find(o => o.id === sessionOrderId);
        if (myActive) setMyOrder(myActive);

    }, 1000);

    return () => clearInterval(interval);
  }, [isAdmin, sessionOrderId]);

  // --- NOTIFICATION HANDLERS ---
  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    } catch(e) { console.log("Audio play failed"); }
  };

  const showSystemNotification = (order) => {
    if (Notification.permission === "granted") {
      new Notification(`New Order: ${order.id}`, {
        body: `${order.user.name} ordered ₹${order.total}`,
      });
    }
  };

  // --- ACTIONS ---
  const placeOrder = (method) => {
    if (!userDetails.name || !userDetails.phone) {
        alert("Please enter Name & Phone Number!");
        return;
    }

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
    localStorage.setItem('ft_v7_orders', JSON.stringify(updatedOrders));
    
    setMyOrder(newOrder);
    setCart([]);
    setShowCheckout(false);
  };

  const updateStatus = (id, status) => {
      const updated = liveOrders.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem('ft_v7_orders', JSON.stringify(updated));
      setLiveOrders(updated);
  };

  const filteredItems = menu.filter(i => i.name.en.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      <Head><title>Flavour's Town | Live System</title></Head>

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-[100] px-4 py-4 backdrop-blur-xl bg-black/50 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center font-black shadow-lg">FT</div>
          <div><h1 className="text-xs font-black uppercase">Flavour's Town</h1><p className="text-[9px] text-gray-400 animate-pulse">98774-74778</p></div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(lang==='pu'?'en':'pu')} className="px-3 py-1 bg-zinc-800 rounded-lg text-[10px] font-black">{lang==='pu'?'EN':'ਪੰ'}</button>
            <button onClick={() => { const p=prompt("Admin Pass:"); if(p==="aashray778") setIsAdmin(true); }} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs">⚙️</button>
        </div>
      </header>

      <div className="pt-24 px-4 pb-32 max-w-5xl mx-auto">
        
        {/* --- ADMIN DASHBOARD --- */}
        {isAdmin ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-3xl font-black italic text-orange-500">ADMIN PANEL</h2>
                    <button onClick={() => setIsAdmin(false)} className="bg-white/10 px-4 py-2 rounded-lg text-xs font-bold">EXIT</button>
                </div>
                
                {liveOrders.length === 0 ? <p className="text-center opacity-30 py-20">Waiting for orders...</p> : (
                    <div className="space-y-4">
                        {liveOrders.slice().reverse().map((order) => (
                           <div key={order.id} className={`p-6 rounded-3xl border ${order.status === 'Ready' ? 'border-green-500/30 bg-green-900/10' : 'border-white/10 bg-zinc-900'}`}>
                               <div className="flex justify-between items-start mb-4">
                                   <div>
                                       <h3 className="font-bold text-lg text-orange-500">{order.user.name}</h3>
                                       <a href={`tel:${order.user.phone}`} className="text-sm underline opacity-70">📞 {order.user.phone}</a>
                                       <p className="text-xs text-gray-500 mt-1">ID: {order.id} • {order.time}</p>
                                   </div>
                                   <div className="text-right">
                                       <p className="text-2xl font-black">₹{order.total}</p>
                                       <span className="text-[10px] uppercase font-bold bg-white/10 px-2 py-1 rounded">{order.method}</span>
                                   </div>
                               </div>
                               
                               <div className="bg-black/30 p-3 rounded-xl mb-4 text-sm space-y-1">
                                   {order.items.map((item, idx) => (
                                       <div key={idx} className="flex justify-between text-gray-300">
                                           <span>• {item.name[lang]}</span>
                                           <span>₹{item.price}</span>
                                       </div>
                                   ))}
                               </div>

                               <div className="grid grid-cols-4 gap-2">
                                   {['Pending', 'Accepted', 'Cooking', 'Ready'].map((status) => (
                                       <button 
                                        key={status}
                                        onClick={() => updateStatus(order.id, status)}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${order.status === status ? 'bg-orange-600 text-white scale-105 shadow-lg' : 'bg-white/5 text-gray-500'}`}
                                       >
                                           {status}
                                       </button>
                                   ))}
                               </div>
                           </div> 
                        ))}
                    </div>
                )}
            </div>
        ) : (
            /* --- USER MENU --- */
            <div>
                {/* SEARCH */}
                <div className="relative mb-8">
                    <input type="text" placeholder="Search craving..." onChange={e=>setSearchQuery(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold placeholder:text-gray-600" />
                </div>

                {/* ITEMS GRID (FULL 19) */}
                <div className="space-y-10">
                {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => {
                    const items = filteredItems.filter(i => i.category === cat);
                    if (items.length === 0) return null;
                    return (
                        <div key={cat}>
                            <h2 className="text-2xl font-black italic text-orange-600 mb-4 ml-2 uppercase">{cat}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {items.map(p => (
                                    <motion.div whileTap={{scale:0.98}} key={p.id} className="bg-zinc-900 border border-white/5 p-3 rounded-3xl relative overflow-hidden">
                                        <div className="h-32 bg-zinc-800 rounded-2xl overflow-hidden mb-3"><img src={p.img} className="w-full h-full object-cover opacity-80" /></div>
                                        <h3 className="text-xs font-black uppercase mb-1 h-8 flex items-center">{p.name[lang]}</h3>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-orange-500 font-bold">₹{p.price}</span>
                                            <button onClick={() => setCart([...cart, p])} className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg shadow-orange-600/20">+</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        )}

        {/* --- USER: FLOATING CART BUTTON --- */}
        <AnimatePresence>
            {cart.length > 0 && !isAdmin && (
                <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-6 left-6 right-6 z-40">
                    <button onClick={() => setShowCheckout(true)} className="w-full bg-orange-600 text-white p-5 rounded-3xl shadow-2xl flex justify-between items-center">
                        <span className="font-bold text-xs uppercase bg-black/20 px-3 py-1 rounded-lg">{cart.length} Items</span>
                        <span className="font-black text-xl">CHECKOUT ₹{cart.reduce((a,b)=>a+b.price, 0)}</span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- USER: MINI LIVE STATUS HUD (Widget) --- */}
        <AnimatePresence>
            {myOrder && !isAdmin && (
                <motion.div initial={{x:100}} animate={{x:0}} className="fixed top-24 right-4 z-30">
                    <div className="bg-black/90 backdrop-blur-md border border-orange-500/30 p-4 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.2)] w-40">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-orange-500 uppercase animate-pulse">● LIVE STATUS</span>
                            <button onClick={()=>setMyOrder(null)} className="text-xs opacity-50">✕</button>
                        </div>
                        <h3 className="text-lg font-black italic mb-1">
                            {myOrder.status === 'Pending' ? 'Wait...' : myOrder.status === 'Accepted' ? 'Accepted' : myOrder.status === 'Cooking' ? 'Cooking 🔥' : 'READY ✅'}
                        </h3>
                        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                            <motion.div 
                                animate={{width: myOrder.status==='Pending'?'25%': myOrder.status==='Accepted'?'50%': myOrder.status==='Cooking'?'75%':'100%'}} 
                                className="h-full bg-orange-500"
                            ></motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- CHECKOUT DRAWER --- */}
        <AnimatePresence>
            {showCheckout && (
                <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 z-50 bg-zinc-950 p-6 pt-12 overflow-y-auto">
                    <button onClick={() => setShowCheckout(false)} className="mb-8 text-gray-500 font-bold">✕ CANCEL</button>
                    <h2 className="text-4xl font-black italic text-orange-500 mb-8">FINALIZE</h2>
                    
                    {/* CUSTOMER DETAILS INPUT */}
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-2">Your Name</label>
                            <input type="text" value={userDetails.name} onChange={e=>setUserDetails({...userDetails, name:e.target.value})} className="w-full bg-zinc-900 p-5 rounded-2xl outline-none font-bold text-white border border-white/5 focus:border-orange-500 transition-all" placeholder="e.g. Aashray" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-2">Phone Number</label>
                            <input type="number" value={userDetails.phone} onChange={e=>setUserDetails({...userDetails, phone:e.target.value})} className="w-full bg-zinc-900 p-5 rounded-2xl outline-none font-bold text-white border border-white/5 focus:border-orange-500 transition-all" placeholder="e.g. 9877474778" />
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-3xl mb-8 space-y-3">
                        {cart.map((c, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span>{c.name[lang]}</span>
                                <span className="font-bold">₹{c.price}</span>
                            </div>
                        ))}
                        <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-black text-orange-500">
                            <span>TOTAL</span>
                            <span>₹{cart.reduce((a,b)=>a+b.price, 0)}</span>
                        </div>
                    </div>

                    <button onClick={() => placeOrder('COD')} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase mb-4">Pay Cash on Delivery</button>
                    <button onClick={() => placeOrder('UPI')} className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase">Confirm & WhatsApp</button>
                </motion.div>
            )}
        </AnimatePresence>

      </div>

      {/* FOOTER */}
      <footer className="mt-20 px-10 py-20 bg-black border-t border-white/10 text-center">
        <h2 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">developed by <span className="text-orange-600">aashray narang</span></h2>
        <a href="mailto:narangaashray34@gmail.com" className="opacity-30 text-xs">narangaashray34@gmail.com</a>
      </footer>
    </div>
  );
}