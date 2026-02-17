import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// --- FIREBASE CONFIG ---
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
const provider = new GoogleAuthProvider();

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Google Login, 2: Phone Input
  const [tempUser, setTempUser] = useState(null);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (localStorage.getItem('ft_user')) router.push('/');
  }, [router]);

  // --- GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Generate Unique ID (e.g., AASHRAY-4921)
      const firstName = user.displayName.split(' ')[0].toUpperCase();
      const uniqueNum = Math.floor(1000 + Math.random() * 9000);
      const townId = `${firstName}-${uniqueNum}`;

      setTempUser({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
        townId: townId
      });
      setStep(2); 
    } catch (error) {
      console.error(error);
      alert("Login Failed! Firebase Settings check karo.");
    }
    setLoading(false);
  };

  // --- FINAL PROFILE SAVE ---
  const saveProfile = () => {
    if (phone.length < 10) return alert("Sahi phone number bharo veer!");
    const finalUser = { ...tempUser, phone };
    localStorage.setItem('ft_user', JSON.stringify(finalUser));
    
    // Success Vibe
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 font-sans">
      <Head><title>Town Access | The Flavours Town</title></Head>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white p-10 rounded-[3.5rem] shadow-2xl border border-gray-100 text-center"
      >
        <div className="mb-10">
          <h1 className="text-3xl font-black italic text-orange-600 uppercase tracking-tighter leading-none">The Flavours Town</h1>
          <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.4em] mt-3">Verified Member Gateway</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="g" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div className="mb-10 p-8 bg-orange-50 rounded-[2.5rem] text-4xl shadow-inner inline-block">🍔</div>
              <button 
                onClick={handleGoogleLogin} 
                disabled={loading}
                className="w-full py-5 bg-white border-2 border-gray-100 hover:border-orange-600 rounded-[2rem] flex items-center justify-center gap-4 transition-all active:scale-95"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="G" />
                <span className="font-black text-xs uppercase tracking-widest">{loading ? 'Connecting...' : 'Continue with Google'}</span>
              </button>
            </motion.div>
          ) : (
            <motion.div key="p" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex flex-col items-center">
                <img src={tempUser?.photo} className="w-16 h-16 rounded-full border-2 border-orange-500 p-1 mb-4" />
                <p className="text-xs font-black uppercase tracking-tight">Welcome, {tempUser?.name}</p>
                <p className="text-[10px] font-bold text-orange-600 uppercase mt-1">ID: {tempUser?.townId}</p>
              </div>

              <div className="space-y-2 text-left">
                <p className="text-[9px] font-black uppercase opacity-40 ml-4 tracking-widest">Your Phone Number</p>
                <input 
                  type="tel" 
                  placeholder="98765 43210" 
                  className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none border-none focus:ring-2 ring-orange-100 transition-all text-center" 
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button 
                onClick={saveProfile} 
                className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95"
              >
                Enter The Town →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-12 text-[7px] font-black opacity-10 uppercase tracking-[0.3em]">
          Secure Access Protocol • Developed by Aashray
        </p>
      </motion.div>
    </div>
  );
}