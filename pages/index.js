import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG: YOUR SECRET AI POWER ---
const GEMINI_API_KEY = "AIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKw"; 

// --- ULTIMATE 19 ITEMS DATA ---
const initialMenuData = [
  { id: 1, category: "Chaap", isBest: true, name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, reviews: 1240, img: "/img/malai-chaap.jpg", desc: "Creamy Malout style soya chaap." },
  { id: 2, category: "Chaap", isBest: false, name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, reviews: 890, img: "/img/masala-chaap.jpg", desc: "Spicy and tangy masala soya chunks." },
  { id: 3, category: "Chaap", isBest: true, name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, reviews: 1560, img: "/img/afghani-chaap.jpg", desc: "Rich cashews and cream marination." },
  { id: 4, category: "Chaap", isBest: false, name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, reviews: 750, img: "/img/achari-chaap.jpg", desc: "Pickle flavoured spicy chaap." },
  { id: 5, category: "Tikka", isBest: true, name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, reviews: 2100, img: "/img/paneer-tikka.jpg", desc: "Classic tandoori paneer skewers." },
  { id: 6, category: "Tikka", isBest: false, name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, reviews: 430, img: "/img/mushroom-tikka.jpg", desc: "Roasted mushrooms in spicy curd." },
  { id: 7, category: "Rolls", isBest: false, name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, reviews: 620, img: "/img/frankie.jpg", desc: "Mumbai style street roll." },
  { id: 8, category: "Rolls", isBest: true, name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, reviews: 940, img: "/img/paneer-roll.jpg", desc: "Paneer chunks with chutney in a roll." },
  { id: 9, category: "Rolls", isBest: false, name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, reviews: 510, img: "/img/chaap-roll.jpg", desc: "Soya chaap pieces with onions." },
  { id: 10, category: "Rolls", isBest: false, name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, reviews: 320, img: "/img/mushroom-roll.jpg", desc: "Fresh mushrooms in a soft wrap." },
  { id: 11, category: "Snacks", isBest: true, name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, reviews: 1800, img: "/img/pav-bhaji.jpg", desc: "Butter loaded pav bhaji." },
  { id: 12, category: "Rolls", isBest: false, name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, reviews: 210, img: "/img/twister.jpg", desc: "Crispy twister wrap." },
  { id: 13, category: "Snacks", isBest: false, name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, reviews: 770, img: "/img/kulcha.jpg", desc: "Amritsari style kulcha with bhurji." },
  { id: 14, category: "Snacks", isBest: true, name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, reviews: 1100, img: "/img/cheese-chilli.jpg", desc: "Spicy Indo-Chinese paneer." },
  { id: 15, category: "Snacks", isBest: false, name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, reviews: 150, img: "/img/kacha-paneer.jpg", desc: "Fresh raw paneer with masala." },
  { id: 16, category: "Snacks", isBest: false, name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, reviews: 420, img: "/img/paneer-fry.jpg", desc: "Deep fried paneer pakoras." },
  { id: 17, category: "Sweets", isBest: true, name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, reviews: 3000, img: "/img/gulab-jamun.jpg", desc: "Hot syrup sweets." },
  { id: 18, category: "Sweets", isBest: true, name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, reviews: 2500, img: "/img/rabri-jamun.jpg", desc: "Cold rabri with hot jamun." },
  { id: 19, category: "Sweets", isBest: false, name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, reviews: 1300, img: "/img/gajrela.jpg", desc: "Traditional carrot halwa." }
];

const addonsData = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 },
  { id: 'p1', name: { en: "Extra Packing", pu: "ਪੈਕਿੰਗ" }, price: 10 }
];

export default function Home() {
  const [view, setView] = useState('HOME');
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

  // --- MONSTER STATES ---
  const [coins, setCoins] = useState(150);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, top: "Malai Chaap" });
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiChat, setAiChat] = useState([{ role: 'bot', text: 'Sat Sri Akal Aashray Veer! Ki seva karaan?' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [upsellNotice, setUpsellNotice] = useState(null);

  const scrollRefs = useRef({});
  const chatEndRef = useRef(null);

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_v3_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));
    
    const savedStats = localStorage.getItem('ft_v3_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  // --- VOICE RECOGNITION (ACCESSIBILITY) ---
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser support nahi hai veer!");
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e) => {
      const txt = e.results[0][0].transcript.toLowerCase();
      setAiInput(txt);
      const found = menu.find(i => txt.includes(i.name.en.toLowerCase()));
      if (found) {
        setCart(prev => [...prev, {...found, spice: 'Medium'}]);
        setAiChat(prev => [...prev, {role:'user', text: txt}, {role:'bot', text: `Vadiya veer! ${found.name.en} cart vich add ho gayi.`}]);
      }
    };
    rec.start();
  };

  // --- GEMINI AI INTEGRATION ---
  const askGemini = async () => {
    if (!aiInput.trim() || isAiLoading) return;
    haptic();
    const userMsg = aiInput;
    setAiChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Role: Town-AI concierge for Aashray's Restaurant "The Flavour's Town" in Malout. Menu: ${initialMenuData.map(i=>i.name.en).join(",")}. Language: Hinglish/Punjabi. Current Cart: ${cart.map(i=>i.name.en).join(",")}. User: ${userMsg}` }] }] })
      });
      const data = await response.json();
      setAiChat(prev => [...prev, { role: 'bot', text: data.candidates[0].content.parts[0].text }]);
    } catch {
      setAiChat(prev => [...prev, { role: 'bot', text: "Veer network busy hai!" }]);
    } finally { setIsAiLoading(false); }
  };

  // --- BILL CALCULATIONS ---
  const subtotal = cart.reduce((acc, i) => acc + i.price, 0) + 
                   addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);
  const discount = Math.min(coins / 10, subtotal * 0.1);
  const grandTotal = subtotal - discount;

  const filteredItems = useMemo(() => menu.filter(i => 
    i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.pu.includes(searchQuery)
  ), [searchQuery, menu]);

  // --- UPSELLING LOGIC ---
  useEffect(() => {
    if (cart.length === 1 && !upsellNotice) {
      const last = cart[0];
      if (last.category === "Chaap") {
        setUpsellNotice(`Town-AI: ${last.name.en} de naal Rumali Roti bahut ghaint lagdi hai. Add karaan?`);
        setTimeout(() => setUpsellNotice(null), 6000);
      }
    }
  }, [cart]);

  const processOrder = (method) => {
    if (!isKitchenOpen && !isAdmin) return;
    haptic();
    setOrderStatus('Preparing');
    
    // UPDATE ADMIN STATS
    const newStats = { revenue: stats.revenue + grandTotal, orders: stats.orders + 1, top: cart[0]?.name.en || stats.top };
    setStats(newStats);
    localStorage.setItem('ft_v3_stats', JSON.stringify(newStats));
    setCoins(prev => prev + 20); // Loyalty reward

    setTimeout(() => {
      setOrderStatus(null);
      const itemsStr = cart.map(i => `• ${i.name[lang]} (${i.spice})`).join('\n');
      const msg = `*ORDER: ${sessionOrderId}*%0A%0A*Items:*%0A${itemsStr}%0A%0A*Grand Total:* ₹${grandTotal.toFixed(0)}`;
      
      if (method === 'WA') window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${msg}`);
      else window.location.assign(`upi://pay?pa=9877474778@paytm&am=${grandTotal.toFixed(0)}`);
      
      setCart([]); setAddons({}); setView('HOME');
    }, 4500);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f8f8fa] text-black'} min-h-screen pb-44 transition-all duration-500 font-sans overflow-x-hidden`}>
      <Head>
        <title>The Flavour's Town | Aashray Narang</title>
      </Head>

      {/* --- RENDER HOME VIEW --- */}
      {view === 'HOME' && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          {/* HEADER (ORIGINAL STYLE) */}
          <header className={`fixed top-0 w-full z-[1000] px-4 py-4 backdrop-blur-3xl ${isDark ? 'bg-black/90 border-white/10' : 'bg-white shadow-lg'} border-b flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">FT</div>
              <div className="flex flex-col leading-none">
                <h1 className="text-[13px] font-black uppercase italic">The Flavour's Town</h1>
                <span className="text-[10px] font-bold text-orange-500 animate-pulse">98774-74778</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { haptic(); setIsAiOpen(true); }} className="bg-orange-600 px-3 py-2 rounded-xl text-white font-black text-[10px] shadow-lg animate-bounce">🤖 AI</button>
              <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-xl bg-zinc-800 text-white shadow-inner">{isDark ? '☀️' : '🌙'}</button>
              <button onClick={() => { const p = prompt("Admin:"); if(p==="aashray778") setView('ADMIN'); }} className="w-10 h-10 rounded-xl bg-[#fdfbf7] border-2 border-orange-200 flex items-center justify-center text-orange-600 shadow-md">⚙️</button>
            </div>
          </header>

          {/* CATEGORY NAV (ORIGINAL STYLE) */}
          <nav className={`fixed top-[74px] w-full z-[900] py-3 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-2.5 px-4 border-b ${isDark ? 'bg-black/80 border-white/5' : 'bg-white shadow-md'}`}>
            {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
              <button key={cat} onClick={() => { haptic(); scrollRefs.current[cat]?.scrollIntoView({behavior:'smooth', block:'start'}); }} className={`px-6 py-2 rounded-full text-[11px] font-black uppercase whitespace-nowrap transition-all border ${isDark ? 'bg-orange-600/10 text-orange-400 border-orange-600/20' : 'bg-white text-orange-600 border-orange-100 shadow-sm'}`}>#{cat}</button>
            ))}
          </nav>

          {/* UPSELL NOTIFICATION */}
          <AnimatePresence>
            {upsellNotice && (
              <motion.div initial={{y:-100}} animate={{y:100}} exit={{y:-100}} className="fixed top-0 left-0 right-0 z-[2000] px-6">
                 <div className="bg-orange-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center border-b-4 border-black/20">
                    <p className="text-[10px] font-black italic">{upsellNotice}</p>
                    <button onClick={() => { setCart([...cart, { ...initialMenuData.find(i=>i.id===1), spice:'Medium' }]); setUpsellNotice(null); }} className="bg-white text-orange-600 px-3 py-1.5 rounded-xl font-black text-[9px]">ADD +</button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SEARCH */}
          <section className="pt-36 px-4 max-w-xl mx-auto">
            <div className={`flex items-center px-6 py-4 rounded-3xl border-2 transition-all shadow-2xl ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-orange-100'}`}>
               <span className="mr-3 opacity-30 text-xl font-black italic">🔍</span>
               <input type="text" placeholder="Search Malout's elite taste..." className={`bg-transparent border-none outline-none w-full text-sm font-bold uppercase ${isDark ? 'text-white' : 'text-black'}`} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </section>

          {/* MENU GRID (ORIGINAL STYLE) */}
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
                        <div className="relative rounded-3xl overflow-hidden mb-3.5 h-36 bg-zinc-800 shadow-lg">
                          <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 duration-700" alt="" />
                          <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded-lg text-[8px] font-black text-yellow-400">⭐ {p.rating}</div>
                        </div>
                        <div className="text-center px-1">
                          <h3 className={`text-[12px] font-black uppercase mb-1 h-10 flex items-center justify-center leading-none tracking-tighter italic ${isDark ? 'text-white' : 'text-black'}`}>{p.name[lang]}</h3>
                          <div className="flex items-center justify-between mt-2 bg-orange-600/5 p-1.5 rounded-2xl border border-orange-600/10">
                            <p className="text-orange-500 font-black text-lg ml-1 italic tracking-tighter">₹{p.price}</p>
                            <button disabled={!p.inStock} onClick={() => { haptic(); setShowCustomizer(p); }} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg ${p.inStock ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-gray-500'}`}>ADD</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </main>

          {/* FLOATING CART BAR (ORIGINAL STYLE) */}
          <AnimatePresence>
            {subtotal > 0 && (
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-8 left-0 right-0 z-[1000] px-6">
                <button onClick={() => { haptic(); setView('CHECKOUT'); }} className={`w-full max-w-lg mx-auto p-5 rounded-[2.5rem] shadow-[0_30px_70px_rgba(234,88,12,0.8)] flex justify-between items-center ring-8 ring-orange-600/10 active:scale-95 transition-all border-2 border-orange-600/20 ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                   <div className="flex items-center gap-4 italic ml-3">
                      <div className="bg-orange-600 h-11 w-11 rounded-2xl flex items-center justify-center text-2xl shadow-lg text-white font-black animate-bounce">🛒</div>
                      <div className="text-left leading-none">
                        <p className={`text-[10px] font-black uppercase opacity-40 mb-1`}>{cart.length} Items</p>
                        <p className="text-3xl font-black tracking-tighter italic leading-none">₹{grandTotal.toFixed(0)}</p>
                      </div>
                   </div>
                   <div className={`px-10 py-4 rounded-3xl font-black text-[11px] uppercase shadow-2xl italic tracking-widest ${isDark ? 'bg-gray-900 text-white' : 'bg-orange-600 text-white'}`}>Review Bill →</div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* --- CHECKOUT VIEW (ORIGINAL STYLE) --- */}
      {view === 'CHECKOUT' && (
        <motion.div initial={{x: 300, opacity: 0}} animate={{x: 0, opacity: 1}} className="min-h-screen px-4 pt-10 pb-20 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-10 px-2">
             <button onClick={() => setView('HOME')} className="bg-orange-600/10 text-orange-600 p-4 rounded-3xl font-black text-xs uppercase shadow-sm">← Back To Menu</button>
             <h2 className="text-xl font-black uppercase italic tracking-tighter underline decoration-orange-600/30 underline-offset-8">Final Checkout</h2>
          </div>

          <div className={`${isDark ? 'bg-white/5 border-white/5' : 'bg-white shadow-2xl border-orange-100'} p-8 rounded-[4rem] mb-10 border-4 border-dashed relative overflow-hidden`}>
             <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.6em] mb-10 text-center italic opacity-40">Tax Invoice Receipt</p>
             
             <div className="space-y-8 font-black mb-14">
                {cart.map((c, i) => (
                  <div key={i} className="flex justify-between items-start border-b border-orange-600/10 pb-6 transition-all">
                     <div className="text-left leading-none">
                       <p className={`text-xl font-black uppercase italic ${isDark ? 'text-white' : 'text-black'}`}>{c.name[lang]}</p>
                       <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">{c.spice} Style Preparation</p>
                     </div>
                     <p className="text-orange-500 font-black text-2xl italic tracking-tighter leading-none">₹{c.price}</p>
                  </div>
                ))}
             </div>

             <div className="flex justify-between items-end border-t-8 border-orange-600 pt-10 px-2 italic font-black">
                <div className="space-y-2">
                   <p className="text-xs font-black uppercase opacity-40 tracking-[0.4em]">Sub-Total Value</p>
                   <p className="text-8xl font-black text-orange-600 tracking-tighter leading-none">₹{grandTotal.toFixed(0)}</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black uppercase opacity-20 mb-1">Time To Prep</p>
                   <p className="text-xl opacity-60">⏱️ {prepTime} Mins</p>
                </div>
             </div>
          </div>

          <div className="space-y-6 px-2 pb-20">
             <button onClick={() => processOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-10 rounded-[4rem] font-black uppercase shadow-[0_20px_50px_rgba(26,115,232,0.4)] tracking-[0.4em] text-xs italic active:scale-95 transition-all border-4 border-white/10 flex items-center justify-center gap-6">
                <span className="text-3xl">💳</span> UPI PAYMENT GATEWAY
             </button>
             <button onClick={() => processOrder('WA')} className="w-full bg-[#25D366] text-white py-10 rounded-[4rem] font-black uppercase shadow-[0_20px_50px_rgba(37,211,102,0.4)] tracking-[0.4em] text-xs italic active:scale-95 transition-all border-4 border-white/10 flex items-center justify-center gap-6">
                <span className="text-3xl">📱</span> CONFIRM WHATSAPP BILL
             </button>
          </div>
        </motion.div>
      )}

      {/* --- ADMIN VIEW (NEW MONSTER ADDITION) --- */}
      {view === 'ADMIN' && (
        <motion.div initial={{y:800}} animate={{y:0}} className="min-h-screen p-10 bg-zinc-950 pb-40">
           <div className="flex justify-between items-center mb-16">
              <h2 className="text-4xl font-black italic text-orange-600 uppercase tracking-tighter">Business Analytics</h2>
              <button onClick={() => setView('HOME')} className="bg-white/10 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest border border-white/10">✕ Close</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-zinc-900/80 p-12 rounded-[4rem] border-4 border-dashed border-orange-600/20 text-center shadow-2xl">
                 <p className="text-[11px] font-black uppercase opacity-30 mb-4 tracking-[0.5em] italic">Lifetime Revenue</p>
                 <p className="text-[8rem] font-black text-orange-600 italic tracking-tighter leading-none">₹{stats.revenue.toFixed(0)}</p>
              </div>
              <div className="bg-zinc-900/50 p-12 rounded-[4rem] border border-white/5 relative overflow-hidden flex flex-col justify-center text-center">
                 <p className="text-[11px] font-black uppercase opacity-30 mb-8 tracking-[0.5em] italic">Orders & Volume</p>
                 <div className="h-48 flex items-end justify-between gap-4 px-6">
                    {[stats.orders * 2, 80, 45, 100, 65, 85].map((h, i) => (
                      <motion.div initial={{height:0}} animate={{height:`${h}%`}} key={i} className="flex-1 bg-orange-600/20 border-t-8 border-orange-600 rounded-t-3xl shadow-[0_0_30px_rgba(234,88,12,0.2)]"></motion.div>
                    ))}
                 </div>
              </div>
           </div>
        </motion.div>
      )}

      {/* --- AI & VOICE MODAL (MONSTER BUILD) --- */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="fixed inset-0 z-[5000] bg-black/98 backdrop-blur-3xl p-6 flex items-center justify-center">
             <div className="bg-zinc-900 w-full max-w-lg h-[80vh] rounded-[5rem] border-4 border-orange-600/30 flex flex-col overflow-hidden shadow-[0_0_150px_rgba(234,88,12,0.4)]">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/40">
                   <div className="flex items-center gap-5">
                      <div className="bg-orange-600 h-14 w-14 rounded-full flex items-center justify-center text-4xl animate-pulse shadow-[0_0_30px_orange] border-2 border-white/10">🤖</div>
                      <h3 className="font-black italic text-orange-600 text-2xl tracking-tighter">Town-AI God Mode</h3>
                   </div>
                   <button onClick={() => setIsAiOpen(false)} className="text-gray-500 font-black text-5xl hover:text-white transition-all">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-zinc-950/50">
                   {aiChat.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-8 rounded-[3.5rem] font-bold text-base leading-relaxed shadow-2xl border ${m.role === 'user' ? 'bg-orange-600 text-white border-orange-500 rounded-tr-none' : 'bg-zinc-800 text-gray-200 border-white/5 rounded-tl-none'}`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                   {isAiLoading && <p className="text-orange-500 font-black italic text-xs animate-pulse tracking-[0.5em] uppercase px-4">AI Thinking...</p>}
                   <div ref={chatEndRef} />
                </div>
                <div className="p-8 bg-black/60 border-t border-white/5 flex gap-5">
                   <button onClick={startVoice} className={`h-16 w-16 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all ${isListening ? 'bg-red-600 animate-ping ring-8 ring-red-600/20' : 'bg-zinc-800 text-orange-600 border border-white/5'}`}>🎤</button>
                   <input type="text" value={aiInput} onChange={(e)=>setAiInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter' && askGemini()} placeholder="Ask for Malai Chaap..." className="flex-1 bg-zinc-900 border-none outline-none rounded-full px-10 py-6 text-base font-bold text-white shadow-inner" />
                   <button onClick={askGemini} className="bg-orange-600 h-16 w-16 rounded-full flex items-center justify-center text-3xl shadow-2xl hover:scale-110 shadow-orange-600/40">🚀</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LIVE ORDER TRACKING (ORIGINAL STYLE) --- */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 z-[6000] flex flex-col items-center justify-center p-12 text-center backdrop-blur-3xl">
             <motion.div animate={{ scale:[1, 1.25, 1], rotate:[0, 15, -15, 0] }} transition={{repeat:Infinity, duration:2.5}} className="text-[16rem] mb-12 drop-shadow-[0_0_120px_rgba(234,88,12,0.8)]">🥘</motion.div>
             <h2 className="text-8xl font-black italic uppercase text-orange-600 mb-6 tracking-tighter leading-none shadow-orange-600/20">Cooking!</h2>
             <div className="w-full max-w-xl h-5 bg-zinc-950 rounded-full border-2 border-white/5 relative shadow-[0_0_50px_black] ring-[18px] ring-orange-600/5">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 shadow-[0_0_40px_rgba(234,88,12,0.6)] rounded-full"></motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ITEM CUSTOMIZER (ORIGINAL STYLE) */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 backdrop-blur-[100px] z-[3000] flex items-end justify-center p-6">
            <motion.div initial={{y:1000}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950' : 'bg-white shadow-[0_-100px_300px_rgba(0,0,0,1)]'} w-full rounded-[6rem] p-16 max-w-2xl border-t-[15px] border-orange-600/30 relative`}>
              <button onClick={() => setShowCustomizer(null)} className="absolute top-14 right-14 text-gray-500 font-black text-4xl hover:text-red-500 transition-colors">✕</button>
              <h2 className="text-[90px] font-black italic uppercase text-orange-600 mb-8 tracking-tighter leading-[0.7] underline decoration-white/5 underline-offset-[20px]">{showCustomizer.name[lang]}</h2>
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
      
      {/* FOOTER (ORIGINAL STYLE) */}
      <footer className="mt-40 px-10 py-32 bg-zinc-950 border-t border-white/5 text-center shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
        <p className="text-[10px] font-black uppercase tracking-[1.5em] text-gray-700 mb-10 opacity-30 italic leading-none underline decoration-orange-600 decoration-[10px] underline-offset-[25px]">Experience Engineered By</p>
        <h2 className="text-5xl font-black italic uppercase mb-20 relative inline-block leading-none z-10 transition-all hover:scale-105 duration-1000">
          <span className={isDark ? 'text-white' : 'text-gray-900'}>developed by </span> 
          <span className="text-orange-600 italic tracking-tighter">aashray narang</span>
        </h2>
        <div className="flex justify-center gap-14 mb-24 z-20 relative opacity-40 hover:opacity-100 transition-all scale-125 grayscale hover:grayscale-0">
          <a href="https://github.com/Object2005" target="_blank" className="hover:rotate-12 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-11 h-11 invert" alt="" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:-rotate-12 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-11 h-11 shadow-2xl" alt="" /></a>
        </div>
        <div className="opacity-10 font-black italic text-[14px] uppercase tracking-[1.5em]">MALOUT ● © 2026</div>
      </footer>
    </div>
  );
}