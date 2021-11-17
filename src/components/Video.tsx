import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingIndicator } from "../components/LoadingIndicator";
import FlagButton from "./FlagButton";
import SuperLikeButton from "./SuperLikeButton";
import TippingButton from "./TippingButton";
import SwipeableButton from "./SwipeableButton";
import ShareButton from "./ShareButton";
import { ProfilePic } from "./ProfilePic";
import { SuperLikeEffect } from "./SuperLikeEffect";
import {
  getVideoChunks,
  getProfilePic,
  like,
  superLike,
  getFeedVideo,
  useOnScreen,
} from "../utils";
import likeIcon from "../assets/images/icon-like.png";
import commentIcon from "../assets/images/icon-comment.png";
import shareIcon from "../assets/images/icon-share.png";
import "./Video.scss";
import downIcon from "../assets/images/icon-down.png";
import upIcon from "../assets/images/icon-up.png";
import ExtraButton from "./ExtraButton";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import { FollowButton } from "./FollowButton";
import { auth } from "src/utils/firebase";
import { useHistory } from "react-router-dom";

// The amount of flags a video needs before we blur it out on frontend
const VIDEO_BLUR_MIN = 1;

interface VideoProps {
  videoInfo: any;
  userRewardPoints: number;
  onRefreshUser?: any;
  isPreview?: boolean;
  onClose?: () => void;
}

// Wrapper to allow us to use the same video component for single previews from
// Profile and Discover, and for all videos in the Feed
export function Video(props: VideoProps) {
  const {
    isPreview = false,
    userRewardPoints,
    onRefreshUser,
    videoInfo,
    onClose = () => {},
  } = props;
  return isPreview ? (
    <div className="preview-container">
      <VideoBase
        isPreview
        userRewardPoints={userRewardPoints}
        videoInfo={videoInfo}
        onClose={onClose}
      />
    </div>
  ) : (
    <VideoBase
      userRewardPoints={userRewardPoints}
      onRefreshUser={onRefreshUser}
      videoInfo={videoInfo}
      onClose={onClose}
    />
  );
}

function VideoBase(props: VideoProps) {
  const {
    videoInfo,
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
  const [videoData, setVideoData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const videoIsFlagged = false; //videoInfo.abuseFlagCount >= VIDEO_BLUR_MIN;

  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisible = useOnScreen(videoRef);

  const handlePlayClick = function () {
    setPlay(!play);
  };

  // Load video and uploader profilePic on first mount.
  useEffect(() => {
    if (!videoInfo) {
      return;
    }
    setIsLoading(true);
    setVideoData(videoInfo.data());
    getFeedVideo(videoInfo.id).then((blobURL) => {
      setVideoSourceURL(blobURL);
      setIsLoading(false);
      // setPlay(true);
    });
    // getVideoInfo(videoInfo.name).then((res) => {
    //   setVideoInfo(res);
    // });
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
  }, [videoInfo?.id]);

  // useEffect(() => {
  //   setPlay(isVisible);
  // }, [isVisible]);

  // Only play video if it has not been flagged/reported
  useEffect(() => {
    if (!videoIsFlagged) {
      play ? videoRef.current?.play() : videoRef.current?.pause();
    }
  }, [play]);

  function handleLike() {
    // like(userId, videoInfo.videoId, !userLikes);
    setUserLikes((state) => !state);
  }

  function handleSuperLike() {
    if (!isSuperLiked) {
      setIsSuperLiked(true);
      // superLike(userId, videoInfo.videoId, true);
    }
  }

  const isCurrentUser = false; //userId === videoInfo.userId;
  const videoBlurStyle = videoIsFlagged ? { filter: "blur(20px)" } : {};

  return (
    <div className="video-container">
      <LoadingIndicator
        loadingMessage="Loading videos..."
        isLoading={isLoading}
      />
      <SuperLikeEffect isActive={isSuperLiked} />
      {isPreview && (
        <button
          onClick={onClose}
          className="close-preview"
          aria-label="close preview"
        />
      )}
      <video
        onClick={handlePlayClick}
        ref={videoRef}
        src={videoSourceURL}
        loop={true}
        muted={true}
        autoPlay={false}
        style={videoBlurStyle}
      />
      <div className="user-details">
        <div style={{ position: "relative", top: "-5px", fontSize: "1.8rem" }}>
          <ProfilePic
            name={videoData?.userId}
            profilePic={userPic}
            clickable={false}
          />
          <img
            style={{ position: "relative", bottom: "40px", marginLeft: "5px" }}
            src={toggleCaption ? upIcon : downIcon}
            alt="Go Back"
            onClick={() => setToggleCaption(!toggleCaption)}
          />
          <Link
            to={isCurrentUser ? `/profile` : `/profiles/${videoData?.userId}`}
          >
            @{videoData?.userEmail.split("@")[0]}
          </Link>
          <span style={{ paddingLeft: "10px" }}>
            <FollowButton isFollowing={false} handleFollow={() => {}} />
          </span>
        </div>
        <div style={{ position: "relative", top: "-250px" }}>
          <div className="uploader-info">
            <div
              className="caption"
              style={{
                display: "block",
                wordWrap: "break-word",
                overflowY: "auto",
                maxHeight: "200px",
              }}
            >
              {toggleCaption && videoData?.caption}
            </div>
          </div>
        </div>
      </div>

      {/* Side controls for user interaction with the video. */}
      <div className="feed-controls">
        <div className="feed-control" id="superlikeButton">
          <SuperLikeButton
            disabled={false} //videoInfo.userId === userId}
            handleSuperLike={handleSuperLike}
            isSuperLiked={isSuperLiked}
          />
          <span>
            {/* currentUser?.remainingSuperlikes ||*/ 0}/
            {/*currentUser?.totalSuperlikes ||*/ 10}
          </span>
        </div>
        <div className="feed-control">
          <SwipeableButton />
          <span style={{ position: "relative", top: "-10px" }}>Pay</span>
        </div>
        <div className="feed-control">
          <img
            onClick={handleLike}
            className={userLikes ? "active" : ""}
            style={{ display: "inline" }}
            src={likeIcon}
            alt="like toggle button"
          />
          <span>
            {videoData &&
              videoData?.likes.length +
                // if they are toggling on and off, only subtract if they are
                // already a liker it and only add if they are not already a liker
                (userLikes
                  ? videoData.likes.includes(auth.currentUser?.uid)
                    ? 0
                    : 1
                  : videoData.likes.includes(auth.currentUser?.uid)
                  ? -1
                  : 0)}
          </span>
        </div>
        <Link to={`/comments/${videoInfo?.id}`}>
          <div className="feed-control">
            <img
              src={commentIcon}
              className={
                videoData &&
                videoData.reviews?.some(
                  (review) => review.split(" ")[0] === auth.currentUser?.uid
                )
                  ? "active"
                  : ""
              }
              alt="icon: review on current video"
            />
            <span>{videoData?.reviews?.length ?? 0}</span>
          </div>
        </Link>
        <div className="feed-control">
          <ShareButton />
          {/* <span>{videoInfo.shares?.length ?? 0}</span> */}
          {/* <span>2</span> */}
        </div>
        <div className="feed-control">
          {/* <FlagButton currentUserId={userId} videoInfo={videoInfo} /> */}
          <FlagButton currentUserId={"userId"} videoInfo={"videoInfo"} />
        </div>
        <div className="feed-control">
          <ExtraButton />
        </div>
      </div>
    </div>
  );
}
