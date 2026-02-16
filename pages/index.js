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
  const [method, setMethod] = useState('COD');

  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (!saved) router.push('/auth'); else setUser(JSON.parse(saved));

    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.exists() ? snap.val() : true));
    onValue(ref(db, 'orders'), snap => {
      if (snap.exists() && saved) {
        const u = JSON.parse(saved);
        const orders = Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k}));
        setUserOrder(orders.find(o => o.user?.phone === u.phone && o.status !== 'Ready') || null);
      }
    });
  }, []);

  const placeOrder = () => {
    const orderId = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const bill = cart.reduce((a,b)=>a+b.price,0) + 10;
    const orderData = { id: orderId, user, items: cart, total: bill, status: 'Pending', method, timestamp: new Date().toISOString() };
    set(ref(db, 'orders/' + orderId), orderData);
    if(method === 'WhatsApp') window.open(`https://wa.me/${OWNER_PHONE}?text=New Order: ${orderId}`, '_blank');
    if(method === 'UPI') window.location.href = `upi://pay?pa=9877474778@paytm&pn=FT&am=${bill}&cu=INR`;
    setCart([]); setShowCheckout(false);
  };

  const cancelOrder = () => {
    const orderTime = new Date(userOrder.timestamp).getTime();
    const now = new Date().getTime();
    if (now - orderTime < 300000) { // 5 minutes
      remove(ref(db, `orders/${userOrder.id}`));
      alert("Order Cancelled!");
    } else {
      alert("Cannot cancel after 5 mins! Chef has started cooking.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf7] font-sans pb-40">
      <Head><title>The Flavours Town</title></Head>
      
      <header className="fixed top-0 w-full z-[100] bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="font-black italic text-orange-600 text-sm uppercase">The Flavours Town</h1>
        <span className="text-[10px] font-bold opacity-40 uppercase">Hi, {user.name}</span>
      </header>

      <main className="pt-24 px-4 max-w-4xl mx-auto">
        {userOrder && (
          <motion.div initial={{y:10}} animate={{y:0}} className="mb-8 p-6 rounded-[2.5rem] bg-orange-600 text-white shadow-xl">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase opacity-60">Status: {userOrder.status}</span>
                {userOrder.status === 'Pending' && <button onClick={cancelOrder} className="text-[10px] font-black underline">CANCEL ORDER</button>}
             </div>
             <h2 className="text-xl font-black italic">{userOrder.status === 'Pending' ? '👨‍🍳 Waiting for Chef...' : '🔥 Cooking in progress!'}</h2>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {menu.map(p => (
            <div key={p.id} className={`bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden ${!p.inStock ? 'opacity-30' : ''}`}>
              <div className="h-40 overflow-hidden"><img src={p.img} className="w-full h-full object-cover" /></div>
              <div className="p-4 text-center">
                <h3 className="text-[10px] font-black uppercase mb-1">{p.name.en}</h3>
                <p className="text-orange-600 font-black text-sm mb-3">₹{p.price}</p>
                <button onClick={() => setCart([...cart, p])} disabled={!isShopOpen || !p.inStock} className="w-full py-3 bg-[#1a1a1a] text-white rounded-xl text-[9px] font-black uppercase">Add +</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- BILL SUMMARY DRAWER --- */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{y:'100%'}} animate={{y:0}} className="fixed inset-0 z-[300] bg-white p-8 flex flex-col pt-20">
            <h2 className="text-4xl font-black italic mb-8">BILLING</h2>
            <div className="bg-gray-50 p-6 rounded-3xl mb-6 space-y-3">
              {cart.map((i,idx)=>(<div key={idx} className="flex justify-between text-xs font-bold uppercase"><span>{i.name.en}</span><span>₹{i.price}</span></div>))}
              <div className="border-t pt-2 flex justify-between text-xs font-black"><span>PACKING</span><span>₹10</span></div>
              <div className="border-t pt-2 flex justify-between text-xl font-black italic text-orange-600"><span>TOTAL</span><span>₹{cart.reduce((a,b)=>a+b.price,0)+10}</span></div>
            </div>

            <div className="space-y-2 mb-8">
              <p className="text-[10px] font-black opacity-40 uppercase ml-2">Select Payment</p>
              <div className="flex gap-2">
                {['COD', 'WhatsApp', 'UPI'].map(m => (
                  <button key={m} onClick={()=>setMethod(m)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] border ${method===m ? 'bg-orange-600 text-white border-orange-600':'bg-white text-black border-gray-100'}`}>{m}</button>
                ))}
              </div>
            </div>

            <button onClick={placeOrder} className="w-full py-6 bg-[#1a1a1a] text-white rounded-[2.5rem] font-black text-lg mb-4 shadow-2xl">PLACE ORDER</button>
            <button onClick={()=>setShowCheckout(false)} className="opacity-30 text-[10px] font-black uppercase text-center">Go Back</button>
          </motion.div>
        )}
      </AnimatePresence>

      {cart.length > 0 && !showCheckout && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t rounded-t-[3rem] shadow-2xl z-[150]">
          <button onClick={()=>setShowCheckout(true)} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase flex justify-between px-8">
            <span>Review Bill ({cart.length})</span>
            <span>₹{cart.reduce((a,b)=>a+b.price,0)+10} →</span>
          </button>
        </div>
      )}
    </div>
  );
}