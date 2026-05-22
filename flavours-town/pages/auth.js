import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      // Check if admin is logged in via localStorage
      const isAdmin = localStorage.getItem("admin_auth");

      if (!isAdmin) {
        // Je login nahi hoya, taan elegant login page te bhejo
        router.replace('/login');
      } else {
        setVerified(true);
      }
    }, [router]);

    if (!verified) {
      return (
        <div style={{ 
          backgroundColor: '#0a0a0a', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#d4af37',
          fontFamily: 'serif',
          letterSpacing: '5px',
          fontSize: '10px'
        }}>
          VERIFYING AUTHORITY...
        </div>
      );
    }

    return <Component {...props} />;
  };
}