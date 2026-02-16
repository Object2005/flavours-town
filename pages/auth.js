import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export default function FinalAuth() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('ft_user')) router.push('/');
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-box', { 'size': 'invisible' });
  }, []);

  const sendOTP = async () => {
    try {
      const res = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier);
      setResult(res); setStep(2);
    } catch (e) { alert("OTP Error: " + e.message); }
  };

  const verifyOTP = async () => {
    try {
      await result.confirm(otp);
      localStorage.setItem('ft_user', JSON.stringify({ name, phone }));
      router.push('/');
    } catch (e) { alert("Galt OTP!"); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 font-sans">
      <div id="recaptcha-box"></div>
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-black italic text-orange-600 mb-2 uppercase tracking-tighter">Enter Town</h1>
        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-12">Verified Access Only</p>
        
        {step === 1 ? (
          <div className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full p-6 bg-gray-50 rounded-3xl font-bold outline-none" onChange={e=>setName(e.target.value)} />
            <input type="tel" placeholder="Phone Number" className="w-full p-6 bg-gray-50 rounded-3xl font-bold outline-none" onChange={e=>setPhone(e.target.value)} />
            <button onClick={sendOTP} className="w-full py-6 bg-orange-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20">Get OTP</button>
          </div>
        ) : (
          <div className="space-y-4">
            <input type="number" placeholder="6-Digit OTP" className="w-full p-6 bg-gray-100 rounded-3xl font-bold text-center text-2xl tracking-[0.5em]" onChange={e=>setOtp(e.target.value)} />
            <button onClick={verifyOTP} className="w-full py-6 bg-black text-white rounded-[2.5rem] font-black uppercase tracking-widest">Verify & Login</button>
          </div>
        )}
      </div>
    </div>
  );
}