import React, { FormEvent, useRef, useState } from "react";
import { createProfile } from "src/utils";
import logo from "../assets/images/cancan-logo.png";
import { LoadingIndicator } from "./LoadingIndicator";
import { useHistory } from "react-router";
import "./SignUp.scss";
import { Link } from "react-router-dom";
import { auth } from "src/utils/firebase";
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
  const [isSigningUp, setIsSigningUp] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();

  // Submit the form to signup with a new username, the backend ensures that
  // the username is available.
  async function submit(evt: FormEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    setError("");
    // Get the username entered from the form.
    const username = usernameInputRef?.current?.value!;
    const password = passwordInputRef?.current?.value!;
    setIsSigningUp(true);
    auth
      .createUserWithEmailAndPassword(username, password)
      .then((user) => {
        createProfile(user.user?.uid || "", username);
        user.user?.sendEmailVerification().then((result) => {
          setError("A verification email has been sent to your email address.");
        });
        setIsSigningUp(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/weak-password") {
          setError("Please enter a stronger password");
        } else if (error.code === "auth/email-already-in-use") {
          setError(`Email '${username}' is taken`);
        } else {
          setError("Unable to register. Please try again later");
        }
        setIsSigningUp(false);
      });
  }

  return (
    <main id="form-container">
      <LoadingIndicator
        isLoading={isCheckingICForUser}
        loadingMessage="Checking to see if we know you yet..."
      />
      <LoadingIndicator
        isLoading={isSigningUp}
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
