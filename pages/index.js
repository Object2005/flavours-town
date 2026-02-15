import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- ULTIMATE 19 ITEMS LIST ---
const initialMenuData = [
  { id: 1, category: "Chaap", name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, best: true, img: "/img/malai-chaap.jpg", inStock: true },
  { id: 2, category: "Chaap", name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, best: false, img: "/img/masala-chaap.jpg", inStock: true },
  { id: 3, category: "Chaap", name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, best: true, img: "/img/afghani-chaap.jpg", inStock: true },
  { id: 4, category: "Chaap", name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, best: false, img: "/img/achari-chaap.jpg", inStock: true },
  { id: 5, category: "Tikka", name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, best: true, img: "/img/paneer-tikka.jpg", inStock: true },
  { id: 6, category: "Tikka", name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, best: false, img: "/img/mushroom-tikka.jpg", inStock: true },
  { id: 7, category: "Rolls", name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, best: false, img: "/img/frankie.jpg", inStock: true },
  { id: 8, category: "Rolls", name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, best: true, img: "/img/paneer-roll.jpg", inStock: true },
  { id: 9, category: "Rolls", name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, best: false, img: "/img/chaap-roll.jpg", inStock: true },
  { id: 10, category: "Rolls", name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, best: false, img: "/img/mushroom-roll.jpg", inStock: true },
  { id: 11, category: "Snacks", name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, best: true, img: "/img/pav-bhaji.jpg", inStock: true },
  { id: 12, category: "Rolls", name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, best: false, img: "/img/twister.jpg", inStock: true },
  { id: 13, category: "Snacks", name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, best: false, img: "/img/kulcha.jpg", inStock: true },
  { id: 14, category: "Snacks", name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, best: true, img: "/img/cheese-chilli.jpg", inStock: true },
  { id: 15, category: "Snacks", name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, best: false, img: "/img/kacha-paneer.jpg", inStock: true },
  { id: 16, category: "Snacks", name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, best: false, img: "/img/paneer-fry.jpg", inStock: true },
  { id: 17, category: "Sweets", name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, best: true, img: "/img/gulab-jamun.jpg", inStock: true },
  { id: 18, category: "Sweets", name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, best: true, img: "/img/rabri-jamun.jpg", inStock: true },
  { id: 19, category: "Sweets", name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, best: false, img: "/img/gajrela.jpg", inStock: true }
];

const addonsData = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 },
  { id: 'p1', name: { en: "Special Packing", pu: "ਪੈਕਿੰਗ" }, price: 10 }
];

export default function Home() {
  // --- STATES ---
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [prepTime, setPrepTime] = useState(20);
  const [isOpen, setIsOpen] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customOptions, setCustomOptions] = useState({ spice: 'Medium' });
  const [sessionOrderId, setSessionOrderId] = useState('');

  const scrollRefs = useRef({});

  // --- HAPTIC FEEDBACK LOGIC ---
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(40);
    }
  };

  // --- INITIALIZATION & LOCAL STORAGE ---
  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(Math.random() * 9000) + 1000}`);
    
    // Load History
    const savedHistory = localStorage.getItem('ft_order_history');
    if (savedHistory) {
      setOrderHistory(JSON.parse(savedHistory));
    }

    // Load Admin Prep Time
    const savedPrep = localStorage.getItem('ft_admin_prep');
    if (savedPrep) {
      setPrepTime(parseInt(savedPrep));
    }

    // Check Store Timing (10 AM to 11 PM)
    const checkStoreStatus = () => {
      const currentHour = new Date().getHours();
      setIsOpen(currentHour >= 10 && currentHour < 23);
    };

    checkStoreStatus();
    const timer = setInterval(checkStoreStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  // --- PROGRESS BAR TIMER ---
  useEffect(() => {
    let progressInterval;
    if (orderStatus === 'Preparing') {
      progressInterval = setInterval(() => {
        setCookingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 1.5;
        });
      }, 50);
    } else {
      setCookingProgress(0);
    }
    return () => clearInterval(progressInterval);
  }, [orderStatus]);

  // --- UTILITY FUNCTIONS ---
  const handleScrollToCat = (catName) => {
    triggerHaptic();
    const element = scrollRefs.current[catName];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredMenu = useMemo(() => {
    return initialMenuData.filter(item => 
      item.name.en.toLowerCase().includes(searchFilter.toLowerCase()) || 
      item.name.pu.includes(searchFilter)
    );
  }, [searchFilter]);

  const subtotalCost = cart.reduce((acc, item) => acc + item.price, 0) + 
                       addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  const processOrder = () => {
    if (!isOpen && !isAdmin) {
      alert("Store is currently closed!");
      return;
    }
    
    triggerHaptic();
    setOrderStatus('Preparing');

    const itemsSummary = cart.map(i => `• ${i.name[lang]} (${i.spice})`).join('\n');
    const addonsSummary = addonsData.filter(a => addons[a.id]).map(a => `• ${a.name[lang]} x ${addons[a.id]}`).join('\n');
    
    const finalMsg = `*THE FLAVOUR'S TOWN ORDER*\n--------------------------\n*Order ID:* ${sessionOrderId}\n\n*Items Ordered:*\n${itemsSummary}\n\n${addonsSummary ? `*Extra Addons:*\n${addonsSummary}\n` : ''}*Grand Total:* ₹${subtotalCost}\n*Est. Prep Time:* ${prepTime} mins\n--------------------------\n_Thank you for ordering!_`;

    // Save ordered IDs to Order Again section
    const newIds = cart.map(item => item.id);
    const updatedHistory = [...new Set([...newIds, ...orderHistory])].slice(0, 5);
    localStorage.setItem('ft_order_history', JSON.stringify(updatedHistory));
    setOrderHistory(updatedHistory);

    setTimeout(() => {
      setOrderStatus(null);
      window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(finalMsg)}`);
      setCart([]);
      setAddons({});
    }, 3500);
  };

  const handleShare = (product) => {
    const shareText = `Oye! The Flavour's Town ton ${product.name.en} try kar, sachi swaad hai! 😋`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + window.location.href)}`;
    window.open(shareUrl, '_blank');
  };

  // --- COMPONENT UI ---
  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#fcfcfd] text-gray-900'} min-h-screen pb-44 transition-all duration-700 font-sans selection:bg-orange-500/30 overflow-x-hidden`}>
      <Head>
        <title>98774-74778 | The Flavour's Town Malout</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* STICKY TOP HEADER */}
      <header className={`fixed top-0 w-full z-[110] px-4 py-4 backdrop-blur-2xl ${isDark ? 'bg-black/80 border-white/5 shadow-2xl' : 'bg-white/90 border-gray-100 shadow-xl'} border-b flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ rotateY: 360 }} 
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            className="bg-orange-600 h-11 w-11 rounded-2xl flex items-center justify-center text-white font-black italic shadow-[0_0_20px_rgba(234,88,12,0.5)] text-xl"
          >FT</motion.div>
          <div>
            <h1 className="text-xs font-black uppercase tracking-tighter italic leading-none">The Flavour's Town</h1>
            <span className={`text-[7px] font-bold uppercase tracking-widest leading-none mt-1 block ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
              {isOpen ? '● Kitchen Open' : '● Closed (Opens 10 AM)'}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => { triggerHaptic(); setIsDark(!isDark); }} className="p-2.5 bg-zinc-800 rounded-2xl text-xs hover:bg-zinc-700 transition-all shadow-inner">{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => { triggerHaptic(); setLang(lang==='pu'?'en':'pu'); }} className="text-[10px] font-black bg-orange-600 text-white px-4 py-2.5 rounded-2xl shadow-lg uppercase active:scale-90 transition-all">{lang==='pu'?'EN':'ਪੰ'}</button>
          <button onClick={() => { const pass = prompt("Admin Pass:"); if(pass==="aashray778") setIsAdmin(!isAdmin); }} className="w-5 h-5 opacity-5">⚙️</button>
        </div>
      </header>

      {/* QUICK CATEGORY NAVIGATION TABS */}
      <nav className={`fixed top-[74px] w-full z-[100] py-4 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-3 px-4 border-b ${isDark ? 'bg-black/60 border-white/5 shadow-black' : 'bg-white/70 border-gray-100'}`}>
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(categoryName => (
          <button 
            key={categoryName} 
            onClick={() => handleScrollToCat(categoryName)} 
            className="bg-orange-600/10 border border-orange-600/30 px-6 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap text-orange-500 shadow-sm active:scale-95 transition-all"
          >#{categoryName}</button>
        ))}
      </nav>

      {/* ADMIN PANEL OVERLAY */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div initial={{y:-100}} animate={{y:0}} exit={{y:-100}} className="fixed top-36 left-4 right-4 z-[120] bg-orange-600 p-6 rounded-[3rem] shadow-2xl text-white border-4 border-white/20">
            <h3 className="text-sm font-black uppercase mb-4 tracking-widest">Admin Dashboard</h3>
            <div className="flex justify-between items-center bg-black/30 p-5 rounded-[2rem] border border-white/10">
              <span className="text-xs font-bold uppercase">Preparation Time: {prepTime} Mins</span>
              <div className="flex gap-3">
                <button onClick={() => { setPrepTime(t => Math.max(5, t-5)); localStorage.setItem('ft_admin_prep', prepTime-5); }} className="bg-white text-orange-600 w-10 h-10 rounded-full font-black text-xl shadow-lg active:scale-90">-</button>
                <button onClick={() => { setPrepTime(t => t+5); localStorage.setItem('ft_admin_prep', prepTime+5); }} className="bg-white text-orange-600 w-10 h-10 rounded-full font-black text-xl shadow-lg active:scale-90">+</button>
              </div>
            </div>
            <p className="text-[9px] mt-4 opacity-70 italic font-black text-center uppercase">Orders will show this time to customers</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH & HISTORY SECTION */}
      <section className="pt-44 px-4 max-w-7xl mx-auto space-y-10">
        
        {/* ORDER AGAIN (LOCAL STORAGE BASED) */}
        {orderHistory.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-orange-600 tracking-[0.4em] ml-2">Re-Order Best Sellers</p>
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
              {orderHistory.map(orderId => {
                const product = initialMenuData.find(m => m.id === orderId);
                if (!product) return null;
                return (
                  <motion.button 
                    whileTap={{scale:0.95}} 
                    key={orderId} 
                    onClick={() => { triggerHaptic(); setShowCustomizer(product); }} 
                    className={`min-w-[150px] p-5 rounded-[3rem] border transition-all ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-gray-200'} text-center shadow-xl`}
                  >
                    <div className="w-14 h-14 rounded-full mx-auto mb-3 border-2 border-orange-600 p-0.5 overflow-hidden">
                       <img src={product.img} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <p className="text-[9px] font-black uppercase truncate tracking-tighter">{product.name[lang]}</p>
                    <p className="text-orange-500 font-black text-xs mt-1">₹{product.price}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* SEARCH BAR */}
        <div className={`flex items-center px-8 py-6 rounded-[3rem] border transition-all ${isDark ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white border-gray-200 shadow-xl'}`}>
           <span className="mr-4 text-xl opacity-30">🔍</span>
           <input 
             type="text" 
             placeholder={lang === 'pu' ? "ਤੁਸੀਂ ਅੱਜ ਕੀ ਖਾਣਾ ਚਾਹੋਗੇ?..." : "Search for Malai Chaap, Paneer Tikka..."} 
             className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase tracking-tight placeholder:opacity-20" 
             onChange={(e) => setSearchFilter(e.target.value)} 
           />
        </div>
      </section>

      {/* MENU GRID RENDERING */}
      <main className="mt-12 px-4 max-w-7xl mx-auto space-y-28 pb-64">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((category) => (
          <div 
            key={category} 
            ref={el => scrollRefs.current[category] = el} 
            className="space-y-12 scroll-mt-48"
          >
            <div className="flex justify-between items-end border-b-4 border-orange-600/10 pb-5">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter text-orange-600 underline decoration-white/5 underline-offset-8">{category}</h2>
              <span className="text-[11px] font-black opacity-30 uppercase tracking-[0.3em] italic">Menu Selection</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {filteredMenu.filter(i => i.category === category).map((product, pIdx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: pIdx * 0.05 }}
                  key={product.id} 
                  className={`${isDark ? 'bg-zinc-900/40 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'bg-white border-gray-100 shadow-2xl'} rounded-[4rem] p-6 border relative group overflow-hidden transition-all`}
                >
                  <button onClick={() => handleShare(product)} className="absolute top-8 right-8 z-20 bg-black/50 backdrop-blur-md p-3 rounded-2xl text-xs hover:scale-125 transition-all border border-white/10 shadow-2xl">💬</button>
                  
                  <div className="relative rounded-[3rem] overflow-hidden mb-8 h-52 bg-zinc-800 shadow-inner">
                    <img src={product.img} className="w-full h-full object-cover group-hover:scale-110 duration-1000 opacity-90 transition-all" alt={product.name.en} />
                    <div className="absolute bottom-5 left-5 bg-orange-600 px-4 py-1.5 rounded-2xl text-[9px] font-black text-white shadow-xl tracking-widest border border-white/20">⏱️ {prepTime} MIN</div>
                  </div>

                  <div className="text-center px-2">
                    <h3 className="text-base font-black uppercase mb-2 h-12 flex items-center justify-center leading-none tracking-tighter italic text-orange-50">{product.name[lang]}</h3>
                    <p className="text-orange-500 font-black text-4xl mb-8 tracking-tighter italic">₹{product.price}</p>
                    <button 
                      disabled={!isOpen && !isAdmin}
                      onClick={() => { triggerHaptic(); setShowCustomizer(product); }} 
                      className={`w-full py-6 ${isOpen || isAdmin ? 'bg-orange-600 shadow-[0_15px_30px_rgba(234,88,12,0.4)]' : 'bg-zinc-800 cursor-not-allowed opacity-50'} text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest active:scale-90 transition-all leading-none italic`}
                    >
                      {isOpen || isAdmin ? 'Add To Bill' : 'Closed'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* FLOAT ACTION CART BUTTON */}
      <AnimatePresence>
        {subtotalCost > 0 && !orderStatus && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-10 left-4 right-4 z-[120] flex justify-center px-4">
            <button 
              onClick={() => { triggerHaptic(); setShowCheckout(true); }} 
              className="w-full max-w-lg bg-white p-7 rounded-[4rem] shadow-[0_50px_100px_-15px_rgba(234,88,12,0.8)] flex justify-between items-center text-black ring-8 ring-orange-600/20 active:scale-95 transition-all overflow-hidden border-2 border-orange-600/5 shadow-orange-600/40"
            >
               <div className="flex items-center gap-7 italic ml-3 text-left">
                  <div className="bg-orange-600 h-16 w-16 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl text-white italic shadow-orange-600/50 animate-bounce">🛍️</div>
                  <div>
                    <p className="text-[11px] font-black uppercase opacity-40 mb-1 leading-none tracking-[0.2em] italic">Checkout Total</p>
                    <p className="text-5xl font-black tracking-tighter text-black font-serif underline decoration-orange-600/30">₹{subtotalCost}</p>
                  </div>
               </div>
               <div className="bg-gray-900 text-white px-12 py-6 rounded-[2.5rem] font-black text-xs uppercase shadow-2xl tracking-[0.2em] italic mr-1 shadow-black/40 hover:bg-orange-600 transition-all">Review →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ITEM CUSTOMIZER DRAWER */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[300] flex items-end justify-center p-4">
            <motion.div initial={{y:500}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950 border-t border-white/10' : 'bg-white shadow-2xl'} w-full rounded-[5rem] p-14 max-w-xl border-t-4 border-orange-600/30`}>
              <div className="w-24 h-2 bg-zinc-800 rounded-full mx-auto mb-12 opacity-30"></div>
              <h2 className="text-5xl font-black italic uppercase text-orange-600 mb-4 tracking-tighter">{showCustomizer.name[lang]}</h2>
              <p className="text-[12px] font-black opacity-30 mb-14 tracking-[0.5em] uppercase italic underline decoration-orange-600/40">Personalize Spicy Level</p>
              
              <div className="space-y-14 mb-16">
                <div className="flex gap-5">
                  {['Low', 'Medium', 'High'].map(level => (
                    <button 
                      key={level} 
                      onClick={() => { triggerHaptic(); setCustomOptions({...customOptions, spice: level}); }} 
                      className={`flex-1 py-8 rounded-[2.5rem] text-[12px] font-black border-4 transition-all ${customOptions.spice === level ? 'bg-orange-600 border-orange-600 text-white shadow-2xl scale-105 rotate-1' : 'border-zinc-800 text-gray-600 opacity-40 hover:opacity-80'}`}
                    >{level}</button>
                  ))}
                </div>
                <div className="bg-orange-600/10 p-8 rounded-[3.5rem] border border-orange-600/20 flex items-center gap-6 shadow-inner">
                   <motion.span animate={{scale:[1, 1.2, 1]}} transition={{repeat:Infinity}} className="text-5xl drop-shadow-lg">💡</motion.span>
                   <p className="text-[11px] font-black leading-relaxed text-orange-500 uppercase italic tracking-widest">Master Chef Recommends: Adding Garlic Nan with this for the elite Malout experience!</p>
                </div>
              </div>

              <button onClick={() => { triggerHaptic(); setCart([...cart, {...showCustomizer, ...customOptions}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-9 rounded-[3.5rem] font-black uppercase shadow-2xl text-base active:scale-95 transition-all mb-6 italic tracking-widest leading-none shadow-orange-600/50 border-t border-white/20">Confirm & Add To Bill</button>
              <button onClick={() => setShowCustomizer(null)} className="w-full text-center text-[12px] font-black uppercase text-gray-500 tracking-[0.4em] italic underline underline-offset-8 mt-4 opacity-40 hover:opacity-100 transition-all">Cancel Item</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREPARATION PROGRESS MODAL */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 z-[600] flex flex-col items-center justify-center p-16 backdrop-blur-3xl overflow-hidden">
             <motion.div animate={{ scale:[1, 1.3, 1], rotate:[0, 15, -15, 0] }} transition={{repeat:Infinity, duration:2}} className="text-[14rem] mb-16 drop-shadow-[0_0_80px_rgba(234,88,12,0.8)] animate-pulse">🥘</motion.div>
             <h2 className="text-7xl font-black italic uppercase tracking-tighter mb-8 text-orange-600 underline decoration-white/10 underline-offset-[20px] decoration-8">Cooking!</h2>
             <p className="text-base text-gray-500 mb-20 uppercase tracking-[0.6em] font-black max-w-md leading-loose italic opacity-60 text-center">Malout's finest taste is being prepared by the Expert Master Chef...</p>
             <div className="w-80 h-4 bg-zinc-900 rounded-full overflow-hidden border-2 border-white/10 relative mb-16 shadow-2xl shadow-black ring-4 ring-orange-600/10">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-orange-600 shadow-[0_0_60px_rgba(234,88,12,1)] rounded-full"></motion.div>
             </div>
             <p className="text-[11px] font-black uppercase tracking-[0.8em] text-orange-600 animate-pulse italic mt-10">Syncing Bill with WhatsApp Cloud...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL CHECKOUT SUMMARY SYSTEM */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[250] flex items-end justify-center p-6">
             <motion.div initial={{y:500}} animate={{y:0}} exit={{y:500}} className={`${isDark ? 'bg-zinc-950 border-t border-white/10' : 'bg-white shadow-2xl'} w-full rounded-[6rem] p-16 max-w-2xl overflow-y-auto max-h-[95vh] border-t-2 border-orange-600/20`}>
                <h2 className="text-4xl font-black uppercase italic mb-14 text-orange-600 tracking-tighter underline decoration-white/10 underline-offset-8 decoration-4">Order Summary</h2>
                
                <div className="mb-14 overflow-x-auto flex gap-8 no-scrollbar pb-6 px-4">
                   {addonsData.map(addonItem => (
                     <div key={addonItem.id} className={`${isDark ? 'bg-white/5 border-white/5 shadow-inner shadow-black' : 'bg-gray-50 border-gray-100 shadow-sm'} min-w-[190px] p-10 rounded-[4rem] border text-center shadow-2xl relative overflow-hidden group`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-600/20 group-hover:bg-orange-600 transition-all"></div>
                        <p className="text-[15px] font-black mb-2 italic uppercase tracking-tighter">{addonItem.name[lang]}</p>
                        <p className="text-orange-600 font-black text-lg mb-10 italic tracking-[0.2em]">₹{addonItem.price}</p>
                        <div className={`flex justify-between items-center ${isDark ? 'bg-black/80 shadow-inner' : 'bg-white shadow-inner shadow-gray-200'} rounded-3xl p-3 border border-white/5`}>
                          <button onClick={() => { triggerHaptic(); setAddons({...addons, [addonItem.id]: Math.max(0, (addons[addonItem.id] || 0) - 1)}); }} className="w-12 h-12 text-orange-600 font-black text-4xl hover:scale-125 transition-all">-</button>
                          <span className="text-[20px] font-black text-white">{addons[addonItem.id] || 0}</span>
                          <button onClick={() => { triggerHaptic(); setAddons({...addons, [addonItem.id]: (addons[addonItem.id] || 0) + 1}); }} className="w-12 h-12 text-orange-600 font-black text-4xl hover:scale-125 transition-all">+</button>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="flex justify-between items-end mb-20 px-6 italic font-black">
                   <div className="space-y-2">
                     <p className="text-[12px] font-black text-gray-500 uppercase tracking-[0.5em] mb-4 leading-none opacity-40">Grand Total Payable</p>
                     <p className="text-8xl font-black text-orange-600 tracking-tighter leading-none shadow-orange-600/10 shadow-xl">₹{subtotalCost}</p>
                   </div>
                   <button onClick={() => setShowCheckout(false)} className="text-[12px] font-black text-red-500 uppercase underline decoration-zinc-800 underline-offset-[16px] decoration-4 italic tracking-[0.3em] hover:text-red-400 transition-all">Back to Menu</button>
                </div>

                <div className="space-y-6 pb-12">
                   <button onClick={() => processOrder()} className="w-full bg-[#25D366] text-white py-10 rounded-[4rem] font-black uppercase shadow-[0_20px_50px_rgba(34,197,94,0.4)] tracking-[0.4em] text-sm italic leading-none flex items-center justify-center gap-6 active:scale-95 transition-all border border-white/20 shadow-green-600/40">📱 Confirm On WhatsApp</button>
                   <p className="text-center text-[9px] font-black uppercase opacity-20 tracking-[0.4em]">Official Store Receipt will be generated</p>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER: DEVELOPER BRANDING & LOGOS */}
      <footer className={`mt-40 px-6 py-40 ${isDark ? 'bg-zinc-950 border-t border-white/5 shadow-inner' : 'bg-white border-t border-gray-100'} text-center overflow-hidden relative shadow-[0_-50px_100px_rgba(0,0,0,0.5)]`}>
        <motion.div animate={{x:[-300, 300]}} transition={{repeat:Infinity, duration:30, ease:"linear"}} className="absolute top-20 left-0 text-[15rem] font-black opacity-[0.01] whitespace-nowrap italic pointer-events-none uppercase tracking-tighter">THE FLAVOURS TOWN MALOUT PREMIUM CUISINE</motion.div>
        
        <p className="text-[11px] font-black uppercase tracking-[0.8em] text-gray-600 mb-20 opacity-30 italic underline decoration-orange-600/30 underline-offset-[12px]">Designed & Developed By</p>
        
        <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-24 relative inline-block leading-none z-10 transition-all hover:scale-110 duration-700 cursor-default">
          <span className={isDark ? 'text-white' : 'text-gray-900'}>AASHRAY </span> 
          <span className="text-orange-600 underline decoration-zinc-800 underline-offset-[20px] decoration-8 italic drop-shadow-[0_0_30px_rgba(234,88,12,0.3)]">NARANG</span>
        </h2>

        <div className="flex justify-center gap-16 mb-32 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 z-10 relative">
          <a href="https://github.com/Object2005" target="_blank" className="hover:scale-150 transition-transform active:scale-90"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className={`w-16 h-16 ${isDark ? 'invert' : ''}`} alt="Github Logo" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:scale-150 transition-transform active:scale-90"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-16 h-16" alt="LinkedIn Logo" /></a>
          <a href="mailto:aashraynarang@gmail.com" className="hover:scale-150 transition-transform active:scale-90"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-16 h-16" alt="Gmail Logo" /></a>
        </div>
        
        <p className="text-[13px] text-gray-700 font-bold uppercase tracking-[1em] italic opacity-20 z-10 relative leading-none mt-10">Premium Digital Business Experience • 2026</p>
      </footer>
    </div>
  );
}
