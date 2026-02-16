import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG: GEMINI AI POWER ---
const GEMINI_API_KEY = "AIzaSyD6BGkKRa7yl1eZNyvIS6WOkD2iu0axRKw"; 

const initialMenuData = [
  { id: 1, category: "Chaap", isBest: true, name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, reviews: 1240, img: "/img/malai-chaap.jpg", desc: "Creamy, rich and melt-in-the-mouth chaap." },
  { id: 2, category: "Chaap", isBest: false, name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, reviews: 890, img: "/img/masala-chaap.jpg", desc: "Spicy and tangy masala infused chaap." },
  { id: 3, category: "Chaap", isBest: true, name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, reviews: 1560, img: "/img/afghani-chaap.jpg", desc: "Traditional Afghani spices and yogurt marination." },
  { id: 4, category: "Chaap", isBest: false, name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, reviews: 750, img: "/img/achari-chaap.jpg", desc: "Tangy pickle flavored soya chunks." },
  { id: 5, category: "Tikka", isBest: true, name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, reviews: 2100, img: "/img/paneer-tikka.jpg", desc: "Classic tandoori paneer with bell peppers." },
  { id: 6, category: "Tikka", isBest: false, name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, reviews: 430, img: "/img/mushroom-tikka.jpg", desc: "Fresh mushrooms roasted in clay oven." },
  { id: 7, category: "Rolls", isBest: false, name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, reviews: 620, img: "/img/frankie.jpg", desc: "Mumbai style spicy veg roll." },
  { id: 8, category: "Rolls", isBest: true, name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, reviews: 940, img: "/img/paneer-roll.jpg", desc: "Stuffed with spicy paneer and sauces." },
  { id: 11, category: "Snacks", isBest: true, name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, reviews: 1800, img: "/img/pav-bhaji.jpg", desc: "Butter loaded bhaji with soft pav." },
  { id: 14, category: "Snacks", isBest: true, name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, reviews: 1100, img: "/img/cheese-chilli.jpg", desc: "Indo-Chinese favorite spicy cheese chunks." },
  { id: 17, category: "Sweets", isBest: true, name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, reviews: 3000, img: "/img/gulab-jamun.jpg", desc: "Hot syrup-soaked dessert balls." },
  { id: 18, category: "Sweets", isBest: true, name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, reviews: 2500, img: "/img/rabri-jamun.jpg", desc: "Legendary combo of rabri and jamun." }
];

export default function Home() {
  const [view, setView] = useState('HOME');
  const [cart, setCart] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('pu');
  const [orderStatus, setOrderStatus] = useState(null);
  const [sessionOrderId, setSessionOrderId] = useState('');
  
  // AI & VOICE LOGIC
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiChat, setAiChat] = useState([{ role: 'bot', text: 'Sat Sri Akal Veer! Blinkit ton fast order chahida?' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0);
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const taxes = subtotal * 0.05;
  const grandTotal = subtotal + deliveryFee + taxes;

  const runOrderFlow = () => {
    setOrderStatus('CONFIRMING');
    haptic();
    setTimeout(() => setOrderStatus('PREPARING'), 2000);
    setTimeout(() => setOrderStatus('OUT_FOR_DELIVERY'), 5000);
    setTimeout(() => {
      const msg = `*ZOMATO STYLE ORDER: ${sessionOrderId}*%0A%0AItems: ${cart.map(i => i.name.en).join(', ')}%0A%0ATotal Bill: ₹${grandTotal.toFixed(0)}`;
      window.open(`https://api.whatsapp.com/send?phone=919877474778&text=${msg}`, '_blank');
      setCart([]); setView('HOME'); setOrderStatus(null);
    }, 7000);
  };

  return (
    <div className={`${isDark ? 'bg-[#0a0a0b] text-white' : 'bg-[#f3f4f6] text-black'} min-h-screen transition-all font-sans pb-40`}>
      <Head>
        <title>Flavour's Town Pro | Blinkit Edition</title>
      </Head>

      {/* HEADER: SWIGGY/BLINKIT STYLE */}
      <header className={`fixed top-0 w-full z-[1000] px-6 py-4 backdrop-blur-3xl border-b ${isDark ? 'bg-black/80 border-white/5' : 'bg-white/90 border-gray-200 shadow-sm'} flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <div className="bg-[#ff3269] h-11 w-11 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg">FT</div>
          <div>
            <h1 className="text-[14px] font-black uppercase tracking-tight leading-none">The Flavour's Town</h1>
            <p className="text-[10px] font-bold text-[#ff3269] mt-1 tracking-widest uppercase">Delivery in 15 Mins</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setIsAiOpen(true)} className="bg-orange-500/10 text-orange-500 px-4 py-2 rounded-xl text-[10px] font-black border border-orange-500/20">🤖 AI</button>
           <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-xl bg-zinc-800 text-white">{isDark ? '☀️' : '🌙'}</button>
        </div>
      </header>

      {view === 'HOME' ? (
        <main className="pt-28 px-4 max-w-7xl mx-auto space-y-12">
          {/* CATEGORY TABS: BLINKIT STYLE */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {["Chaap", "Tikka", "Rolls", "Snacks"].map(c => (
              <button key={c} className="bg-zinc-900 border border-white/5 px-6 py-3 rounded-2xl text-[11px] font-black uppercase whitespace-nowrap">{c}</button>
            ))}
          </div>

          {/* PRODUCT GRID: BLINKIT CARD STYLE */}
          {["Chaap", "Tikka", "Rolls", "Snacks"].map(cat => (
            <div key={cat} className="space-y-6">
              <h2 className="text-2xl font-black italic text-gray-400 uppercase tracking-tighter ml-2">{cat}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {initialMenuData.filter(i => i.category === cat).map(p => (
                  <div key={p.id} className={`${isDark ? 'bg-zinc-900/50 border-white/5 shadow-2xl' : 'bg-white shadow-md border-gray-100'} p-3 rounded-[2rem] border relative group`}>
                    <div className="h-44 rounded-[1.5rem] overflow-hidden mb-4 bg-zinc-800 relative">
                       <img src={p.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt="" />
                       <div className="absolute top-3 left-3 bg-[#ff3269] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Bestseller</div>
                    </div>
                    <div className="px-1">
                      <h3 className="text-xs font-black uppercase truncate mb-1">{p.name[lang]}</h3>
                      <p className="text-[9px] text-gray-500 mb-4 h-6 overflow-hidden leading-tight font-medium">{p.desc}</p>
                      <div className="flex justify-between items-center bg-black/20 p-2 rounded-2xl">
                         <span className="text-lg font-black text-orange-500 italic">₹{p.price}</span>
                         <button onClick={() => { haptic(); setCart([...cart, p]); }} className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-[#ff3269] hover:text-white transition-all">Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* FLOATING CART: ZOMATO STYLE */}
          <AnimatePresence>
            {subtotal > 0 && (
              <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-10 left-0 right-0 z-[1000] px-6">
                 <button onClick={() => setView('CHECKOUT')} className="w-full max-w-lg mx-auto bg-[#ff3269] p-5 rounded-[2rem] shadow-[0_30px_60px_rgba(255,50,105,0.4)] flex justify-between items-center text-white border-b-4 border-black/20">
                    <div className="flex items-center gap-4 ml-2">
                       <div className="text-left leading-none">
                          <p className="text-[10px] font-black uppercase opacity-60 mb-1">{cart.length} ITEM{cart.length > 1 ? 'S' : ''}</p>
                          <p className="text-2xl font-black italic">₹{grandTotal.toFixed(0)}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 font-black text-xs uppercase italic tracking-widest bg-black/10 px-6 py-3 rounded-xl">View Cart →</div>
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      ) : (
        /* --- THE PRO BILLING UI: ZOMATO/SWIGGY STYLE --- */
        <motion.div initial={{x:400}} animate={{x:0}} className="min-h-screen pt-24 px-6 pb-48 max-w-3xl mx-auto">
           <button onClick={() => setView('HOME')} className="mb-8 text-xs font-black uppercase text-gray-500 tracking-widest">← Back to Menu</button>
           
           <div className="space-y-6">
              {/* ITEM LIST */}
              <div className={`${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white shadow-xl border-gray-100'} p-8 rounded-[3rem] border`}>
                 <h2 className="text-xl font-black uppercase italic text-[#ff3269] mb-8">Order Summary</h2>
                 <div className="space-y-6">
                    {cart.map((c, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                           <p className="font-black text-sm uppercase italic">{c.name[lang]}</p>
                        </div>
                        <p className="font-black text-orange-500">₹{c.price}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* BILL BREAKDOWN: PRO STYLE */}
              <div className={`${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white shadow-xl border-gray-100'} p-8 rounded-[3rem] border space-y-4`}>
                 <h3 className="text-xs font-black uppercase opacity-40 tracking-widest mb-4">Bill Details</h3>
                 <div className="flex justify-between text-xs font-bold uppercase italic opacity-60">
                    <span>Item Total</span>
                    <span>₹{subtotal}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold uppercase italic text-blue-500">
                    <span>Delivery Fee (Malout Local)</span>
                    <span>₹{deliveryFee}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold uppercase italic opacity-60">
                    <span>GST & Restaurant Charges</span>
                    <span>₹{taxes.toFixed(0)}</span>
                 </div>
                 <div className="border-t border-white/5 pt-6 flex justify-between items-end">
                    <span className="text-sm font-black uppercase italic text-[#ff3269]">Total Amount</span>
                    <span className="text-5xl font-black italic tracking-tighter text-orange-500">₹{grandTotal.toFixed(0)}</span>
                 </div>
              </div>

              {/* PAYMENT CALL TO ACTION */}
              <div className="pt-10 space-y-4">
                 <p className="text-[10px] text-center font-bold uppercase text-gray-600 tracking-[0.4em] mb-4 italic">Ordering for Aashray Narang</p>
                 <button onClick={runOrderFlow} className="w-full bg-[#1A73E8] text-white py-10 rounded-[3.5rem] font-black uppercase text-xs italic shadow-2xl border-b-8 border-black/20 tracking-widest active:scale-95 transition-all">Pay with UPI / GPay</button>
                 <button onClick={runOrderFlow} className="w-full bg-[#25D366] text-white py-10 rounded-[3.5rem] font-black uppercase text-xs italic shadow-2xl border-b-8 border-black/20 tracking-widest active:scale-95 transition-all">Order on WhatsApp</button>
              </div>
           </div>
        </motion.div>
      )}

      {/* --- LIVE STATUS OVERLAY: REAL BLINKIT FEEL --- */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 z-[5000] flex flex-col items-center justify-center p-12 text-center backdrop-blur-xl">
             <div className="text-[10rem] mb-12 animate-pulse">
                {orderStatus === 'CONFIRMING' ? '📋' : orderStatus === 'PREPARING' ? '🥘' : '🚴'}
             </div>
             <h2 className="text-6xl font-black italic uppercase text-[#ff3269] mb-4 tracking-tighter">
                {orderStatus === 'CONFIRMING' ? 'Confirming Order' : orderStatus === 'PREPARING' ? 'In the Kitchen' : 'Out for Delivery'}
             </h2>
             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.5em] italic">Malout Express Delivery Active</p>
             <div className="w-full max-w-xl h-2 bg-zinc-900 rounded-full mt-10 overflow-hidden">
                <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration:7}} className="h-full bg-[#ff3269] shadow-[0_0_20px_#ff3269]"></motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* FOOTER: DEVELOPER BRANDING */}
      <footer className="mt-40 px-10 py-32 bg-zinc-950 border-t border-white/5 text-center">
        <h2 className="text-5xl font-black italic uppercase mb-12 tracking-tighter leading-tight transition-all hover:scale-105">
           <span className="opacity-40">built by</span> <br/>
           <span className="text-orange-600">aashray narang</span>
        </h2>
        <div className="flex justify-center gap-12 opacity-30 hover:opacity-100 transition-all scale-125">
           <a href="https://github.com/Object2005" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-11 h-11 invert" alt="" /></a>
           <a href="https://linkedin.com/in/aashray-narang" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-11 h-11" alt="" /></a>
        </div>
      </footer>
    </div>
  );
}