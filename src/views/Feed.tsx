import React, { useEffect, useState } from "react";
import { getFeedVideos } from "../utils";
import { Video } from "../components/Video";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ProfileInfoPlus, VideoInfo } from "../utils/canister/typings";
// import { getAuth } from "@firebase/auth";
import { auth } from "src/utils/firebase";
import firebase from "firebase";

interface VideoInf {
  userId: string;
  name: string;
  createdAt: number;
  tags: Array<string>;
  likes: Array<string>;
  viewCount: number;
  caption: string;
  chunkCount: number;
  superLikes: Array<string>;
  uploadedAt: number;
  videoId: string;
  url: string;
}
const video1 = {
  userId: "tepa",
  name: "my video1",
  createdAt: 12234,
  tags: [],
  likes: [],
  viewCount: 19,
  caption: "my best video1 caption",
  chunkCount: 10,
  superLikes: [],
  uploadedAt: 12234,
  videoId: "111",
  url: "https://firebasestorage.googleapis.com/v0/b/tiktok-a2bdb.appspot.com/o/videos%2FTiJUcyMJ9cCSv5DZoJrl?alt=media&token=72c9aff3-70c4-4b44-9551-f554f2e39162",
};
const video2 = {
  userId: "tepa",
  name: "my video2",
  createdAt: 12235,
  tags: [],
  likes: [],
  viewCount: 12,
  caption: "my best video1 caption",
  chunkCount: 10,
  superLikes: [],
  uploadedAt: 12235,
  videoId: "112",
  url: "https://v16m.tiktokcdn.com/25b03122c5f588431fc587a4258530a3/617da1f5/video/tos/useast2a/tos-useast2a-ve-0068c002/dfd834e567cf4d2bb24ec318714fd291/?a=1233&br=2540&bt=1270&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=202110301349590101890731043B2AF445&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=amVmbjU6ZjNvNzMzNzczM0ApNDQ8ZGloZjtmNzQ7PDtoO2cxZG1tcjRvanNgLS1kMTZzczRjYjMtXmBiMDNjLTYuXzI6Yw%3D%3D&vl=&vr=",
};

/*
 * Nothing fancy here, either!
 */
export function Feed({
  profileInfo,
  onRefreshUser,
}: {
  profileInfo?: ProfileInfoPlus;
  onRefreshUser: any;
}) {
  const [feed, setFeed] = useState<firebase.storage.Reference[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // if (profileInfo && profileInfo.userName) {
    if (auth.currentUser?.email) {
      setIsLoading(true);
      getFeedVideos("tepa").then((videos) => {
        console.log("videos");
        console.log(videos[0]);
        setFeed(videos);
      });
      setIsLoading(false);
      // })
      // .catch((e) => {
      //   console.error(e);
      //   setIsLoading(false);
      // });
    }
  });

  return (
    <main>
      <LoadingIndicator
        loadingMessage="Loading videos..."
        completedMessage="Videos loaded"
        isLoading={isLoading}
      />
      <div className="feed">
        {feed.map((v) => (
          <Video
            key={v.name}
            videoInfo={v}
            userId={auth.currentUser?.uid || ""}
            userRewardPoints={0}
            onRefreshUser={onRefreshUser}
          />
        ))}
      </div>
    </main>
  );
}
