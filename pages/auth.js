// Pehla eh import add kar lo top te (Database use karan layi)
import { getDatabase, ref, set } from "firebase/database";

// ... baki code same rahega ...

const saveProfile = async () => {
  if (phone.length < 10) return alert("Sahi phone number bharo veer!");
  setLoading(true);

  const db = getDatabase(app);
  const finalUser = { 
    ...tempUser, 
    phone, 
    role: 'customer', // Default role
    createdAt: new Date().toISOString() 
  };

  try {
    // 1. Firebase Database vich save karo (Taki Admin dekh sake)
    await set(ref(db, 'users/' + tempUser.uid), finalUser);

    // 2. Local browser vich save karo
    localStorage.setItem('ft_user', JSON.stringify(finalUser));
    
    // Success Haptic
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    
    // Go to Home
    router.push('/');
  } catch (error) {
    console.error(error);
    alert("Database error! Try again.");
  }
  setLoading(false);
};