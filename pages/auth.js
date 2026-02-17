import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

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
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [tempUser, setTempUser] = useState(null);
  const [phone, setPhone] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const firstName = user.displayName.split(' ')[0].toUpperCase();
      const townId = `${firstName}-${Math.floor(1000 + Math.random() * 9000)}`;

      setTempUser({ name: user.displayName, email: user.email, photo: user.photoURL, uid: user.uid, townId });
      setStep(2);
    } catch (error) { alert("Login Failed!"); }
    setLoading(false);
  };

  const saveProfile = async () => {
    if (phone.length < 10) return alert("Sahi phone number bharo!");
    setLoading(true);
    const finalUser = { ...tempUser, phone, role: 'customer', createdAt: new Date().toISOString() };
    try {
      await set(ref(db, 'users/' + tempUser.uid), finalUser);
      localStorage.setItem('ft_user', JSON.stringify(finalUser));
      router.push('/');
    } catch (e) { alert("Database Error!"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 font-sans">
      <Head><title>Login | The Flavours Town</title></Head>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm bg-white p-10 rounded-[3.5rem] shadow-xl border text-center">
        <h1 className="text-2xl font-black italic text-orange-600 uppercase mb-8">The Flavours Town</h1>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.button key="g" onClick={handleGoogleLogin} className="w-full py-5 border-2 rounded-2xl flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5" /> {loading ? 'Connecting...' : 'Login with Google'}
            </motion.button>
          ) : (
            <motion.div key="p" initial={{ x: 20 }} animate={{ x: 0 }} className="space-y-6">
              <div className="flex flex-col items-center gap-2">
                <img src={tempUser?.photo} className="w-16 h-16 rounded-full border-2 border-orange-500 p-1" />
                <p className="text-xs font-black uppercase tracking-tighter italic">Town ID: {tempUser?.townId}</p>
              </div>
              <input type="tel" placeholder="Enter Phone Number" className="w-full p-5 bg-gray-50 rounded-2xl text-center font-bold outline-none" onChange={e => setPhone(e.target.value)} />
              <button onClick={saveProfile} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20 active:scale-95 transition-all">
                {loading ? 'Entering...' : 'Enter The Town →'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}