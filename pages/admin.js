import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Admin() {
  const [isLogged, setIsLogged] = useState(false);
  const [pass, setPass] = useState('');
  const [orders, setOrders] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);

  useEffect(() => {
    onValue(ref(db, 'orders'), (snap) => {
      if (snap.exists()) setOrders(Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k})));
    });
    onValue(ref(db, 'shopStatus'), (snap) => setIsShopOpen(snap.exists() ? snap.val() : true));
  }, []);

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
          <h2 className="text-2xl font-black mb-6 italic text-orange-600">ADMIN ACCESS</h2>
          <input type="password" placeholder="Password" className="w-full p-4 border rounded-2xl mb-4 outline-none" onChange={e=>setPass(e.target.value)} />
          <button onClick={() => pass === "aashray778" ? setIsLogged(true) : alert("Wrong!")} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black">LOGIN</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black italic">COMMAND CENTER</h1>
          <button onClick={() => update(ref(db, 'shopStatus'), !isShopOpen)} className={`px-6 py-2 rounded-full font-black text-white ${isShopOpen ? 'bg-green-500' : 'bg-red-500'}`}>{isShopOpen ? 'SHOP OPEN' : 'SHOP CLOSED'}</button>
        </div>
        <div className="space-y-4">
          {orders.slice().reverse().map(o => (
            <div key={o.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between font-bold mb-2 uppercase text-xs tracking-widest">
                <span>{o.user.name} ({o.user.phone})</span>
                <span className="text-orange-600">₹{o.total} - {o.method}</span>
              </div>
              <div className="text-sm opacity-60 mb-4">{o.items.map(i=>i.name.en).join(', ')}</div>
              <div className="flex gap-2">
                {['Pending', 'Cooking', 'Ready'].map(s => (
                  <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status: s})} className={`flex-1 py-3 rounded-xl text-[10px] font-black ${o.status === s ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</button>
                ))}
                <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="px-4 bg-red-50 text-red-500 rounded-xl font-black text-[10px]">CANCEL</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}