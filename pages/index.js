import { useState, useEffect } from 'react';
import Head from 'next/head';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, update, push } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com",
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menu, setMenu] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);

  const ADMIN_EMAIL = "narangaashray34@gmail.com";

  useEffect(() => {
    setMounted(true); // Laptop crash fix
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setIsAdmin(u.email === ADMIN_EMAIL);
      }
    });

    const menuRef = ref(db, 'menu');
    const unsubMenu = onValue(menuRef, (snap) => {
      if (snap.exists()) setMenu(Object.entries(snap.val()).map(([id, v]) => ({ id, ...v })));
    });

    return () => { unsubAuth(); unsubMenu(); };
  }, []);

  const handleLogin = () => signInWithPopup(auth, provider).catch(e => alert(e.message));

  // Loading state for Desktop/Laptop
  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Head><title>Flavours Town | Admin & Menu</title></Head>

      <nav className="p-5 border-b border-white/10 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-md z-[100]">
        <h1 className="text-xl font-black italic text-orange-500 uppercase">Flavours Town</h1>
        {user ? (
          <div className="flex items-center gap-3">
            {isAdmin && <span className="text-[9px] bg-orange-600 px-2 py-1 rounded-full font-black">ADMIN ACCESS</span>}
            <img src={user.photoURL} className="w-9 h-9 rounded-full border border-orange-500" />
          </div>
        ) : (
          <button onClick={handleLogin} className="bg-white text-black px-5 py-2 rounded-xl font-black text-[10px] uppercase">Login</button>
        )}
      </nav>

      <main className="p-6 max-w-4xl mx-auto">
        {isAdmin ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-black italic text-orange-500 mb-8 uppercase tracking-tighter">Kitchen Control Panel</h2>
            <div className="grid gap-4">
              {menu.map(item => (
                <div key={item.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{item.img}</span>
                    <div><p className="font-bold uppercase text-sm">{item.name.en || item.name}</p><p className="text-orange-500 font-black">₹{item.price}</p></div>
                  </div>
                  <button 
                    onClick={() => update(ref(db, `menu/${item.id}`), { inStock: !item.inStock })}
                    className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase ${item.inStock ? 'bg-green-600' : 'bg-red-600'}`}
                  >
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
             <h2 className="text-5xl font-black uppercase italic leading-none mb-6">The Town <br/><span className="text-orange-500">Is Online.</span></h2>
             <p className="opacity-40 text-xs font-bold uppercase tracking-widest">Login to see the legendary menu</p>
          </div>
        )}
      </main>
    </div>
  );
}