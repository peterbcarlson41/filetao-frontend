import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const exemptPaths = ["/", "/login", "/register"];

  const checkTokenExpiration = () => {
    const expiryTime = localStorage.getItem("token_expiry");
    const isExemptPath = exemptPaths.includes(location.pathname);

    if (
      !isExemptPath &&
      (!expiryTime || Date.now() > parseInt(expiryTime, 10))
    ) {
      alert("Your session has expired. Please log in again.");
      logout();
      navigate("/login"); // Redirect to login page only if not on exempt pages
    }
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    setCurrentUser(null);
    if (!exemptPaths.includes(location.pathname)) {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkTokenExpiration(); // Moved the check to a separate useEffect to control when it runs
  }, [location]); // Rerun the effect when location changes

  useEffect(() => {
    const token = localStorage.getItem("token");
    setCurrentUser(token ? { isLoggedIn: true } : null);
    setIsLoading(false);
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    logout,
    isLoading,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
