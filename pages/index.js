import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

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

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (!saved) router.push('/auth'); else setUser(JSON.parse(saved));

    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.val() === true));
    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'orders'), snap => {
      if (snap.exists() && saved) {
        const u = JSON.parse(saved);
        const active = Object.values(snap.val()).find(o => o.user?.phone === u.phone && o.status !== 'Delivered');
        setUserOrder(active || null);
      }
    });
  }, []);

  const placeOrder = () => {
    if(!isShopOpen) return alert("Shop is Closed!");
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const total = cart.reduce((a, b) => a + b.price, 0);
    const orderData = { id: orderId, user, items: cart, total, status: 'Received', timestamp: new Date().toISOString() };
    set(ref(db, 'orders/' + orderId), orderData);
    window.open(`https://wa.me/${OWNER_PHONE}?text=Nava Order: ${orderId}, Total: ₹${total}`, '_blank');
    setCart([]);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-sans pb-40">
      <Head><title>The Flavours Town</title></Head>
      <header className="fixed top-0 w-full z-50 bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="font-black text-orange-600 italic uppercase">THE FLAVOURS TOWN</h1>
        {!isShopOpen && <div className="bg-red-500 text-white text-[9px] px-3 py-1 rounded-full font-black animate-pulse">CLOSED</div>}
      </header>

      <main className="pt-24 px-4 max-w-4xl mx-auto">
        {userOrder && (
          <div className="mb-8 p-6 bg-white rounded-3xl border-2 border-orange-500 shadow-lg shadow-orange-600/10">
            <p className="text-[10px] font-black opacity-30 uppercase mb-2 tracking-widest text-center italic">Live Tracking</p>
            <div className="flex gap-2 mb-4">
              {['Received', 'Cooking', 'Ready'].map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full ${userOrder.status === s || (i < 1 && userOrder.status === 'Cooking') || (i < 2 && userOrder.status === 'Ready') ? 'bg-orange-600' : 'bg-gray-100'}`} />
              ))}
            </div>
            <h2 className="text-xl font-black italic uppercase text-center">{userOrder.status}</h2>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {menu.map(p => (
            <div key={p.id} className={`bg-white rounded-3xl border border-gray-100 p-4 ${(!p.inStock || !isShopOpen) ? 'opacity-40 grayscale' : ''}`}>
              <img src={p.img} className="w-full h-32 object-cover rounded-2xl mb-3" />
              <h3 className="text-[11px] font-black uppercase truncate">{p.name.en}</h3>
              <p className="text-orange-600 font-black italic">₹{p.price}</p>
              <button onClick={() => setCart([...cart, p])} disabled={!isShopOpen || !p.inStock} className="w-full mt-3 py-2 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase">Add +</button>
            </div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{y:100}} animate={{y:0}} className="fixed bottom-6 left-6 right-6 p-5 bg-white border rounded-[2.5rem] shadow-2xl z-[100] flex justify-between items-center px-8">
             <div className="flex flex-col"><span className="text-[9px] font-black opacity-30 uppercase tracking-widest">Total</span><span className="text-xl font-black italic text-gray-900">₹{cart.reduce((a,b)=>a+b.price,0)}</span></div>
             <button onClick={placeOrder} className="bg-orange-600 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase shadow-xl shadow-orange-600/30">Order Now</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}