import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
// import { auth } from "../utils/firebase";

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
