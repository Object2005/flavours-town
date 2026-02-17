import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Firebase Config
const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

// Safe Init
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function LuxuryCafe() {
  const [mounted, setMounted] = useState(false);
  const [menu, setMenu] = useState([]);
  const [serving, setServing] = useState(0);

  useEffect(() => {
    setMounted(true); // Hydration fix
    
    // Safe Menu Sync
    const menuRef = ref(db, 'menu');
    onValue(menuRef, (snap) => {
      if(snap.exists()) {
        const data = snap.val();
        setMenu(data ? Object.values(data) : []);
      }
    });

    // Safe Queue Sync
    const queueRef = ref(db, 'queue/current');
    onValue(queueRef, (snap) => {
      if(snap.exists()) setServing(snap.val());
    });
  }, []);

  // Prevents Client-side exception by waiting for mount
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-serif">
      <Head><title>FT | The Royal Lounge</title></Head>
      
      <header className="p-10 flex flex-col items-center border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 mb-2">Malout • Punjab</p>
        <h1 className="text-4xl font-light italic tracking-widest uppercase">The Flavour Town</h1>
        <div className="bg-[#d4af37] px-6 py-1.5 mt-4 rounded-full text-[10px] text-white font-sans font-bold tracking-widest">
          NOW SERVING: #{serving}
        </div>
      </header>

      <main className="max-w-xl mx-auto p-8 space-y-24 pb-40">
        {menu.length === 0 ? (
          <p className="text-center italic opacity-20">Gathering Menu...</p>
        ) : (
          menu.map((item, idx) => (
            <div key={idx} className="text-center group animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="overflow-hidden rounded-sm shadow-2xl">
                <img src={item.img} className="w-full h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <h3 className="text-2xl mt-8 font-normal italic tracking-tight uppercase">{item.name}</h3>
              <p className="text-xl text-[#d4af37] mt-2 font-light">₹{item.price}</p>
              <button className="mt-6 border border-black px-12 py-3 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">Reserve Experience</button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}