import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProfilePic } from "./ProfilePic";
import { PartnerButton } from "./PartnerButton";
import "./FollowUserRow.scss";
import ReactReadMoreReadLess from "react-read-more-read-less";

/*
 * A single instance of a row in the Followers/Following Profile views. Displays
 * the user's profile picture and username as a link to their profile, along
 * with a button to follow/unfollow that user.
 */
export function PartnerRow({
  partnerId,
  partnerEmail,
  handleFollow = () => {},
  following = false,
  disableFollow = true,
}: {
  partnerId: string;
  partnerEmail: string;
  handleFollow?: (partnerId: string, willFollow: boolean) => void;
  following?: boolean;
  disableFollow?: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(following);

  // Instead of waiting for the return from the canister update call, we
  // optimistically update the UI
  function handleFollowClick(event) {
    event.preventDefault();
    setIsFollowing((state) => !state);
    handleFollow(partnerId, !isFollowing);
  }

  return (
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
          djskdjskjd skdjsdksdk skdjskj jksdjk skdjkdjs djskdjskjd skdjsdksdk
          skdjskj jksdjk skdjkdjs djskdjskjd skdjsdksdk skdjskj jksdjk skdjkdjs
          djskdjskjd skdjsdksdk skdjskj jksdjk skdjkdjs djskdjskjd skdjsdksdk
          skdjskj jksdjk skdjkdjs djskdjskjd skdjsdksdk skdjskj jksdjk
          skdjkdjsdjskdjskjd skdjsdksdk skdjskj jksdjk skdjkdjs djskdjskjd
          skdjsdksdk skdjskj jksdjk skdjkdjs
        </span>
        {disableFollow ? (
          <div />
        ) : (
          <PartnerButton
            isFollowing={isFollowing}
            handleFollow={handleFollowClick}
          />
        )}
      </div>
    </Link>
  );
}
