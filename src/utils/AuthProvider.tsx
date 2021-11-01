import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
// import { User, getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
// import {User} from "firebase/database";

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<null>(null);

  useEffect(() => {
    // const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
    //   setUser(firebaseUser);
    // });
    // return unsubscribe;
  }, []);

  function signup(email, password) {
    // return createUserWithEmailAndPassword(getAuth(), email, password);
  }

  const value = {
    user,
    signup,
  };

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
