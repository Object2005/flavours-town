import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- ALL 19 ITEMS ---
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
      else alert("Only Aashray can access!");
    }
  };

  const total = menu.reduce((acc, item) => acc + (item.price * (cart[item.id] || 0)), 0);

  // PAYMENT LOGIC
  const handlePayment = (method) => {
    const details = menu.filter(i => cart[i.id]).map(i => `${i.name[lang]} (x${cart[i.id]})`).join('%0A');
    const msg = `*NEW ORDER*%0A${details}%0A*Total: ₹${total}*`;
    
    if(method === 'WhatsApp') {
        window.open(`https://wa.me/919877474778?text=${msg}`, '_blank');
    } else {
        const upiUrl = `upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${total}&cu=INR&tn=FoodOrder`;
        window.location.replace(upiUrl);
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-80 font-sans selection:bg-orange-500/30">
      <Head>
        <title>Flavour's Town | Built by Aashray</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      {/* HEADER: PHONE ON TOP & MODERN LOGO */}
      <header className="fixed top-0 w-full z-[100] px-4 py-3 backdrop-blur-2xl bg-white/80 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-orange-500 to-red-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">FT</div>
             <div>
                <h1 className="text-sm font-black tracking-tighter text-gray-900 leading-none">FLAVOUR'S<span className="text-orange-600 uppercase">Town</span></h1>
                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-1">Swaad Jo Yaad Rahe</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a href="tel:+919877474778" className="bg-green-50 text-green-600 px-3 py-2 rounded-xl text-[10px] font-black flex items-center gap-1 border border-green-100 shadow-sm">
               📞 98774-74778
            </a>
            <button onClick={handleAdminToggle} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shadow-inner">⚙️</button>
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav className="pt-24 pb-4 px-4 max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar relative z-30">
        {["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all shrink-0 ${activeCategory === cat ? 'bg-orange-600 text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100'}`}>
            {cat}
          </button>
        ))}
      </nav>

      {/* GRID: 2 COLUMNS MOBILE */}
      <main className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {menu.filter(i => activeCategory === "All" || i.category === activeCategory).map(item => (
          <motion.div layout key={item.id} className={`bg-white rounded-[2.2rem] p-3 shadow-xl border border-white relative transition-all ${!item.inStock ? 'opacity-40 grayscale' : ''}`}>
            <div className="relative rounded-[1.8rem] overflow-hidden mb-3 h-40 shadow-sm">
              <img src={item.img} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <h3 className="text-[11px] font-black mb-1 uppercase tracking-tighter h-8 flex items-center justify-center leading-tight text-gray-800">{item.name[lang]}</h3>
              <p className="text-orange-600 font-black text-lg italic mb-3 tracking-tighter">₹{item.price}</p>
              
              {!isAdmin ? (
                <div className="flex items-center justify-between bg-gray-50 p-1 rounded-xl border border-gray-100 shadow-inner">
                  <button onClick={() => setCart({...cart, [item.id]: Math.max(0, (cart[item.id] || 0) - 1)})} className="w-8 h-8 rounded-lg bg-white shadow-sm font-black text-orange-600 text-lg">-</button>
                  <span className="font-black text-xs text-gray-700">{cart[item.id] || 0}</span>
                  <button onClick={() => setCart({...cart, [item.id]: (cart[item.id] || 0) + 1})} disabled={!item.inStock} className="w-8 h-8 rounded-lg bg-orange-600 text-white shadow-md font-black text-lg">+</button>
                </div>
              ) : (
                <button onClick={() => setMenu(menu.map(m => m.id === item.id ? {...m, inStock: !m.inStock} : m))} className={`w-full py-2 rounded-xl text-[9px] font-black border-2 ${item.inStock ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                  {item.inStock ? "STOCK OFF" : "STOCK ON"}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </main>

      {/* DEVELOPER FOOTER */}
      <footer className="mt-20 px-6 py-20 bg-white border-t border-gray-100 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Designed & Engineered by</p>
        <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-10 text-gray-900">AASHRAY <span className="text-orange-600">NARANG</span></h2>
        
        <div className="flex justify-center gap-4 mb-10">
          <a href="https://github.com/Object2005" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black uppercase text-gray-500 shadow-sm">
             <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-4 h-4 opacity-50" /> GitHub
          </a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black uppercase text-blue-500 shadow-sm">
             <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-4 h-4" /> LinkedIn
          </a>
          <a href="mailto:aashraynarang@gmail.com" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black uppercase text-red-500 shadow-sm">
             <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-4 h-4" /> Email
          </a>
        </div>
        <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest italic">Digital Business Solution • 2026</p>
      </footer>

      {/* FLOATING CART */}
      <AnimatePresence>
        {total > 0 && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-8 left-4 right-4 z-[110] flex justify-center">
            <button onClick={() => setShowCheckout(true)} className="w-full max-w-md bg-orange-600 p-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(234,88,12,0.4)] flex justify-between items-center text-white ring-4 ring-white/20 active:scale-95 transition-all">
               <div className="flex items-center gap-4">
                  <div className="bg-white/20 h-12 w-12 rounded-2xl flex items-center justify-center text-2xl">🛍️</div>
                  <div className="text-left leading-none">
                    <p className="text-[8px] font-black uppercase opacity-70 mb-1">Items Total</p>
                    <p className="text-2xl font-black tracking-tighter">₹{total}</p>
                  </div>
               </div>
               <div className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg">Checkout</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-[4rem] max-w-sm w-full shadow-2xl border-t-8 border-orange-600">
              <h2 className="text-xl font-black uppercase italic mb-2 tracking-widest text-gray-800">Your Bill</h2>
              <p className="text-orange-600 font-black text-6xl mb-12 italic tracking-tighter underline decoration-gray-100">₹{total}</p>
              <div className="flex flex-col gap-4">
                  <button onClick={() => handlePayment('UPI')} className="w-full bg-[#1A73E8] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl flex flex-col items-center justify-center active:scale-95 transition-all leading-none">
                    <span>Pay via UPI App</span>
                    <span className="text-[7px] mt-1 opacity-70">(GPay, Paytm, PhonePe)</span>
                  </button>
                  <button onClick={() => handlePayment('WhatsApp')} className="w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">Order on WhatsApp</button>
                  <button onClick={() => setShowCheckout(false)} className="mt-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">Back to Menu</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}