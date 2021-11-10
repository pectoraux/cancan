// import { useAuth } from "../utils";
import "../components/SignUp.scss";
import React, {
  FormEvent,
  useEffect,
  useContext,
  useRef,
  useState,
} from "react";
import {
  checkUsername,
  // createUser,
  getUserFromCanister,
  getUserNameByPrincipal,
  AuthContext,
} from "../utils";
import logo from "../assets/images/cancan-logo.png";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useHistory } from "react-router";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "src/utils/firebase";
import firebase from "firebase";
import { SignInWithSocialMedia } from "src/utils/authSocial";

/*
 * The sign-in process for when a user has not yet authenticated with the
 * Internet Identity Service.
 */
export function SignIn() {
  const [error, setError] = useState("");
  const [isCheckingICForUser, setIsCheckingICForUser] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();

  // Initiates the login flow with the identity provider service, sending the
  // user to a new tab
  const handleLogin = async (evt: FormEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    setError("");

    // Get the username entered from the form.
    const username = usernameInputRef?.current?.value!;
    const password = passwordInputRef?.current?.value!;
    setIsSigningIn(true);
    auth
      .signInWithEmailAndPassword(username, password)
      .then((result) => {
        if (!result.user?.emailVerified) {
          auth.signOut();
          setError("Please verify your email first");
          setIsSigningIn(false);
        } else {
          history.push("/feed");
        }
      })
      .catch((error) => {
        setIsSigningIn(false);
        setError(error.message);
      });
    // }
  };

  const signInWIthSocialMedia = (provider: firebase.auth.AuthProvider) => {
    setError("");
    setIsSigningIn(true);
    SignInWithSocialMedia(provider)
      .then((result) => {
        history.push("/feed");
      })
      .catch((error) => {
        setIsSigningIn(false);
        setError(error.message);
      });
  };

  return (
    <main id="form-container">
      <LoadingIndicator
        isLoading={isCheckingICForUser}
        loadingMessage="Checking to see if we know you yet..."
      />
      <LoadingIndicator
        isLoading={isSigningIn}
        loadingMessage="Signing in..."
      />
      <form onSubmit={handleLogin}>
        <img alt="cancan logo" src={logo} style={{ width: "24.2rem" }} />
        <div className="username-container">
          <label htmlFor="username">
            <p>Enter a username & password to sign in</p>
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
            type="password"
            name="password"
            id="password"
            placeholder="password"
          />
        </div>
        <button type="submit" id="sign-in" className="primary medium">
          Sign In!
        </button>
      </form>
      <Link
        style={{
          color: "red",
          fontSize: "1.8rem",
          position: "absolute",
          top: "30px",
        }}
        to="/sign-up"
      >
        Sign Up.
      </Link>
    </main>
  );
}
