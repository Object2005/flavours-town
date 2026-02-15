import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- FULL 19 ITEMS DATA ---
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
  const [orderStatus, setOrderStatus] = useState(null);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customOptions, setCustomOptions] = useState({ spice: 'Medium' });
  const [sessionOrderId, setSessionOrderId] = useState('');

  const scrollRefs = useRef({});

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_zomato_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));

    const savedKitchen = localStorage.getItem('ft_zomato_kitchen');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    const savedPrep = localStorage.getItem('ft_zomato_prep');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
  }, []);

  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_zomato_menu', JSON.stringify(menu));
    localStorage.setItem('ft_zomato_kitchen', JSON.stringify(isKitchenOpen));
    localStorage.setItem('ft_zomato_prep', prepTime.toString());
  }, [menu, isKitchenOpen, prepTime]);

  useEffect(() => {
    let interval;
    if (orderStatus === 'Preparing') {
      interval = setInterval(() => { setCookingProgress(p => (p >= 100 ? 100 : p + 1.2)); }, 50);
    } else setCookingProgress(0);
    return () => clearInterval(interval);
  }, [orderStatus]);

  const filteredItems = useMemo(() => menu.filter(i => 
    i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.pu.includes(searchQuery)
  ), [searchQuery, menu]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0) + 
                   addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  const processOrder = (method) => {
    if (!isKitchenOpen && !isAdmin) return;
    haptic();
    setOrderStatus('Preparing');
    const itemsStr = cart.map(i => `• ${i.name[lang]} (${i.spice})`).join('\n');
    const adsStr = addonsData.filter(a => addons[a.id]).map(a => `• ${a.name[lang]} x ${addons[a.id]}`).join('\n');
    const msg = `*NEW ORDER - ${sessionOrderId}*\n\n*Items:*\n${itemsStr}\n\n${adsStr ? `*Addons:*\n${adsStr}\n` : ''}*Total:* ₹${subtotal}\n*Wait:* ${prepTime}m\n📍 Malout, Punjab`;

    setTimeout(() => {
      setOrderStatus(null);
      if (method === 'WA') window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(msg)}`);
      else window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${subtotal}&cu=INR`);
      setCart([]); setAddons({}); setShowCheckout(false);
    }, 4000);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f4f4f6] text-black'} min-h-screen pb-44 transition-all duration-500 font-sans selection:bg-orange-500/20 overflow-x-hidden`}>
      <Head>
        <title>98774-74778 | The Flavour's Town</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* COMPACT ZOMATO HEADER */}
      <header className={`fixed top-0 w-full z-[1000] px-4 py-4 backdrop-blur-3xl ${isDark ? 'bg-black/90 border-white/5 shadow-2xl' : 'bg-white shadow-lg'} border-b flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <motion.div whileTap={{scale:0.9}} className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg text-lg">FT</motion.div>
          <div className="flex flex-col leading-none">
            <h1 className="text-[14px] font-black uppercase tracking-tight">The Flavour's Town</h1>
            <span className="text-[10px] font-bold text-orange-500 animate-pulse drop-shadow-[0_0_8px_orange] tracking-widest mt-0.5">98774-74778</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => { haptic(); setIsDark(!isDark); }} className={`p-2.5 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => { haptic(); setLang(lang==='pu'?'en':'pu'); }} className="text-[10px] font-black bg-orange-600 text-white px-4 py-2.5 rounded-xl shadow-lg">{lang === 'pu' ? 'EN' : 'ਪੰ'}</button>
          <button onClick={() => { const p = prompt("Admin:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} className="w-9 h-9 rounded-xl bg-[#fdfbf7] border border-orange-200 flex items-center justify-center text-orange-600 shadow-md font-black text-xl">⚙️</button>
        </div>
      </header>

      {/* STICKY BLINKIT STYLE CATEGORY PILLS */}
      <nav className={`fixed top-[74px] w-full z-[900] py-3 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-2.5 px-4 border-b ${isDark ? 'bg-black/80' : 'bg-white/90 shadow-md'}`}>
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button key={cat} onClick={() => { haptic(); scrollRefs.current[cat]?.scrollIntoView({behavior:'smooth', block:'start'}); }} className={`px-5 py-2 rounded-full text-[11px] font-black uppercase whitespace-nowrap transition-all border ${isDark ? 'bg-orange-600/10 text-orange-400 border-orange-600/20' : 'bg-white text-orange-600 border-orange-100 shadow-sm hover:bg-orange-50'}`}>#{cat}</button>
        ))}
      </nav>

      {/* CLEAN SEARCH SECTION */}
      <section className="pt-36 px-4 max-w-xl mx-auto">
        <div className={`flex items-center px-6 py-4 rounded-2xl border-2 transition-all shadow-2xl ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-orange-100'}`}>
           <span className="mr-3 opacity-20 text-xl">🔍</span>
           <input type="text" placeholder={lang === 'pu' ? "ਖਾਣੇ ਵਿੱਚ ਕੀ ਲੱਭ ਰਹੇ ਹੋ?..." : "Search malai chaap, paneer tikka..."} className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase" onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </section>

      {/* MODERN 2-COLUMN GRID (ZOMATO STYLE) */}
      <main className="mt-10 px-4 max-w-7xl mx-auto space-y-16 pb-48">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((catName) => {
          const items = filteredItems.filter(i => i.category === catName);
          if (items.length === 0) return null;
          return (
            <div key={catName} ref={el => scrollRefs.current[catName] = el} className="space-y-6 scroll-mt-44">
              <div className="flex justify-between items-center px-2">
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter text-orange-600">{catName}</h2>
                 <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest italic">Best in Malout</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-8">
                {items.map((p) => (
                  <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} key={p.id} className={`${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-orange-50 shadow-xl'} rounded-[2.5rem] p-3 border relative group overflow-hidden transition-all ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                    
                    {/* ADMIN ACTION OVERLAY */}
                    {isAdmin && (
                        <button onClick={() => setMenu(prev => prev.map(m => m.id === p.id ? {...m, inStock: !m.inStock} : m))} className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white border-2 border-dashed border-orange-600 rounded-[2.5rem]">
                            <span className="text-3xl mb-1">{p.inStock ? '✅' : '❌'}</span>
                            <span className="text-[9px] font-black uppercase">Stock {p.inStock ? 'IN' : 'OUT'}</span>
                        </button>
                    )}

                    <div className="relative rounded-3xl overflow-hidden mb-3.5 h-36 bg-zinc-800 shadow-lg border border-white/5">
                      <img src={p.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                      {p.isBest && <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-0.5 rounded-lg text-[7px] font-black italic shadow-lg">FAVOURITE</div>}
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black text-white border border-white/10 shadow-lg">⭐ {p.rating}</div>
                    </div>

                    <div className="text-center">
                      <h3 className={`text-[12px] font-black uppercase mb-1 h-10 flex items-center justify-center leading-none tracking-tighter italic ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.name[lang]}</h3>
                      <div className="flex items-center justify-between mt-2 bg-orange-600/5 p-1 rounded-2xl border border-orange-600/10">
                        <p className="text-orange-500 font-black text-xl ml-2">₹{p.price}</p>
                        <button 
                            disabled={!isKitchenOpen || !p.inStock}
                            onClick={() => { haptic(); setShowCustomizer(p); }} 
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all shadow-lg ${isKitchenOpen && p.inStock ? 'bg-orange-600 text-white shadow-orange-600/30' : 'bg-zinc-800 text-gray-500'}`}
                        >
                            ADD +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* PROFESSIONAL BLINKIT STYLE BOTTOM BAR */}
      <AnimatePresence>
        {subtotal > 0 && !orderStatus && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-0 right-0 z-[1000] px-5">
            <button onClick={() => { haptic(); setShowCheckout(true); }} className={`w-full max-w-md mx-auto p-4 rounded-2xl shadow-[0_20px_60px_rgba(234,88,12,0.8)] flex justify-between items-center ring-4 ring-orange-600/10 active:scale-95 transition-all border border-orange-600/20 ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
               <div className="flex items-center gap-4 ml-2">
                  <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-lg text-white font-black">🛒</div>
                  <div className="text-left leading-none">
                    <p className={`text-[9px] font-black uppercase opacity-40 mb-1`}>{cart.length} Items Selected</p>
                    <p className="text-2xl font-black tracking-tighter">₹{subtotal}</p>
                  </div>
               </div>
               <div className={`px-10 py-3.5 rounded-xl font-black text-[11px] uppercase shadow-lg italic transition-all ${isDark ? 'bg-gray-900 text-white shadow-black' : 'bg-orange-600 text-white'}`}>Review Bill →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER: CLEAN DEVELOPER BRANDING */}
      <footer className={`mt-24 px-6 py-20 ${isDark ? 'bg-zinc-950 border-t border-white/5' : 'bg-white border-t border-orange-50'} text-center shadow-2xl`}>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 mb-8 opacity-40 italic leading-none underline decoration-orange-600/20 underline-offset-8">Experience Engineered By</p>
        <h2 className="text-3xl font-black italic uppercase mb-10 transition-all hover:scale-110 duration-700">
          <span className={isDark ? 'text-white' : 'text-black'}>developed by </span> 
          <span className="text-orange-600 italic tracking-tighter">aashray narang</span>
        </h2>
        <div className="flex justify-center gap-10 mb-12 opacity-40 hover:opacity-100 transition-all">
          <a href="https://github.com/Object2005" target="_blank" className="hover:scale-125 transition-all hover:drop-shadow-[0_0_8px_orange]"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className={`w-8 h-8 ${isDark ? 'invert' : ''}`} alt="GitHub" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:scale-125 transition-all hover:drop-shadow-[0_0_8px_orange]"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-8 h-8" alt="LinkedIn" /></a>
          <a href="mailto:aashraynarang@gmail.com" className="hover:scale-125 transition-all hover:drop-shadow-[0_0_8px_orange]"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-8 h-8" alt="Gmail" /></a>
        </div>
        <div className="opacity-10 font-black">
            <p className="text-[10px] text-gray-700 uppercase tracking-[1em] italic leading-none">MALOUT ● 2026</p>
        </div>
      </footer>

      {/* ITEM CUSTOMIZER */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[3000] flex items-end justify-center p-4">
            <motion.div initial={{y:500}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950 border-t border-white/10' : 'bg-white shadow-2xl'} w-full rounded-[3.5rem] p-10 max-w-xl`}>
              <div className="w-16 h-1.5 bg-zinc-800 rounded-full mx-auto mb-10 opacity-30"></div>
              <h2 className="text-4xl font-black italic uppercase text-orange-600 mb-2 tracking-tighter leading-none">{showCustomizer.name[lang]}</h2>
              <p className="text-[11px] font-black opacity-30 mb-10 uppercase tracking-widest italic underline decoration-orange-600/40">Personalize Your Taste Profile</p>
              <div className="flex gap-3 mb-10">
                {['Low', 'Medium', 'High'].map(lv => (
                  <button key={lv} onClick={() => { haptic(); setCustomOptions({spice: lv}); }} className={`flex-1 py-5 rounded-2xl text-[12px] font-black border-4 transition-all ${customOptions.spice === lv ? 'bg-orange-600 border-orange-600 text-white shadow-xl scale-105 shadow-orange-600/40' : 'border-zinc-800 text-gray-600 opacity-40'}`}>{lv}</button>
                ))}
              </div>
              <button onClick={() => { haptic(); setCart([...cart, {...showCustomizer, ...customOptions}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-6 rounded-[2rem] font-black uppercase shadow-2xl text-xs active:scale-95 transition-all mb-4 italic tracking-widest shadow-orange-600/40">Confirm Item →</button>
              <button onClick={() => setShowCustomizer(null)} className="w-full text-center text-[10px] font-black uppercase text-gray-500 tracking-widest italic mt-4 opacity-40 hover:opacity-100 transition-all underline">Discard</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT SUMMARY */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[2000] flex items-end justify-center p-5">
             <motion.div initial={{y:800}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950 border-t border-white/10' : 'bg-white shadow-2xl'} w-full rounded-[4.5rem] p-10 max-w-2xl overflow-y-auto max-h-[92vh] border-t-4 border-orange-600/20 relative`}>
                <button onClick={() => setShowCheckout(false)} className="absolute top-10 right-10 bg-red-600/10 text-red-500 w-12 h-12 rounded-full font-black text-sm flex items-center justify-center">✕</button>
                <h2 className="text-4xl font-black uppercase italic mb-10 text-orange-600 tracking-tighter underline decoration-white/10 underline-offset-8 decoration-4">Bill Receipt</h2>
                <div className={`${isDark ? 'bg-white/5 border-white/5' : 'bg-[#fdfbf7] border-orange-100'} p-8 rounded-[3.5rem] mb-10 border-4 border-dashed shadow-inner`}>
                   <div className="space-y-8 font-black transition-all">
                      {cart.map((c, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-orange-600/5 pb-5">
                           <div className="text-left leading-none">
                             <p className={`text-[15px] uppercase tracking-tighter italic ${isDark ? 'text-white' : 'text-gray-900'}`}>{c.name[lang]}</p>
                             <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mt-2">{c.spice} Style</p>
                           </div>
                           <p className="text-orange-500 font-black text-2xl tracking-tighter">₹{c.price}</p>
                        </div>
                      ))}
                      {addonsData.map(ad => addons[ad.id] > 0 && (
                        <div key={ad.id} className="flex justify-between items-center border-b border-orange-600/5 pb-5 opacity-60">
                           <p className={`text-[15px] uppercase tracking-tighter italic ${isDark ? 'text-white' : 'text-gray-900'}`}>{ad.name[lang]} (x{addons[ad.id]})</p>
                           <p className="text-orange-500 font-black text-2xl tracking-tighter">₹{ad.price * addons[ad.id]}</p>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="mb-12 overflow-x-auto flex gap-6 no-scrollbar pb-4 px-4">
                   {addonsData.map(a => (
                     <div key={a.id} className={`${isDark ? 'bg-white/5 border-white/5 shadow-black' : 'bg-gray-50 border-orange-50'} min-w-[200px] p-8 rounded-[4rem] border-2 text-center shadow-2xl relative overflow-hidden group`}>
                        <p className="text-[14px] font-black mb-2 italic uppercase tracking-tighter text-orange-600">{a.name[lang]}</p>
                        <p className={`text-lg font-black mb-8 italic tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{a.price}</p>
                        <div className={`flex justify-between items-center ${isDark ? 'bg-black/90' : 'bg-white shadow-inner'} rounded-[3rem] p-3 border-2 border-white/5`}>
                          <button onClick={() => { haptic(); setAddons({...addons, [a.id]: Math.max(0, (addons[a.id] || 0) - 1)}); }} className="w-10 h-10 text-orange-600 font-black text-5xl">-</button>
                          <span className={`text-[20px] font-black ${isDark ? 'text-white' : 'text-black'}`}>{addons[a.id] || 0}</span>
                          <button onClick={() => { haptic(); setAddons({...addons, [a.id]: (addons[a.id] || 0) + 1}); }} className="w-10 h-10 text-orange-600 font-black text-5xl transition-all active:scale-125">+</button>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="flex justify-between items-end mb-16 px-6 italic font-black">
                   <div className="space-y-4 leading-none">
                     <p className="text-[15px] font-black text-gray-500 uppercase tracking-[0.5em] mb-4 opacity-40">Final Total</p>
                     <p className="text-[11rem] font-black text-orange-600 tracking-tighter drop-shadow-xl shadow-orange-600/10">₹{subtotal}</p>
                   </div>
                   <button onClick={() => setShowCheckout(false)} className="text-[12px] font-black text-red-500 uppercase underline decoration-gray-400 italic tracking-widest hover:text-red-400 transition-all mb-8">Modify Bill</button>
                </div>
                <div className="space-y-6 pb-20">
                   <button onClick={() => processOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-10 rounded-[3.5rem] font-black uppercase shadow-[0_20px_50px_rgba(26,115,232,0.4)] tracking-[0.6em] text-xs italic active:scale-95 transition-all border-4 border-white/10 group"><span className="text-3xl group-hover:scale-150 transition-all leading-none">💳</span> Instant UPI Payment</button>
                   <button onClick={() => processOrder('WA')} className="w-full bg-[#25D366] text-white py-10 rounded-[3.5rem] font-black uppercase shadow-[0_20px_50px_rgba(37,211,102,0.4)] tracking-[0.6em] text-xs italic active:scale-95 transition-all border-4 border-white/10 group"><span className="text-3xl group-hover:scale-150 transition-all leading-none">📱</span> WhatsApp Confirmation</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREPARATION OVERLAY (BLINKIT STYLE) */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 z-[5000] flex flex-col items-center justify-center p-14 backdrop-blur-3xl overflow-hidden text-center">
             <motion.div animate={{ scale:[1, 1.2, 1], rotate:[0, 20, -20, 0] }} transition={{repeat:Infinity, duration:2.2}} className="text-[14rem] mb-12 drop-shadow-[0_0_100px_rgba(234,88,12,0.8)]">🥘</motion.div>
             <h2 className="text-7xl font-black italic uppercase tracking-tighter mb-8 text-orange-600 underline decoration-white/10 underline-offset-[25px] decoration-[10px]">Cooking!</h2>
             <p className="text-base text-gray-500 mb-20 uppercase tracking-[0.8em] font-black max-w-xl leading-loose italic opacity-60">Master Chef is currently crafts your special meal...</p>
             <div className="w-[30rem] h-4 bg-zinc-900 rounded-full overflow-hidden border-2 border-white/20 relative shadow-[0_0_60px_rgba(0,0,0,1)] ring-[10px] ring-orange-600/5">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_100px_rgba(234,88,12,1)] rounded-full"></motion.div>
             </div>
             <p className="text-[14px] font-black uppercase tracking-[1.5em] text-orange-600 animate-pulse italic mt-14 shadow-orange-600/10">SYNCING DIGITAL RECEIPT...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}