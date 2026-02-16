import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Auth() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (name && phone.length === 10) {
      localStorage.setItem('ft_user', JSON.stringify({ name, phone }));
      router.push('/');
    } else {
      alert("Sahi Name te 10-digit Phone bharo!");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 font-sans">
      <Head><title>Login | The Flavours Town</title></Head>
      <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <h1 className="text-2xl font-black italic text-orange-600 text-center mb-8 uppercase">Welcome to FT</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none font-bold" />
          <input type="number" placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none font-bold" />
          <button type="submit" className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-lg">Start Ordering</button>
        </form>
      </div>
    </div>
  );
}