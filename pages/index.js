import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- TUMHARI SARI 19 ITEMS ---
const fullMenu = [
  { id: 1, category: "Chaap", name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, orders: 190, time: "15 min", img: "/img/malai-chaap.jpg", inStock: true },
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAdminToggle = () => {
    if (isAdmin) { setIsAdmin(false); } 
    else {
      const pass = prompt("Enter Admin Password:");
      if (pass === "aashray778") { setIsAdmin(true); } 
      else { alert("Galat Password!"); }
    }
  };

  const categories = ["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"];
  const total = menu.reduce((acc, item) => acc + (item.price * (cart[item.id] || 0)), 0);

  const sendOrder = () => {
    const details = menu.filter(i => cart[i.id]).map(i => `${i.name[lang]} (x${cart[i.id]})`).join('%0A');
    const msg = `*NEW ORDER - THE FLAVOUR'S TOWN*%0A%0A${details}%0A%0A*Total: ₹${total}*`;
    window.open(`https://wa.me/919877474778?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-44 font-sans">
      <Head>
        <title>Flavour's Town App</title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        
        {/* --- MANIFEST LINK ADDED HERE BY ME --- */}
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <header className="fixed top-0 w-full z-[100] px-4 py-4 backdrop-blur-3xl bg-white/70 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black italic tracking-tighter text-orange-600 uppercase">Flavour's Town</h1>
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-1 rounded-xl flex">
              <button onClick={() => setLang('pu')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black ${lang === 'pu' ? 'bg-orange-600 text-white' : 'text-gray-400'}`}>ਪੰ</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black ${lang === 'en' ? 'bg-orange-600 text-white' : 'text-gray-400'}`}>EN</button>
            </div>
            <button onClick={handleAdminToggle} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${isAdmin ? 'bg-orange-600 text-white' : 'bg-white text-gray-400'}`}>⚙️</button>
          </div>
        </div>
      </header>

      <nav className="pt-24 pb-4 px-4 max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar relative z-30">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeCategory === cat ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}>
            {cat}
          </button>
        ))}
      </nav>

      {/* MOBILE 2 COLUMN GRID */}
      <main className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-10">
        {menu.filter(i => activeCategory === "All" || i.category.includes(activeCategory)).map(item => (
          <motion.div layout key={item.id} className={`bg-white rounded-[2.5rem] p-4 md:p-6 shadow-xl border border-white transition-all ${!item.inStock ? 'opacity-40 grayscale' : ''}`}>
            <div className="relative rounded-[1.8rem] overflow-hidden mb-4 h-36 md:h-64 shadow-md">
              <img src={item.img} className="w-full h-full object-cover" />
              {item.orders > 200 && <div className="absolute bottom-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase">🔥 Best</div>}
            </div>

            <div className="text-center">
              <h3 className="text-[12px] md:text-xl font-black mb-1 uppercase tracking-tighter leading-tight h-8 flex items-center justify-center">{item.name[lang]}</h3>
              <p className="text-orange-600 font-black text-lg md:text-3xl italic mb-4">₹{item.price}</p>
              
              {isAdmin ? (
                <button onClick={() => setMenu(menu.map(m => m.id === item.id ? {...m, inStock: !m.inStock} : m))} className={`w-full py-2 rounded-xl text-[9px] font-black border ${item.inStock ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                  {item.inStock ? "OUT OF STOCK" : "IN STOCK"}
                </button>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                  <button onClick={() => setCart({...cart, [item.id]: Math.max(0, (cart[item.id] || 0) - 1)})} className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-white shadow-sm font-black text-orange-600">-</button>
                  <span className="font-black text-sm md:text-xl">{cart[item.id] || 0}</span>
                  <button onClick={() => setCart({...cart, [item.id]: (cart[item.id] || 0) + 1})} disabled={!item.inStock} className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-orange-600 text-white shadow-md font-black text-xl">+</button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </main>

      <AnimatePresence>
        {total > 0 && (
          <div className="fixed bottom-6 left-0 right-0 z-[100] px-4 flex justify-center">
            <button onClick={() => setShowCheckout(true)} className="max-w-4xl w-full bg-orange-600 p-5 md:p-8 rounded-[2.5rem] shadow-2xl flex justify-between items-center text-white">
               <div className="flex items-center gap-4 italic">
                  <div className="bg-white/20 h-12 w-12 md:h-20 md:w-20 rounded-2xl flex items-center justify-center text-xl md:text-4xl shadow-inner text-white">🍽️</div>
                  <div className="text-left leading-none">
                    <p className="text-[8px] md:text-[10px] font-black uppercase opacity-60 mb-1 text-white">My Bill</p>
                    <p className="text-2xl md:text-5xl font-black tracking-tighter text-white">₹{total}</p>
                  </div>
               </div>
               <div className="bg-white text-black px-6 md:px-12 py-3 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl">Order →</div>
            </button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-[3.5rem] max-w-sm w-full shadow-2xl">
              <h2 className="text-2xl font-black uppercase italic mb-6 text-gray-800">Final Order</h2>
              <p className="text-orange-600 font-black text-5xl mb-8 italic">₹{total}</p>
              <button onClick={sendOrder} className="w-full bg-green-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl mb-4 transition-all active:scale-95">Send on WhatsApp</button>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 text-[10px] font-black uppercase">Go Back</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}