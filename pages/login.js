import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function LuxuryLogin() {
  const [pass, setPass] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleEntry = () => {
    if(pass === "aashray778") {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin");
    } else {
        alert("ACCESS DENIED: INVALID KEY");
    }
  };

  if(!mounted) return null;

  return (
    <div style={{ backgroundColor: '#0a0a0a', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', padding: '20px' }}>
      <Head><title>FT | Security</title></Head>
      <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '300', fontStyle: 'italic', letterSpacing: '2px', marginBottom: '40px' }}>
          COMMAND <br/><span style={{ color: '#d4af37' }}>AUTHENTICATION</span>
        </h1>
        <input 
          type="password" 
          placeholder="ACCESS KEY" 
          onChange={(e) => setPass(e.target.value)}
          style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '15px 0', textAlign: 'center', color: 'white', letterSpacing: '10px', outline: 'none', marginBottom: '40px' }}
        />
        <button onClick={handleEntry} style={{ width: '100%', backgroundColor: 'transparent', border: '1px solid #d4af37', color: '#d4af37', padding: '15px', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', cursor: 'pointer' }}>
          Verify Identity
        </button>
      </div>
    </div>
  );
}