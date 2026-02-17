import { useState, useEffect } from 'react';
import Head from 'next/head';
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

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // SSR error fix
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
      alert("Login Error: " + e.message);
    }
    setLoading(false);
  };

  if (!isClient) return <div className="min-h-screen bg-[#fcfbf7]" />;

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex flex-col items-center justify-center p-6 text-black font-sans">
      <Head>
        <title>Flavours Town | Online Order</title>
      </Head>
      
      <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-2xl border text-center">
        <h1 className="text-3xl font-black italic text-orange-600 uppercase mb-8">Flavours Town</h1>
        
        {!user ? (
          <div className="space-y-4">
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full py-5 border-2 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5" alt="G" />
              {loading ? 'Verifying...' : 'Login with Google'}
            </button>
            <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Login to see the menu</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-black text-lg text-green-600 italic uppercase">Login Success! ✅</p>
            <p className="text-[11px] font-black uppercase opacity-60 italic">Welcome, {user.displayName}</p>
            <div className="pt-6 border-t mt-4">
              <div className="animate-pulse bg-orange-100 h-10 w-full rounded-xl flex items-center justify-center">
                 <p className="text-orange-600 font-black text-[10px] uppercase">Loading Menu Items...</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-[9px] font-black uppercase opacity-20 tracking-[0.4em]">Malout, Punjab 📍</p>
    </div>
  );
}