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
  { id: 'p1', name: { en: "Extra Packing", pu: "ਪੈਕਿੰਗ" }, price: 10 }
];

export default function Home() {
  const [view, setView] = useState('HOME'); // 'HOME' or 'CHECKOUT'
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
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customOptions, setCustomOptions] = useState({ spice: 'Medium' });
  const [sessionOrderId, setSessionOrderId] = useState('');

  const scrollRefs = useRef({});

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_v10_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));

    const savedKitchen = localStorage.getItem('ft_v10_kitchen');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    const savedPrep = localStorage.getItem('ft_v10_prep');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
  }, []);

  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_v10_menu', JSON.stringify(menu));
    localStorage.setItem('ft_v10_kitchen', JSON.stringify(isKitchenOpen));
    localStorage.setItem('ft_v10_prep', prepTime.toString());
  }, [menu, isKitchenOpen, prepTime]);

  useEffect(() => {
    let interval;
    if (orderStatus === 'Preparing') {
      interval = setInterval(() => { setCookingProgress(p => (p >= 100 ? 100 : p + 1.8)); }, 50);
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
    const msg = `*THE FLAVOUR'S TOWN*\nOrder ID: ${sessionOrderId}\n\n*Items:*\n${itemsStr}\n\n${adsStr ? `*Addons:*\n${adsStr}\n` : ''}*Total:* ₹${subtotal}\n*Ready In:* ${prepTime}m`;

    setTimeout(() => {
      setOrderStatus(null);
      if (method === 'WA') window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(msg)}`);
      else window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${subtotal}&cu=INR`);
      setCart([]); setAddons({}); setView('HOME');
    }, 3500);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f8f8fa] text-black'} min-h-screen pb-44 transition-all duration-500 font-sans overflow-x-hidden`}>
      <Head>
        <title>{view === 'HOME' ? 'The Flavour\'s Town | Menu' : 'Final Checkout | Bill'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* --- RENDER HOME VIEW --- */}
      {view === 'HOME' && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          {/* HEADER */}
          <header className={`fixed top-0 w-full z-[1000] px-4 py-4 backdrop-blur-3xl ${isDark ? 'bg-black/90 border-white/10' : 'bg-white shadow-lg'} border-b flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">FT</div>
              <div className="flex flex-col leading-none">
                <h1 className="text-[13px] font-black uppercase italic">The Flavour's Town</h1>
                <span className="text-[10px] font-bold text-orange-500 animate-pulse drop-shadow-[0_0_8px_orange]">98774-74778</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { haptic(); setIsDark(!isDark); }} className="p-2.5 rounded-xl bg-zinc-800 text-white shadow-inner"> {isDark ? '☀️' : '🌙'} </button>
              <button onClick={() => { haptic(); setLang(lang==='pu'?'en':'pu'); }} className="text-[10px] font-black bg-orange-600 text-white px-4 rounded-xl uppercase shadow-lg shadow-orange-600/20">{lang==='pu'?'EN':'ਪੰ'}</button>
              <button onClick={() => { const p = prompt("Admin:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} className="w-10 h-10 rounded-xl bg-[#fdfbf7] border-2 border-orange-200 flex items-center justify-center text-orange-600 shadow-md">⚙️</button>
            </div>
          </header>

          {/* CATEGORY NAV */}
          <nav className={`fixed top-[74px] w-full z-[900] py-3 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-2.5 px-4 border-b ${isDark ? 'bg-black/80 border-white/5' : 'bg-white shadow-md'}`}>
            {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
              <button key={cat} onClick={() => { haptic(); scrollRefs.current[cat]?.scrollIntoView({behavior:'smooth', block:'start'}); }} className={`px-6 py-2 rounded-full text-[11px] font-black uppercase whitespace-nowrap transition-all border ${isDark ? 'bg-orange-600/10 text-orange-400 border-orange-600/20' : 'bg-white text-orange-600 border-orange-100 shadow-sm'}`}>#{cat}</button>
            ))}
          </nav>

          {/* SEARCH */}
          <section className="pt-36 px-4 max-w-xl mx-auto">
            <div className={`flex items-center px-6 py-4 rounded-3xl border-2 transition-all shadow-2xl ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-orange-100'}`}>
               <span className="mr-3 opacity-30 text-xl font-black italic">🔍</span>
               <input type="text" placeholder={lang === 'pu' ? "ਤੁਸੀਂ ਅੱਜ ਕੀ ਖਾਣਾ ਚਾਹੋਗੇ?..." : "Search malout's elite taste..."} className={`bg-transparent border-none outline-none w-full text-sm font-bold uppercase ${isDark ? 'text-white' : 'text-black'}`} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </section>

          {/* MENU GRID */}
          <main className="mt-10 px-4 max-w-7xl mx-auto space-y-16 pb-48">
            {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((catName) => {
              const items = filteredItems.filter(i => i.category === catName);
              if (items.length === 0) return null;
              return (
                <div key={catName} ref={el => scrollRefs.current[catName] = el} className="space-y-6 scroll-mt-44">
                  <div className="flex justify-between items-end px-2 border-b border-orange-600/10 pb-2">
                    <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>{catName}</h2>
                    <span className="text-[9px] font-bold opacity-30 uppercase tracking-[0.4em] italic">Original Taste</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                    {items.map((p) => (
                      <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} key={p.id} className={`${isDark ? 'bg-zinc-900/80 border-white/10 shadow-2xl' : 'bg-white border-orange-100 shadow-lg'} rounded-[2.5rem] p-3 border relative group overflow-hidden transition-all ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                        {isAdmin && (
                            <button onClick={() => setMenu(prev => prev.map(m => m.id === p.id ? {...m, inStock: !m.inStock} : m))} className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white border-4 border-dashed border-orange-600 rounded-[2.5rem]">
                                <span className="text-3xl mb-1">{p.inStock ? '✅' : '❌'}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">STOCK {p.inStock ? 'IN' : 'OUT'}</span>
                            </button>
                        )}
                        <div className="relative rounded-3xl overflow-hidden mb-3.5 h-36 bg-zinc-800 shadow-lg">
                          <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 duration-700" alt="" />
                          <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded-lg text-[8px] font-black text-yellow-400">⭐ {p.rating}</div>
                        </div>
                        <div className="text-center px-1">
                          <h3 className={`text-[12px] font-black uppercase mb-1 h-10 flex items-center justify-center leading-none tracking-tighter italic ${isDark ? 'text-white' : 'text-black'}`}>{p.name[lang]}</h3>
                          <div className="flex items-center justify-between mt-2 bg-orange-600/5 p-1.5 rounded-2xl border border-orange-600/10">
                            <p className="text-orange-500 font-black text-lg ml-1 italic tracking-tighter">₹{p.price}</p>
                            <button disabled={!isKitchenOpen || !p.inStock} onClick={() => { haptic(); setShowCustomizer(p); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg ${isKitchenOpen && p.inStock ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-gray-500'}`}>ADD</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </main>

          {/* FLOATING CART BAR */}
          <AnimatePresence>
            {subtotal > 0 && (
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-8 left-0 right-0 z-[1000] px-6">
                <button onClick={() => { haptic(); setView('CHECKOUT'); }} className={`w-full max-w-lg mx-auto p-5 rounded-[2.5rem] shadow-[0_30px_70px_rgba(234,88,12,0.8)] flex justify-between items-center ring-8 ring-orange-600/10 active:scale-95 transition-all border-2 border-orange-600/20 ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                   <div className="flex items-center gap-4 italic ml-3">
                      <div className="bg-orange-600 h-11 w-11 rounded-2xl flex items-center justify-center text-2xl shadow-lg text-white font-black animate-bounce">🛒</div>
                      <div className="text-left leading-none">
                        <p className={`text-[10px] font-black uppercase opacity-40 mb-1`}>{cart.length} Items</p>
                        <p className="text-3xl font-black tracking-tighter italic leading-none">₹{subtotal}</p>
                      </div>
                   </div>
                   <div className={`px-10 py-4 rounded-3xl font-black text-[11px] uppercase shadow-2xl italic tracking-widest ${isDark ? 'bg-gray-900 text-white' : 'bg-orange-600 text-white'}`}>Continue →</div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* --- RENDER FULL PAGE CHECKOUT VIEW --- */}
      {view === 'CHECKOUT' && (
        <motion.div initial={{x: 300, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: -300, opacity: 0}} className="min-h-screen px-4 pt-10 pb-20 max-w-2xl mx-auto">
          {/* TOP BACK BAR */}
          <div className="flex justify-between items-center mb-10 px-2">
             <button onClick={() => { haptic(); setView('HOME'); }} className="bg-orange-600/10 text-orange-600 p-4 rounded-3xl font-black text-xs uppercase shadow-sm">← Back To Menu</button>
             <h2 className="text-xl font-black uppercase italic tracking-tighter underline decoration-orange-600/30 underline-offset-8">Final Checkout</h2>
          </div>

          {/* THE RECEIPT (PAPER STYLE) */}
          
          <div className={`${isDark ? 'bg-white/5 border-white/5' : 'bg-white shadow-2xl border-orange-100'} p-8 rounded-[4rem] mb-10 border-4 border-dashed relative overflow-hidden`}>
             <div className="absolute top-0 left-0 w-full h-2 bg-orange-600 opacity-20"></div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.6em] mb-10 text-center italic opacity-40">Tax Invoice Receipt</p>
             
             <div className="space-y-8 font-black mb-14">
                {cart.map((c, i) => (
                  <div key={i} className="flex justify-between items-start border-b border-orange-600/10 pb-6 transition-all group">
                     <div className="text-left leading-none">
                       <p className={`text-xl font-black uppercase italic ${isDark ? 'text-white' : 'text-black'}`}>{c.name[lang]}</p>
                       <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">{c.spice} Style Preparation</p>
                     </div>
                     <div className="text-right">
                        <p className="text-orange-500 font-black text-2xl italic tracking-tighter leading-none">₹{c.price}</p>
                        <button onClick={() => { haptic(); setCart(cart.filter((_, idx)=> idx !== i)); }} className="text-[9px] text-red-500 uppercase font-black mt-2 underline">Remove</button>
                     </div>
                  </div>
                ))}
                
                {addonsData.map(ad => addons[ad.id] > 0 && (
                  <div key={ad.id} className="flex justify-between items-center border-b border-orange-600/5 pb-4 opacity-70 italic">
                     <p className="text-lg uppercase tracking-tighter">{ad.name[lang]} (Quantity x{addons[ad.id]})</p>
                     <p className="text-orange-500 font-black text-xl italic tracking-tighter">₹{ad.price * addons[ad.id]}</p>
                  </div>
                ))}
             </div>

             {/* GRAND TOTAL */}
             <div className="flex justify-between items-end border-t-8 border-orange-600 pt-10 px-2 italic font-black">
                <div className="space-y-2">
                   <p className="text-xs font-black uppercase opacity-40 tracking-[0.4em]">Sub-Total Value</p>
                   <p className="text-8xl font-black text-orange-600 tracking-tighter leading-none">₹{subtotal}</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black uppercase opacity-20 mb-1">Time To Prep</p>
                   <p className="text-xl opacity-60">⏱️ {prepTime} Mins</p>
                </div>
             </div>
          </div>

          {/* ADDONS SELECTION (BETTER UI) */}
          <div className="mb-14">
             <p className="text-[11px] font-black uppercase text-orange-500 tracking-[0.5em] mb-6 ml-4 italic underline decoration-orange-600/10">Add Extra Swaad:</p>
             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
                {addonsData.map(a => (
                  <div key={a.id} className={`${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-orange-50 shadow-xl'} min-w-[180px] p-8 rounded-[4rem] border-2 text-center transition-all`}>
                     <p className="text-base font-black mb-1 uppercase tracking-tighter text-orange-600">{a.name[lang]}</p>
                     <p className={`text-lg font-black mb-8 italic ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{a.price}</p>
                     <div className={`flex justify-between items-center ${isDark ? 'bg-black/90' : 'bg-gray-100'} rounded-[3rem] p-3 border-2 border-orange-600/10`}>
                        <button onClick={() => { haptic(); setAddons({...addons, [a.id]: Math.max(0, (addons[a.id] || 0) - 1)}); }} className="w-10 h-10 text-orange-600 font-black text-5xl flex items-center justify-center leading-none">-</button>
                        <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{addons[a.id] || 0}</span>
                        <button onClick={() => { haptic(); setAddons({...addons, [a.id]: (addons[a.id] || 0) + 1}); }} className="w-10 h-10 text-orange-600 font-black text-5xl flex items-center justify-center leading-none">+</button>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* PAYMENT OPTIONS (GIANT BUTTONS) */}
          <div className="space-y-6 px-2 pb-20">
             <button onClick={() => processOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-10 rounded-[4rem] font-black uppercase shadow-[0_20px_50px_rgba(26,115,232,0.4)] tracking-[0.4em] text-xs italic active:scale-95 transition-all border-4 border-white/10 flex items-center justify-center gap-6">
                <span className="text-3xl">💳</span> UPI PAYMENT GATEWAY
             </button>
             <button onClick={() => processOrder('WA')} className="w-full bg-[#25D366] text-white py-10 rounded-[4rem] font-black uppercase shadow-[0_20px_50px_rgba(37,211,102,0.4)] tracking-[0.4em] text-xs italic active:scale-95 transition-all border-4 border-white/10 flex items-center justify-center gap-6">
                <span className="text-3xl">📱</span> CONFIRM WHATSAPP BILL
             </button>
             <p className="text-center text-[9px] font-black uppercase opacity-20 tracking-[0.3em] italic">Official Shop ID: {sessionOrderId}</p>
          </div>
        </motion.div>
      )}

      {/* FOOTER */}
      <footer className={`mt-40 px-6 py-32 ${isDark ? 'bg-zinc-950 border-t border-white/5' : 'bg-white border-t border-orange-50'} text-center overflow-hidden relative shadow-2xl`}>
        <div className="mb-12 flex flex-col items-center gap-3 opacity-30">
            <div className="w-12 h-12 border-4 border-green-600 rounded-2xl flex items-center justify-center p-1 shadow-[0_0_20px_green]">
                <div className="w-full h-full bg-green-600 rounded-full"></div>
            </div>
            <p className="text-[10px] font-black text-green-600 tracking-widest italic leading-none uppercase">100% PURE VEG MALOUT</p>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-700 mb-8 opacity-30 italic leading-none underline decoration-orange-600/20 underline-offset-8">Designed & Coded For High Swaad By</p>
        <h2 className="text-4xl font-black italic uppercase mb-16 transition-all hover:scale-110 duration-700">
          <span className={isDark ? 'text-white' : 'text-black'}>developed by </span> 
          <span className="text-orange-600 italic tracking-tighter">aashray narang</span>
        </h2>
        <div className="flex justify-center gap-10 mb-16 z-20 relative opacity-40 hover:opacity-100 transition-all scale-110">
          <a href="https://github.com/Object2005" target="_blank" className="hover:scale-150 transition-all hover:drop-shadow-[0_0_8px_orange]"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className={`w-9 h-9 ${isDark ? 'invert' : ''}`} alt="Git" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:scale-150 transition-all hover:drop-shadow-[0_0_8px_orange]"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-9 h-9" alt="LinkedIn" /></a>
          <a href="mailto:aashraynarang@gmail.com" className="hover:scale-150 transition-all hover:drop-shadow-[0_0_8px_orange]"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-9 h-9" alt="Mail" /></a>
        </div>
        <div className="opacity-10 font-black italic text-xs uppercase tracking-widest">Malout, Punjab ● © 2026</div>
      </footer>

      {/* ITEM CUSTOMIZER (POPS OVER HOME) */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 backdrop-blur-[100px] z-[3000] flex items-end justify-center p-6">
            <motion.div initial={{y:1000}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950' : 'bg-white shadow-[0_-100px_300px_rgba(0,0,0,1)]'} w-full rounded-[6rem] p-16 max-w-2xl border-t-[15px] border-orange-600/30 relative`}>
              <button onClick={() => setShowCustomizer(null)} className="absolute top-14 right-14 text-gray-500 font-black text-4xl hover:text-red-500 transition-colors">✕</button>
              <h2 className="text-[90px] font-black italic uppercase text-orange-600 mb-8 tracking-tighter leading-[0.7] underline decoration-white/5 underline-offset-[20px]">{showCustomizer.name[lang]}</h2>
              <p className="text-[12px] font-black opacity-30 mb-14 tracking-[0.5em] uppercase italic text-center leading-none">Flavor Profile Setting</p>
              <div className="space-y-20 mb-28">
                <div className="flex gap-6">
                  {['Low', 'Medium', 'High'].map(spice => (
                    <button key={spice} onClick={() => { haptic(); setCustomOptions({spice}); }} className={`flex-1 py-11 rounded-[4rem] text-[18px] font-black border-[6px] transition-all shadow-xl ${customOptions.spice === spice ? 'bg-orange-600 border-orange-600 text-white scale-105 shadow-orange-600/40' : 'border-zinc-800 text-gray-600 opacity-20'}`}>{spice}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => { haptic(); setCart([...cart, {...showCustomizer, ...customOptions}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-10 rounded-[5rem] font-black uppercase shadow-[0_50px_120px_rgba(234,88,12,0.8)] text-2xl active:scale-95 transition-all mb-8 italic tracking-[0.2em] border-t-8 border-white/10">Confirm & Add Item</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COOKING ENGINE OVERLAY */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 z-[5000] flex flex-col items-center justify-center p-20 backdrop-blur-[100px] overflow-hidden text-center">
             <motion.div animate={{ scale:[1, 1.3, 1], rotate:[0, 20, -20, 0] }} transition={{repeat:Infinity, duration:2.2}} className="text-[14rem] mb-16 drop-shadow-[0_0_100px_rgba(234,88,12,0.9)]">🥘</motion.div>
             <h2 className="text-8xl font-black italic uppercase tracking-tighter mb-10 text-orange-600 underline decoration-white/10 underline-offset-[25px] decoration-[12px]">Cooking!</h2>
             <p className="text-lg text-gray-500 mb-24 uppercase tracking-[0.7em] font-black max-w-2xl leading-loose italic opacity-60">Master Chef is currently crafting Malout's legendary veg cuisine...</p>
             <div className="w-[35rem] h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/10 relative shadow-[0_0_60px_rgba(0,0,0,1)] ring-[15px] ring-orange-600/5">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_120px_rgba(234,88,12,1)] rounded-full"></motion.div>
             </div>
             <p className="text-[14px] font-black uppercase tracking-[1.2em] text-orange-600 animate-pulse italic mt-10">Syncing Secure Order Intel...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}