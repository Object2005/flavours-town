import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function Admin() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState({});

  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem("admin_auth")) window.location.href = "/login";

    onValue(ref(db, 'live_orders'), (snap) => {
      if(snap.exists()) setOrders(Object.entries(snap.val()).map(([id, v]) => ({ id, ...v })));
      else setOrders([]);
    });
    onValue(ref(db, 'menu'), (snap) => {
      if(snap.exists()) setMenu(snap.val());
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
          <h1 className="text-4xl font-black italic uppercase text-red-600">Commander</h1>
          <p className="text-[10px] font-bold opacity-30 tracking-[0.5em] uppercase">Live Ops</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-10">
          <section>
              <h2 className="text-xs font-black uppercase mb-6 opacity-30 italic underline">Active Orders ({orders.length})</h2>
              <div className="space-y-4">
                  {orders.map(o => (
                      <div key={o.id} className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5">
                          <div className="flex justify-between items-start mb-4">
                              <h3 className="font-black text-sm uppercase italic">{o.customer}</h3>
                              <span className="text-xl font-black italic text-orange-500">₹{o.total}</span>
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => remove(ref(db, `live_orders/${o.id}`))} className="flex-1 py-4 bg-green-600 rounded-2xl font-black text-[9px] uppercase">Mark Served</button>
                          </div>
                      </div>
                  ))}
              </div>
          </section>
          
          <section>
              <h2 className="text-xs font-black uppercase mb-6 opacity-30 italic underline">Stock Control</h2>
              <div className="grid grid-cols-2 gap-4">
                  {Object.entries(menu).map(([key, item]) => (
                      <div key={key} className="bg-zinc-900/30 p-5 rounded-[2rem] border border-white/5">
                          <p className="text-[10px] font-black uppercase italic mb-4">{typeof item.name === 'object' ? item.name.en : item.name}</p>
                          <button onClick={() => update(ref(db, `menu/${key}`), {inStock: !item.inStock})} className={`w-full py-3 rounded-xl text-[8px] font-black uppercase ${item.inStock ? 'bg-white text-black' : 'bg-red-600 text-white'}`}>
                              {item.inStock ? 'In Stock' : 'Sold Out'}
                          </button>
                      </div>
                  ))}
              </div>
          </section>
      </div>
    </div>
  );
}