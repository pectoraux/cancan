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
import Select from "react-select";

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
  const [selectedOption, setSelectedOption] = useState<string>("WORKSPACES");
  const [selectedOption2, setSelectedOption2] = useState<string>("COUNTRIES");
  const [worskspaces, setWorskspaces] = useState([
    { label: "WORKSPACES", value: 0 },
  ]);
  const [countries, setCountries] = useState([
    { label: "COUNTRIES", value: 0 },
  ]);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isSelected ? "grey" : "black",
      padding: 2,
      "&:hover": {
        backgroundColor: "#b0eff556",
      },
    }),
    control: (base) => ({
      width: 400,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

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
            <div style={{ position: "relative", top: "-120px", left: "120px" }}>
              <Select
                placeholder={selectedOption}
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator: () => {
                    return (
                      <div
                        style={{
                          position: "relative",
                          top: "-20px",
                          marginLeft: "120px",
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
                  setSelectedOption(val?.label || "WORKSPACE");
                }}
                options={worskspaces}
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
              <Select
                placeholder={selectedOption2}
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator: () => {
                    return (
                      <div
                        style={{
                          position: "relative",
                          top: "-20px",
                          marginLeft: "120px",
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
                  setSelectedOption2(val?.label || "COUNTRIES");
                }}
                options={countries}
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
            </div>
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
