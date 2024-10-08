 
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

// Create user with email and password
export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in user with email and password
export const doSignInWithEmailAndPassword = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out the current user
export const doSignOut = (): Promise<void> => {
  return auth.signOut();
};
