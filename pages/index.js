import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

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

// --- THE FULL 19 ITEMS LIST ---
const MENU_DATA = [
  { id: 1, name: 'Malai Chaap', price: 100, icon: '🍢', cat: 'Chaap' },
  { id: 2, name: 'Masala Chaap', price: 100, icon: '🔥', cat: 'Chaap' },
  { id: 3, name: 'Afghani Chaap', price: 100, icon: '⚪', cat: 'Chaap' },
  { id: 4, name: 'Paneer Tikka', price: 140, icon: '🧀', cat: 'Tikka' },
  { id: 5, name: 'Mushroom Tikka', price: 120, icon: '🍄', cat: 'Tikka' },
  { id: 6, name: 'Pav Bhaji', price: 50, icon: '🍞', cat: 'Snacks' },
  { id: 7, name: 'Twister Roll', price: 50, icon: '🌯', cat: 'Rolls' },
  { id: 8, name: 'Cheese Chilli', price: 250, icon: '🌶️', cat: 'Main' },
  { id: 9, name: 'Gulab Jamun (1pc)', price: 20, icon: '🍯', cat: 'Sweet' },
  { id: 10, name: 'Garam Gajrela', price: 60, icon: '🥕', cat: 'Sweet' },
  { id: 11, name: 'Veg Burger', price: 60, icon: '🍔', cat: 'Burger' },
  { id: 12, name: 'Cheese Burger', price: 80, icon: '🧀', cat: 'Burger' },
  { id: 13, name: 'French Fries', price: 70, icon: '🍟', cat: 'Sides' },
  { id: 14, name: 'Veg Noodles', price: 90, icon: '🍜', cat: 'Chinese' },
  { id: 15, name: 'Spring Roll', price: 60, icon: '🥖', cat: 'Chinese' },
  { id: 16, name: 'Manchurian', price: 100, icon: '🧆', cat: 'Chinese' },
  { id: 17, name: 'Cold Coffee', price: 70, icon: '🧋', cat: 'Drinks' },
  { id: 18, name: 'Masala Dosa', price: 110, icon: '🥞', cat: 'South' },
  { id: 19, name: 'Special Thali', price: 180, icon: '🍱', cat: 'Main' }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [tempUser, setTempUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
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
    try {
      await set(ref(db, 'users/' + final.uid), final);
      localStorage.setItem('ft_user', JSON.stringify(final));
      setUser(final); setStep(3);
    } catch (e) { alert("Error!"); }
    setLoading(false);
  };

  if (step < 3) {
    return (
      <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-2xl border text-center text-black">
          <h1 className="text-3xl font-black italic text-orange-600 uppercase mb-8 tracking-tighter">The Flavour's Town</h1>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.button key="l" onClick={handleLogin} className="w-full py-5 border-2 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px]">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5" /> {loading ? 'Wait...' : 'Login with Google'}
              </motion.button>
            ) : (
              <motion.div key="p" initial={{ x: 20 }} animate={{ x: 0 }} className="space-y-6">
                <input type="tel" placeholder="Phone Number" className="w-full p-5 bg-gray-50 rounded-2xl text-center font-bold outline-none" onChange={e => setPhone(e.target.value)} />
                <button onClick={finalizeUser} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest">{loading ? 'Saving...' : 'Enter Town →'}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] pb-44 font-sans text-black">
      <Head><title>Town | {user.name}</title></Head>

      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md p-5 border-b z-50 flex justify-between items-center">
        <div><p className="text-[7px] font-black opacity-30 uppercase tracking-[0.3em]">Malout City 📍</p><h2 className="text-sm font-black italic text-orange-600 uppercase leading-none">{user.name.split(' ')[0]}</h2></div>
        <div className="bg-black text-white px-3 py-1.5 rounded-xl font-black text-[9px] italic uppercase tracking-tighter">ID: {user.townId}</div>
      </header>

      <main className="pt-24 px-5">
        <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-8 leading-tight">Town Menu <span className="text-orange-600">({MENU_DATA.length})</span></h3>
        <div className="grid grid-cols-1 gap-4">
          {MENU_DATA.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl">{item.icon}</div>
                <div><h4 className="font-black text-sm uppercase leading-tight">{item.name}</h4><p className="font-bold text-orange-600 text-xs mt-1">₹{item.price}</p></div>
              </div>
              <button onClick={() => {setCart([...cart, item]); if(window.navigator.vibrate) window.navigator.vibrate(40);}} className="bg-black text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase active:scale-90 transition-all">Add +</button>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Checkout */}
      {cart.length > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-28 left-4 right-4 bg-orange-600 p-5 rounded-[2.5rem] flex justify-between items-center text-white shadow-2xl z-40 border-t border-orange-400">
          <div><p className="text-[8px] font-black uppercase opacity-60 leading-none">{cart.length} Items</p><p className="text-xl font-black italic tracking-tighter">₹{cart.reduce((t, i) => t + i.price, 0)}</p></div>
          <button className="bg-white text-orange-600 px-7 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Checkout →</button>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t p-6 flex justify-around items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        {['home', 'orders', 'profile'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === t ? 'opacity-100 scale-110' : 'opacity-20'}`}>
            <span className="text-2xl">{t === 'home' ? '🏠' : t === 'orders' ? '🥡' : '👤'}</span>
            <span className="text-[8px] font-black uppercase tracking-widest">{t}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}