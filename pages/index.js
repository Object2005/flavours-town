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
    const savedMenu = localStorage.getItem('ft_final_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));

    const savedKitchen = localStorage.getItem('ft_final_kitchen');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    const savedPrep = localStorage.getItem('ft_final_prep');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
  }, []);

  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_final_menu', JSON.stringify(menu));
    localStorage.setItem('ft_final_kitchen', JSON.stringify(isKitchenOpen));
    localStorage.setItem('ft_final_prep', prepTime.toString());
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
    const msg = `*THE FLAVOUR'S TOWN ORDER*\n*ID:* ${sessionOrderId}\n\n*Items:*\n${itemsStr}\n\n${adsStr ? `*Addons:*\n${adsStr}\n` : ''}*Total:* ₹${subtotal}\n*Wait Time:* ${prepTime}m\n📍 Malout, Punjab`;

    setTimeout(() => {
      setOrderStatus(null);
      if (method === 'WA') window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(msg)}`);
      else window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${subtotal}&cu=INR`);
      setCart([]); setAddons({}); setShowCheckout(false);
    }, 4000);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#fcfbf7] text-black'} min-h-screen pb-44 transition-all duration-500 font-sans overflow-x-hidden`}>
      <Head>
        <title>98774-74778 | The Flavour's Town</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* FIXED TOP HEADER */}
      <header className={`fixed top-0 w-full z-[1000] px-4 py-4 backdrop-blur-3xl ${isDark ? 'bg-black/90 border-white/10 shadow-2xl' : 'bg-white/95 border-gray-200 shadow-xl'} border-b flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 h-11 w-11 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg text-xl">FT</div>
          <div className="flex flex-col leading-none">
            <h1 className={`text-xs font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>The Flavour's Town</h1>
            <span className="text-[10px] font-black text-orange-500 animate-pulse drop-shadow-[0_0_8px_orange]">98774-74778</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => { haptic(); setIsDark(!isDark); }} className={`p-2.5 rounded-xl ${isDark ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-black'}`}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => { haptic(); setLang(lang==='pu'?'en':'pu'); }} className="text-[9px] font-black bg-orange-600 text-white px-4 py-2.5 rounded-xl uppercase shadow-lg">{lang === 'pu' ? 'EN' : 'ਪੰ'}</button>
          <button onClick={() => { const p = prompt("Admin Pass:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} className="w-9 h-9 rounded-xl bg-[#fdfbf7] border-2 border-orange-200 flex items-center justify-center text-orange-600 shadow-lg font-black text-lg">⚙️</button>
        </div>
      </header>

      {/* QUICK CATEGORY TABS */}
      <nav className={`fixed top-[74px] w-full z-[900] py-4 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-4 px-6 border-b ${isDark ? 'bg-black/80' : 'bg-white/90 shadow-md'}`}>
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button key={cat} onClick={() => { haptic(); scrollRefs.current[cat]?.scrollIntoView({behavior:'smooth', block:'start'}); }} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${isDark ? 'bg-orange-600/10 text-orange-500 border border-orange-600/30' : 'bg-white border border-orange-100 text-orange-600 shadow-sm'}`}>#{cat}</button>
        ))}
      </nav>

      {/* SEARCH PORTAL */}
      <section className="pt-40 px-5 max-w-xl mx-auto">
        <div className={`flex items-center px-7 py-5 rounded-[2.5rem] border-4 transition-all ${isDark ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white border-orange-100 shadow-xl'}`}>
           <span className="mr-4 text-2xl opacity-40">🔍</span>
           <input type="text" placeholder={lang === 'pu' ? "ਤੁਹਾਨੂੰ ਅੱਜ ਕੀ ਪਸੰਦ ਹੈ?..." : "Search menu items..."} className={`bg-transparent border-none outline-none w-full text-base font-bold uppercase ${isDark ? 'text-white' : 'text-black'}`} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </section>

      {/* MENU ENGINE (2-COLUMN GRID) */}
      <main className="mt-12 px-4 max-w-7xl mx-auto space-y-20 pb-64">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((catName) => {
          const items = filteredItems.filter(i => i.category === catName);
          if (items.length === 0) return null;
          return (
            <div key={catName} ref={el => scrollRefs.current[catName] = el} className="space-y-10 scroll-mt-48">
              <div className="flex justify-between items-end border-b-4 border-orange-600/10 pb-4 px-2">
                 <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>{catName}</h2>
                 <span className="text-[10px] font-black opacity-30 uppercase tracking-widest text-orange-600">Legendary Taste</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-10">
                {items.map((p) => (
                  <motion.div initial={{opacity:0, scale:0.9}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} key={p.id} className={`${isDark ? 'bg-zinc-900/80 border-white/10 shadow-2xl' : 'bg-white border-orange-100 shadow-lg'} rounded-[3.5rem] p-4 border relative group overflow-hidden transition-all ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                    {isAdmin && (
                        <button onClick={() => setMenu(prev => prev.map(m => m.id === p.id ? {...m, inStock: !m.inStock} : m))} className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white border-4 border-dashed border-orange-600 rounded-[3.5rem] p-4 text-center">
                            <span className="text-3xl mb-2">{p.inStock ? '✅' : '❌'}</span>
                            <span className="text-[10px] font-black uppercase">Stock {p.inStock ? 'IN' : 'OUT'}</span>
                        </button>
                    )}
                    <div className="relative rounded-[2.5rem] overflow-hidden mb-5 h-40 bg-zinc-800 shadow-xl border-2 border-white/5">
                      <img src={p.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                      <div className="absolute bottom-3 left-3 bg-orange-600 px-3 py-1 rounded-xl text-[9px] font-black text-white shadow-lg">⏱️ {prepTime}m</div>
                      <div className="absolute top-3 right-3 bg-black/80 px-2.5 py-1 rounded-xl text-[10px] font-black text-yellow-400">⭐ {p.rating}</div>
                    </div>
                    <div className="text-center">
                      {/* HIGH CONTRAST NAME FIX */}
                      <h3 className={`text-[13px] font-black uppercase mb-1 h-12 flex items-center justify-center leading-none tracking-tighter italic ${isDark ? 'text-white' : 'text-black'}`}>{p.name[lang]}</h3>
                      <p className="text-orange-500 font-black text-3xl mb-5 tracking-tighter italic">₹{p.price}</p>
                      <button 
                        disabled={!isKitchenOpen || !p.inStock}
                        onClick={() => { haptic(); setShowCustomizer(p); }} 
                        className={`w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest active:scale-90 transition-all leading-none italic shadow-xl ${isKitchenOpen && p.inStock ? 'bg-orange-600 text-white shadow-orange-600/40' : 'bg-zinc-800 text-gray-500'}`}
                      >
                        {!p.inStock ? 'SOLD OUT' : isKitchenOpen ? 'Add To Cart' : 'CLOSED'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* ZOMATO STYLE FLOAT BAR */}
      <AnimatePresence>
        {subtotal > 0 && !orderStatus && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-8 left-0 right-0 z-[1000] px-6">
            <button onClick={() => { haptic(); setShowCheckout(true); }} className={`w-full max-w-lg mx-auto p-5 rounded-[2.5rem] shadow-[0_30px_70px_rgba(234,88,12,0.8)] flex justify-between items-center ring-8 ring-orange-600/10 active:scale-95 transition-all border-2 border-orange-600/20 ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
               <div className="flex items-center gap-5 italic ml-3">
                  <div className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-3xl shadow-xl text-white font-black animate-bounce">🛒</div>
                  <div className="text-left">
                    <p className={`text-[10px] font-black uppercase opacity-40 leading-none ${isDark ? 'text-black' : 'text-white'}`}>Checkout Total</p>
                    <p className="text-4xl font-black tracking-tighter">₹{subtotal}</p>
                  </div>
               </div>
               <div className={`px-10 py-4 rounded-[1.8rem] font-black text-[12px] uppercase shadow-2xl italic tracking-widest ${isDark ? 'bg-gray-900 text-white' : 'bg-orange-600 text-white'}`}>Review Bill →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN CONSOLE DASHBOARD */}
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
            <p className="text-[10px] text-center mt-10 font-bold opacity-20 uppercase tracking-[0.4em]">Tap any menu item card to toggle stock availability</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL CHECKOUT DRAWERS */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[2000] flex items-end justify-center p-6">
             <motion.div initial={{y:800}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950 border-t border-white/10' : 'bg-white shadow-[0_-50px_100px_rgba(0,0,0,0.5)]'} w-full rounded-[6rem] p-16 max-w-4xl overflow-y-auto max-h-[96vh] border-t-8 border-orange-600/30 relative`}>
                <button onClick={() => setShowCheckout(false)} className="absolute top-12 right-12 bg-red-600/10 text-red-500 w-14 h-14 rounded-full font-black text-2xl flex items-center justify-center">✕</button>
                <h2 className="text-5xl font-black uppercase italic mb-14 text-orange-600 tracking-tighter underline decoration-white/10 underline-offset-8">Order Receipt</h2>
                
                <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fdfbf7] border-orange-100 shadow-orange-100'} p-10 rounded-[4rem] mb-12 border-4 border-dashed shadow-inner`}>
                   <div className="space-y-10">
                      {cart.map((c, i) => (
                        <div key={i} className="flex justify-between items-center border-b-2 border-orange-600/10 pb-6">
                           <div className="text-left">
                             <p className={`text-xl font-black uppercase italic ${isDark ? 'text-white' : 'text-black'}`}>{c.name[lang]}</p>
                             <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">{c.spice} Style</p>
                           </div>
                           <p className="text-orange-500 font-black text-3xl tracking-tighter italic">₹{c.price}</p>
                        </div>
                      ))}
                      {addonsData.map(ad => addons[ad.id] > 0 && (
                        <div key={ad.id} className="flex justify-between items-center border-b-2 border-orange-600/10 pb-6 opacity-60">
                           <p className={`text-xl font-black uppercase italic ${isDark ? 'text-white' : 'text-black'}`}>{ad.name[lang]} (x{addons[ad.id]})</p>
                           <p className="text-orange-500 font-black text-3xl tracking-tighter italic">₹{ad.price * addons[ad.id]}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mb-14 overflow-x-auto flex gap-10 no-scrollbar pb-6 px-4">
                   {addonsData.map(a => (
                     <div key={a.id} className={`${isDark ? 'bg-white/5 border-white/5 shadow-black' : 'bg-gray-50 border-orange-50'} min-w-[200px] p-10 rounded-[5rem] border text-center shadow-2xl relative overflow-hidden group`}>
                        <p className="text-[18px] font-black mb-3 italic uppercase tracking-tighter text-orange-600">{a.name[lang]}</p>
                        <p className={`text-xl font-black mb-10 italic tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>₹{a.price}</p>
                        <div className={`flex justify-between items-center ${isDark ? 'bg-black/90 shadow-[0_0_40px_rgba(0,0,0,1)]' : 'bg-white shadow-inner'} rounded-[3rem] p-4 border-2 border-white/5`}>
                          <button onClick={() => { haptic(); setAddons({...addons, [a.id]: Math.max(0, (addons[a.id] || 0) - 1)}); }} className="w-12 h-12 text-orange-600 font-black text-6xl hover:scale-125 transition-all">-</button>
                          <span className={`text-[28px] font-black ${isDark ? 'text-white' : 'text-black'}`}>{addons[a.id] || 0}</span>
                          <button onClick={() => { haptic(); setAddons({...addons, [a.id]: (addons[a.id] || 0) + 1}); }} className="w-12 h-12 text-orange-600 font-black text-6xl hover:scale-125 transition-all">+</button>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="flex justify-between items-end mb-20 px-8 italic font-black">
                   <div className="space-y-6">
                     <p className="text-[16px] font-black text-gray-500 uppercase tracking-[0.7em] mb-10 leading-none opacity-40 italic">Grand Amount Due</p>
                     <p className="text-[12rem] font-black text-orange-600 tracking-tighter leading-none shadow-orange-600/10">₹{subtotal}</p>
                   </div>
                   <button onClick={() => setShowCheckout(false)} className="text-[16px] font-black text-red-500 uppercase underline decoration-zinc-800 underline-offset-[24px] decoration-8 italic tracking-[0.4em] mb-10">Edit Bill</button>
                </div>

                <div className="space-y-10 pb-24">
                   <button onClick={() => processOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-12 rounded-[5rem] font-black uppercase shadow-[0_30px_70px_rgba(26,115,232,0.4)] tracking-[0.6em] text-sm italic leading-none flex items-center justify-center gap-8 active:scale-95 transition-all border border-white/10 group"><span className="text-4xl group-hover:scale-150 transition-all">💳</span> UPI PAYMENT</button>
                   <button onClick={() => processOrder('WA')} className="w-full bg-[#25D366] text-white py-12 rounded-[5rem] font-black uppercase shadow-[0_30px_70px_rgba(37,211,102,0.4)] tracking-[0.6em] text-sm italic leading-none flex items-center justify-center gap-8 active:scale-95 transition-all border border-white/10 group"><span className="text-4xl group-hover:scale-150 transition-all">📱</span> WHATSAPP ORDER</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL FOOTER */}
      <footer className={`mt-40 px-6 py-40 ${isDark ? 'bg-zinc-950 border-t border-white/5' : 'bg-[#fdfbf7] border-t border-orange-50'} text-center overflow-hidden relative shadow-[0_-80px_200px_rgba(0,0,0,0.5)]`}>
        {/* COMPACT PURE VEG BADGE */}
        <div className="mb-20 flex flex-col items-center gap-4 opacity-30">
            <div className="w-14 h-14 border-4 border-green-600 rounded-2xl flex items-center justify-center p-1.5 shadow-[0_0_20px_green]">
                <div className="w-full h-full bg-green-600 rounded-full"></div>
            </div>
            <p className="text-[12px] font-black text-green-600 uppercase tracking-[1em] italic leading-none">100% PURE VEG</p>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-700 mb-10 opacity-30 italic underline decoration-orange-600/30 underline-offset-[14px]">Industrial Digital Solution Engineered By</p>
        
        <h2 className="text-4xl font-black italic uppercase mb-20 relative inline-block leading-none z-10 transition-all hover:scale-110 duration-700">
          <span className={isDark ? 'text-white' : 'text-black'}>developed by </span> 
          <span className="text-orange-600 italic tracking-tighter">aashray narang</span>
        </h2>

        <div className="flex justify-center gap-16 mb-32 z-20 relative opacity-40 hover:opacity-100 transition-all scale-110">
          <a href="https://github.com/Object2005" target="_blank" className="hover:scale-150 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className={`w-12 h-12 ${isDark ? 'invert' : ''}`} alt="GitHub" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:scale-150 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-12 h-12" alt="LinkedIn" /></a>
          <a href="mailto:aashraynarang@gmail.com" className="hover:scale-150 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-12 h-12" alt="Email" /></a>
        </div>
        
        <div className="z-20 relative opacity-10 font-black">
            <p className="text-[14px] text-gray-700 uppercase tracking-[1.5em] italic">MALOUT ● PUNJAB ● 2026</p>
        </div>
      </footer>

      {/* ITEM CUSTOMIZER DRAWERS */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 backdrop-blur-[100px] z-[3000] flex items-end justify-center p-6">
            <motion.div initial={{y:1000}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950' : 'bg-white shadow-[0_-100px_300px_rgba(0,0,0,1)]'} w-full rounded-[8rem] p-16 max-w-2xl border-t-[20px] border-orange-600/50 relative shadow-2xl shadow-orange-950`}>
              <button onClick={() => setShowCustomizer(null)} className="absolute top-14 right-14 text-gray-500 font-black text-4xl hover:text-red-500 transition-colors">✕</button>
              <h2 className="text-[100px] font-black italic uppercase text-orange-600 mb-12 tracking-tighter leading-[0.8] underline decoration-white/5 underline-offset-[25px]">{showCustomizer.name[lang]}</h2>
              <div className="space-y-24 mb-32">
                <div className="flex gap-8">
                  {['Low', 'Medium', 'High'].map(spice => (
                    <button key={spice} onClick={() => { haptic(); setCustomOptions({spice}); }} className={`flex-1 py-12 rounded-[5rem] text-[24px] font-black border-[10px] transition-all shadow-2xl ${customOptions.spice === spice ? 'bg-orange-600 border-orange-600 text-white scale-110 shadow-orange-600/60' : 'border-zinc-800 text-gray-600 opacity-20'}`}>{spice}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => { haptic(); setCart([...cart, {...showCustomizer, ...customOptions}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-12 rounded-[5rem] font-black uppercase shadow-[0_50px_120px_rgba(234,88,12,0.8)] text-3xl active:scale-95 transition-all mb-10 italic tracking-[0.2em] border-t-8 border-white/20">Finalize & Add Item</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROGRESS OVERLAY (ENGINE) */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 z-[5000] flex flex-col items-center justify-center p-20 backdrop-blur-[100px] overflow-hidden text-center">
             <motion.div animate={{ scale:[1, 1.4, 1], rotate:[0, 20, -20, 0] }} transition={{repeat:Infinity, duration:2.2}} className="text-[15rem] mb-20 drop-shadow-[0_0_120px_rgba(234,88,12,0.9)]">🥘</motion.div>
             <h2 className="text-9xl font-black italic uppercase tracking-tighter mb-10 text-orange-600 underline decoration-white/10 underline-offset-[30px] decoration-[14px]">COOKING!</h2>
             <p className="text-xl text-gray-500 mb-28 uppercase tracking-[0.8em] font-black max-w-2xl leading-loose italic opacity-60">Master Chef is currently crafts your special meal...</p>
             <div className="w-[35rem] h-5 bg-zinc-900 rounded-full overflow-hidden border-2 border-white/20 relative shadow-[0_0_80px_rgba(234,88,12,0.5)]">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_120px_rgba(234,88,12,1)] rounded-full"></motion.div>
             </div>
             <p className="text-[16px] font-black uppercase tracking-[1.5em] text-orange-600 animate-pulse italic mt-14 shadow-orange-600/10">SYNCING DIGITAL RECEIPT...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}