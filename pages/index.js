import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function LuxuryCafe() {
  const [mounted, setMounted] = useState(false);
  const [menu, setMenu] = useState([]);
  const [serving, setServing] = useState(0);

  useEffect(() => {
    setMounted(true);
    onValue(ref(db, 'menu'), (snap) => {
      if(snap.exists()) {
        const data = snap.val();
        setMenu(data ? Object.values(data) : []);
      }
    });
    onValue(ref(db, 'queue/current'), (snap) => {
      if(snap.exists()) setServing(snap.val());
    });
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', color: '#1a1a1a', fontFamily: 'serif' }}>
      <header style={{ textAlign: 'center', padding: '60px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.5em', textTransform: 'uppercase', opacity: 0.5 }}>Est. 2026 • Malout</p>
        <h1 style={{ fontSize: '38px', fontWeight: '300', fontStyle: 'italic', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '15px 0' }}>The Flavour Town</h1>
        <div style={{ display: 'inline-block', backgroundColor: '#d4af37', color: 'white', padding: '8px 25px', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold' }}>
          SEQUENCE: #{serving}
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
        {menu.map((item, idx) => {
          // 🔥 CRITICAL FIX: Handle Object {en, pu} safely
          const displayName = typeof item.name === 'object' 
            ? (item.name.en || item.name.pu || "No Name") 
            : (item.name || "No Name");

          return (
            <div key={idx} style={{ marginBottom: '80px', textAlign: 'center' }}>
              <div style={{ overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderRadius: '4px', marginBottom: '25px' }}>
                <img src={item.img} style={{ width: '100%', height: '400px', objectFit: 'cover' }} alt="Dish" />
              </div>
              <h3 style={{ fontSize: '24px', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '2px' }}>
                {displayName}
              </h3>
              <p style={{ color: '#d4af37', fontSize: '20px', margin: '10px 0' }}>₹{item.price}</p>
              <button style={{ backgroundColor: 'transparent', border: '1px solid #1a1a1a', padding: '10px 30px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>
                Reserve
              </button>
            </div>
          );
        })}
      </main>
    </div>
  );
}