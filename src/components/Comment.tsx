import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import FlagButton from "./FlagButton";
import SuperLikeButton from "./SuperLikeButton";
import TippingButton from "./TippingButton";
import { ProfilePic } from "./ProfilePic";
import { SuperLikeEffect } from "./SuperLikeEffect";
import {
  getVideoChunks,
  getProfilePic,
  like,
  superLike,
  useOnScreen,
} from "../utils";
import likeIcon from "../assets/images/icon-like.png";
import commentIcon from "../assets/images/icon-comment.png";
import shareIcon from "../assets/images/icon-share.png";
import "./Video.scss";
import downIcon from "../assets/images/icon-down.png";
import upIcon from "../assets/images/icon-up.png";

// The amount of flags a video needs before we blur it out on frontend
const VIDEO_BLUR_MIN = 1;

interface VideoProps {
  videoInfo: any;
  userId: string;
  userRewardPoints: number;
  onRefreshUser?: any;
  isPreview?: boolean;
  onClose?: () => void;
}

// Wrapper to allow us to use the same video component for single previews from
// Profile and Discover, and for all videos in the Feed
export function Comment() {
  // const {
  //   isPreview = false,
  //   userId,
  //   userRewardPoints,
  //   onRefreshUser,
  //   videoInfo,
  //   onClose = () => {},
  // } = props;
  return (
    <VideoBase
      userId={"userId"}
      userRewardPoints={0}
      onRefreshUser={() => {}}
      videoInfo={""}
      onClose={() => {}}
    />
  );
}

function VideoBase(props: VideoProps) {
  const {
    videoInfo,
    userId,
    userRewardPoints = 0,
    isPreview = false,
    onRefreshUser = () => {},
    onClose = () => {},
  } = props;
  const [play, setPlay] = useState(false);
  const [videoSourceURL, setVideoSourceURL] = useState<string>();
  const [userPic, setUserPic] = useState<string>();
  const [userLikes, setUserLikes] = useState(true); //useState(videoInfo.likes.includes(userId));
  const [isSuperLiked, setIsSuperLiked] = useState(false);
  const [toggleCaption, setToggleCaption] = useState(false);

  const videoIsFlagged = false; //videoInfo.abuseFlagCount >= VIDEO_BLUR_MIN;

  const videoRef = useRef<HTMLVideoElement>(null);

  // Load video and uploader profilePic on first mount.
  useEffect(() => {
    if (!videoInfo) {
      return;
    }
    // getProfilePic(videoInfo.userId).then((bytes) => {
    //   if (!bytes) {
    //     return;
    //   }
    //   const picBlob = new Blob([Buffer.from(new Uint8Array(bytes))], {
    //     type: "image/jpeg",
    //   });
    // const pic = URL.createObjectURL('');
    const pic = "https://jpeg.org/images/jpeg-home.jpg";
    setUserPic(pic);
    // });

    return () => videoRef.current?.pause();
  }, [videoInfo?.videoId]);

  function handleLike() {
    // like(userId, videoInfo.videoId, !userLikes);
    setUserLikes((state) => !state);
  }

  const isCurrentUser = false; //userId === videoInfo.userId;
  const videoBlurStyle = videoIsFlagged ? { filter: "blur(20px)" } : {};

  return (
    <div className="video-container">
      <div className="comment-details">
        <ProfilePic name={"videoInfo.userId"} profilePic={userPic} />
        <div
          style={{ position: "relative", right: "-60px", fontSize: "1.8rem" }}
        >
          <Link
            to={isCurrentUser ? `/profile` : `/profiles/${"videoInfo.userId"}`}
          >
            @{"videoInfo.userId"}
          </Link>
        </div>
        <div>
          <div className="">
            <div
              className="caption"
              style={{
                position: "relative",
                right: "-70px",
                color: "gray",
                width: "300px",
                display: "block",
                wordWrap: "break-word",
              }}
            >
              videoInfo.caption videoInfo.captionvideoInfo
              .captionvideoInfo.captionvideoInfo videoInfo.caption
              videoInfo.captionvideoInfo .captionvideoInfo.captionvideoInfo
              videoInfo.caption videoInfo.captionvideoInfo
              .captionvideoInfo.captionvideoInfo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
