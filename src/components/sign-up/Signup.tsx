import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context/index";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { toast } from 'react-toastify';
import HashLoader from "react-spinners/HashLoader"; 

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        toast.success("Account created successfully!"); // Show success toast
      } catch (error) {
        const errorMessage = (error as Error).message; // Type assertion
        setErrorMessage(errorMessage); // Handle errors
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/login"} replace={true} />}

      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center mb-6">
            <div className="mt-2">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                Create a New Account
              </h3>
            </div>
          </div>
          
          {/* Conditionally Render Form or Loader */}
          {isRegistering ? (
            <div className="flex justify-center items-center h-full">
              <HashLoader color={"#003EFF"} loading={isRegistering} size={50} />
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 font-bold">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-[#003EFF] shadow-sm rounded-lg transition duration-300"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-bold">Password</label>
                <input
                  disabled={isRegistering}
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-[#003EFF] shadow-sm rounded-lg transition duration-300"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-bold">Confirm Password</label>
                <input
                  disabled={isRegistering}
                  type="password"
                  autoComplete="off"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setconfirmPassword(e.target.value);
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-[#003EFF] shadow-sm rounded-lg transition duration-300"
                />
              </div>

              {errorMessage && (
                <span className="text-red-600 font-bold">{errorMessage}</span>
              )}

              <button
                type="submit"
                disabled={isRegistering}
                className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                  isRegistering
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#003EFF] hover:bg-[#003EFF] hover:shadow-xl transition duration-300"
                }`}
              >
                Sign Up
              </button>
              <div className="text-sm text-center">
                Already have an account? {"   "}
                <Link
                  to={"/login"}
                  className="text-center text-sm hover:underline font-bold"
                >
                  Continue
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
};

export default Signup;
