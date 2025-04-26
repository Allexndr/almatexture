import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

const DashboardRedirect: NextPage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    if (isClient) {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
      if (!isAuthenticated) {
        router.push('/admin');
        return;
      }
      
      // Redirect to the dashboard page
      router.push('/admin/dashboard');
    }
  }, [router, isClient]);
  
  return null;
};

export default DashboardRedirect; 