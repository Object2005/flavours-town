import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- FULL 19 ITEMS LIST ---
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

export default function Home() {
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState('pu');
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customData, setCustomData] = useState({ spice: 'Medium', fat: 'Regular Butter', cream: false, note: '' });

  const addToCart = () => {
    setCart([...cart, { ...showCustomizer, ...customData, uniqueId: Date.now() }]);
    setShowCustomizer(null);
    setCustomData({ spice: 'Medium', fat: 'Regular Butter', cream: false, note: '' });
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handlePayment = (method) => {
    const details = cart.map(i => `${i.name[lang]} (${i.spice}, ${i.fat})${i.note ? ' Note: '+i.note : ''}`).join('%0A');
    const msg = `*NEW ORDER - FLAVOUR'S TOWN*%0A%0A${details}%0A%0A*Total: ₹${total}*`;
    if(method === 'WhatsApp') window.open(`https://wa.me/919877474778?text=${msg}`, '_blank');
    else window.location.replace(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${total}&cu=INR`);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-44 font-sans selection:bg-orange-100">
      <Head>
        <title>Flavour's Town | Malout | 100% Pure Veg</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-[100] px-4 py-3 backdrop-blur-xl bg-white/80 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
           <div className="bg-gradient-to-br from-orange-500 to-red-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-100">FT</div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-tighter text-gray-900">FLAVOUR'S TOWN</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full border border-white outline outline-[1px] outline-green-600"></span>
                <span className="text-[7px] font-bold text-green-700 uppercase tracking-widest">100% PURE VEG</span>
              </div>
           </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setLang(lang==='pu'?'en':'pu')} className="text-[9px] font-black bg-gray-100 px-3 py-2 rounded-xl uppercase transition-all active:scale-90">{lang==='pu'?'English':'ਪੰਜਾਬੀ'}</button>
           <a href="tel:+919877474778" className="bg-green-50 text-green-600 px-3 py-2 rounded-xl text-[9px] font-black border border-green-100 italic">Call</a>
        </div>
      </header>

      {/* CATEGORY NAV */}
      <nav className="pt-24 pb-4 px-4 max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar relative z-30">
        {["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-full font-black text-[9px] uppercase tracking-widest transition-all shrink-0 ${activeCategory === cat ? 'bg-orange-600 text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100'}`}>
            {cat}
          </button>
        ))}
      </nav>

      {/* MENU GRID */}
      <main className="px-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-7xl mx-auto">
        {fullMenu.filter(i => activeCategory === "All" || i.category === activeCategory).map(item => (
          <motion.div layout key={item.id} className="bg-white rounded-[2.5rem] p-3 shadow-xl border border-white relative group">
            <div className="relative rounded-[2rem] overflow-hidden mb-3 h-40 bg-gray-50 shadow-inner">
              <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name.en} />
            </div>
            <div className="text-center px-1">
              <h3 className="text-[11px] font-black uppercase mb-1 h-8 flex items-center justify-center leading-none text-gray-800 tracking-tighter">{item.name[lang]}</h3>
              <p className="text-orange-600 font-black text-xl mb-4 italic tracking-tighter">₹{item.price}</p>
              <button 
                onClick={() => setShowCustomizer(item)}
                className="w-full py-3 bg-gray-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Add Item +
              </button>
            </div>
          </motion.div>
        ))}
      </main>

      {/* CUSTOMIZATION DRAWER */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-end justify-center">
            <motion.div initial={{y:500}} animate={{y:0}} exit={{y:500}} className="bg-white w-full rounded-t-[4rem] p-10 max-w-xl shadow-2xl overflow-y-auto max-h-[85vh]">
              <div className="w-16 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
              <h2 className="text-2xl font-black italic uppercase mb-2 tracking-tighter text-gray-900">{showCustomizer.name[lang]}</h2>
              <p className="text-[10px] font-bold text-gray-300 mb-8 tracking-[0.3em]">TAILOR YOUR TASTE</p>

              <div className="space-y-8">
                {/* SPICE LEVEL */}
                <div>
                  <p className="text-[10px] font-black uppercase mb-4 text-gray-400 tracking-widest px-1">🌶️ Spice Intensity</p>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map(s => (
                      <button key={s} onClick={() => setCustomData({...customData, spice: s})} className={`flex-1 py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${customData.spice === s ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100' : 'border-gray-50 text-gray-300'}`}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* BUTTER / OIL */}
                <div>
                  <p className="text-[10px] font-black uppercase mb-4 text-gray-400 tracking-widest px-1">🧈 Base Type</p>
                  <div className="flex gap-2">
                    {['Regular Butter', 'Extra Butter', 'Refined Oil'].map(f => (
                      <button key={f} onClick={() => setCustomData({...customData, fat: f})} className={`flex-1 py-4 rounded-2xl text-[9px] font-black border-2 transition-all ${customData.fat === f ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'border-gray-50 text-gray-300'}`}>{f}</button>
                    ))}
                  </div>
                </div>

                {/* CREAM TOGGLE */}
                <div className="flex justify-between items-center bg-gray-50 p-5 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black uppercase text-gray-700 tracking-widest">🥛 Add Fresh Cream?</p>
                  <button onClick={() => setCustomData({...customData, cream: !customData.cream})} className={`w-14 h-7 rounded-full transition-all flex items-center px-1.5 ${customData.cream ? 'bg-green-600 justify-end' : 'bg-gray-200 justify-start'}`}>
                    <div className="bg-white w-4 h-4 rounded-full shadow-md transition-transform"></div>
                  </button>
                </div>

                {/* SPECIAL NOTE */}
                <div>
                  <p className="text-[10px] font-black uppercase mb-4 text-gray-400 tracking-widest px-1">📝 Special Instructions</p>
                  <textarea 
                    placeholder="e.g. No onions, Make it extra crispy, less salt..."
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-[2rem] p-6 text-xs font-bold focus:border-orange-600 focus:bg-white outline-none h-32 transition-all"
                    onChange={(e) => setCustomData({...customData, note: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <button 
                onClick={addToCart}
                className="w-full bg-orange-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl shadow-orange-200 active:scale-95 transition-all mt-10 mb-4 text-sm"
              >
                Confirm & Add • ₹{showCustomizer.price}
              </button>
              <button onClick={() => setShowCustomizer(null)} className="w-full text-center text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Discard</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="mt-20 px-6 py-20 bg-white border-t border-gray-50 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-200 mb-2">Designed for Excellence by</p>
        <h2 className="text-2xl font-black italic text-gray-900 tracking-tighter uppercase">AASHRAY <span className="text-orange-600">NARANG</span></h2>
        <div className="flex justify-center gap-6 mt-10 opacity-30 grayscale hover:grayscale-0 transition-all">
           <span className="text-2xl">⚡</span><span className="text-2xl">🔥</span><span className="text-2xl">🍔</span>
        </div>
      </footer>

      {/* FLOAT CART */}
      <AnimatePresence>
        {total > 0 && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-8 left-4 right-4 z-[110] flex justify-center">
            <div className="w-full max-w-md bg-gray-900 p-6 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex justify-between items-center text-white ring-4 ring-white/10">
               <div className="flex items-center gap-4 italic ml-2">
                  <div className="bg-orange-600 h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg">🛍️</div>
                  <div className="text-left leading-none">
                    <p className="text-[8px] font-black uppercase opacity-50 mb-1">{cart.length} ITEMS ADDED</p>
                    <p className="text-3xl font-black tracking-tighter">₹{total}</p>
                  </div>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => handlePayment('UPI')} className="bg-white text-gray-900 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">Pay UPI</button>
                 <button onClick={() => handlePayment('WhatsApp')} className="bg-[#25D366] text-white px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">WhatsApp</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}