import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ProfileInfoPlus } from "../utils/canister/typings";
import { useUploadVideo, getUserProfile } from "../utils";
import { LoadingIndicator } from "./LoadingIndicator";
import "./Upload.scss";
import backIcon from "../assets/images/icon-back.png";
import Select from "react-select";
import { auth } from "src/utils/firebase";

/*
 * Allows selection of a file followed by the option to add a caption before
 * uploading to the canister. Utility functions assist in the data translation.
 */
export function Upload({
  user,
  onUpload,
}: {
  user?: ProfileInfoPlus;
  onUpload: () => void;
}) {
  const history = useHistory();
  const [videoFile, setVideoFile] = useState<File>();
  const [videoPreviewURL, setVideoPreviewURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingClean, setUploadingClean] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedOption, setSelectedOption] = useState<string>("Collections");
  const [actions, setActions] = useState([{ label: "Collections", value: 0 }]);
  const [userProfile, setUserProfile] = useState<any>();

  const videoUploadController = useUploadVideo({
    userId: auth.currentUser?.uid || "",
    collectionName: selectedOption,
  });

  useEffect(() => {
    inputRef.current?.click();
    getUserProfile(auth.currentUser?.uid!).then((res) => {
      setUserProfile(res);
      let arr = [{ label: "Collections", value: 0 }];
      res?.collectionNames?.map((val, idx) => {
        arr.push({ label: val, value: idx });
        setSelectedOption(val);
      });
      setActions(arr);
    });
  }, []);

  useEffect(() => {
    if (uploading && uploadingClean) {
      setUploadingClean(false);
    }
  }, [uploading]);

  useEffect(() => {
    if (videoFile) {
      // Create video preview so the user can see what they've selected
      videoFile.arrayBuffer().then((buffer) => {
        const videoBlob = new Blob([buffer], {
          type: "video/mp4",
        });
        const vidURL = URL.createObjectURL(videoBlob);
        setVideoPreviewURL(vidURL);
      });
    }
  }, [videoFile]);

  function onChange(evt: ChangeEvent<HTMLInputElement>) {
    const { files } = evt.target;
    if (files && files.length === 1 && files.item(0)) {
      const file = files[0];
      setVideoFile(file);
    }
  }

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isSelected ? "grey" : "black",
      padding: 2,
      "&:hover": {
        backgroundColor: "#F5F5F5",
      },
    }),
  };

  // Wraps and triggers several functions in the videoUploadController to
  // generate a videoId and begin uploading.
  function upload() {
    const caption = textAreaRef.current?.value;
    if (!videoFile || !caption) {
      return;
    }
    videoUploadController.setFile(videoFile);
    videoUploadController.setCaption(caption);
    videoUploadController.setReady(true);
    setUploading(true);
  }

  // On upload success, wait 2 seconds and then redirect to /feed
  useEffect(() => {
    if (videoUploadController.completedVideo !== undefined) {
      setUploading(false);
      onUpload();
      setTimeout(() => {
        history.push("/feed");
      }, 2000);
    }
  }, [videoUploadController.completedVideo]);

  return (
    <main
      id="video-upload-container"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <header style={{ position: "relative", top: "30px" }} id="alt-header">
        <button id="back" onClick={() => history.push("/profile")}>
          <img src={backIcon} alt="Go Back" />
        </button>
      </header>
      <LoadingIndicator
        loadingMessage="Uploading..."
        completedMessage="Uploaded!"
        isLoading={uploading && !uploadingClean}
      />
      <input
        hidden
        id="video-upload"
        type="file"
        ref={inputRef}
        accept=".mp4"
        onChange={onChange}
      />
      {videoFile && (
        <div className="video-add-details">
          <video src={videoPreviewURL} muted autoPlay loop />
          <div className="details-entry">
            <Select
              placeholder={selectedOption}
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: () => {
                  return (
                    <div
                      style={{
                        marginLeft: "260px",
                        width: "0",
                        height: "0",
                        borderLeft: "7px solid transparent",
                        borderRight: "7px solid transparent",
                        borderTop: "7px solid grey",
                      }}
                    >
                      {" "}
                    </div>
                  );
                },
              }}
              styles={customStyles}
              onChange={(val) => {
                setSelectedOption(val?.label || "Collections");
              }}
              options={actions}
              menuPlacement="top"
              classNamePrefix="select"
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary: "white",
                  neutral80: "grey",
                },
              })}
            />
            <br />
            <textarea
              className="caption-content"
              ref={textAreaRef}
              placeholder="Add caption"
              rows={6}
            />
            <button className="medium primary" onClick={upload}>
              Post
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
