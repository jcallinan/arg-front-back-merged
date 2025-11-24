import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/modules/auth/customhooks/useAuth";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  let authHook;
  try {
    authHook = useAuth();
   
  } catch (error) {
    console.error("❌ useAuth hook failed:", error);
    
    // During development, if the context is lost due to hot reloading, 
    // redirect to login instead of crashing
    if (process.env.NODE_ENV === 'development') {
      console.warn("🔧 Context lost during development - redirecting to login");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    throw error;
  }
  
  const { handleSuccessfulLogin } = authHook;

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    handleSuccessfulLogin()
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, []);

  if (isChecking) {
    return ;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

