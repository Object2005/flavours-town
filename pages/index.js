import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- ULTIMATE MENU DATA WITH SPECIAL TAGS ---
const initialMenuData = [
  { id: 1, category: "Chaap", tag: "Must Try", name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, img: "/img/malai-chaap.jpg" },
  { id: 2, category: "Chaap", tag: "Spicy", name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, img: "/img/masala-chaap.jpg" },
  { id: 3, category: "Chaap", tag: "Elite", name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, img: "/img/afghani-chaap.jpg" },
  { id: 4, category: "Chaap", tag: "Classic", name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, img: "/img/achari-chaap.jpg" },
  { id: 5, category: "Tikka", tag: "Best Seller", name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, img: "/img/paneer-tikka.jpg" },
  { id: 6, category: "Tikka", tag: "New", name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, img: "/img/mushroom-tikka.jpg" },
  { id: 7, category: "Rolls", tag: "Quick Bite", name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, img: "/img/frankie.jpg" },
  { id: 8, category: "Rolls", tag: "Loaded", name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, img: "/img/paneer-roll.jpg" },
  { id: 9, category: "Rolls", tag: "Protein", name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, img: "/img/chaap-roll.jpg" },
  { id: 10, category: "Rolls", tag: "Crispy", name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, img: "/img/mushroom-roll.jpg" },
  { id: 11, category: "Snacks", tag: "King Taste", name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, img: "/img/pav-bhaji.jpg" },
  { id: 12, category: "Rolls", tag: "Unique", name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, img: "/img/twister.jpg" },
  { id: 13, category: "Snacks", tag: "Chef Choice", name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, img: "/img/kulcha.jpg" },
  { id: 14, category: "Snacks", tag: "Premium", name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, img: "/img/cheese-chilli.jpg" },
  { id: 15, category: "Snacks", tag: "Fresh", name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, img: "/img/kacha-paneer.jpg" },
  { id: 16, category: "Snacks", tag: "Fried", name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, img: "/img/paneer-fry.jpg" },
  { id: 17, category: "Sweets", tag: "Sweet Tooth", name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, img: "/img/gulab-jamun.jpg" },
  { id: 18, category: "Sweets", tag: "Signature", name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, img: "/img/rabri-jamun.jpg" },
  { id: 19, category: "Sweets", tag: "Seasonal", name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, img: "/img/gajrela.jpg" }
];

const addonsData = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 },
  { id: 'p1', name: { en: "Special Packing", pu: "ਪੈਕਿੰਗ" }, price: 10 }
];

export default function Home() {
  // --- CORE APP STATE ---
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [prepTime, setPrepTime] = useState(25);
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

  // --- AUDIO LOGIC ---
  const playSound = (type) => {
    try {
      const audio = new Audio(type === 'success' ? '/success.mp3' : '/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.log("Audio not played yet"));
    } catch(e) {}
  };

  const hapticEffect = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(60);
      playSound('click');
    }
  };

  // --- BOOTSTRAP & SYNC ---
  useEffect(() => {
    const randomId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    setSessionOrderId(randomId);

    const savedMenu = localStorage.getItem('ft_menu_v4');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));

    const savedKitchen = localStorage.getItem('ft_kitchen_v4');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    const savedHist = localStorage.getItem('ft_hist_v4');
    if (savedHist) setOrderHistory(JSON.parse(savedHist));

    const savedPrep = localStorage.getItem('ft_prep_v4');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
  }, []);

  // --- DATA PERSISTENCE ---
  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_menu_v4', JSON.stringify(menu));
    localStorage.setItem('ft_kitchen_v4', JSON.stringify(isKitchenOpen));
    localStorage.setItem('ft_prep_v4', prepTime.toString());
  }, [menu, isKitchenOpen, prepTime]);

  // --- COOKING PROGRESS ENGINE ---
  useEffect(() => {
    let interval;
    if (orderStatus === 'Preparing') {
      interval = setInterval(() => {
        setCookingProgress(prev => (prev >= 100 ? 100 : prev + 1.25));
      }, 50);
    } else {
      setCookingProgress(0);
    }
    return () => clearInterval(interval);
  }, [orderStatus]);

  // --- CALCULATIONS ---
  const filteredItems = useMemo(() => {
    return menu.filter(item => 
      item.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.name.pu.includes(searchQuery)
    );
  }, [searchQuery, menu]);

  const totalBillAmount = cart.reduce((acc, item) => acc + item.price, 0) + 
                          addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  // --- HANDLERS ---
  const toggleItemStock = (id) => {
    hapticEffect();
    setMenu(prev => prev.map(m => m.id === id ? { ...m, inStock: !m.inStock } : m));
  };

  const executeOrder = (payMethod) => {
    if (!isKitchenOpen && !isAdmin) return;
    
    hapticEffect();
    setOrderStatus('Preparing');

    const itemsSummary = cart.map(i => `• ${i.name[lang]} [${i.spice}]`).join('\n');
    const adsSummary = addonsData.filter(a => addons[a.id]).map(a => `• ${a.name[lang]} x ${addons[a.id]}`).join('\n');
    
    const finalReceipt = `*THE FLAVOUR'S TOWN OFFICIAL*\n--------------------------\n*Order ID:* ${sessionOrderId}\n\n*Ordered Items:*\n${itemsSummary}\n\n${adsSummary ? `*Addons:*\n${adsSummary}\n` : ''}*Grand Total:* ₹${totalBillAmount}\n*Est. Wait:* ${prepTime} mins\n--------------------------\n_Shop: 98774-74778_`;

    const currentHistoryIds = cart.map(i => i.id);
    const updatedHistory = [...new Set([...currentHistoryIds, ...orderHistory])].slice(0, 6);
    localStorage.setItem('ft_hist_v4', JSON.stringify(updatedHistory));
    setOrderHistory(updatedHistory);

    setTimeout(() => {
      setOrderStatus(null);
      playSound('success');
      if (payMethod === 'WA') {
        window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(finalReceipt)}`);
      } else {
        window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${totalBillAmount}&cu=INR&tn=Bill_${sessionOrderId}`);
      }
      setCart([]);
      setAddons({});
      setShowCheckout(false);
    }, 4500);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f8f7f2] text-gray-900'} min-h-screen pb-44 transition-all duration-700 selection:bg-orange-600/30 overflow-x-hidden font-sans relative`}>
      <Head>
        <title>98774-74778 | The Flavour's Town Premium</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* BACKGROUND TEXTURE FOR ELITE LOOK */}
      <div className={`fixed inset-0 pointer-events-none opacity-[0.03] ${isDark ? 'invert' : ''}`} style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }}></div>

      {/* MAIN TOP BAR */}
      <header className={`fixed top-0 w-full z-[1000] px-5 py-5 backdrop-blur-3xl ${isDark ? 'bg-black/90 border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.8)]' : 'bg-white/95 border-gray-100 shadow-xl'} border-b flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <motion.div animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 7, ease: "linear" }} className="bg-orange-600 h-14 w-14 rounded-3xl flex items-center justify-center text-white font-black italic shadow-[0_15px_35px_rgba(234,88,12,0.4)] text-3xl">FT</motion.div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black uppercase tracking-tight italic leading-none">The Flavour's Town</h1>
            <a href="tel:+919877474778" className="flex items-center gap-2 mt-1.5 group">
                <span className={`h-2 w-2 rounded-full ${isKitchenOpen ? 'bg-green-500 animate-pulse shadow-[0_0_10px_green]' : 'bg-red-500'}`}></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 group-hover:underline transition-all">98774-74778 | {isKitchenOpen ? 'OPEN' : 'CLOSED'}</span>
            </a>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <button onClick={() => { hapticEffect(); setIsDark(!isDark); }} className={`p-3 rounded-2xl transition-all shadow-inner ${isDark ? 'bg-zinc-800' : 'bg-[#fdfbf7] border border-orange-50'}`}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => { hapticEffect(); setLang(lang==='pu'?'en':'pu'); }} className="text-[11px] font-black bg-orange-600 text-white px-5 py-3 rounded-2xl shadow-xl uppercase active:scale-95 transition-all italic leading-none">
              {lang === 'pu' ? 'EN' : 'ਪੰ'}
          </button>
          <button 
            onClick={() => { const p = prompt("Admin Master Access:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} 
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all ${isAdmin ? 'bg-orange-600 text-white border-white/20 rotate-180' : 'bg-[#fdfbf7] border-orange-100 text-orange-600'}`}
          >
              <span className="font-black text-2xl leading-none">⚙️</span>
          </button>
        </div>
      </header>

      {/* ADMIN CONTROL PANEL SYSTEM */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div initial={{y:-300}} animate={{y:0}} exit={{y:-300}} className="fixed top-28 left-4 right-4 z-[900] bg-[#fdfbf7] p-10 rounded-[4rem] shadow-[0_40px_120px_rgba(0,0,0,0.5)] text-gray-900 border-[6px] border-orange-100">
            <div className="flex items-center justify-between mb-8 border-b-2 border-orange-50 pb-6">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-orange-600">Aashray Console</h3>
                <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-full">SYSTEM: LIVE</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-7 rounded-[3rem] border border-orange-50 shadow-md">
                    <p className="text-[11px] font-black uppercase mb-4 opacity-40 italic tracking-widest text-center">Store Status</p>
                    <button onClick={() => { hapticEffect(); setIsKitchenOpen(!isKitchenOpen); }} className={`w-full py-5 rounded-3xl font-black text-[11px] uppercase transition-all shadow-lg ${isKitchenOpen ? 'bg-red-600 text-white shadow-red-100' : 'bg-green-600 text-white shadow-green-100'}`}>
                        {isKitchenOpen ? 'Close Kitchen' : 'Open Kitchen'}
                    </button>
                </div>
                <div className="bg-white p-7 rounded-[3rem] border border-orange-50 shadow-md text-center">
                    <p className="text-[11px] font-black uppercase mb-4 opacity-40 italic tracking-widest">Global Wait Time</p>
                    <div className="flex items-center justify-between bg-orange-50 p-2 rounded-full px-4">
                        <button onClick={()=>setPrepTime(p=>Math.max(5,p-5))} className="w-10 h-10 bg-white text-orange-600 rounded-full font-black text-2xl shadow-sm hover:scale-110">-</button>
                        <span className="text-xl font-black italic tracking-tighter">{prepTime}m</span>
                        <button onClick={()=>setPrepTime(p=>p+5)} className="w-10 h-10 bg-white text-orange-600 rounded-full font-black text-2xl shadow-sm hover:scale-110">+</button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY CATEGORY TABS FLOW */}
      <nav className={`fixed top-[94px] w-full z-[800] py-5 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-5 px-8 border-b transition-all ${isDark ? 'bg-black/70 border-white/5' : 'bg-white/80 border-orange-50 shadow-lg'}`}>
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(catId => (
          <button key={catId} onClick={() => { hapticEffect(); scrollRefs.current[catId]?.scrollIntoView({behavior:'smooth', block:'start'}); }} className={`px-8 py-3.5 rounded-full text-[12px] font-black uppercase whitespace-nowrap transition-all ${isDark ? 'bg-orange-600/10 border border-orange-600/30 text-orange-500 hover:bg-orange-600 hover:text-white' : 'bg-white border border-orange-100 text-orange-600 shadow-orange-50 hover:bg-[#fdfbf7]'}`}>#{catId}</button>
        ))}
      </nav>

      {/* SEARCH ENGINE & HISTORY PORTAL */}
      <section className="pt-48 px-5 max-w-2xl mx-auto space-y-12">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className={`flex items-center px-10 py-7 rounded-[4rem] border-4 transition-all ${isDark ? 'bg-zinc-900 border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)]' : 'bg-white border-orange-50 shadow-2xl shadow-orange-100'}`}>
           <span className="mr-6 text-3xl opacity-20 transition-transform group-focus-within:rotate-90 italic font-black">🔍</span>
           <input 
             type="text" 
             placeholder={lang === 'pu' ? "ਤੁਹਾਨੂੰ ਅੱਜ ਕੀ ਪਸੰਦ ਹੈ?..." : "Type your cravings (Malai Chaap)..."} 
             className="bg-transparent border-none outline-none w-full text-lg font-bold uppercase tracking-tight placeholder:opacity-30 placeholder:italic" 
             onChange={(e) => setSearchQuery(e.target.value)} 
           />
        </motion.div>

        {/* ORDER AGAIN (LOCAL STORAGE INTEL) */}
        {orderHistory.length > 0 && !searchQuery && (
          <motion.div initial={{x:-50, opacity:0}} animate={{x:0, opacity:1}} className="space-y-6">
            <p className="text-[12px] font-black uppercase text-orange-600 tracking-[0.6em] ml-4 italic flex items-center gap-3">
                <span className="w-10 h-0.5 bg-orange-600 opacity-20"></span> Order History
            </p>
            <div className="flex gap-6 overflow-x-auto no-scrollbar py-4 px-2">
              {orderHistory.map(histId => {
                const item = menu.find(m => m.id === histId);
                if (!item) return null;
                return (
                  <motion.button 
                    whileTap={{scale:0.9}} key={histId} 
                    onClick={() => { hapticEffect(); if(item.inStock) setShowCustomizer(item); }} 
                    className={`min-w-[180px] p-8 rounded-[4rem] border text-center shadow-2xl transition-all relative group ${isDark ? 'bg-zinc-900 border-white/5 hover:bg-zinc-800' : 'bg-white border-orange-50 hover:bg-orange-50/10'}`}
                  >
                    <div className={`w-20 h-20 rounded-full mx-auto mb-5 border-4 border-orange-600/40 p-1 overflow-hidden transition-transform duration-500 group-hover:rotate-12 ${!item.inStock ? 'grayscale opacity-20' : ''}`}>
                       <img src={item.img} className="w-full h-full rounded-full object-cover" alt="History Item" />
                    </div>
                    <p className="text-[11px] font-black uppercase truncate tracking-tight">{item.name[lang]}</p>
                    {item.inStock ? <p className="text-orange-500 font-black text-base mt-2">₹{item.price}</p> : <p className="text-red-500 text-[10px] font-black mt-2">SOLD OUT</p>}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </section>

      {/* DYNAMIC MENU CORE */}
      <main className="mt-28 px-5 max-w-7xl mx-auto space-y-40 pb-96">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((categoryName) => {
          const catItems = filteredItems.filter(i => i.category === categoryName);
          if (catItems.length === 0) return null;

          return (
            <div key={categoryName} ref={el => scrollRefs.current[categoryName] = el} className="space-y-20 scroll-mt-60">
              <div className="flex justify-between items-center border-b-8 border-orange-600/10 pb-10 px-4">
                <h2 className="text-8xl font-black italic uppercase tracking-tighter text-orange-600 underline decoration-white/5 underline-offset-[25px] leading-none drop-shadow-2xl">{categoryName}</h2>
                <div className="text-right">
                    <p className="text-[12px] font-black opacity-30 uppercase tracking-[0.8em] italic leading-none mb-3">Category</p>
                    <div className="bg-orange-600/10 px-4 py-1.5 rounded-full"><p className="text-[14px] font-black text-orange-500 uppercase italic tracking-widest">Premium Choice</p></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {catItems.map((product, pIdx) => (
                  <motion.div 
                      initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{delay: pIdx*0.06}}
                      key={product.id} 
                      className={`${isDark ? 'bg-zinc-900/60 border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)]' : 'bg-white border-orange-50 shadow-[0_40px_80px_rgba(234,88,12,0.1)]'} rounded-[5rem] p-8 border relative group overflow-hidden transition-all duration-700 ${!product.inStock ? 'grayscale opacity-30 scale-95' : ''}`}
                  >
                    {/* STOCK OVERLAY SYSTEM */}
                    {isAdmin && (
                        <button onClick={() => toggleItemStock(product.id)} className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white border-4 border-dashed border-orange-600/40 rounded-[5rem]">
                            <span className="text-5xl mb-4">{product.inStock ? '✅' : '❌'}</span>
                            <span className="text-sm font-black uppercase tracking-widest">{product.inStock ? 'In Stock' : 'Mark In Stock'}</span>
                        </button>
                    )}

                    {product.tag && product.inStock && <div className="absolute top-10 left-10 z-30 bg-orange-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black italic shadow-2xl uppercase border border-white/20 tracking-tighter rotate-[-5deg] group-hover:rotate-0 transition-transform">{product.tag}</div>}

                    <div className="relative rounded-[4rem] overflow-hidden mb-12 h-64 bg-zinc-800 shadow-[0_35px_70px_rgba(0,0,0,0.6)] group-hover:shadow-none transition-all border border-white/5">
                      <img src={product.img} className="w-full h-full object-cover group-hover:scale-125 duration-[2000ms] opacity-95 transition-all" alt="Product" />
                      <div className="absolute bottom-8 left-8 bg-orange-600/90 backdrop-blur-md px-6 py-2.5 rounded-3xl text-[11px] font-black text-white shadow-2xl border border-white/20 italic tracking-tighter">Est. {prepTime}m</div>
                      <div className="absolute top-8 right-8 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl text-[12px] font-black text-yellow-400 border border-white/10 shadow-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-500">⭐ {product.rating}</div>
                    </div>

                    <div className="text-center px-4">
                      <h3 className="text-xl font-black uppercase mb-4 h-16 flex items-center justify-center leading-none tracking-tighter italic text-orange-50 group-hover:text-orange-600 transition-colors">{product.name[lang]}</h3>
                      <div className="flex flex-col items-center mb-12">
                          <p className="text-orange-500 font-black text-6xl tracking-tighter italic drop-shadow-[0_10px_10px_rgba(234,88,12,0.2)] leading-none">₹{product.price}</p>
                          <p className="text-[10px] uppercase font-black opacity-20 tracking-[0.5em] mt-3">Final Value</p>
                      </div>
                      
                      <button 
                        disabled={!isKitchenOpen || !product.inStock}
                        onClick={() => { hapticEffect(); setShowCustomizer(product); }} 
                        className={`w-full py-8 rounded-[3.5rem] text-[15px] font-black uppercase tracking-widest active:scale-95 transition-all leading-none italic border-t-2 border-white/10 shadow-2xl ${isKitchenOpen && product.inStock ? 'bg-orange-600 shadow-orange-600/40 text-white' : 'bg-zinc-800 text-gray-500 border-none'}`}
                      >
                        {!product.inStock ? 'SOLDOUT' : isKitchenOpen ? 'Add To Cart' : 'SHOP CLOSED'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* FLOAT ACTION HUB (OPTIMIZED FOR ALL SCREENS) */}
      <AnimatePresence>
        {totalBillAmount > 0 && !orderStatus && (
          <motion.div initial={{ y: 300, scale:0.8 }} animate={{ y: 0, scale:1 }} exit={{ y: 300 }} className="fixed bottom-14 left-4 right-4 z-[1000] flex justify-center px-4">
            <button onClick={() => { hapticEffect(); setShowCheckout(true); }} className={`w-full max-w-2xl p-10 rounded-[5rem] shadow-[0_70px_150px_rgba(234,88,12,1)] flex justify-between items-center text-black ring-[16px] ring-orange-600/10 active:scale-95 transition-all overflow-hidden border-4 border-orange-600/20 ${isDark ? 'bg-white' : 'bg-zinc-950 text-white shadow-black'}`}>
               <div className="flex items-center gap-10 italic ml-6 text-left">
                  <motion.div animate={{y:[0, -15, 0]}} transition={{repeat:Infinity, duration:2}} className="bg-orange-600 h-24 w-24 rounded-[3rem] flex items-center justify-center text-6xl shadow-2xl text-white italic border-4 border-white/10">🛍️</motion.div>
                  <div>
                    <p className="text-[14px] font-black uppercase opacity-40 mb-2 tracking-[0.4em] italic leading-none">The Final Amount</p>
                    <p className={`text-8xl font-black tracking-tighter font-serif underline decoration-orange-600/30 leading-none ${isDark ? 'text-black' : 'text-white'}`}>₹{totalBillAmount}</p>
                  </div>
               </div>
               <div className={`px-20 py-8 rounded-[3.5rem] font-black text-[14px] uppercase shadow-2xl tracking-[0.5em] italic mr-2 transition-all duration-500 hover:scale-110 active:rotate-1 ${isDark ? 'bg-zinc-950 text-white shadow-black' : 'bg-orange-600 text-white'}`}>Proceed →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREPARATION PROGRESS VORTEX */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black z-[5000] flex flex-col items-center justify-center p-20 backdrop-blur-3xl overflow-hidden text-center">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')] animate-pulse"></div>
             <motion.div animate={{ scale:[1, 1.5, 1], rotate:[0, 25, -25, 0] }} transition={{repeat:Infinity, duration:2.5}} className="text-[25rem] mb-24 drop-shadow-[0_0_150px_rgba(234,88,12,0.9)] z-20">🥘</motion.div>
             <h2 className="text-9xl font-black italic uppercase tracking-tighter mb-12 text-orange-600 underline decoration-white/10 underline-offset-[40px] decoration-[18px] z-20">COOKING!</h2>
             <p className="text-2xl text-gray-500 mb-32 uppercase tracking-[0.9em] font-black max-w-3xl leading-loose italic opacity-60 z-20">The Master Chef is currently crafting Malout's most prestigious veg cuisine specifically for you...</p>
             <div className="w-[45rem] h-6 bg-zinc-950 rounded-full overflow-hidden border-4 border-white/10 relative mb-24 shadow-[0_0_100px_rgba(0,0,0,1)] ring-[20px] ring-orange-600/5 z-20">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_120px_rgba(234,88,12,1)] rounded-full"></motion.div>
             </div>
             <div className="flex items-center gap-6 opacity-30 z-20">
                 <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-[18px] font-black uppercase tracking-[1.5em] text-orange-600 animate-pulse italic">SYNCING SECURE ORDER CHANNEL...</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL CHECKOUT & RECEIPT ENGINE */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-[60px] z-[2000] flex items-end justify-center p-10">
             <motion.div initial={{y:800}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950' : 'bg-white shadow-[0_-50px_100px_rgba(0,0,0,0.5)]'} w-full rounded-[8rem] p-24 max-w-4xl overflow-y-auto max-h-[96vh] border-t-8 border-orange-600/30 relative`}>
                <button onClick={() => setShowCheckout(false)} className="absolute top-16 right-16 bg-red-600/10 text-red-500 w-16 h-16 rounded-full font-black text-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">✕</button>
                <h2 className="text-6xl font-black uppercase italic mb-20 text-orange-600 tracking-tighter underline decoration-white/10 underline-offset-[30px] decoration-[10px]">Your Bill Summary</h2>
                
                {/* RECEIPT LOOK */}
                <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fdfbf7] border-orange-100'} p-12 rounded-[5rem] mb-20 border-4 border-dashed shadow-inner`}>
                   <div className="space-y-10">
                      {cart.map((cItem, cIdx) => (
                        <div key={cIdx} className="flex justify-between items-center border-b-2 border-orange-600/10 pb-8">
                           <div>
                             <p className="text-xl font-black uppercase tracking-tighter leading-none italic">{cItem.name[lang]}</p>
                             <p className="text-[12px] text-gray-500 uppercase font-black tracking-[0.4em] mt-3">Style: {cItem.spice} Spice</p>
                           </div>
                           <p className="text-orange-500 font-black text-3xl tracking-tighter">₹{cItem.price}</p>
                        </div>
                      ))}
                      {addonsData.map(ad => addons[ad.id] > 0 && (
                        <div key={ad.id} className="flex justify-between items-center border-b-2 border-orange-600/10 pb-8">
                           <p className="text-xl font-black uppercase tracking-tighter italic opacity-50">{ad.name[lang]} (x{addons[ad.id]})</p>
                           <p className="text-orange-500 font-black text-3xl tracking-tighter">₹{ad.price * addons[ad.id]}</p>
                        </div>
                      ))}
                   </div>
                </div>

                {/* ADDONS SELECTION BIG */}
                <div className="mb-24 overflow-x-auto flex gap-12 no-scrollbar pb-10 px-6">
                   {addonsData.map(addBtn => (
                     <div key={addBtn.id} className={`${isDark ? 'bg-white/5 border-white/5 shadow-[0_40px_60px_rgba(0,0,0,0.5)]' : 'bg-gray-50 border-orange-50'} min-w-[280px] p-16 rounded-[6rem] border-2 text-center shadow-2xl relative overflow-hidden group`}>
                        <p className="text-[20px] font-black mb-4 italic uppercase tracking-tighter">{addBtn.name[lang]}</p>
                        <p className="text-orange-600 font-black text-2xl mb-16 italic tracking-[0.5em]">₹{addBtn.price}</p>
                        <div className={`flex justify-between items-center ${isDark ? 'bg-black/90 shadow-[0_0_40px_rgba(0,0,0,1)]' : 'bg-white shadow-inner'} rounded-[4rem] p-5 border-4 border-white/5`}>
                          <button onClick={() => { hapticEffect(); setAddons({...addons, [addBtn.id]: Math.max(0, (addons[addBtn.id] || 0) - 1)}); }} className="w-20 h-20 text-orange-600 font-black text-7xl hover:scale-125 transition-all">-</button>
                          <span className="text-[36px] font-black text-white">{addons[addBtn.id] || 0}</span>
                          <button onClick={() => { hapticEffect(); setAddons({...addons, [addBtn.id]: (addons[addBtn.id] || 0) + 1}); }} className="w-20 h-20 text-orange-600 font-black text-7xl hover:scale-125 transition-all">+</button>
                        </div>
                     </div>
                   ))}
                </div>

                {/* FINAL TOTAL & PAY SYSTEM */}
                <div className="flex justify-between items-end mb-32 px-10 italic font-black">
                   <div className="space-y-8">
                     <p className="text-[18px] font-black text-gray-500 uppercase tracking-[1em] mb-12 leading-none opacity-40 italic">Final Payable Value</p>
                     <p className="text-[16rem] font-black text-orange-600 tracking-tighter leading-none drop-shadow-[0_40px_80px_rgba(234,88,12,0.6)]">₹{totalBillAmount}</p>
                   </div>
                </div>

                <div className="space-y-12 pb-32">
                   <button onClick={() => executeOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-14 rounded-[5.5rem] font-black uppercase shadow-[0_40px_100px_rgba(26,115,232,0.5)] tracking-[1em] text-lg italic leading-none flex items-center justify-center gap-12 active:scale-95 transition-all border-4 border-white/10 group"><span className="text-6xl group-hover:scale-150 transition-all">💳</span> Instant UPI Payment</button>
                   <button onClick={() => executeOrder('WA')} className="w-full bg-[#25D366] text-white py-14 rounded-[5.5rem] font-black uppercase shadow-[0_40px_100px_rgba(37,211,102,0.5)] tracking-[1em] text-lg italic leading-none flex items-center justify-center gap-12 active:scale-95 transition-all border-4 border-white/10 group"><span className="text-6xl group-hover:scale-150 transition-all">📱</span> WhatsApp Confirmation</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER: THE LEGACY OF AASHRAY NARANG */}
      <footer className={`mt-60 px-8 py-60 ${isDark ? 'bg-zinc-950 border-t-8 border-white/5 shadow-inner' : 'bg-[#fdfbf7] border-t-8 border-orange-50'} text-center overflow-hidden relative shadow-[0_-100px_300px_rgba(0,0,0,0.8)]`}>
        <motion.div animate={{x:[-800, 800]}} transition={{repeat:Infinity, duration:45, ease:"linear"}} className="absolute top-36 left-0 text-[25rem] font-black opacity-[0.003] whitespace-nowrap italic pointer-events-none uppercase tracking-[1em]">THE FLAVOURS TOWN PREMIUM 2026 MALOUT</motion.div>
        
        <p className="text-[18px] font-black uppercase tracking-[1.5em] text-gray-700 mb-40 opacity-20 italic underline decoration-orange-600/30 underline-offset-[30px] leading-none">Engineering Digital Cuisines Since 2026</p>
        
        <h2 className="text-[10rem] font-black italic tracking-tighter uppercase mb-48 relative inline-block leading-none z-10 transition-all hover:scale-105 duration-[2000ms] cursor-help">
          <span className={isDark ? 'text-white' : 'text-gray-900'}>DEVELOPED BY </span> 
          <span className="text-orange-600 underline decoration-zinc-800 underline-offset-[50px] decoration-[25px] italic drop-shadow-[0_0_100px_rgba(234,88,12,0.8)]">AASHRAY NARANG</span>
        </h2>

        <div className="flex justify-center gap-32 mb-60 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-[1500ms] z-20 relative scale-125">
          <a href="https://github.com/Object2005" target="_blank" className="hover:scale-150 active:scale-90 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className={`w-28 h-28 ${isDark ? 'invert' : ''}`} alt="GitHub" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:scale-150 active:scale-90 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-28 h-28" alt="LinkedIn" /></a>
          <a href="mailto:aashraynarang@gmail.com" className="hover:scale-150 active:scale-90 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-28 h-28" alt="Gmail" /></a>
        </div>
        
        <div className="z-20 relative space-y-8 opacity-10">
            <p className="text-[20px] text-gray-700 font-bold uppercase tracking-[2.5em] italic leading-none">MALOUT ● PUNJAB ● INDIA</p>
            <p className="text-[14px] text-gray-700 font-black uppercase tracking-[1em]">OFFICIAL DIGITAL BUSINESS PORTAL ● © 2026</p>
        </div>
      </footer>

      {/* ITEM CUSTOMIZER (REDUX) */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 backdrop-blur-[100px] z-[3000] flex items-end justify-center p-6">
            <motion.div initial={{y:1000, rotate:10}} animate={{y:0, rotate:0}} className={`${isDark ? 'bg-zinc-950' : 'bg-white shadow-[0_-100px_200px_rgba(0,0,0,0.8)]'} w-full rounded-[8rem] p-24 max-w-2xl border-t-[20px] border-orange-600/50 relative`}>
              <button onClick={() => setShowCustomizer(null)} className="absolute top-16 right-16 text-gray-500 font-black text-4xl">✕</button>
              <h2 className="text-[120px] font-black italic uppercase text-orange-600 mb-10 tracking-tighter leading-[0.8] underline decoration-white/5 underline-offset-[20px]">{showCustomizer.name[lang]}</h2>
              <p className="text-xl font-black opacity-20 mb-20 tracking-[1em] uppercase italic leading-none">Flavor Profile Calibration</p>
              
              <div className="space-y-24 mb-32">
                <div className="flex gap-8">
                  {['Low', 'Medium', 'High'].map(spiceLevel => (
                    <button 
                      key={spiceLevel} 
                      onClick={() => { hapticEffect(); setCustomOptions({spice: spiceLevel}); }} 
                      className={`flex-1 py-14 rounded-[5rem] text-[20px] font-black border-[10px] transition-all shadow-2xl ${customOptions.spice === spiceLevel ? 'bg-orange-600 border-orange-600 text-white scale-110 shadow-orange-600/40' : 'border-zinc-800 text-gray-600 opacity-30 hover:opacity-100 hover:border-orange-600/20'}`}
                    >{spiceLevel}</button>
                  ))}
                </div>
                <div className="bg-orange-600/5 p-12 rounded-[5rem] border-4 border-orange-600/20 flex items-center gap-12 italic shadow-inner">
                   <motion.span animate={{scale:[1, 1.4, 1]}} transition={{repeat:Infinity, duration:2}} className="text-8xl drop-shadow-[0_0_30px_rgba(234,88,12,0.5)]">💡</motion.span>
                   <p className="text-sm font-black leading-loose text-orange-500 uppercase italic tracking-widest opacity-80">Elite Recommendation: Pair this legendary flavor with extra Butter Nan for the ultimate Malout experience.</p>
                </div>
              </div>

              <button onClick={() => { hapticEffect(); setCart([...cart, {...showCustomizer, ...customOptions}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-14 rounded-[5rem] font-black uppercase shadow-[0_50px_100px_rgba(234,88,12,0.7)] text-3xl active:scale-95 transition-all mb-12 italic tracking-widest leading-none border-t-8 border-white/20">Finalize & Add Item</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}