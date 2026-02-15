import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- ULTIMATE 19 ITEMS DATA ---
const initialMenuData = [
  { id: 1, category: "Chaap", name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, best: true, img: "/img/malai-chaap.jpg" },
  { id: 2, category: "Chaap", name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, best: false, img: "/img/masala-chaap.jpg" },
  { id: 3, category: "Chaap", name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, best: true, img: "/img/afghani-chaap.jpg" },
  { id: 4, category: "Chaap", name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, best: false, img: "/img/achari-chaap.jpg" },
  { id: 5, category: "Tikka", name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, best: true, img: "/img/paneer-tikka.jpg" },
  { id: 6, category: "Tikka", name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, best: false, img: "/img/mushroom-tikka.jpg" },
  { id: 7, category: "Rolls", name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, best: false, img: "/img/frankie.jpg" },
  { id: 8, category: "Rolls", name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, best: true, img: "/img/paneer-roll.jpg" },
  { id: 9, category: "Rolls", name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, best: false, img: "/img/chaap-roll.jpg" },
  { id: 10, category: "Rolls", name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, best: false, img: "/img/mushroom-roll.jpg" },
  { id: 11, category: "Snacks", name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, best: true, img: "/img/pav-bhaji.jpg" },
  { id: 12, category: "Rolls", name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, best: false, img: "/img/twister.jpg" },
  { id: 13, category: "Snacks", name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, best: false, img: "/img/kulcha.jpg" },
  { id: 14, category: "Snacks", name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, best: true, img: "/img/cheese-chilli.jpg" },
  { id: 15, category: "Snacks", name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, best: false, img: "/img/kacha-paneer.jpg" },
  { id: 16, category: "Snacks", name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, best: false, img: "/img/paneer-fry.jpg" },
  { id: 17, category: "Sweets", name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, best: true, img: "/img/gulab-jamun.jpg" },
  { id: 18, category: "Sweets", name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, best: true, img: "/img/rabri-jamun.jpg" },
  { id: 19, category: "Sweets", name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, best: false, img: "/img/gajrela.jpg" }
];

const addonsData = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 },
  { id: 'p1', name: { en: "Packing Charge", pu: "ਪੈਕਿੰਗ" }, price: 10 }
];

export default function Home() {
  // --- STATES ---
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [prepTime, setPrepTime] = useState(20);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customOptions, setCustomOptions] = useState({ spice: 'Medium' });
  const [sessionOrderId, setSessionOrderId] = useState('');

  const scrollRefs = useRef({});

  // --- HAPTIC FEEDBACK ---
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  // --- INITIAL LOAD & SYNC ---
  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(Math.random() * 9000) + 1000}`);
    
    // Load Stock & Config
    const savedMenu = localStorage.getItem('ft_menu_stock');
    if (savedMenu) {
        setMenu(JSON.parse(savedMenu));
    } else {
        const initialWithStock = initialMenuData.map(item => ({ ...item, inStock: true }));
        setMenu(initialWithStock);
    }

    const savedKitchen = localStorage.getItem('ft_kitchen_status');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    const savedHistory = localStorage.getItem('ft_history_v3');
    if (savedHistory) setOrderHistory(JSON.parse(savedHistory));

    const savedPrep = localStorage.getItem('ft_prep_val_v3');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
  }, []);

  // --- AUTO-SAVE STOCK ---
  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_menu_stock', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('ft_kitchen_status', JSON.stringify(isKitchenOpen));
  }, [isKitchenOpen]);

  // --- PROGRESS TIMER ---
  useEffect(() => {
    let timer;
    if (orderStatus === 'Preparing') {
      timer = setInterval(() => {
        setCookingProgress((p) => {
          if (p >= 100) {
            clearInterval(timer);
            return 100;
          }
          return p + 1.2;
        });
      }, 50);
    } else {
      setCookingProgress(0);
    }
    return () => clearInterval(timer);
  }, [orderStatus]);

  // --- SEARCH FILTER ---
  const filteredMenu = useMemo(() => {
    return menu.filter(item => 
      item.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.name.pu.includes(searchQuery)
    );
  }, [searchQuery, menu]);

  const subtotalCost = cart.reduce((acc, item) => acc + item.price, 0) + 
                       addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  // --- ADMIN ACTIONS ---
  const toggleStock = (id) => {
    triggerHaptic();
    setMenu(prev => prev.map(item => item.id === id ? { ...item, inStock: !item.inStock } : item));
  };

  // --- ORDER HANDLER ---
  const handleFinalCheckout = (method) => {
    if (!isKitchenOpen && !isAdmin) return;
    
    triggerHaptic();
    setOrderStatus('Preparing');

    const itemsSummary = cart.map(i => `• ${i.name[lang]} (${i.spice})`).join('\n');
    const addonsSummary = addonsData.filter(a => addons[a.id]).map(a => `• ${a.name[lang]} x ${addons[a.id]}`).join('\n');
    
    const finalBillText = `*THE FLAVOUR'S TOWN*\n*Order ID:* ${sessionOrderId}\n\n*Items:*\n${itemsSummary}\n\n${addonsSummary ? `*Addons:*\n${addonsSummary}\n` : ''}*Total:* ₹${subtotalCost}\n*Time:* ${prepTime} mins`;

    const ids = cart.map(item => item.id);
    const newHistory = [...new Set([...ids, ...orderHistory])].slice(0, 5);
    localStorage.setItem('ft_history_v3', JSON.stringify(newHistory));
    setOrderHistory(newHistory);

    setTimeout(() => {
      setOrderStatus(null);
      if (method === 'WA') {
        window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(finalBillText)}`);
      } else {
        window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${subtotalCost}&cu=INR`);
      }
      setCart([]);
      setAddons({});
      setShowCheckout(false);
    }, 4000);
  };

  // --- UI RENDER ---
  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f8f7f2] text-gray-900'} min-h-screen pb-44 transition-all duration-700 selection:bg-orange-600/30 overflow-x-hidden font-sans`}>
      <Head>
        <title>CALL 98774-74778 | The Flavour's Town Malout</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* STICKY HEADER */}
      <header className={`fixed top-0 w-full z-[150] px-4 py-4 backdrop-blur-3xl ${isDark ? 'bg-black/85 border-white/5 shadow-2xl' : 'bg-white/95 border-gray-100 shadow-xl'} border-b flex justify-between items-center transition-all`}>
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black italic shadow-orange-600/30 shadow-xl text-2xl">FT</motion.div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black uppercase tracking-tighter italic leading-none">The Flavour's Town</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className={`h-1.5 w-1.5 rounded-full ${isKitchenOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-70">
                    98774-74778 | {isKitchenOpen ? 'OPEN' : 'CLOSED'}
                </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <button onClick={() => { triggerHaptic(); setIsDark(!isDark); }} className={`p-2.5 rounded-2xl transition-all shadow-inner ${isDark ? 'bg-zinc-800' : 'bg-[#fdfbf7] border border-orange-100'}`}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => { triggerHaptic(); setLang(lang==='pu'?'en':'pu'); }} className="text-[10px] font-black bg-orange-600 text-white px-4 py-2.5 rounded-2xl shadow-xl uppercase active:scale-90 transition-all">
              {lang === 'pu' ? 'English' : 'ਪੰਜਾਬੀ'}
          </button>
          
          {/* BOLD ADMIN ICON ON CREAM WHITE */}
          <button 
            onClick={() => { const p = prompt("Aashray Master Pass:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} 
            className="w-10 h-10 rounded-2xl bg-[#fdfbf7] flex items-center justify-center border-2 border-orange-100 shadow-lg text-orange-600 active:scale-90 transition-all"
          >
              <span className="font-black text-xl leading-none">⚙️</span>
          </button>
        </div>
      </header>

      {/* ADMIN CONTROL PANEL */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div initial={{y:-200}} animate={{y:0}} exit={{y:-200}} className="fixed top-24 left-4 right-4 z-[160] bg-[#fdfbf7] p-8 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] text-gray-900 border-4 border-orange-100">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 text-orange-600 flex items-center justify-between">
                <span>Master Controls</span>
                <button onClick={()=>setIsAdmin(false)} className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-full">Exit</button>
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-5 rounded-[2rem] border border-orange-50 shadow-sm">
                    <p className="text-[10px] font-black uppercase mb-3 opacity-40">Kitchen Power</p>
                    <button onClick={() => { triggerHaptic(); setIsKitchenOpen(!isKitchenOpen); }} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase transition-all ${isKitchenOpen ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                        {isKitchenOpen ? 'Close Shop' : 'Open Shop'}
                    </button>
                </div>
                <div className="bg-white p-5 rounded-[2rem] border border-orange-50 shadow-sm text-center">
                    <p className="text-[10px] font-black uppercase mb-3 opacity-40">Est. Prep Time</p>
                    <div className="flex items-center justify-between">
                        <button onClick={()=>setPrepTime(p=>Math.max(5,p-5))} className="w-8 h-8 bg-orange-100 rounded-full font-black text-orange-600">-</button>
                        <span className="text-sm font-black italic">{prepTime}m</span>
                        <button onClick={()=>setPrepTime(p=>p+5)} className="w-8 h-8 bg-orange-100 rounded-full font-black text-orange-600">+</button>
                    </div>
                </div>
            </div>
            <p className="text-[9px] text-center font-bold opacity-30 uppercase tracking-[0.4em]">Tap any item on menu to toggle stock</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK CATEGORY TABS */}
      <nav className={`fixed top-[80px] w-full z-[140] py-4 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-4 px-6 border-b transition-all ${isDark ? 'bg-black/60 border-white/5' : 'bg-white/80 border-orange-50 shadow-sm'}`}>
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(c => (
          <button key={c} onClick={() => { triggerHaptic(); scrollRefs.current[c]?.scrollIntoView({behavior:'smooth', block:'start'}); }} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap shadow-inner transition-all ${isDark ? 'bg-orange-600/10 border-orange-600/30 text-orange-500' : 'bg-white border border-orange-100 text-orange-600 shadow-orange-100'}`}>#{c}</button>
        ))}
      </nav>

      {/* SEARCH SECTION */}
      <section className="pt-40 px-4 max-w-2xl mx-auto space-y-10">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className={`flex items-center px-8 py-6 rounded-[3rem] border transition-all ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-orange-100 shadow-2xl shadow-orange-100'}`}>
           <span className="mr-5 text-2xl opacity-20">🔍</span>
           <input 
             type="text" 
             placeholder={lang === 'pu' ? "ਤੁਸੀਂ ਅੱਜ ਕੀ ਖਾਣਾ ਚਾਹੋਗੇ?..." : "What are you craving today?..."} 
             className="bg-transparent border-none outline-none w-full text-base font-bold uppercase tracking-tight placeholder:opacity-20" 
             onChange={(e) => setSearchQuery(e.target.value)} 
           />
        </motion.div>
      </section>

      {/* ORDER AGAIN BESTSELLERS */}
      {orderHistory.length > 0 && (
          <section className="mt-12 px-4 max-w-7xl mx-auto">
            <p className="text-[10px] font-black uppercase text-orange-500 tracking-[0.5em] mb-6 ml-3 italic">Bestsellers For You</p>
            <div className="flex gap-5 overflow-x-auto no-scrollbar py-2">
              {orderHistory.map(id => {
                const p = menu.find(m => m.id === id);
                if (!p) return null;
                return (
                  <motion.button 
                    whileTap={{scale:0.92}} key={id} 
                    onClick={() => { triggerHaptic(); if(p.inStock) setShowCustomizer(p); }} 
                    className={`min-w-[160px] p-6 rounded-[3.5rem] border text-center shadow-xl transition-all ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-orange-50'}`}
                  >
                    <div className={`w-16 h-16 rounded-full mx-auto mb-4 border-2 border-orange-600 p-1 overflow-hidden transition-all ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                       <img src={p.img} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <p className="text-[10px] font-black uppercase truncate tracking-tighter">{p.name[lang]}</p>
                    <p className={`text-orange-500 font-black text-sm mt-1 italic ${!p.inStock ? 'hidden' : ''}`}>₹{p.price}</p>
                    {!p.inStock && <p className="text-[8px] font-black text-red-500 uppercase mt-1 italic">Stock Out</p>}
                  </motion.button>
                );
              })}
            </div>
          </section>
      )}

      {/* MENU RENDERING */}
      <main className="mt-24 px-4 max-w-7xl mx-auto space-y-32 pb-80 transition-all">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((cat) => (
          <div key={cat} ref={el => scrollRefs.current[cat] = el} className="space-y-16 scroll-mt-60">
            <div className="flex justify-between items-center border-b-4 border-orange-600/10 pb-8 px-2 transition-all">
              <h2 className="text-6xl font-black italic uppercase tracking-tighter text-orange-600 underline decoration-white/5 underline-offset-[16px]">{cat}</h2>
              <div className="text-right">
                  <p className="text-[9px] font-black opacity-20 uppercase tracking-[0.5em] italic leading-none">Section</p>
                  <p className="text-[12px] font-black text-green-500 uppercase italic">Original Taste</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {filteredMenu.filter(i => i.category === cat).map((p, pIdx) => (
                <motion.div 
                    initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: pIdx*0.05}}
                    key={p.id} 
                    className={`${isDark ? 'bg-zinc-900/40 border-white/5 shadow-black' : 'bg-white border-orange-50 shadow-2xl'} rounded-[4.5rem] p-7 border relative group overflow-hidden transition-all duration-700 ${!p.inStock ? 'grayscale opacity-40 scale-95' : ''}`}
                >
                  {/* ADMIN STOCK TOGGLE OVERLAY */}
                  {isAdmin && (
                      <button onClick={() => toggleStock(p.id)} className="absolute inset-0 z-40 bg-orange-600/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-xs uppercase">
                          {p.inStock ? 'Mark Out' : 'Mark In'}
                      </button>
                  )}

                  <div className="relative rounded-[3.5rem] overflow-hidden mb-10 h-60 bg-zinc-800 shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all">
                    <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 duration-1000 opacity-90" />
                    <div className="absolute bottom-6 left-6 bg-orange-600 px-5 py-2 rounded-2xl text-[10px] font-black text-white shadow-2xl border border-white/10 italic">⏱️ {prepTime}m</div>
                    {p.best && <div className="absolute top-6 left-6 bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[8px] font-black italic shadow-lg">FAVOURITE</div>}
                  </div>

                  <div className="text-center px-2">
                    <h3 className="text-lg font-black uppercase mb-3 h-14 flex items-center justify-center leading-none tracking-tighter italic text-orange-50">{p.name[lang]}</h3>
                    <p className="text-orange-500 font-black text-5xl mb-10 tracking-tighter italic drop-shadow-lg">₹{p.price}</p>
                    
                    <button 
                      disabled={!isKitchenOpen || !p.inStock}
                      onClick={() => { triggerHaptic(); setShowCustomizer(p); }} 
                      className={`w-full py-7 rounded-[3rem] text-[13px] font-black uppercase tracking-widest active:scale-90 transition-all leading-none italic ${isKitchenOpen && p.inStock ? 'bg-orange-600 shadow-[0_25px_50px_rgba(234,88,12,0.4)] text-white' : 'bg-zinc-800 text-gray-500'}`}
                    >
                      {!p.inStock ? 'Out Of Stock' : isKitchenOpen ? 'Add To Cart' : 'Kitchen Closed'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* FLOAT CART BAR (OPTIMIZED SPACE) */}
      <AnimatePresence>
        {subtotalCost > 0 && !orderStatus && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-16 left-4 right-4 z-[120] flex justify-center px-4">
            <button onClick={() => { triggerHaptic(); setShowCheckout(true); }} className={`w-full max-w-xl p-8 rounded-[4.5rem] shadow-[0_60px_120px_rgba(0,0,0,0.8)] flex justify-between items-center text-black ring-[12px] ring-orange-600/10 active:scale-95 transition-all overflow-hidden border-2 border-orange-600/10 ${isDark ? 'bg-white' : 'bg-gray-900 text-white'}`}>
               <div className="flex items-center gap-8 italic ml-4 text-left">
                  <div className="bg-orange-600 h-20 w-20 rounded-3xl flex items-center justify-center text-5xl shadow-2xl text-white italic shadow-orange-600/40 animate-bounce">🛍️</div>
                  <div>
                    <p className="text-[12px] font-black uppercase opacity-40 mb-1 tracking-[0.2em] italic">Review Selection</p>
                    <p className={`text-6xl font-black tracking-tighter font-serif underline decoration-orange-600/30 ${isDark ? 'text-black' : 'text-white'}`}>₹{subtotalCost}</p>
                  </div>
               </div>
               <div className={`px-14 py-7 rounded-[2.8rem] font-black text-xs uppercase shadow-2xl tracking-[0.4em] italic mr-1 transition-all duration-300 ${isDark ? 'bg-gray-900 text-white hover:bg-orange-600' : 'bg-orange-600 text-white'}`}>Review Bill →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREPARATION PROGRESS OVERLAY */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 z-[2000] flex flex-col items-center justify-center p-20 backdrop-blur-3xl overflow-hidden text-center">
             <motion.div animate={{ scale:[1, 1.4, 1], rotate:[0, 25, -25, 0] }} transition={{repeat:Infinity, duration:2}} className="text-[18rem] mb-20 drop-shadow-[0_0_120px_rgba(234,88,12,0.8)] animate-pulse">🥘</motion.div>
             <h2 className="text-8xl font-black italic uppercase tracking-tighter mb-10 text-orange-600 underline decoration-white/10 underline-offset-[30px] decoration-[14px]">Preparing!</h2>
             <p className="text-xl text-gray-500 mb-28 uppercase tracking-[0.7em] font-black max-w-2xl leading-loose italic opacity-60">Master Chef is currently turning your order into Malout's legendary taste...</p>
             <div className="w-[30rem] h-5 bg-zinc-900 rounded-full overflow-hidden border-2 border-white/20 relative mb-20 shadow-[0_0_60px_rgba(0,0,0,1)] ring-[12px] ring-orange-600/10">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-orange-600 shadow-[0_0_100px_rgba(234,88,12,1)] rounded-full"></motion.div>
             </div>
             <p className="text-[14px] font-black uppercase tracking-[1.2em] text-orange-600 animate-pulse italic mt-12 opacity-30 shadow-orange-600/10">Synchronizing Receipt Data with Cloud Server...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className={`mt-48 px-6 py-48 ${isDark ? 'bg-zinc-950 border-t border-white/5 shadow-inner' : 'bg-[#fdfbf7] border-t border-orange-50'} text-center overflow-hidden relative shadow-[0_-80px_200px_rgba(0,0,0,0.6)]`}>
        <motion.div animate={{x:[-500, 500]}} transition={{repeat:Infinity, duration:40, ease:"linear"}} className="absolute top-28 left-0 text-[20rem] font-black opacity-[0.005] whitespace-nowrap italic pointer-events-none uppercase tracking-tighter">THE FLAVOURS TOWN PREMIUM MALOUT EXPERIENCE</motion.div>
        
        <p className="text-[14px] font-black uppercase tracking-[1.2em] text-gray-600 mb-32 opacity-30 italic underline decoration-orange-600/30 underline-offset-[20px]">Crafted with Code & Swaad By</p>
        
        <h2 className="text-8xl font-black italic tracking-tighter uppercase mb-32 relative inline-block leading-none z-10 transition-all hover:scale-110 duration-1000">
          <span className={isDark ? 'text-white' : 'text-gray-900'}>AASHRAY </span> 
          <span className="text-orange-600 underline decoration-zinc-800 underline-offset-[30px] decoration-[12px] italic drop-shadow-[0_0_60px_rgba(234,88,12,0.4)]">NARANG</span>
        </h2>

        <div className="flex justify-center gap-24 mb-48 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 z-20 relative">
          <a href="https://github.com/Object2005" target="_blank" className="hover:scale-150 transition-transform active:scale-90"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className={`w-24 h-24 ${isDark ? 'invert' : ''}`} alt="GitHub" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:scale-150 transition-transform active:scale-90"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-24 h-24" alt="LinkedIn" /></a>
          <a href="mailto:aashraynarang@gmail.com" className="hover:scale-150 transition-transform active:scale-90"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-24 h-24" alt="Gmail" /></a>
        </div>
        
        <p className="text-[16px] text-gray-700 font-bold uppercase tracking-[1.4em] italic opacity-20 z-10 relative leading-none mt-20 tracking-widest">DIGITAL BUSINESS ENGINEERING • 2026</p>
      </footer>

      {/* ITEM CUSTOMIZER (REUSED FROM EMPEROR) */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-end justify-center p-4">
            <motion.div initial={{y:500}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950' : 'bg-white shadow-2xl'} w-full rounded-[6rem] p-16 max-w-xl border-t-8 border-orange-600/30`}>
              <div className="w-24 h-2 bg-zinc-800 rounded-full mx-auto mb-16 opacity-20"></div>
              <h2 className="text-6xl font-black italic uppercase text-orange-600 mb-6 tracking-tighter">{showCustomizer.name[lang]}</h2>
              <p className="text-sm font-black opacity-30 mb-16 tracking-[0.6em] uppercase italic underline decoration-orange-600/40">Custom Flavor Map</p>
              <div className="space-y-16 mb-24">
                <div className="flex gap-6">
                  {['Low', 'Medium', 'High'].map(lv => (
                    <button key={lv} onClick={() => { triggerHaptic(); setCustomOptions({spice: lv}); }} className={`flex-1 py-10 rounded-[3.5rem] text-[15px] font-black border-[6px] transition-all ${customOptions.spice === lv ? 'bg-orange-600 border-orange-600 text-white shadow-[0_30px_60px_rgba(234,88,12,0.6)] scale-110' : 'border-zinc-800 text-gray-600 opacity-40 hover:opacity-100 transition-all duration-300'}`}>{lv}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => { triggerHaptic(); setCart([...cart, {...showCustomizer, ...customOptions}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-11 rounded-[4rem] font-black uppercase shadow-[0_30px_60px_rgba(234,88,12,0.6)] text-lg active:scale-95 transition-all mb-8 italic tracking-widest leading-none border-t border-white/20">Finalize & Add</button>
              <button onClick={() => setShowCustomizer(null)} className="w-full text-center text-sm font-black uppercase text-gray-500 tracking-[0.6em] italic underline underline-offset-[16px] mt-10 opacity-40 hover:opacity-100">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT SUMMARY (REUSED FROM EMPEROR) */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[400] flex items-end justify-center p-8">
             <motion.div initial={{y:500}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950 border-t border-white/10' : 'bg-white shadow-2xl'} w-full rounded-[7rem] p-20 max-w-2xl overflow-y-auto max-h-[96vh] border-t-4 border-orange-600/20`}>
                <h2 className="text-5xl font-black uppercase italic mb-16 text-orange-600 tracking-tighter underline decoration-white/10 underline-offset-[25px] decoration-[6px]">Review Order</h2>
                <div className="flex justify-between items-end mb-24 px-8 italic font-black">
                   <div className="space-y-6">
                     <p className="text-[16px] font-black text-gray-500 uppercase tracking-[0.7em] mb-10 leading-none opacity-40">Payment Gateway Total</p>
                     <p className="text-[12rem] font-black text-orange-600 tracking-tighter leading-none drop-shadow-[0_20px_60px_rgba(234,88,12,0.5)]">₹{subtotalCost}</p>
                   </div>
                   <button onClick={() => setShowCheckout(false)} className="text-[16px] font-black text-red-500 uppercase underline decoration-zinc-800 underline-offset-[24px] decoration-8 italic tracking-[0.5em] hover:text-red-400 transition-all duration-300 mb-10">Modify</button>
                </div>
                <div className="space-y-10 pb-20">
                   <button onClick={() => handleFinalCheckout('UPI')} className="w-full bg-[#1A73E8] text-white py-12 rounded-[5rem] font-black uppercase shadow-[0_30px_70px_rgba(26,115,232,0.5)] tracking-[0.6em] text-sm italic leading-none flex items-center justify-center gap-8 active:scale-95 transition-all border border-white/10 group"><span className="text-4xl group-hover:scale-150 transition-all">💳</span> Instant UPI</button>
                   <button onClick={() => handleFinalCheckout('WA')} className="w-full bg-[#25D366] text-white py-12 rounded-[5rem] font-black uppercase shadow-[0_30px_70px_rgba(37,211,102,0.5)] tracking-[0.6em] text-sm italic leading-none flex items-center justify-center gap-8 active:scale-95 transition-all border border-white/10 group"><span className="text-4xl group-hover:scale-150 transition-all">📱</span> WhatsApp</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}