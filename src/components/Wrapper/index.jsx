import { Navigate } from "react-router-dom";
import supabase from "../../helper/superBaseClient";
import { useEffect, useState } from "react";

function Wrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        setIsAuthenticated(!!session);
        setLoading(false);
        
        if (error) {
          console.error("Wrapper - error checking session:", error);
        }
      } catch (err) {
        console.error("Wrapper - exception checking session:", err);
        setLoading(false);
      }
    };

    getSession();
    
    // Subscribe to auth changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });
    
    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  } else if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" />;
}

export default Wrapper;
