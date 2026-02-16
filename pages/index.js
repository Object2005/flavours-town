import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG: YOUR GEMINI KEY ---
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
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null); // null, 'RECEIVED', 'MARINATING', 'TANDOOR', 'READY'
  const [stats, setStats] = useState({ revenue: 0, orders: 0, popular: "Malai Chaap" });
  
  // VOICE & AI STATES
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiChat, setAiChat] = useState([{ role: 'bot', text: 'Sat Sri Akal! Main Town-AI han. Tusi bol ke vi order de sakde ho!' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [upsellNotice, setUpsellNotice] = useState(null);

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  // VOICE RECOGNITION LOGIC
  const startSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech not supported in this browser");
    
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript.toLowerCase();
      setAiInput(transcript);
      handleVoiceCommand(transcript);
    };
    rec.start();
  };

  const handleVoiceCommand = (cmd) => {
    const found = initialMenuData.find(i => cmd.includes(i.name.en.toLowerCase()));
    if (found) {
      setCart(prev => [...prev, found]);
      setAiChat(prev => [...prev, { role: 'bot', text: `Done veer! ${found.name.en} cart vich add ho gayi hai.` }]);
    }
  };

  // SMART UPSELLING LOGIC
  useEffect(() => {
    if (cart.length > 0) {
      const lastItem = cart[cart.length - 1];
      if (lastItem.category === "Tikka" || lastItem.category === "Chaap") {
        setUpsellNotice(`Town-AI suggests: Pairing ${lastItem.name.en} with Rumali Roti is a 10/10 move! Add for ₹10?`);
        setTimeout(() => setUpsellNotice(null), 6000);
      }
    }
  }, [cart]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0);

  // LIVE TRACKING SEQUENCE
  const triggerOrderFlow = () => {
    setOrderStatus('RECEIVED');
    haptic();
    setTimeout(() => setOrderStatus('MARINATING'), 3000);
    setTimeout(() => setOrderStatus('TANDOOR'), 6000);
    setTimeout(() => setOrderStatus('READY'), 9000);
    setTimeout(() => {
      setOrderStatus(null);
      setStats(prev => ({ ...prev, revenue: prev.revenue + subtotal, orders: prev.orders + 1 }));
      setCart([]);
      setView('HOME');
    }, 12000);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#f8f9fa] text-black'} min-h-screen transition-all font-sans`}>
      <Head>
        <title>Sovereign Monster Build | Aashray</title>
      </Head>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-[1000] px-6 py-5 backdrop-blur-3xl border-b ${isDark ? 'bg-black/90 border-white/5' : 'bg-white shadow-xl'} flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg">FT</div>
          <div className="leading-none">
            <h1 className="text-sm font-black uppercase italic tracking-tighter">The Flavour's Town</h1>
            <span className="text-[10px] font-bold text-orange-500">Aashray Narang Edition</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { haptic(); setIsAiOpen(true); }} className="bg-orange-600 px-4 py-2 rounded-xl text-white font-black text-[10px] shadow-lg animate-pulse">🤖 AI / VOICE</button>
          <button onClick={() => { const p = prompt("Admin:"); if(p==="aashray778") setView('ADMIN'); }} className="p-3 rounded-xl bg-zinc-800 text-white border border-white/5">📊</button>
        </div>
      </header>

      {/* UPSELL NOTIFICATION */}
      <AnimatePresence>
        {upsellNotice && (
          <motion.div initial={{ y: -100 }} animate={{ y: 80 }} exit={{ y: -100 }} className="fixed top-4 left-0 right-0 z-[2000] px-6">
            <div className="bg-orange-600 text-white p-5 rounded-3xl shadow-2xl flex justify-between items-center border-b-4 border-black/20">
              <p className="text-xs font-black italic">{upsellNotice}</p>
              <button onClick={() => { setCart([...cart, { name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 }]); setUpsellNotice(null); }} className="bg-white text-orange-600 px-4 py-2 rounded-xl font-black text-[10px]">ADD +</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {view === 'HOME' ? (
        <main className="pt-32 px-5 space-y-16 pb-40 max-w-7xl mx-auto">
          {["Chaap", "Tikka", "Rolls"].map(cat => (
            <section key={cat}>
              <h2 className="text-4xl font-black italic uppercase text-orange-600 mb-8 border-b-2 border-orange-600/10 pb-2">{cat}</h2>
              <div className="grid grid-cols-2 gap-5">
                {initialMenuData.filter(i => i.category === cat).map(p => (
                  <div key={p.id} className={`${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white shadow-lg border-orange-50'} p-4 rounded-[3rem] border transition-all active:scale-95`}>
                    <div className="h-40 bg-zinc-800 rounded-[2.5rem] overflow-hidden mb-4">
                      <img src={p.img} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xs font-black uppercase mb-2 h-8 flex items-center justify-center leading-tight">{p.name[lang]}</h3>
                      <p className="text-2xl font-black text-orange-600 italic tracking-tighter mb-4">₹{p.price}</p>
                      <button onClick={() => { haptic(); setCart([...cart, p]); }} className="w-full bg-orange-600 text-white py-3 rounded-2xl font-black text-[10px]">ADD +</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* CHECKOUT BAR */}
          <AnimatePresence>
            {subtotal > 0 && (
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-8 left-0 right-0 z-[1000] px-6">
                <button onClick={() => setView('CHECKOUT')} className="w-full max-w-lg mx-auto p-6 rounded-[3.5rem] bg-zinc-950 text-white shadow-[0_40px_90px_rgba(234,88,12,0.6)] flex justify-between items-center border-2 border-orange-600/30">
                  <div className="flex items-center gap-5 ml-2">
                    <div className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-3xl font-black animate-bounce italic">🛒</div>
                    <p className="text-4xl font-black tracking-tighter italic">₹{subtotal}</p>
                  </div>
                  <div className="bg-orange-600 px-12 py-5 rounded-full font-black text-xs uppercase italic">Checkout →</div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      ) : view === 'CHECKOUT' ? (
        <div className="min-h-screen pt-24 px-6 max-w-2xl mx-auto">
           <button onClick={() => setView('HOME')} className="mb-10 text-orange-600 font-black text-xs uppercase">← Add More Food</button>
           <div className="bg-zinc-950 p-10 rounded-[5rem] border-4 border-dashed border-zinc-800 mb-10">
              <h2 className="text-5xl font-black uppercase italic text-orange-600 mb-10">Smart Bill</h2>
              <div className="space-y-6 mb-12">
                {cart.map((c, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-5">
                    <p className="font-black uppercase italic text-sm">{c.name[lang]}</p>
                    <p className="text-orange-500 font-black text-xl">₹{c.price}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-end border-t-8 border-orange-600 pt-10 font-black italic text-right">
                <p className="text-xs opacity-30 uppercase tracking-[0.5em]">Grand Total</p>
                <p className="text-9xl text-orange-600 tracking-tighter leading-none">₹{subtotal}</p>
              </div>
           </div>
           <button onClick={triggerOrderFlow} className="w-full py-12 rounded-[5rem] bg-[#1A73E8] text-white font-black uppercase text-sm shadow-2xl active:scale-95 transition-all border-4 border-white/10">💳 Pay with UPI</button>
        </div>
      ) : (
        /* ADMIN ANALYTICS VIEW */
        <div className="min-h-screen pt-24 px-8 bg-zinc-950">
           <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black italic uppercase text-orange-600">Analytics Dashboard</h2>
              <button onClick={() => setView('HOME')} className="bg-white/10 px-6 py-3 rounded-full font-black text-xs">✕</button>
           </div>
           <div className="grid grid-cols-1 gap-6 mb-12">
              <div className="bg-zinc-900 p-12 rounded-[4rem] border border-white/5 text-center">
                 <p className="text-xs font-black uppercase opacity-40 mb-2 tracking-widest">Total Revenue</p>
                 <p className="text-8xl font-black text-orange-600 italic">₹{stats.revenue}</p>
              </div>
              <div className="bg-zinc-900 p-12 rounded-[4rem] border border-white/5">
                 <p className="text-center text-xs font-black uppercase opacity-40 mb-8">Sales Data (Bar Chart)</p>
                 <div className="h-48 flex items-end justify-between gap-3">
                    {[stats.revenue/10, 80, 45, 90, 60, 100].map((h, i) => (
                      <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} key={i} className="flex-1 bg-orange-600/20 border-t-4 border-orange-600 rounded-t-xl"></motion.div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* AI & VOICE MODAL */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[5000] bg-black/98 backdrop-blur-3xl p-6 flex flex-col items-center justify-center">
             <div className="bg-zinc-900 w-full max-w-lg h-[80vh] rounded-[4rem] border-4 border-orange-600/20 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between bg-zinc-950">
                   <h3 className="font-black italic text-orange-600 text-2xl tracking-tighter">Town-AI God Mode</h3>
                   <button onClick={() => setIsAiOpen(false)} className="text-gray-500 font-black text-3xl">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                   {aiChat.map((m, i) => (
                     <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-6 rounded-[2.5rem] font-bold text-sm ${m.role === 'user' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-gray-200'}`}>{m.text}</div>
                     </div>
                   ))}
                </div>
                <div className="p-8 bg-zinc-950 flex gap-4 border-t border-white/5">
                   <button onClick={startSpeech} className={`h-16 w-16 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all ${isListening ? 'bg-red-600 animate-ping' : 'bg-zinc-800 text-orange-600'}`}>🎤</button>
                   <input type="text" value={aiInput} onChange={(e)=>setAiInput(e.target.value)} placeholder="Type or use Voice..." className="flex-1 bg-zinc-900 rounded-full px-8 font-bold text-sm" />
                   <button onClick={() => setAiChat([...aiChat, {role:'user', text: aiInput}])} className="bg-orange-600 h-16 w-16 rounded-full flex items-center justify-center text-3xl">🚀</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIVE PROGRESS TRACKING OVERLAY */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[6000] flex flex-col items-center justify-center p-10 text-center backdrop-blur-3xl">
             <div className="text-[12rem] mb-12 drop-shadow-[0_0_80px_rgba(234,88,12,0.8)]">
                {orderStatus === 'RECEIVED' ? '📝' : orderStatus === 'MARINATING' ? '🥣' : orderStatus === 'TANDOOR' ? '🔥' : '✅'}
             </div>
             <h2 className="text-7xl font-black italic uppercase text-orange-600 mb-10 tracking-tighter">
                {orderStatus === 'RECEIVED' ? 'Order Received' : orderStatus === 'MARINATING' ? 'Chef Marinating' : orderStatus === 'TANDOOR' ? 'In the Tandoor' : 'Ready for Malout!'}
             </h2>
             <div className="w-full max-w-xl flex justify-between px-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-40 italic">
                <span className={orderStatus==='RECEIVED' ? 'text-orange-500 opacity-100 underline underline-offset-8' : ''}>1. Received</span>
                <span className={orderStatus==='MARINATING' ? 'text-orange-500 opacity-100 underline underline-offset-8' : ''}>2. Marinating</span>
                <span className={orderStatus==='TANDOOR' ? 'text-orange-500 opacity-100 underline underline-offset-8' : ''}>3. Tandoor</span>
                <span className={orderStatus==='READY' ? 'text-green-500 opacity-100 underline underline-offset-8' : ''}>4. Ready</span>
             </div>
             <div className="w-full max-w-xl h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/10 relative shadow-[0_0_50px_black]">
                <motion.div initial={{ width: 0 }} animate={{ width: orderStatus==='RECEIVED'?'25%':orderStatus==='MARINATING'?'50%':orderStatus==='TANDOOR'?'75%':'100%' }} className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-[0_0_40px_orange]"></motion.div>
             </div>
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
      </footer>
    </div>
  );
}