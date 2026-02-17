import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set, push, onValue } from "firebase/database";

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

export default function Home() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [tempUser, setTempUser] = useState(null);
  const [shopOpen, setShopOpen] = useState(true);

  useEffect(() => {
    // 1. Fetch Shop Status & Menu
    onValue(ref(db, 'shopStatus'), (snap) => setShopOpen(snap.val()));
    onValue(ref(db, 'menu'), (snap) => {
      const data = snap.val();
      if(data) setMenu(Object.values(data));
    });

    // 2. Check Local Login
    const saved = localStorage.getItem('ft_user');
    if (saved) { setUser(JSON.parse(saved)); setStep(3); }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      const townId = `${u.displayName.split(' ')[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setTempUser({ name: u.displayName, email: u.email, photo: u.photoURL, uid: u.uid, townId });
      setStep(2);
    } catch (e) { alert("Login Failed!"); }
    setLoading(false);
  };

  const finalizeUser = async () => {
    if (phone.length < 10) return alert("Sahi number bharo!");
    setLoading(true);
    const final = { ...tempUser, phone };
    await set(ref(db, 'users/' + final.uid), final);
    localStorage.setItem('ft_user', JSON.stringify(final));
    setUser(final); setStep(3);
    setLoading(false);
  };

  const placeOrder = async () => {
    if(!shopOpen) return alert("Shop is closed right now!");
    setLoading(true);
    const orderData = {
      customer: user,
      items: cart,
      total: cart.reduce((t, i) => t + i.price, 0),
      status: 'pending',
      timestamp: Date.now()
    };
    try {
      await push(ref(db, 'orders'), orderData);
      alert("Order Sent to Kitchen!");
      setCart([]);
    } catch (e) { alert("Order Failed!"); }
    setLoading(false);
  };

  if (step < 3) {
    return (
      <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 text-black">
        <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-2xl border text-center font-sans">
          <h1 className="text-3xl font-black italic text-orange-600 uppercase mb-8">Flavours Town</h1>
          {step === 1 ? (
            <button onClick={handleLogin} className="w-full py-5 border-2 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px]">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5" /> Login with Google
            </button>
          ) : (
            <div className="space-y-6">
              <input type="tel" placeholder="Phone Number" className="w-full p-5 bg-gray-50 rounded-2xl text-center font-bold outline-none" onChange={e => setPhone(e.target.value)} />
              <button onClick={finalizeUser} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest">Start Ordering →</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] pb-44 font-sans text-black">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md p-5 border-b z-50 flex justify-between items-center">
        <div>
           <h2 className="text-sm font-black italic text-orange-600 uppercase">Flavours Town 📍</h2>
           <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest">{shopOpen ? '● Open' : '○ Closed'}</p>
        </div>
        <div className="bg-black text-white px-3 py-1.5 rounded-xl font-black text-[9px] uppercase italic">ID: {user.townId}</div>
      </header>

      <main className="pt-24 px-5">
        <div className="grid grid-cols-1 gap-4">
          {menu.length > 0 ? menu.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl">🍲</div>
                <div><h4 className="font-black text-sm uppercase leading-tight">{item.name}</h4><p className="font-bold text-orange-600 text-xs mt-1">₹{item.price}</p></div>
              </div>
              <button onClick={() => setCart([...cart, item])} className="bg-black text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase">Add +</button>
            </div>
          )) : <p className="text-center opacity-30 font-bold uppercase py-20 text-xs">No Items in Menu Yet</p>}
        </div>
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-10 left-4 right-4 bg-orange-600 p-5 rounded-[2.5rem] flex justify-between items-center text-white shadow-2xl z-40">
          <div><p className="text-[8px] font-black uppercase opacity-60 leading-none">{cart.length} Items</p><p className="text-xl font-black italic">₹{cart.reduce((t, i) => t + i.price, 0)}</p></div>
          <button onClick={placeOrder} className="bg-white text-orange-600 px-7 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest">{loading ? 'Sending...' : 'Place Order →'}</button>
        </div>
      )}
    </div>
  );
}