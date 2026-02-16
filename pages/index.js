import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG: PASTE YOUR GEMINI API KEY HERE ---
const GEMINI_API_KEY = "YOUR_GEMIAIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKwNI_API_KEY_HERE"; 

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
  { id: 'p1', name: { en: "Special Packing", pu: "ਪੈਕਿੰਗ" }, price: 10 }
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
  
  // --- AI STATES ---
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiChat, setAiChat] = useState([{ role: 'bot', text: 'Sat Sri Akal! Main Town-AI han. Ki khana pasand karoge veer?' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const scrollRefs = useRef({});
  const chatEndRef = useRef(null);

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_ai_v12');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));
    
    const savedKitchen = localStorage.getItem('ft_kitchen_v12');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  // --- GEMINI AI ENGINE ---
  const askGemini = async () => {
    if (!aiInput.trim() || isAiLoading) return;
    haptic();
    const userMsg = aiInput;
    setAiChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Tusi "The Flavour's Town" (Malout, Punjab) de AI assistant ho. Tuhada naam "Town-AI" hai. 
              Customer naal Punjabi/Hinglish vich gal karo. Polite raho. 
              Menu items: ${initialMenuData.map(i => i.name.en).join(", ")}. 
              Je customer puche ki ki best hai, te Malai Chaap te Paneer Tikka suggest karo. 
              Customer query: ${userMsg}`
            }]
          }]
        })
      });
      const data = await response.json();
      const botReply = data.candidates[0].content.parts[0].text;
      setAiChat(prev => [...prev, { role: 'bot', text: botReply }]);
    } catch (err) {
      setAiChat(prev => [...prev, { role: 'bot', text: "Veer, network ch thodi dikkat hai. Dubara try karo!" }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0) + 
                   addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  const processOrder = (method) => {
    if (!isKitchenOpen && !isAdmin) return;
    haptic();
    setOrderStatus('Preparing');
    setTimeout(() => {
        setOrderStatus(null);
        const itemsStr = cart.map(i => `• ${i.name[lang]}`).join('\n');
        const msg = `*NEW AI ORDER*\nID: ${sessionOrderId}\n\n${itemsStr}\nTotal: ₹${subtotal}`;
        if (method === 'WA') window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(msg)}`);
        else window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${subtotal}&cu=INR`);
        setCart([]); setView('HOME');
    }, 4000);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f8f8fa] text-black'} min-h-screen transition-all duration-500 font-sans selection:bg-orange-500/20`}>
      <Head>
        <title>Town-AI | The Flavour's Town</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {view === 'HOME' ? (
        <motion.div initial={{opacity:0}} animate={{opacity:1}}>
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
              <button onClick={() => { haptic(); setIsAiOpen(true); }} className="bg-orange-600 p-2.5 rounded-xl text-white shadow-lg animate-bounce">🤖 AI</button>
              <button onClick={() => { haptic(); setIsDark(!isDark); }} className="p-2.5 rounded-xl bg-zinc-800 text-white"> {isDark ? '☀️' : '🌙'} </button>
              <button onClick={() => { const p = prompt("Admin:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} className="w-10 h-10 rounded-xl bg-[#fdfbf7] border-2 border-orange-200 flex items-center justify-center text-orange-600">⚙️</button>
            </div>
          </header>

          {/* CATEGORY TABS */}
          <nav className={`fixed top-[74px] w-full z-[900] py-3 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-2.5 px-4 border-b ${isDark ? 'bg-black/80' : 'bg-white/90 shadow-md'}`}>
            {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
              <button key={cat} onClick={() => { haptic(); scrollRefs.current[cat]?.scrollIntoView({behavior:'smooth', block:'start'}); }} className={`px-5 py-2 rounded-full text-[11px] font-black uppercase whitespace-nowrap transition-all border ${isDark ? 'bg-orange-600/10 text-orange-400 border-orange-600/20' : 'bg-white text-orange-600 border-orange-100 shadow-sm'}`}>#{cat}</button>
            ))}
          </nav>

          {/* SEARCH */}
          <section className="pt-36 px-4 max-w-xl mx-auto">
            <div className={`flex items-center px-6 py-4 rounded-3xl border-2 shadow-2xl ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-orange-100'}`}>
               <span className="mr-3 opacity-30 text-xl font-black">🔍</span>
               <input type="text" placeholder="Search Malout's Best..." className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase" onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </section>

          {/* MENU GRID */}
          <main className="mt-10 px-4 max-w-7xl mx-auto space-y-16 pb-48">
            {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((catName) => {
              const items = filteredItems.filter(i => i.category === catName);
              if (items.length === 0) return null;
              return (
                <div key={catName} ref={el => scrollRefs.current[catName] = el} className="space-y-6 scroll-mt-44">
                  <h2 className="text-3xl font-black italic uppercase text-orange-600 px-2">{catName}</h2>
                  <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-8">
                    {items.map((p) => (
                      <div key={p.id} className={`${isDark ? 'bg-zinc-900/60 border-white/5 shadow-2xl' : 'bg-white border-orange-50 shadow-lg'} rounded-[2.5rem] p-3 border relative overflow-hidden transition-all ${!p.inStock ? 'grayscale opacity-30' : ''}`}>
                        <div className="relative rounded-3xl overflow-hidden mb-3.5 h-36 bg-zinc-800 shadow-lg">
                          <img src={p.img} className="w-full h-full object-cover" alt="" />
                          <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded-lg text-[8px] font-black text-yellow-400">⭐ {p.rating}</div>
                        </div>
                        <div className="text-center">
                          <h3 className={`text-[12px] font-black uppercase mb-1 h-10 flex items-center justify-center leading-none italic ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.name[lang]}</h3>
                          <div className="flex items-center justify-between mt-2 bg-orange-600/5 p-1 rounded-2xl">
                            <p className="text-orange-500 font-black text-xl ml-2">₹{p.price}</p>
                            <button disabled={!p.inStock} onClick={() => { haptic(); setShowCustomizer(p); }} className="bg-orange-600 text-white px-4 py-2 rounded-xl text-[9px] font-black">ADD +</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </main>

          {/* VIEW CART BAR */}
          <AnimatePresence>
            {subtotal > 0 && (
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-0 right-0 z-[1000] px-5">
                <button onClick={() => { haptic(); setView('CHECKOUT'); }} className={`w-full max-w-md mx-auto p-4 rounded-2xl shadow-[0_20px_60px_rgba(234,88,12,0.8)] flex justify-between items-center ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                   <div className="flex items-center gap-4 ml-2">
                      <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-xl text-white font-black animate-bounce">🛒</div>
                      <p className="text-2xl font-black tracking-tighter">₹{subtotal}</p>
                   </div>
                   <div className="px-10 py-3 rounded-xl font-black text-[11px] uppercase italic bg-orange-600 text-white">Review Bill →</div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* --- CHECKOUT VIEW --- */
        <motion.div initial={{x: 300}} animate={{x: 0}} className="min-h-screen px-4 pt-12 pb-20 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-10">
             <button onClick={() => setView('HOME')} className="bg-orange-600/10 text-orange-600 px-6 py-3 rounded-full font-black text-xs uppercase">← Back</button>
             <h2 className="text-2xl font-black uppercase italic text-orange-600 underline underline-offset-8">Final Bill</h2>
          </div>

          <div className={`${isDark ? 'bg-white/5 border-white/5' : 'bg-white shadow-2xl'} p-8 rounded-[4rem] mb-10 border-4 border-dashed relative overflow-hidden`}>
             <div className="space-y-8 font-black mb-14">
                {cart.map((c, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-orange-600/10 pb-6 transition-all">
                     <div className="text-left leading-none">
                       <p className={`text-xl font-black uppercase italic ${isDark ? 'text-white' : 'text-black'}`}>{c.name[lang]}</p>
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">{c.spice} Style</p>
                     </div>
                     <p className="text-orange-500 font-black text-2xl italic tracking-tighter">₹{c.price}</p>
                  </div>
                ))}
             </div>
             <div className="border-t-8 border-orange-600 pt-10 px-2 italic font-black text-right">
                <p className="text-xs font-black uppercase opacity-40 mb-2">Net Amount</p>
                <p className="text-9xl font-black text-orange-600 tracking-tighter leading-none">₹{subtotal}</p>
             </div>
          </div>

          <div className="space-y-6 px-2 pb-20">
             <button onClick={() => processOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-8 rounded-[4rem] font-black uppercase shadow-xl text-xs flex items-center justify-center gap-6 active:scale-95 transition-all border-4 border-white/10">💳 UPI PAYMENT</button>
             <button onClick={() => processOrder('WA')} className="w-full bg-[#25D366] text-white py-8 rounded-[4rem] font-black uppercase shadow-xl text-xs flex items-center justify-center gap-6 active:scale-95 transition-all border-4 border-white/10">📱 WHATSAPP BILL</button>
          </div>
        </motion.div>
      )}

      {/* --- AI CHAT OVERLAY --- */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="fixed inset-0 z-[5000] bg-black/90 backdrop-blur-3xl p-6 flex items-center justify-center">
             <div className="bg-zinc-900 w-full max-w-lg h-[80vh] rounded-[4rem] border-4 border-orange-600/30 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(234,88,12,0.4)]">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-950">
                   <div className="flex items-center gap-4">
                      <div className="bg-orange-600 h-10 w-10 rounded-full flex items-center justify-center text-xl animate-pulse">🤖</div>
                      <h3 className="font-black uppercase italic text-orange-600 text-xl">Town-AI God Mode</h3>
                   </div>
                   <button onClick={() => setIsAiOpen(false)} className="text-gray-500 font-black text-3xl">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                   {aiChat.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-6 rounded-[2.5rem] font-bold text-sm leading-relaxed shadow-lg ${m.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-zinc-800 text-gray-200 rounded-tl-none border border-white/5'}`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                   {isAiLoading && <p className="text-orange-600 animate-pulse font-black italic text-xs">AI is thinking...</p>}
                   <div ref={chatEndRef} />
                </div>
                <div className="p-6 bg-zinc-950 border-t border-white/5 flex gap-4">
                   <input 
                      type="text" 
                      value={aiInput} 
                      onChange={(e) => setAiInput(e.target.value)} 
                      onKeyPress={(e) => e.key === 'Enter' && askGemini()}
                      placeholder="Ask anything (e.g. Best items?)" 
                      className="flex-1 bg-zinc-900 border-none outline-none rounded-full px-8 py-5 text-sm font-bold text-white shadow-inner"
                   />
                   <button onClick={askGemini} className="bg-orange-600 h-14 w-14 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-orange-600/20">🚀</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="mt-40 px-6 py-20 bg-zinc-950 border-t border-white/5 text-center">
        <h2 className="text-3xl font-black italic uppercase mb-10">
          developed by <span className="text-orange-600">aashray narang</span>
        </h2>
        <div className="flex justify-center gap-10 opacity-40 hover:opacity-100 transition-all">
          <a href="https://github.com/Object2005" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-10 h-10 invert" alt="" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-10 h-10" alt="" /></a>
          <a href="mailto:aashraynarang@gmail.com"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-10 h-10" alt="" /></a>
        </div>
      </footer>

      {/* ITEM CUSTOMIZER */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[4000] flex items-end justify-center p-6">
            <motion.div initial={{y:500}} animate={{y:0}} className="bg-zinc-950 w-full rounded-[4rem] p-12 max-w-2xl border-t-8 border-orange-600/30">
              <h2 className="text-6xl font-black italic uppercase text-orange-600 mb-8 leading-none">{showCustomizer.name[lang]}</h2>
              <div className="flex gap-4 mb-10">
                {['Low', 'Medium', 'High'].map(lv => (
                  <button key={lv} onClick={() => { haptic(); setCustomOptions({spice: lv}); }} className={`flex-1 py-5 rounded-3xl text-xl font-black border-4 ${customOptions.spice === lv ? 'bg-orange-600 border-orange-600 text-white' : 'border-zinc-800 text-gray-600'}`}>{lv}</button>
                ))}
              </div>
              <button onClick={() => { haptic(); setCart([...cart, {...showCustomizer, ...customOptions}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-10 rounded-[3rem] font-black uppercase shadow-2xl text-2xl active:scale-95 transition-all">Add to Cart</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COOKING OVERLAY */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black z-[6000] flex flex-col items-center justify-center p-12 text-center">
             <motion.div animate={{ scale:[1, 1.4, 1], rotate:[0, 20, -20, 0] }} transition={{repeat:Infinity, duration:2}} className="text-[12rem] mb-12 drop-shadow-[0_0_80px_orange]">🥘</motion.div>
             <h2 className="text-7xl font-black italic uppercase text-orange-600 mb-6">Cooking!</h2>
             <div className="w-72 h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/10 shadow-2xl">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-orange-600 shadow-[0_0_40px_orange] rounded-full"></motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}