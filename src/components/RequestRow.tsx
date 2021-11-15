import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProfilePic } from "./ProfilePic";
import { RequestButton } from "./RequestButton";
import "./FollowUserRow.scss";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { handlePartnerRequest, handleFollowerRequest } from "src/utils";

/*
 * A single instance of a row in the Followers/Following Profile views. Displays
 * the user's profile picture and username as a link to their profile, along
 * with a button to follow/unfollow that user.
 */
export function RequestRow({
  userId,
  partnerId,
  partnerEmail,
  partnerDescription,
  handleFollow = false,
  following = false,
  disableFollow = true,
}: {
  userId: string;
  partnerId: string;
  partnerEmail: string;
  partnerDescription: string;
  handleFollow?: boolean;
  following?: boolean;
  disableFollow?: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(following);

  // Instead of waiting for the return from the canister update call, we
  // optimistically update the UI
  function handleAcceptClick(event) {
    event.preventDefault();
    setIsFollowing((state) => !state);
    if (handleFollow) {
      handleFollowerRequest(true, userId, partnerEmail, partnerId);
    } else {
      handlePartnerRequest(
        true,
        userId,
        partnerEmail,
        partnerId,
        partnerDescription
      );
    }
  }

  function handleRejectClick(event) {
    event.preventDefault();
    setIsFollowing((state) => !state);
    if (handleFollow) {
      handleFollowerRequest(false, userId, partnerEmail, partnerId);
    } else {
      handlePartnerRequest(
        false,
        userId,
        partnerEmail,
        partnerId,
        partnerDescription
      );
    }
  }

  return !isFollowing ? (
    <Link to={disableFollow ? "/profile" : `/profiles/${partnerId}`}>
      <div
        className="follow-row"
        style={{ paddingBottom: "90px", paddingTop: "90px" }}
      >
        <ProfilePic profilePic="" name={partnerId} clickable={false} />
        <span
          className="username"
          style={{ display: "block", fontSize: "10px" }}
        >
          <span style={{ font: "caption" }}> {partnerEmail} </span> <br />
          {partnerDescription}
        </span>
        {disableFollow ? (
          <div />
        ) : (
          <RequestButton
            isFollowing={isFollowing}
            handleFollow={handleAcceptClick}
            handleReject={handleRejectClick}
          />
        )}
      </div>
    </Link>
  ) : (
    <div />
  );
}
