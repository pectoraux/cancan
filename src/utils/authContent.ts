// FirebaseAuthContext.tsx
import firebase from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  User,
  onAuthStateChanged,
  UserProfile,
} from "firebase/auth";

//1.
import React, { useEffect, useContext, useState } from "react";

//2.
export const FirebaseContext = React.createContext({
  user: null,
});

export const useFirebase = () => {
  const firebaseContext = useContext(FirebaseContext);
  if (firebaseContext === undefined) {
    throw new Error(
      "useFirebase must be used within a FirebaseContext.Provider"
    );
  }
  return firebaseContext;
};

//3.
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const FirebaseAuthContext = useFirebase();

//   useEffect(() => {
//     onAuthStateChanged(getAuth(), (user)=>{});
//   }, []);

//   return (
//     <FirebaseAuthContext.Provider value={user}>
//     {children}
//     </FirebaseAuthContext.Provider>
//   );
// };
