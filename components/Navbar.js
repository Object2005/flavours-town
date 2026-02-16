export default function Navbar({ user, setUi, ui }) {
  return (
    <header className={`fixed top-0 w-full z-[100] px-6 py-5 border-b flex justify-between items-center ${ui.dark ? 'bg-black/90 border-white/5' : 'bg-white/90 border-gray-100'} backdrop-blur-2xl`}>
      <div className="flex flex-col">
        <h1 className="text-xl font-black italic text-orange-600 uppercase tracking-tighter leading-none">The Flavours Town</h1>
        <p className="text-[7px] font-black opacity-30 uppercase tracking-[0.4em] mt-1">Dev: Aashray Narang</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setUi(prev => ({...prev, dark: !prev.dark}))} className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-lg">{ui.dark ? '☀️' : '🌙'}</button>
        <button onClick={() => setUi(prev => ({...prev, lang: prev.lang === 'EN' ? 'PB' : 'EN'}))} className="bg-orange-600 text-white px-4 rounded-2xl text-[10px] font-black uppercase">{ui.lang}</button>
        <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center font-black shadow-lg">{user?.name[0]}</div>
      </div>
    </header>
  );
}