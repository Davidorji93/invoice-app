import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth-context/index.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        closeOnClick
        pauseOnHover
      />
      <App />
    </BrowserRouter>
  </AuthProvider>
);
