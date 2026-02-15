import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- ULTIMATE 19 ITEMS DATA WITH RATINGS & BADGES ---
const initialMenuData = [
  { id: 1, category: "Chaap", isBest: true, name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, reviews: 1240, img: "/img/malai-chaap.jpg" },
  { id: 2, category: "Chaap", isBest: false, name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, reviews: 890, img: "/img/masala-chaap.jpg" },
  { id: 3, category: "Chaap", isBest: true, name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, reviews: 1560, img: "/img/afghani-chaap.jpg" },
  { id: 4, category: "Chaap", isBest: false, name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, reviews: 750, img: "/img/achari-chaap.jpg" },
  { id: 5, category: "Tikka", isBest: true, name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, reviews: 2100, img: "/img/paneer-tikka.jpg" },
  { id: 6, category: "Tikka", isBest: false, name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, reviews: 430, img: "/img/mushroom-tikka.jpg" },
  { id: 7, category: "Rolls", isBest: false, name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, reviews: 620, img: "/img/frankie.jpg" },
  { id: 8, category: "Rolls", isBest: true, name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, reviews: 940, img: "/img/paneer-roll.jpg" },
  { id: 9, category: "Rolls", isBest: false, name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, reviews: 510, img: "/img/chaap-roll.jpg" },
  { id: 10, category: "Rolls", isBest: false, name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, reviews: 320, img: "/img/mushroom-roll.jpg" },
  { id: 11, category: "Snacks", isBest: true, name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, reviews: 1800, img: "/img/pav-bhaji.jpg" },
  { id: 12, category: "Rolls", isBest: false, name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, reviews: 210, img: "/img/twister.jpg" },
  { id: 13, category: "Snacks", isBest: false, name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, reviews: 770, img: "/img/kulcha.jpg" },
  { id: 14, category: "Snacks", isBest: true, name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, reviews: 1100, img: "/img/cheese-chilli.jpg" },
  { id: 15, category: "Snacks", isBest: false, name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, reviews: 150, img: "/img/kacha-paneer.jpg" },
  { id: 16, category: "Snacks", isBest: false, name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, reviews: 420, img: "/img/paneer-fry.jpg" },
  { id: 17, category: "Sweets", isBest: true, name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, reviews: 3000, img: "/img/gulab-jamun.jpg" },
  { id: 18, category: "Sweets", isBest: true, name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, reviews: 2500, img: "/img/rabri-jamun.jpg" },
  { id: 19, category: "Sweets", isBest: false, name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, reviews: 1300, img: "/img/gajrela.jpg" }
];

const addonsData = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 },
  { id: 'p1', name: { en: "Extra Butter", pu: "ਮੱਖਣ" }, price: 20 },
  { id: 'p2', name: { en: "Special Packing", pu: "ਪੈਕਿੰਗ" }, price: 10 }
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
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customOptions, setCustomOptions] = useState({ spice: 'Medium' });
  const [sessionOrderId, setSessionOrderId] = useState('');
  const [stockNotif, setStockNotif] = useState(null);

  const scrollRefs = useRef({});

  // --- HAPTICS ---
  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(60); };

  // --- BOOTSTRAP ---
  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_god_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));

    const savedKitchen = localStorage.getItem('ft_god_kitchen');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    const savedPrep = localStorage.getItem('ft_god_prep');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_god_menu', JSON.stringify(menu));
    localStorage.setItem('ft_god_kitchen', JSON.stringify(isKitchenOpen));
    localStorage.setItem('ft_god_prep', prepTime.toString());
  }, [menu, isKitchenOpen, prepTime]);

  // --- PROGRESS LOGIC ---
  useEffect(() => {
    let interval;
    if (orderStatus === 'Preparing') {
      interval = setInterval(() => {
        setCookingProgress(p => (p >= 100 ? 100 : p + 1));
      }, 45);
    } else setCookingProgress(0);
    return () => clearInterval(interval);
  }, [orderStatus]);

  // --- ADMIN ACTIONS ---
  const handleStockToggle = (item) => {
    haptic();
    const newStatus = !item.inStock;
    setMenu(prev => prev.map(m => m.id === item.id ? { ...m, inStock: newStatus } : m));
    setStockNotif({ name: item.name.en, status: newStatus ? 'IN STOCK' : 'OUT OF STOCK' });
    setTimeout(() => setStockNotif(null), 3000);
  };

  // --- SEARCH & TOTALS ---
  const filteredItems = useMemo(() => menu.filter(i => 
    i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.pu.includes(searchQuery)
  ), [searchQuery, menu]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0) + 
                   addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  // --- ORDER EXECUTION ---
  const processFinalOrder = (method) => {
    if (!isKitchenOpen && !isAdmin) return;
    haptic();
    setOrderStatus('Preparing');

    const itemsStr = cart.map(i => `• ${i.name[lang]} (${i.spice} Spice)`).join('\n');
    const adsStr = addonsData.filter(a => addons[a.id]).map(a => `• ${a.name[lang]} x ${addons[a.id]}`).join('\n');
    const locationStr = "📍 Shop Location: Malout, Punjab (Near Main Chowk)";
    
    const finalBill = `*THE FLAVOUR'S TOWN*\n*ORDER ID:* ${sessionOrderId}\n\n*ITEMS:*\n${itemsStr}\n\n${adsStr ? `*ADDONS:*\n${adsStr}\n` : ''}*GRAND TOTAL:* ₹${subtotal}\n*WAIT TIME:* ${prepTime} mins\n\n${locationStr}\n--------------------------\n_Bill generated by Aashray's Digital System_`;

    setTimeout(() => {
      setOrderStatus(null);
      if (method === 'WA') {
        window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(finalBill)}`);
      } else {
        window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${subtotal}&cu=INR&tn=Order_${sessionOrderId}`);
      }
      setCart([]); setAddons({}); setShowCheckout(false);
    }, 4500);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#fcfbf7] text-gray-900'} min-h-screen pb-44 transition-all duration-700 selection:bg-orange-600/30 overflow-x-hidden font-sans relative`}>
      <Head>
        <title>98774-74778 | The Flavour's Town God Mode</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* ADMIN STOCK NOTIFICATION TOAST */}
      <AnimatePresence>
        {stockNotif && (
          <motion.div initial={{y:-100, opacity:0}} animate={{y:20, opacity:1}} exit={{y:-100, opacity:0}} className="fixed top-24 left-0 right-0 z-[2000] flex justify-center px-6">
            <div className="bg-orange-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black uppercase text-xs tracking-widest border-2 border-white/20">
              {stockNotif.name} is now <span className="underline">{stockNotif.status}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SYSTEM */}
      <header className={`fixed top-0 w-full z-[1000] px-6 py-5 backdrop-blur-3xl ${isDark ? 'bg-black/90 border-white/5 shadow-2xl' : 'bg-white/95 border-gray-100 shadow-xl'} border-b flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <motion.div animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg text-2xl">FT</motion.div>
          <div className="flex flex-col">
            <h1 className="text-xs font-black uppercase tracking-tight italic leading-none mb-1.5">The Flavour's Town</h1>
            <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isKitchenOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest animate-pulse drop-shadow-[0_0_8px_rgba(255,165,0,0.8)]">
                    98774-74778
                </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <button onClick={() => { haptic(); setIsDark(!isDark); }} className={`p-3 rounded-2xl transition-all shadow-inner ${isDark ? 'bg-zinc-800' : 'bg-[#fdfbf7] border border-orange-100'}`}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => { haptic(); setLang(lang==='pu'?'en':'pu'); }} className="text-[10px] font-black bg-orange-600 text-white px-4 py-2.5 rounded-2xl shadow-xl uppercase active:scale-95 transition-all">{lang === 'pu' ? 'EN' : 'ਪੰ'}</button>
          <button 
            onClick={() => { const p = prompt("Admin Pass:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} 
            className="w-11 h-11 rounded-2xl bg-[#fdfbf7] border-2 border-orange-100 flex items-center justify-center text-orange-600 shadow-lg active:scale-90 transition-all font-black text-xl"
          >⚙️</button>
        </div>
      </header>

      {/* ADMIN DASHBOARD ENGINE */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div initial={{y:-300}} animate={{y:0}} exit={{y:-300}} className="fixed top-28 left-4 right-4 z-[900] bg-[#fdfbf7] p-10 rounded-[4rem] shadow-[0_40px_120px_rgba(0,0,0,0.5)] text-gray-900 border-[6px] border-orange-100">
            <div className="flex items-center justify-between mb-8 border-b-2 border-orange-50 pb-6">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-orange-600">Aashray Master Control</h3>
                <span className="bg-green-100 text-green-600 text-[10px] font-black px-4 py-1.5 rounded-full animate-pulse">ADMIN MODE</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-7 rounded-[3rem] border border-orange-50 shadow-md">
                    <p className="text-[11px] font-black uppercase mb-4 opacity-40 text-center">Kitchen Logic</p>
                    <button onClick={() => { haptic(); setIsKitchenOpen(!isKitchenOpen); }} className={`w-full py-5 rounded-3xl font-black text-[11px] uppercase transition-all shadow-lg ${isKitchenOpen ? 'bg-red-600 text-white shadow-red-100' : 'bg-green-600 text-white shadow-green-100'}`}>
                        {isKitchenOpen ? 'Shut Kitchen' : 'Open Kitchen'}
                    </button>
                </div>
                <div className="bg-white p-7 rounded-[3rem] border border-orange-50 shadow-md text-center">
                    <p className="text-[11px] font-black uppercase mb-4 opacity-40 text-center">Global Wait Time</p>
                    <div className="flex items-center justify-between bg-orange-50 p-2 rounded-full px-4">
                        <button onClick={()=>setPrepTime(p=>Math.max(5,p-5))} className="w-10 h-10 bg-white text-orange-600 rounded-full font-black text-2xl shadow-sm hover:scale-110">-</button>
                        <span className="text-xl font-black italic tracking-tighter">{prepTime}m</span>
                        <button onClick={()=>setPrepTime(p=>p+5)} className="w-10 h-10 bg-white text-orange-600 rounded-full font-black text-2xl shadow-sm hover:scale-110">+</button>
                    </div>
                </div>
            </div>
            <p className="text-[9px] text-center mt-6 font-bold opacity-30 uppercase tracking-[0.4em]">Tap any item to Stock In/Out</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SMOOTH CATEGORY TABS */}
      <nav className={`fixed top-[94px] w-full z-[800] py-5 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-5 px-8 border-b transition-all ${isDark ? 'bg-black/70' : 'bg-white/80'} shadow-lg`}>
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button key={cat} onClick={() => { haptic(); scrollRefs.current[cat]?.scrollIntoView({behavior:'smooth', block:'start'}); }} className={`px-10 py-3.5 rounded-full text-[12px] font-black uppercase whitespace-nowrap transition-all shadow-sm ${isDark ? 'bg-orange-600/10 border border-orange-600/30 text-orange-500' : 'bg-white border border-orange-100 text-orange-600 shadow-orange-50'}`}>#{cat}</button>
        ))}
      </nav>

      {/* SEARCH ENGINE SECTION */}
      <section className="pt-52 px-6 max-w-2xl mx-auto">
        <div className={`flex items-center px-10 py-8 rounded-[4rem] border-4 transition-all ${isDark ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white border-orange-50 shadow-2xl shadow-orange-100'}`}>
           <span className="mr-6 text-3xl opacity-20 italic font-black transition-transform group-focus-within:rotate-90">🔍</span>
           <input 
             type="text" 
             placeholder={lang === 'pu' ? "ਕੁਝ ਖਾਸ ਲੱਭ ਰਹੇ ਹੋ?..." : "Search malout's premium taste..."} 
             className="bg-transparent border-none outline-none w-full text-lg font-bold uppercase tracking-tight" 
             onChange={(e) => setSearchQuery(e.target.value)} 
           />
        </div>
      </section>

      {/* ULTIMATE MENU RENDERING SYSTEM */}
      <main className="mt-32 px-6 max-w-7xl mx-auto space-y-48 pb-96">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((catName) => {
          const items = filteredItems.filter(i => i.category === catName);
          if (items.length === 0) return null;
          return (
            <div key={catName} ref={el => scrollRefs.current[catName] = el} className="space-y-24 scroll-mt-60">
              <div className="flex items-center justify-between border-b-8 border-orange-600/10 pb-12 px-6">
                <h2 className="text-9xl font-black italic uppercase tracking-tighter text-orange-600 underline decoration-white/5 underline-offset-[30px] leading-none drop-shadow-2xl">{catName}</h2>
                <div className="text-right">
                  <p className="text-[12px] font-black opacity-20 uppercase tracking-[0.8em] italic leading-none mb-3">Malout Special</p>
                  <p className="text-[18px] font-black text-green-500 uppercase italic tracking-widest leading-none">100% PURE VEG</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-14">
                {items.map((p, idx) => (
                  <motion.div 
                      initial={{opacity:0, y:60}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: idx*0.06}}
                      key={p.id} 
                      className={`${isDark ? 'bg-zinc-900/60 border-white/5 shadow-black' : 'bg-white border-orange-50 shadow-2xl shadow-orange-50'} rounded-[6rem] p-10 border relative group overflow-hidden transition-all duration-700 ${!p.inStock ? 'grayscale opacity-30 scale-95' : ''}`}
                  >
                    {/* ADMIN ACTION OVERLAY */}
                    {isAdmin && (
                        <button onClick={() => handleStockToggle(p)} className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center text-white border-8 border-dashed border-orange-600/40 rounded-[6rem] p-8 text-center">
                            <span className="text-6xl mb-6">{p.inStock ? '✅' : '❌'}</span>
                            <span className="text-xl font-black uppercase tracking-widest">{p.inStock ? 'Item is IN STOCK' : 'Item is OUT OF STOCK'}</span>
                            <p className="mt-4 text-[10px] opacity-40">Tap to toggle availability</p>
                        </button>
                    )}

                    {p.isBest && p.inStock && <div className="absolute top-12 left-12 z-30 bg-yellow-400 text-black px-6 py-2 rounded-full text-[10px] font-black italic shadow-2xl uppercase tracking-tighter rotate-[-5deg] animate-bounce">BEST SELLER</div>}

                    <div className="relative rounded-[5rem] overflow-hidden mb-14 h-72 bg-zinc-800 shadow-[0_40px_80px_rgba(0,0,0,0.6)] border-4 border-white/5">
                      <img src={p.img} className="w-full h-full object-cover group-hover:scale-125 duration-[2500ms] opacity-95 transition-all" alt="" />
                      <div className="absolute bottom-10 left-10 bg-orange-600 px-7 py-3 rounded-[2rem] text-[12px] font-black text-white shadow-2xl border-2 border-white/20 italic tracking-tighter">EST. {prepTime}M</div>
                      <div className="absolute top-10 right-10 bg-black/80 backdrop-blur-md px-6 py-3 rounded-3xl text-[14px] font-black text-yellow-400 border border-white/10 shadow-2xl">⭐ {p.rating} <span className="opacity-30 text-[10px]">({p.reviews})</span></div>
                    </div>

                    <div className="text-center px-6">
                      <h3 className="text-2xl font-black uppercase mb-6 h-20 flex items-center justify-center leading-none tracking-tighter italic text-orange-50">{p.name[lang]}</h3>
                      <p className="text-orange-500 font-black text-7xl tracking-tighter italic drop-shadow-[0_15px_15px_rgba(234,88,12,0.3)] mb-14">₹{p.price}</p>
                      
                      <button 
                        disabled={!isKitchenOpen || !p.inStock}
                        onClick={() => { haptic(); setShowCustomizer(p); }} 
                        className={`w-full py-9 rounded-[4rem] text-[18px] font-black uppercase tracking-widest active:scale-90 transition-all leading-none italic shadow-2xl border-t-4 border-white/10 ${isKitchenOpen && p.inStock ? 'bg-orange-600 text-white shadow-orange-600/40' : 'bg-zinc-800 text-gray-500'}`}
                      >
                        {!p.inStock ? 'SOLDOUT' : isKitchenOpen ? 'Add To Cart' : 'CLOSED'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* FLOAT ACTION HUB */}
      <AnimatePresence>
        {subtotal > 0 && !orderStatus && (
          <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} className="fixed bottom-14 left-4 right-4 z-[1000] flex justify-center px-4">
            <button onClick={() => { haptic(); setShowCheckout(true); }} className={`w-full max-w-3xl p-12 rounded-[6rem] shadow-[0_80px_200px_rgba(234,88,12,1)] flex justify-between items-center ring-[20px] ring-orange-600/10 active:scale-95 transition-all overflow-hidden border-4 border-orange-600/20 ${isDark ? 'bg-white text-black shadow-orange-600/40' : 'bg-zinc-950 text-white shadow-black'}`}>
               <div className="flex items-center gap-12 italic ml-8 text-left">
                  <motion.div animate={{y:[0, -20, 0]}} transition={{repeat:Infinity, duration:2}} className="bg-orange-600 h-28 w-28 rounded-[3.5rem] flex items-center justify-center text-7xl shadow-2xl text-white italic border-4 border-white/10">🛍️</motion.div>
                  <div>
                    <p className="text-[16px] font-black uppercase opacity-40 mb-2 tracking-[0.4em] italic leading-none">Checkout Value</p>
                    <p className={`text-9xl font-black tracking-tighter font-serif underline decoration-orange-600/30 leading-none`}>₹{subtotal}</p>
                  </div>
               </div>
               <div className={`px-24 py-10 rounded-[4rem] font-black text-[18px] uppercase shadow-2xl tracking-[0.6em] italic mr-3 transition-all duration-500 hover:scale-110 ${isDark ? 'bg-zinc-950 text-white shadow-black' : 'bg-orange-600 text-white'}`}>Review Bill →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COOKING ENGINE OVERLAY */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black z-[5000] flex flex-col items-center justify-center p-24 backdrop-blur-[100px] overflow-hidden text-center">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] animate-pulse"></div>
             <motion.div animate={{ scale:[1, 1.6, 1], rotate:[0, 25, -25, 0] }} transition={{repeat:Infinity, duration:2.5}} className="text-[30rem] mb-28 drop-shadow-[0_0_200px_rgba(234,88,12,0.9)] z-20">🥘</motion.div>
             <h2 className="text-[12rem] font-black italic uppercase tracking-tighter mb-16 text-orange-600 underline decoration-white/10 underline-offset-[50px] decoration-[24px] z-20 leading-none">COOKING!</h2>
             <p className="text-3xl text-gray-500 mb-40 uppercase tracking-[1em] font-black max-w-5xl leading-loose italic opacity-60 z-20">The Master Chef is currently crafting Malout's legendary veg cuisine specifically for your order...</p>
             <div className="w-[60rem] h-8 bg-zinc-950 rounded-full overflow-hidden border-4 border-white/10 relative mb-32 shadow-[0_0_120px_rgba(0,0,0,1)] ring-[25px] ring-orange-600/5 z-20">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 shadow-[0_0_150px_rgba(234,88,12,1)] rounded-full"></motion.div>
             </div>
             <p className="text-[20px] font-black uppercase tracking-[2em] text-orange-600 animate-pulse italic mt-16 z-20">SYNCHRONIZING ORDER Intel...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL CHECKOUT & RECEIPT ENGINE */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-[80px] z-[2000] flex items-end justify-center p-12">
             <motion.div initial={{y:1000}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950 border-t border-white/10' : 'bg-white shadow-[0_-50px_150px_rgba(0,0,0,0.5)]'} w-full rounded-[10rem] p-32 max-w-6xl overflow-y-auto max-h-[96vh] border-t-8 border-orange-600/30 relative`}>
                <button onClick={() => setShowCheckout(false)} className="absolute top-20 right-20 bg-red-600/10 text-red-500 w-24 h-24 rounded-full font-black text-5xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">✕</button>
                <h2 className="text-[7rem] font-black uppercase italic mb-24 text-orange-600 tracking-tighter underline decoration-white/10 underline-offset-[40px] decoration-[14px]">Order Summary</h2>
                
                {/* INTERACTIVE BILL RECEIPT */}
                <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fdfbf7] border-orange-100'} p-20 rounded-[8rem] mb-32 border-8 border-dashed shadow-inner`}>
                   <div className="space-y-14 font-black">
                      {cart.map((cItem, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b-4 border-orange-600/10 pb-12">
                           <div>
                             <p className="text-4xl uppercase tracking-tighter italic">{cItem.name[lang]}</p>
                             <p className="text-[18px] text-gray-500 uppercase font-black tracking-[0.6em] mt-5 italic">Chef Special: {cItem.spice} Spice</p>
                           </div>
                           <p className="text-orange-500 text-6xl tracking-tighter">₹{cItem.price}</p>
                        </div>
                      ))}
                      {addonsData.map(ad => addons[ad.id] > 0 && (
                        <div key={ad.id} className="flex justify-between items-center border-b-4 border-orange-600/10 pb-12 opacity-60">
                           <p className="text-4xl uppercase tracking-tighter italic opacity-50">{ad.name[lang]} (Quantity: {addons[ad.id]})</p>
                           <p className="text-orange-500 text-6xl tracking-tighter">₹{ad.price * addons[ad.id]}</p>
                        </div>
                      ))}
                   </div>
                   <div className="mt-20 pt-10 border-t-8 border-orange-600 flex justify-between items-end italic">
                       <p className="text-2xl opacity-40 uppercase font-black">Sub-Total Net Payable</p>
                       <p className="text-[12rem] text-orange-600 leading-none">₹{subtotal}</p>
                   </div>
                </div>

                {/* ADDONS SELECTION */}
                <div className="mb-32 overflow-x-auto flex gap-16 no-scrollbar pb-16 px-10">
                   {addonsData.map(addBtn => (
                     <div key={addBtn.id} className={`${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-orange-50'} min-w-[380px] p-24 rounded-[8rem] border-4 text-center shadow-2xl relative overflow-hidden group`}>
                        <p className="text-[32px] font-black mb-6 italic uppercase tracking-tighter">{addBtn.name[lang]}</p>
                        <p className="text-orange-600 font-black text-4xl mb-20 italic tracking-[0.6em]">₹{addBtn.price}</p>
                        <div className={`flex justify-between items-center ${isDark ? 'bg-black/90 shadow-[0_0_60px_rgba(0,0,0,1)]' : 'bg-white shadow-inner'} rounded-[6rem] p-8 border-8 border-white/5`}>
                          <button onClick={() => { haptic(); setAddons({...addons, [addBtn.id]: Math.max(0, (addons[addBtn.id] || 0) - 1)}); }} className="w-24 h-24 text-orange-600 font-black text-[10rem] hover:scale-125 transition-all leading-none">-</button>
                          <span className="text-[50px] font-black text-white">{addons[addBtn.id] || 0}</span>
                          <button onClick={() => { haptic(); setAddons({...addons, [addBtn.id]: (addons[addBtn.id] || 0) + 1}); }} className="w-24 h-24 text-orange-600 font-black text-[10rem] hover:scale-125 transition-all leading-none">+</button>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="space-y-16 pb-44">
                   <button onClick={() => processFinalOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-20 rounded-[8rem] font-black uppercase shadow-[0_50px_120px_rgba(26,115,232,0.5)] tracking-[1.5em] text-2xl italic leading-none flex items-center justify-center gap-16 active:scale-95 transition-all border-8 border-white/10 group"><span className="text-[10rem] group-hover:scale-125 transition-all">💳</span> UPI PAY</button>
                   <button onClick={() => processFinalOrder('WA')} className="w-full bg-[#25D366] text-white py-20 rounded-[8rem] font-black uppercase shadow-[0_50px_120px_rgba(37,211,102,0.5)] tracking-[1.5em] text-2xl italic leading-none flex items-center justify-center gap-16 active:scale-95 transition-all border-8 border-white/10 group"><span className="text-[10rem] group-hover:scale-125 transition-all">📱</span> WHATSAPP</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER - THE LEGACY */}
      <footer className={`mt-80 px-10 py-80 ${isDark ? 'bg-zinc-950 border-t-8 border-white/5 shadow-inner' : 'bg-[#fdfbf7] border-t-8 border-orange-50'} text-center overflow-hidden relative`}>
        <motion.div animate={{x:[-1000, 1000]}} transition={{repeat:Infinity, duration:50, ease:"linear"}} className="absolute top-48 left-0 text-[30rem] font-black opacity-[0.003] whitespace-nowrap italic pointer-events-none uppercase tracking-[2em]">THE FLAVOURS TOWN PREMIUM MALOUT</motion.div>
        
        <div className="mb-40 flex flex-col items-center gap-10 opacity-30 hover:opacity-100 transition-all duration-1000">
            <div className="w-32 h-32 border-8 border-green-600 rounded-[3rem] flex items-center justify-center p-6 shadow-[0_0_60px_rgba(0,128,0,0.4)]">
                <div className="w-full h-full bg-green-600 rounded-full shadow-[0_0_40px_rgba(0,128,0,0.8)]"></div>
            </div>
            <p className="text-4xl font-black text-green-600 uppercase tracking-[1.5em] italic">100% PURE VEG</p>
        </div>

        <p className="text-[24px] font-black uppercase tracking-[2.5em] text-gray-700 mb-48 opacity-10 italic leading-none">Engineering Since 2026</p>
        
        <h2 className="text-[14rem] font-black italic tracking-tighter uppercase mb-60 relative inline-block leading-none z-10 transition-all hover:scale-110 duration-[2000ms] cursor-help">
          <span className={isDark ? 'text-white' : 'text-gray-900'}>DEVELOPED BY </span> 
          <span className="text-orange-600 underline decoration-zinc-800 underline-offset-[70px] decoration-[35px] italic drop-shadow-[0_0_150px_rgba(234,88,12,0.8)]">AASHRAY NARANG</span>
        </h2>

        <div className="flex justify-center gap-48 mb-80 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-[1500ms] z-20 relative scale-150">
          <a href="https://github.com/Object2005" target="_blank" className="hover:scale-150 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className={`w-36 h-36 ${isDark ? 'invert' : ''}`} alt="" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:scale-150 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-36 h-36" alt="" /></a>
          <a href="mailto:aashraynarang@gmail.com" className="hover:scale-150 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-36 h-36" alt="" /></a>
        </div>
        
        <div className="z-20 relative space-y-12 opacity-10 font-black">
            <p className="text-[28px] text-gray-700 uppercase tracking-[3em] italic">MALOUT ● 2026</p>
            <p className="text-[18px] text-gray-700 uppercase tracking-[1.5em]">PREMIUM DIGITAL BUSINESS PORTAL</p>
        </div>
      </footer>

      {/* ITEM CUSTOMIZER ENGINE */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 backdrop-blur-[150px] z-[4000] flex items-end justify-center p-12">
            <motion.div initial={{y:1500}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950' : 'bg-white shadow-[0_-100px_300px_rgba(0,0,0,1)]'} w-full rounded-[12rem] p-36 max-w-4xl border-t-[30px] border-orange-600/50 relative shadow-2xl shadow-orange-950`}>
              <button onClick={() => setShowCustomizer(null)} className="absolute top-20 right-20 text-gray-500 font-black text-7xl hover:text-red-500 transition-colors">✕</button>
              <h2 className="text-[12rem] font-black italic uppercase text-orange-600 mb-20 tracking-tighter leading-[0.7] underline decoration-white/5 underline-offset-[30px]">{showCustomizer.name[lang]}</h2>
              <p className="text-3xl font-black opacity-20 mb-32 tracking-[1.5em] uppercase italic text-center">Flavor Profile Matrix</p>
              
              <div className="space-y-40 mb-48">
                <div className="flex gap-12">
                  {['Low', 'Medium', 'High'].map(spiceLevel => (
                    <button 
                      key={spiceLevel} 
                      onClick={() => { haptic(); setCustomOptions({spice: spiceLevel}); }} 
                      className={`flex-1 py-20 rounded-[8rem] text-[40px] font-black border-[12px] transition-all shadow-2xl ${customOptions.spice === spiceLevel ? 'bg-orange-600 border-orange-600 text-white scale-110 shadow-orange-600/60' : 'border-zinc-800 text-gray-600 opacity-20 hover:opacity-100'}`}
                    >{spiceLevel}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => { haptic(); setCart([...cart, {...showCustomizer, ...customOptions}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-24 rounded-[8rem] font-black uppercase shadow-[0_80px_150px_rgba(234,88,12,0.7)] text-[5rem] active:scale-95 transition-all italic leading-none border-t-8 border-white/20">Add To Plate</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}