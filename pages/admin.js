import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export default function Admin() {
  const [mounted, setMounted] = useState(false);
  const [menu, setMenu] = useState({});

  useEffect(() => {
    setMounted(true);
    onValue(ref(db, 'menu'), (snap) => { if(snap.exists()) setMenu(snap.val()); });
  }, []);

  if(!mounted) return null;

  return (
    <div style={{ backgroundColor: '#F3F5F2', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2D4137' }}>Inventory Control</h1>
        <p style={{ fontSize: '13px', opacity: 0.5 }}>Manage your cafe stock in real-time</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
        {Object.entries(menu).map(([key, item]) => (
          <div key={key} style={{ backgroundColor: 'white', borderRadius: '25px', padding: '20px', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>
            <img src={item.img} style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px' }} />
            <h3 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 15px' }}>{typeof item.name === 'object' ? item.name.en : item.name}</h3>
            <button 
              onClick={() => update(ref(db, `menu/${key}`), { inStock: !item.inStock })}
              style={{ backgroundColor: item.inStock ? '#2D4137' : '#E74C3C', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', width: '100%' }}
            >
              {item.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}