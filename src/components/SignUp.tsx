import React, {
  FormEvent,
  useEffect,
  useContext,
  useRef,
  useState,
} from "react";
import {
  checkUsername,
  createUser,
  getUserFromCanister,
  getUserNameByPrincipal,
  // useAuth,
  getFirebase,
  // useFirebase
  AuthContext,
} from "../utils";
import logo from "../assets/images/cancan-logo.png";
import { LoadingIndicator } from "./LoadingIndicator";
import { useHistory } from "react-router";
import "./SignUp.scss";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";

/*
 * This component receives the authentication information and queries to see if
 * the principal returned from Identity Service matches an existing userId. If
 * it does, we set the match as the currentUser and redirect to the /feed route.
 * If the principal does not match an existing userId, the user creates one with
 * the provided form and submits, receiving an error if the name is already
 * taken, and being redirected to the /feed route on success.
 */

export function SignUp() {
  const [error, setError] = useState("");
  const [isCheckingICForUser, setIsCheckingICForUser] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  // const auth = getAuth();
  const history = useHistory();

  // Get a user name from the user's principal and then fetch the user object
  // with all the user's data. Show a loading message between these async
  // backend calls happening.
  // useEffect(() => {
  //   if (!auth.isAuthReady) return;
  //   if (auth.isAuthenticated && auth.identity !== undefined) {
  //     setIsCheckingICForUser(true);
  //     getUserNameByPrincipal(auth.identity.getPrincipal()).then((username) => {
  //       if (username) {
  //         // User exists! Set user and redirect to /feed.
  //         getUserFromCanister(username).then((user) => {
  //           setIsCheckingICForUser(false);
  //           auth.setUser(user!);
  //           history.replace("/feed");
  //         });
  //         setIsCheckingICForUser(false);
  //       } else {
  //         // Do nothing. Allow the user to create a userId
  //         setIsCheckingICForUser(false);
  //       }
  //     });
  //   }
  // }, [auth.isAuthReady, auth.isAuthenticated, auth.identity]);

  // Submit the form to signup with a new username, the backend ensures that
  // the username is available.
  async function submit(evt: FormEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    setError("");

    // Get the username entered from the form.
    const username = usernameInputRef?.current?.value!;
    const password = passwordInputRef?.current?.value!;
    setIsSigningIn(true);
    // Check to make sure this username has not been taken. If this user already
    // has a username, it should have signed them in already.
    // const isAvailable = true;//await checkUsername(username);

    // if (isAvailable) {
    //   // Create a user on the backend and assign that user to frontend data.
    //   const user = await createUser(username);
    //   auth.setUser(user);
    //   setIsSigningIn(false);
    //   history.push("/feed");
    // } else {
    //   setError(`Username '${username}' is not signed up yet. Please sign up here`);
    //   setIsSigningIn(false);
    // }

    // let firebaseInstance = getFirebase()
    // if (firebaseInstance) {
    //   const auth = getAuth();
    createUserWithEmailAndPassword(getAuth(), username, password)
      .then((user) => {
        setIsSigningIn(false);
        history.push("/sign-in");
      })
      .catch((error) => {
        setError(`Username '${username}' is taken`);
        setIsSigningIn(false);
      });
    // }
  }

  return (
    <main id="form-container">
      <LoadingIndicator
        isLoading={isCheckingICForUser}
        loadingMessage="Checking to see if we know you yet..."
      />
      <LoadingIndicator
        isLoading={isSigningIn}
        loadingMessage="Signing up..."
      />

      <form onSubmit={submit}>
        <img alt="cancan logo" src={logo} style={{ width: "24.2rem" }} />

        <div className="username-container">
          <label htmlFor="username">
            <p>Enter a username & password to get started:</p>
          </label>
          {error !== "" && (
            <div hidden={error === undefined} className="error">
              <span className="message">{error}</span>
            </div>
          )}
          <input
            ref={usernameInputRef}
            type="text"
            name="username"
            id="username"
            placeholder="username"
          />
          <input
            ref={passwordInputRef}
            type="text"
            name="password"
            id="password"
            placeholder="password"
          />
        </div>
        <button type="submit" id="sign-in" className="primary medium">
          Sign Up!
        </button>
      </form>
      <Link
        style={{
          color: "red",
          fontSize: "1.8rem",
          position: "absolute",
          top: "30px",
        }}
        to="/sign-in"
      >
        Sign In.
      </Link>
    </main>
  );
}
