import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function AdminFinal() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [pass, setPass] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    onValue(ref(db, 'menu'), snap => setMenu(snap.val() || []));
    onValue(ref(db, 'orders'), snap => {
      const data = snap.val() ? Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k})) : [];
      if (data.length > orders.length) new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play();
      setOrders(data);
    });
  }, [orders.length]);

  if (!isLogged) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-xl text-center">
        <h2 className="font-black italic text-orange-600 mb-6">ADMIN KEY</h2>
        <input type="password" placeholder="****" className="p-4 bg-gray-100 rounded-2xl text-center font-black outline-none mb-4" onChange={e=>setPass(e.target.value)} />
        <button onClick={() => pass === 'aashray778' && setIsLogged(true)} className="w-full py-4 bg-black text-white rounded-2xl font-black">LOGIN</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfbf7] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
           <h1 className="text-2xl font-black italic uppercase tracking-tighter">Control Room</h1>
           <span className="text-[10px] font-black opacity-30 italic">Developed by Aashray Narang</span>
        </header>

        {/* STOCK SECTION */}
        <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-6">Inventory Management</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {menu.map((item, idx) => (
            <button key={idx} onClick={() => update(ref(db, `menu/${idx}`), {inStock: !item.inStock})} className={`p-5 rounded-[2rem] border text-[9px] font-black uppercase transition-all ${item.inStock ? 'bg-white border-green-200 text-green-600' : 'bg-red-50 border-red-100 text-red-400 opacity-50'}`}>
              {item.name?.en} <br/> {item.inStock ? '● IN' : '○ OUT'}
            </button>
          ))}
        </div>

        {/* ORDERS SECTION */}
        <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-6">Live Incoming Orders</h3>
        <div className="space-y-4">
          {orders.slice().reverse().map(o => (
            <div key={o.id} className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h4 className="font-black text-sm uppercase">{o.user?.name}</h4>
                   <p className="text-[10px] font-bold text-orange-600">{o.user?.phone}</p>
                 </div>
                 <div className="text-right font-black italic text-lg">₹{o.total}</div>
               </div>
               <div className="flex gap-2">
                 {['Received', 'Cooking', 'Ready'].map(s => (
                   <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status: s})} className={`flex-1 py-4 rounded-xl text-[8px] font-black uppercase tracking-widest ${o.status === s ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-300'}`}>{s}</button>
                 ))}
                 <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="px-6 bg-black text-white rounded-xl font-black text-[9px]">DONE</button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}