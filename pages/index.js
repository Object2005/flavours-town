import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- ALL 19 ITEMS WITH RATING & TIME ---
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

export default function Home() {
  const [menu, setMenu] = useState(fullMenu);
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState('pu');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customData, setCustomData] = useState({ spice: 'Medium', fat: 'Regular Butter', note: '' });

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

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-44 font-sans selection:bg-orange-100">
      <Head>
        <title>The Flavour's Town | Malout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* HEADER: UPDATED WITH 'THE' */}
      <header className="fixed top-0 w-full z-[100] px-4 py-3 backdrop-blur-xl bg-white/80 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
           <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-100 italic text-xl">FT</div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-tighter uppercase leading-none">The Flavour's Town</span>
              <span className="text-[7px] text-green-600 font-bold uppercase mt-1">100% PURE VEG 🌿</span>
           </div>
        </div>
        <div className="flex gap-2 items-center">
           <button onClick={() => setLang(lang==='pu'?'en':'pu')} className="text-[9px] font-black bg-gray-100 px-3 py-2 rounded-xl">{lang==='pu'?'EN':'ਪੰ'}</button>
           <button onClick={handleAdminToggle} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">⚙️</button>
        </div>
      </header>

      {/* CATEGORY NAV */}
      <nav className="pt-24 pb-4 px-4 max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
        {["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-full font-black text-[9px] uppercase transition-all shrink-0 ${activeCategory === cat ? 'bg-orange-600 text-white shadow-xl' : 'bg-white text-gray-400 border border-gray-100'}`}>
            {cat}
          </button>
        ))}
      </nav>

      {/* MENU GRID */}
      <main className="px-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-7xl mx-auto">
        {menu.filter(i => activeCategory === "All" || i.category === activeCategory).map(item => (
          <motion.div layout key={item.id} className={`bg-white rounded-[2.5rem] p-3 shadow-xl border border-white relative transition-all ${!item.inStock ? 'opacity-40 grayscale' : ''}`}>
            {item.best && <span className="absolute top-4 left-4 z-10 bg-yellow-400 text-[7px] font-black px-2 py-1 rounded-full shadow-sm">BEST SELLER</span>}
            <div className="relative rounded-[2rem] overflow-hidden mb-3 h-40 bg-gray-50">
              <img src={item.img} className="w-full h-full object-cover" alt={item.name.en} />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[8px] font-black">⭐ {item.rating}</div>
            </div>
            <div className="text-center px-1">
              <p className="text-[7px] font-bold text-gray-400 mb-1">⏱️ Ready in {item.time}</p>
              <h3 className="text-[11px] font-black uppercase mb-1 h-8 flex items-center justify-center leading-none text-gray-800 tracking-tighter">{item.name[lang]}</h3>
              <p className="text-orange-600 font-black text-xl mb-4 italic tracking-tighter">₹{item.price}</p>
              
              {isAdmin ? (
                <button onClick={() => setMenu(menu.map(m => m.id === item.id ? {...m, inStock: !m.inStock} : m))} className="w-full py-2 bg-gray-900 text-white rounded-xl text-[8px] font-black">{item.inStock ? "STOCK OFF" : "STOCK ON"}</button>
              ) : (
                <button onClick={() => setShowCustomizer(item)} className="w-full py-3 bg-gray-900 text-white rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest shadow-lg">Add +</button>
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
              <div className="w-16 h-1 bg-gray-100 rounded-full mx-auto mb-8"></div>
              <h2 className="text-2xl font-black italic uppercase mb-2 text-gray-900">{showCustomizer.name[lang]}</h2>
              <p className="text-[10px] font-bold text-gray-300 mb-8 tracking-[0.2em]">CUSTOMIZE YOUR TASTE</p>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase mb-3 px-1">🌶️ Spice Level</p>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map(s => (
                      <button key={s} onClick={() => setCustomData({...customData, spice: s})} className={`flex-1 py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${customData.spice === s ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'border-gray-50 text-gray-300'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase mb-3 text-gray-400 px-1">📝 Special Instructions</p>
                  <textarea className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] p-6 text-xs font-bold outline-none h-24" placeholder="e.g. Less Spicy, No Onions..." onChange={(e) => setCustomData({...customData, note: e.target.value})}></textarea>
                </div>
              </div>

              <button onClick={addToCart} className="w-full bg-orange-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl mt-8 mb-4">Add to Cart • ₹{showCustomizer.price}</button>
              <button onClick={() => setShowCustomizer(null)} className="w-full text-center text-[10px] font-black uppercase text-gray-300">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER: THE FLAVOUR'S TOWN BRANDING */}
      <footer className="mt-20 px-6 py-20 bg-white border-t border-gray-50 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-200 mb-4">Masterpiece by</p>
        <h2 className="text-2xl font-black italic text-gray-900 tracking-tighter uppercase mb-10">AASHRAY <span className="text-orange-600">NARANG</span></h2>
        
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://github.com/Object2005" target="_blank" className="p-4 bg-gray-50 rounded-2xl shadow-sm text-gray-500">
             <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="w-6 h-6 opacity-60" alt="git" />
          </a>
          <a href="https://linkedin.com/in/aashray-narang" target="_blank" className="p-4 bg-gray-50 rounded-2xl shadow-sm text-blue-600">
             <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-6 h-6" alt="in" />
          </a>
          <a href="mailto:aashraynarang@gmail.com" className="p-4 bg-gray-50 rounded-2xl shadow-sm text-red-500">
             <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" className="w-6 h-6" alt="mail" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10 text-[10px] font-black uppercase">
          <a href="http://googleusercontent.com/maps.google.com/7" target="_blank" className="bg-gray-100 py-4 rounded-[1.5rem] flex items-center justify-center gap-2">📍 Location</a>
          <a href="tel:+919877474778" className="bg-gray-100 py-4 rounded-[1.5rem] flex items-center justify-center gap-2">📞 Call Now</a>
        </div>
        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest italic tracking-tighter">The Flavour's Town • Malout • 2026</p>
      </footer>

      {/* FLOATING CART BAR */}
      <AnimatePresence>
        {total > 0 && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-8 left-4 right-4 z-[110] flex justify-center">
            <div className="w-full max-w-md bg-gray-900 p-6 rounded-[3rem] shadow-2xl flex justify-between items-center text-white ring-4 ring-white/10">
               <div className="flex items-center gap-4 italic ml-2">
                  <div className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-2xl">🛍️</div>
                  <div className="text-left leading-none">
                    <p className="text-[8px] font-black uppercase opacity-50 mb-1">{cart.length} ITEMS SELECTED</p>
                    <p className="text-3xl font-black tracking-tighter">₹{total}</p>
                  </div>
               </div>
               <button onClick={() => window.open(`https://wa.me/919877474778?text=Order from The Flavour's Town: ₹${total}`, '_blank')} className="bg-[#25D366] text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase shadow-xl tracking-widest">Order →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}