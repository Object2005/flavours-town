import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update, remove } from "firebase/database";

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [prepTime, setPrepTime] = useState(20);
  const db = getDatabase();

  useEffect(() => {
    // Check Auth
    if(!localStorage.getItem("admin_auth")) window.location.href = "/login";

    onValue(ref(db, 'live_orders'), (snap) => {
      if(snap.exists()) setOrders(Object.entries(snap.val()).map(([id, v]) => ({ id, ...v })));
    });
    onValue(ref(db, 'menu'), (snap) => {
      if(snap.exists()) setMenu(Object.entries(snap.val()).map(([id, v]) => ({ id, ...v })));
    });
    onValue(ref(db, 'prep_config'), (snap) => { if(snap.exists()) setPrepTime(snap.val().time); });
  }, []);

  const changePrepTime = (newTime) => {
    update(ref(db, 'prep_config'), { time: newTime });
    setPrepTime(newTime);
  };

  const updateOrderStatus = (id, status) => {
    if(status === 'Served') remove(ref(db, `live_orders/${id}`));
    else update(ref(db, `live_orders/${id}`), { status });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black italic uppercase text-red-600">Commander Room</h1>
          <div className="bg-zinc-900 p-4 rounded-2xl flex items-center gap-4">
              <span className="text-[10px] font-black uppercase opacity-40">Live Timer (Mins)</span>
              <input type="number" value={prepTime} onChange={(e)=>changePrepTime(e.target.value)} className="bg-black border border-white/10 w-16 p-2 rounded-lg text-center font-black" />
          </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LIVE ORDERS (Step 3.2) */}
          <section>
              <h2 className="text-xs font-black uppercase tracking-widest mb-6 opacity-30 italic">Incoming Orders</h2>
              <div className="space-y-4">
                {orders.slice().reverse().map((order) => (
                    <div key={order.id} className="bg-zinc-900 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-black text-sm uppercase italic">{order.customer}</h3>
                                <p className="text-[9px] text-orange-500 font-bold">{order.phone}</p>
                            </div>
                            <span className="text-xl font-black italic">₹{order.total}</span>
                        </div>
                        <div className="space-y-1 mb-6 border-y border-white/5 py-4">
                            {order.items.map((it, i) => <p key={i} className="text-[10px] font-bold opacity-60 uppercase italic">• {it.name}</p>)}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {['Accepted', 'Cooking', 'Served'].map(s => (
                                <button key={s} onClick={()=>updateOrderStatus(order.id, s)} className={`py-3 rounded-xl text-[9px] font-black uppercase ${order.status === s ? 'bg-red-600' : 'bg-zinc-800'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                ))}
              </div>
          </section>

          {/* STOCK MANAGEMENT (Step 3.1) */}
          <section>
              <h2 className="text-xs font-black uppercase tracking-widest mb-6 opacity-30 italic">Inventory Control</h2>
              <div className="grid grid-cols-2 gap-4">
                {menu.map((item) => (
                    <div key={item.id} className={`p-4 rounded-[2rem] border transition-all ${item.inStock ? 'bg-zinc-900 border-white/5' : 'bg-red-950/20 border-red-900/40 grayscale'}`}>
                        <p className="font-black text-[10px] uppercase italic mb-3">{item.name}</p>
                        <button onClick={()=>update(ref(db, `menu/${item.id}`), {inStock: !item.inStock})} className={`w-full py-2 rounded-xl text-[8px] font-black uppercase ${item.inStock ? 'bg-white text-black' : 'bg-red-600 text-white'}`}>
                            {item.inStock ? 'In Stock' : 'Sold Out'}
                        </button>
                    </div>
                ))}
              </div>
          </section>
      </div>
    </div>
  );
}