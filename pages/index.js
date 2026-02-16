import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [payMethod, setPayMethod] = useState('COD');

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (saved) setUser(JSON.parse(saved));
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.val() === true));
    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
  }, []);

  const placeOrder = () => {
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = { id: orderId, user, items: cart, total: cart.reduce((a,b)=>a+b.price,0), method: payMethod, status: 'Received', timestamp: new Date().toISOString() };
    set(ref(db, 'orders/' + orderId), orderData);
    alert(`Order Placed with ${payMethod}!`);
    setCart([]);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-sans pb-32 transition-all">
      {/* HEADER */}
      <header className="p-6 bg-white flex justify-between items-center sticky top-0 z-50 border-b">
        <h1 className="font-black italic text-orange-600">THE FLAVOURS TOWN</h1>
        {!isShopOpen && <span className="bg-red-500 text-white text-[8px] px-2 py-1 rounded-full animate-pulse">CLOSED</span>}
      </header>

      {/* TABS CONTENT */}
      <main className="p-4">
        {activeTab === 'home' && (
          <div className="grid grid-cols-2 gap-4">
            {menu.map(p => (
              <div key={p.id} className={`bg-white rounded-3xl p-4 border border-gray-50 shadow-sm ${(!p.inStock || !isShopOpen) ? 'opacity-30' : ''}`}>
                <img src={p.img} className="w-full h-32 object-cover rounded-2xl mb-3" />
                <h3 className="text-[10px] font-black uppercase truncate">{p.name?.en}</h3>
                <p className="text-orange-600 font-black italic">₹{p.price}</p>
                <button onClick={() => setCart([...cart, p])} disabled={!isShopOpen || !p.inStock} className="w-full mt-2 py-2 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Add +</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && <div className="text-center py-20 font-black opacity-20 italic">No Past Orders</div>}
      </main>

      {/* CHECKOUT POPUP */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-20 left-4 right-4 bg-white p-6 rounded-[2.5rem] shadow-2xl border z-[60]">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
               {['COD', 'WhatsApp Pay', 'Pre-Order'].map(m => (
                 <button key={m} onClick={()=>setPayMethod(m)} className={`px-4 py-2 rounded-full text-[9px] font-black whitespace-nowrap ${payMethod === m ? 'bg-orange-600 text-white' : 'bg-gray-100 opacity-50'}`}>{m}</button>
               ))}
            </div>
            <button onClick={placeOrder} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase flex justify-between px-8 italic">
              <span>Checkout</span>
              <span>₹{cart.reduce((a,b)=>a+b.price,0)} →</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ZOMATO STYLE BOTTOM TABS */}
      <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around py-4 z-[100]">
         {['home', 'search', 'orders', 'settings'].map(tab => (
           <button key={tab} onClick={()=>setActiveTab(tab)} className={`text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'text-orange-600 scale-110' : 'opacity-30'}`}>
             {tab}
           </button>
         ))}
      </nav>
    </div>
  );
}