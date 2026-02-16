import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG: YOUR SECRET POWER ---
const GEMINI_API_KEY = "AIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKw"; 

// --- ALL 19 ITEMS DATA ---
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

export default function Home() {
  const [view, setView] = useState('HOME');
  const [cart, setCart] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('pu');
  const [orderStatus, setOrderStatus] = useState(null);
  const [coins, setCoins] = useState(150);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, topItem: "Malai Chaap" });
  
  // AI & VOICE
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiChat, setAiChat] = useState([{ role: 'bot', text: 'Sat Sri Akal! Main Town-AI han. Ki khana pasand karoge veer?' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [upsellNotice, setUpsellNotice] = useState(null);

  const scrollRefs = useRef({});
  const chatEndRef = useRef(null);

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  // VOICE RECOGNITION (ACCESSIBILITY)
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e) => {
      const txt = e.results[0][0].transcript.toLowerCase();
      setAiInput(txt);
      const found = initialMenuData.find(i => txt.includes(i.name.en.toLowerCase()));
      if (found) {
        setCart(prev => [...prev, found]);
        setAiChat(prev => [...prev, { role: 'user', text: txt }, { role: 'bot', text: `Vadiya veer! ${found.name.en} cart vich pa ditti hai.` }]);
      }
    };
    rec.start();
  };

  // AI SMART UPSELLING
  useEffect(() => {
    if (cart.length === 1 && !upsellNotice) {
      const item = cart[0];
      if (item.category === "Chaap" || item.category === "Tikka") {
        setUpsellNotice(`Town-AI: ${item.name.en} de naal Rumali Roti da mel ghaint hai. Add karaan?`);
        setTimeout(() => setUpsellNotice(null), 5000);
      }
    }
  }, [cart]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0);
  const coinDiscount = Math.min(coins / 10, subtotal * 0.1);
  const grandTotal = subtotal - coinDiscount;

  // GEMINI ENGINE
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
        body: JSON.stringify({ contents: [{ parts: [{ text: `You are Town-AI for Aashray's Restaurant. Menu: ${initialMenuData.map(i=>i.name.en).join(",")}. Talk in Hinglish/Punjabi. User: ${userMsg}` }] }] })
      });
      const data = await response.json();
      setAiChat(prev => [...prev, { role: 'bot', text: data.candidates[0].content.parts[0].text }]);
    } catch {
      setAiChat(prev => [...prev, { role: 'bot', text: "Server busy hai veer!" }]);
    } finally { setIsAiLoading(false); }
  };

  // LIVE ORDER TRACKING SEQUENCE
  const triggerOrder = () => {
    setOrderStatus('RECEIVED');
    haptic();
    setTimeout(() => setOrderStatus('MARINATING'), 2500);
    setTimeout(() => setOrderStatus('TANDOOR'), 5000);
    setTimeout(() => setOrderStatus('READY'), 7500);
    setTimeout(() => {
      setOrderStatus(null);
      setStats(prev => ({ ...prev, revenue: prev.revenue + grandTotal, orders: prev.orders + 1 }));
      setCoins(prev => prev + 20);
      setCart([]); setView('HOME');
      window.location.assign(`https://wa.me/919877474778`);
    }, 9000);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f8f9fa] text-black'} min-h-screen transition-all font-sans overflow-x-hidden pb-40`}>
      <Head>
        <title>Sovereign Monster v3 | Aashray Narang</title>
      </Head>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-[1000] px-5 py-5 backdrop-blur-3xl border-b ${isDark ? 'bg-black/90 border-white/5' : 'bg-white shadow-lg'} flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">FT</div>
          <h1 className="text-sm font-black uppercase italic tracking-tighter leading-none">The Flavour's Town <br/><span className="text-orange-500 text-[10px] animate-pulse">98774-74778</span></h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { haptic(); setIsAiOpen(true); }} className="bg-orange-600 px-3 py-2 rounded-xl text-white font-black text-[10px] uppercase animate-bounce">🤖 AI VOICE</button>
          <button onClick={() => { const p = prompt("Admin:"); if(p==="aashray778") setView('ADMIN'); }} className="p-3 rounded-xl bg-zinc-800 text-white border border-white/5">📊</button>
        </div>
      </header>

      {/* SMART UPSELL BANNER */}
      <AnimatePresence>
        {upsellNotice && (
          <motion.div initial={{y:-100}} animate={{y:85}} exit={{y:-100}} className="fixed top-0 left-0 right-0 z-[2000] px-6">
            <div className="bg-orange-600 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center border-b-4 border-black/20">
               <p className="text-[10px] font-black italic">{upsellNotice}</p>
               <button onClick={() => { setCart([...cart, { name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 }]); setUpsellNotice(null); }} className="bg-white text-orange-600 px-3 py-1.5 rounded-xl font-black text-[9px]">ADD +</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {view === 'HOME' ? (
        <main className="pt-28 px-4 max-w-7xl mx-auto space-y-12">
          {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
            <div key={cat} className="space-y-6">
              <h2 className="text-3xl font-black italic uppercase text-orange-600 border-b border-orange-600/10 pb-2 ml-2">{cat}</h2>
              <div className="grid grid-cols-2 gap-4">
                {initialMenuData.filter(i => i.category === cat).map(p => (
                  <div key={p.id} className={`${isDark ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white shadow-lg'} p-3 rounded-[2.5rem] border relative overflow-hidden`}>
                    <div className="h-36 rounded-[2rem] overflow-hidden mb-3 bg-zinc-800">
                      <img src={p.img} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="text-center px-2">
                      <h3 className="text-[11px] font-black uppercase mb-1 h-8 flex items-center justify-center leading-tight tracking-tighter italic">{p.name[lang]}</h3>
                      <p className="text-xl font-black text-orange-600 mb-3 italic">₹{p.price}</p>
                      <button onClick={() => { haptic(); setCart([...cart, p]); }} className="w-full bg-orange-600 text-white py-3 rounded-2xl font-black text-[9px] uppercase shadow-lg">ADD +</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* FLOATING ACTION BAR */}
          <AnimatePresence>
            {subtotal > 0 && (
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-6 left-0 right-0 z-[1000] px-5">
                <button onClick={() => setView('CHECKOUT')} className="w-full max-w-md mx-auto p-5 rounded-[2.5rem] bg-zinc-950 text-white shadow-[0_30px_70px_rgba(234,88,12,0.6)] flex justify-between items-center border-2 border-orange-600/30">
                  <div className="flex items-center gap-4 ml-2 font-black italic">
                    <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center animate-bounce text-xl">🛒</div>
                    <p className="text-3xl tracking-tighter">₹{grandTotal.toFixed(0)}</p>
                  </div>
                  <div className="bg-orange-600 px-10 py-3.5 rounded-2xl font-black text-[10px] uppercase italic tracking-widest">Review Bill →</div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      ) : view === 'CHECKOUT' ? (
        /* PREMIUM BILL UI */
        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} className="min-h-screen pt-24 px-6 max-w-2xl mx-auto pb-40">
           <button onClick={() => setView('HOME')} className="mb-10 text-orange-600 font-black text-xs uppercase italic tracking-widest">← Add More</button>
           <div className="bg-zinc-950 p-10 rounded-[4rem] border-4 border-dashed border-zinc-800 relative overflow-hidden mb-10">
              <div className="absolute top-0 left-0 w-full h-3 bg-orange-600"></div>
              <h2 className="text-3xl font-black italic uppercase text-orange-600 mb-10 tracking-tighter underline underline-offset-[12px] decoration-white/5">Flavour's Receipt</h2>
              <div className="space-y-6 mb-12 max-h-[300px] overflow-y-auto no-scrollbar">
                {cart.map((c, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-4">
                    <p className="text-xl font-black uppercase italic tracking-tighter leading-none">{c.name[lang]}</p>
                    <p className="text-orange-500 font-black text-2xl italic tracking-tighter">₹{c.price}</p>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t-8 border-orange-600 text-right font-black italic">
                 <p className="text-[10px] uppercase opacity-30 tracking-widest mb-2">Grand Total</p>
                 <p className="text-9xl text-orange-600 tracking-tighter leading-none shadow-orange-600/20 drop-shadow-2xl">₹{grandTotal.toFixed(0)}</p>
              </div>
           </div>
           <button onClick={triggerOrder} className="w-full bg-[#1A73E8] text-white py-10 rounded-[4rem] font-black uppercase shadow-2xl text-[11px] italic border-4 border-white/10 active:scale-95 transition-all">💳 Pay via UPI</button>
        </motion.div>
      ) : (
        /* ADMIN ANALYTICS */
        <motion.div initial={{y:500}} animate={{y:0}} className="min-h-screen p-8 bg-zinc-950">
           <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-black italic text-orange-600 uppercase">Analytics</h2>
              <button onClick={() => setView('HOME')} className="bg-white/10 px-6 py-2 rounded-full font-black text-xs uppercase">✕ Close</button>
           </div>
           <div className="bg-zinc-900 p-10 rounded-[3rem] text-center mb-8 border border-white/5">
              <p className="text-[10px] font-black uppercase opacity-40 mb-2">Life-time Revenue</p>
              <p className="text-7xl font-black text-orange-600 italic">₹{stats.revenue.toFixed(0)}</p>
           </div>
           <div className="h-48 flex items-end justify-between gap-3 px-4">
              {[40, 80, 50, 100, 70, 90].map((h, i) => (
                <motion.div initial={{height:0}} animate={{height:`${h}%`}} key={i} className="flex-1 bg-orange-600/20 border-t-4 border-orange-600 rounded-t-xl"></motion.div>
              ))}
           </div>
        </motion.div>
      )}

      {/* AI & VOICE MODAL */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[5000] bg-black/98 backdrop-blur-3xl p-6 flex items-center justify-center">
             <div className="bg-zinc-900 w-full max-w-lg h-[80vh] rounded-[4rem] border-4 border-orange-600/20 flex flex-col overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex justify-between bg-zinc-950">
                   <h3 className="font-black italic text-orange-600 text-xl tracking-tighter">Town-AI God Mode</h3>
                   <button onClick={() => setIsAiOpen(false)} className="text-gray-500 font-black text-3xl">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                   {aiChat.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-6 rounded-[2.5rem] font-bold text-sm ${m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-gray-200'}`}>{m.text}</div>
                     </div>
                   ))}
                </div>
                <div className="p-6 bg-zinc-950 border-t border-white/5 flex gap-3">
                   <button onClick={startVoice} className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl transition-all ${isListening ? 'bg-red-600 animate-pulse' : 'bg-zinc-800 text-orange-600'}`}>🎤</button>
                   <input type="text" value={aiInput} onChange={(e)=>setAiInput(e.target.value)} onKeyPress={(e)=>e.key==='Enter' && askGemini()} placeholder="Type or Speak..." className="flex-1 bg-zinc-900 border-none outline-none rounded-full px-8 text-sm font-bold text-white shadow-inner" />
                   <button onClick={askGemini} className="bg-orange-600 h-14 w-14 rounded-full flex items-center justify-center text-2xl shadow-xl">🚀</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIVE PROGRESS TIMELINE */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black z-[6000] flex flex-col items-center justify-center p-12 text-center backdrop-blur-3xl">
             <div className="text-[12rem] mb-12 drop-shadow-[0_0_80px_rgba(234,88,12,0.8)]">
                {orderStatus === 'RECEIVED' ? '📝' : orderStatus === 'MARINATING' ? '🥣' : orderStatus === 'TANDOOR' ? '🔥' : '✅'}
             </div>
             <h2 className="text-7xl font-black italic uppercase text-orange-600 mb-8 tracking-tighter">
                {orderStatus === 'RECEIVED' ? 'Order Placed' : orderStatus === 'MARINATING' ? 'Chef Working' : orderStatus === 'TANDOOR' ? 'In Tandoor' : 'Ready!'}
             </h2>
             <div className="w-full max-w-xl h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/10 shadow-[0_0_50px_black] ring-[15px] ring-orange-600/5">
                <motion.div initial={{width:0}} animate={{width: orderStatus==='RECEIVED'?'25%':orderStatus==='MARINATING'?'50%':orderStatus==='TANDOOR'?'75%':'100%' }} className="h-full bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_40px_orange] rounded-full"></motion.div>
             </div>
             <p className="mt-16 font-black italic text-xs uppercase opacity-20 tracking-[1em]">Industrial Tracking System Active</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* FOOTER */}
      <footer className="mt-40 px-10 py-32 bg-zinc-950 border-t border-white/5 text-center">
        <h2 className="text-5xl font-black italic uppercase mb-12 tracking-tighter">developed by <span className="text-orange-600">aashray narang</span></h2>
        <div className="flex justify-center gap-14 opacity-30 hover:opacity-100 transition-all scale-125">
          <a href="https://github.com/Object2005" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-11 h-11 invert" alt="" /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-11 h-11" alt="" /></a>
        </div>
        <p className="mt-20 opacity-10 text-[10px] uppercase font-black tracking-[1.5em] italic">Malout ● © 2026</p>
      </footer>
    </div>
  );
}