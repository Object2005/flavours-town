import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import MenuCard from '../components/MenuCard';
// ... baki imports same rehan gae

export default function Home() {
  const [state, setState] = useState({ menu: [], cart: [], user: null, lang: 'EN', dark: false, search: '' });

  // Filter logic hun separate hai, UI nu nahi chedega
  const filteredMenu = useMemo(() => {
    return state.menu.filter(item => 
      item.name?.en.toLowerCase().includes(state.search.toLowerCase())
    );
  }, [state.menu, state.search]);

  return (
    <div className={state.dark ? 'dark bg-[#121212]' : 'bg-[#fcfbf7]'}>
      <Navbar user={state.user} toggleSettings={() => {}} darkMode={state.dark} />
      
      <main className="pt-24 px-4 pb-32 max-w-4xl mx-auto">
        {/* Search Bar Component */}
        <input 
          type="text" 
          className="w-full p-5 rounded-3xl mb-8 border" 
          onChange={(e) => setState({...state, search: e.target.value})} 
          placeholder="Search..."
        />

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredMenu.map(p => (
            <MenuCard key={p.id} item={p} lang={state.lang} onAdd={(item) => setState({...state, cart: [...state.cart, item]})} darkMode={state.dark} />
          ))}
        </div>
      </main>
      
      {/* Footer/Cart Dock handle karo */}
    </div>
  );
}