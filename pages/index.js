import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- POORI 19 ITEMS KI LIST ---
const fullMenu = [
  { id: 1, category: "Chaap", name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, img: "/img/malai-chaap.jpg", inStock: true },
  { id: 2, category: "Chaap", name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, img: "/img/masala-chaap.jpg", inStock: true },
  { id: 3, category: "Chaap", name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, img: "/img/afghani-chaap.jpg", inStock: true },
  { id: 4, category: "Chaap", name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, img: "/img/achari-chaap.jpg", inStock: true },
  { id: 5, category: "Tikka", name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, img: "/img/paneer-tikka.jpg", inStock: true },
  { id: 6, category: "Tikka", name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, img: "/img/mushroom-tikka.jpg", inStock: true },
  { id: 7, category: "Rolls", name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, img: "/img/frankie.jpg", inStock: true },
  { id: 8, category: "Rolls", name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, img: "/img/paneer-roll.jpg", inStock: true },
  { id: 9, category: "Rolls", name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, img: "/img/chaap-roll.jpg", inStock: true },
  { id: 10, category: "Rolls", name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, img: "/img/mushroom-roll.jpg", inStock: true },
  { id: 11, category: "Snacks", name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, img: "/img/pav-bhaji.jpg", inStock: true },
  { id: 12, category: "Rolls", name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, img: "/img/twister.jpg", inStock: true },
  { id: 13, category: "Snacks", name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, img: "/img/kulcha.jpg", inStock: true },
  { id: 14, category: "Snacks", name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, img: "/img/cheese-chilli.jpg", inStock: true },
  { id: 15, category: "Snacks", name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, img: "/img/kacha-paneer.jpg", inStock: true },
  { id: 16, category: "Snacks", name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, img: "/img/paneer-fry.jpg", inStock: true },
  { id: 17, category: "Sweets", name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, img: "/img/gulab-jamun.jpg", inStock: true },
  { id: 18, category: "Sweets", name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, img: "/img/rabri-jamun.jpg", inStock: true },
  { id: 19, category: "Sweets", name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, img: "/img/gajrela.jpg", inStock: true }
];

const addonsList = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 },
  { id: 'r3', name: { en: "Butter Nan", pu: "ਬਟਰ ਨਾਨ" }, price: 30 },
  { id: 's1', name: { en: "Extra Sauce", pu: "ਵਾਧੂ ਚਟਨੀ" }, price: 0 },
  { id: 's2', name: { en: "Extra Spicy", pu: "ਜ਼ਿਆਦਾ ਮਿਰਚ" }, price: 0 },
  { id: 'p1', name: { en: "Packing", pu: "ਪੈਕਿੰਗ" }, price: 10 },
];

export default function Home() {
  const [cart, setCart] = useState({});
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCheckout, setShowCheckout] = useState(false);

  const total = fullMenu.reduce((acc, item) => acc + (item.price * (cart[item.id] || 0)), 0) + 
                addonsList.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  const handlePayment = (method) => {
    const itemDetails = fullMenu.filter(i => cart[i.id]).map(i => `${i.name[lang]} (x${cart[i.id]})`).join('%0A');
    const addonDetails = addonsList.filter(a => addons[a.id]).map(a => `${a.name[lang]} (x${addons[a.id]})`).join('%0A');
    const msg = `*FLAVOURS TOWN ORDER*%0A%0A*Items:*%0A${itemDetails}%0A%0A*Add-ons:*%0A${addonDetails}%0A%0A*Total: ₹${total}*`;
    
    if(method === 'WhatsApp') window.open(`https://wa.me/919877474778?text=${msg}`, '_blank');
    else window.location.replace(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${total}&cu=INR`);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-40 font-sans">
      <Head>
        <title>Flavour's Town | Malout</title>
        {/* --- TAB LOGO (FAVICON) START --- */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* --- TAB LOGO END --- */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[100] px-4 py-3 backdrop-blur-2xl bg-white/90 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
           <div className="bg-orange-600 h-9 w-9 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-200">FT</div>
           <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
              <button onClick={() => setLang('pu')} className={`px-2 py-1 rounded-md text-[8px] font-black ${lang === 'pu' ? 'bg-white shadow-sm' : 'text-gray-400'}`}>ਪੰ</button>
              <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-md text-[8px] font-black ${lang === 'en' ? 'bg-white shadow-sm' : 'text-gray-400'}`}>EN</button>
           </div>
        </div>
        <a href="tel:+919877474778" className="bg-green-50 text-green-600 px-3 py-2 rounded-xl text-[10px] font-black border border-green-100 shadow-sm">📞 98774-74778</a>
      </header>

      {/* ADD-ONS SECTION */}
      <section className="pt-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em] px-1 italic">
          {lang === 'pu' ? 'ਰੋਟੀ ਅਤੇ ਹੋਰ (Add-ons)' : 'ROTI & MORE (ADD-ONS)'}
        </h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
          {addonsList.map(ad => (
            <div key={ad.id} className="bg-white p-3 rounded-[1.8rem] shadow-lg border border-gray-50 min-w-[135px] text-center active:scale-95 transition-transform">
              <p className="text-[10px] font-black text-gray-800 mb-1 leading-tight">{ad.name[lang]}</p>
              <p className="text-orange-600 font-black text-xs mb-3">₹{ad.price}</p>
              <div className="flex justify-between items-center bg-gray-50 rounded-xl p-1 shadow-inner">
                <button onClick={() => setAddons({...addons, [ad.id]: Math.max(0, (addons[ad.id] || 0) - 1)})} className="w-7 h-7 bg-white rounded-lg shadow-sm text-orange-600 font-black">-</button>
                <span className="text-[10px] font-black text-gray-700">{addons[ad.id] || 0}</span>
                <button onClick={() => setAddons({...addons, [ad.id]: (addons[ad.id] || 0) + 1})} className="w-7 h-7 bg-orange-600 rounded-lg shadow-md text-white font-black">+</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY NAV */}
      <nav className="px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
        {["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest shrink-0 transition-all ${activeCategory === cat ? 'bg-orange-600 text-white shadow-xl shadow-orange-100 scale-105' : 'bg-white text-gray-400 border border-gray-100'}`}>
            {cat}
          </button>
        ))}
      </nav>

      {/* MENU GRID (MOBILE 2-COLUMN) */}
      <main className="px-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-7xl mx-auto">
        {fullMenu.filter(i => activeCategory === "All" || i.category === activeCategory).map(item => (
          <motion.div layout key={item.id} className="bg-white rounded-[2.5rem] p-3 shadow-2xl border border-white">
            <div className="relative rounded-[1.8rem] overflow-hidden mb-3 h-36 bg-gray-100 shadow-inner">
              <img src={item.img} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <h3 className="text-[10px] font-black mb-1 uppercase tracking-tighter h-8 flex items-center justify-center leading-none text-gray-800">{item.name[lang]}</h3>
              <p className="text-orange-600 font-black text-xl mb-3 italic tracking-tighter">₹{item.price}</p>
              <div className="flex items-center justify-between bg-gray-50 p-1 rounded-2xl shadow-inner border border-gray-100">
                <button onClick={() => setCart({...cart, [item.id]: Math.max(0, (cart[item.id] || 0) - 1)})} className="w-9 h-9 bg-white rounded-xl shadow-md text-orange-600 font-black text-xl">-</button>
                <span className="font-black text-sm text-gray-700">{cart[item.id] || 0}</span>
                <button onClick={() => setCart({...cart, [item.id]: (cart[item.id] || 0) + 1})} className="w-9 h-9 bg-orange-600 rounded-xl shadow-lg text-white font-black text-xl">+</button>
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      {/* PERSONAL DEVELOPER FOOTER */}
      <footer className="mt-20 px-6 py-20 bg-white border-t border-gray-50 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Designed & Built by</p>
        <h2 className="text-3xl font-black italic text-gray-900 tracking-tighter uppercase mb-8 leading-none">AASHRAY <span className="text-orange-600">NARANG</span></h2>
        <div className="flex justify-center gap-8 mb-10">
           <a href="https://github.com/Object2005" target="_blank" className="p-4 bg-gray-50 rounded-2xl shadow-sm hover:scale-110 transition-all">🐙</a>
           <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="p-4 bg-gray-50 rounded-2xl shadow-sm hover:scale-110 transition-all text-blue-600">💼</a>
           <a href="mailto:aashraynarang@gmail.com" className="p-4 bg-gray-50 rounded-2xl shadow-sm hover:scale-110 transition-all text-red-500">📧</a>
        </div>
        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em] italic underline decoration-orange-600/30 underline-offset-4">Digital Solutions • 2026</p>
      </footer>

      {/* FLOATING CART BAR */}
      <AnimatePresence>
        {total > 0 && (
          <motion.div 
            initial={{ y: 200, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-8 left-4 right-4 z-[110] flex justify-center"
          >
            <button onClick={() => setShowCheckout(true)} className="w-full max-w-md bg-orange-600 p-6 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(234,88,12,0.5)] flex justify-between items-center text-white ring-4 ring-white/20 active:scale-95 transition-all">
               <div className="flex items-center gap-4 italic ml-2">
                  <div className="bg-white/20 h-12 w-12 rounded-2xl flex items-center justify-center text-2xl">🛍️</div>
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase opacity-70 mb-1">Items Total</p>
                    <p className="text-3xl font-black tracking-tighter">₹{total}</p>
                  </div>
               </div>
               <div className="bg-white text-orange-600 px-8 py-4 rounded-[1.8rem] font-black text-[12px] uppercase shadow-lg">Order Now →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-6">
            <div className="bg-white p-12 rounded-[4.5rem] w-full max-w-sm shadow-2xl text-center border-t-[12px] border-orange-600">
              <h2 className="text-2xl font-black uppercase mb-2 tracking-tighter text-gray-800">Final Bill</h2>
              <p className="text-orange-600 font-black text-6xl mb-12 italic tracking-tighter underline decoration-gray-50">₹{total}</p>
              <div className="flex flex-col gap-4">
                  <button onClick={() => handlePayment('UPI')} className="w-full bg-[#1A73E8] text-white py-5 rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all leading-none">💳 Pay via UPI</button>
                  <button onClick={() => handlePayment('WhatsApp')} className="w-full bg-[#25D366] text-white py-5 rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">📱 WhatsApp</button>
                  <button onClick={() => setShowCheckout(false)} className="mt-4 text-gray-400 text-[11px] font-black uppercase tracking-widest hover:text-red-500">Back to Menu</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}