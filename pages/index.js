import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// --- ULTIMATE 19 ITEMS DATA WITH INITIAL STOCK STATE ---
const initialMenuData = [
  { id: 1, category: "Chaap", isBest: true, name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, rating: 4.8, reviews: 1240, img: "/img/malai-chaap.jpg", inStock: true },
  { id: 2, category: "Chaap", isBest: false, name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, rating: 4.7, reviews: 890, img: "/img/masala-chaap.jpg", inStock: true },
  { id: 3, category: "Chaap", isBest: true, name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, rating: 4.9, reviews: 1560, img: "/img/afghani-chaap.jpg", inStock: true },
  { id: 4, category: "Chaap", isBest: false, name: { en: "Achari Chaap", pu: "ਅਚਾਰੀ ਚਾਪ" }, price: 100, rating: 4.6, reviews: 750, img: "/img/achari-chaap.jpg", inStock: true },
  { id: 5, category: "Tikka", isBest: true, name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, rating: 4.9, reviews: 2100, img: "/img/paneer-tikka.jpg", inStock: true },
  { id: 6, category: "Tikka", isBest: false, name: { en: "Mushroom Tikka", pu: "ਮਸ਼ਰੂਮ ਟਿੱਕਾ" }, price: 120, rating: 4.5, reviews: 430, img: "/img/mushroom-tikka.jpg", inStock: true },
  { id: 7, category: "Rolls", isBest: false, name: { en: "Frankie Roll", pu: "ਫਰੈਂਕੀ ਰੋਲ" }, price: 50, rating: 4.4, reviews: 620, img: "/img/frankie.jpg", inStock: true },
  { id: 8, category: "Rolls", isBest: true, name: { en: "Paneer Roll", pu: "ਪਨੀਰ ਰੋਲ" }, price: 90, rating: 4.7, reviews: 940, img: "/img/paneer-roll.jpg", inStock: true },
  { id: 9, category: "Rolls", isBest: false, name: { en: "Chaap Roll", pu: "ਚਾਪ ਰੋਲ" }, price: 70, rating: 4.6, reviews: 510, img: "/img/chaap-roll.jpg", inStock: true },
  { id: 10, category: "Rolls", isBest: false, name: { en: "Mushroom Roll", pu: "ਮਸ਼ਰੂਮ ਰੋਲ" }, price: 90, rating: 4.5, reviews: 320, img: "/img/mushroom-roll.jpg", inStock: true },
  { id: 11, category: "Snacks", isBest: true, name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, rating: 4.8, reviews: 1800, img: "/img/pav-bhaji.jpg", inStock: true },
  { id: 12, category: "Rolls", isBest: false, name: { en: "Twister Roll", pu: "ਟਵਿਸਟਰ ਰੋਲ" }, price: 50, rating: 4.3, reviews: 210, img: "/img/twister.jpg", inStock: true },
  { id: 13, category: "Snacks", isBest: false, name: { en: "Paneer Bhurji Kulcha", pu: "ਪਨੀਰ ਭੁਰਜੀ ਕੁਲਚਾ" }, price: 90, rating: 4.8, reviews: 770, img: "/img/kulcha.jpg", inStock: true },
  { id: 14, category: "Snacks", isBest: true, name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, rating: 4.9, reviews: 1100, img: "/img/cheese-chilli.jpg", inStock: true },
  { id: 15, category: "Snacks", isBest: false, name: { en: "Kacha Paneer", pu: "ਕੱਚਾ ਪਨੀਰ" }, price: 50, rating: 4.2, reviews: 150, img: "/img/kacha-paneer.jpg", inStock: true },
  { id: 16, category: "Snacks", isBest: false, name: { en: "Paneer Fry", pu: "ਪਨੀਰ ਫਰਾਈ" }, price: 130, rating: 4.7, reviews: 420, img: "/img/paneer-fry.jpg", inStock: true },
  { id: 17, category: "Sweets", isBest: true, name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, rating: 4.9, reviews: 3000, img: "/img/gulab-jamun.jpg", inStock: true },
  { id: 18, category: "Sweets", isBest: true, name: { en: "Rabri Gulab Jamun", pu: "ਰਬੜੀ ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 30, rating: 5.0, reviews: 2500, img: "/img/rabri-jamun.jpg", inStock: true },
  { id: 19, category: "Sweets", isBest: false, name: { en: "Garam Gajrela", pu: "ਗਰਮ ਗਜਰੇਲਾ" }, price: 50, rating: 4.9, reviews: 1300, img: "/img/gajrela.jpg", inStock: true }
];

const addonsData = [
  { id: 'r1', name: { en: "Rumali Roti", pu: "ਰੁਮਾਲੀ ਰੋਟੀ" }, price: 10 },
  { id: 'r2', name: { en: "Garlic Nan", pu: "ਗਾਰਲਿਕ ਨਾਨ" }, price: 40 },
  { id: 'p1', name: { en: "Packing Charge", pu: "ਪੈਕਿੰਗ" }, price: 10 }
];

const storiesData = [
  { id: 1, title: { en: "Tandoor Fire", pu: "ਤੰਦੂਰ ਲਾਈਵ" }, img: "/img/afghani-chaap.jpg", highlight: "Fresh hot tandoori roasting every evening." },
  { id: 2, title: { en: "Malai Special", pu: "ਮਲਾਈ ਸਪੈਸ਼ਲ" }, img: "/img/malai-chaap.jpg", highlight: "Rich creamy cashew marination." },
  { id: 3, title: { en: "Paneer Feast", pu: "ਪਨੀਰ ਫੀਸਟ" }, img: "/img/paneer-tikka.jpg", highlight: "Soft tandoori marinated paneer cubes." },
  { id: 4, title: { en: "Roll Mania", pu: "ਰੋਲ ਮੇਨੀਆ" }, img: "/img/paneer-roll.jpg", highlight: "Crispy flaky Rumali rolls packed with flavour." }
];

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [addons, setAddons] = useState({});
  const [lang, setLang] = useState('pu');
  const [isDark, setIsDark] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [prepTime, setPrepTime] = useState(20);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [orderStatus, setOrderStatus] = useState(null);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(null);
  const [customOptions, setCustomOptions] = useState({ spice: 2 }); // Convert to index-based for slider: 1=Low, 2=Medium, 3=High
  const [sessionOrderId, setSessionOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeStory, setActiveStory] = useState(null);
  const [flyingParticles, setFlyingParticles] = useState([]);
  const [themeTransition, setThemeTransition] = useState(null);

  const handleThemeToggle = (e) => {
    haptic();
    const x = e.clientX || window.innerWidth - 40;
    const y = e.clientY || 40;
    setThemeTransition({ x, y, toDark: !isDark });
    setTimeout(() => {
      setIsDark(!isDark);
    }, 300);
    setTimeout(() => {
      setThemeTransition(null);
    }, 600);
  };

  const scrollRefs = useRef({});

  const haptic = () => { if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(50); };

  // Hydrate Data on Mount
  useEffect(() => {
    setSessionOrderId(`FT-${Math.floor(1000 + Math.random() * 9000)}`);
    const savedMenu = localStorage.getItem('ft_final_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    else setMenu(initialMenuData);

    const savedKitchen = localStorage.getItem('ft_final_kitchen');
    if (savedKitchen !== null) setIsKitchenOpen(JSON.parse(savedKitchen));

    const savedPrep = localStorage.getItem('ft_final_prep');
    if (savedPrep) setPrepTime(parseInt(savedPrep));

    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sync to LocalStorage safely when state updates
  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('ft_final_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('ft_final_kitchen', JSON.stringify(isKitchenOpen));
  }, [isKitchenOpen]);

  useEffect(() => {
    localStorage.setItem('ft_final_prep', prepTime.toString());
  }, [prepTime]);

  // Cooking Progress Simulator
  useEffect(() => {
    let interval;
    if (orderStatus === 'Preparing') {
      interval = setInterval(() => { 
        setCookingProgress(p => (p >= 100 ? 100 : p + 2.5)); 
      }, 100);
    } else setCookingProgress(0);
    return () => clearInterval(interval);
  }, [orderStatus]);

  // Advanced Filtering Engine (Search + Tabs)
  const filteredItems = useMemo(() => {
    return menu.filter(i => {
      const matchesSearch = i.name.en.toLowerCase().includes(searchQuery.toLowerCase()) || i.name.pu.includes(searchQuery);
      const matchesTab = activeTab === "All" || i.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, menu, activeTab]);

  // Cart Management
  const addToCart = (item, options) => {
    const spiceLevels = { 1: 'Low', 2: 'Medium', 3: 'High' };
    const spiceText = spiceLevels[options.spice] || 'Medium';
    setCart(prev => [...prev, { ...item, cartId: `${item.id}-${Date.now()}`, spice: spiceText }]);
  };

  const handleAddToBasket = (e) => {
    haptic();
    try {
      new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3').play();
    } catch(err){}
    const startX = e.clientX || window.innerWidth / 2;
    const startY = e.clientY || window.innerHeight / 2;
    const particleId = Date.now();
    setFlyingParticles(prev => [...prev, { id: particleId, x: startX, y: startY }]);
    setTimeout(() => {
      setFlyingParticles(prev => prev.filter(p => p.id !== particleId));
    }, 800);
    addToCart(showCustomizer, customOptions);
    setShowCustomizer(null);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Math Calculations
  const subtotal = useMemo(() => {
    const itemsCost = cart.reduce((acc, i) => acc + i.price, 0);
    const addonsCost = addonsData.reduce((acc, ad) => acc + (ad.price * (addons[ad.id] || 0)), 0);
    return itemsCost + addonsCost;
  }, [cart, addons]);

  const processOrder = (method) => {
    if (!isKitchenOpen && !isAdmin) return;
    haptic();
    setOrderStatus('Preparing');
    
    const itemsStr = cart.map(i => `• ${i.name[lang]} (${i.spice || 'Medium'})`).join('\n');
    const adsStr = addonsData.filter(a => addons[a.id]).map(a => `• ${a.name[lang]} x ${addons[a.id]}`).join('\n');
    const msg = `*THE FLAVOUR'S TOWN ORDER*\n*ID:* ${sessionOrderId}\n\n*Items:*\n${itemsStr}\n\n${adsStr ? `*Addons:*\n${adsStr}\n` : ''}*Total:* ₹${subtotal}\n*Wait Time:* ${prepTime}m\n📍 Malout, Punjab`;

    setTimeout(() => {
      setOrderStatus(null);
      if (method === 'WA') {
        window.location.assign(`https://api.whatsapp.com/send?phone=919877474778&text=${encodeURIComponent(msg)}`);
      } else {
        window.location.assign(`upi://pay?pa=9877474778@paytm&pn=FlavoursTown&am=${subtotal}&cu=INR`);
      }
      setCart([]); 
      setAddons({}); 
      setShowCheckout(false);
    }, 4500);
  };

  return (
    <div className={`${isDark ? 'bg-gradient-to-b from-[#080808] via-[#0D0D0D] to-[#0A0A0A] text-white' : 'bg-gradient-to-b from-[#FAF8F5] via-[#FFFDFB] to-[#F7F4EF] text-black'} min-h-screen pb-44 transition-all duration-500 font-sans overflow-x-hidden relative`}>
      <Head>
        <title>98774-74778 | The Flavour's Town (PRO)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* GLOWING EMBERS BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-orange/30 blur-[1px] left-[10%] bottom-0 animate-ember" style={{ animationDelay: '0s', animationDuration: '10s' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-brand-amber/40 blur-[1px] left-[25%] bottom-0 animate-ember" style={{ animationDelay: '2s', animationDuration: '14s' }} />
        <div className="absolute w-2 h-2 rounded-full bg-brand-orange/20 blur-[1px] left-[45%] bottom-0 animate-ember" style={{ animationDelay: '4s', animationDuration: '12s' }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-brand-amber/35 blur-[1px] left-[65%] bottom-0 animate-ember" style={{ animationDelay: '1s', animationDuration: '15s' }} />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-orange/25 blur-[1px] left-[80%] bottom-0 animate-ember" style={{ animationDelay: '6s', animationDuration: '11s' }} />
        <div className="absolute w-2 h-2 rounded-full bg-brand-amber/30 blur-[1px] left-[90%] bottom-0 animate-ember" style={{ animationDelay: '3s', animationDuration: '13s' }} />
      </div>

      {/* STICKY TOP HEADER */}
      <header className={`fixed top-0 w-full z-[1000] px-6 py-4 backdrop-blur-xl ${isDark ? 'bg-black/60 border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.8)]' : 'bg-white/60 border-orange-100/50 shadow-[0_4px_30px_rgba(255,77,0,0.05)]'} border-b flex justify-between items-center transition-colors duration-300`}>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-brand-orange to-brand-amber h-11 w-11 rounded-2xl flex items-center justify-center text-white font-black italic shadow-[0_0_20px_rgba(255,77,0,0.4)] text-xl tracking-tighter">FT</div>
          <div className="flex flex-col leading-none">
            <h1 className="text-sm font-black uppercase tracking-tight font-display">The Flavour's Town</h1>
            <span className="text-[10px] font-black text-brand-orange flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-ping"></span>
              98774-74778
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
  <button onClick={(e) => handleThemeToggle(e)} className={`p-2.5 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-zinc-950/40 border-white/5 hover:border-white/10 text-yellow-500' : 'bg-white/40 border-orange-100/50 hover:border-orange-200 text-zinc-700 shadow-sm'}`}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => { haptic(); setLang(lang==='pu'?'en':'pu'); }} className="text-[10px] font-black bg-gradient-to-r from-brand-orange to-brand-amber text-white px-4 py-2.5 rounded-2xl uppercase shadow-lg shadow-brand-orange/20 hover:brightness-110 active:scale-95 transition-all">{lang === 'pu' ? 'EN' : 'ਪੰ'}</button>
          <button onClick={() => { const p = prompt("Admin Pass:"); if(p==="aashray778") setIsAdmin(!isAdmin); }} className={`w-9 h-9 rounded-2xl flex items-center justify-center text-brand-orange border transition-all duration-300 ${isDark ? 'bg-brand-orange/5 border-brand-orange/10 hover:border-brand-orange/30' : 'bg-brand-orange/10 border-brand-orange/20 hover:border-brand-orange/40'} font-black text-lg`}>⚙️</button>
        </div>
      </header>

      {/* FILTER TABS */}
      <nav className={`fixed top-[74px] w-full z-[900] py-4.5 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-4 px-6 border-b transition-colors duration-300 ${isDark ? 'bg-black/40 border-white/5' : 'bg-white/40 border-orange-100/50'}`}>
        {["All", "Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map(cat => (
          <button 
            key={cat} 
            onClick={() => { haptic(); setActiveTab(cat); if(cat !== "All") scrollRefs.current[cat]?.scrollIntoView({behavior:'smooth', block:'start'}); }} 
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all duration-300 ${activeTab === cat ? 'bg-gradient-to-r from-brand-orange to-brand-amber text-white shadow-lg shadow-brand-orange/20 border-transparent' : `border ${isDark ? 'bg-zinc-950/20 border-white/5 text-zinc-400 hover:border-white/10' : 'bg-white/30 border-orange-100/50 text-zinc-600 hover:border-orange-200'}`}`}
          >
            #{cat}
          </button>
        ))}
      </nav>

      {/* SEARCH SYSTEM */}
      <section className="pt-44 px-5 max-w-xl mx-auto">
        <div className={`flex items-center px-6 py-4.5 rounded-[2rem] border transition-all duration-300 focus-within:shadow-[0_0_30px_rgba(255,77,0,0.1)] ${isDark ? 'bg-zinc-950/40 border-white/5 focus-within:border-brand-orange/30' : 'bg-white/80 border-orange-100/70 focus-within:border-brand-orange/40 shadow-sm'}`}>
           <span className="mr-3.5 text-xl opacity-50">🔍</span>
           <input type="text" value={searchQuery} placeholder={lang === 'pu' ? "ਤੁਹਾਨੂੰ ਅੱਜ ਕੀ ਪਸੰਦ ਹੈ?..." : "Search menu items..."} className={`bg-transparent border-none outline-none w-full text-sm font-bold uppercase tracking-tight ${isDark ? 'text-white placeholder-zinc-600' : 'text-black placeholder-zinc-400'}`} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </section>

      {/* STORIES ROW */}
      <section className="mt-8 px-6 max-w-xl mx-auto overflow-x-auto no-scrollbar flex gap-5 py-2 z-10 relative">
        {storiesData.map((story, idx) => (
          <button key={story.id} onClick={() => { haptic(); setActiveStory(idx); }} className="flex flex-col items-center gap-1.5 focus:outline-none shrink-0 group">
            <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-brand-orange to-brand-amber shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full border border-black overflow-hidden bg-zinc-900">
                <img src={story.img} className="w-full h-full object-cover" alt="" />
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">{story.title[lang]}</span>
          </button>
        ))}
      </section>

      {/* GRID CONFIGURATION */}
      <main className="mt-8 px-4 max-w-7xl mx-auto space-y-24 pb-64 relative z-10">
        {["Chaap", "Tikka", "Rolls", "Snacks", "Sweets"].map((catName) => {
          const items = filteredItems.filter(i => i.category === catName);
          if (items.length === 0) return null;
          return (
            <div key={catName} ref={el => scrollRefs.current[catName] = el} className="space-y-12 scroll-mt-48">
              <div className="flex justify-between items-end border-b-2 border-brand-orange/10 pb-4 px-2">
                 <h2 className="text-4xl font-black italic uppercase tracking-tight font-display bg-gradient-to-r from-brand-orange to-brand-amber bg-clip-text text-transparent">{catName}</h2>
                 <span className="text-[10px] font-black opacity-40 uppercase tracking-widest text-brand-orange">Handcrafted Taste</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className={`${isDark ? 'bg-zinc-950/40 border-white/5' : 'bg-white/80 border-orange-100/50'} rounded-[3rem] p-4 border relative overflow-hidden h-[300px] flex flex-col justify-between`}>
                      <div className={`w-full h-38 md:h-44 rounded-[2.2rem] ${isDark ? 'animate-shimmer' : 'animate-shimmer-light'}`} />
                      <div className="space-y-3 mt-4">
                        <div className={`h-4 w-3/4 mx-auto rounded-md ${isDark ? 'animate-shimmer' : 'animate-shimmer-light'}`} />
                        <div className={`h-6 w-1/2 mx-auto rounded-md ${isDark ? 'animate-shimmer' : 'animate-shimmer-light'}`} />
                        <div className={`h-10 w-full rounded-[1.8rem] ${isDark ? 'animate-shimmer' : 'animate-shimmer-light'}`} />
                      </div>
                    </div>
                  ))
                ) : (
                  items.map((p) => (
                    <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true, margin:"-50px"}} key={p.id} className={`${isDark ? 'bg-zinc-950/40 border-white/5 shadow-2xl hover:border-brand-orange/20' : 'bg-white/80 border-orange-100/50 shadow-md hover:border-brand-orange/30'} rounded-[3rem] p-4 border relative group overflow-hidden transition-all duration-300 hover:scale-[1.02] ${!p.inStock ? 'grayscale opacity-40' : ''}`}>
                      {isAdmin && (
                          <button onClick={() => setMenu(prev => prev.map(m => m.id === p.id ? {...m, inStock: !m.inStock} : m))} className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-white border-4 border-dashed border-brand-orange rounded-[3rem] p-4 text-center">
                              <span className="text-3xl mb-2">{p.inStock ? '✅ Live' : '❌ Out'}</span>
                              <span className="text-[10px] font-black uppercase tracking-wider">Toggle Stock</span>
                          </button>
                      )}
                      <div className="relative rounded-[2.2rem] overflow-hidden mb-4.5 h-38 md:h-44 bg-zinc-900 shadow-inner">
                        <img src={p.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                        <div className={`absolute bottom-3 left-3 backdrop-blur-md px-3 py-1 rounded-xl text-[9px] font-black text-white ${isDark ? 'bg-black/60' : 'bg-orange-600/90 shadow-sm'}`}>⏱️ {prepTime}m</div>
                        <div className="absolute top-3 right-3 backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-xl text-[9px] font-black text-yellow-400 flex items-center gap-1">⭐ {p.rating}</div>
                      </div>
                      <div className="text-center px-1">
                        <h3 className="text-xs font-black uppercase mb-1 h-12 flex items-center justify-center leading-tight tracking-tight italic font-display">{p.name[lang]}</h3>
                        <p className="text-brand-orange font-black text-2xl mb-4.5 italic tracking-tighter">₹{p.price}</p>
                        <button 
                          disabled={!isKitchenOpen || !p.inStock}
                          onClick={() => { haptic(); setShowCustomizer(p); }} 
                          className={`w-full py-4.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all duration-200 active:scale-95 shadow-md ${isKitchenOpen && p.inStock ? 'bg-gradient-to-r from-brand-orange to-brand-amber text-white shadow-brand-orange/10 hover:brightness-110' : `${isDark ? 'bg-zinc-900/60 border border-white/5 text-zinc-500' : 'bg-gray-200/60 text-zinc-400'}`}`}
                        >
                          {!p.inStock ? 'SOLD OUT' : isKitchenOpen ? 'Customize' : 'CLOSED'}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* FLOATING ACTION CART BUBBLE */}
      <AnimatePresence>
        {subtotal > 0 && !orderStatus && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0, opacity: 0 }} 
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-8 right-8 z-[1000]"
          >
            <button 
              onClick={() => { haptic(); setShowCheckout(true); }} 
              className="relative w-18 h-18 rounded-full bg-gradient-to-br from-brand-orange to-brand-amber shadow-[0_10px_35px_rgba(255,77,0,0.4)] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all group"
            >
              <div className="absolute inset-0 rounded-full bg-brand-orange animate-ping opacity-25 z-0" />
              <span className="text-3xl z-10 transition-transform duration-300 group-hover:rotate-12">🛒</span>
              {/* ITEM COUNT BADGE */}
              <motion.div 
                key={cart.length}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="absolute -top-1.5 -right-1.5 bg-white text-brand-orange text-xs font-black w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 border-brand-orange shadow-md z-20"
              >
                {cart.length}
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MASTER CONSOLE PANEL */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div initial={{y:-300, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-300, opacity:0}} className={`fixed top-24 left-4 right-4 z-[1100] p-7 rounded-[3rem] shadow-2xl border backdrop-blur-2xl transition-colors duration-300 ${isDark ? 'bg-zinc-950/90 border-brand-orange/20 text-white' : 'bg-white/95 border-orange-200 text-gray-900'}`}>
            <h3 className="text-xl font-black uppercase italic text-brand-orange mb-5 border-b border-brand-orange/10 pb-2.5 font-display">Master Admin Panel</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4.5 rounded-[2rem] border ${isDark ? 'bg-zinc-900/30 border-white/5' : 'bg-gray-50 border-orange-100/50'} text-center shadow-sm`}>
                    <p className="text-[10px] font-black uppercase mb-3.5 opacity-50 tracking-wider">Store Status</p>
                    <button onClick={() => setIsKitchenOpen(!isKitchenOpen)} className={`w-full py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all duration-200 active:scale-95 ${isKitchenOpen ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                        {isKitchenOpen ? 'Close Kitchen' : 'Open Kitchen'}
                    </button>
                </div>
                <div className={`p-4.5 rounded-[2rem] border ${isDark ? 'bg-zinc-900/30 border-white/5' : 'bg-gray-50 border-orange-100/50'} text-center shadow-sm`}>
                    <p className="text-[10px] font-black uppercase mb-3.5 opacity-50 tracking-wider">Prep Duration</p>
                    <div className="flex items-center justify-between px-2">
                        <button onClick={()=>setPrepTime(p=>Math.max(5,p-5))} className="w-8 h-8 bg-brand-orange/10 rounded-full font-black text-brand-orange hover:bg-brand-orange/20 active:scale-90 transition-all">-</button>
                        <span className="text-lg font-black font-display">{prepTime}m</span>
                        <button onClick={()=>setPrepTime(p=>p+5)} className="w-8 h-8 bg-brand-orange/10 rounded-full font-black text-brand-orange hover:bg-brand-orange/20 active:scale-90 transition-all">+</button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT PORTAL MODAL */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-end justify-center p-4">
             <motion.div initial={{y:300}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950/95 border-white/5' : 'bg-white border-orange-100'} w-full border rounded-[3rem] p-7 max-w-2xl overflow-y-auto max-h-[85vh] shadow-2xl relative`}>
                <div className="flex justify-between items-center mb-6 border-b border-brand-orange/10 pb-4">
                  <h2 className="text-2xl font-black uppercase italic text-brand-orange font-display">Your Basket</h2>
                  <button onClick={() => setShowCheckout(false)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white w-9 h-9 rounded-full font-black flex items-center justify-center transition-all">✕</button>
                </div>
                
                <div className="space-y-3 mb-6 max-h-52 overflow-y-auto pr-2 no-scrollbar">
                  {cart.map((c) => (
                    <div key={c.cartId} className={`flex justify-between items-center border p-4.5 rounded-[1.8rem] transition-colors ${isDark ? 'bg-zinc-900/30 border-white/5' : 'bg-gray-50/50 border-orange-50/50'}`}>
                       <div className="text-left">
                         <p className="text-sm font-black uppercase tracking-tight">{c.name[lang]}</p>
                         <p className="text-[9px] text-brand-orange font-black uppercase tracking-widest mt-0.5">{c.spice} spice</p>
                       </div>
                       <div className="flex items-center gap-4">
                         <p className="font-black text-lg font-display">₹{c.price}</p>
                         <button onClick={() => removeFromCart(c.cartId)} className="text-red-500 text-[9px] font-black bg-red-500/10 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all">Delete</button>
                       </div>
                    </div>
                  ))}
                </div>

                {/* ADDONS CONTROLLER */}
                <h3 className="text-[10px] font-black uppercase opacity-50 mb-3 tracking-widest text-brand-orange">Enhance Your Plate</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                   {addonsData.map(a => (
                     <div key={a.id} className={`${isDark ? 'bg-zinc-900/30 border-white/5' : 'bg-gray-50/50 border-orange-50/50'} border p-3 rounded-2xl text-center shadow-sm`}>
                        <p className="text-[10px] font-black truncate uppercase tracking-tight">{a.name[lang]}</p>
                        <p className="text-xs font-black text-brand-orange mb-2 font-display">+₹{a.price}</p>
                        <div className={`flex justify-between items-center rounded-xl p-1 ${isDark ? 'bg-zinc-950/80' : 'bg-gray-200/50'}`}>
                          <button onClick={() => setAddons({...addons, [a.id]: Math.max(0, (addons[a.id] || 0) - 1)})} className="text-brand-orange font-black px-2 hover:opacity-80 active:scale-75 transition-all">-</button>
                          <span className="text-[10px] font-black">{addons[a.id] || 0}</span>
                          <button onClick={() => setAddons({...addons, [a.id]: (addons[a.id] || 0) + 1})} className="text-brand-orange font-black px-2 hover:opacity-80 active:scale-75 transition-all">+</button>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="flex justify-between items-center mb-6 border-t border-brand-orange/10 pt-4 px-2">
                   <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Total Bill</p>
                   <p className="text-4xl font-black text-brand-orange font-display">₹{subtotal}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => processOrder('UPI')} className="bg-[#1A73E8] hover:bg-[#1557b0] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all duration-200 active:scale-95">💳 UPI INSTANT</button>
                   <button onClick={() => processOrder('WA')} className="bg-[#25D366] hover:bg-[#20ba59] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 transition-all duration-200 active:scale-95">📱 WHATSAPP</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIVE ITEM CUSTOMIZER DRAWER */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[3000] flex items-end justify-center p-4">
            <motion.div initial={{y:300}} animate={{y:0}} className={`${isDark ? 'bg-zinc-950/95 border-white/5' : 'bg-white border-orange-100'} w-full border rounded-[3rem] p-7 max-w-md shadow-2xl relative`}>
              <div className="flex justify-between items-center mb-5 border-b border-brand-orange/10 pb-3.5">
                <h2 className="text-xl font-black uppercase tracking-tight italic font-display">{showCustomizer.name[lang]}</h2>
                <button onClick={() => setShowCustomizer(null)} className="text-gray-500 font-bold hover:text-red-500 transition-all">✕</button>
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-50 mb-3 text-brand-orange">Choose Spice Level</p>
              <div className="mb-7 px-2">
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  value={customOptions.spice} 
                  onChange={(e) => setCustomOptions({ spice: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                  style={{
                    background: customOptions.spice === 1 
                      ? '#22c55e' 
                      : customOptions.spice === 2 
                        ? 'linear-gradient(to right, #f97316, #facc15)' 
                        : 'linear-gradient(to right, #dc2626, #ff8800)'
                  }}
                />
                <div className="flex justify-between text-[10px] font-black uppercase opacity-60 mt-3.5">
                  <span className={customOptions.spice === 1 ? 'text-green-500 scale-110 font-black transition-all' : 'transition-all'}>🌶️ Mild</span>
                  <span className={customOptions.spice === 2 ? 'text-orange-500 scale-110 font-black transition-all' : 'transition-all'}>🌶️🌶️ Medium</span>
                  <span className={customOptions.spice === 3 ? 'text-red-500 scale-110 font-black transition-all' : 'transition-all'}>🌶️🌶️🌶️ Hot</span>
                </div>
              </div>
              <button onClick={(e) => handleAddToBasket(e)} className="w-full bg-gradient-to-r from-brand-orange to-brand-amber text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-brand-orange/15 tracking-widest hover:brightness-110 active:scale-95 transition-all">Add to Basket</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REAL-TIME SIMULATED PROGRESS ENGINE */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/95 z-[5000] flex flex-col items-center justify-center p-6 text-center">
             <motion.div animate={{ scale:[1, 1.15, 1], rotate:[0, 8, -8, 0] }} transition={{repeat:Infinity, duration:2.5, ease:"easeInOut"}} className="text-9xl mb-8 filter drop-shadow-[0_0_35px_rgba(255,77,0,0.5)]">🥘</motion.div>
             <h2 className="text-4xl font-black uppercase text-brand-orange mb-2 font-display tracking-tight italic">Roasting in Tandoor...</h2>
             <p className="text-[10px] text-zinc-500 mb-8 max-w-xs uppercase font-black tracking-widest opacity-75">Getting spices and heat synced by the chef</p>
             <div className="w-60 h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                <motion.div initial={{width:0}} animate={{width:`${cookingProgress}%`}} className="h-full bg-gradient-to-r from-brand-orange to-brand-amber rounded-full shadow-[0_0_10px_rgba(255,77,0,0.8)]"></motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STORIES VIEWER */}
      <AnimatePresence>
        {activeStory !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[6000] flex items-center justify-center p-4">
            <div className="w-full max-w-md h-[80vh] relative rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-end p-8 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), url(${storiesData[activeStory].img})` }}>
              
              {/* TOP STORY TIMER PROGRESS BARS */}
              <div className="absolute top-6 left-6 right-6 flex gap-1.5 z-20">
                {storiesData.map((_, sIdx) => (
                  <div key={sIdx} className="h-1 bg-white/20 rounded-full flex-1 overflow-hidden">
                    <div className="h-full bg-brand-orange rounded-full transition-all" style={{ width: sIdx < activeStory ? '100%' : sIdx === activeStory ? '100%' : '0%', transitionDuration: sIdx === activeStory ? '5s' : '0s' }} />
                  </div>
                ))}
              </div>

              {/* CLOSE BUTTON */}
              <button onClick={() => setActiveStory(null)} className="absolute top-10 right-6 z-20 bg-black/50 text-white w-9 h-9 rounded-full font-black flex items-center justify-center backdrop-blur-md border border-white/10">✕</button>
              
              {/* NEXT / PREV BUTTON OVERLAYS */}
              <div className="absolute inset-0 flex z-10">
                <div onClick={() => setActiveStory(s => Math.max(0, s - 1))} className="w-1/3 h-full cursor-pointer" />
                <div onClick={() => setActiveStory(s => s === storiesData.length - 1 ? null : s + 1)} className="w-2/3 h-full cursor-pointer" />
              </div>

              {/* STORY DESCRIPTION */}
              <div className="relative z-20 text-left space-y-2 pointer-events-none">
                <h4 className="text-3xl font-black uppercase italic text-brand-orange font-display tracking-tight leading-none">{storiesData[activeStory].title[lang]}</h4>
                <p className="text-xs font-bold text-white/80 uppercase tracking-wide leading-relaxed">{storiesData[activeStory].highlight}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLYING PARTICLES LAYER */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {flyingParticles.map(p => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, scale: 1.5, opacity: 1 }}
            animate={{ 
              x: typeof window !== "undefined" ? window.innerWidth - 64 : 500, 
              y: typeof window !== "undefined" ? window.innerHeight - 64 : 800, 
              scale: 0.2, 
              opacity: 0 
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber shadow-[0_0_15px_#ff4d00] flex items-center justify-center text-white text-xs font-black"
          >
            🔥
          </motion.div>
        ))}
      </div>

      {/* THEME TRANSITION RIPPLE OVERLAY */}
      <AnimatePresence>
        {themeTransition && (
          <motion.div
            initial={{ clipPath: `circle(0px at ${themeTransition.x}px ${themeTransition.y}px)` }}
            animate={{ clipPath: `circle(${typeof window !== "undefined" ? Math.max(window.innerWidth, window.innerHeight) * 1.5 : 2000}px at ${themeTransition.x}px ${themeTransition.y}px)` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`fixed inset-0 z-[99999] pointer-events-none ${themeTransition.toDark ? 'bg-gradient-to-b from-[#080808] via-[#0D0D0D] to-[#0A0A0A]' : 'bg-gradient-to-b from-[#FAF8F5] via-[#FFFDFB] to-[#F7F4EF]'}`}
          />
        )}
      </AnimatePresence>

      {/* COMPACT FOOTER */}
      <footer className="mt-40 text-center opacity-30 text-[9px] font-black uppercase tracking-widest pb-12">
        <p>© 2026 The Flavour's Town | Developed by Aashray Narang</p>
      </footer>
    </div>
  );
}