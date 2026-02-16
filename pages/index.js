import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Home() {
  const router = useRouter();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (!saved) router.push('/auth'); 
    else {
      const u = JSON.parse(saved);
      setUser(u);
      // Fetch Wallet Balance
      onValue(ref(db, `wallets/${u.phone}`), (snap) => setWallet(snap.val() || 0));
    }

    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.exists() ? snap.val() : true));
  }, []);

  const itemTotal = cart.reduce((a, b) => a + b.price, 0);
  const cashback = Math.floor(itemTotal * 0.05); // 5% Cashback

  const placeOrder = () => {
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = {
        id: orderId, user, items: cart,
        total: itemTotal, cashbackEarned: cashback,
        status: 'Pending', timestamp: new Date().toISOString()
    };

    // Update Firebase Orders & Wallet
    set(ref(db, 'orders/' + orderId), orderData);
    update(ref(db, `wallets/${user.phone}`), { balance: wallet + cashback });
    
    alert(`Order Placed! ₹${cashback} Cashback added to wallet.`);
    setCart([]); setShowCheckout(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans pb-40">
      <Head><title>{APP_NAME}</title></Head>
      
      {/* --- PREMIUM HEADER WITH WALLET --- */}
      <header className="fixed top-0 w-full z-[150] bg-white/90 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-black italic text-orange-600 text-sm uppercase">The Flavours Town</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100 flex items-center gap-1">
            <span className="text-[10px] font-black text-orange-600 italic">WALLET: ₹{wallet}</span>
          </div>
        </div>
      </header>

      <main className="pt-24 px-4 max-w-4xl mx-auto">
        {/* --- COMBO DEALS BANNER --- */}
        <div className="mb-8">
          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em] mb-3">Today's Hot Combos 🔥</p>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            <div className="min-w-[280px] bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <h3 className="text-xl font-black italic mb-1 uppercase">Party Combo</h3>
                <p className="text-[10px] font-bold opacity-80 mb-4 uppercase tracking-tighter">Full Chaap + 2 Roti + Coke</p>
                <div className="flex justify-between items-end">
                    <span className="text-2xl font-black italic">₹249</span>
                    <button className="bg-white text-orange-600 px-6 py-2 rounded-2xl font-black text-[10px] uppercase">Add +</button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 text-8xl font-black italic">FT</div>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC MENU --- */}
        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em] mb-4">A-La-Carte Menu</p>
        <div className="grid grid-cols-2 gap-4">
          {menu.map(p => (
            <motion.div whileTap={{scale:0.95}} key={p.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-40 overflow-hidden"><img src={p.img} className="w-full h-full object-cover" /></div>
              <div className="p-4 text-center">
                <h3 className="text-[10px] font-black uppercase mb-1">{p.name.en}</h3>
                <p className="text-orange-600 font-black text-sm mb-3">₹{p.price}</p>
                <button onClick={() => setCart([...cart, p])} className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl text-[9px] font-black uppercase">Add +</button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- CART DRAWER WITH CASHBACK PREVIEW --- */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t rounded-t-[3rem] shadow-2xl z-[200]">
             <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-5 bg-green-50 p-3 rounded-2xl border border-green-100">
                    <span className="text-[10px] font-black text-green-600 uppercase italic">You are earning:</span>
                    <span className="text-xs font-black text-green-600">+ ₹{cashback} Cashback</span>
                </div>
                <button onClick={placeOrder} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase flex justify-between px-10 items-center shadow-xl">
                  <span>Checkout</span>
                  <span className="text-lg italic font-black">₹{itemTotal} →</span>
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}