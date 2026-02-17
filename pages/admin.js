// ... (Firebase imports)

export default function LuxuryAdmin() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentServing, setCurrentServing] = useState(0);

  useEffect(() => {
    setMounted(true);
    onValue(ref(db, 'live_orders'), (snap) => {
      if(snap.exists()) setOrders(Object.entries(snap.val()).map(([id, v]) => ({ id, ...v })));
    });
    onValue(ref(db, 'queue/current'), (snap) => {
      if(snap.exists()) setCurrentServing(snap.val());
    });
  }, []);

  const advanceQueue = () => {
    const nextToken = currentServing + 1;
    update(ref(db, 'queue'), { current: nextToken });
  };

  if(!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-12 font-serif">
      <header className="mb-20 flex justify-between items-end border-b border-white/10 pb-10">
        <div>
          <h1 className="text-5xl font-light italic text-[#d4af37]">Concierge</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 mt-4 italic">Operations Dashboard</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest opacity-30 mb-2">Current Serving</p>
          <h2 className="text-6xl font-light italic">#{currentServing}</h2>
          <button onClick={advanceQueue} className="mt-6 border border-[#d4af37] text-[#d4af37] px-8 py-2 text-[10px] uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all">Next Sequence →</button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 max-w-2xl mx-auto">
        {orders.map(o => (
          <div key={o.id} className="border-l-4 border-[#d4af37] bg-white/5 p-10 backdrop-blur-md">
            <h3 className="text-2xl font-light italic uppercase mb-2">{o.customer}</h3>
            <p className="text-xs opacity-40 mb-6 italic">{o.time} • Sequence Pending</p>
            <button className="w-full border border-white/20 py-4 text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">Clear Sequence</button>
          </div>
        ))}
      </div>
    </div>
  );
}