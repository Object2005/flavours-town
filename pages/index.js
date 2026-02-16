import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG ---
const GEMINI_API_KEY = "AIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKw"; 

// --- MENU DATA ---
const initialMenuData = [
  { id: 1, category: "Chaap", isBest: true, name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, img: "/img/malai-chaap.jpg" },
  { id: 2, category: "Chaap", isBest: false, name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, img: "/img/masala-chaap.jpg" },
  { id: 3, category: "Chaap", isBest: true, name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, img: "/img/afghani-chaap.jpg" },
  { id: 4, category: "Chaap", isBest: false, name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, img: "/img/achari-chaap.jpg" },
  { id: 5, category: "Tikka", isBest: true, name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, img: "/img/paneer-tikka.jpg" },
  { id: 6, category: "Tikka", isBest: false, name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, img: "/img/mushroom-tikka.jpg" },
  { id: 7, category: "Rolls", isBest: false, name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, img: "/img/frankie.jpg" },
  { id: 8, category: "Rolls", isBest: true, name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, img: "/img/paneer-roll.jpg" },
  { id: 11, category: "Snacks", isBest: true, name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, img: "/img/pav-bhaji.jpg" },
  { id: 13, category: "Snacks", isBest: false, name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, img: "/img/kulcha.jpg" },
  { id: 14, category: "Snacks", isBest: true, name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, img: "/img/cheese-chilli.jpg" },
  { id: 17, category: "Sweets", isBest: true, name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, img: "/img/gulab-jamun.jpg" },
  { id: 18, category: "Sweets", isBest: true, name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, img: "/img/rabri-jamun.jpg" },
  { id: 19, category: "Sweets", isBest: false, name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, img: "/img/gajrela.jpg" }
];

const addonsData = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 },
  { id: 'p1', name: { en: "Packing Charge", pu: "ਪੈਕਿੰਗ" }, price: 10 }
];

// --- DUMMY REVIEWS FOR ADMIN TO MANAGE ---
const initialReviews = [
  { id: 1, user: "Rohan", text: "Chaap was amazing!", rating: 5 },
  { id: 2, user: "Amit", text: "Thoda spicy si.", rating: 4 },
  { id: 3, user: "Sandeep", text: "Late delivery.", rating: 2 }
];

export default function Home() {
  const [view, setView] = useState('HOME');
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  
  // --- ADMIN CONTROLS ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [prepTime, setPrepTime] = useState(20);
  const [reviews, setReviews] = useState(initialReviews);
  
  // --- ORDER SYNC SYSTEM ---
  const [liveOrders, setLiveOrders] = useState([]); // Admin sees this
  const [myOrder, setMyOrder] = useState(null); // User sees this
  const [sessionOrderId, setSessionOrderId] = useState('');
  
  // --- UI STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customOptions, setCustomOptions] = useState({ spice: 'Medium' });
  
  // --- AI ---
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiChat, setAiChat] = useState([{ role: 'bot', text: 'Sat Sri Akal! Town-AI ready hai.' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const scrollRefs = useRef({});
  const chatEndRef = useRef(null);
  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  // --- INIT & SYNC ---
  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_v5_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));

    // Load Admin Settings
    const savedKitchen = localStorage.getItem('ft_v5_kitchen');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));
    
    // Load Orders from "Server" (LocalStorage)
    const savedOrders = localStorage.getItem('ft_v5_orders');
    if (savedOrders) setLiveOrders(JSON.parse(savedOrders));

    // SYNC INTERVAL (POLLING)
    const interval = setInterval(() => {
        const currentOrders = JSON.parse(localStorage.getItem('ft_v5_orders') || '[]');
        setLiveOrders(currentOrders);
        
        // Update User's Own Order Status
        const myActive = currentOrders.find(o => o.id === sessionOrderId);
        if (myActive) setMyOrder(myActive);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionOrderId]);

  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_v5_menu', JSON.stringify(menu));
    localStorage.setItem('ft_v5_kitchen', JSON.stringify(isKitchenOpen));
  }, [menu, isKitchenOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  const filteredItems = useMemo(() => menu.filter(i => 
    i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.pu.includes(searchQuery)
  ), [searchQuery, menu]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0) + 
                   addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  // --- USER PLACES ORDER ---
  const placeOrder = (method) => {
    if (!isKitchenOpen) return alert("Shop is Closed!");
    haptic();
    
    const newOrder = {
        id: sessionOrderId,
        items: cart,
        total: subtotal,
        status: 'Pending', // Pending -> Cooking -> Ready -> Delivered
        method: method,
        time: new Date().toLocaleTimeString()
    };

    const updatedOrders = [...liveOrders, newOrder];
    setLiveOrders(updatedOrders);
    localStorage.setItem('ft_v5_orders', JSON.stringify(updatedOrders));
    
    setMyOrder(newOrder); // Show Tracking Screen
    setCart([]); setAddons({}); setShowCheckout(false);
  };

  // --- ADMIN ACTIONS ---
  const updateOrderStatus = (id, status) => {
    const updated = liveOrders.map(o => o.id === id ? { ...o, status } : o);
    setLiveOrders(updated);
    localStorage.setItem('ft_v5_orders', JSON.stringify(updated));
  };

  const deleteReview = (id) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  // --- AI ---
  const askGemini = async () => {
    if (!aiInput.trim() || isAiLoading) return;
    const userMsg = aiInput;
    setAiChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    setIsAiLoading(true);
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Role: Waiter. Menu: ${initialMenuData.map(i=>i.name.en).join(',')}. User: ${userMsg}` }] }] })
        });
        const data = await response.json();
        setAiChat(prev => [...prev, { role: 'bot', text: data.candidates[0].content.parts[0].text }]);
    } catch { setAiChat(prev => [...prev, { role: 'bot', text: "Busy..." }]); } 
    finally { setIsAiLoading(false); }
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#fcfbf7] text-black'} min-h-screen pb-44 font-sans overflow-x-hidden transition-all duration-500`}>
      <Head><title>Flavour's Town Admin System</title></Head>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-[1000] px-4 py-4 backdrop-blur-3xl border-b ${isDark ? 'bg-black/90 border-white/10' : 'bg-white shadow-md'} flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">FT</div>
          <div><h1 className="text-xs font-black uppercase">The Flavour's Town</h1><p className="text-[9px] font-black text-orange-500 animate-pulse">98774-74778</p></div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setLang(lang==='pu'?'en':'pu')} className="px-3 py-1 bg-zinc-800 text-white rounded-lg text-[10px] font-black uppercase">{lang==='pu'?'EN':'ਪੰ'}</button>
           <button onClick={() => setIsDark(!isDark)} className="px-3 py-1 bg-zinc-800 text-white rounded-lg">{isDark ? '☀️' : '🌙'}</button>
           <button onClick={() => { const p=prompt("Admin:"); if(p==="aashray778") setView('ADMIN'); }} className="px-3 py-1 bg-orange-600 text-white rounded-lg font-black text-[10px]">⚙️ ADMIN</button>
        </div>
      </header>

      {/* --- ADMIN DASHBOARD (THE CONTROL CENTER) --- */}
      {view === 'ADMIN' ? (
        <div className="pt-24 px-6 min-h-screen">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase text-orange-600 italic">Command Center</h2>
              <button onClick={() => setView('HOME')} className="bg-zinc-800 text-white px-6 py-2 rounded-full font-black text-xs">EXIT</button>
           </div>

           {/* 1. SHOP CONTROLS */}
           <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-6 rounded-[2rem] border-2 text-center ${isKitchenOpen ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                 <p className="text-xs font-black uppercase opacity-50 mb-2">Shop Status</p>
                 <button onClick={() => setIsKitchenOpen(!isKitchenOpen)} className={`px-6 py-2 rounded-xl font-black uppercase text-xs ${isKitchenOpen ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{isKitchenOpen ? 'OPEN' : 'CLOSED'}</button>
              </div>
              <div className="p-6 rounded-[2rem] border-2 border-white/10 bg-zinc-900 text-center">
                 <p className="text-xs font-black uppercase opacity-50 mb-2">Prep Time</p>
                 <div className="flex justify-center items-center gap-3">
                    <button onClick={()=>setPrepTime(p=>p-5)} className="text-orange-600 text-xl font-black">-</button>
                    <span className="text-2xl font-black">{prepTime}m</span>
                    <button onClick={()=>setPrepTime(p=>p+5)} className="text-orange-600 text-xl font-black">+</button>
                 </div>
              </div>
           </div>

           {/* 2. REAL-TIME ORDERS MANAGEMENT */}
           <div className="mb-10">
              <h3 className="text-xl font-black uppercase italic mb-4 border-b border-white/10 pb-2">Live Orders ({liveOrders.filter(o=>o.status!=='Delivered').length})</h3>
              <div className="space-y-4">
                 {liveOrders.filter(o => o.status !== 'Delivered').length === 0 ? <p className="opacity-30 italic text-sm">No Active Orders...</p> : 
                  liveOrders.map(order => (
                    order.status !== 'Delivered' && (
                    <div key={order.id} className="bg-zinc-900 p-6 rounded-[2rem] border border-white/10">
                       <div className="flex justify-between mb-4">
                          <span className="font-black text-orange-600 text-lg">{order.id}</span>
                          <span className="text-xs opacity-50">{order.time}</span>
                       </div>
                       <div className="mb-4 text-sm opacity-80 border-l-2 border-white/20 pl-3">
                          {order.items.map(i => <div key={i.id}>{i.name.en}</div>)}
                       </div>
                       
                       {/* STATUS CONTROL BUTTONS */}
                       <div className="grid grid-cols-3 gap-2">
                          <button onClick={() => updateOrderStatus(order.id, 'Cooking')} className={`py-3 rounded-xl font-black text-[10px] uppercase ${order.status === 'Cooking' ? 'bg-yellow-600 text-white' : 'bg-zinc-800'}`}>Start Cook</button>
                          <button onClick={() => updateOrderStatus(order.id, 'Ready')} className={`py-3 rounded-xl font-black text-[10px] uppercase ${order.status === 'Ready' ? 'bg-green-600 text-white' : 'bg-zinc-800'}`}>Mark Ready</button>
                          <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="py-3 rounded-xl font-black text-[10px] uppercase bg-zinc-800 hover:bg-red-600">Clear</button>
                       </div>
                       <p className="text-center mt-3 text-[10px] font-bold text-orange-500 uppercase tracking-widest">Current: {order.status}</p>
                    </div>
                    )
                  ))
                 }
              </div>
           </div>

           {/* 3. STOCK MANAGEMENT */}
           <div className="mb-10">
              <h3 className="text-xl font-black uppercase italic mb-4 border-b border-white/10 pb-2">Menu Stock</h3>
              <div className="grid grid-cols-2 gap-3">
                 {menu.map(m => (
                    <button key={m.id} onClick={() => setMenu(prev => prev.map(i => i.id === m.id ? {...i, inStock: !i.inStock} : i))} className={`p-4 rounded-xl border text-xs font-black uppercase ${m.inStock ? 'border-green-500/20 text-green-500' : 'border-red-500/20 text-red-500 opacity-50'}`}>
                       {m.name.en}
                    </button>
                 ))}
              </div>
           </div>

           {/* 4. REVIEW MANAGEMENT */}
           <div className="mb-20">
              <h3 className="text-xl font-black uppercase italic mb-4 border-b border-white/10 pb-2">Reviews</h3>
              {reviews.map(r => (
                 <div key={r.id} className="flex justify-between items-center bg-zinc-900 p-4 rounded-2xl mb-3 border border-white/5">
                    <div>
                       <p className="font-bold text-sm">{r.user} <span className="text-yellow-500 text-xs">{'★'.repeat(r.rating)}</span></p>
                       <p className="text-xs opacity-50">{r.text}</p>
                    </div>
                    <button onClick={() => deleteReview(r.id)} className="text-red-500 font-black text-xs">DELETE</button>
                 </div>
              ))}
           </div>
        </div>
      ) : (
        /* --- USER VIEW --- */
        <>
          {/* SEARCH */}
          <section className="pt-32 px-4 max-w-xl mx-auto">
             <div className="bg-zinc-900/50 border border-white/10 p-4 rounded-3xl flex items-center shadow-xl">
                <span className="mr-3 opacity-30 text-xl">🔍</span>
                <input type="text" placeholder="Search menu..." className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase" onChange={(e)=>setSearchQuery(e.target.value)} />
             </div>
          </section>

          {/* MENU */}
          <main className="mt-10 px-4 space-y-12 pb-32">
            {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => {
               const items = filteredItems.filter(i => i.category === cat);
               if(items.length === 0) return null;
               return (
                 <div key={cat} className="space-y-6">
                    <h2 className="text-3xl font-black italic uppercase text-orange-600 border-b border-white/5 pb-2 ml-2">{cat}</h2>
                    <div className="grid grid-cols-2 gap-4">
                       {items.map(p => (
                          <div key={p.id} className={`${isDark ? 'bg-zinc-900 border-white/5 shadow-lg' : 'bg-white shadow-md'} p-3 rounded-[2.5rem] border relative overflow-hidden ${!p.inStock ? 'grayscale opacity-40' : ''}`}>
                             <div className="h-32 rounded-[2rem] overflow-hidden mb-3 bg-zinc-800"><img src={p.img} className="w-full h-full object-cover" alt=""/></div>
                             <div className="text-center px-1">
                                <h3 className="text-[11px] font-black uppercase mb-1 h-8 flex items-center justify-center leading-none italic">{p.name[lang]}</h3>
                                <div className="flex justify-between items-center mt-2 bg-black/20 p-2 rounded-xl">
                                   <span className="text-lg font-black text-orange-600 italic">₹{p.price}</span>
                                   <button disabled={!p.inStock || !isKitchenOpen} onClick={()=>{haptic(); setCart([...cart, p])}} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${p.inStock && isKitchenOpen ? 'bg-orange-600 text-white' : 'bg-zinc-700 text-gray-500'}`}>ADD</button>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
               )
            })}
          </main>

          {/* CHECKOUT FLOAT */}
          <AnimatePresence>
            {subtotal > 0 && !myOrder && (
              <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-10 left-0 right-0 z-[1000] px-6">
                 <button onClick={() => setShowCheckout(true)} className="w-full max-w-lg mx-auto bg-zinc-950 p-5 rounded-[2.5rem] shadow-2xl flex justify-between items-center border border-white/10 text-white">
                    <div className="flex items-center gap-4 ml-3 italic">
                       <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-xl animate-bounce">🛒</div>
                       <p className="text-3xl font-black tracking-tighter">₹{subtotal}</p>
                    </div>
                    <div className="bg-orange-600 px-8 py-3 rounded-2xl font-black text-[10px] uppercase italic">Checkout →</div>
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* --- LIVE TRACKING OVERLAY (CONTROLLED BY ADMIN) --- */}
      <AnimatePresence>
        {myOrder && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-black/98 z-[5000] flex flex-col items-center justify-center p-12 text-center backdrop-blur-3xl">
             <div className="absolute top-10 right-10">
                <button onClick={() => setMyOrder(null)} className="text-white/20 font-black text-xs uppercase border border-white/10 px-4 py-2 rounded-full">Hide Tracking</button>
             </div>
             
             {/* DYNAMIC ICON BASED ON ADMIN STATUS */}
             <motion.div animate={{ scale:[1, 1.2, 1], rotate:[0, 10, -10, 0] }} transition={{repeat:Infinity, duration:2}} className="text-[12rem] mb-12 drop-shadow-[0_0_100px_rgba(234,88,12,0.8)]">
                {myOrder.status === 'Pending' ? '⏳' : myOrder.status === 'Cooking' ? '🔥' : myOrder.status === 'Ready' ? '✅' : '📝'}
             </motion.div>

             <h2 className="text-7xl font-black italic uppercase text-orange-600 mb-6 tracking-tighter leading-none">
                {myOrder.status === 'Pending' ? 'Waiting for Confirmation' : myOrder.status === 'Cooking' ? 'Chef is Cooking' : 'Order Ready!'}
             </h2>
             
             {myOrder.status === 'Pending' && <p className="text-sm opacity-50 uppercase tracking-widest animate-pulse">Shop is reviewing your order...</p>}
             {myOrder.status === 'Cooking' && <p className="text-sm opacity-50 uppercase tracking-widest">Tandoor is hot & running...</p>}
             {myOrder.status === 'Ready' && <button className="mt-8 bg-green-600 text-white px-8 py-4 rounded-3xl font-black uppercase text-xs shadow-xl animate-bounce">Collect Order Now</button>}

             {/* PROGRESS BAR */}
             <div className="w-full max-w-xl h-4 bg-zinc-900 rounded-full border border-white/10 relative mt-12 overflow-hidden">
                <motion.div 
                  initial={{width:0}} 
                  animate={{width: myOrder.status==='Pending'?'10%': myOrder.status==='Cooking'?'60%': '100%'}} 
                  className="h-full bg-orange-600 shadow-[0_0_30px_orange]"
                ></motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT DRAWER */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{y:800}} animate={{y:0}} exit={{y:800}} className="fixed inset-0 bg-black/95 z-[2000] pt-24 px-6">
             <button onClick={() => setShowCheckout(false)} className="mb-10 text-orange-600 font-black text-xs uppercase">← Back</button>
             <h2 className="text-4xl font-black italic uppercase text-orange-600 mb-8">Confirm Order</h2>
             <div className="bg-zinc-900 p-8 rounded-[3rem] border border-white/10 mb-8">
                {cart.map((c, i) => (
                   <div key={i} className="flex justify-between border-b border-white/5 pb-4 mb-4">
                      <p className="font-black text-sm uppercase italic">{c.name[lang]}</p>
                      <p className="text-orange-500 font-black">₹{c.price}</p>
                   </div>
                ))}
                <div className="text-right pt-4 text-4xl font-black text-orange-600 italic">₹{subtotal}</div>
             </div>
             <button onClick={() => placeOrder('WA')} className="w-full bg-[#25D366] text-white py-10 rounded-[3rem] font-black uppercase shadow-2xl text-sm italic">Send to Kitchen</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI MODAL */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
             <div className="bg-zinc-900 w-full max-w-lg h-[70vh] rounded-[3rem] border border-white/10 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between"><h3 className="font-black text-orange-600">AI ASSISTANT</h3><button onClick={() => setIsAiOpen(false)}>✕</button></div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">{aiChat.map((m,i)=><div key={i} className={`p-4 rounded-2xl text-xs font-bold ${m.role==='bot'?'bg-zinc-800':'bg-orange-600 text-right'}`}>{m.text}</div>)}</div>
                <div className="p-4 border-t border-white/5 flex gap-2"><input className="flex-1 bg-black p-4 rounded-xl text-white outline-none" value={aiInput} onChange={e=>setAiInput(e.target.value)} /><button onClick={askGemini} className="bg-white text-black px-6 rounded-xl font-black">SEND</button></div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setIsAiOpen(true)} className="fixed bottom-36 right-6 z-[2000] bg-orange-600 h-14 w-14 rounded-full shadow-lg flex items-center justify-center text-2xl animate-bounce">🤖</button>

      {/* FOOTER */}
      <footer className="mt-20 px-10 py-32 bg-zinc-950 border-t border-white/5 text-center">
        <h2 className="text-4xl font-black italic uppercase mb-8 tracking-tighter">developed by <span className="text-orange-600">aashray narang</span></h2>
        <a href="mailto:narangaashray34@gmail.com" className="opacity-50 text-sm">narangaashray34@gmail.com</a>
      </footer>
    </div>
  );
}