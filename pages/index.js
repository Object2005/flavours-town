import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const OWNER_PHONE = "919877474778";

export default function Home() {
  const router = useRouter();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [userOrder, setUserOrder] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [lang, setLang] = useState('pu');

  // --- SOUND SYSTEM ---
  const playSound = (url) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.log("Sound blocked by browser"));
  };

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (!saved) router.push('/auth'); else setUser(JSON.parse(saved));

    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.exists() ? snap.val() : true));
    
    // TRACKING & SOUNDS
    onValue(ref(db, 'orders'), snap => {
      if (snap.exists() && saved) {
        const u = JSON.parse(saved);
        const orders = Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k}));
        const current = orders.find(o => o.user?.phone === u.phone && o.status !== 'Ready');
        
        // Notification sound if status changes
        if (current && userOrder && current.status !== userOrder.status) {
          playSound('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3'); 
        }
        setUserOrder(current || null);
      }
    });
  }, [userOrder?.status]);

  const placeOrder = (method) => {
    // Haptic feel
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const bill = cart.reduce((a,b) => a+b.price, 0);
    const orderData = { 
        id: orderId, user, items: cart, total: bill, 
        status: 'Pending', method, note: orderNote, 
        timestamp: new Date().toISOString() 
    };
    
    set(ref(db, 'orders/' + orderId), orderData);
    if(method === 'WhatsApp') {
        const msg = `*New Order: ${orderId}*%0AName: ${user.name}%0AItems: ${cart.map(i=>i.name.en).join(', ')}%0ANote: ${orderNote}%0ATotal: ₹${bill}`;
        window.open(`https://wa.me/${OWNER_PHONE}?text=${msg}`, '_blank');
    }
    setCart([]); setShowCheckout(false); setOrderNote('');
    playSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans pb-44">
      <Head><title>The Flavours Town</title></Head>
      
      {/* --- CLASSIC HEADER --- */}
      <header className="fixed top-0 w-full z-[150] bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center">
        <h1 className="font-black italic text-orange-600 text-sm uppercase tracking-tighter tracking-widest">The Flavours Town</h1>
        <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="text-[10px] font-black opacity-40 uppercase">{lang === 'en' ? 'ਪੰ' : 'EN'}</button>
      </header>

      <main className="pt-24 px-4 max-w-4xl mx-auto">
        {userOrder && (
          <motion.div initial={{scale:0.9}} animate={{scale:1}} className="mb-8 p-6 rounded-[2.5rem] bg-orange-600 text-white shadow-2xl shadow-orange-600/30">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase opacity-60">Status: {userOrder.status}</span>
                <span className="text-[10px] font-bold">ID: {userOrder.id}</span>
             </div>
             <h2 className="text-2xl font-black italic">{userOrder.status === 'Cooking' ? '👨‍🍳 Kitchen is Busy...' : '🔥 Order Received!'}</h2>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {menu.map(p => (
            <motion.div whileTap={{scale:0.95}} key={p.id} className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden ${!p.inStock ? 'opacity-30' : ''}`}>
              <div className="h-44 overflow-hidden bg-gray-50"><img src={p.img} className="w-full h-full object-cover" /></div>
              <div className="p-5 text-center">
                <h3 className="text-[11px] font-black uppercase mb-1 tracking-tight">{p.name[lang]}</h3>
                <p className="text-orange-600 font-black text-lg mb-4">₹{p.price}</p>
                <button onClick={() => { setCart([...cart, p]); if(window.navigator.vibrate) window.navigator.vibrate(20); }} disabled={!isShopOpen || !p.inStock} className="w-full py-3 bg-[#1a1a1a] text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-black/10">Add +</button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- COMPACT BILL & ADD-ONS --- */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-[200]">
             <div className="max-w-md mx-auto">
                {/* Add-on suggestion */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black opacity-30 uppercase">Frequently Added</p>
                    <button onClick={()=>setCart([...cart, menu.find(m=>m.category==="Sweets")])} className="text-[10px] font-black text-orange-600">+ ADD SWEETS</button>
                </div>
                
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-[9px] font-black opacity-40 uppercase mb-1">Total Bill</p>
                        <h2 className="text-2xl font-black italic">₹{cart.reduce((a,b)=>a+b.price,0)}</h2>
                    </div>
                    <button onClick={()=>setShowCheckout(true)} className="px-10 py-4 bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase shadow-xl shadow-orange-600/20">Checkout →</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CHECKOUT DRAWER --- */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 z-[300] bg-white p-8 flex flex-col pt-24">
            <h2 className="text-5xl font-black italic mb-10 tracking-tighter">ORDER NOTES</h2>
            
            <textarea placeholder="e.g. Less spicy, Extra dip..." value={orderNote} onChange={e=>setOrderNote(e.target.value)} className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 font-bold mb-8 h-32 outline-none focus:border-orange-500" />
            
            <div className="space-y-3 mb-10">
                <p className="text-[10px] font-black opacity-30 uppercase ml-2">Choose Method</p>
                <div className="flex gap-2">
                    {['COD', 'WhatsApp', 'UPI'].map(m => (
                        <button key={m} onClick={()=>placeOrder(m)} className="flex-1 py-5 bg-[#1a1a1a] text-white rounded-3xl font-black text-[11px] uppercase tracking-widest active:bg-orange-600">{m}</button>
                    ))}
                </div>
            </div>
            
            <button onClick={()=>setShowCheckout(false)} className="opacity-20 text-[10px] font-black uppercase text-center tracking-[0.4em]">Cancel Order</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}