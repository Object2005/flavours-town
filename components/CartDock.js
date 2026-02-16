import { motion, AnimatePresence } from 'framer-motion';
import { ref, set, serverTimestamp } from "firebase/database";

export default function CartDock({ cart, setCart, user, db, ui }) {
  const [payMethod, setPayMethod] = useState('COD');
  const total = cart.reduce((a, b) => a + b.price, 0);

  const placeOrder = async () => {
    if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
    const id = `FT-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = { id, user, items: cart, total, status: 'Received', method: payMethod, createdAt: serverTimestamp() };
    await set(ref(db, `orders/${id}`), payload);
    setCart([]);
    window.open(`https://wa.me/919877474778?text=New Order: ${id} by ${user.name}`, '_blank');
  };

  return (
    <AnimatePresence>
      {cart.length > 0 && (
        <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="fixed bottom-24 left-4 right-4 z-[200] bg-[#1a1a1a] text-white p-6 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
             {['COD', 'Online Pay', 'Pre-Order'].map(m => (
               <button key={m} onClick={() => setPayMethod(m)} className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${payMethod === m ? 'bg-orange-600' : 'bg-white/10 opacity-30'}`}>{m}</button>
             ))}
          </div>
          <div className="flex justify-between items-center px-4">
             <div>
                <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.4em] mb-1">{cart.length} Items Selected</p>
                <p className="text-3xl font-black italic tracking-tighter text-orange-500">₹{total}</p>
             </div>
             <button onClick={placeOrder} className="bg-orange-600 px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase shadow-xl shadow-orange-600/30 active:scale-95 transition-all">Checkout →</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}