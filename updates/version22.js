import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

// --- FIREBASE CONFIG (Teri apni config ethe fit hai) ---
const firebaseConfig = {
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo",
  authDomain: "flavourstown-83891.firebaseapp.com",
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  projectId: "flavourstown-83891",
  storageBucket: "flavourstown-83891.firebasestorage.app",
  messagingSenderId: "631949771733",
  appId: "1:631949771733:web:16e025bbc443493242735c",
  measurementId: "G-8LP1YVF8X2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ADMIN_PASS = "aashray778";
const UPI_ID = "9877474778@paytm";

const initialMenuData = [
  { id: 1, category: "Chaap", isBest: true, name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 120, rating: 4.8, img: "/img/malai-chaap.jpg" },
  { id: 2, category: "Chaap", isBest: false, name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 110, rating: 4.7, img: "/img/masala-chaap.jpg" },
  { id: 3, category: "Chaap", isBest: true, name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 130, rating: 4.9, img: "/img/afghani-chaap.jpg" },
  { id: 4, category: "Chaap", isBest: false, name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 110, rating: 4.6, img: "/img/achari-chaap.jpg" },
  { id: 5, category: "Tikka", isBest: true, name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 160, rating: 4.9, img: "/img/paneer-tikka.jpg" },
  { id: 6, category: "Tikka", isBest: false, name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 150, rating: 4.5, img: "/img/mushroom-tikka.jpg" },
  { id: 7, category: "Rolls", isBest: false, name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 60, rating: 4.4, img: "/img/frankie.jpg" },
  { id: 8, category: "Rolls", isBest: true, name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 100, rating: 4.7, img: "/img/paneer-roll.jpg" },
  { id: 9, category: "Rolls", isBest: false, name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 90, rating: 4.6, img: "/img/chaap-roll.jpg" },
  { id: 10, category: "Rolls", isBest: false, name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, img: "/img/mushroom-roll.jpg" },
  { id: 11, category: "Snacks", isBest: true, name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 80, rating: 4.8, img: "/img/pav-bhaji.jpg" },
  { id: 12, category: "Rolls", isBest: false, name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 80, rating: 4.3, img: "/img/twister.jpg" },
  { id: 13, category: "Snacks", isBest: false, name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 140, rating: 4.7, img: "/img/kulcha.jpg" },
  { id: 14, category: "Snacks", isBest: true, name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 220, rating: 4.9, img: "/img/cheese-chilli.jpg" },
  { id: 15, category: "Snacks", isBest: false, name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 100, rating: 4.2, img: "/img/kacha-paneer.jpg" },
  { id: 16, category: "Snacks", isBest: false, name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 180, rating: 4.7, img: "/img/paneer-fry.jpg" },
  { id: 17, category: "Sweets", isBest: true, name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 40, rating: 4.9, img: "/img/gulab-jamun.jpg" },
  { id: 18, category: "Sweets", isBest: true, name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 60, rating: 5.0, img: "/img/rabri-jamun.jpg" },
  { id: 19, category: "Sweets", isBest: false, name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 60, rating: 4.9, img: "/img/gajrela.jpg" }
];

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [sessionOrderId, setSessionOrderId] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', phone: '' });
  const [activeCategory, setActiveCategory] = useState("All");
  const [lang, setLang] = useState('pu'); // Default Punjabi
  const [isDark, setIsDark] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  // --- CLOUD SYNC ---
  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);

    // Sync Menu Stock
    onValue(ref(db, 'menu'), (snap) => {
      const data = snap.val();
      if (data) setMenu(data);
      else set(ref(db, 'menu'), initialMenuData.map(i => ({...i, inStock: true})));
    });

    // Sync Orders + Sound Logic
    onValue(ref(db, 'orders'), (snap) => {
      const data = snap.val();
      if (data) {
          const orders = Object.keys(data).map(k => ({...data[k], firebaseKey: k}));
          // Sound notification for Admin on new order
          if (isAdmin && orders.length > liveOrders.length && liveOrders.length > 0) {
              try { new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play(); } catch(e){}
          }
          setLiveOrders(orders);
      }
    });
  }, [isAdmin, liveOrders.length]);

  const subtotal = cart.reduce((acc, i) => acc + i.price, 0);

  const placeOrder = (method) => {
    if (!userDetails.name || !userDetails.phone) return alert("Fill Name & Phone!");
    const newOrder = {
        id: sessionOrderId, user: userDetails, items: cart,
        total: subtotal, status: 'Pending', method, timestamp: new Date().toISOString()
    };
    if (method === 'UPI') window.location.href = `upi://pay?pa=${UPI_ID}&pn=FlavoursTown&am=${subtotal}&cu=INR`;
    set(ref(db, 'orders/' + sessionOrderId), newOrder);
    setCart([]); setShowCheckout(false);
    alert(lang === 'en' ? "Order Placed!" : "ਆਰਡਰ ਹੋ ਗਿਆ ਜੀ!");
  };

  const toggleStock = (idx) => update(ref(db, `menu/${idx}`), { inStock: !menu[idx].inStock });
  const updateStatus = (key, s) => update(ref(db, `orders/${key}`), { status: s });

  return (
    <div className={`min-h-screen font-sans transition-all duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fcfbf7] text-black'}`}>
      <Head><title>Flavour's Town</title></Head>
      
      {/* --- HEADER --- */}
      <header className={`fixed top-0 w-full z-[100] px-4 py-3 backdrop-blur-xl border-b flex justify-between items-center ${isDark ? 'bg-black/60 border-white/5' : 'bg-white/80 border-black/5'}`}>
        <div className="flex items-center gap-2">
            <div className="bg-orange-600 h-9 w-9 rounded-lg flex items-center justify-center font-black text-white">FT</div>
            <h1 className="text-[10px] font-black uppercase tracking-tighter">Flavour's Town</h1>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="px-3 py-1 rounded-lg bg-orange-600/10 text-[9px] font-bold border border-orange-600/20 text-orange-500">
                {lang === 'en' ? 'ਪੰਜਾਬੀ' : 'ENGLISH'}
            </button>
            <button onClick={() => setIsDark(!isDark)} className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center text-xs">{isDark ? '☀️' : '🌙'}</button>
            <button onClick={() => { const p=prompt("Pass:"); if(p===ADMIN_PASS) setIsAdmin(!isAdmin); }} className="w-8 h-8 rounded-full bg-orange-600/10 flex items-center justify-center text-xs">⚙️</button>
        </div>
      </header>

      <div className="pt-20 px-3 pb-32 max-w-[1200px] mx-auto">
        {isAdmin ? (
          /* --- ADMIN PANEL --- */
          <div className="animate-in fade-in">
            <h2 className="text-xl font-black text-orange-500 mb-6 italic">LIVE FEED 🔔</h2>
            <div className="space-y-4 mb-10">
                {liveOrders.slice().reverse().map((o) => (
                    <div key={o.firebaseKey} className="p-4 rounded-2xl border border-gray-500/20 bg-zinc-900/10 shadow-sm">
                        <div className="flex justify-between font-bold text-sm">
                            <span>{o.user.name} ({o.user.phone})</span>
                            <span className="text-orange-500">₹{o.total}</span>
                        </div>
                        <div className="text-[10px] opacity-60 mt-1 uppercase font-bold tracking-widest">{o.items.map(i=>i.name.en).join(', ')}</div>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {['Pending', 'Cooking', 'Ready'].map(s => (
                                <button key={s} onClick={() => updateStatus(o.firebaseKey, s)} className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${o.status === s ? 'bg-orange-600 text-white border-orange-600' : 'opacity-30'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <h3 className="font-black text-[10px] uppercase opacity-40 mb-4 tracking-widest text-center">Manage Stock</h3>
            <div className="grid grid-cols-2 gap-3">
                {menu.map((m, i) => (
                    <button key={m.id} onClick={() => toggleStock(i)} className={`p-3 rounded-xl border text-[10px] font-bold transition-all ${m.inStock ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500 opacity-40'}`}>
                        {m.name.en} <br/> {m.inStock ? '● IN STOCK' : '○ SOLD OUT'}
                    </button>
                ))}
            </div>
          </div>
        ) : (
          /* --- USER MENU --- */
          <div>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
                {["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border transition-all ${activeCategory===cat ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-500/20 opacity-60'}`}>{cat}</button>
                ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {menu.filter(i => activeCategory === "All" || i.category === activeCategory).map((p) => (
                    <div key={p.id} className={`rounded-[1.5rem] border overflow-hidden transition-all ${!p.inStock ? 'grayscale opacity-40' : ''} ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                        <div className="h-32 bg-gray-800 relative"><img src={p.img} alt={p.name.en} className="w-full h-full object-cover" /></div>
                        <div className="p-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold uppercase truncate pr-1">{p.name[lang]}</span>
                                <span className="text-xs font-black">₹{p.price}</span>
                            </div>
                            <button onClick={() => setCart([...cart, p])} disabled={!p.inStock} className="w-full py-2 rounded-xl bg-orange-600 text-white text-[10px] font-black uppercase">Add +</button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {cart.length > 0 && !isAdmin && (
          <button onClick={() => setShowCheckout(true)} className="fixed bottom-6 left-4 right-4 bg-orange-600 text-white p-4 rounded-2xl flex justify-between items-center font-black shadow-xl">
              <span className="text-[10px] uppercase">{lang === 'en' ? 'VIEW CART' : 'ਟ੍ਰੇ ਦੇਖੋ'} ({cart.length})</span>
              <span>₹{subtotal} →</span>
          </button>
      )}

      {/* --- CHECKOUT MODAL --- */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 z-[200] bg-black/95 p-6 pt-20 overflow-y-auto">
              <h2 className="text-3xl font-black italic mb-8 text-white">{lang === 'en' ? 'CONFIRM' : 'ਪੱਕਾ ਕਰੋ'} <span className="text-orange-500">{lang === 'en' ? 'ORDER' : 'ਆਰਡਰ'}</span></h2>
              <input type="text" placeholder={lang === 'en' ? 'Your Name' : 'ਤੁਹਾਡਾ ਨਾਮ'} value={userDetails.name} onChange={e=>setUserDetails({...userDetails, name:e.target.value})} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 mb-4 font-bold text-white outline-none focus:border-orange-500" />
              <input type="number" placeholder={lang === 'en' ? 'Phone Number' : 'ਫੋਨ ਨੰਬਰ'} value={userDetails.phone} onChange={e=>setUserDetails({...userDetails, phone:e.target.value})} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 mb-8 font-bold text-white outline-none focus:border-orange-500" />
              
              <button onClick={() => placeOrder('UPI')} className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg mb-4">⚡ {lang === 'en' ? 'PAY & ORDER' : 'ਪੈਸੇ ਦਿਓ ਤੇ ਆਰਡਰ ਕਰੋ'}</button>
              <button onClick={() => placeOrder('COD')} className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg shadow-xl">{lang === 'en' ? 'CASH ON DELIVERY' : 'ਨਕਦ ਪੈਸੇ'}</button>
              <button onClick={() => setShowCheckout(false)} className="w-full py-6 opacity-40 font-bold uppercase tracking-widest text-[10px] text-white text-center">Back</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}