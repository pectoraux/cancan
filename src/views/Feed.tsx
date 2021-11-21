import React, { useEffect, useState } from "react";
import { getFeedVideos, getVideosInfo } from "../utils";
import { Video } from "../components/Video";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ProfileInfoPlus, VideoInfo } from "../utils/canister/typings";
import "../components/LoadingIndicator.scss";
import { auth } from "src/utils/firebase";
import { TopNav } from "src/components/TopNav";
import { getUserProfile } from "src/utils/canister";
import { Link, useParams, useHistory } from "react-router-dom";

type ProfileByIdParams = {
  userId: string;
};

/*
 * Nothing fancy here, either!
 */
export function Feed({
  onRefreshUser,
}: {
  profileInfo?: any;
  onRefreshUser: any;
}) {
  const [feed, setFeed] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileInfo, setProfileInfo] = useState<any>();

  useEffect(() => {
    if (profileInfo && profileInfo?.following) {
      setIsLoading(true);
      getVideosInfo()
        .then((vInfo) => {
          var videosInfo = Array<any>();
          vInfo?.map((videoInfo) => {
            videosInfo.push(videoInfo);
          });
          setFeed(videosInfo);
        })
        .catch((e) => {
          console.error(e);
        });
      setIsLoading(false);
    } else {
      getUserProfile(auth.currentUser?.uid!).then((user) => {
        if (user) {
          setProfileInfo(user);
        }
      });
    }
  }, [profileInfo, profileInfo?.following]);

  return (
    <main>
      <LoadingIndicator
        loadingMessage="Not following any channels"
        completedMessage="Videos loaded"
        isLoading={isLoading}
      />
      <TopNav />
      <div className="feed">
        {feed.map((v) => (
          <Video
            key={v.id}
            videoInfo={v}
            userRewardPoints={0}
            profileInfo={profileInfo}
          />
        ))}
      </div>
    </main>
  );
}
