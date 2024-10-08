import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./firebase/firebase";
import { User } from "firebase/auth"; // Import User type
import Signup from "./components/sign-up/Signup";
import Login from "./components/login/Login";
import InvoiceOverview from "./components/invoice-overview/InvoiceOverview";
import InvoiceDetails from "./components/invoice-details/InvoiceDetails";
import "./App.css";

const App = () => {
  const [user, setUser] = useState<User | null>(null); // State can be User or null
  const [loading, setLoading] = useState(true); // Loading state to prevent premature redirection

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: User | null) => {
      setUser(currentUser); // Set the user if authenticated
      setLoading(false); // Stop loading when we know the user's status
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message while checking authentication
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/invoice-details/:id"
        element={user ? <InvoiceDetails /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={user ? <InvoiceOverview /> : <Navigate to="/login" />}
      />

      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />

      {/* Handle 404 */}
      <Route path="*" element={<div>404 - Page not found</div>} />
    </Routes>
  );
};

export default App;
