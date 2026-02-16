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
  const [isShopOpen, setIsShopOpen] = useState(true);

  useEffect(() => {
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.val() === true));
    onValue(ref(db, 'orders'), snap => {
      if (snap.exists()) setOrders(Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k})));
      else setOrders([]);
    });
  }, []);

  const toggleShop = () => set(ref(db, 'shopStatus'), !isShopOpen);

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-sm text-center">
          <h2 className="text-xl font-black mb-6 italic text-orange-600">FT MASTER CONTROL</h2>
          <input type="password" placeholder="Passcode" className="w-full p-4 bg-gray-50 border rounded-2xl mb-4 text-center font-bold" onChange={e=>setPass(e.target.value)} />
          <button onClick={() => pass === "aashray778" ? setIsLogged(true) : alert("Wrong!")} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px]">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <h1 className="text-xl font-black italic">Kitchen Status</h1>
            <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">Dev: Aashray Narang</p>
          </div>
          <button onClick={toggleShop} className={`px-10 py-4 rounded-full font-black text-[10px] text-white transition-all ${isShopOpen ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-red-600 shadow-lg shadow-red-600/20'}`}>
            {isShopOpen ? '● OPEN' : '○ CLOSED'}
          </button>
        </div>

        <div className="space-y-4">
          {orders.slice().reverse().map(o => (
            <div key={o.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-4">
                <span className="font-black text-xs uppercase">{o.user?.name} ✅ Verified</span>
                <span className="text-orange-600 font-black">₹{o.total}</span>
              </div>
              <p className="text-[10px] opacity-50 mb-4">{o.items?.map(i => i.name.en).join(', ')}</p>
              <div className="flex gap-2">
                {['Received', 'Cooking', 'Ready'].map(s => (
                  <button key={s} onClick={() => update(ref(db, `orders/${o.firebaseKey}`), {status: s})} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase ${o.status === s ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-400'}`}>{s}</button>
                ))}
                <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="px-4 bg-black text-white rounded-xl text-[10px] font-black">Done</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}