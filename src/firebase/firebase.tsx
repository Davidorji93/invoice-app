// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkQV5DfPeW5HWP4sL-OHONlNFmNrFhcEA",
  authDomain: "invoice-app-d2ab8.firebaseapp.com",
  projectId: "invoice-app-d2ab8",
  storageBucket: "invoice-app-d2ab8.appspot.com",
  messagingSenderId: "214636052426",
  appId: "1:214636052426:web:36fe9caff1133b5d18d933"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
 const auth = getAuth(app);

export { app, auth };