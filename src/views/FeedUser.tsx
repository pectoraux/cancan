import React, { useEffect, useState } from "react";
import { getFeedVideos, getVideosFromUser } from "../utils";
import { Video } from "../components/Video";
import { LoadingIndicator } from "../components/LoadingIndicator";
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
export function FeedUser({
  userId,
  onRefreshUser,
}: {
  userId: string;
  profileInfo?: any;
  onRefreshUser: any;
}) {
  const [feed, setFeed] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileInfo, setProfileInfo] = useState<any>();
  const [videoPreview, setVideoPreview] = useState<any>(true);
  const history = useHistory();
  const { goBack } = useHistory();

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      getVideosFromUser(userId)
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
  }, [userId]);

  return (
    <main>
      <LoadingIndicator
        loadingMessage="Not following any channels"
        completedMessage="Videos loaded"
        isLoading={isLoading}
      />
      <div className="feed">
        {!isLoading && feed && feed?.length === 0 ? (
          <div
            className="LoadingContainerContent"
            style={{ position: "relative", top: "300px" }}
          >
            <Link to={"/profile"}>
              <h2>
                No videos uploaded by this partner. <br /> Go back!
              </h2>
            </Link>
          </div>
        ) : (
          feed.map((v) => (
            <Video
              key={v.id}
              isPreview={true}
              onClose={goBack}
              videoInfo={v}
              userRewardPoints={0}
              onRefreshUser={onRefreshUser}
            />
          ))
        )}
      </div>
    </main>
  );
}
