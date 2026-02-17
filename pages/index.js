import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";

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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Login, 2: Phone, 3: App
  const [phone, setPhone] = useState('');
  const [tempUser, setTempUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  // Load User from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('ft_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setStep(3);
    }
  }, []);

  // --- LOGIN LOGIC ---
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

  const saveProfile = async () => {
    if (phone.length < 10) return alert("Sahi Number Bharo!");
    setLoading(true);
    const finalUser = { ...tempUser, phone, role: 'customer' };
    try {
      await set(ref(db, 'users/' + tempUser.uid), finalUser);
      localStorage.setItem('ft_user', JSON.stringify(finalUser));
      setUser(finalUser);
      setStep(3);
    } catch (e) { alert("DB Error!"); }
    setLoading(false);
  };

  // --- RENDER LOGIN ---
  if (step < 3) {
    return (
      <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-xl text-center border">
          <h1 className="text-2xl font-black italic text-orange-600 uppercase mb-8">Flavours Town</h1>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.button key="l" onClick={handleLogin} className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase text-[10px]">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-4" /> {loading ? 'Wait...' : 'Sign in with Google'}
              </motion.button>
            ) : (
              <motion.div key="p" initial={{ x: 20 }} animate={{ x: 0 }} className="space-y-4">
                <input type="tel" placeholder="Phone Number" className="w-full p-4 bg-gray-50 rounded-xl text-center font-bold" onChange={e => setPhone(e.target.value)} />
                <button onClick={saveProfile} className="w-full py-4 bg-orange-600 text-white rounded-xl font-black uppercase text-xs">{loading ? 'Saving...' : 'Enter Town →'}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN APP ---
  return (
    <div className="min-h-screen bg-[#fcfbf7] pb-32 font-sans">
      <Head><title>Town | {user.name}</title></Head>
      
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md p-5 border-b z-50 flex justify-between items-center">
        <div>
          <p className="text-[7px] font-black opacity-30 uppercase tracking-[0.3em]">Welcome,</p>
          <h2 className="text-sm font-black italic text-orange-600 uppercase leading-none">{user.name.split(' ')[0]}</h2>
        </div>
        <div className="bg-black text-white px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter uppercase italic">
          ID: {user.townId}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-5 max-w-lg mx-auto">
        {activeTab === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">The Menu 🍕</h3>
            <div className="bg-white p-8 rounded-[2.5rem] border text-center shadow-sm">
               <p className="text-xs font-bold opacity-30 uppercase">Cooking some fresh code for items...</p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t p-6 flex justify-around items-center z-50">
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