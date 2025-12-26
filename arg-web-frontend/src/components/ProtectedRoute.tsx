import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/modules/auth/customhooks/useAuth";
import {
  extractRightsV2,
  hasPathAccessFromRightsV2,
} from "@utils/permissionUtils";

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
  
  const { handleSuccessfulLogin, lastLoginResponse } = authHook;

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

  // Derive path-based access from rightsV2 in ME API response
  const hasPathAccess = useMemo(() => {
    // Always allow the dedicated No Access screen itself
    if (location.pathname === "/no-access") {
      return true;
    }

    // If we don't have ME data yet, don't block route – let auth flow decide
    if (!lastLoginResponse) {
      return true;
    }

    const rightsV2 = extractRightsV2(lastLoginResponse);

    // If backend hasn't provided rightsV2 yet, fall back to allowing the route
    if (!rightsV2 || Object.keys(rightsV2).length === 0) {
      return true;
    }

    return hasPathAccessFromRightsV2(rightsV2, location.pathname);
  }, [lastLoginResponse, location.pathname]);

  if (isChecking) {
    return ;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but does not have rights for this specific path,
  // redirect them to the No Access screen.
  if (!hasPathAccess) {
    return <Navigate to="/no-access" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

