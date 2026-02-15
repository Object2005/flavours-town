import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- ULTIMATE 19 ITEMS DATA ---
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
    const savedMenu = localStorage.getItem('ft_v9_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));

    const savedKitchen = localStorage.getItem('ft_v9_kitchen');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    const savedPrep = localStorage.getItem('ft_v9_prep');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
  }, []);

  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_v9_menu', JSON.stringify(menu));
    localStorage.setItem('ft_v9_kitchen', JSON.stringify(isKitchenOpen));
    localStorage.setItem('ft_v9_prep', prepTime.toString());
  }, [menu, isKitchenOpen, prepTime]);

  useEffect(() => {
    let interval;
    if (orderStatus === 'Preparing') {
      interval = setInterval(() => { setCookingProgress(p => (p >= 100 ? 100 : p + 1.5)); }, 50);
    } else setCookingProgress(0);
    return () => clearInterval(interval);
  }, [orderStatus]);

  const filteredItems = useMemo(() => menu.filter(i => 
    i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.name.pu.includes(searchQuery)
  ), [searchQuery, menu]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0) + 
                   addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  const processOrder = (method) => {
    if (!isKitchenOpen && !isAdmin) return;
    haptic();
    setOrderStatus('Preparing');
    const itemsStr = cart.map(i => `• ${i.name[lang]} (${i.spice})`).join('\n');
    const adsStr = addonsData.filter(a => addons[a.id]).map(a => `• ${a.name[lang]} x ${addons[a.id]}`).join('\n');
    const msg = `*THE FLAVOUR'S TOWN*\nOrder ID: ${sessionOrderId}\n\n*Items:*\n${itemsStr}\n\n${adsStr ? `*Addons:*\n${adsStr}\n` : ''}*Total:* ₹${subtotal}\n*Status:* Confirmed`;

    setTimeout(() => {
      setOrderStatus(null);
      if (method === 'WA') window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(msg)}`);
      else window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${subtotal}&cu=INR`);
      setCart([]); setAddons({}); setShowCheckout(false);
    }, 4000);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f7f7f9] text-black'} min-h-screen pb-44 transition-all duration-500 font-sans overflow-x-hidden selection:bg-orange-600/30`}>
      <Head>
        <title>98774-74778 | The Flavour's Town</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-[1000] px-4 py-4 backdrop-blur-3xl ${isDark ? 'bg-black/90 border-white/5 shadow-2xl' : 'bg-white shadow-lg'} border-b flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg text-lg">FT</div>
          <div className="flex flex-col leading-none">
            <h1 className="text-[13px] font-black uppercase tracking-tight italic">The Flavour's Town</h1>
            <span className="text-[10px] font-bold text-orange-500 animate-pulse drop-shadow-[0_0_8px_orange] tracking-widest mt-0.5">98774-74778</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => { haptic(); setIsDark(!isDark); }} className={`p-2.5 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => { haptic(); setLang(lang==='pu'?'en':'pu'); }} className="text-[10px] font-black bg-orange-600 text-white px-4 py-2.5 rounded-xl uppercase shadow-lg shadow-orange-600/20">{lang === 'pu' ? 'EN' : 'ਪੰ'}</button>
          <button onClick={() => { const p = prompt("Admin:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} className="w-9 h-9 rounded-xl bg-[#fdfbf7] border border-orange-200 flex items-center justify-center text-orange-600 shadow-md font-black text-xl">⚙️</button>
        </div>
      </header>

      {/* CATEGORY NAV */}
      <nav className={`fixed top-[74px] w-full z-[900] py-3 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-2.5 px-4 border-b ${isDark ? 'bg-black/80' : 'bg-white/90 shadow-md'}`}>
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button key={cat} onClick={() => { haptic(); scrollRefs.current[cat]?.scrollIntoView({behavior:'smooth', block:'start'}); }} className={`px-5 py-2 rounded-full text-[11px] font-black uppercase whitespace-nowrap transition-all border ${isDark ? 'bg-orange-600/10 text-orange-400 border-orange-600/20 shadow-inner shadow-orange-600/10' : 'bg-white text-orange-600 border-orange-100 shadow-sm'}`}>#{cat}</button>
        ))}
      </nav>

      {/* SEARCH */}
      <section className="pt-36 px-4 max-w-xl mx-auto">
        <div className={`flex items-center px-6 py-4 rounded-2xl border-2 transition-all shadow-2xl ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-orange-100'}`}>
           <span className="mr-3 opacity-30 text-xl font-black italic">🔍</span>
           <input type="text" placeholder={lang === 'pu' ? "ਤੁਸੀਂ ਅੱਜ ਕੀ ਖਾਣਾ ਪਸੰਦ ਕਰੋਗੇ?..." : "Search menu items..."} className={`bg-transparent border-none outline-none w-full text-sm font-bold uppercase ${isDark ? 'text-white' : 'text-black'}`} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </section>

      {/* MENU ENGINE */}
      <main className="mt-10 px-4 max-w-7xl mx-auto space-y-16 pb-48">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((catName) => {
          const items = filteredItems.filter(i => i.category === catName);
          if (items.length === 0) return null;
          return (
            <div key={catName} ref={el => scrollRefs.current[catName] = el} className="space-y-6 scroll-mt-44">
              <div className="flex justify-between items-center px-2">
                 <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>{catName}</h2>
                 <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-orange-600 italic leading-none">Fresh Malout Selection</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-8">
                {items.map((p) => (
                  <motion.div initial={{opacity:0, scale:0.95}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} key={p.id} className={`${isDark ? 'bg-zinc-900/80 border-white/10 shadow-2xl' : 'bg-white border-orange-100 shadow-lg'} rounded-[2.5rem] p-3 border relative group overflow-hidden transition-all ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                    {isAdmin && (
                        <button onClick={() => setMenu(prev => prev.map(m => m.id === p.id ? {...m, inStock: !m.inStock} : m))} className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white border-2 border-dashed border-orange-600 rounded-[2.5rem]">
                            <span className="text-3xl mb-1">{p.inStock ? '✅' : '❌'}</span>
                            <span className="text-[9px] font-black uppercase">Stock {p.inStock ? 'IN' : 'OUT'}</span>
                        </button>
                    )}
                    <div className="relative rounded-3xl overflow-hidden mb-3.5 h-36 bg-zinc-800 shadow-lg border border-white/5">
                      <img src={p.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                      {p.isBest && <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-0.5 rounded-lg text-[7px] font-black italic shadow-lg">FAVOURITE</div>}
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] font-black text-white border border-white/10">⭐ {p.rating}</div>
                    </div>
                    <div className="text-center px-1">
                      {/* HIGH CONTRAST NAME FIX */}
                      <h3 className={`text-[12px] font-black uppercase mb-1 h-10 flex items-center justify-center leading-none tracking-tighter italic ${isDark ? 'text-white' : 'text-black'}`}>{p.name[lang]}</h3>
                      <div className="flex items-center justify-between mt-2 bg-orange-600/5 p-1 rounded-2xl border border-orange-600/10">
                        <p className="text-orange-500 font-black text-xl ml-2 tracking-tighter italic">₹{p.price}</p>
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

      {/* BLINKIT STYLE VIEW CART BAR */}
      <AnimatePresence>
        {subtotal > 0 && !orderStatus && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-8 left-0 right-0 z-[1000] px-6">
            <button onClick={() => { haptic(); setShowCheckout(true); }} className={`w-full max-w-lg mx-auto p-4 rounded-3xl shadow-[0_30px_70px_rgba(234,88,12,0.6)] flex justify-between items-center ring-4 ring-orange-600/10 active:scale-95 transition-all border-2 border-orange-600/20 ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
               <div className="flex items-center gap-4 italic ml-3">
                  <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-lg text-white font-black">🛒</div>
                  <div className="text-left leading-none">
                    <p className={`text-[10px] font-black uppercase opacity-40 mb-1`}>{cart.length} Items Selected</p>
                    <p className="text-2xl font-black tracking-tighter">₹{subtotal}</p>
                  </div>
               </div>
               <div className={`px-8 py-3 rounded-2xl font-black text-[12px] uppercase shadow-2xl italic tracking-widest transition-all ${isDark ? 'bg-gray-900 text-white shadow-black' : 'bg-orange-600 text-white'}`}>Review Bill →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN MASTER CONSOLE */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div initial={{y:-300}} animate={{y:0}} exit={{y:-300}} className="fixed top-24 left-4 right-4 z-[1100] bg-[#fdfbf7] p-8 rounded-[4rem] shadow-[0_40px_120px_rgba(0,0,0,0.5)] text-gray-900 border-8 border-orange-100">
            <h3 className="text-2xl font-black uppercase italic text-orange-600 mb-8 border-b-4 border-orange-50 pb-4">Master Console</h3>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-7 rounded-[3.5rem] border border-orange-100 shadow-md">
                    <p className="text-[11px] font-black uppercase mb-4 opacity-40 text-center">Kitchen Power</p>
                    <button onClick={() => setIsKitchenOpen(!isKitchenOpen)} className={`w-full py-6 rounded-3xl font-black text-[12px] uppercase shadow-xl ${isKitchenOpen ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                        {isKitchenOpen ? 'Shut Down' : 'Start Shop'}
                    </button>
                </div>
                <div className="bg-white p-7 rounded-[3.5rem] border border-orange-100 shadow-md text-center">
                    <p className="text-[11px] font-black uppercase mb-4 opacity-40 text-center">Wait Duration</p>
                    <div className="flex items-center justify-between px-3">
                        <button onClick={()=>setPrepTime(p=>Math.max(5,p-5))} className="w-10 h-10 bg-orange-100 rounded-full font-black text-orange-600 text-2xl shadow-sm">-</button>
                        <span className="text-2xl font-black italic">{prepTime}m</span>
                        <button onClick={()=>setPrepTime(p=>p+5)} className="w-10 h-10 bg-orange-100 rounded-full font-black text-orange-600 text-2xl shadow-sm">+</button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL CHECKOUT & RECEIPT ENGINE (UI FIXED) */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[2000] flex items-end justify-center p-5">
             <motion.div initial={{y:800}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950 border-t border-white/10' : 'bg-white shadow-[0_-50px_100px_rgba(0,0,0,0.5)]'} w-full rounded-[4.5rem] p-10 max-w-2xl overflow-y-auto max-h-[92vh] border-t-8 border-orange-600/30 relative no-scrollbar`}>
                <button onClick={() => setShowCheckout(false)} className="absolute top-10 right-10 bg-red-600/10 text-red-500 w-12 h-12 rounded-full font-black text-sm flex items-center justify-center">✕</button>
                <h2 className="text-4xl font-black uppercase italic mb-8 text-orange-600 tracking-tighter">Your Bill</h2>
                
                {/* RECEIPT LOOK (FIXED SIZE) */}
                <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fdfbf7] border-orange-100'} p-6 rounded-[3rem] mb-8 border-4 border-dashed shadow-inner overflow-y-auto max-h-[300px] no-scrollbar`}>
                   <div className="space-y-6 font-black">
                      {cart.map((c, i) => (
                        <div key={i} className="flex justify-between items-start border-b border-orange-600/10 pb-4">
                           <div className="text-left max-w-[70%]">
                             <p className={`text-[14px] uppercase tracking-tighter italic ${isDark ? 'text-white' : 'text-black'} leading-tight`}>{c.name[lang]}</p>
                             <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mt-1.5">{c.spice} Style</p>
                           </div>
                           <p className="text-orange-500 font-black text-xl italic tracking-tighter">₹{c.price}</p>
                        </div>
                      ))}
                      {addonsData.map(ad => addons[ad.id] > 0 && (
                        <div key={ad.id} className="flex justify-between items-center border-b border-orange-600/10 pb-4 opacity-70">
                           <p className={`text-[13px] uppercase tracking-tighter italic ${isDark ? 'text-white' : 'text-black'}`}>{ad.name[lang]} (x{addons[ad.id]})</p>
                           <p className="text-orange-500 font-black text-xl italic tracking-tighter">₹{ad.price * addons[ad.id]}</p>
                        </div>
                      ))}
                   </div>
                </div>

                {/* ADDONS SELECTION (COMPACT) */}
                <div className="mb-8 overflow-x-auto flex gap-4 no-scrollbar pb-2 px-1">
                   {addonsData.map(a => (
                     <div key={a.id} className={`${isDark ? 'bg-white/5 border-white/10 shadow-black' : 'bg-gray-50 border-orange-50'} min-w-[170px] p-8 rounded-[4rem] border text-center shadow-xl relative`}>
                        <p className="text-[14px] font-black mb-1 italic uppercase tracking-tighter text-orange-600">{a.name[lang]}</p>
                        <p className={`text-base font-black mb-6 italic tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>₹{a.price}</p>
                        <div className={`flex justify-between items-center ${isDark ? 'bg-black/90' : 'bg-white shadow-inner shadow-gray-200'} rounded-[3rem] p-2.5 border-2 border-white/5`}>
                          <button onClick={() => { haptic(); setAddons({...addons, [a.id]: Math.max(0, (addons[a.id] || 0) - 1)}); }} className="w-10 h-10 text-orange-600 font-black text-4xl leading-none">-</button>
                          <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{addons[a.id] || 0}</span>
                          <button onClick={() => { haptic(); setAddons({...addons, [a.id]: (addons[a.id] || 0) + 1}); }} className="w-10 h-10 text-orange-600 font-black text-4xl leading-none">+</button>
                        </div>
                     </div>
                   ))}
                </div>

                {/* TOTAL SECTION (CLEANER) */}
                <div className="flex justify-between items-end mb-12 px-6 italic font-black">
                   <div className="space-y-4 leading-none">
                     <p className="text-[13px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4 opacity-40">Total Amount Due</p>
                     <p className="text-[110px] font-black text-orange-600 tracking-tighter leading-none shadow-orange-600/5">₹{subtotal}</p>
                   </div>
                   <button onClick={() => setShowCheckout(false)} className="text-[11px] font-black text-red-500 uppercase underline decoration-gray-400 italic tracking-widest mb-4">Back</button>
                </div>

                <div className="space-y-4 pb-12">
                   <button onClick={() => processOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-9 rounded-[3.5rem] font-black uppercase shadow-xl text-xs flex items-center justify-center gap-5 active:scale-95 transition-all italic border-4 border-white/10 shadow-blue-600/20">💳 UPI PAYMENT</button>
                   <button onClick={() => processOrder('WA')} className="w-full bg-[#25D366] text-white py-9 rounded-[3.5rem] font-black uppercase shadow-xl text-xs flex items-center justify-center gap-5 active:scale-95 transition-all border-4 border-white/10 shadow-green-600/20 italic">📱 CONFIRM WHATSAPP</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ITEM CUSTOMIZER */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 backdrop-blur-3xl z-[3000] flex items-end justify-center p-6">
            <motion.div initial={{y:1000}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950' : 'bg-white shadow-2xl'} w-full rounded-[6rem] p-16 max-w-2xl border-t-[10px] border-orange-600/30 relative`}>
              <button onClick={() => setShowCustomizer(null)} className="absolute top-14 right-14 text-gray-500 font-black text-4xl">✕</button>
              <h2 className="text-[100px] font-black italic uppercase text-orange-600 mb-10 tracking-tighter leading-[0.8] underline decoration-white/5 underline-offset-[25px]">{showCustomizer.name[lang]}</h2>
              <div className="space-y-16 mb-24">
                <div className="flex gap-8">
                  {['Low', 'Medium', 'High'].map(spice => (
                    <button key={spice} onClick={() => { haptic(); setCustomOptions({spice}); }} className={`flex-1 py-11 rounded-[4rem] text-[20px] font-black border-[8px] transition-all shadow-xl ${customOptions.spice === spice ? 'bg-orange-600 border-orange-600 text-white scale-110 shadow-orange-600/40' : 'border-zinc-800 text-gray-600 opacity-20'}`}>{spice}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => { haptic(); setCart([...cart, {...showCustomizer, ...customOptions}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-12 rounded-[5rem] font-black uppercase shadow-2xl text-2xl active:scale-95 transition-all mb-10 italic tracking-widest border-t-8 border-white/20">Finalize Item</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className={`mt-40 px-6 py-40 ${isDark ? 'bg-zinc-950 border-t border-white/5' : 'bg-white border-t border-orange-50'} text-center overflow-hidden relative shadow-2xl`}>
        <div className="mb-16 flex flex-col items-center gap-4 opacity-30">
            <div className="w-12 h-12 border-4 border-green-600 rounded-2xl flex items-center justify-center p-1.5 shadow-[0_0_20px_green]">
                <div className="w-full h-full bg-green-600 rounded-full"></div>
            </div>
            <p className="text-[10px] font-black text-green-600 uppercase tracking-[1em] italic leading-none">100% PURE VEG</p>
        </div>

        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-700 mb-10 opacity-30 italic underline decoration-orange-600/20 underline-offset-[12px]">Malout Premium Engineering By</p>
        
        <h2 className="text-4xl font-black italic uppercase mb-16 relative inline-block leading-none z-10 transition-all hover:scale-110 duration-700">
          <span className={isDark ? 'text-white' : 'text-black'}>developed by </span> 
          <span className="text-orange-600 italic tracking-tighter">aashray narang</span>
        </h2>

        <div className="flex justify-center gap-14 mb-24 z-20 relative opacity-40 hover:opacity-100 transition-all scale-110">
          <a href="https://github.com/Object2005" target="_blank" className="hover:scale-125 transition-all hover:drop-shadow-[0_0_8px_orange]"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className={`w-10 h-10 ${isDark ? 'invert' : ''}`} alt="GitHub" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:scale-125 transition-all hover:drop-shadow-[0_0_8px_orange]"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-10 h-10" alt="LinkedIn" /></a>
          <a href="mailto:aashraynarang@gmail.com" className="hover:scale-125 transition-all hover:drop-shadow-[0_0_8px_orange]"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-10 h-10" alt="Email" /></a>
        </div>
        
        <div className="z-20 relative opacity-10 font-black">
            <p className="text-[12px] text-gray-700 uppercase tracking-[1.5em] italic leading-none">MALOUT ● 2026</p>
        </div>
      </footer>

      {/* COOKING ENGINE */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 z-[5000] flex flex-col items-center justify-center p-12 backdrop-blur-3xl overflow-hidden text-center">
             <motion.div animate={{ scale:[1, 1.2, 1], rotate:[0, 20, -20, 0] }} transition={{repeat:Infinity, duration:2.2}} className="text-[10rem] mb-12 drop-shadow-[0_0_50px_rgba(234,88,12,0.8)]">🥘</motion.div>
             <h2 className="text-7xl font-black italic uppercase tracking-tighter mb-6 text-orange-600 underline decoration-white/10 decoration-8">Cooking!</h2>
             <p className="text-base text-gray-500 mb-20 uppercase tracking-[0.8em] font-black max-w-xl leading-loose italic opacity-60">Chef is preparing your Malout special meal...</p>
             <div className="w-64 h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/10 relative shadow-2xl">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-orange-600 shadow-[0_0_30px_rgba(234,88,12,1)] rounded-full"></motion.div>
             </div>
             <p className="text-[14px] font-black uppercase tracking-[1.5em] text-orange-600 animate-pulse italic mt-14 shadow-orange-600/10">SYNCING DIGITAL RECEIPT...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}