import { Navigate } from "react-router-dom";
import supabase from "../../../helper/superBaseClient";
import { useEffect, useState } from "react";

function Wrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log({data: session});
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    getSession();
    console.log();
  }, []);

  

  if (loading) {
    return <p>Loading...</p>;
  } else if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" />;
}



export default Wrapper;
