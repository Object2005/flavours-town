import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const ADMIN_PASS = "aashray778";
const OWNER_PHONE = "919877474778";
const APP_NAME = "The Flavours Town";

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [liveOrders, setLiveOrders] = useState([]);
  const [userOrder, setUserOrder] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [userDetails, setUserDetails] = useState({ name: '', phone: '', note: '' });
  const [showCheckout, setShowCheckout] = useState(false);
  const [lang, setLang] = useState('pu');

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (saved) setUserDetails(JSON.parse(saved));

    onValue(ref(db, 'menu'), (snap) => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'shopStatus'), (snap) => setIsShopOpen(snap.exists() ? snap.val() : true));
    onValue(ref(db, 'orders'), (snap) => {
      if (snap.exists()) {
        const orders = Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k}));
        setLiveOrders(orders);
        setUserOrder(orders.find(o => o.user?.phone === userDetails.phone) || null);
      }
    });
  }, [userDetails.phone]);

  const placeOrder = () => {
    if (!userDetails.name || userDetails.phone.length < 10) return alert("Details bharo!");
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = {
        id: orderId, user: userDetails, items: cart,
        total: cart.reduce((a,b)=>a+b.price,0) + 10,
        status: 'Pending', timestamp: new Date().toISOString()
    };
    set(ref(db, 'orders/' + orderId), orderData);
    localStorage.setItem('ft_user', JSON.stringify(userDetails));
    
    // WhatsApp Msg with Note
    const msg = `*NEW ORDER* %0AID: ${orderId} %0AName: ${userDetails.name} %0ANote: ${userDetails.note || 'None'} %0ATotal: ₹${orderData.total}`;
    window.open(`https://wa.me/${OWNER_PHONE}?text=${msg}`, '_blank');
    
    setCart([]); setShowCheckout(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#1a1a1a] font-sans">
      <Head><title>{APP_NAME}</title></Head>

      {/* --- CLASSIC HEADER --- */}
      <header className="fixed top-0 w-full z-[150] bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="font-black text-sm italic text-orange-600 uppercase tracking-tighter">{APP_NAME}</h1>
        <div className="flex gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'pu' : 'en')} className="text-[10px] font-bold text-gray-500 uppercase">{lang === 'en' ? 'ਪੰ' : 'EN'}</button>
            <button onClick={() => { const p=prompt("Pass:"); if(p===ADMIN_PASS) setIsAdmin(!isAdmin); }} className="opacity-10 text-[8px]">⚙️</button>
        </div>
      </header>

      <main className="pt-24 pb-48 px-4 max-w-5xl mx-auto">
        {!isShopOpen && !isAdmin && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center font-bold text-sm">
                🏠 Shop is currently closed. We'll be back soon!
            </div>
        )}

        {isAdmin ? (
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-200 shadow-sm mb-6">
                <div>
                    <p className="text-[10px] font-black opacity-40 uppercase">Shop Status</p>
                    <button onClick={() => set(ref(db, 'shopStatus'), !isShopOpen)} className={`mt-1 px-4 py-2 rounded-full text-[10px] font-bold text-white ${isShopOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isShopOpen ? 'SHOP OPEN' : 'SHOP CLOSED'}
                    </button>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black opacity-40 uppercase">Galla</p>
                    <h2 className="text-xl font-black text-green-600">₹{liveOrders.reduce((a,b)=>a+(b.total||0),0)}</h2>
                </div>
             </div>
             {liveOrders.slice().reverse().map(o => (
               <div key={o.id} className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm">
                  <div className="flex justify-between font-bold text-xs mb-1">
                    <span>{o.user?.name}</span>
                    <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="text-gray-300">X</button>
                  </div>
                  <p className="text-[10px] text-orange-600 font-bold mb-3 italic">Note: {o.user?.note || 'No special instructions'}</p>
                  <div className="flex gap-2">
                    {['Pending', 'Cooking', 'Ready'].map(s => (
                      <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status:s})} className={`flex-1 py-3 rounded-xl text-[9px] font-black ${o.status===s ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</button>
                    ))}
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {menu.map(p => (
              <div key={p.id} className={`rounded-[2.5rem] bg-white border border-gray-100 shadow-sm overflow-hidden transition-all ${!p.inStock ? 'opacity-40 grayscale' : ''}`}>
                <div className="h-44 overflow-hidden"><img src={p.img} className="w-full h-full object-cover" /></div>
                <div className="p-5 text-center">
                  <h3 className="text-[11px] font-black uppercase mb-1 tracking-tight">{p.name[lang]}</h3>
                  <p className="text-orange-600 font-black text-lg mb-4 italic">₹{p.price}</p>
                  <button onClick={() => setCart([...cart, p])} disabled={!isShopOpen || !p.inStock} className="w-full py-3 bg-[#1a1a1a] text-white rounded-2xl text-[10px] font-black uppercase shadow-lg disabled:bg-gray-200">Add +</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- CLASSIC CART UI --- */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[200] p-6 bg-white border-t border-gray-100 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-5">
              <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Total Bill</span>
              <span className="text-2xl font-black italic">₹{cart.reduce((a,b)=>a+b.price,0)+10}</span>
            </div>
            <button onClick={() => setShowCheckout(true)} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20">Review Order</button>
          </div>
        </div>
      )}

      {/* --- CHECKOUT DRAWER --- */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} className="fixed inset-0 z-[300] bg-white p-8 flex flex-col justify-center">
            <h2 className="text-5xl font-black italic mb-10 text-[#1a1a1a] uppercase tracking-tighter">Your Details</h2>
            <div className="space-y-4 mb-8">
              <input placeholder="Name" value={userDetails.name} onChange={e=>setUserDetails({...userDetails, name:e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold outline-none focus:border-orange-500" />
              <input type="number" placeholder="Mobile No." value={userDetails.phone} onChange={e=>setUserDetails({...userDetails, phone:e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold outline-none focus:border-orange-500" />
              <textarea placeholder="Any special note? (e.g. Less spicy)" value={userDetails.note} onChange={e=>setUserDetails({...userDetails, note:e.target.value})} className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold outline-none focus:border-orange-500 h-24 resize-none" />
            </div>
            <button onClick={placeOrder} className="w-full py-6 bg-orange-600 text-white rounded-[2.5rem] font-black text-xl mb-4 shadow-2xl">PLACE ORDER</button>
            <button onClick={()=>setShowCheckout(false)} className="opacity-30 text-[9px] font-black uppercase text-center tracking-[0.3em]">Cancel</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}