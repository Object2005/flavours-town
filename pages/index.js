import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setMounted(true);
    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
      } catch (e) { setLoading(false); }
    };
    initAuth();

    onValue(ref(db, 'menu'), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setMenu(Object.values(data));
      }
    });
  }, []);

  if (!mounted || loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black font-sans">
      <Head><title>Flavours Town | Fix</title></Head>

      {!user ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl font-black italic text-orange-600 uppercase mb-8 tracking-tighter">Flavours Town</h1>
          <button onClick={() => signInWithPopup(auth, provider)} className="w-full max-w-xs py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl">Continue with Google</button>
        </div>
      ) : (
        <div className="pb-32">
          <header className="bg-white p-5 sticky top-0 z-50 border-b flex justify-between items-center">
             <div className="flex items-center gap-2">
                <span className="text-orange-600">📍</span>
                <h1 className="text-xs font-black uppercase">Green Valley, Malout</h1>
             </div>
             <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-orange-500" />
          </header>

          <main className="p-4 space-y-4 max-w-xl mx-auto">
            {menu.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="w-2/3">
                  {/* 🔥 CRITICAL FIX: Checking if name is an object or string */}
                  <h3 className="font-black text-sm uppercase">
                    {typeof item.name === 'object' ? (item.name.en || item.name.pu) : item.name}
                  </h3>
                  <p className="text-orange-600 font-black text-sm mt-1">₹{item.price}</p>
                </div>
                <div className="relative">
                  <img src={item.img} className="w-20 h-20 rounded-2xl object-cover border shadow-inner" />
                  <button onClick={() => setCart([...cart, item])} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-green-600 font-black px-4 py-1.5 rounded-xl shadow-md border text-[9px] uppercase">Add +</button>
                </div>
              </div>
            ))}
          </main>

          {cart.length > 0 && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-8 left-4 right-4 bg-orange-600 p-6 rounded-[2.5rem] flex justify-between items-center text-white shadow-2xl z-[100]">
              <div className="italic"><p className="text-2xl font-black">₹{cart.reduce((t, i) => t + i.price, 0)}</p><p className="text-[8px] font-bold opacity-60 uppercase">{cart.length} Items</p></div>
              <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase italic tracking-widest shadow-lg">Checkout →</button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}