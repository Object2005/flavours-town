import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG: TUHADI ACTIVE KEY ---
const GEMINI_API_KEY = "AIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKw"; 

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
  
  // AI STATES
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiChat, setAiChat] = useState([{ role: 'bot', text: 'Sat Sri Akal! Main Town-AI han. Ki khana pasand karoge bave?' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const scrollRefs = useRef({});
  const chatEndRef = useRef(null);

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_final_stable');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData.map(i => ({ ...i, inStock: true })));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  // SUPER STABLE GEMINI CALL
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
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Role: Professional Food Assistant for "The Flavour's Town" in Malout. 
              Owner: Aashray Narang. 
              Language: Hinglish/Punjabi. 
              Menu: ${initialMenuData.map(i => i.name.en + " (Rs " + i.price + ")").join(", ")}.
              Task: Be helpful, suggest items, talk about Malout's taste. 
              Customer said: ${userMsg}`
            }]
          }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content) {
        const botReply = data.candidates[0].content.parts[0].text;
        setAiChat(prev => [...prev, { role: 'bot', text: botReply }]);
      } else {
        throw new Error("Invalid Response");
      }
    } catch (err) {
      console.error(err);
      setAiChat(prev => [...prev, { role: 'bot', text: "Veer, server thoda busy hai. Key check karo ya net reset karo!" }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0) + 
                   addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f8f8fa] text-black'} min-h-screen transition-all font-sans overflow-x-hidden`}>
      <Head>
        <title>Town-AI God Mode | Aashray Narang</title>
      </Head>

      {view === 'HOME' ? (
        <div className="pt-20">
          {/* HEADER */}
          <header className={`fixed top-0 w-full z-[1000] px-4 py-4 backdrop-blur-3xl ${isDark ? 'bg-black/90 border-white/10' : 'bg-white shadow-lg'} border-b flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic">FT</div>
              <div className="leading-none">
                <h1 className="text-[13px] font-black uppercase italic">The Flavour's Town</h1>
                <span className="text-[10px] font-bold text-orange-500 animate-pulse">98774-74778</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { haptic(); setIsAiOpen(true); }} className="bg-orange-600 px-3 py-2 rounded-xl text-white font-black text-xs shadow-lg animate-bounce ring-4 ring-orange-600/20">🤖 ASK AI</button>
              <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-xl bg-zinc-800 text-white"> {isDark ? '☀️' : '🌙'} </button>
            </div>
          </header>

          {/* TITAN GRID */}
          <main className="mt-24 px-4 space-y-16 pb-48">
            {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((catName) => {
              const items = filteredItems.filter(i => i.category === catName);
              if (items.length === 0) return null;
              return (
                <div key={catName} ref={el => scrollRefs.current[catName] = el} className="space-y-6 scroll-mt-44">
                  <h2 className="text-3xl font-black italic uppercase text-orange-600 border-b border-orange-600/20 pb-2">{catName}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {items.map((p) => (
                      <div key={p.id} className={`${isDark ? 'bg-zinc-900/80 border-white/5 shadow-2xl' : 'bg-white border-orange-100 shadow-lg'} rounded-[2.5rem] p-4 border relative group overflow-hidden`}>
                        <div className="relative rounded-3xl overflow-hidden mb-4 h-36 bg-zinc-800">
                          <img src={p.img} className="w-full h-full object-cover" alt="" />
                          <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded-lg text-[8px] font-black text-yellow-400">⭐ {p.rating}</div>
                        </div>
                        <div className="text-center">
                          <h3 className={`text-[12px] font-black uppercase mb-1 h-10 flex items-center justify-center leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.name[lang]}</h3>
                          <p className="text-orange-500 font-black text-2xl italic tracking-tighter mb-4">₹{p.price}</p>
                          <button onClick={() => { haptic(); setCart([...cart, {...p, spice:'Medium'}]); }} className="w-full bg-orange-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-orange-600/20">ADD +</button>
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
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-6 left-0 right-0 z-[1000] px-5">
                <button onClick={() => setView('CHECKOUT')} className="w-full max-w-md mx-auto p-5 rounded-[2.5rem] shadow-[0_30px_70px_rgba(234,88,12,0.6)] flex justify-between items-center bg-zinc-950 text-white border-2 border-orange-600/20">
                   <div className="flex items-center gap-4 ml-2">
                      <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black animate-bounce italic">🛒</div>
                      <p className="text-3xl font-black tracking-tighter">₹{subtotal}</p>
                   </div>
                   <div className="px-10 py-3 rounded-2xl font-black text-[11px] uppercase italic bg-orange-600 text-white">Review →</div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* CHECKOUT */
        <div className="min-h-screen pt-12 px-5">
           <button onClick={() => setView('HOME')} className="mb-10 text-orange-600 font-black text-xs uppercase underline decoration-orange-600/20">← Back</button>
           <div className="bg-zinc-950 p-8 rounded-[4rem] border-4 border-dashed border-zinc-800">
              <h2 className="text-4xl font-black uppercase italic text-orange-600 mb-8">Final Bill</h2>
              <div className="space-y-6">
                 {cart.map((c, i) => (
                    <div key={i} className="flex justify-between border-b border-white/5 pb-4">
                       <p className="font-bold text-sm uppercase">{c.name[lang]}</p>
                       <p className="text-orange-500 font-black">₹{c.price}</p>
                    </div>
                 ))}
              </div>
              <div className="mt-10 pt-6 border-t-4 border-orange-600 flex justify-between items-end">
                 <p className="text-xs font-black opacity-30 uppercase">Payable Total</p>
                 <p className="text-7xl font-black text-orange-600 tracking-tighter italic">₹{subtotal}</p>
              </div>
           </div>
           <div className="mt-10 space-y-4">
              <button onClick={() => window.location.assign('upi://pay?pa=9877474778@paytm&am='+subtotal)} className="w-full py-6 rounded-full bg-[#1A73E8] text-white font-black uppercase text-xs italic shadow-xl">💳 UPI PAYMENT</button>
              <button onClick={() => window.location.assign('https://wa.me/919877474778')} className="w-full py-6 rounded-full bg-[#25D366] text-white font-black uppercase text-xs italic shadow-xl">📱 WHATSAPP BILL</button>
           </div>
        </div>
      )}

      {/* AI CHAT MODAL */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
             <div className="bg-zinc-900 w-full max-w-lg h-[85vh] rounded-[4rem] border-2 border-orange-600/30 flex flex-col overflow-hidden shadow-2xl shadow-orange-600/10">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                   <div className="flex items-center gap-4">
                      <div className="bg-orange-600 h-10 w-10 rounded-full flex items-center justify-center text-xl shadow-lg">🤖</div>
                      <h3 className="font-black italic text-orange-600 text-xl tracking-tighter">Town-AI God Mode</h3>
                   </div>
                   <button onClick={() => setIsAiOpen(false)} className="text-gray-500 font-black text-3xl">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                   {aiChat.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-[2rem] font-bold text-sm leading-relaxed ${m.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-zinc-800 text-gray-200 rounded-tl-none border border-white/5'}`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                   {isAiLoading && <p className="text-orange-500 animate-pulse font-black italic text-[10px] tracking-widest">AI IS THINKING...</p>}
                   <div ref={chatEndRef} />
                </div>
                <div className="p-6 bg-black/40 border-t border-white/5 flex gap-4">
                   <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && askGemini()} placeholder="Ask anything..." className="flex-1 bg-zinc-800 border-none outline-none rounded-full px-8 py-5 text-sm font-bold text-white shadow-inner" />
                   <button onClick={askGemini} className="bg-orange-600 h-14 w-14 rounded-full flex items-center justify-center text-2xl shadow-lg">🚀</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* FOOTER */}
      <footer className="mt-40 px-6 py-24 bg-zinc-950 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-gray-700 mb-8 opacity-40 italic underline decoration-orange-600/20 underline-offset-8">Experience Engineered By</p>
        <h2 className="text-4xl font-black italic uppercase mb-12">
          developed by <span className="text-orange-600">aashray narang</span>
        </h2>
        <div className="flex justify-center gap-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <a href="https://github.com/Object2005" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-10 h-10 invert" alt="Git" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-10 h-10" alt="In" /></a>
        </div>
      </footer>
    </div>
  );
}