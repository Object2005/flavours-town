import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- SAARIYAN 19 ITEMS (RATING & PREP TIME DE NAAL) ---
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
  { id: 'r3', name: { en: "Butter Nan", pu: "ਬਟਰ ਨਾਨ" }, price: 30 },
  { id: 'p1', name: { en: "Special Packing", pu: "ਪੈਕਿੰਗ" }, price: 10 },
];

export default function Home() {
  const [menu, setMenu] = useState(fullMenu);
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customData, setCustomData] = useState({ spice: 'Medium', fat: 'Regular Butter', note: '' });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0) + 
                   addonsList.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);
  
  const finalTotal = subtotal - (subtotal * discount);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "FRESH10") {
      setDiscount(0.10);
      alert("Coupon FRESH10 Applied! 10% Discount 🎉");
    } else {
      alert("Invalid Coupon Code");
    }
  };

  const handleAdminToggle = () => {
    const pass = prompt("Admin Password:");
    if (pass === "aashray778") setIsAdmin(!isAdmin);
    else alert("Access Denied!");
  };

  const addToCart = () => {
    setCart([...cart, { ...showCustomizer, ...customData, uniqueId: Date.now() }]);
    setShowCustomizer(null);
    setCustomData({ spice: 'Medium', fat: 'Regular Butter', note: '' });
  };

  const handlePayment = (method) => {
    const itemDetails = cart.map(i => `${i.name[lang]} (${i.spice}, ${i.fat})${i.note ? ' - '+i.note : ''}`).join('%0A');
    const addonDetails = addonsList.filter(a => addons[a.id]).map(a => `${a.name[lang]} (x${addons[a.id]})`).join('%0A');
    const msg = `*NEW ORDER - THE FLAVOUR'S TOWN*%0A%0A${itemDetails}%0A%0A*Addons:*%0A${addonDetails}%0A%0A*Total: ₹${finalTotal}*`;
    
    if(method === 'WhatsApp') window.open(`https://wa.me/919877474778?text=${msg}`, '_blank');
    else window.location.replace(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${finalTotal}&cu=INR&tn=FoodOrder`);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-44 font-sans selection:bg-orange-100 overflow-x-hidden">
      <Head>
        <title>The Flavour's Town | 100% Pure Veg</title>
        {/* --- TAB LOGO FIX --- */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* HEADER: LOGO, ADMIN & LANG TOGGLE */}
      <header className="fixed top-0 w-full z-[100] px-4 py-3 backdrop-blur-xl bg-white/80 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
           <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }} className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg text-xl">FT</motion.div>
           <div className="flex flex-col leading-none">
              <span className="text-[10px] font-black tracking-tighter uppercase text-gray-900 underline decoration-orange-600 underline-offset-2">The Flavour's Town</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full border border-white outline outline-[1px] outline-green-600"></span>
                <span className="text-[7px] font-bold text-green-700 uppercase">100% PURE VEG 🌿</span>
              </div>
           </div>
        </div>
        <div className="flex gap-2 items-center">
           <button onClick={() => setLang(lang==='pu'?'en':'pu')} className="text-[9px] font-black bg-gray-100 px-3 py-2 rounded-xl transition-all active:scale-90">{lang==='pu'?'English':'ਪੰਜਾਬੀ'}</button>
           <button onClick={handleAdminToggle} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shadow-inner">⚙️</button>
        </div>
      </header>

      {/* MENU GRID */}
      <main className="pt-24 px-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-7xl mx-auto">
        {menu.map((item, index) => (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} key={item.id} className={`bg-white rounded-[2.5rem] p-3 shadow-xl border border-white relative transition-all ${!item.inStock ? 'opacity-40 grayscale' : ''}`}>
            {item.best && <span className="absolute top-4 left-4 z-10 bg-yellow-400 text-[7px] font-black px-2 py-1 rounded-full shadow-sm">BEST SELLER</span>}
            <div className="relative rounded-[2rem] overflow-hidden mb-3 h-40 bg-gray-50 shadow-inner">
              <img src={item.img} className="w-full h-full object-cover" alt={item.name.en} />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[8px] font-black">⭐ {item.rating}</div>
            </div>
            <div className="text-center px-1">
              <p className="text-[7px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Ready in {item.time}</p>
              <h3 className="text-[11px] font-black uppercase mb-1 h-8 flex items-center justify-center leading-none text-gray-800 tracking-tighter">{item.name[lang]}</h3>
              <p className="text-orange-600 font-black text-xl mb-4 italic tracking-tighter">₹{item.price}</p>
              
              {isAdmin ? (
                <button onClick={() => setMenu(menu.map(m => m.id === item.id ? {...m, inStock: !m.inStock} : m))} className={`w-full py-2 rounded-xl text-[8px] font-black border-2 ${item.inStock ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                  {item.inStock ? "STOCK OFF" : "STOCK ON"}
                </button>
              ) : (
                <button onClick={() => setShowCustomizer(item)} className="w-full py-3 bg-gray-900 text-white rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Add Item +</button>
              )}
            </div>
          </motion.div>
        ))}
      </main>

      {/* CUSTOMIZER DRAWER */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[200] flex items-end">
            <motion.div initial={{y:500}} animate={{y:0}} className="bg-white w-full rounded-t-[4rem] p-10 max-w-xl mx-auto shadow-2xl overflow-y-auto max-h-[85vh]">
              <div className="w-16 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
              <h2 className="text-2xl font-black italic uppercase mb-2 tracking-tighter text-gray-900">{showCustomizer.name[lang]}</h2>
              <p className="text-[10px] font-bold text-gray-300 mb-8 tracking-[0.3em] uppercase">Tailor Your Taste</p>

              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black uppercase mb-4 text-gray-400 tracking-widest">🌶️ Spice Intensity</p>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map(s => (
                      <button key={s} onClick={() => setCustomData({...customData, spice: s})} className={`flex-1 py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${customData.spice === s ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'border-gray-50 text-gray-300'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase mb-4 text-gray-400 tracking-widest">🧈 Cooking Fat</p>
                  <div className="flex gap-2">
                    {['Regular Butter', 'Extra Butter', 'Refined Oil'].map(f => (
                      <button key={f} onClick={() => setCustomData({...customData, fat: f})} className={`flex-1 py-4 rounded-2xl text-[9px] font-black border-2 transition-all ${customData.fat === f ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'border-gray-50 text-gray-300'}`}>{f}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase mb-4 text-gray-400 tracking-widest px-1">📝 Special Instructions</p>
                  <textarea placeholder="e.g. No onions, make it crispy..." className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] p-6 text-xs font-bold focus:border-orange-600 outline-none h-32 transition-all" onChange={(e) => setCustomData({...customData, note: e.target.value})}></textarea>
                </div>
              </div>

              <button onClick={addToCart} className="w-full bg-orange-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl mt-10 mb-4 active:scale-95 transition-all shadow-orange-200 text-sm">Confirm & Add • ₹{showCustomizer.price}</button>
              <button onClick={() => setShowCustomizer(null)} className="w-full text-center text-[10px] font-black uppercase text-gray-300 tracking-widest">Discard</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER: DEVELOPER BRANDING */}
      <footer className="mt-20 px-6 py-20 bg-white border-t border-gray-50 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Developed by</p>
        <h2 className="text-2xl font-black italic text-gray-900 tracking-tighter uppercase mb-10">AASHRAY <span className="text-orange-600">NARANG</span></h2>
        
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://github.com/Object2005" target="_blank" className="p-4 bg-gray-50 rounded-2xl shadow-sm hover:scale-110 transition-all text-gray-500 border border-gray-100">
             <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-6 h-6 opacity-60" alt="git" />
          </a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="p-4 bg-gray-50 rounded-2xl shadow-sm hover:scale-110 transition-all text-blue-600 border border-gray-100">
             <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-6 h-6" alt="in" />
          </a>
          <a href="mailto:aashraynarang@gmail.com" className="p-4 bg-gray-50 rounded-2xl shadow-sm hover:scale-110 transition-all text-red-500 border border-gray-100">
             <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-6 h-6" alt="mail" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10 text-[10px] font-black uppercase tracking-widest leading-none">
          <a href="http://googleusercontent.com/maps.google.com/9" target="_blank" className="bg-gray-50 py-4 rounded-[1.5rem] border border-gray-100 flex items-center justify-center gap-2 shadow-sm">📍 Location</a>
          <a href="tel:+919877474778" className="bg-gray-50 py-4 rounded-[1.5rem] border border-gray-100 flex items-center justify-center gap-2 shadow-sm">📞 Call Now</a>
        </div>
        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest italic tracking-tighter underline decoration-orange-600/30 underline-offset-8">Digital Business Solution • 2026</p>
      </footer>

      {/* FLOAT CART BAR */}
      <AnimatePresence>
        {subtotal > 0 && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-8 left-4 right-4 z-[110] flex justify-center">
            <button onClick={() => setShowCheckout(true)} className="w-full max-w-md bg-gray-900 p-6 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex justify-between items-center text-white ring-4 ring-white/10 active:scale-95 transition-all">
               <div className="flex items-center gap-4 italic ml-2">
                  <div className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-orange-600/30 font-serif font-black">🛍️</div>
                  <div className="text-left leading-none">
                    <p className="text-[8px] font-black uppercase opacity-50 mb-1">{cart.length} ITEMS ADDED</p>
                    <p className="text-3xl font-black tracking-tighter italic">₹{subtotal}</p>
                  </div>
               </div>
               <div className="bg-white text-gray-900 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase shadow-xl tracking-widest italic">Order →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL (ROTI / COUPONS / PAYMENT) */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[210] flex items-end">
            <motion.div initial={{y:500}} animate={{y:0}} exit={{y:500}} className="bg-white w-full rounded-t-[4rem] p-10 max-w-xl mx-auto shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="w-20 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
              <h2 className="text-xl font-black uppercase italic mb-8 text-gray-800 tracking-widest">Review Your Bill</h2>
              
              {/* ADDONS SELECTION */}
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-4 px-2 tracking-widest">Extra Roti / Packing</p>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                   {addonsList.map(ad => (
                     <div key={ad.id} className="min-w-[140px] bg-gray-50 p-5 rounded-[2.5rem] border border-gray-100 text-center shadow-sm">
                        <p className="text-[10px] font-black text-gray-700 mb-1 leading-tight h-6 flex items-center justify-center">{ad.name[lang]}</p>
                        <p className="text-orange-600 font-black text-xs mb-4 italic">₹{ad.price}</p>
                        <div className="flex justify-between items-center bg-white rounded-xl p-1 shadow-inner">
                          <button onClick={() => setAddons({...addons, [ad.id]: Math.max(0, (addons[ad.id] || 0) - 1)})} className="w-8 h-8 text-orange-600 font-black text-xl">-</button>
                          <span className="text-[10px] font-black">{addons[ad.id] || 0}</span>
                          <button onClick={() => setAddons({...addons, [ad.id]: (addons[ad.id] || 0) + 1})} className="w-8 h-8 text-orange-600 font-black text-xl">+</button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              {/* COUPON SECTION */}
              <div className="mb-8 bg-gray-50 p-5 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-between">
                <input placeholder="Code: FRESH10" className="bg-transparent text-xs font-black uppercase outline-none text-gray-800 w-28 placeholder:text-gray-300" onChange={(e) => setCoupon(e.target.value)} />
                <button onClick={applyCoupon} className="bg-orange-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-md transition-transform active:scale-95 shadow-orange-100">Apply</button>
              </div>

              <div className="flex justify-between items-end mb-12 px-2">
                 <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bill</p><p className="text-5xl font-black text-orange-600 italic tracking-tighter">₹{finalTotal}</p></div>
                 <button onClick={() => setShowCheckout(false)} className="text-[10px] font-black text-red-400 uppercase underline underline-offset-4 decoration-gray-100">Back</button>
              </div>

              <div className="flex flex-col gap-4 pb-4">
                  <button onClick={() => handlePayment('UPI')} className="w-full bg-[#1A73E8] text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all leading-none shadow-blue-100">💳 Pay via UPI</button>
                  <button onClick={() => handlePayment('WhatsApp')} className="w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-green-100">📱 WhatsApp Order</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}