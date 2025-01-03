import React, { createContext, useContext } from "react";
import { db, auth } from "../firebase/config"; // Use existing config

const FirebaseContext = createContext();

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

const FirebaseProvider = ({ children }) => {
  const value = {
    db,
    auth,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
