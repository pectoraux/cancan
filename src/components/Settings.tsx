import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { LoadingIndicator } from "./LoadingIndicator";
import "./Upload.scss";
import { uploadProfilePic } from "../utils/video";
import { auth } from "src/utils/firebase";
import { saveSettings } from "src/utils";
import backIcon from "../assets/images/icon-back.png";
import { FormGroup } from "@material-ui/core";
import { FormControlLabel } from "@material-ui/core";
import { Switch } from "@material-ui/core";
/*
 * Allows selection of a file followed by the option to add a caption before
 * uploading to the canister. Utility functions assist in the data translation.
 */
export function Settings({ partnerPaywall, followerPaywall, followerRequest }) {
  const history = useHistory();
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [paywall, setPaywall] = useState(followerPaywall);
  const [paywall2, setPaywall2] = useState(partnerPaywall);
  const [permissionedFollow, setPermissionedFollow] = useState(followerRequest);
  const partnerNameRef = useRef<HTMLInputElement>(null);

  async function submit(evt: FormEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    setError("");
    setDisabled(true);

    setCreating(true);
    saveSettings(auth.currentUser?.uid!, paywall2, paywall, permissionedFollow)
      .then(() => {
        setCreating(false);
        setTimeout(() => {
          history.push("/profile");
        }, 2000);
      })
      .catch((err) => setError("Unable to save. Try again later"));
  }

  return (
    <main id="video-upload-container">
      <LoadingIndicator
        loadingMessage="Saving..."
        completedMessage="Saved!"
        isLoading={creating}
      />
      <header style={{ position: "relative", top: "30px" }} id="alt-header">
        <button id="back" onClick={() => history.push("/profile")}>
          <img src={backIcon} alt="Go Back" />
        </button>
      </header>
      <form onSubmit={submit}>
        <div className="video-add-details">
          <div className="details-entry">
            {error !== "" && (
              <div hidden={error === undefined} className="error">
                <span className="message">{error}</span>
              </div>
            )}
            <FormGroup style={{ position: "relative", top: "-100px" }}>
              <FormControlLabel
                label="ACTIVATE PARTNERS' PAYWALL"
                control={
                  <Switch
                    defaultChecked={paywall2}
                    onChange={(e) => {
                      setPaywall2(e.target.checked);
                    }}
                  />
                }
              />
              <FormControlLabel
                label="ACTIVATE FOLLOWERS' PAYWALL"
                control={
                  <Switch
                    defaultChecked={paywall}
                    onChange={(e) => {
                      setPaywall(e.target.checked);
                    }}
                  />
                }
              />
              <FormControlLabel
                label="PERMISSIONED FOLLOW"
                control={
                  <Switch
                    defaultChecked={permissionedFollow}
                    onChange={(e) => {
                      setPermissionedFollow(e.target.checked);
                    }}
                  />
                }
              />
            </FormGroup>
            <button
              type="submit"
              className="primary medium"
              disabled={disabled}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
