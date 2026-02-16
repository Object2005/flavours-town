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
  const [menu, setMenu] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);

  // --- NEW ORDER SOUND ---
  const playNewOrderSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log("Sound blocked"));
  };

  useEffect(() => {
    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.exists() ? snap.val() : true));
    
    onValue(ref(db, 'orders'), (snap) => {
      if (snap.exists()) {
        const data = Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k}));
        // Sound trigger for new orders
        if (isLogged && data.length > orders.length && orders.length > 0) {
            playNewOrderSound();
        }
        setOrders(data);
      }
    });
  }, [orders.length, isLogged]);

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 w-full max-w-sm text-center">
          <h2 className="text-2xl font-black mb-8 italic text-orange-600 tracking-tighter uppercase">Admin Panel</h2>
          <input type="password" placeholder="Pass: aashray778" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl mb-6 outline-none font-bold text-center" onChange={e=>setPass(e.target.value)} />
          <button onClick={() => pass === "aashray778" ? setIsLogged(true) : alert("Wrong!")} className="w-full py-5 bg-[#1a1a1a] text-white rounded-[2rem] font-black uppercase tracking-widest text-xs">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] p-6 font-sans">
      <Head><title>FT Admin - Command Center</title></Head>
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Command Center</h1>
            <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.3em]">The Flavours Town</p>
          </div>
          <button onClick={() => update(ref(db, 'shopStatus'), !isShopOpen)} className={`px-8 py-3 rounded-full font-black text-[10px] text-white transition-all ${isShopOpen ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'}`}>
            {isShopOpen ? 'SHOP IS OPEN' : 'SHOP IS CLOSED'}
          </button>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black opacity-30 uppercase mb-1">Galla (Revenue)</p>
                <h2 className="text-xl font-black text-green-600 italic">₹{orders.reduce((a,b)=>a+(b.total||0),0)}</h2>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black opacity-30 uppercase mb-1">Total Orders</p>
                <h2 className="text-xl font-black text-orange-600 italic">{orders.length}</h2>
            </div>
        </div>

        {/* LIVE ORDERS WITH NOTES */}
        <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.5em] mb-6 px-4">Live Feed</h3>
        <div className="space-y-4 mb-12">
          {orders.slice().reverse().map(o => (
            <div key={o.id} className="p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">{o.user?.name} <span className="text-[10px] opacity-30">({o.user?.phone})</span></h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{o.method} Order</p>
                </div>
                <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="text-red-300 hover:text-red-500 transition-colors">✕</button>
              </div>

              {/* SPECIAL NOTE SECTION */}
              <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                 <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Customer Note:</p>
                 <p className="text-xs font-bold text-orange-700 italic">"{o.note || 'No special instructions'}"</p>
              </div>

              <div className="mb-6 text-[11px] font-bold opacity-60 bg-gray-50 p-3 rounded-xl border border-gray-100">
                {o.items?.map(i => i.name.en).join(', ')}
              </div>

              <div className="flex gap-2">
                {['Pending', 'Cooking', 'Ready'].map(s => (
                  <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status: s})} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${o.status === s ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-gray-100 text-gray-400 opacity-40'}`}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* INVENTORY CONTROL */}
        <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.5em] mb-6 px-4">Stock Management</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {menu.map((m, idx) => (
                <button key={idx} onClick={() => update(ref(db, `menu/${idx}`), {inStock: !m.inStock})} className={`p-5 rounded-3xl border text-[9px] font-black uppercase transition-all shadow-sm ${m.inStock ? 'bg-white border-green-200 text-green-600' : 'bg-red-50 border-red-100 text-red-300 opacity-50'}`}>
                    {m.name?.en} <br/> {m.inStock ? '● IN STOCK' : '○ SOLD OUT'}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}