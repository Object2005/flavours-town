import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, remove, set } from "firebase/database";

// --- CONFIG ---
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

export default function Admin() {
  const [isLogged, setIsLogged] = useState(false);
  const [pass, setPass] = useState('');
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);

  // Play sound for new orders
  const playAlert = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log("Sound enabled after interaction"));
  };

  useEffect(() => {
    // 1. Listen for Shop Status (FIXED)
    onValue(ref(db, 'shopStatus'), (snap) => {
      setIsShopOpen(snap.exists() ? snap.val() : true);
    });

    // 2. Listen for Menu
    onValue(ref(db, 'menu'), (snap) => {
      setMenu(snap.exists() ? snap.val() : []);
    });

    // 3. Listen for Orders & Sound Alert
    onValue(ref(db, 'orders'), (snap) => {
      if (snap.exists()) {
        const data = Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k}));
        if (isLogged && data.length > orders.length && orders.length > 0) playAlert();
        setOrders(data);
      } else {
        setOrders([]);
      }
    });
  }, [orders.length, isLogged]);

  // --- ACTIONS ---
  const toggleKitchen = () => {
    set(ref(db, 'shopStatus'), !isShopOpen);
  };

  const updateStatus = (key, s) => {
    update(ref(db, `orders/${key}`), { status: s });
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 w-full max-w-sm text-center">
          <h2 className="text-2xl font-black mb-8 italic text-orange-600 uppercase">FT ADMIN</h2>
          <input type="password" placeholder="Password" className="w-full p-5 bg-gray-50 border rounded-2xl mb-6 outline-none font-bold text-center" onChange={e=>setPass(e.target.value)} />
          <button onClick={() => pass === "aashray778" ? setIsLogged(true) : alert("Wrong!")} className="w-full py-5 bg-[#1a1a1a] text-white rounded-[2rem] font-black uppercase text-xs tracking-widest">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] p-6 font-sans text-[#1a1a1a]">
      <Head><title>Admin | The Flavours Town</title></Head>
      <div className="max-w-5xl mx-auto">
        
        {/* TOP BAR: KITCHEN CONTROL */}
        <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Command Center</h1>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">Owner: Aashray Narang</p>
          </div>
          <button onClick={toggleKitchen} className={`px-10 py-4 rounded-full font-black text-[10px] text-white transition-all shadow-lg ${isShopOpen ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
            {isShopOpen ? '● KITCHEN OPEN' : '○ KITCHEN CLOSED'}
          </button>
        </div>

        {/* LIVE ORDERS */}
        <h3 className="text-[11px] font-black opacity-30 uppercase tracking-[0.5em] mb-6 px-4">Live Orders ({orders.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {orders.slice().reverse().map(o => (
            <div key={o.id} className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">{o.user?.name}</h4>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{o.user?.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black italic text-gray-900">₹{o.total}</p>
                  <p className={`text-[9px] font-black uppercase ${o.method === 'UPI' ? 'text-blue-500' : 'text-green-600'}`}>{o.method}</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <p className="text-[9px] font-black opacity-30 uppercase mb-2">Items:</p>
                 <p className="text-xs font-bold leading-relaxed">{o.items?.map(i => i.name.en).join(', ')}</p>
              </div>

              {/* STATUS UPDATE BUTTONS */}
              <div className="flex gap-2">
                {['Received', 'Cooking', 'Ready'].map(s => (
                  <button key={s} onClick={() => updateStatus(o.firebaseKey, s)} className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${o.status === s ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 opacity-50'}`}>{s}</button>
                ))}
                <button onClick={() => updateStatus(o.firebaseKey, 'Delivered')} className="px-4 bg-black text-white rounded-2xl text-[9px] font-black transition-all">DONE</button>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK STOCK CONTROL */}
        <h3 className="text-[11px] font-black opacity-30 uppercase tracking-[0.5em] mb-6 px-4">Menu Stock</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {menu.map((m, idx) => (
                <button key={idx} onClick={() => update(ref(db, `menu/${idx}`), {inStock: !m.inStock})} className={`p-5 rounded-3xl border text-[9px] font-black uppercase transition-all shadow-sm ${m.inStock ? 'bg-white border-green-200 text-green-600' : 'bg-red-50 border-red-100 text-red-300 opacity-50'}`}>
                    {m.name?.en} <br/> {m.inStock ? '● AVAILABLE' : '○ SOLD OUT'}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}