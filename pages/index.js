import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onValue, update } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  appId: "1:631949771733:web:16e025bbc443493242735c",
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

const INITIAL_MENU = [
  { id: 1, name: "Malai Chaap", price: 100, img: "🍢", category: "Chaap" },
  { id: 2, name: "Masala Chaap", price: 100, img: "🔥", category: "Chaap" },
  { id: 4, name: "Paneer Tikka", price: 140, img: "🧀", category: "Snacks" },
  { id: 7, name: "Pav Bhaji", price: 50, img: "🍞", category: "Snacks" },
  { id: 8, name: "Cheese Chilli", price: 250, img: "🥘", category: "Chinese" },
  { id: 11, name: "French Fries", price: 70, img: "🍟", category: "Sides" },
  { id: 17, name: "Gulab Jamun", price: 20, img: "🍯", category: "Sweets" },
  { id: 19, name: "Special Thali", price: 180, img: "🍱", category: "Main" }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [mounted, setMounted] = useState(false);

  // --- CONFIG DETAILS ---
  const SHOP_PHONE = "919041113220"; // Replace with your number
  const UPI_ID = "narangaashray34@okaxis"; // Replace with your UPI
  const ADMIN_EMAIL = "narangaashray34@gmail.com"; 
  // ----------------------

  useEffect(() => {
    setMounted(true);
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        if (u.email === ADMIN_EMAIL) setIsAdmin(true);
      }
    });

    const menuRef = ref(db, 'menu');
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMenu(Object.values(data));
      } else {
        setMenu(INITIAL_MENU.map(item => ({ ...item, inStock: true })));
      }
    });
  }, []);

  const handleLogin = () => signInWithPopup(auth, provider);

  const toggleStock = (id, currentStatus) => {
    if (!isAdmin) return;
    update(ref(db, `menu/${id}`), { inStock: !currentStatus });
  };

  const checkout = () => {
    const total = cart.reduce((t, i) => t + i.price, 0);
    const summary = cart.map(i => `• ${i.name}`).join('%0A');
    const msg = `*NEW ORDER - FLAVOURS TOWN*%0A%0A*Items:*%0A${summary}%0A%0A*Total: ₹${total}*%0A*Customer:* ${user.displayName}`;
    window.open(`https://wa.me/${SHOP_PHONE}?text=${msg}`, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-black font-sans selection:bg-orange-100">
      <Head>
        <title>Flavours Town | Sovereign Build</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      </Head>

      {/* Navbar */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b p-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-orange-600">Flavours Town</h1>
          <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Malout's Finest 📍</p>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            {isAdmin && <span className="text-[8px] bg-black text-white px-2 py-1 rounded-full font-black uppercase">Admin Mode</span>}
            <img src={user.photoURL} className="w-8 h-8 rounded-full border-2 border-orange-500" />
          </div>
        ) : (
          <button onClick={handleLogin} className="text-[10px] font-black uppercase border-b-2 border-black">Login</button>
        )}
      </nav>

      <main className="p-6 max-w-2xl mx-auto pb-40">
        <header className="mb-10">
          <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Fresh <br/><span className="text-orange-600">Arrivals</span></h2>
        </header>

        <div className="grid gap-4">
          {menu.map((item) => (
            <motion.div layout key={item.id} className={`group bg-white p-5 rounded-[2.5rem] border transition-all ${!item.inStock ? 'opacity-40 grayscale' : 'hover:shadow-xl hover:border-orange-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-orange-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">{item.img}</div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight">{item.name}</h3>
                    <p className="text-orange-600 font-bold text-sm italic">₹{item.price}</p>
                  </div>
                </div>
                
                {isAdmin ? (
                  <button onClick={() => toggleStock(item.id, item.inStock)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${item.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.inStock ? 'In Stock' : 'Sold Out'}
                  </button>
                ) : (
                  <button 
                    disabled={!item.inStock}
                    onClick={() => { if(window.navigator.vibrate) window.navigator.vibrate(50); setCart([...cart, item]); }}
                    className="bg-black text-white h-12 w-24 rounded-2xl font-black text-[10px] uppercase italic active:scale-90 transition-all disabled:bg-gray-200"
                  >
                    {item.inStock ? 'Add +' : 'Out'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Cart & Payment Section */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-8 left-4 right-4 z-[150]">
            <div className="bg-orange-600 rounded-[3rem] p-6 shadow-[0_20px_50px_rgba(234,88,12,0.4)] flex justify-between items-center text-white border-t border-orange-400">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">{cart.length} Items Selected</p>
                <p className="text-3xl font-black italic tracking-tighter">₹{cart.reduce((t, i) => t + i.price, 0)}</p>
              </div>
              <button onClick={() => setShowPayment(true)} className="bg-white text-orange-600 px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest italic shadow-xl active:scale-95 transition-all">Checkout →</button>
            </div>
          </motion.div>
        )}

        {showPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-sm rounded-[3.5rem] p-10 text-center relative">
              <button onClick={() => setShowPayment(false)} className="absolute top-8 right-8 text-2xl font-light">×</button>
              <h2 className="text-3xl font-black uppercase italic mb-2 tracking-tighter">Payment</h2>
              <p className="text-orange-600 font-bold mb-8 italic">Pay ₹{cart.reduce((t, i) => t + i.price, 0)} to Place Order</p>
              
              <div className="bg-gray-50 p-6 rounded-[2.5rem] mb-8 inline-block border-2 border-dashed border-gray-200">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${UPI_ID}&pn=FlavoursTown&am=${cart.reduce((t, i) => t + i.price, 0)}&cu=INR`} 
                  alt="UPI QR" className="w-48 h-48 mix-blend-multiply" 
                />
              </div>

              <button onClick={checkout} className="w-full py-6 bg-green-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all mb-4">Confirm & Order</button>
              <p className="text-[8px] font-bold opacity-30 uppercase">Scan with GPay, PhonePe or Paytm</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}