import { motion } from 'framer-motion';

export default function OrderTracker({ history, activeOrder, setCart, ui }) {
  return (
    <div className="space-y-10">
      {/* Live Order (Blinkit Style) */}
      {activeOrder && (
        <motion.div initial={{scale:0.9}} animate={{scale:1}} className="p-8 rounded-[3rem] bg-orange-600 text-white shadow-2xl relative overflow-hidden">
           <div className="flex justify-between items-center mb-6">
             <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Live Order Status</span>
             <span className="px-5 py-2 bg-white/20 rounded-full text-[10px] font-black animate-pulse uppercase">{activeOrder.status}</span>
           </div>
           <div className="h-1.5 w-full bg-black/10 rounded-full mb-4 overflow-hidden">
             <motion.div initial={{width:0}} animate={{width: activeOrder.status === 'Ready' ? '100%' : '50%'}} className="h-full bg-white" />
           </div>
           <h2 className="text-3xl font-black italic uppercase tracking-tighter">Your meal is {activeOrder.status.toLowerCase()}!</h2>
        </motion.div>
      )}

      {/* History List */}
      <div className="space-y-4">
        <h2 className="text-lg font-black italic uppercase mb-6 tracking-tighter">Order History</h2>
        {history.slice().reverse().map((o, idx) => (
          <div key={idx} className={`p-6 rounded-[2.5rem] border ${ui.dark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'} shadow-sm`}>
            <div className="flex justify-between mb-2">
               <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.3em]">ID: #{o.id}</span>
               <span className="text-orange-600 font-black text-[9px] uppercase italic">Delivered ✅</span>
            </div>
            <p className="text-[11px] font-bold uppercase mb-4 tracking-tight leading-relaxed">{o.items?.map(it => it.name.en).join(', ')}</p>
            <div className="flex justify-between items-center">
               <span className="text-xl font-black italic tracking-tighter">₹{o.total}</span>
               <button onClick={() => setCart(o.items)} className="px-6 py-2.5 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95">Re-Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}