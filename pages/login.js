import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function LuxuryLogin() {
  const [pass, setPass] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleEntry = () => {
    // Tuhada ditta hoya password
    if(pass === "aashray778") {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin");
    } else {
        alert("Access Denied: Invalid Credentials");
    }
  };

  if(!mounted) return null;

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8 font-serif">
      <Head><title>Secure Access | FT Concierge</title></Head>
      
      <div className="w-full max-w-sm text-center">
        <p className="text-[10px] tracking-[0.6em] text-[#d4af37] uppercase mb-4 opacity-60">Sovereign Encryption</p>
        <h1 className="text-4xl font-light italic text-white mb-12 tracking-tighter">Command <br/><span className="text-[#d4af37]">Authentication</span></h1>
        
        <div className="relative group">
          <input 
            type="password" 
            placeholder="ACCESS KEY" 
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-4 text-center text-white tracking-[1em] outline-none focus:border-[#d4af37] transition-all duration-700 placeholder:text-[10px] placeholder:tracking-[0.5em] placeholder:opacity-20"
          />
        </div>

        <button 
          onClick={handleEntry}
          className="mt-16 w-full border border-[#d4af37] text-[#d4af37] py-5 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#d4af37] hover:text-black transition-all duration-700 shadow-2xl"
        >
          Verify Identity
        </button>

        <p className="mt-10 text-[8px] uppercase tracking-[0.3em] text-white opacity-20">Authorized Personnel Only • IP Logged</p>
      </div>
    </div>
  );
}