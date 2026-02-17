import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";

// --- FIREBASE CONFIG ---
const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", 
  projectId: "flavourstown-83891", 
  storageBucket: "flavourstown-83891.firebasestorage.app", 
  messagingSenderId: "631949771733", 
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// --- ULTIMATE 19 ITEMS DATA ---
const initialMenuData = [
  { id: 1, category: "Chaap", name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, reviews: 1240, img: "/img/malai-chaap.jpg" },
  { id: 2, category: "Chaap", name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, reviews: 890, img: "/img/masala-chaap.jpg" },
  { id: 3, category: "Chaap", name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, reviews: 1560, img: "/img/afghani-chaap.jpg" },
  { id: 4, category: "Chaap", name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, reviews: 750, img: "/img/achari-chaap.jpg" },
  { id: 5, category: "Tikka", name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, reviews: 2100, img: "/img/paneer-tikka.jpg" },
  { id: 6, category: "Tikka", name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, reviews: 430, img: "/img/mushroom-tikka.jpg" },
  { id: 7, category: "Rolls", name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, reviews: 620, img: "/img/frankie.jpg" },
  { id: 8, category: "Rolls", name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, reviews: 940, img: "/img/paneer-roll.jpg" },
  { id: 9, category: "Rolls", name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, reviews: 510, img: "/img/chaap-roll.jpg" },
  { id: 10, category: "Rolls", name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, reviews: 320, img: "/img/mushroom-roll.jpg" },
  { id: 11, category: "Snacks", name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, reviews: 1800, img: "/img/pav-bhaji.jpg" },
  { id: 12, category: "Rolls", name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, reviews: 210, img: "/img/twister.jpg" },
  { id: 13, category: "Snacks", name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, reviews: 770, img: "/img/kulcha.jpg" },
  { id: 14, category: "Snacks", name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, reviews: 1100, img: "/img/cheese-chilli.jpg" },
  { id: 15, category: "Snacks", name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, reviews: 150, img: "/img/kacha-paneer.jpg" },
  { id: 16, category: "Snacks", name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, reviews: 420, img: "/img/paneer-fry.jpg" },
  { id: 17, category: "Sweets", name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, reviews: 3000, img: "/img/gulab-jamun.jpg" },
  { id: 18, category: "Sweets", name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, reviews: 2500, img: "/img/rabri-jamun.jpg" },
  { id: 19, category: "Sweets", name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, reviews: 1300, img: "/img/gajrela.jpg" }
];

const addonsData = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'p1', name: { en: "Packing Charge", pu: "ਪੈਕਿੰਗ" }, price: 10 }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1); // 1: Login, 2: Phone, 3: App
  const [tempUser, setTempUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  // App States
  const [menu, setMenu] = useState(initialMenuData);
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customOptions, setCustomOptions] = useState({ spice: 'Medium' });

  const scrollRefs = useRef({});
  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (saved) { setUser(JSON.parse(saved)); setStep(3); }
  }, []);

  // --- GOOGLE LOGIN ---
  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      const townId = `${u.displayName.split(' ')[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setTempUser({ name: u.displayName, email: u.email, photo: u.photoURL, uid: u.uid, townId });
      setStep(2);
    } catch (e) { alert("Login Error!"); }
    setLoading(false);
  };

  const finalizeUser = async () => {
    if (phone.length < 10) return alert("Sahi number bharo!");
    setLoading(true);
    const final = { ...tempUser, phone, role: 'customer' };
    try {
      await set(ref(db, 'users/' + final.uid), final);
      localStorage.setItem('ft_user', JSON.stringify(final));
      setUser(final); setStep(3);
    } catch (e) { alert("DB Error!"); }
    setLoading(false);
  };

  // --- ORDER PLACEMENT ---
  const subtotal = cart.reduce((acc, i) => acc + i.price, 0) + 
                   addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);

  const processOrder = async (method) => {
    haptic();
    setOrderStatus('Preparing');
    
    const orderData = {
      customer: user,
      items: cart,
      total: subtotal,
      status: 'pending',
      time: new Date().toLocaleString(),
      spice: customOptions.spice
    };

    try {
      await push(ref(db, 'orders'), orderData);
      
      let progressInterval = setInterval(() => {
        setCookingProgress(p => (p >= 100 ? 100 : p + 2));
      }, 50);

      setTimeout(() => {
        clearInterval(progressInterval);
        setOrderStatus(null);
        const msg = `*THE FLAVOUR'S TOWN ORDER*\n*ID:* ${user.townId}\n*Total:* ₹${subtotal}\n*Phone:* ${user.phone}`;
        if (method === 'WA') window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(msg)}`);
        else window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${subtotal}&cu=INR`);
        setCart([]); setAddons({}); setShowCheckout(false);
      }, 3000);
    } catch (e) { alert("Order Failed!"); setOrderStatus(null); }
  };

  const filteredItems = useMemo(() => menu.filter(i => 
    i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.pu.includes(searchQuery)
  ), [searchQuery, menu]);

  // --- AUTH SCREENS ---
  if (step < 3) {
    return (
      <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 text-black">
        <div className="w-full max-w-sm bg-white p-10 rounded-[4rem] shadow-2xl text-center border">
          <h1 className="text-3xl font-black italic text-orange-600 uppercase mb-8">Flavours Town</h1>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.button key="l" onClick={handleLogin} disabled={loading} className="w-full py-5 border-2 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px]">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5" /> {loading ? 'Wait...' : 'Login with Google'}
              </motion.button>
            ) : (
              <motion.div key="p" initial={{ x: 20 }} animate={{ x: 0 }} className="space-y-6">
                <p className="text-xs font-bold opacity-40">Welcome, {tempUser?.name}</p>
                <input type="tel" placeholder="Enter Phone Number" className="w-full p-5 bg-gray-50 rounded-2xl text-center font-bold outline-none" onChange={e => setPhone(e.target.value)} />
                <button onClick={finalizeUser} disabled={loading} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl">Start Ordering →</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // --- MAIN APP UI ---
  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-[#fcfbf7] text-black'} min-h-screen pb-44 transition-all duration-500 font-sans`}>
      <Head><title>Town | {user.name}</title></Head>

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-[1000] px-4 py-4 backdrop-blur-3xl ${isDark ? 'bg-black/90' : 'bg-white/95'} border-b border-gray-100 flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">FT</div>
          <h2 className="text-sm font-black italic text-orange-600 uppercase leading-none">Flavours Town</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLang(lang==='pu'?'en':'pu')} className="text-[10px] font-black bg-orange-600 text-white px-3 py-2 rounded-xl uppercase">{lang === 'pu' ? 'EN' : 'ਪੰ'}</button>
          <div className="bg-black text-white px-3 py-2 rounded-xl text-[9px] font-black uppercase border border-white/20 italic tracking-tighter shadow-lg">ID: {user.townId}</div>
        </div>
      </header>

      {/* TABS */}
      <nav className={`fixed top-[74px] w-full z-[900] py-4 flex gap-4 px-6 overflow-x-auto no-scrollbar border-b ${isDark ? 'bg-black/80' : 'bg-white/90 shadow-md'}`}>
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button key={cat} onClick={() => scrollRefs.current[cat]?.scrollIntoView({behavior:'smooth', block:'start'})} className="px-5 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap bg-orange-600/10 text-orange-500 border border-orange-600/30">#{cat}</button>
        ))}
      </nav>

      {/* SEARCH */}
      <section className="pt-40 px-5 max-w-xl mx-auto">
        <div className={`flex items-center px-7 py-5 rounded-[2.5rem] border-4 ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-orange-100 shadow-xl'}`}>
           <span className="mr-4 text-xl">🔍</span>
           <input type="text" placeholder={lang === 'pu' ? "ਖੋਜੋ..." : "Search..."} className="bg-transparent border-none outline-none w-full font-bold uppercase" onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </section>

      {/* MENU GRID */}
      <main className="mt-12 px-4 max-w-7xl mx-auto space-y-16 pb-64">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((catName) => {
          const items = filteredItems.filter(i => i.category === catName);
          if (items.length === 0) return null;
          return (
            <div key={catName} ref={el => scrollRefs.current[catName] = el} className="space-y-8 scroll-mt-48">
              <h2 className="text-3xl font-black italic uppercase text-orange-600 border-b-4 border-orange-600/10 pb-2 ml-2">{catName}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {items.map((p) => (
                  <motion.div key={p.id} className={`${isDark ? 'bg-zinc-900/80 border-white/10' : 'bg-white border-orange-100 shadow-lg'} rounded-[3rem] p-4 border`}>
                    <div className="rounded-[2rem] overflow-hidden mb-4 h-32 bg-zinc-800">
                      <img src={p.img} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-[11px] font-black uppercase mb-1 h-8 leading-none">{p.name[lang]}</h3>
                      <p className="text-orange-500 font-black text-2xl mb-4 italic tracking-tighter">₹{p.price}</p>
                      <button onClick={() => setShowCustomizer(p)} className="w-full py-4 bg-orange-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase italic shadow-xl shadow-orange-600/20 active:scale-95 transition-all">Add +</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* FLOAT BAR */}
      <AnimatePresence>
        {subtotal > 0 && !orderStatus && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-8 left-0 right-0 z-[1000] px-6">
            <button onClick={() => setShowCheckout(true)} className="w-full max-w-lg mx-auto p-5 bg-orange-600 rounded-[2.5rem] shadow-2xl flex justify-between items-center text-white ring-8 ring-orange-600/10 active:scale-95 transition-all">
               <div className="flex items-center gap-4 italic ml-2">
                  <span className="text-2xl animate-bounce">🛒</span>
                  <div className="text-left leading-none">
                    <p className="text-[9px] font-black uppercase opacity-60">Checkout Total</p>
                    <p className="text-3xl font-black italic tracking-tighter">₹{subtotal}</p>
                  </div>
               </div>
               <div className="bg-white text-orange-600 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase shadow-lg italic tracking-widest">Review Bill →</div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CUSTOMIZER & CHECKOUT DRAWERS (Simplified for speed) */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[2000] flex items-end justify-center p-4">
             <div className="bg-white w-full rounded-[4rem] p-10 max-w-lg text-black max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between mb-8">
                   <h2 className="text-2xl font-black italic uppercase text-orange-600">Order Summary</h2>
                   <button onClick={() => setShowCheckout(false)} className="text-red-500 font-black text-2xl">✕</button>
                </div>
                <div className="space-y-4 mb-8">
                  {cart.map((c, i) => (
                    <div key={i} className="flex justify-between border-b pb-2">
                       <p className="font-bold text-sm uppercase italic">{c.name[lang]}</p>
                       <p className="font-black text-orange-600 italic">₹{c.price}</p>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-between">
                    <p className="text-2xl font-black uppercase italic tracking-tighter">Total Due:</p>
                    <p className="text-3xl font-black text-orange-600 italic tracking-tighter">₹{subtotal}</p>
                  </div>
                </div>
                <div className="space-y-4">
                   <button onClick={() => processOrder('UPI')} className="w-full bg-[#1A73E8] text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest">Pay UPI</button>
                   <button onClick={() => processOrder('WA')} className="w-full bg-[#25D366] text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest">Order WhatsApp</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROGRESS OVERLAY */}
      <AnimatePresence>
        {orderStatus && (
          <div className="fixed inset-0 bg-black/99 z-[5000] flex flex-col items-center justify-center p-10 text-center">
             <div className="text-9xl mb-10 animate-pulse">🥘</div>
             <h2 className="text-5xl font-black italic uppercase text-orange-600 mb-6 underline">COOKING!</h2>
             <div className="w-full max-w-xs h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/20">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-orange-600"></motion.div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-orange-600 italic mt-8">Transmitting Order to Kitchen...</p>
          </div> 
        )}
      </AnimatePresence>
      
      {/* FOOTER */}
      <footer className="mt-32 p-12 text-center border-t border-gray-100 opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[1em] mb-4">Developed By Aashray Narang</p>
        <p className="text-[8px] font-bold uppercase tracking-widest">Malout ● 2026</p>
      </footer>

      {/* ITEM CUSTOMIZER DRAWERS */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[3000] flex items-end justify-center p-4">
            <div className="bg-white w-full rounded-[3.5rem] p-10 max-w-lg text-black">
              <h2 className="text-3xl font-black italic uppercase text-orange-600 mb-8">{showCustomizer.name[lang]}</h2>
              <p className="text-xs font-black uppercase opacity-40 mb-4">Select Spice Level</p>
              <div className="flex gap-4 mb-10">
                {['Low', 'Medium', 'High'].map(s => (
                  <button key={s} onClick={() => setCustomOptions({spice: s})} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] border-4 ${customOptions.spice === s ? 'bg-orange-600 border-orange-600 text-white' : 'border-gray-100'}`}>{s}</button>
                ))}
              </div>
              <button onClick={() => { haptic(); setCart([...cart, {...showCustomizer, ...customOptions}]); setShowCustomizer(null); }} className="w-full bg-orange-600 text-white py-6 rounded-[2rem] font-black uppercase italic shadow-xl active:scale-95 transition-all">Finalize & Add Item</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}