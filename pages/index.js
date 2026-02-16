import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG: YOUR SECRET POWER ---
const GEMINI_API_KEY = "AIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKw"; 

// --- ALL 19 ITEMS DATA ---
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

export default function Home() {
  const [view, setView] = useState('HOME');
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [sessionOrderId, setSessionOrderId] = useState('');

  // --- MONSTER STATES ---
  const [coins, setCoins] = useState(250);
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
    const savedMenu = localStorage.getItem('ft_v_final_monster');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));
    
    const savedStats = localStorage.getItem('ft_v_final_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    if (menu && menu.length > 0) localStorage.setItem('ft_v_final_monster', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  // FIX: Stable filtering for Vercel deployment
  const filteredItems = useMemo(() => {
    if (!menu) return [];
    return menu.filter(i => 
      (i.name.en?.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (i.name.pu?.includes(searchQuery))
    );
  }, [searchQuery, menu]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0);
  const grandTotal = subtotal - Math.min(coins / 10, subtotal * 0.1);

  // GEMINI AI INTEGRATION
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
        body: JSON.stringify({ contents: [{ parts: [{ text: `Role: Town-AI concierge for Aashray's Restaurant "The Flavour's Town" in Malout. Menu: ${initialMenuData.map(i=>i.name.en).join(",")}. Language: Hinglish/Punjabi. User: ${userMsg}` }] }] })
      });
      const data = await response.json();
      setAiChat(prev => [...prev, { role: 'bot', text: data.candidates[0].content.parts[0].text }]);
    } catch {
      setAiChat(prev => [...prev, { role: 'bot', text: "Veer network check karo!" }]);
    } finally { setIsAiLoading(false); }
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e) => {
      const txt = e.results[0][0].transcript.toLowerCase();
      const found = menu.find(i => txt.includes(i.name.en.toLowerCase()));
      if (found) {
        setCart(prev => [...prev, found]);
        setAiChat(prev => [...prev, {role:'user', text: txt}, {role:'bot', text: `${found.name.en} add ho gayi veer!` }]);
      }
    };
    rec.start();
  };

  const runOrderFlow = (method) => {
    if (!isKitchenOpen && !isAdmin) return alert("Kitchen is Closed!");
    setOrderStatus('Preparing');
    haptic();
    let prog = 0;
    const interval = setInterval(() => {
        prog += 5;
        setCookingProgress(prog);
        if(prog >= 100) {
            clearInterval(interval);
            setOrderStatus(null);
            const waMsg = `*ORDER: ${sessionOrderId}*%0AItems: ${cart.map(i=>i.name.en).join(",")}%0ATotal: ₹${grandTotal.toFixed(0)}`;
            if(method === 'WA') window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${waMsg}`);
            else window.location.assign(`upi://pay?pa=9877474778@paytm&am=${grandTotal.toFixed(0)}`);
            setStats(prev => ({ revenue: prev.revenue + grandTotal, orders: prev.orders + 1 }));
            localStorage.setItem('ft_v_final_stats', JSON.stringify({ revenue: stats.revenue + grandTotal, orders: stats.orders + 1 }));
            setCart([]); setView('HOME');
        }
    }, 200);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f8f8fa] text-black'} min-h-screen pb-44 transition-all font-sans overflow-x-hidden`}>
      <Head>
        <title>The Flavour's Town | Aashray Narang</title>
      </Head>

      {view === 'HOME' ? (
        <div>
          {/* HEADER - ORIGINAL UI */}
          <header className={`fixed top-0 w-full z-[1000] px-5 py-5 backdrop-blur-3xl border-b ${isDark ? 'bg-black/90 border-white/5 shadow-2xl' : 'bg-white shadow-lg'} flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg italic">FT</div>
              <div className="leading-none">
                <h1 className="text-sm font-black uppercase italic">The Flavour's Town</h1>
                <span className="text-[10px] text-orange-500 font-bold animate-pulse">98774-74778</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { haptic(); setLang(lang==='pu'?'en':'pu'); }} className="bg-orange-600 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-orange-600/20">{lang==='pu'?'EN':'ਪੰ'}</button>
              <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-xl bg-zinc-800 text-white border border-white/5"> {isDark ? '☀️' : '🌙'} </button>
              <button onClick={() => { const p = prompt("Admin:"); if(p==="aashray778") setView('ADMIN'); }} className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-orange-600">⚙️</button>
            </div>
          </header>

          {/* SEARCH SECTION */}
          <section className="pt-32 px-4 max-w-xl mx-auto">
             <div className="bg-zinc-900/50 border border-white/10 p-4 rounded-3xl flex items-center shadow-xl">
                <span className="mr-3 opacity-30 italic font-black text-xl">🔍</span>
                <input type="text" placeholder="Search Malout's flavor..." className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase" onChange={(e)=>setSearchQuery(e.target.value)} />
             </div>
          </section>

          {/* MENU GRID - ORIGINAL UI */}
          <main className="mt-12 px-4 space-y-16">
            {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => {
              const items = filteredItems.filter(i => i.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="space-y-8">
                  <h2 className="text-3xl font-black italic uppercase text-orange-600 border-b border-orange-600/10 pb-2 ml-2">{cat}</h2>
                  <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                    {items.map(p => (
                      <div key={p.id} className={`${isDark ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white shadow-lg'} p-4 rounded-[2.5rem] border relative overflow-hidden transition-all ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                        <div className="h-40 rounded-[2rem] overflow-hidden mb-4 bg-zinc-800">
                          <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 duration-700" alt="" />
                        </div>
                        <div className="text-center px-2">
                          <h3 className="text-xs font-black uppercase mb-1 h-10 flex items-center justify-center leading-tight tracking-tighter italic">{p.name[lang]}</h3>
                          <div className="flex items-center justify-between mt-3 bg-black/20 p-2 rounded-2xl border border-white/5">
                             <span className="text-2xl font-black text-orange-600 italic tracking-tighter ml-1">₹{p.price}</span>
                             <button onClick={() => { haptic(); setCart([...cart, p]); }} className="bg-orange-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-90 transition-all">ADD +</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </main>

          {/* FLOATING ACTION CART */}
          <AnimatePresence>
            {subtotal > 0 && (
              <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-10 left-0 right-0 z-[1000] px-6">
                 <button onClick={() => setView('CHECKOUT')} className="w-full max-w-lg mx-auto bg-zinc-950 p-6 rounded-[3rem] shadow-[0_40px_100px_rgba(234,88,12,0.6)] flex justify-between items-center border-2 border-orange-600/20 text-white">
                    <div className="flex items-center gap-4 ml-3 italic">
                       <div className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-3xl font-black animate-bounce shadow-xl">🛒</div>
                       <p className="text-4xl font-black tracking-tighter">₹{grandTotal.toFixed(0)}</p>
                    </div>
                    <div className="bg-orange-600 px-10 py-4 rounded-full font-black text-[11px] uppercase italic tracking-widest shadow-xl">Review Bill →</div>
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setIsAiOpen(true)} className="fixed bottom-36 right-8 z-[2000] bg-orange-600 h-18 w-18 rounded-full shadow-[0_0_30px_rgba(234,88,12,0.5)] flex items-center justify-center text-4xl animate-bounce border-4 border-white/10">🤖</button>
        </div>
      ) : view === 'CHECKOUT' ? (
        /* ORIGINAL BILL UI */
        <div className="pt-24 px-6 max-w-2xl mx-auto pb-40">
          <button onClick={() => setView('HOME')} className="mb-12 flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest italic">← Back to Selection</button>
          <div className="bg-zinc-950 p-12 rounded-[5rem] border-4 border-dashed border-zinc-800 relative shadow-[0_50px_100px_black]">
             <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-600 to-red-600"></div>
             <h2 className="text-4xl font-black italic uppercase text-orange-600 mb-10 tracking-tighter underline underline-offset-[12px] decoration-white/5">Final Receipt</h2>
             <div className="space-y-8 mb-16 max-h-80 overflow-y-auto no-scrollbar">
                {cart.map((c, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-white/5 pb-6">
                      <p className="font-black text-xl uppercase italic tracking-tighter leading-none">{c.name[lang]}</p>
                      <p className="text-orange-500 font-black text-3xl italic tracking-tighter">₹{c.price}</p>
                   </div>
                ))}
             </div>
             <div className="border-t-8 border-orange-600 pt-10 text-right font-black italic">
                <p className="text-[11px] uppercase opacity-30 tracking-[0.5em] mb-4">Total Amount Due</p>
                <p className="text-[9rem] text-orange-600 tracking-tighter leading-none drop-shadow-[0_20px_40px_rgba(234,88,12,0.4)]">₹{grandTotal.toFixed(0)}</p>
             </div>
          </div>
          <div className="mt-12 space-y-6 px-2">
             <button onClick={() => runOrderFlow('UPI')} className="w-full py-12 rounded-[5rem] bg-[#1A73E8] text-white font-black uppercase text-[11px] italic tracking-widest shadow-2xl border-4 border-white/5 active:scale-95 transition-all">💳 PAY via UPI / GPAY</button>
             <button onClick={() => runOrderFlow('WA')} className="w-full py-12 rounded-[5rem] bg-[#25D366] text-white font-black uppercase text-[11px] italic tracking-widest shadow-2xl border-4 border-white/5 active:scale-95 transition-all">📱 CONFIRM WHATSAPP</button>
          </div>
        </div>
      ) : (
        /* ADMIN VIEW - STOCK MANAGER */
        <div className="pt-24 px-10 bg-zinc-950 min-h-screen">
           <div className="flex justify-between items-center mb-16">
              <h2 className="text-4xl font-black text-orange-600 uppercase italic tracking-tighter">Stock Management</h2>
              <button onClick={() => setView('HOME')} className="bg-white/10 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">✕ Close</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              <div className="bg-zinc-900 p-12 rounded-[4rem] text-center border-2 border-dashed border-orange-600/20">
                 <p className="text-xs uppercase opacity-30 tracking-widest mb-4">Life-time Revenue</p>
                 <p className="text-8xl font-black text-orange-600 italic">₹{stats.revenue.toFixed(0)}</p>
              </div>
              <div className="bg-zinc-900 p-12 rounded-[4rem] border border-white/5 flex flex-col justify-center text-center">
                 <p className="text-xs uppercase opacity-30 tracking-widest mb-4">Total Orders</p>
                 <p className="text-6xl font-black">{stats.orders}</p>
              </div>
           </div>

           <div className="space-y-6">
              <p className="font-black uppercase text-sm text-orange-600 tracking-widest italic ml-4">Inventory Control Panel:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {menu.map(m => (
                    <button key={m.id} onClick={() => setMenu(prev => prev.map(i => i.id === m.id ? {...i, inStock: !i.inStock} : i))} className={`p-8 rounded-[2.5rem] border-4 flex justify-between items-center transition-all ${m.inStock ? 'bg-green-600/5 border-green-600/20 text-green-500' : 'bg-red-600/5 border-red-600/20 text-red-500'}`}>
                       <span className="font-black text-base uppercase italic tracking-tighter">{m.name.en}</span>
                       <span className="font-black text-xs uppercase tracking-widest">{m.inStock ? '● IN STOCK' : '○ OUT OF STOCK'}</span>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* AI CHAT MODAL - ORIGINAL UI */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[5000] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
             <div className="bg-zinc-900 w-full max-w-lg h-[80vh] rounded-[5rem] border-4 border-orange-600/20 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(234,88,12,0.4)]">
                <div className="p-10 border-b border-white/5 flex justify-between bg-zinc-950">
                   <div className="flex items-center gap-4">
                      <div className="bg-orange-600 h-12 w-12 rounded-full flex items-center justify-center text-3xl animate-pulse shadow-xl">🤖</div>
                      <h3 className="font-black italic text-orange-600 text-2xl tracking-tighter">Town-AI God Mode</h3>
                   </div>
                   <button onClick={() => setIsAiOpen(false)} className="text-gray-500 font-black text-4xl">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-zinc-950/50">
                   {aiChat.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-7 rounded-[3rem] font-bold text-base leading-relaxed ${m.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-zinc-800 text-gray-200 rounded-tl-none border border-white/5 shadow-xl'}`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                   {isAiLoading && <p className="text-orange-500 animate-pulse font-black italic text-xs tracking-[0.4em] uppercase px-4">AI ANALYZING FLAVORS...</p>}
                   <div ref={chatEndRef} />
                </div>
                <div className="p-8 bg-zinc-950 border-t border-white/5 flex gap-5">
                   <button onClick={startVoice} className={`h-16 w-16 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all ${isListening ? 'bg-red-600 animate-ping' : 'bg-zinc-800 text-orange-600 border border-white/5'}`}>🎤</button>
                   <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && askGemini()} placeholder="Ask Town-AI anything..." className="flex-1 bg-zinc-900 border-none outline-none rounded-full px-10 py-6 text-base font-bold text-white shadow-inner" />
                   <button onClick={askGemini} className="bg-orange-600 h-16 w-16 rounded-full flex items-center justify-center text-3xl shadow-xl hover:scale-110 active:scale-90 transition-all">🚀</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIVE PROGRESS OVERLAY - ORIGINAL UI */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/99 z-[6000] flex flex-col items-center justify-center p-12 text-center backdrop-blur-3xl">
             <motion.div animate={{ scale:[1, 1.3, 1], rotate:[0, 20, -20, 0] }} transition={{repeat:Infinity, duration:2.2}} className="text-[16rem] mb-12 drop-shadow-[0_0_120px_rgba(234,88,12,0.8)]">🥘</motion.div>
             <h2 className="text-8xl font-black italic uppercase text-orange-600 mb-8 tracking-tighter leading-none shadow-orange-600/20">
                {orderStatus === 'Preparing' ? 'COOKING!' : 'READY!'}
             </h2>
             <div className="w-full max-w-xl h-5 bg-zinc-950 rounded-full border-2 border-white/10 relative shadow-[0_0_60px_black] ring-[18px] ring-orange-600/5">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-gradient-to-r from-orange-500 via-red-600 to-yellow-500 rounded-full shadow-[0_0_40px_orange]"></motion.div>
             </div>
             <p className="mt-16 font-black italic text-xs uppercase opacity-20 tracking-[1.2em]">Malout Express Kitchen Active</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* FOOTER - THE SIGNATURE (FIXED GMAIL & SOCIALS) */}
      <footer className="mt-40 px-10 py-40 bg-zinc-950 border-t border-white/5 text-center shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
        <div className="mb-20 flex flex-col items-center gap-4 opacity-30">
            <div className="w-14 h-14 border-4 border-green-600 rounded-2xl flex items-center justify-center p-1 shadow-[0_0_30px_green]">
                <div className="w-full h-full bg-green-600 rounded-full"></div>
            </div>
            <p className="text-xs font-black text-green-600 tracking-[0.5em] italic uppercase">100% Malout Pure Veg</p>
        </div>
        
        <p className="text-[11px] font-black uppercase tracking-[1.5em] text-gray-700 mb-10 opacity-30 italic leading-none underline decoration-orange-600 decoration-[10px] underline-offset-[25px]">Sovereign Experience Built By</p>
        
        <h2 className="text-7xl font-black italic uppercase mb-24 relative inline-block leading-none z-10 transition-all hover:scale-110 duration-1000 tracking-tighter">
          <span className={isDark ? 'text-white' : 'text-gray-900'}>developed by </span> <br/>
          <span className="text-orange-600 drop-shadow-[0_15px_40px_rgba(234,88,12,0.3)]">aashray narang</span>
        </h2>
        
        <div className="flex justify-center gap-16 mb-24 z-20 relative opacity-40 hover:opacity-100 transition-all scale-150 grayscale hover:grayscale-0">
          <a href="https://github.com/Object2005" target="_blank" className="hover:rotate-12 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-12 h-12 invert" alt="Github" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:-rotate-12 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-12 h-12 shadow-2xl" alt="LinkedIn" /></a>
          <a href="mailto:narangaashray34@gmail.com" className="hover:scale-125 transition-all"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-12 h-12" alt="Gmail" /></a>
        </div>
        
        <div className="opacity-10 font-black italic text-base uppercase tracking-[1.5em] mt-20 transition-all hover:opacity-100">MALOUT ● GLOBAL EDITION ● © 2026</div>
      </footer>
    </div>
  );
}