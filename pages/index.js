import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- THE ULTIMATE 19 ITEMS LIST ---
const fullMenu = [
  { id: 1, category: "Chaap", name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, best: true, time: "15 min", img: "/img/malai-chaap.jpg", inStock: true },
  { id: 2, category: "Chaap", name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, best: false, time: "15 min", img: "/img/masala-chaap.jpg", inStock: true },
  { id: 3, category: "Chaap", name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, best: true, time: "18 min", img: "/img/afghani-chaap.jpg", inStock: true },
  { id: 4, category: "Chaap", name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, best: false, time: "15 min", img: "/img/achari-chaap.jpg", inStock: true },
  { id: 5, category: "Tikka", name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, best: true, time: "20 min", img: "/img/paneer-tikka.jpg", inStock: true },
  { id: 6, category: "Tikka", name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, best: false, time: "20 min", img: "/img/mushroom-tikka.jpg", inStock: true },
  { id: 7, category: "Rolls", name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, best: false, time: "10 min", img: "/img/frankie.jpg", inStock: true },
  { id: 8, category: "Rolls", name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, best: true, time: "12 min", img: "/img/paneer-roll.jpg", inStock: true },
  { id: 9, category: "Rolls", name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, best: false, time: "12 min", img: "/img/chaap-roll.jpg", inStock: true },
  { id: 10, category: "Rolls", name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, best: false, time: "12 min", img: "/img/mushroom-roll.jpg", inStock: true },
  { id: 11, category: "Snacks", name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, best: true, time: "10 min", img: "/img/pav-bhaji.jpg", inStock: true },
  { id: 12, category: "Rolls", name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, best: false, time: "10 min", img: "/img/twister.jpg", inStock: true },
  { id: 13, category: "Snacks", name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, best: false, time: "15 min", img: "/img/kulcha.jpg", inStock: true },
  { id: 14, category: "Snacks", name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, best: true, time: "25 min", img: "/img/cheese-chilli.jpg", inStock: true },
  { id: 15, category: "Snacks", name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, best: false, time: "5 min", img: "/img/kacha-paneer.jpg", inStock: true },
  { id: 16, category: "Snacks", name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, best: false, time: "15 min", img: "/img/paneer-fry.jpg", inStock: true },
  { id: 17, category: "Sweets", name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, best: true, time: "2 min", img: "/img/gulab-jamun.jpg", inStock: true },
  { id: 18, category: "Sweets", name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, best: true, time: "3 min", img: "/img/rabri-jamun.jpg", inStock: true },
  { id: 19, category: "Sweets", name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, best: false, time: "5 min", img: "/img/gajrela.jpg", inStock: true }
];

const addonsList = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 },
  { id: 'p1', name: { en: "Special Packing", pu: "ਪੈਕਿੰਗ" }, price: 10 },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customData, setCustomData] = useState({ spice: 'Medium', fat: 'Regular Butter', note: '' });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    setOrderId(`FT-${Math.floor(Math.random() * 9000) + 1000}`);
  }, []);

  // --- VIBRATION LOGIC ---
  const hapticFeedback = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  // --- PROGRESS BAR LOGIC ---
  useEffect(() => {
    if (orderStatus === 'Preparing') {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [orderStatus]);

  const filteredMenu = useMemo(() => {
    return fullMenu.filter(item => 
      item.name.en.toLowerCase().includes(search.toLowerCase()) || 
      item.name.pu.includes(search)
    );
  }, [search]);

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0) + 
                   addonsList.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);
  const finalTotal = subtotal - (subtotal * discount);

  const handleOrderAction = (method) => {
    hapticFeedback();
    setOrderStatus('Preparing');
    const itemsText = cart.map(i => `• ${i.name[lang]} (${i.spice})`).join('\n');
    const msg = `*THE FLAVOUR'S TOWN*\nOrder ID: ${orderId}\nItems:\n${itemsText}\nTotal: ₹${finalTotal}`;
    
    setTimeout(() => {
      setOrderStatus(null);
      if(method === 'WA') window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(msg)}`);
      else window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${finalTotal}&cu=INR`);
    }, 3000);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#fcfcfd] text-gray-900'} min-h-screen pb-44 transition-all duration-700 selection:bg-orange-500/30 overflow-x-hidden font-sans`}>
      <Head>
        <title>98774-74778 | The Flavour's Town</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* FLOATING SOCIAL BAR */}
      <div className="fixed right-6 bottom-36 z-[120] flex flex-col gap-5">
         <motion.a whileHover={{scale:1.2}} whileTap={{scale:0.9}} href="tel:+919877474778" className="bg-blue-600 w-14 h-14 rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] flex items-center justify-center text-2xl">📞</motion.a>
         <motion.a whileHover={{scale:1.2}} whileTap={{scale:0.9}} href="https://wa.me/919877474778" className="bg-green-600 w-14 h-14 rounded-2xl shadow-[0_10px_30px_rgba(22,163,74,0.4)] flex items-center justify-center text-2xl">💬</motion.a>
      </div>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-[100] px-4 py-4 backdrop-blur-2xl ${isDark ? 'bg-black/80 border-white/5 shadow-2xl' : 'bg-white/90 border-gray-100 shadow-xl'} border-b flex justify-between items-center`}>
        <div className="flex items-center gap-3">
           <motion.div 
             animate={{ rotateY: 360 }} 
             transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
             className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black italic shadow-orange-600/40 shadow-lg text-2xl"
           >FT</motion.div>
           <div className="flex flex-col">
              <span className="text-[13px] font-black uppercase tracking-tighter italic leading-none">The Flavour's Town</span>
              <span className="text-[8px] text-green-500 font-bold uppercase tracking-[0.2em] mt-1 animate-pulse italic">100% PURE VEG 🌿</span>
           </div>
        </div>
        <div className="flex gap-2 items-center">
           <button onClick={() => { hapticFeedback(); setIsDark(!isDark); }} className="p-2.5 bg-zinc-800 rounded-2xl text-xs shadow-inner hover:bg-zinc-700 transition-all">{isDark ? '☀️' : '🌙'}</button>
           <button onClick={() => { hapticFeedback(); setLang(lang==='pu'?'en':'pu'); }} className="text-[10px] font-black bg-orange-600 text-white px-4 py-2.5 rounded-2xl uppercase shadow-lg shadow-orange-600/20 active:scale-95 transition-all">{lang==='pu'?'EN':'ਪੰ'}</button>
           <button onClick={() => {const p = prompt("Aashray Pass:"); if(p==="aashray778") setIsAdmin(!isAdmin)}} className="w-5 h-5 opacity-5">⚙️</button>
        </div>
      </header>

      {/* SMART SEARCH SECTION */}
      <section className="pt-28 px-4 max-w-2xl mx-auto">
        <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className={`flex items-center px-6 py-5 rounded-[2.5rem] border transition-all ${isDark ? 'bg-zinc-900 border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]' : 'bg-white border-gray-200 shadow-2xl shadow-gray-100'}`}>
           <span className="mr-4 text-xl opacity-30">🔍</span>
           <input 
             type="text" 
             placeholder={lang === 'pu' ? "ਕੁਝ ਖਾਸ ਲੱਭ ਰਹੇ ਹੋ?..." : "Search for Malai Chaap, Tikka..."}
             className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase placeholder:opacity-20"
             onChange={(e) => setSearch(e.target.value)}
           />
        </motion.div>
      </section>

      {/* MAIN MENU */}
      <main className="mt-12 px-4 max-w-7xl mx-auto space-y-20 pb-44">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((cat) => (
          <div key={cat} className="space-y-10">
            <div className="flex items-center gap-4">
               <h2 className="text-4xl font-black italic uppercase tracking-tighter">{cat}</h2>
               <div className="h-1 flex-1 bg-gradient-to-r from-orange-600/40 to-transparent rounded-full"></div>
            </div>
            
            {filteredMenu.filter(i => i.category === cat).length === 0 && (
               <div className="text-center py-10 opacity-30 italic uppercase font-black text-xs">No items found in this section...</div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredMenu.filter(i => i.category === cat).map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id} 
                  className={`${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-gray-100 shadow-2xl shadow-gray-100'} rounded-[3.5rem] p-5 border relative group overflow-hidden`}
                >
                  {item.best && <span className="absolute top-6 left-6 z-10 bg-yellow-400 text-[8px] font-black px-3 py-1.5 rounded-full text-black shadow-lg italic">BEST SELLER</span>}
                  <div className="relative rounded-[2.5rem] overflow-hidden mb-6 h-48 bg-zinc-800 shadow-2xl">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" />
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-2 rounded-2xl text-[10px] font-black text-yellow-400 border border-white/10">⭐ {item.rating}</div>
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-sm font-black uppercase mb-2 h-10 flex items-center justify-center leading-none tracking-tighter italic">{item.name[lang]}</h3>
                    <p className="text-orange-500 font-black text-3xl mb-8 tracking-tighter italic">₹{item.price}</p>
                    <button 
                      onClick={() => { hapticFeedback(); setShowCustomizer(item); }} 
                      className="w-full py-5 bg-orange-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-[0_15px_30px_rgba(234,88,12,0.4)] active:scale-90 transition-all italic"
                    >Add To Cart</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* CUSTOMIZER DRAWER */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[300] flex items-end justify-center">
            <motion.div initial={{y:500}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950 border-t border-white/10' : 'bg-white'} w-full rounded-t-[5rem] p-12 max-w-xl shadow-2xl`}>
              <div className="w-20 h-1.5 bg-gray-800 rounded-full mx-auto mb-10"></div>
              <h2 className="text-4xl font-black italic uppercase mb-2 tracking-tighter text-orange-600">{showCustomizer.name[lang]}</h2>
              <p className="text-[11px] font-black opacity-40 mb-12 tracking-[0.4em] uppercase italic">Personalize Your Taste</p>
              
              <div className="space-y-12 mb-14">
                <div>
                  <p className="text-xs font-black uppercase mb-5 text-gray-500 tracking-widest px-2">🌶️ Spice Level</p>
                  <div className="flex gap-4">
                    {['Low', 'Medium', 'High'].map(s => (
                      <button key={s} onClick={() => { hapticFeedback(); setCustomData({...customData, spice: s}); }} className={`flex-1 py-6 rounded-[1.8rem] text-[11px] font-black border-4 transition-all ${customData.spice === s ? 'bg-orange-600 border-orange-600 text-white shadow-2xl' : 'border-zinc-800 text-gray-600'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="bg-orange-600/10 p-7 rounded-[3rem] border border-orange-600/20 flex items-center gap-5">
                   <motion.span animate={{scale:[1, 1.2, 1]}} transition={{repeat:Infinity}} className="text-4xl">💡</motion.span>
                   <p className="text-[10px] font-black leading-tight text-orange-500 uppercase italic tracking-wider">Aashray's Choice: add extra butter nan with this for elite taste!</p>
                </div>
              </div>

              <button onClick={() => { hapticFeedback(); setCart([...cart, {...showCustomizer, ...customData}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-8 rounded-[3rem] font-black uppercase shadow-2xl text-sm active:scale-95 transition-all mb-4 italic tracking-widest">Confirm & Add Item</button>
              <button onClick={() => setShowCustomizer(null)} className="w-full text-center text-[11px] font-black uppercase text-gray-500 tracking-widest italic underline underline-offset-8 mt-4">Discard Item</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOAT BILL BAR */}
      <AnimatePresence>
        {subtotal > 0 && !orderStatus && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="fixed bottom-8 left-4 right-4 z-[110] flex justify-center px-2">
            <button onClick={() => { hapticFeedback(); setShowCheckout(true); }} className="w-full max-w-md bg-white p-6 rounded-[3.8rem] shadow-[0_40px_80px_-15px_rgba(234,88,12,0.8)] flex justify-between items-center text-black ring-8 ring-orange-600/20 active:scale-95 transition-all overflow-hidden relative group">
               <div className="flex items-center gap-6 italic ml-3 text-left">
                  <div className="bg-orange-600 h-16 w-16 rounded-[2rem] flex items-center justify-center text-4xl shadow-xl text-white italic">🛍️</div>
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1 leading-none tracking-tighter">My Final Bill</p>
                    <p className="text-4xl font-black tracking-tighter text-black font-serif underline decoration-orange-600/30">₹{subtotal}</p>
                  </div>
               </div>
               <div className="bg-gray-900 text-white px-10 py-6 rounded-[2.2rem] font-black text-xs uppercase shadow-2xl tracking-widest italic font-black mr-1">Checkout →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MASTER DRAWER */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[210] flex items-end justify-center">
            <motion.div initial={{y:500}} animate={{y:0}} exit={{y:500}} className={`${isDark ? 'bg-zinc-950' : 'bg-white'} w-full rounded-t-[5rem] p-12 max-w-xl mx-auto shadow-2xl overflow-y-auto max-h-[92vh] border-t border-white/5`}>
              <h2 className="text-3xl font-black uppercase italic mb-10 text-orange-600 tracking-tighter underline decoration-white/10 underline-offset-8 decoration-4">Order Review</h2>
              
              <div className="mb-12 overflow-x-auto flex gap-6 no-scrollbar pb-4 px-2">
                 {addonsList.map(ad => (
                   <div key={ad.id} className={`${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 shadow-xl'} min-w-[170px] p-8 rounded-[3.5rem] border text-center shadow-inner`}>
                      <p className="text-[13px] font-black mb-1 italic uppercase tracking-tighter">{ad.name[lang]}</p>
                      <p className="text-orange-600 font-black text-sm mb-8 italic tracking-widest">₹{ad.price}</p>
                      <div className={`flex justify-between items-center ${isDark ? 'bg-black/60' : 'bg-white shadow-inner'} rounded-2xl p-2.5`}>
                        <button onClick={() => { hapticFeedback(); setAddons({...addons, [ad.id]: Math.max(0, (addons[ad.id] || 0) - 1)}); }} className="w-10 h-10 text-orange-600 font-black text-3xl">-</button>
                        <span className="text-[16px] font-black">{addons[ad.id] || 0}</span>
                        <button onClick={() => { hapticFeedback(); setAddons({...addons, [ad.id]: (addons[ad.id] || 0) + 1}); }} className="w-10 h-10 text-orange-600 font-black text-3xl">+</button>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="flex justify-between items-end mb-16 px-4 italic font-black">
                 <div><p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3 leading-none">Total Payment</p><p className="text-7xl font-black text-orange-600 tracking-tighter leading-none">₹{finalTotal}</p></div>
                 <button onClick={() => setShowCheckout(false)} className="text-[11px] font-black text-red-500 uppercase underline decoration-zinc-800 underline-offset-[12px] decoration-4 italic tracking-[0.2em]">Edit Items</button>
              </div>

              <div className="flex flex-col gap-5 pb-10 px-2">
                  <button onClick={() => handleOrderAction('UPI')} className="w-full bg-[#1A73E8] text-white py-8 rounded-[3rem] font-black uppercase shadow-2xl tracking-[0.3em] text-sm italic leading-none flex items-center justify-center gap-5 active:scale-95 transition-all shadow-blue-600/30 border border-white/10">💳 Pay via UPI</button>
                  <button onClick={() => handleOrderAction('WA')} className="w-full bg-[#25D366] text-white py-8 rounded-[3rem] font-black uppercase shadow-2xl tracking-[0.3em] text-sm italic leading-none flex items-center justify-center gap-5 active:scale-95 transition-all shadow-green-600/30 border border-white/10">📱 WhatsApp Bill</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREPARATION PROGRESS BAR */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 z-[600] flex flex-col items-center justify-center p-14 backdrop-blur-3xl overflow-hidden">
             <motion.div animate={{ scale:[1, 1.3, 1], rotate:[0, 10, -10, 0] }} transition={{repeat:Infinity, duration:2}} className="text-[12rem] mb-14 drop-shadow-[0_0_50px_rgba(234,88,12,0.4)]">🥘</motion.div>
             <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-6 text-orange-600 underline decoration-white/10 underline-offset-[16px] decoration-8">Cooking!</h2>
             <p className="text-sm text-gray-500 mb-16 uppercase tracking-[0.5em] font-black max-w-xs leading-loose italic opacity-60 text-center">Malout's finest taste is being prepared by Aashray's Master Chef...</p>
             <div className="w-72 h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative mb-16 shadow-2xl shadow-black">
                <motion.div initial={{width:0}} animate={{width:`${progress}%`}} className="h-full bg-orange-600 shadow-[0_0_40px_rgba(234,88,12,0.8)] rounded-full"></motion.div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-orange-600/40 animate-pulse">Initializing Order Transfer...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className={`mt-32 px-6 py-32 ${isDark ? 'bg-zinc-950 border-t border-white/5' : 'bg-white border-t border-gray-100 shadow-2xl shadow-black'} text-center overflow-hidden relative`}>
        <motion.div animate={{x:[-200, 200]}} transition={{repeat:Infinity, duration:20, ease:"linear"}} className="absolute top-10 left-0 text-[12rem] font-black opacity-[0.02] whitespace-nowrap italic pointer-events-none uppercase">THE FLAVOURS TOWN MALOUT</motion.div>
        <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-16 relative inline-block leading-none z-10">
          <span className={isDark ? 'text-white' : 'text-gray-900'}>AASHRAY </span> 
          <span className="text-orange-600 underline decoration-zinc-800 underline-offset-[16px] decoration-8 italic">NARANG</span>
        </h2>
        <div className="flex justify-center gap-14 mb-24 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 z-10 relative">
          <a href="https://github.com/Object2005" target="_blank" className="hover:scale-125 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className={`w-14 h-14 ${isDark ? 'invert' : ''}`} /></a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="hover:scale-125 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-14 h-14" /></a>
          <a href="mailto:aashraynarang@gmail.com" className="hover:scale-125 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-14 h-14" /></a>
        </div>
        <p className="text-[12px] text-gray-600 font-bold uppercase tracking-[0.8em] italic opacity-30 z-10 relative">Premium Digital Cuisine • Malout • 2026</p>
      </footer>
    </div>
  );
}