import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

// Firebase Config (Keep as is)
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
  const [showPayment, setShowPayment] = useState(false);

  // --- EDIT THESE DETAILS ---
  const SHOP_PHONE = "91XXXXXXXXXX"; // Your WhatsApp number with 91
  const UPI_ID = "yourid@upi"; // Your GPay/PhonePe UPI ID
  // -------------------------

  useEffect(() => {
    setIsClient(true);
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const sendToWhatsApp = () => {
    const total = cart.reduce((t, i) => t + i.price, 0);
    const itemsList = cart.map(i => `• ${i.name} (₹${i.price})`).join('\n');
    const message = `*NEW ORDER - FLAVOURS TOWN*%0A%0A*Customer:* ${user.displayName}%0A%0A*Items:*%0A${itemsList}%0A%0A*Total: ₹${total}*%0A%0A_Payment initiated via UPI._`;
    window.open(`https://wa.me/${SHOP_PHONE}?text=${message}`, '_blank');
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf7] pb-40 font-sans text-black">
      <header className="p-6 flex justify-between items-center border-b bg-white sticky top-0 z-50">
        <h1 className="text-xl font-black italic text-orange-600 uppercase">Flavours Town</h1>
        <p className="text-[10px] font-black uppercase opacity-40">Hi, {user?.displayName?.split(' ')[0]}</p>
      </header>

      <main className="p-6 grid grid-cols-1 gap-4 max-w-md mx-auto">
        {TOWN_MENU.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{item.img}</div>
              <div><h4 className="font-black text-xs uppercase">{item.name}</h4><p className="font-bold text-orange-600 text-xs">₹{item.price}</p></div>
            </div>
            <button onClick={() => setCart([...cart, item])} className="bg-black text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase italic active:scale-90">Add +</button>
          </div>
        ))}
      </main>

      {/* Payment Popup */}
      <AnimatePresence>
        {showPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center">
              <h2 className="text-2xl font-black uppercase italic mb-2">Scan & Pay</h2>
              <p className="text-orange-600 font-bold mb-6">Total: ₹{cart.reduce((t, i) => t + i.price, 0)}</p>
              
              <div className="bg-gray-100 p-4 rounded-3xl mb-6 inline-block">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}&pn=FlavoursTown&am=${cart.reduce((t, i) => t + i.price, 0)}&cu=INR`} alt="UPI QR" className="w-40 h-40" />
              </div>

              <button onClick={sendToWhatsApp} className="w-full py-5 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest mb-4">I Have Paid → WhatsApp</button>
              <button onClick={() => setShowPayment(false)} className="text-[10px] font-black uppercase opacity-30">Go Back</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Bar */}
      {cart.length > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-8 left-4 right-4 bg-orange-600 p-6 rounded-[3rem] flex justify-between items-center text-white shadow-2xl z-[100]">
          <div><p className="text-2xl font-black italic">₹{cart.reduce((t, i) => t + i.price, 0)}</p><p className="text-[8px] font-black uppercase opacity-60 leading-none">{cart.length} Items</p></div>
          <button onClick={() => setShowPayment(true)} className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-lg">Checkout →</button>
        </motion.div>
      )}
    </div>
  );
}