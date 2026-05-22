import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- ULTIMATE 19 ITEMS DATA WITH INITIAL STOCK STATE ---
const initialMenuData = [
  { id: 1, category: "Chaap", isBest: true, name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, reviews: 1240, img: "/img/malai-chaap.jpg", inStock: true },
  { id: 2, category: "Chaap", isBest: false, name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, reviews: 890, img: "/img/masala-chaap.jpg", inStock: true },
  { id: 3, category: "Chaap", isBest: true, name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, reviews: 1560, img: "/img/afghani-chaap.jpg", inStock: true },
  { id: 4, category: "Chaap", isBest: false, name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, reviews: 750, img: "/img/achari-chaap.jpg", inStock: true },
  { id: 5, category: "Tikka", isBest: true, name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, reviews: 2100, img: "/img/paneer-tikka.jpg", inStock: true },
  { id: 6, category: "Tikka", isBest: false, name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, reviews: 430, img: "/img/mushroom-tikka.jpg", inStock: true },
  { id: 7, category: "Rolls", isBest: false, name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, reviews: 620, img: "/img/frankie.jpg", inStock: true },
  { id: 8, category: "Rolls", isBest: true, name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, reviews: 940, img: "/img/paneer-roll.jpg", inStock: true },
  { id: 9, category: "Rolls", isBest: false, name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, reviews: 510, img: "/img/chaap-roll.jpg", inStock: true },
  { id: 10, category: "Rolls", isBest: false, name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, reviews: 320, img: "/img/mushroom-roll.jpg", inStock: true },
  { id: 11, category: "Snacks", isBest: true, name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, reviews: 1800, img: "/img/pav-bhaji.jpg", inStock: true },
  { id: 12, category: "Rolls", isBest: false, name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, reviews: 210, img: "/img/twister.jpg", inStock: true },
  { id: 13, category: "Snacks", isBest: false, name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, reviews: 770, img: "/img/kulcha.jpg", inStock: true },
  { id: 14, category: "Snacks", isBest: true, name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, reviews: 1100, img: "/img/cheese-chilli.jpg", inStock: true },
  { id: 15, category: "Snacks", isBest: false, name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, reviews: 150, img: "/img/kacha-paneer.jpg", inStock: true },
  { id: 16, category: "Snacks", isBest: false, name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, reviews: 420, img: "/img/paneer-fry.jpg", inStock: true },
  { id: 17, category: "Sweets", isBest: true, name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, reviews: 3000, img: "/img/gulab-jamun.jpg", inStock: true },
  { id: 18, category: "Sweets", isBest: true, name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, reviews: 2500, img: "/img/rabri-jamun.jpg", inStock: true },
  { id: 19, category: "Sweets", isBest: false, name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, reviews: 1300, img: "/img/gajrela.jpg", inStock: true }
];

const addonsData = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 },
  { id: 'p1', name: { en: "Packing Charge", pu: "ਪੈਕਿੰਗ" }, price: 10 }
];

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [prepTime, setPrepTime] = useState(20);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [orderStatus, setOrderStatus] = useState(null);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customOptions, setCustomOptions] = useState({ spice: 'Medium' });
  const [sessionOrderId, setSessionOrderId] = useState('');

  const scrollRefs = useRef({});

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  // Hydrate Data on Mount
  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_final_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData);

    const savedKitchen = localStorage.getItem('ft_final_kitchen');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    const savedPrep = localStorage.getItem('ft_final_prep');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
  }, []);

  // Sync to LocalStorage safely when state updates
  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_final_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('ft_final_kitchen', JSON.stringify(isKitchenOpen));
  }, [isKitchenOpen]);

  useEffect(() => {
    localStorage.setItem('ft_final_prep', prepTime.toString());
  }, [prepTime]);

  // Cooking Progress Simulator
  useEffect(() => {
    let interval;
    if (orderStatus === 'Preparing') {
      interval = setInterval(() => { 
        setCookingProgress(p => (p >= 100 ? 100 : p + 2.5)); 
      }, 100);
    } else setCookingProgress(0);
    return () => clearInterval(interval);
  }, [orderStatus]);

  // Advanced Filtering Engine (Search + Tabs)
  const filteredItems = useMemo(() => {
    return menu.filter(i => {
      const matchesSearch = i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.pu.includes(searchQuery);
      const matchesTab = activeTab === "All" || i.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, menu, activeTab]);

  // Cart Management
  const addToCart = (item, options) => {
    setCart(prev => [...prev, { ...item, cartId: `${item.id}-${Date.now()}`, ...options }]);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Math Calculations
  const subtotal = useMemo(() => {
    const itemsCost = cart.reduce((acc, i) => acc + i.price, 0);
    const addonsCost = addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);
    return itemsCost + addonsCost;
  }, [cart, addons]);

  const processOrder = (method) => {
    if (!isKitchenOpen && !isAdmin) return;
    haptic();
    setOrderStatus('Preparing');
    
    const itemsStr = cart.map(i => `• ${i.name[lang]} (${i.spice || 'Medium'})`).join('\n');
    const adsStr = addonsData.filter(a => addons[a.id]).map(a => `• ${a.name[lang]} x ${addons[a.id]}`).join('\n');
    const msg = `*THE FLAVOUR'S TOWN ORDER*\n*ID:* ${sessionOrderId}\n\n*Items:*\n${itemsStr}\n\n${adsStr ? `*Addons:*\n${adsStr}\n` : ''}*Total:* ₹${subtotal}\n*Wait Time:* ${prepTime}m\n📍 Malout, Punjab`;

    setTimeout(() => {
      setOrderStatus(null);
      if (method === 'WA') {
        window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(msg)}`);
      } else {
        window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${subtotal}&cu=INR`);
      }
      setCart([]); 
      setAddons({}); 
      setShowCheckout(false);
    }, 4500);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#fcfbf7] text-black'} min-h-screen pb-44 transition-all duration-500 font-sans overflow-x-hidden`}>
      <Head>
        <title>98774-74778 | The Flavour's Town (PRO)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* STICKY TOP HEADER */}
      <header className={`fixed top-0 w-full z-[1000] px-4 py-4 backdrop-blur-3xl ${isDark ? 'bg-black/90 border-white/10 shadow-2xl' : 'bg-white/95 border-gray-200 shadow-xl'} border-b flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 h-11 w-11 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg text-xl">FT</div>
          <div className="flex flex-col leading-none">
            <h1 className={`text-xs font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>The Flavour's Town</h1>
            <span className="text-[10px] font-black text-orange-500 animate-pulse">98774-74778</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => { haptic(); setIsDark(!isDark); }} className={`p-2.5 rounded-xl ${isDark ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-black'}`}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => { haptic(); setLang(lang==='pu'?'en':'pu'); }} className="text-[9px] font-black bg-orange-600 text-white px-4 py-2.5 rounded-xl uppercase shadow-lg">{lang === 'pu' ? 'EN' : 'ਪੰ'}</button>
          <button onClick={() => { const p = prompt("Admin Pass:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} className="w-9 h-9 rounded-xl bg-orange-600/10 border border-orange-600/30 flex items-center justify-center text-orange-600 shadow-md font-black text-lg">⚙️</button>
        </div>
      </header>

      {/* FILTER TABS */}
      <nav className={`fixed top-[74px] w-full z-[900] py-4 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-4 px-6 border-b ${isDark ? 'bg-black/80' : 'bg-white/90 shadow-md'}`}>
        {["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button 
            key={cat} 
            onClick={() => { haptic(); setActiveTab(cat); if(cat !== "All") scrollRefs.current[cat]?.scrollIntoView({behavior:'smooth', block:'start'}); }} 
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeTab === cat ? 'bg-orange-600 text-white' : 'bg-orange-600/10 text-orange-500 border border-orange-600/30'}`}
          >
            #{cat}
          </button>
        ))}
      </nav>

      {/* SEARCH SYSTEM */}
      <section className="pt-40 px-5 max-w-xl mx-auto">
        <div className={`flex items-center px-7 py-5 rounded-[2.5rem] border-4 transition-all ${isDark ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white border-orange-100 shadow-xl'}`}>
           <span className="mr-4 text-2xl opacity-40">🔍</span>
           <input type="text" value={searchQuery} placeholder={lang === 'pu' ? "ਤੁਹਾਨੂੰ ਅੱਜ ਕੀ ਪਸੰਦ ਹੈ?..." : "Search menu items..."} className={`bg-transparent border-none outline-none w-full text-base font-bold uppercase ${isDark ? 'text-white' : 'text-black'}`} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </section>

      {/* GRID CONFIGURATION */}
      <main className="mt-12 px-4 max-w-7xl mx-auto space-y-20 pb-64">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((catName) => {
          const items = filteredItems.filter(i => i.category === catName);
          if (items.length === 0) return null;
          return (
            <div key={catName} ref={el => scrollRefs.current[catName] = el} className="space-y-10 scroll-mt-48">
              <div className="flex justify-between items-end border-b-4 border-orange-600/10 pb-4 px-2">
                 <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>{catName}</h2>
                 <span className="text-[10px] font-black opacity-30 uppercase tracking-widest text-orange-600">Pure Taste</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-10">
                {items.map((p) => (
                  <motion.div initial={{opacity:0, scale:0.9}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} key={p.id} className={`${isDark ? 'bg-zinc-900/80 border-white/10 shadow-2xl' : 'bg-white border-orange-100 shadow-lg'} rounded-[3.5rem] p-4 border relative group overflow-hidden transition-all ${!p.inStock ? 'grayscale opacity-40' : ''}`}>
                    {isAdmin && (
                        <button onClick={() => setMenu(prev => prev.map(m => m.id === p.id ? {...m, inStock: !m.inStock} : m))} className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white border-4 border-dashed border-orange-600 rounded-[3.5rem] p-4 text-center">
                            <span className="text-3xl mb-2">{p.inStock ? '✅ Live' : '❌ Out'}</span>
                            <span className="text-[10px] font-black uppercase">Toggle Stock</span>
                        </button>
                    )}
                    <div className="relative rounded-[2.5rem] overflow-hidden mb-5 h-40 bg-zinc-800 shadow-xl">
                      <img src={p.img} className="w-full h-full object-cover" alt="" />
                      <div className="absolute bottom-3 left-3 bg-orange-600 px-3 py-1 rounded-xl text-[9px] font-black text-white">⏱️ {prepTime}m</div>
                      <div className="absolute top-3 right-3 bg-black/80 px-2.5 py-1 rounded-xl text-[10px] font-black text-yellow-400">⭐ {p.rating}</div>
                    </div>
                    <div className="text-center">
                      <h3 className={`text-[13px] font-black uppercase mb-1 h-12 flex items-center justify-center leading-none tracking-tighter italic ${isDark ? 'text-white' : 'text-black'}`}>{p.name[lang]}</h3>
                      <p className="text-orange-500 font-black text-3xl mb-5   italic">₹{p.price}</p>
                      <button 
                        disabled={!isKitchenOpen || !p.inStock}
                        onClick={() => { haptic(); setShowCustomizer(p); }} 
                        className={`w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-xl ${isKitchenOpen && p.inStock ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-gray-500'}`}
                      >
                        {!p.inStock ? 'SOLD OUT' : isKitchenOpen ? 'Customize' : 'CLOSED'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* FLOATING ACTION CART BAR */}
      <AnimatePresence>
        {subtotal > 0 && !orderStatus && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-8 left-0 right-0 z-[1000] px-6">
            <button onClick={() => { haptic(); setShowCheckout(true); }} className={`w-full max-w-lg mx-auto p-5 rounded-[2.5rem] shadow-2xl flex justify-between items-center border-2 border-orange-600/20 ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
               <div className="flex items-center gap-5 italic ml-3">
                  <div className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-3xl text-white font-black animate-bounce">🛒</div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase opacity-40 leading-none">Total Items: {cart.length}</p>
                    <p className="text-4xl font-black tracking-tighter">₹{subtotal}</p>
                  </div>
               </div>
               <div className={`px-10 py-4 rounded-[1.8rem] font-black text-[12px] uppercase shadow-2xl tracking-widest ${isDark ? 'bg-gray-900 text-white' : 'bg-orange-600 text-white'}`}>Review Bill →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MASTER CONSOLE PANEL */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div initial={{y:-300}} animate={{y:0}} exit={{y:-300}} className="fixed top-24 left-4 right-4 z-[1100] bg-[#fdfbf7] p-8 rounded-[4rem] shadow-2xl text-gray-900 border-4 border-orange-200">
            <h3 className="text-2xl font-black uppercase italic text-orange-600 mb-6 border-b pb-2">Master Admin Panel</h3>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-[2.5rem] shadow-sm">
                    <p className="text-[11px] font-black uppercase mb-3 opacity-40 text-center">Store Status</p>
                    <button onClick={() => setIsKitchenOpen(!isKitchenOpen)} className={`w-full py-4 rounded-2xl font-black text-[12px] uppercase ${isKitchenOpen ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                        {isKitchenOpen ? 'Close Kitchen' : 'Open Kitchen'}
                    </button>
                </div>
                <div className="bg-white p-5 rounded-[2.5rem] shadow-sm text-center">
                    <p className="text-[11px] font-black uppercase mb-3 opacity-40 text-center">Prep Duration</p>
                    <div className="flex items-center justify-between px-2">
                        <button onClick={()=>setPrepTime(p=>Math.max(5,p-5))} className="w-8 h-8 bg-orange-100 rounded-full font-black text-orange-600">-</button>
                        <span className="text-xl font-black">{prepTime}m</span>
                        <button onClick={()=>setPrepTime(p=>p+5)} className="w-8 h-8 bg-orange-100 rounded-full font-black text-orange-600">+</button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT PORTAL MODAL */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[2000] flex items-end justify-center p-4">
             <motion.div initial={{y:500}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950 border-white/10' : 'bg-white'} w-full rounded-[4rem] p-8 max-w-2xl overflow-y-auto max-h-[90vh] border-t-4 border-orange-600`}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black uppercase italic text-orange-600">Review Summary</h2>
                  <button onClick={() => setShowCheckout(false)} className="bg-red-600 text-white w-10 h-10 rounded-full font-black">✕</button>
                </div>
                
                <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                  {cart.map((c) => (
                    <div key={c.cartId} className="flex justify-between items-center border-b border-orange-600/10 pb-4">
                       <div className="text-left">
                         <p className="text-lg font-black uppercase">{c.name[lang]}</p>
                         <p className="text-xs text-orange-500 font-bold">{c.spice} Mode</p>
                       </div>
                       <div className="flex items-center gap-4">
                         <p className="font-black text-xl">₹{c.price}</p>
                         <button onClick={() => removeFromCart(c.cartId)} className="text-red-500 text-xs font-black bg-red-500/10 px-2 py-1 rounded-md">Delete</button>
                       </div>
                    </div>
                  ))}
                </div>

                {/* ADDONS CONTROLLER */}
                <h3 className="text-sm font-black uppercase opacity-40 mb-4 tracking-wider">Suggested Addons</h3>
                <div className="grid grid-cols-3 gap-2 mb-8">
                   {addonsData.map(a => (
                     <div key={a.id} className={`${isDark ? 'bg-zinc-900' : 'bg-gray-100'} p-3 rounded-2xl text-center`}>
                        <p className="text-xs font-black truncate">{a.name[lang]}</p>
                        <p className="text-sm font-bold text-orange-500 mb-2">₹{a.price}</p>
                        <div className="flex justify-between items-center bg-black/30 rounded-lg p-1">
                          <button onClick={() => setAddons({...addons, [a.id]: Math.max(0, (addons[a.id] || 0) - 1)})} className="text-orange-500 font-bold px-2">-</button>
                          <span className="text-xs font-bold text-white">{addons[a.id] || 0}</span>
                          <button onClick={() => setAddons({...addons, [a.id]: (addons[a.id] || 0) + 1})} className="text-orange-500 font-bold px-2">+</button>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="flex justify-between items-center mb-8 border-t pt-4">
                   <p className="text-xs font-black uppercase tracking-widest opacity-40">Amount Due</p>
                   <p className="text-5xl font-black text-orange-600">₹{subtotal}</p>
                </div>

                <div className="space-y-4">
                   <button onClick={() => processOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-4">💳 UPI INSTANT PAY</button>
                   <button onClick={() => processOrder('WA')} className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-4">📱 WHATSAPP ROUTE</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIVE ITEM CUSTOMIZER DRAWER */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[3000] flex items-end justify-center p-4">
            <motion.div initial={{y:300}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950' : 'bg-white'} w-full rounded-[3rem] p-8 max-w-md border-t-8 border-orange-600 shadow-2xl`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight">{showCustomizer.name[lang]}</h2>
                <button onClick={() => setShowCustomizer(null)} className="text-gray-500 font-black">✕</button>
              </div>
              <p className="text-xs uppercase font-black tracking-widest opacity-40 mb-3">Select Spice Profile</p>
              <div className="flex gap-4 mb-8">
                {['Low', 'Medium', 'High'].map(spice => (
                  <button key={spice} onClick={() => setCustomOptions({spice})} className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all ${customOptions.spice === spice ? 'bg-orange-600 border-orange-600 text-white scale-105' : 'border-zinc-800 text-gray-500'}`}>{spice}</button>
                ))}
              </div>
              <button onClick={() => { haptic(); addToCart(showCustomizer, customOptions); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase shadow-xl tracking-wider">Add to Basket</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REAL-TIME SIMULATED PROGRESS ENGINE */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 z-[5000] flex flex-col items-center justify-center p-6 text-center">
             <motion.div animate={{ scale:[1, 1.2, 1], rotate:[0, 10, -10, 0] }} transition={{repeat:Infinity, duration:2}} className="text-9xl mb-8">🥘</motion.div>
             <h2 className="text-6xl font-black uppercase text-orange-600 mb-2">COOKING MEAL</h2>
             <p className="text-sm text-gray-500 mb-8 max-w-xs uppercase font-black opacity-60">Preparing your order and parsing data vectors...</p>
             <div className="w-64 h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/10 relative">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-orange-600 rounded-full"></motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPACT FOOTER */}
      <footer className="mt-40 text-center opacity-30 text-xs font-black uppercase tracking-widest">
        <p>© 2026 The Flavour's Town | Developed by Aashray Narang</p>
      </footer>
    </div>
  );
}