import React from "react";
import "./FollowButton.scss";

export function PartnerButton({ isFollowing, handleFollow }) {
  return (
    <button
      className={`follow-button${!isFollowing ? " primary" : ""}`}
      onClick={handleFollow}
    >
      {isFollowing ? "Unpartner" : "Partner"}
    </button>
  );
}
