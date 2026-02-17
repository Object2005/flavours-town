import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [pass, setPass] = useState("");
  const router = useRouter();
  const auth = getAuth();

  const handleAdminLogin = () => {
    if(pass === "aashray778") { // Step 3: Password only login
        localStorage.setItem("admin_auth", "true");
        router.push("/admin");
    } else { alert("Wrong Password!"); }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-2xl font-black mb-6 uppercase italic">Admin Access</h1>
      <input type="password" placeholder="Enter Admin Password" onChange={(e)=>setPass(e.target.value)} className="bg-zinc-900 border border-white/10 p-4 rounded-2xl mb-4 w-full max-w-xs outline-none" />
      <button onClick={handleAdminLogin} className="bg-red-600 w-full max-w-xs py-4 rounded-2xl font-black uppercase tracking-widest">Login to Command Center</button>
    </div>
  );
}