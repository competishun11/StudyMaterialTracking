import { auth, db } from "./config";
import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "./firebase/config"; // Assuming you are using Firebase Firestore

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Login successful:", user.displayName); 
    return user; // Admin login successful

  } catch (error) {
    console.error("Login failed:", error.message);
    throw error; // If the user is not admin or any other error
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
