import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG: YOUR GEMINI KEY ---
const GEMINI_API_KEY = "AIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKw"; 

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
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 }
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
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customOptions, setCustomOptions] = useState({ spice: 'Medium' });
  const [sessionOrderId, setSessionOrderId] = useState('');
  
  // STATS & COINS
  const [coins, setCoins] = useState(250);
  const [stats, setStats] = useState({ revenue: 0, orders: 0 });
  
  // AI & VOICE
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiChat, setAiChat] = useState([{ role: 'bot', text: 'Sat Sri Akal Veer! Ki seva karaan?' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const scrollRefs = useRef({});
  const chatEndRef = useRef(null);

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_v_final_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));
    
    const savedStats = localStorage.getItem('ft_v_final_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_v_final_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  // FIX: Safe filtering logic for Vercel
  const filteredItems = useMemo(() => {
    if (!menu) return [];
    return menu.filter(i => 
      i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.name.pu.includes(searchQuery)
    );
  }, [searchQuery, menu]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0);
  const grandTotal = subtotal - Math.min(coins / 10, subtotal * 0.1);

  // GEMINI API
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
        body: JSON.stringify({ contents: [{ parts: [{ text: `Role: Town-AI for Aashray's Restaurant. Menu: ${initialMenuData.map(i=>i.name.en).join(",")}. Language: Punjabi/Hinglish. User: ${userMsg}` }] }] })
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

  const runOrder = (method) => {
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
            setCart([]); setView('HOME');
        }
    }, 200);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f8f8fa] text-black'} min-h-screen pb-44 transition-all font-sans overflow-x-hidden`}>
      <Head>
        <title>The Flavour's Town | Aashray</title>
      </Head>

      {view === 'HOME' ? (
        <div>
          {/* HEADER */}
          <header className={`fixed top-0 w-full z-[1000] px-5 py-5 backdrop-blur-3xl border-b ${isDark ? 'bg-black/90 border-white/5' : 'bg-white shadow-lg'} flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg italic">FT</div>
              <div className="leading-none">
                <h1 className="text-xs font-black uppercase italic">The Flavour's Town</h1>
                <span className="text-[10px] text-orange-500 font-bold animate-pulse">98774-74778</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { haptic(); setLang(lang==='pu'?'en':'pu'); }} className="bg-orange-600 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase">{lang==='pu'?'EN':'ਪੰ'}</button>
              <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-xl bg-zinc-800 text-white"> {isDark ? '☀️' : '🌙'} </button>
              <button onClick={() => { const p = prompt("Admin:"); if(p==="aashray778") setView('ADMIN'); }} className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-orange-600">⚙️</button>
            </div>
          </header>

          {/* SEARCH */}
          <section className="pt-28 px-4 max-w-xl mx-auto">
             <div className="bg-zinc-900/50 border border-white/10 p-4 rounded-3xl flex items-center">
                <span className="mr-3 opacity-30">🔍</span>
                <input type="text" placeholder="Search Malout flavor..." className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase" onChange={(e)=>setSearchQuery(e.target.value)} />
             </div>
          </section>

          {/* MENU GRID */}
          <main className="mt-10 px-4 space-y-12">
            {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => {
              const items = filteredItems.filter(i => i.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="space-y-6">
                  <h2 className="text-2xl font-black italic uppercase text-orange-600 border-b border-orange-600/10 pb-2">{cat}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {items.map(p => (
                      <div key={p.id} className={`${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white shadow-lg'} p-3 rounded-[2.5rem] border relative overflow-hidden transition-all ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                        <div className="h-36 rounded-[2rem] overflow-hidden mb-3">
                          <img src={p.img} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="text-center px-2">
                          <h3 className="text-[11px] font-black uppercase mb-1 h-8 flex items-center justify-center leading-tight tracking-tighter italic">{p.name[lang]}</h3>
                          <div className="flex items-center justify-between mt-2 bg-black/20 p-2 rounded-2xl">
                             <span className="text-lg font-black text-orange-600 italic">₹{p.price}</span>
                             <button onClick={() => { haptic(); setCart([...cart, p]); }} className="bg-orange-600 text-white px-4 py-2 rounded-xl text-[9px] font-black">ADD +</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </main>

          {/* FLOATING CART */}
          <AnimatePresence>
            {subtotal > 0 && (
              <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-10 left-0 right-0 z-[1000] px-6">
                 <button onClick={() => setView('CHECKOUT')} className="w-full max-w-lg mx-auto bg-zinc-950 p-5 rounded-[2.5rem] shadow-2xl flex justify-between items-center border-2 border-orange-600/20 text-white">
                    <div className="flex items-center gap-4 ml-2 italic">
                       <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-xl animate-bounce">🛒</div>
                       <p className="text-3xl font-black tracking-tighter">₹{grandTotal.toFixed(0)}</p>
                    </div>
                    <div className="bg-orange-600 px-8 py-3 rounded-2xl font-black text-[10px] uppercase italic">Checkout →</div>
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setIsAiOpen(true)} className="fixed bottom-32 right-6 z-[2000] bg-orange-600 h-16 w-16 rounded-full shadow-2xl flex items-center justify-center text-3xl animate-bounce">🤖</button>
        </div>
      ) : view === 'CHECKOUT' ? (
        /* BILL VIEW */
        <div className="pt-20 px-6 max-w-2xl mx-auto">
          <button onClick={() => setView('HOME')} className="mb-10 text-orange-600 font-black text-xs uppercase underline underline-offset-8">← Back</button>
          <div className="bg-zinc-950 p-10 rounded-[4rem] border-4 border-dashed border-zinc-800 relative">
             <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
             <h2 className="text-3xl font-black italic uppercase text-orange-600 mb-8">Final Receipt</h2>
             <div className="space-y-6 mb-12">
                {cart.map((c, i) => (
                   <div key={i} className="flex justify-between border-b border-white/5 pb-4">
                      <p className="font-black text-sm uppercase italic">{c.name[lang]}</p>
                      <p className="text-orange-500 font-black text-xl">₹{c.price}</p>
                   </div>
                ))}
             </div>
             <div className="border-t-4 border-orange-600 pt-8 text-right font-black italic">
                <p className="text-[10px] uppercase opacity-30 tracking-[0.4em] mb-2">Grand Total</p>
                <p className="text-8xl text-orange-600 tracking-tighter">₹{grandTotal.toFixed(0)}</p>
             </div>
          </div>
          <div className="mt-10 space-y-6">
             <button onClick={() => runOrder('UPI')} className="w-full py-10 rounded-[4rem] bg-[#1A73E8] text-white font-black uppercase text-xs italic shadow-2xl border-4 border-white/5">💳 UPI Payment</button>
             <button onClick={() => runOrder('WA')} className="w-full py-10 rounded-[4rem] bg-[#25D366] text-white font-black uppercase text-xs italic shadow-2xl border-4 border-white/5">📱 WhatsApp Order</button>
          </div>
        </div>
      ) : (
        /* ADMIN VIEW */
        <div className="pt-20 px-8">
           <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-black text-orange-600 uppercase italic">Admin Dashboard</h2>
              <button onClick={() => setView('HOME')} className="bg-white/10 px-6 py-2 rounded-full font-black text-xs uppercase">✕ Close</button>
           </div>
           
           <div className="bg-zinc-900 p-10 rounded-[3rem] text-center border border-white/5 mb-10">
              <p className="text-xs uppercase opacity-30 mb-2">Total Revenue</p>
              <p className="text-7xl font-black text-orange-600 italic">₹{stats.revenue.toFixed(0)}</p>
           </div>

           <div className="space-y-4">
              <p className="font-black uppercase text-xs text-orange-600 italic">Inventory Management:</p>
              <div className="grid grid-cols-1 gap-3">
                 {menu.map(m => (
                    <button key={m.id} onClick={() => setMenu(prev => prev.map(i => i.id === m.id ? {...i, inStock: !i.inStock} : i))} className={`p-5 rounded-2xl border flex justify-between items-center ${m.inStock ? 'bg-green-600/10 border-green-600/30' : 'bg-red-600/10 border-red-600/30'}`}>
                       <span className="font-bold text-xs uppercase">{m.name.en}</span>
                       <span className="font-black">{m.inStock ? 'IN STOCK' : 'OUT OF STOCK'}</span>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* AI MODAL */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
             <div className="bg-zinc-900 w-full max-w-lg h-[80vh] rounded-[4rem] border-4 border-orange-600/20 flex flex-col overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex justify-between bg-zinc-950">
                   <h3 className="font-black italic text-orange-600 text-xl tracking-tighter">Town-AI God Mode</h3>
                   <button onClick={() => setIsAiOpen(false)} className="text-gray-500 font-black text-3xl">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                   {aiChat.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-[2rem] font-bold text-sm leading-relaxed ${m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-gray-200 border border-white/5'}`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                   {isAiLoading && <p className="text-orange-600 animate-pulse font-black italic text-xs">AI is thinking...</p>}
                   <div ref={chatEndRef} />
                </div>
                <div className="p-6 bg-zinc-950 border-t border-white/5 flex gap-4">
                   <button onClick={startVoice} className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl ${isListening ? 'bg-red-600 animate-pulse' : 'bg-zinc-800 text-orange-600'}`}>🎤</button>
                   <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && askGemini()} placeholder="Ask Town-AI..." className="flex-1 bg-zinc-900 border-none outline-none rounded-full px-8 py-5 text-sm font-bold text-white shadow-inner" />
                   <button onClick={askGemini} className="bg-orange-600 h-14 w-14 rounded-full flex items-center justify-center text-2xl shadow-lg">🚀</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COOKING OVERLAY */}
      <AnimatePresence>
        {orderStatus === 'Preparing' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black z-[6000] flex flex-col items-center justify-center p-12 text-center backdrop-blur-3xl">
             <motion.div animate={{ scale:[1, 1.3, 1], rotate:[0, 20, -20, 0] }} transition={{repeat:Infinity, duration:2}} className="text-[10rem] mb-12 drop-shadow-[0_0_80px_orange]">🥘</motion.div>
             <h2 className="text-7xl font-black italic uppercase text-orange-600 mb-8 tracking-tighter">Cooking!</h2>
             <div className="w-full max-w-xl h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/10 relative shadow-[0_0_50px_black]">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-orange-600 shadow-[0_0_40px_orange] rounded-full"></motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="mt-40 px-10 py-32 bg-zinc-950 border-t border-white/5 text-center">
        <h2 className="text-5xl font-black italic uppercase mb-12 tracking-tighter transition-all hover:scale-110 duration-1000 leading-none">
          <span className="opacity-40">developed by </span> <br/>
          <span className="text-orange-600 italic tracking-tighter">aashray narang</span>
        </h2>
        <div className="flex justify-center gap-14 mb-20 opacity-40 hover:opacity-100 transition-all scale-125">
          <a href="https://github.com/Object2005" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-11 h-11 invert" alt="" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-11 h-11 shadow-2xl" alt="" /></a>
          <a href="mailto:aashraynarang@gmail.com" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-11 h-11" alt="" /></a>
        </div>
        <p className="mt-10 opacity-10 text-[10px] uppercase font-black tracking-[1.5em] italic">Malout ● © 2026</p>
      </footer>
    </div>
  );
}