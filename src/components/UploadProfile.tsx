import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { LoadingIndicator } from "./LoadingIndicator";
import "./Upload.scss";
import { uploadProfilePic } from "../utils/video";
import { auth } from "src/utils/firebase";
/*
 * Allows selection of a file followed by the option to add a caption before
 * uploading to the canister. Utility functions assist in the data translation.
 */
export function UploadProfile({ user, onUpload }) {
  const history = useHistory();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.click();
  }, []);

  async function onChange(evt: ChangeEvent<HTMLInputElement>) {
    setUploading(true);
    const { files } = evt.target;
    if (files && files.length === 1 && files.item(0)) {
      const file = files[0];
      const url = await uploadProfilePic(auth.currentUser?.uid, file);
      auth.currentUser
        ?.updateProfile({
          photoURL: url,
        })
        .then(() => {
          setUploading(false);
          setTimeout(() => {
            history.push("/profile");
          }, 2000);
        });
    }
  }

  return (
    <main
      id="video-upload-container"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <LoadingIndicator
        loadingMessage="Uploading..."
        completedMessage="Uploaded!"
        isLoading={uploading}
      />
      <input
        hidden
        id="video-upload"
        type="file"
        ref={inputRef}
        accept="image/png,image/jpeg"
        onChange={onChange}
      />
    </main>
  );
}
