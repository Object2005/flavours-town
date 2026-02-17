import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, push } from "firebase/database";

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
    onValue(ref(db, 'menu'), (snap) => snap.exists() && setMenu(Object.values(snap.val())));
    onValue(ref(db, 'queue/current'), (snap) => snap.exists() && setServing(snap.val()));
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', color: '#1a1a1a', fontFamily: 'serif' }}>
      <Head><title>The Flavour Town | Royal Lounge</title></Head>
      
      <header style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <p style={{ fontSize: '10px', letterSpacing: '5px', textTransform: 'uppercase', opacity: 0.5 }}>Est. 2026 • Malout</p>
        <h1 style={{ fontSize: '38px', fontWeight: '300', fontStyle: 'italic', letterSpacing: '4px', margin: '15px 0' }}>THE FLAVOUR TOWN</h1>
        <div style={{ backgroundColor: '#d4af37', color: 'white', display: 'inline-block', padding: '5px 20px', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold' }}>
          SERVING SEQUENCE: #{serving}
        </div>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 20px' }}>
        {menu.map((item, idx) => (
          <div key={idx} style={{ marginBottom: '100px', textAlign: 'center' }}>
            <div style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.1)', overflow: 'hidden', borderRadius: '4px' }}>
              <img src={item.img} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontSize: '24px', fontStyle: 'italic', marginTop: '30px', textTransform: 'uppercase', letterSpacing: '2px' }}>{item.name}</h3>
            <p style={{ color: '#d4af37', fontSize: '20px', margin: '10px 0' }}>₹{item.price}</p>
            <button style={{ backgroundColor: 'transparent', border: '1px solid #1a1a1a', padding: '10px 30px', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', marginTop: '10px' }}>
              Reserve Experience
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}