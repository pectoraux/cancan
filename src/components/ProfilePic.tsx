import React from "react";
import { textToColor } from "../utils";
import { Link } from "react-router-dom";
import { auth } from "src/utils/firebase";

export function ProfilePic({ name, profilePic }) {
  // const profileColor = textToColor(name);

  return (
    <div className="profile-pic">
      <Link to="/upload_profile">
        {auth.currentUser?.photoURL ? (
          <img alt={name} src={`${auth.currentUser?.photoURL}`} />
        ) : (
          <div
            className="placeholder-profile-pic"
            // style={{ backgroundColor: profileColor }}
            title={name}
          >
            <span className="left-eye" />
            <span className="right-eye" />
            <span className="smile" />
            <span className="mouth" />
            <span className="tongue" />
          </div>
        )}
      </Link>
    </div>
  );
}
