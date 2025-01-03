import { auth } from "./config";
import {
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error) {
    throw error;
  }
};


// Function to log out the current user
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
};
