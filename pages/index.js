import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('menu');

  useEffect(() => {
    setMounted(true);
    onValue(ref(db, 'menu'), (snap) => {
      if(snap.exists()) setMenu(Object.values(snap.val()));
    });
  }, []);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const name = typeof item.name === 'object' ? item.name.en : item.name;
      return (name || "").toLowerCase().includes(search.toLowerCase());
    });
  }, [menu, search]);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#F3F5F2', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Head><title>Tasty | Find Your Dish</title></Head>

      {view === 'menu' && (
        <div style={{ paddingBottom: '100px' }}>
          {/* HERO BANNER (Top Dark Green Card) */}
          <div style={{ backgroundColor: '#2D4137', padding: '50px 30px', borderRadius: '0 0 40px 40px', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 10px' }}>Tasty</h1>
            <p style={{ fontSize: '18px', fontWeight: '300', opacity: 0.9, lineHeight: '1.4', maxWidth: '200px' }}>
              Find Your Next Favorite Dish with Tasty
            </p>
            <button style={{ backgroundColor: 'white', color: '#2D4137', border: 'none', padding: '12px 25px', borderRadius: '50px', marginTop: '20px', fontWeight: 'bold', fontSize: '13px' }}>
              Explore the app
            </button>
          </div>

          {/* SEARCH BOX */}
          <div style={{ padding: '25px 20px 10px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '15px 20px', display: 'flex', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '18px', marginRight: '10px', opacity: 0.5 }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search your favorite food..." 
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontWeight: '500' }}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORY TAGS */}
          <div style={{ display: 'flex', gap: '10px', padding: '10px 20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts'].map(cat => (
              <span key={cat} style={{ backgroundColor: cat === 'All' ? '#2D4137' : 'white', color: cat === 'All' ? 'white' : '#666', padding: '8px 20px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>{cat}</span>
            ))}
          </div>

          {/* FOOD GRID */}
          <main style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {filteredMenu.map((item, idx) => (
              <motion.div key={idx} whileTap={{ scale: 0.95 }} style={{ backgroundColor: 'white', borderRadius: '30px', padding: '12px', textAlign: 'left', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', position: 'relative' }}>
                <img src={item.img} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '22px' }} />
                <h3 style={{ fontSize: '13px', fontWeight: '700', margin: '10px 0 2px', color: '#333' }}>
                  {typeof item.name === 'object' ? item.name.en : item.name}
                </h3>
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#2D4137' }}>${item.price}</p>
                <button 
                  onClick={() => setCart([...cart, item])}
                  style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: '#F3F5F2', border: 'none', width: '32px', height: '32px', borderRadius: '10px', color: '#2D4137', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  +
                </button>
              </motion.div>
            ))}
          </main>
        </div>
      )}

      {/* MODERN BOTTOM NAV */}
      <nav style={{ position: 'fixed', bottom: '25px', left: '20px', right: '20px', backgroundColor: 'white', borderRadius: '25px', padding: '15px 35px', display: 'flex', justifyContent: 'space-between', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', z_index: 100 }}>
        {['🏠', '❤', '🛍️', '👤'].map((icon, idx) => (
          <span key={idx} style={{ fontSize: '22px', opacity: idx === 0 ? 1 : 0.3, cursor: 'pointer' }}>{icon}</span>
        ))}
      </nav>
    </div>
  );
}