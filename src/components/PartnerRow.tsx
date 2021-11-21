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
  userId,
  partnerId,
  partnerEmail,
  partnerDescription,
  disableFollow = true,
}: {
  userId: string;
  partnerId: string;
  partnerEmail: string;
  partnerDescription: string;
  disableFollow?: boolean;
}) {
  return (
    <>
      <Link to={`/feed_user/${partnerId}`}>
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
        </div>
      </Link>
      <div style={{ position: "relative", top: "-100px", marginLeft: "300px" }}>
        {disableFollow ? (
          <div />
        ) : (
          <PartnerButton
            key={partnerEmail}
            partnerId={partnerId}
            partnerEmail={partnerEmail}
            description={partnerDescription}
          />
        )}
      </div>
    </>
  );
}
