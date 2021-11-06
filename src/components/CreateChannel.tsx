import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { LoadingIndicator } from "./LoadingIndicator";
import "./Upload.scss";
import { uploadProfilePic } from "../utils/video";
import { auth } from "src/utils/firebase";
import { createChannel, addChannel } from "src/utils";
import backIcon from "../assets/images/icon-back.png";
/*
 * Allows selection of a file followed by the option to add a caption before
 * uploading to the canister. Utility functions assist in the data translation.
 */
export function CreateChannel({ user }) {
  const history = useHistory();
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const channelNameRef = useRef<HTMLInputElement>(null);

  async function submit(evt: FormEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    setError("");
    setDisabled(true);

    const channelName = channelNameRef?.current?.value!;
    if (channelName.trim()) {
      setCreating(true);
      createChannel(auth.currentUser?.uid!, channelName).then((channelId) => {
        addChannel(auth.currentUser?.uid!, channelId, channelName).then(() => {
          setCreating(false);
          setTimeout(() => {
            history.push("/profile");
          }, 2000);
        });
      });
    } else {
      setError("Name not valid");
      setDisabled(false);
    }
  }

  return (
    <main id="video-upload-container">
      <LoadingIndicator
        loadingMessage="Creating..."
        completedMessage="Created!"
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
            <input
              className="caption-content"
              style={{ width: "100%", fontSize: "20px" }}
              ref={channelNameRef}
              type="text"
              placeholder="Channel name"
            />
            <button
              type="submit"
              className="primary medium"
              disabled={disabled}
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
