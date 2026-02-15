import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- THE ULTIMATE 19 ITEMS LIST (ALL CATEGORIES) ---
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
  const [menu, setMenu] = useState(fullMenu);
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [couponsEnabled, setCouponsEnabled] = useState(true);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [customData, setCustomData] = useState({ spice: 'Medium', fat: 'Regular Butter', note: '' });
  const [couponInput, setCouponInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    setOrderId(`FT-${Math.floor(Math.random() * 9000) + 1000}`);
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0) + 
                   addonsList.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);
  const finalTotal = subtotal - (subtotal * discount);

  const handleOrder = () => {
    setOrderStatus('Preparing');
    setTimeout(() => {
      const items = cart.map(i => `• ${i.name[lang]} (${i.spice})`).join('%0A');
      const ads = addonsList.filter(a => addons[a.id]).map(a => `${a.name[lang]} (x${addons[a.id]})`).join('%0A');
      window.open(`https://wa.me/919877474778?text=*ORDER ID:* ${orderId}%0A*ITEMS:*%0A${items}%0A*ADDONS:*%0A${ads}%0A*TOTAL: ₹${finalTotal}*`, '_blank');
      setOrderStatus(null);
    }, 2500);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#fcfcfd] text-gray-900'} min-h-screen pb-44 transition-colors duration-500 font-sans selection:bg-orange-600/30`}>
      <Head>
        <title>CALL: 98774-74778 | The Flavour's Town</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-[100] px-4 py-3 backdrop-blur-xl ${isDark ? 'bg-black/60 border-white/10' : 'bg-white/80 border-gray-100'} border-b flex justify-between items-center shadow-sm`}>
        <div className="flex items-center gap-3">
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg text-xl shadow-orange-600/20">FT</motion.div>
           <div className="flex flex-col leading-none">
              <span className="text-[11px] font-black uppercase tracking-tighter underline decoration-orange-600 underline-offset-2 tracking-widest">The Flavour's Town</span>
              <span className="text-[7px] text-green-500 font-bold uppercase mt-1 tracking-widest leading-none">100% PURE VEG 🌿</span>
           </div>
        </div>
        <div className="flex gap-2 items-center">
           <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-xl transition-all ${isDark ? 'bg-zinc-800 text-yellow-400' : 'bg-gray-100 text-gray-400'}`}>{isDark ? '☀️' : '🌙'}</button>
           <button onClick={() => setLang(lang==='pu'?'en':'pu')} className="text-[9px] font-black bg-orange-600 text-white px-3 py-2 rounded-xl uppercase shadow-lg">{lang==='pu'?'EN':'ਪੰ'}</button>
           <button onClick={() => {const p = prompt("Pass:"); if(p==="aashray778") setIsAdmin(!isAdmin)}} className={`w-9 h-9 rounded-full flex items-center justify-center ${isAdmin ? 'bg-orange-600 text-white animate-spin' : 'bg-gray-50 text-gray-400 opacity-20'}`}>⚙️</button>
        </div>
      </header>

      {/* DEALS SLIDER */}
      <section className="pt-24 px-4 overflow-x-auto no-scrollbar flex gap-4 max-w-7xl mx-auto">
        <div className="min-w-[85%] md:min-w-[400px] h-44 bg-gradient-to-br from-orange-500 to-red-600 rounded-[3rem] p-8 flex flex-col justify-center text-white shadow-2xl shadow-orange-600/30 relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 bg-white/10 h-24 w-24 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
           <p className="text-[10px] font-black uppercase opacity-80 mb-1 tracking-widest">Special Deal</p>
           <h2 className="text-3xl font-black italic tracking-tighter leading-none mb-4 uppercase">20% OFF ON ALL<br/>CHEEP ITEMS</h2>
           <span className="bg-white text-orange-600 text-[10px] font-black px-4 py-2 rounded-full w-fit shadow-md uppercase">Code: FRESH10</span>
        </div>
        <div className="min-w-[85%] md:min-w-[400px] h-44 bg-gradient-to-br from-zinc-800 to-black rounded-[3rem] p-8 flex flex-col justify-center text-white shadow-2xl border border-white/5 relative overflow-hidden">
           <p className="text-[10px] font-black uppercase text-orange-500 mb-1 tracking-widest italic font-bold">Best Seller</p>
           <h2 className="text-3xl font-black italic tracking-tighter leading-none mb-4 uppercase underline decoration-orange-600 underline-offset-8">BUY 2 GET 1 FREE<br/>ON GULAB JAMUN</h2>
           <span className="bg-orange-600 text-white text-[10px] font-black px-4 py-2 rounded-full w-fit shadow-md uppercase tracking-widest">LIMITED OFFER</span>
        </div>
      </section>

      {/* MENU CATEGORIES (ALL 19 ITEMS) */}
      <main className="mt-14 px-4 max-w-7xl mx-auto space-y-16">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((cat) => (
          <div key={cat} className="space-y-8">
            <h2 className={`text-3xl font-black italic uppercase border-l-8 border-orange-600 pl-4 tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>{cat}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {menu.filter(i => i.category === cat).map((item, idx) => (
                <motion.div whileTap={{scale:0.95}} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} key={item.id} className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-xl'} rounded-[3rem] p-4 border relative group transition-all`}>
                  {item.best && <span className="absolute top-5 left-5 z-10 bg-yellow-400 text-[8px] font-black px-3 py-1.5 rounded-full text-black shadow-lg">BEST SELLER</span>}
                  <div className="relative rounded-[2.2rem] overflow-hidden mb-4 h-40 bg-zinc-800">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" alt={item.name.en} />
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-xl text-[9px] font-black text-black shadow-lg">⭐ {item.rating}</div>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-bold text-gray-500 mb-1 uppercase italic tracking-tighter">Ready in {item.time}</p>
                    <h3 className="text-[12px] font-black uppercase mb-1 h-10 flex items-center justify-center leading-none tracking-tighter">{item.name[lang]}</h3>
                    <p className="text-orange-500 font-black text-2xl mb-5 italic tracking-tighter">₹{item.price}</p>
                    {isAdmin ? (
                      <button onClick={() => setMenu(menu.map(m => m.id === item.id ? {...m, inStock: !m.inStock} : m))} className={`w-full py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${item.inStock ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                        {item.inStock ? "STOCK OFF" : "STOCK ON"}
                      </button>
                    ) : (
                      <button onClick={() => setShowCustomizer(item)} className="w-full py-4 bg-orange-600 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all italic tracking-tighter leading-none">Add to Bill +</button>
                    )}
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
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[250] flex items-end justify-center">
            <motion.div initial={{y:500}} animate={{y:0}} className={`${isDark ? 'bg-zinc-900 border-t border-white/10' : 'bg-white'} w-full rounded-t-[4rem] p-10 max-w-xl shadow-2xl`}>
              <div className="w-20 h-1.5 bg-gray-700 rounded-full mx-auto mb-8"></div>
              <h2 className="text-3xl font-black italic uppercase mb-2 tracking-tighter">{showCustomizer.name[lang]}</h2>
              <p className="text-[10px] font-black text-orange-600 mb-10 tracking-[0.3em] uppercase underline underline-offset-8 decoration-white/10 italic">Custom Your Taste</p>
              <div className="space-y-10 mb-12">
                <div>
                  <p className="text-[10px] font-black uppercase mb-4 text-gray-500 tracking-widest">🌶️ Spice Intensity</p>
                  <div className="flex gap-3">
                    {['Low', 'Medium', 'High'].map(s => (
                      <button key={s} onClick={() => setCustomData({...customData, spice: s})} className={`flex-1 py-5 rounded-[1.8rem] text-[10px] font-black border-4 transition-all ${customData.spice === s ? 'bg-orange-600 border-orange-600 text-white shadow-2xl' : 'border-zinc-800 text-gray-500'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="bg-orange-600/10 p-6 rounded-[2.5rem] border border-orange-600/20 flex items-center gap-4">
                   <span className="text-3xl animate-bounce">💡</span>
                   <p className="text-[10px] font-black leading-tight text-orange-500 uppercase italic">Pro Tip: add Butter Nan with this for the best taste!</p>
                </div>
              </div>
              <button onClick={() => {setCart([...cart, showCustomizer]); setShowCustomizer(null)}} className="w-full bg-orange-600 text-white py-7 rounded-[2.8rem] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all text-sm mb-4 leading-none italic font-black">Confirm & Add • ₹{showCustomizer.price}</button>
              <button onClick={() => setShowCustomizer(null)} className="w-full text-center text-[10px] font-black uppercase text-gray-500 tracking-widest italic underline decoration-gray-800 underline-offset-8">Discard</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT DRAWER */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[210] flex items-end justify-center">
            <motion.div initial={{y:500}} animate={{y:0}} exit={{y:500}} className={`${isDark ? 'bg-zinc-900 border-t border-white/10' : 'bg-white'} w-full rounded-t-[4rem] p-10 max-w-xl mx-auto shadow-2xl overflow-y-auto max-h-[90vh]`}>
              <div className="w-20 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
              <h2 className="text-2xl font-black uppercase italic mb-8 underline decoration-orange-600 decoration-4 underline-offset-8">Order ID: {orderId}</h2>
              <div className="mb-8 overflow-x-auto flex gap-4 no-scrollbar pb-2 px-1">
                 {addonsList.map(ad => (
                   <div key={ad.id} className={`${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'} min-w-[145px] p-5 rounded-[2.5rem] border text-center`}>
                      <p className="text-[11px] font-black mb-1 italic">{ad.name[lang]}</p>
                      <p className="text-orange-600 font-black text-xs mb-4 italic">₹{ad.price}</p>
                      <div className={`flex justify-between items-center ${isDark ? 'bg-black/40' : 'bg-white shadow-inner'} rounded-xl p-1`}>
                        <button onClick={() => setAddons({...addons, [ad.id]: Math.max(0, (addons[ad.id] || 0) - 1)})} className="w-8 h-8 text-orange-600 font-black text-xl">-</button>
                        <span className="text-[11px] font-black">{addons[ad.id] || 0}</span>
                        <button onClick={() => setAddons({...addons, [ad.id]: (addons[ad.id] || 0) + 1})} className="w-8 h-8 text-orange-600 font-black text-xl">+</button>
                      </div>
                   </div>
                 ))}
              </div>
              <div className={`mb-8 p-6 rounded-[2rem] border-2 border-dashed flex items-center justify-between ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <input placeholder="Code: FRESH10" className="bg-transparent text-xs font-black uppercase outline-none w-32 placeholder:text-gray-500" onChange={(e) => setCouponInput(e.target.value)} />
                <button onClick={() => {if(couponInput.toUpperCase()==='FRESH10') setDiscount(0.1); else alert('Invalid')}} className="bg-orange-600 text-white px-7 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-orange-600/30">Apply</button>
              </div>
              <div className="flex justify-between items-end mb-12 px-2 italic font-black">
                 <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Total Bill</p><p className="text-6xl font-black text-orange-600 tracking-tighter">₹{finalTotal}</p></div>
                 <button onClick={() => setShowCheckout(false)} className="text-[10px] font-black text-red-500 uppercase underline decoration-gray-100 underline-offset-8 tracking-widest">Back</button>
              </div>
              <div className="flex flex-col gap-4 pb-4">
                  <button onClick={() => window.location.replace(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${finalTotal}&cu=INR&tn=Order_${orderId}`)} className="w-full bg-[#1A73E8] text-white py-6 rounded-[2.5rem] font-black uppercase shadow-xl shadow-blue-600/20 italic tracking-widest text-sm leading-none">💳 Pay via UPI</button>
                  <button onClick={handleOrder} className="w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-black uppercase shadow-xl shadow-green-600/20 italic tracking-widest text-sm leading-none">📱 Confirm Order<br/><span className="text-[7px] opacity-70 italic tracking-widest mt-1">Order on WhatsApp</span></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOAT BILL BAR */}
      <AnimatePresence>
        {subtotal > 0 && !orderStatus && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="fixed bottom-8 left-4 right-4 z-[110] flex justify-center">
            <button onClick={() => setShowCheckout(true)} className="w-full max-w-md bg-white p-6 rounded-[3.5rem] shadow-[0_30px_70px_-15px_rgba(234,88,12,0.6)] flex justify-between items-center text-black ring-8 ring-orange-600/20 active:scale-95 transition-all">
               <div className="flex items-center gap-5 italic ml-3 text-left">
                  <div className="bg-orange-600 h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg font-black text-white italic">🛍️</div>
                  <div><p className="text-[9px] font-black uppercase opacity-60 mb-1 tracking-tighter">ORDER ID: {orderId}</p><p className="text-4xl font-black italic tracking-tighter font-serif">₹{subtotal}</p></div>
               </div>
               <div className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase shadow-xl tracking-widest italic font-black shadow-black/20">Review →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ORDER TRACKING OVERLAY */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 z-[300] flex flex-col items-center justify-center p-10 text-center backdrop-blur-3xl">
             <motion.div animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-8xl mb-8">👨‍🍳</motion.div>
             <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-orange-600 underline decoration-white/10 underline-offset-8 decoration-8">Chef is Preparing!</h2>
             <p className="text-xs text-gray-400 mb-12 uppercase tracking-widest font-black max-w-xs leading-relaxed italic opacity-70 font-serif">Aashray Narang's best taste is being cooked with love just for you...</p>
             <div className="w-48 h-1.5 bg-zinc-800 rounded-full mb-12 overflow-hidden border border-white/5">
                <motion.div initial={{x:-200}} animate={{x:200}} transition={{repeat:Infinity, duration:2}} className="w-24 h-full bg-orange-600 shadow-lg shadow-orange-600/50 rounded-full"></motion.div>
             </div>
             <button onClick={() => setOrderStatus(null)} className="text-orange-600 text-[10px] font-black uppercase underline decoration-zinc-700 underline-offset-8 tracking-widest italic opacity-50 hover:opacity-100 transition-all">Cancel Tracking</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className={`mt-20 px-6 py-24 ${isDark ? 'bg-zinc-950 border-t border-white/5' : 'bg-white border-t border-gray-100'} text-center`}>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-500 mb-4 opacity-50 italic">Digital Design By</p>
        <h2 className="text-3xl font-black italic text-gray-900 tracking-tighter uppercase mb-12 relative inline-block leading-none">
          <span className={isDark ? 'text-white' : 'text-gray-900'}>AASHRAY </span> 
          <span className="text-orange-600 underline decoration-zinc-800 underline-offset-8 decoration-4">NARANG</span>
        </h2>
        <div className="flex justify-center gap-10 mb-16 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <a href="https://github.com/Object2005" target="_blank" className="text-4xl">🐙</a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="text-4xl">💼</a>
          <a href="mailto:aashraynarang@gmail.com" className="text-4xl">📧</a>
        </div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] italic leading-none opacity-40">The Flavour's Town • Malout • 2026</p>
      </footer>
    </div>
  );
}