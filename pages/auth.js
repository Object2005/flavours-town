import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

  useEffect(() => {
    if (localStorage.getItem('ft_user')) router.push('/');
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
        loginType: 'google'
      };

      localStorage.setItem('ft_user', JSON.stringify(userData));
      router.push('/');
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 font-sans">
      <Head><title>Login | The Flavours Town</title></Head>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white p-12 rounded-[4rem] shadow-2xl text-center border border-gray-100"
      >
        <h1 className="text-3xl font-black italic text-orange-600 uppercase tracking-tighter mb-2">The Flavours Town</h1>
        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mb-12">Login to your food kingdom</p>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-5 bg-white border-2 border-gray-100 hover:border-orange-600 rounded-[2rem] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-6 h-6" alt="Google" />
          <span className="font-black text-sm uppercase tracking-widest">{loading ? 'Logging in...' : 'Sign in with Google'}</span>
        </button>

        <p className="mt-10 text-[8px] font-black opacity-20 uppercase tracking-widest leading-loose">
          No OTP, No Captcha, Just Flavor.<br/>Powered by Aashray Narang
        </p>
      </motion.div>
    </div>
  );
}