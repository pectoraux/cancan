import React from "react";
import "./FollowButton.scss";

export function RequestButton({ isFollowing, handleFollow, handleReject }) {
  return (
    <div className="col">
      <button
        className="follow-button primary"
        onClick={handleFollow}
        disabled={isFollowing}
      >
        Accept
      </button>
      <div style={{ padding: "1px" }}></div>
      <button
        className="follow-button"
        onClick={handleReject}
        disabled={isFollowing}
      >
        Reject
      </button>
    </div>
  );
}
