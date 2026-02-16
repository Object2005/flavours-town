import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set, update, remove } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", 
  projectId: "flavourstown-83891", 
  storageBucket: "flavourstown-83891.firebasestorage.app", 
  messagingSenderId: "631949771733", 
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default function MasterAdmin() {
  const [isLogged, setIsLogged] = useState(false);
  const [pass, setPass] = useState('');
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [notiToken, setNotiToken] = useState(null);

  // --- NOTIFICATION ENGINE ---
  useEffect(() => {
    if (isLogged) {
      const messaging = getMessaging(app);
      
      // Request Permission & Get Token
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          getToken(messaging, { vapidKey: 'PASTE_YOUR_VAPID_KEY_HERE' })
            .then((token) => {
              setNotiToken(token);
              set(ref(db, 'adminToken'), token); // Save token for backend triggers
            }).catch(err => console.log("Token Error:", err));
        }
      });

      // Foreground Notification
      onMessage(messaging, (payload) => {
        new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play();
        alert(`Nava Order: ${payload.notification.body}`);
      });
    }
  }, [isLogged]);

  // --- DATA SYNC ---
  useEffect(() => {
    onValue(ref(db, 'shopStatus'), snap => setIsShopOpen(snap.val()));
    onValue(ref(db, 'menu'), snap => setMenu(snap.exists() ? snap.val() : []));
    onValue(ref(db, 'orders'), snap => {
      const data = snap.val() ? Object.keys(snap.val()).map(k => ({...snap.val()[k], firebaseKey: k})) : [];
      setOrders(data);
    });
  }, []);

  const toggleStock = (idx, current) => update(ref(db, `menu/${idx}`), { inStock: !current });
  const updateStatus = (key, status) => update(ref(db, `orders/${key}`), { status });

  if (!isLogged) return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-xl font-black mb-6 italic text-orange-600 uppercase">FT MASTER</h2>
        <input type="password" placeholder="Passphrase" className="w-full p-4 bg-gray-50 border rounded-2xl mb-4 text-center font-bold outline-none" onChange={e=>setPass(e.target.value)} />
        <button onClick={() => pass === "aashray778" ? setIsLogged(true) : alert("Wrong!")} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px]">Access Control</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfbf7] p-6 pb-20 font-sans text-[#1a1a1a]">
      <Head>
        <title>Admin | The Flavours Town</title>
        <meta name="theme-color" content="#ea580c" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div>
            <h1 className="text-xl font-black italic uppercase">Control Tower</h1>
            <p className="text-[8px] font-black opacity-30 tracking-[0.4em]">ADMIN: AASHRAY NARANG</p>
          </div>
          <button onClick={() => set(ref(db, 'shopStatus'), !isShopOpen)} className={`px-8 py-3 rounded-full font-black text-[9px] text-white transition-all ${isShopOpen ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-red-600'}`}>
            {isShopOpen ? 'SHOP OPEN' : 'SHOP CLOSED'}
          </button>
        </header>

        {/* NOTIFICATION STATUS TAG */}
        <div className="mb-8 px-6 py-3 bg-gray-100 rounded-full flex items-center gap-2 w-fit">
          <div className={`w-2 h-2 rounded-full ${notiToken ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
          <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">
            {notiToken ? 'Mobile Push Active' : 'Activating Push Engine...'}
          </span>
        </div>

        {/* INVENTORY */}
        <h2 className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-4 px-4">Instant Inventory</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {menu.map((item, idx) => (
            <button key={idx} onClick={() => toggleStock(idx, item.inStock)} className={`p-5 rounded-[2rem] border text-[9px] font-black uppercase transition-all ${item.inStock ? 'bg-white border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-300 opacity-50'}`}>
              {item.name?.en} <br/> {item.inStock ? '● IN' : '○ OUT'}
            </button>
          ))}
        </div>

        {/* LIVE ORDERS */}
        <h2 className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-4 px-4">Incoming Stream</h2>
        <div className="space-y-4">
          {orders.slice().reverse().map(o => (
            <div key={o.id} className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h4 className="font-black text-sm uppercase tracking-tight">{o.user?.name}</h4>
                   <p className="text-[10px] font-bold text-orange-600 italic">{o.user?.phone}</p>
                 </div>
                 <div className="text-right font-black italic text-lg tracking-tighter">₹{o.total}</div>
               </div>
               
               <div className="mb-6 p-4 bg-gray-50 rounded-2xl italic text-[10px] font-bold opacity-60">
                 {o.items?.map(i => i.name?.en).join(', ')}
               </div>

               <div className="flex gap-2">
                 {['Received', 'Cooking', 'Ready'].map(s => (
                   <button key={s} onClick={() => updateStatus(o.firebaseKey, s)} className={`flex-1 py-4 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${o.status === s ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}>{s}</button>
                 ))}
                 <button onClick={() => remove(ref(db, `orders/${o.firebaseKey}`))} className="px-6 bg-black text-white rounded-xl font-black text-[9px] uppercase">Done</button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}