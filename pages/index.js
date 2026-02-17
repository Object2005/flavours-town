import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = { 
  apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", 
  authDomain: "flavourstown-83891.firebaseapp.com", 
  projectId: "flavourstown-83891", 
  appId: "1:631949771733:web:16e025bbc443493242735c" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const TOWN_MENU = [
  { id: 1, name: "Malai Chaap", price: 100, img: "🍢" },
  { id: 2, name: "Masala Chaap", price: 100, img: "🔥" },
  { id: 3, name: "Afghani Chaap", price: 100, img: "⚪" },
  { id: 4, name: "Achari Chaap", price: 100, img: "🌶️" },
  { id: 5, name: "Paneer Tikka", price: 140, img: "🧀" },
  { id: 6, name: "Mushroom Tikka", price: 120, img: "🍄" },
  { id: 7, name: "Pav Bhaji", price: 50, img: "🍞" },
  { id: 8, name: "Cheese Chilli", price: 250, img: "🥘" },
  { id: 9, name: "Veg Burger", price: 60, img: "🍔" },
  { id: 10, name: "Cheese Burger", price: 80, img: "🧀" },
  { id: 11, name: "French Fries", price: 70, img: "🍟" },
  { id: 12, name: "Veg Noodles", price: 90, img: "🍜" },
  { id: 13, name: "Spring Roll", price: 60, img: "🥖" },
  { id: 14, name: "Manchurian", price: 100, img: "🧆" },
  { id: 15, name: "Cold Coffee", price: 70, img: "🧋" },
  { id: 16, name: "Masala Dosa", price: 110, img: "🥞" },
  { id: 17, name: "Gulab Jamun", price: 20, img: "🍯" },
  { id: 18, name: "Garam Gajrela", price: 50, img: "🥕" },
  { id: 19, name: "Special Thali", price: 180, img: "🍱" }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleLogin = () => signInWithPopup(auth, provider);

  if (!isClient) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6">
        <button onClick={handleLogin} className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Login to Enter Town</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] pb-40 font-sans text-black">
      <header className="p-6 flex justify-between items-center border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-xl font-black italic text-orange-600 uppercase">Flavours Town</h1>
        <p className="text-[10px] font-black uppercase opacity-40">Hi, {user.displayName?.split(' ')[0]}</p>
      </header>

      <main className="p-6 grid grid-cols-1 gap-4 max-w-md mx-auto">
        {TOWN_MENU.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{item.img}</div>
              <div><h4 className="font-black text-xs uppercase">{item.name}</h4><p className="font-bold text-orange-600 text-xs">₹{item.price}</p></div>
            </div>
            <button onClick={() => { if(window.navigator.vibrate) window.navigator.vibrate(50); setCart([...cart, item]); }} className="bg-black text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase italic">Add +</button>
          </div>
        ))}
      </main>

      {cart.length > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-8 left-4 right-4 bg-orange-600 p-6 rounded-[3rem] flex justify-between items-center text-white shadow-2xl z-[100]">
          <div><p className="text-2xl font-black italic">₹{cart.reduce((t, i) => t + i.price, 0)}</p><p className="text-[8px] font-black uppercase opacity-60 leading-none">{cart.length} Items</p></div>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-lg">Checkout →</button>
        </motion.div>
      )}
    </div>
  );
}