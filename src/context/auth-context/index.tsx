import React, { useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../../firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

// Define a type for AuthContext value
interface AuthContextType {
    userLoggedIn: boolean;
    isEmailUser: boolean;
    currentUser: User | null;
    user: User | null;  // Add this line
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  }
  

// Define a type for the AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user: User | null) {
    if (user) {
      setCurrentUser({ ...user });

      // Check if provider is email and password login
      const isEmail = user.providerData.some(
        (provider: { providerId: string; }) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }
  const value: AuthContextType = {
    userLoggedIn,
    isEmailUser,
    currentUser,
    user: currentUser, 
    setCurrentUser,
  };
  

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
