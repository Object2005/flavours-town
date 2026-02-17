// index.js de shuru vich eh changes karo:

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false); // New state to check if we are on browser

  useEffect(() => {
    setIsClient(true); // Browser load ho gaya
    const saved = localStorage.getItem('ft_user');
    if (!saved) {
      window.location.href = '/auth';
    } else {
      setUser(JSON.parse(saved));
    }
  }, []);

  // Je server te hai ya user load nahi hoya, taan empty div dikhao
  if (!isClient || !user) {
    return (
      <div className="h-screen flex items-center justify-center font-black text-orange-600 bg-[#fcfbf7]">
        LOADING THE TOWN...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] pb-32">
      {/* Tuhada baki saara code... */}
    </div>
  );
}