import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Auth() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSignup = (e) => {
    e.preventDefault();
    if (name && phone.length === 10) {
      localStorage.setItem('ft_user', JSON.stringify({ name, phone }));
      router.push('/');
    } else {
      alert("Please enter Name & 10-digit Phone!");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-6 font-sans">
      <Head><title>Login | The Flavours Town</title></Head>
      <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <div className="text-center mb-10">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-black italic text-xl">F</div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gray-800">Welcome to FT</h1>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] mt-2">Malout's Finest Taste</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="text" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-orange-500 font-bold" />
          <input type="number" placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-orange-500 font-bold" />
          <button type="submit" className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-600/20">Start Ordering</button>
        </form>
      </div>
    </div>
  );
}