import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = { apiKey: "AIzaSyA2tiCsoPmKV8U_yCXXSKq1wcL7Mdd2UCo", authDomain: "flavourstown-83891.firebaseapp.com", databaseURL: "https://flavourstown-83891-default-rtdb.firebaseio.com", projectId: "flavourstown-83891", storageBucket: "flavourstown-83891.firebasestorage.app", messagingSenderId: "631949771733", appId: "1:631949771733:web:16e025bbc443493242735c" };
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const [confirm, setConfirm] = useState(null);
  const router = useRouter();

  useEffect(() => { 
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
  }, []);

  const onSendOTP = async () => {
    const res = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier);
    setConfirm(res); setStep(2);
  };

  const onVerify = async () => {
    await confirm.confirm(otp);
    localStorage.setItem('ft_user', JSON.stringify({ name, phone, id: Date.now() }));
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex flex-col items-center justify-center p-6 font-sans">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black italic text-orange-600 text-center mb-8 tracking-tighter uppercase">Town Login</h1>
        {step === 1 ? (
          <div className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none border-none" onChange={e=>setName(e.target.value)} />
            <input type="tel" placeholder="Phone Number" className="w-full p-5 bg-gray-50 rounded-2xl font-bold outline-none border-none" onChange={e=>setPhone(e.target.value)} />
            <button onClick={onSendOTP} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-lg shadow-orange-600/30 transition-all active:scale-95">Send OTP</button>
          </div>
        ) : (
          <div className="space-y-4">
            <input type="number" placeholder="Enter OTP" className="w-full p-5 bg-gray-50 rounded-2xl font-black text-center text-2xl tracking-[0.5em] outline-none" onChange={e=>setOtp(e.target.value)} />
            <button onClick={onVerify} className="w-full py-5 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest transition-all active:scale-95">Verify & Enter</button>
          </div>
        )}
      </div>
    </div>
  );
}