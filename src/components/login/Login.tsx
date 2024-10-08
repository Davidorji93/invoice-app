import React, { useState, FormEvent } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../context/auth-context/index";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HashLoader from "react-spinners/HashLoader"; // Import HashLoader

const Login: React.FC = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        toast.success("Login successful!");
      } catch (error) {
        console.error(error);  
        setErrorMessage("Failed to sign in. Please try again.");
        toast.error("Login failed. Please check your credentials.");
      } finally {
        setIsSigningIn(false);
      }
    }
  };
  
  return (
    <div>
      {userLoggedIn && <Navigate to={"/dashboard"} replace={true} />}

      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center">
            <div className="mt-2">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                Welcome Back
              </h3>
            </div>
          </div>

          {/* Conditionally render the form or the loader */}
          {isSigningIn ? (
            <div className="flex justify-center items-center h-full">
              <HashLoader color={"#003EFF"} loading={isSigningIn} size={50} />
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-gray-600 font-bold">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-bold">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-[#003EFF] shadow-sm rounded-lg transition duration-300"
                />
              </div>

              {errorMessage && (
                <span className="text-red-600 font-bold">{errorMessage}</span>
              )}

              <button
                type="submit"
                disabled={isSigningIn}
                className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                  isSigningIn
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#003EFF] hover:bg-[#003EFF] hover:shadow-xl transition duration-300"
                }`}
              >
                {isSigningIn ? "Signing In..." : "Sign In"}
              </button>
            </form>
          )}

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to={"/signup"} className="hover:underline font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
