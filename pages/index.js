import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- ALL 19 ITEMS WITH PRO DATA ---
const fullMenu = [
  { id: 1, category: "Chaap", name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, orders: 195, time: "15 min", img: "/img/malai-chaap.jpg", inStock: true },
  { id: 2, category: "Chaap", name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, orders: 120, time: "15 min", img: "/img/masala-chaap.jpg", inStock: true },
  { id: 3, category: "Chaap", name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, orders: 210, time: "18 min", img: "/img/afghani-chaap.jpg", inStock: true },
  { id: 4, category: "Chaap", name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, orders: 95, time: "15 min", img: "/img/achari-chaap.jpg", inStock: true },
  { id: 5, category: "Tikka", name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, orders: 320, time: "20 min", img: "/img/paneer-tikka.jpg", inStock: true },
  { id: 6, category: "Tikka", name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, orders: 110, time: "20 min", img: "/img/mushroom-tikka.jpg", inStock: true },
  { id: 7, category: "Rolls", name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, orders: 250, time: "10 min", img: "/img/frankie.jpg", inStock: true },
  { id: 8, category: "Rolls", name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, orders: 180, time: "12 min", img: "/img/paneer-roll.jpg", inStock: true },
  { id: 9, category: "Rolls", name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, orders: 140, time: "12 min", img: "/img/chaap-roll.jpg", inStock: true },
  { id: 10, category: "Rolls", name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, orders: 88, time: "12 min", img: "/img/mushroom-roll.jpg", inStock: true },
  { id: 11, category: "Snacks", name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, orders: 310, time: "10 min", img: "/img/pav-bhaji.jpg", inStock: true },
  { id: 12, category: "Rolls", name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, orders: 160, time: "10 min", img: "/img/twister.jpg", inStock: true },
  { id: 13, category: "Snacks", name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, orders: 135, time: "15 min", img: "/img/kulcha.jpg", inStock: true },
  { id: 14, category: "Snacks", name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, orders: 175, time: "25 min", img: "/img/cheese-chilli.jpg", inStock: true },
  { id: 15, category: "Snacks", name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, orders: 60, time: "5 min", img: "/img/kacha-paneer.jpg", inStock: true },
  { id: 16, category: "Snacks", name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, orders: 115, time: "15 min", img: "/img/paneer-fry.jpg", inStock: true },
  { id: 17, category: "Sweets", name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, orders: 450, time: "2 min", img: "/img/gulab-jamun.jpg", inStock: true },
  { id: 18, category: "Sweets", name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, orders: 280, time: "3 min", img: "/img/rabri-jamun.jpg", inStock: true },
  { id: 19, category: "Sweets", name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, orders: 220, time: "5 min", img: "/img/gajrela.jpg", inStock: true }
];

export default function Home() {
  const [menu, setMenu] = useState(fullMenu);
  const [cart, setCart] = useState({});
  const [lang, setLang] = useState('pu');
  const [theme, setTheme] = useState('light');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentType, setPaymentType] = useState(null);

  const categories = ["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"];
  const total = menu.reduce((acc, item) => acc + (item.price * (cart[item.id] || 0)), 0);
  const glass = theme === 'light' ? 'bg-white/70 backdrop-blur-3xl border-white/50 shadow-xl' : 'bg-black/60 backdrop-blur-3xl border-white/10 shadow-2xl';

  const sendOrder = (method) => {
    const details = menu.filter(i => cart[i.id]).map(i => `${i.name[lang]} (x${cart[i.id]})`).join('%0A');
    const msg = `*NEW ORDER - THE FLAVOUR'S TOWN*%0A%0A${details}%0A%0A*Total: ₹${total}*%0A_Payment: ${method}_`;
    window.open(`https://wa.me/919877474778?text=${msg}`, '_blank');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'} min-h-screen pb-44 transition-all duration-500 font-sans`}>
      <Head><title>Flavour's Town | Luxury Edition</title></Head>

      {/* HEADER: Language, Theme & Working Admin */}
      <header className="fixed top-0 w-full z-[100] px-6 py-6 backdrop-blur-3xl border-b border-white/20 bg-white/70 dark:bg-black/50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex bg-gray-200/50 dark:bg-white/10 p-1 rounded-2xl border border-gray-100 dark:border-white/10">
            <button onClick={() => setLang('pu')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition ${lang === 'pu' ? 'bg-orange-600 text-white shadow-lg' : 'opacity-40'}`}>ਪੰਜਾਬੀ</button>
            <button onClick={() => setLang('en')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition ${lang === 'en' ? 'bg-orange-600 text-white shadow-lg' : 'opacity-40'}`}>EN</button>
          </div>
          <h1 className="text-xl font-black italic tracking-tighter text-orange-600 hidden md:block">THE FLAVOUR'S TOWN</h1>
          <div className="flex gap-4 items-center">
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="text-xl p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">{theme === 'light' ? '🌙' : '☀️'}</button>
            <button onClick={() => setIsAdmin(!isAdmin)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${isAdmin ? 'bg-orange-600 text-white rotate-90 shadow-orange-500/40' : 'bg-gray-100 dark:bg-white/10 border-white/10'}`}>⚙️</button>
          </div>
        </div>
      </header>

      {/* HERO & LOCATION */}
      <section className="pt-48 pb-10 px-6 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-[9.5rem] font-black italic tracking-tighter leading-none mb-8 uppercase">
          Elite <span className="text-orange-600">Taste.</span>
        </motion.h2>
        <div className="flex justify-center gap-4">
           <a href="tel:+919877474778" className="bg-black dark:bg-white dark:text-black text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl transition hover:scale-105">📞 Call Us</a>
           <a href="http://google.com/maps" className="bg-white dark:bg-transparent dark:border-white/20 border border-gray-200 text-black dark:text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">📍 Location</a>
        </div>
      </section>

      {/* CATEGORY NAV */}
      <nav className="max-w-7xl mx-auto px-6 mb-16 flex gap-4 overflow-x-auto no-scrollbar py-6 relative z-30">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl transition-all border shrink-0 ${activeCategory === cat ? 'bg-orange-600 text-white border-orange-400 scale-110' : 'bg-white dark:bg-white/10 text-gray-400 border-gray-100 hover:border-orange-200'}`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* FULL GRID: 19 ITEMS */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {menu.filter(i => activeCategory === "All" || (i.category === activeCategory || (activeCategory === "Tikka" && i.category === "Paneer/Tikka"))).map(item => (
          <motion.div layout whileHover={{ y: -10 }} key={item.id} className={`rounded-[4.5rem] p-7 border transition-all duration-500 ${glass} ${!item.inStock ? 'opacity-30' : ''}`}>
            <div className="relative rounded-[3.5rem] overflow-hidden mb-8 h-72 group shadow-2xl">
              <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" onError={(e) => e.target.src=`https://placehold.co/400x400/orange/white?text=${item.name.en}`} />
              {item.orders > 150 && <div className="absolute bottom-5 left-6 bg-yellow-400 text-black px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-2xl">🔥 Best Seller</div>}
              <div className="absolute top-5 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black text-orange-600 shadow-md">⭐ {item.rating}</div>
              <div className="absolute top-5 right-6 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black text-white shadow-md italic">⏱️ {item.time}</div>
            </div>
            <div className="text-center px-2">
              <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter leading-none">{item.name[lang]}</h3>
              <p className="text-orange-600 font-black text-4xl italic mb-10 tracking-tighter leading-none">₹{item.price}</p>
              
              <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 p-3 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-inner">
                <button onClick={() => setCart({...cart, [item.id]: Math.max(0, (cart[item.id] || 0) - 1)})} className="w-14 h-14 rounded-full bg-white dark:bg-white/10 shadow-lg font-black text-2xl text-orange-600 hover:scale-110 transition">-</button>
                <span className="font-black text-2xl w-10">{cart[item.id] || 0}</span>
                <button onClick={() => setCart({...cart, [item.id]: (cart[item.id] || 0) + 1})} disabled={!item.inStock} className="w-14 h-14 rounded-full bg-orange-600 text-white shadow-xl font-black text-2xl hover:scale-110 transition shadow-orange-500/30">+</button>
              </div>

              {isAdmin && (
                <button onClick={() => setMenu(menu.map(m => m.id === item.id ? {...m, inStock: !m.inStock} : m))} className={`mt-6 w-full py-4 rounded-3xl font-black text-[10px] uppercase border transition ${item.inStock ? 'border-red-500 text-red-500 bg-red-50' : 'border-green-500 text-green-500 bg-green-50'}`}>
                  {item.inStock ? "Set Out of Stock" : "Set In Stock"}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </main>

      {/* FLOAT BAR & MODAL: DESELECT ALL + WORKING ORDER NOW */}
      <AnimatePresence>
        {total > 0 && !showCheckout && (
          <motion.div initial={{ y: 150 }} animate={{ y: 0 }} exit={{ y: 150 }} className="fixed bottom-10 left-0 right-0 z-[100] px-6 flex flex-col items-center gap-4">
            <button onClick={() => setCart({})} className="bg-red-500/10 text-red-500 border border-red-500/20 px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-500 hover:text-white transition-all">Deselect All Items</button>
            <button onClick={() => setShowCheckout(true)} className="max-w-4xl w-full bg-orange-600 p-8 rounded-[4rem] shadow-[0_40px_100px_rgba(234,88,12,0.4)] flex justify-between items-center text-white transition-all active:scale-95 group overflow-hidden">
               <div className="flex items-center gap-8 italic relative z-10">
                  <div className="bg-white/20 h-20 w-20 rounded-[2.2rem] flex items-center justify-center text-4xl shadow-inner">🍽️</div>
                  <div className="text-left leading-none"><p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">My Total Bill</p><p className="text-6xl font-black tracking-tighter italic">₹{total}</p></div>
               </div>
               <div className="bg-white text-black px-12 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl group-hover:bg-black group-hover:text-white transition-all relative z-10">Checkout Now →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL: QR & WHATSAPP */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[200] flex items-center justify-center p-6 text-center">
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className="bg-white p-12 rounded-[5rem] max-w-sm w-full text-black shadow-2xl relative">
              <h2 className="text-4xl font-black italic mb-2 tracking-tighter uppercase leading-none">Grand Summary</h2>
              <p className="text-orange-600 font-black text-5xl mb-12 tracking-tighter italic">₹{total}</p>
              {!paymentType ? (
                <div className="flex flex-col gap-4">
                  <button onClick={() => setPaymentType('upi')} className="w-full bg-orange-600 text-white py-7 rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Scan UPI QR Code</button>
                  <button onClick={() => sendOrder('whatsapp')} className="w-full bg-green-600 text-white py-7 rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all italic underline underline-offset-4 decoration-white/30 text-xs">Direct WhatsApp Order</button>
                </div>
              ) : (
                <div className="animate-slideUp">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=9877474778@paytm&pn=Aashray&am=${total}&cu=INR`} alt="QR" className="mx-auto mb-10 p-4 bg-gray-50 rounded-[3.5rem] border-2 border-dashed border-gray-200" />
                  <button onClick={() => sendOrder('upi')} className="w-full bg-green-600 text-white py-6 rounded-3xl font-black shadow-xl italic tracking-widest uppercase">I've Sent Payment ✅</button>
                </div>
              )}
              <button onClick={() => {setShowCheckout(false); setPaymentType(null);}} className="mt-12 text-gray-300 font-black text-[10px] uppercase tracking-[0.4em] hover:text-black transition-all">Cancel & Return</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}