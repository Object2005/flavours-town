import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function LuxuryAdmin() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [serving, setServing] = useState(0);

  useEffect(() => {
    setMounted(true);
    if(!localStorage.getItem("admin_auth")) window.location.href = "/login";
    onValue(ref(db, 'live_orders'), (snap) => snap.exists() ? setOrders(Object.entries(snap.val()).map(([id,v])=>({id,...v}))) : setOrders([]));
    onValue(ref(db, 'queue/current'), (snap) => snap.exists() && setServing(snap.val()));
  }, []);

  const nextOrder = () => update(ref(db, 'queue'), { current: serving + 1 });

  if(!mounted) return null;

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'serif' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ color: '#d4af37', fontSize: '40px', fontStyle: 'italic', margin: 0 }}>CONCIERGE</h1>
          <p style={{ fontSize: '10px', letterSpacing: '5px', opacity: 0.4 }}>COMMANDER DASHBOARD</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', opacity: 0.3 }}>CURRENT SEQUENCE</p>
          <h2 style={{ fontSize: '50px', margin: 0 }}>#{serving}</h2>
          <button onClick={nextOrder} style={{ backgroundColor: '#d4af37', border: 'none', color: 'black', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>NEXT GUEST →</button>
        </div>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {orders.map(o => (
          <div key={o.id} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '30px', borderLeft: '3px solid #d4af37' }}>
            <h3 style={{ fontSize: '20px', fontStyle: 'italic', margin: 0 }}>{o.customer || "Guest"}</h3>
            <p style={{ opacity: 0.3, fontSize: '12px' }}>{o.time}</p>
            <button onClick={() => remove(ref(db, `live_orders/${o.id}`))} style={{ marginTop: '20px', backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '5px 15px', fontSize: '10px', cursor: 'pointer' }}>CLEAR</button>
          </div>
        ))}
      </div>
    </div>
  );
}