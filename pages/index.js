import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

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
    if (isAdmin) setIsAdmin(false);
    else {
      const pass = prompt("Admin Password:");
      if (pass === "aashray778") setIsAdmin(true);
      else alert("Aashray Only!");
    }
  };

  const total = menu.reduce((acc, item) => acc + (item.price * (cart[item.id] || 0)), 0);

  const sendOrder = (method) => {
    const details = menu.filter(i => cart[i.id]).map(i => `${i.name[lang]} (x${cart[i.id]})`).join('%0A');
    const msg = `*NEW ORDER - THE FLAVOUR'S TOWN*%0A%0A${details}%0A%0A*Total: ₹${total}*%0A*Payment: ${method}*`;
    if(method === 'WhatsApp') window.open(`https://wa.me/919877474778?text=${msg}`, '_blank');
    else window.open(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${total}&cu=INR`, '_blank');
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-72 font-sans selection:bg-orange-500/30">
      <Head>
        <title>Flavour's Town | Malout's Elite Menu</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      {/* --- IMPROVED LOGO & TAGLINE --- */}
      <header className="fixed top-0 w-full z-[100] px-4 py-4 backdrop-blur-2xl bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-orange-500 to-red-600 h-11 w-11 rounded-[14px] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200 ring-2 ring-white">FT</div>
             <div>
                <h1 className="text-lg font-black tracking-tight text-gray-900 leading-none">FLAVOUR'S<span className="text-orange-600">TOWN</span></h1>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Swaad Jo Yaad Rahe</p>
             </div>
          </div>
          <button onClick={handleAdminToggle} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner transition-colors ${isAdmin ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-400'}`}>⚙️</button>
        </div>
      </header>

      {/* CATEGORY NAV */}
      <nav className="pt-28 pb-4 px-4 max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar relative z-30">
        {["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-7 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shrink-0 ${activeCategory === cat ? 'bg-orange-600 text-white shadow-xl shadow-orange-100 scale-105' : 'bg-white text-gray-400 border border-gray-100 shadow-sm'}`}>
            {cat}
          </button>
        ))}
      </nav>

      {/* MENU GRID */}
      <main className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {menu.filter(i => activeCategory === "All" || i.category === activeCategory).map(item => (
          <motion.div layout key={item.id} className={`bg-white rounded-[2.8rem] p-3 md:p-6 shadow-xl border border-white/50 relative transition-all ${!item.inStock ? 'opacity-40 grayscale' : ''}`}>
            <div className="relative rounded-[2.2rem] overflow-hidden mb-4 h-44 md:h-72 shadow-lg">
              <img src={item.img} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black text-white">⭐ {item.rating}</div>
            </div>
            <div className="text-center px-1">
              <h3 className="text-[12px] md:text-xl font-black mb-1 uppercase tracking-tighter h-8 flex items-center justify-center leading-tight">{item.name[lang]}</h3>
              <p className="text-orange-600 font-black text-xl md:text-3xl italic mb-4 tracking-tighter">₹{item.price}</p>
              
              {!isAdmin ? (
                <div className="flex items-center justify-between bg-gray-50 p-1 rounded-2xl border border-gray-100">
                  <button onClick={() => setCart({...cart, [item.id]: Math.max(0, (cart[item.id] || 0) - 1)})} className="w-10 h-10 rounded-xl bg-white shadow-md font-black text-orange-600 text-xl">-</button>
                  <span className="font-black text-sm">{cart[item.id] || 0}</span>
                  <button onClick={() => setCart({...cart, [item.id]: (cart[item.id] || 0) + 1})} disabled={!item.inStock} className="w-10 h-10 rounded-xl bg-orange-600 text-white shadow-lg font-black text-xl">+</button>
                </div>
              ) : (
                <button onClick={() => setMenu(menu.map(m => m.id === item.id ? {...m, inStock: !m.inStock} : m))} className={`w-full py-3 rounded-2xl text-[10px] font-black border-2 ${item.inStock ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                  {item.inStock ? "HIDE ITEM" : "SHOW ITEM"}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="mt-24 px-6 py-20 bg-white border-t border-gray-100 text-center">
        <div className="mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-4">Masterpiece by</p>
            <h2 className="text-3xl font-black italic text-gray-900 tracking-tighter">AASHRAY <span className="text-orange-600 underline decoration-gray-100 underline-offset-8">NARANG</span></h2>
        </div>
        
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://github.com/Object2005" target="_blank" className="p-4 bg-gray-50 rounded-2xl shadow-sm hover:scale-110 transition-transform flex items-center justify-center">🐙</a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="p-4 bg-gray-50 rounded-2xl shadow-sm hover:scale-110 transition-transform flex items-center justify-center">💼</a>
          <a href="tel:+919877474778" className="p-4 bg-gray-50 rounded-2xl shadow-sm hover:scale-110 transition-transform flex items-center justify-center">📞</a>
          <a href="https://maps.google.com/?q=The+Flavour's+Town+Malout" target="_blank" className="p-4 bg-gray-50 rounded-2xl shadow-sm hover:scale-110 transition-transform flex items-center justify-center">📍</a>
        </div>
        <p className="text-[10px] text-gray-400 font-bold italic uppercase tracking-widest">Malout's Smartest Food App • 2026</p>
      </footer>

      {/* CART BAR */}
      <AnimatePresence>
        {total > 0 && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-10 left-4 right-4 z-[110] flex justify-center">
            <button onClick={() => setShowCheckout(true)} className="w-full max-w-md bg-orange-600 p-6 rounded-[3.5rem] shadow-[0_25px_60px_-15px_rgba(234,88,12,0.5)] flex justify-between items-center text-white ring-4 ring-white/30 active:scale-95 transition-all">
               <div className="flex items-center gap-4 italic">
                  <div className="bg-white/20 h-14 w-14 rounded-2xl flex items-center justify-center text-3xl">🛒</div>
                  <div className="text-left"><p className="text-[9px] font-black uppercase opacity-70 mb-1">Bill Amount</p><p className="text-3xl font-black tracking-tighter text-white">₹{total}</p></div>
               </div>
               <div className="bg-white text-orange-600 px-8 py-4 rounded-[2rem] font-black text-[12px] uppercase shadow-lg">Checkout</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-6">
            <div className="bg-white p-12 rounded-[4.5rem] max-w-sm w-full shadow-2xl text-center border-t-[12px] border-orange-600">
              <h2 className="text-2xl font-black uppercase italic mb-2 tracking-tighter text-gray-800">Final Order</h2>
              <p className="text-orange-600 font-black text-6xl mb-12 italic tracking-tighter">₹{total}</p>
              <div className="flex flex-col gap-4">
                  <button onClick={() => sendOrder('WhatsApp')} className="w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">Order via WhatsApp</button>
                  <button onClick={() => sendOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all tracking-tighter">Pay via UPI App</button>
                  <button onClick={() => setShowCheckout(false)} className="mt-4 text-gray-400 text-[11px] font-black uppercase tracking-widest hover:text-red-500">Go Back</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}