import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [pass, setPass] = useState("");
  const router = useRouter();

  const check = () => {
    if(pass === "aashray778") {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin");
    } else alert("Wrong Key");
  };

  return (
    <div style={{ backgroundColor: '#2D4137', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '30px' }}>
      <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '40px' }}>Tasty Admin</h1>
      <input 
        type="password" 
        placeholder="ENTER ACCESS KEY" 
        style={{ width: '100%', maxWidth: '300px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', padding: '20px', borderRadius: '20px', color: 'white', textAlign: 'center', marginBottom: '20px', outline: 'none' }}
        onChange={(e) => setPass(e.target.value)}
      />
      <button onClick={check} style={{ backgroundColor: 'white', color: '#2D4137', border: 'none', padding: '15px 50px', borderRadius: '20px', fontWeight: 'bold' }}>Login</button>
    </div>
  );
}