import React from "react";
import "./FollowButton.scss";
import { auth, handlePartnerRemove } from "src/utils";

export function PartnerButton({ partnerId, partnerEmail, description }) {
  const [isPartner, setIsPartner] = React.useState(true);
  return isPartner ? (
    <button
      className={"follow-button primary"}
      onClick={() => {
        setIsPartner((state) => !state);
        handlePartnerRemove(
          auth.currentUser?.uid!,
          partnerId,
          partnerEmail,
          description
        );
      }}
    >
      Terminate
    </button>
  ) : (
    <div />
  );
}
