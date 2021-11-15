import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { LoadingIndicator } from "./LoadingIndicator";
import "./Upload.scss";
import { uploadProfilePic } from "../utils/video";
import Select from "react-select";
import { auth } from "src/utils/firebase";
import { createPartnerRequest } from "src/utils";
import backIcon from "../assets/images/icon-back.png";
import { getUserProfile } from "../utils";
/*
 * Allows selection of a file followed by the option to add a caption before
 * uploading to the canister. Utility functions assist in the data translation.
 */
export function CreatePartner({ partnerId }) {
  const history = useHistory();
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const partnerDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const [categories, setCategories] = useState([
    { label: "Categories", value: 0 },
  ]);
  const [selectedOption, setSelectedOption] = useState<Array<string>>([
    "Categories",
  ]);
  const [userProfile, setUserProfile] = useState<any>();

  useEffect(() => {
    getUserProfile(auth.currentUser?.uid!).then((res) => {
      setUserProfile(res);
      let arr = [{ label: "Categories", value: 0 }];
      res?.categories?.map((val, idx) => {
        arr.push({ label: val, value: idx });
      });
      setCategories(arr);
    });
  }, []);

  async function submit(evt: FormEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    setError("");
    setDisabled(true);

    const partnerDescription = partnerDescriptionRef?.current?.value!;
    setCreating(true);
    createPartnerRequest(
      auth.currentUser?.email!,
      auth.currentUser?.uid!,
      partnerId,
      partnerDescription
    ).then(() => {
      setCreating(false);
      setTimeout(() => {
        history.push("/profile");
      }, 2000);
    });
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
            <Select
              placeholder={selectedOption}
              isMulti={true}
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
                let arr = Array<string>();
                val.map((v) => {
                  arr.push(v.label);
                });
                setSelectedOption(arr || ["Categories"]);
              }}
              options={categories}
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
              ref={partnerDescriptionRef}
              placeholder="What services do you provide?"
              rows={6}
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
