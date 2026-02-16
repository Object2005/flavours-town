import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Admin() {
  const [isLogged, setIsLogged] = useState(false);
  const [pass, setPass] = useState('');
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);

  useEffect(() => {
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.exists() ? snap.val() : true));
    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'orders'), snap => {
      if (snap.exists()) setOrders(Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k})));
      else setOrders([]);
    });
  }, []);

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm text-center">
          <h2 className="text-xl font-black mb-6 italic text-orange-600 uppercase">FT ADMIN</h2>
          <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border rounded-2xl mb-4 outline-none font-bold text-center" onChange={e=>setPass(e.target.value)} />
          <button onClick={() => pass === "aashray778" ? setIsLogged(true) : alert("Wrong!")} className="w-full py-4 bg-[#1a1a1a] text-white rounded-2xl font-black uppercase text-xs">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <Head><title>Admin Control</title></Head>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-[2rem] shadow-sm">
          <div><h1 className="text-xl font-black italic">COMMAND CENTER</h1><p className="text-[9px] font-black opacity-30 uppercase tracking-widest">Aashray Narang</p></div>
          <button onClick={() => set(ref(db, 'shopStatus'), !isShopOpen)} className={`px-8 py-3 rounded-full font-black text-[9px] text-white ${isShopOpen ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'}`}>
            {isShopOpen ? '● OPEN' : '○ CLOSED'}
          </button>
        </div>

        <div className="space-y-4 mb-10">
          {orders.slice().reverse().map(o => (
            <div key={o.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between font-bold mb-3 text-xs uppercase tracking-tight"><span>{o.user?.name} ({o.user?.phone})</span><span className="text-orange-600">₹{o.total}</span></div>
              <p className="text-[10px] opacity-60 mb-4">{o.items?.map(i => i.name.en).join(', ')}</p>
              <div className="flex gap-2">
                {['Received', 'Cooking', 'Ready'].map(s => (
                  <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status: s})} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase ${o.status === s ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400 opacity-50'}`}>{s}</button>
                ))}
                <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="px-4 text-red-500 text-xs font-black">X</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}