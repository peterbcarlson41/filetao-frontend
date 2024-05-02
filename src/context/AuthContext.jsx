import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import app from "../../firebaseConfig"; // Adjust path as needed

// Retrieve the base API URL from environment variables
const BASE_URL = import.meta.env.VITE_APP_API_URL;

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // For Google sign-in

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      navigate("/verify-email");
      return userCredential.user;
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed:", error);
    }
  };

  const registerWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Save new user to backend right after Google registration
      await saveUserToBackend(result.user);
      navigate("/dashboard");
      return result.user;
    } catch (error) {
      console.error("Google sign-up failed:", error);
      alert("Google sign-up failed:", error);
    }
  };

  const saveUserToBackend = async (user) => {
    console.log("Attempting to save user to backend", user.uid);
    try {
      const response = await fetch(`${BASE_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          email: user.email,
        }),
      });
      const data = await response.json();
      console.log("User registered in backend:", data);
    } catch (error) {
      console.error("Failed to register user in backend:", error);
      alert("Failed to register user: " + error);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        navigate("/dashboard");
      } else {
        alert("Please verify your email before logging in.");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        "Login failed. Please check your email and password and try again."
      );
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Save new user to backend right after Google registration
      await saveUserToBackend(result.user);
      navigate("/dashboard"); // Navigate to dashboard after Google login
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Google sign-in failed:", error);
    }
  };

  const logout = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
        navigate("/login"); // Navigate after logout
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const getToken = async () => {
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully.");
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw error; // Rethrow the error so it can be caught and handled by the caller component.
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        register,
        registerWithGoogle,
        saveUserToBackend,
        login,
        loginWithGoogle,
        logout,
        getToken,
        resetPassword,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
