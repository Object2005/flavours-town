import { useState, useEffect } from 'react';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function Admin() {
  const [isLogged, setIsLogged] = useState(false);
  const [pass, setPass] = useState('');
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);

  useEffect(() => {
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.val() === true));
    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'orders'), snap => {
      if (snap.exists()) setOrders(Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k})));
      else setOrders([]);
    });
  }, []);

  const toggleStock = (idx, current) => {
    update(ref(db, `menu/${idx}`), { inStock: !current });
  };

  if (!isLogged) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-black mb-6 italic text-orange-600">FT MASTER CONTROL</h2>
        <input type="password" placeholder="Passcode" className="w-full p-4 bg-gray-50 border rounded-2xl mb-4 text-center font-bold outline-none" onChange={e=>setPass(e.target.value)} />
        <button onClick={() => pass === "aashray778" ? setIsLogged(true) : alert("Wrong!")} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px]">Login</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfbf7] p-6 pb-20 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* SHOP STATUS */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm">
          <h1 className="font-black italic">Kitchen Status</h1>
          <button onClick={() => set(ref(db, 'shopStatus'), !isShopOpen)} className={`px-8 py-3 rounded-full font-black text-[9px] text-white ${isShopOpen ? 'bg-green-500' : 'bg-red-500'}`}>
            {isShopOpen ? 'OPEN' : 'CLOSED'}
          </button>
        </div>

        {/* STOCK CONTROL */}
        <h2 className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-4">Stock Management</h2>
        <div className="grid grid-cols-2 gap-4 mb-10">
          {menu.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm border border-gray-100">
              <span className="text-[10px] font-black uppercase truncate pr-2">{item.name?.en}</span>
              <button onClick={() => toggleStock(idx, item.inStock)} className={`px-4 py-2 rounded-xl text-[8px] font-black ${item.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {item.inStock ? 'IN' : 'OUT'}
              </button>
            </div>
          ))}
        </div>

        {/* ORDERS */}
        <h2 className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-4">Live Orders</h2>
        <div className="space-y-4">
          {orders.slice().reverse().map(o => (
            <div key={o.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-4">
                <span className="font-black text-xs uppercase">{o.user?.name} | {o.method}</span>
                <span className="text-orange-600 font-black">₹{o.total}</span>
              </div>
              <p className="text-[10px] font-bold opacity-60 mb-4 bg-gray-50 p-3 rounded-xl italic">
                {o.items?.map(i => i.name?.en).join(', ')}
              </p>
              <div className="flex gap-2">
                {['Received', 'Cooking', 'Ready'].map(s => (
                  <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status: s})} className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase ${o.status === s ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-400'}`}>{s}</button>
                ))}
                <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="px-4 bg-black text-white rounded-xl text-[9px] font-black">DONE</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}