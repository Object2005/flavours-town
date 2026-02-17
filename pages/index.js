import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set, push, onValue, off } from "firebase/database";

// Firebase Config
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

// 19 Menu Items (Hardcoded as fallback)
const FALLBACK_MENU = [
  { id: 1, name: { en: "Malai Chaap", pu: "ਮਲਾਈ ਚਾਪ" }, price: 100, img: "🍢" },
  { id: 2, name: { en: "Masala Chaap", pu: "ਮਸਾਲਾ ਚਾਪ" }, price: 100, img: "🔥" },
  { id: 3, name: { en: "Afghani Chaap", pu: "ਅਫਗਾਨੀ ਚਾਪ" }, price: 100, img: "⚪" },
  { id: 4, name: { en: "Paneer Tikka", pu: "ਪਨੀਰ ਟਿੱਕਾ" }, price: 140, img: "🧀" },
  { id: 5, name: { en: "Pav Bhaji", pu: "ਪਾਓ ਭਾਜੀ" }, price: 50, img: "🍞" },
  { id: 6, name: { en: "Cheese Chilli", pu: "ਚੀਜ਼ ਚਿੱਲੀ" }, price: 250, img: "🥘" },
  { id: 17, name: { en: "Gulab Jamun", pu: "ਗੁਲਾਬ ਜਾਮੁਨ" }, price: 20, img: "🍯" }
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [tempUser, setTempUser] = useState(null);

  useEffect(() => {
    setIsClient(true); // SSR error fix
    const saved = localStorage.getItem('ft_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setStep(3);
      } catch (e) { localStorage.removeItem('ft_user'); }
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      const townId = `${u.displayName?.split(' ')[0].toUpperCase() || 'USER'}-${Math.floor(1000 + Math.random() * 9000)}`;
      setTempUser({ name: u.displayName, email: u.email, uid: u.uid, townId });
      setStep(2);
    } catch (e) {
      console.error(e);
      alert("Login Error: Check if Google Cloud App is Published!");
    }
    setLoading(false);
  };

  const finalizeUser = async () => {
    if (phone.length < 10) return alert("Enter valid phone!");
    setLoading(true);
    const final = { ...tempUser, phone };
    try {
      await set(ref(db, 'users/' + final.uid), final);
      localStorage.setItem('ft_user', JSON.stringify(final));
      setUser(final);
      setStep(3);
    } catch (e) { alert("Error saving user data!"); }
    setLoading(false);
  };

  // Prevent crash during hydration
  if (!isClient) return <div className="min-h-screen bg-[#fcfbf7]" />;

  if (step < 3) {
    return (
      <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 text-black font-sans">
        <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-2xl border text-center">
          <h1 className="text-3xl font-black italic text-orange-600 uppercase mb-8">Flavours Town</h1>
          {step === 1 ? (
            <button onClick={handleLogin} disabled={loading} className="w-full py-5 border-2 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5" /> {loading ? 'WAITING...' : 'CONTINUE WITH GOOGLE'}
            </button>
          ) : (
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase opacity-40 italic">Welcome, {tempUser?.name}</p>
              <input type="tel" placeholder="987XX-XXXXX" className="w-full p-5 bg-gray-50 rounded-2xl text-center font-bold outline-none border-none focus:ring-2 ring-orange-100" onChange={e => setPhone(e.target.value)} />
              <button onClick={finalizeUser} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest">ENTER TOWN →</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] pb-44 font-sans text-black">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md p-5 border-b z-50 flex justify-between items-center">
        <div><p className="text-[7px] font-black opacity-30 uppercase tracking-[0.3em]">Malout, Punjab 📍</p><h2 className="text-sm font-black italic text-orange-600 uppercase leading-none">{user?.name?.split(' ')[0]}</h2></div>
        <div className="bg-black text-white px-3 py-1.5 rounded-xl font-black text-[9px] uppercase italic shadow-lg">ID: {user?.townId}</div>
      </header>

      <main className="pt-24 px-5 max-w-lg mx-auto text-center">
        <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-8 leading-tight">Town Menu <span className="text-orange-600">(19)</span></h3>
        <div className="grid grid-cols-1 gap-4">
          {FALLBACK_MENU.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-[2.5rem] border border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl">{item.img}</div>
                <div><h4 className="font-black text-xs uppercase leading-tight w-32">{item.name.en}</h4><p className="font-bold text-orange-600 text-xs mt-1 italic">₹{item.price}</p></div>
              </div>
              <button onClick={() => setCart([...cart, item])} className="bg-black text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase active:scale-90 transition-all shadow-xl italic">Add +</button>
            </div>
          ))}
        </div>
      </main>

      {cart.length > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-10 left-4 right-4 bg-orange-600 p-6 rounded-[3rem] flex justify-between items-center text-white shadow-2xl z-[100] border-t border-orange-400">
          <div><p className="text-[8px] font-black uppercase opacity-60 leading-none tracking-widest">{cart.length} Items Selected</p><p className="text-2xl font-black italic tracking-tighter">₹{cart.reduce((t, i) => t + i.price, 0)}</p></div>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-lg">Order Now →</button>
        </motion.div>
      )}
    </div>
  );
}