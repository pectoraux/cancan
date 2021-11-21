import React from "react";
import "./FollowButton.scss";
import {
  auth,
  getUserProfile,
  handleFollower,
  handleFollowerRequest,
} from "src/utils";

export function FollowButton({ isFollowing, setIsFollowing, userId }) {
  const [followerRequest, setFollowRequest] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  getUserProfile(userId).then((res) => {
    setUserEmail(res?.email);
    setFollowRequest(res?.followerRequest);
  });
  function handleFollowClick() {
    setIsFollowing((state) => !state);
    if (followerRequest) {
      handleFollowerRequest(
        !isFollowing,
        userId,
        auth.currentUser?.email!,
        auth.currentUser?.uid!
      );
    } else {
      handleFollower(
        !isFollowing,
        userId,
        userEmail,
        auth.currentUser?.uid!,
        auth.currentUser?.email!
      );
    }
  }
  return (
    <button
      className={`follow-button${!isFollowing ? " primary" : ""}`}
      onClick={handleFollowClick}
    >
      {followerRequest
        ? isFollowing
          ? "Pending"
          : "Follow"
        : isFollowing
        ? "Unfollow"
        : "Follow"}
    </button>
  );
}
