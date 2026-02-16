// pages/admin.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";

// --- FIREBASE CONFIG (Teri Config) ---
const firebaseConfig = {
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo",
  authDomain: "flavourstown-83891.firebaseapp.com",
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  projectId: "flavourstown-83891",
  storageBucket: "flavourstown-83891.firebasestorage.app",
  messagingSenderId: "631949771733",
  appId: "1:631949771733:web:16e025bbc443493242735c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const ADMIN_PASS = "aashray778";

export default function Admin() {
  const [isLogged, setIsLogged] = useState(false);
  const [pass, setPass] = useState('');
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);

  useEffect(() => {
    onValue(ref(db, 'orders'), (snap) => {
        if (snap.exists()) setOrders(Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k})));
    });
    onValue(ref(db, 'menu'), (snap) => { if (snap.exists()) setMenu(snap.val()); });
    onValue(ref(db, 'shopStatus'), (snap) => setIsShopOpen(snap.exists() ? snap.val() : true));
  }, []);

  const handleLogin = () => { if(pass === ADMIN_PASS) setIsLogged(true); else alert("Wrong Pass!"); };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-black mb-6 italic uppercase text-orange-600">The Flavours Town - Admin</h1>
        <input type="password" placeholder="Admin Password" value={pass} onChange={e=>setPass(e.target.value)} className="w-full max-w-xs p-4 rounded-2xl border border-gray-200 mb-4 outline-none focus:border-orange-500" />
        <button onClick={handleLogin} className="w-full max-w-xs py-4 bg-orange-600 text-white rounded-2xl font-black">LOGIN</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <Head><title>FT Admin Panel</title></Head>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-black italic text-gray-800">COMMAND CENTER</h1>
            <button onClick={() => update(ref(db, 'shopStatus'), !isShopOpen)} className={`px-6 py-2 rounded-full font-black text-[10px] text-white ${isShopOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                {isShopOpen ? 'SHOP OPEN' : 'SHOP CLOSED'}
            </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black opacity-40 uppercase">Total Sales</p>
                <h2 className="text-2xl font-black text-green-600">₹{orders.reduce((a,b)=>a+(b.total||0),0)}</h2>
            </div>
            <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black opacity-40 uppercase">Pending Orders</p>
                <h2 className="text-2xl font-black text-orange-500">{orders.filter(o=>o.status!=='Ready').length}</h2>
            </div>
        </div>

        <div className="space-y-4 mb-10">
            {orders.slice().reverse().map(o => (
                <div key={o.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between font-bold mb-2 text-sm">
                        <span>{o.user?.name} ({o.user?.phone})</span>
                        <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="text-red-400">Cancel</button>
                    </div>
                    <p className="text-[11px] font-bold text-orange-600 mb-4 italic">Note: {o.user?.note || 'None'}</p>
                    <div className="flex gap-2">
                        {['Pending', 'Cooking', 'Ready'].map(s => (
                            <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status: s})} className={`flex-1 py-3 rounded-xl text-[9px] font-black ${o.status===s ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</button>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        <h3 className="text-center text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-4">Stock Management</h3>
        <div className="grid grid-cols-2 gap-3">
            {menu.map((m, idx) => (
                <button key={idx} onClick={() => update(ref(db, `menu/${idx}`), {inStock: !m.inStock})} className={`p-4 rounded-2xl border text-[9px] font-black ${m.inStock ? 'border-green-100 text-green-600 bg-green-50' : 'border-red-100 text-red-400 bg-red-50'}`}>
                    {m.name?.en} <br/> {m.inStock ? '● IN STOCK' : '○ SOLD OUT'}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}