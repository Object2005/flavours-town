import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Firebase Config (Keep it consistent across all files)
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

export default function AuthPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Je user pehla hi login hai taan home te bhejo
    if (localStorage.getItem('ft_user')) {
      router.push('/');
    }

    // 2. Invisible Recaptcha Setup
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => { console.log("Captcha Verified Automatically"); }
      });
    }
  }, [router]);

  const sendOTP = async () => {
    if (!phone || phone.length < 10) return alert("Sahi number bharo!");
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const res = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
      setConfirmationResult(res);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
      window.recaptchaVerifier.render().then(id => grecaptcha.reset(id));
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const userData = { name, phone, uid: result.user.uid, joined: new Date().toISOString() };
      
      // Save to LocalStorage
      localStorage.setItem('ft_user', JSON.stringify(userData));
      
      // Success Haptic/Sound
      if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
      
      router.push('/');
    } catch (error) {
      alert("Galt OTP! Dubara check karo.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex flex-col items-center justify-center p-6 font-sans">
      <Head><title>Login | The Flavours Town</title></Head>
      
      {/* Invisible Container for Firebase */}
      <div id="recaptcha-container"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic text-orange-600 uppercase tracking-tighter leading-none">The Flavours Town</h1>
          <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mt-2 italic">Verified Access Only</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase opacity-40 ml-4 tracking-widest">Full Name</p>
                <input type="text" placeholder="Aashray Narang" className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none border-none focus:ring-2 ring-orange-100 transition-all" onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase opacity-40 ml-4 tracking-widest">Phone Number</p>
                <div className="relative">
                  <span className="absolute left-5 top-5 font-bold opacity-30">+91</span>
                  <input type="tel" placeholder="98765-43210" className="w-full p-5 pl-14 bg-gray-50 rounded-2xl font-bold outline-none border-none focus:ring-2 ring-orange-100 transition-all" onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              <button 
                onClick={sendOTP} 
                disabled={loading}
                className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Get OTP →'}
              </button>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-xs font-bold opacity-40">OTP sent to +91 {phone}</p>
                <button onClick={() => setStep(1)} className="text-[10px] font-black text-orange-600 uppercase mt-1">Change Number</button>
              </div>
              <input 
                type="number" 
                placeholder="0 0 0 0 0 0" 
                className="w-full p-5 bg-gray-50 rounded-2xl font-black text-center text-2xl tracking-[0.5em] outline-none border-none" 
                onChange={e => setOtp(e.target.value)} 
              />
              <button 
                onClick={verifyOTP} 
                disabled={loading}
                className="w-full py-5 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                {loading ? 'Verifying...' : 'Verify & Enter'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-[8px] font-bold opacity-20 uppercase tracking-[0.2em] mt-10">
          Secure Login Powered by Firebase Auth
        </p>
      </motion.div>
    </div>
  );
}