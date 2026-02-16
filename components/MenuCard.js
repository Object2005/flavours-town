import { useState, useMemo } from 'react';

export default function MenuGrid({ menu, setCart, cart, ui }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = useMemo(() => {
    return menu.filter(item => 
      item.name?.en.toLowerCase().includes(search.toLowerCase()) && 
      (cat === 'All' || item.category === cat)
    );
  }, [menu, search, cat]);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative group">
        <input 
          type="text" 
          placeholder={ui.lang === 'EN' ? "Search Chaap, Tikka..." : "ਖਾਣਾ ਲੱਭੋ..."}
          className={`w-full p-6 pl-14 rounded-[2.5rem] outline-none font-bold text-sm shadow-sm border transition-all ${ui.dark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute left-6 top-6 opacity-30">🔍</span>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {['All', 'Chaap', 'Tikka', 'Rolls', 'Paneer'].map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest ${cat === c ? 'bg-orange-600 text-white shadow-xl' : 'bg-white dark:bg-white/5 opacity-50'}`}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {filtered.map((p, i) => (
          <div key={i} className={`p-5 rounded-[2.5rem] border transition-all ${ui.dark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-black/5'} shadow-sm relative overflow-hidden`}>
            {p.bestseller && <div className="absolute top-4 left-4 bg-orange-600 text-white text-[7px] font-black px-3 py-1 rounded-full z-10 shadow-lg">BESTSELLER</div>}
            <img src={p.img} className="w-full h-36 object-cover rounded-[1.8rem] mb-4 shadow-md" />
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2.5 h-2.5 border border-green-600 flex items-center justify-center p-[2px]"><div className="w-full h-full bg-green-600 rounded-full" /></div>
              <h3 className="text-[11px] font-black uppercase truncate tracking-tight">{ui.lang === 'EN' ? p.name.en : p.name.pb}</h3>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-black italic text-orange-600 tracking-tighter">₹{p.price}</span>
              <button onClick={() => setCart([...cart, p])} className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center font-black active:scale-90 transition-transform">+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}