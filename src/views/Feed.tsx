import React, { useEffect, useState } from "react";
import { getFeedVideos } from "../utils";
import { Video } from "../components/Video";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ProfileInfoPlus, VideoInfo } from "../utils/canister/typings";
import { getAuth } from "@firebase/auth";

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
  url: "https://v16m.tiktokcdn.com/f1b8de7d6eaee56167ee77007aabe13c/617c5f14/video/tos/useast2a/tos-useast2a-pve-0037-aiso/78b0a0a35adb4209a16b3aefab658594/?a=1180&br=3236&bt=1618&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=3&ds=3&er=&ft=98CxdeTw4kag3&l=202110291452210101901851375914446A&lr=tiktok&mime_type=video_mp4&net=0&pl=0&qs=0&rc=anlsdjQ6ZnE6NzMzZjgzM0ApNGc6O2lpNmVnNzVoPDZlZmcwa2RxcjQwYHBgLS1kL2Nzcy4zYF9iMzIvXl9fLS0yMjM6Yw%3D%3D&vl=&vr=",
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
  url: "https://v77.tiktokcdn.com/1842cd5699935cd5b37b6cf6bf392281/617c5f18/video/tos/useast2a/tos-useast2a-ve-0068c004/dbb28874b184497f92d58cdd45b58aa1/?a=1233&br=2678&bt=1339&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=2021102914523001018907202257134BBD&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=M3JnOmc6Zjx3NzMzNzczM0ApO2k4aDU4aWRpNzQzOWUzOmdzNTVgcjQwMl9gLS1kMTZzcy0yLjY2NmBhMzAwM182Y146Yw%3D%3D&vl=&vr=",
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
  const [feed, setFeed] = useState<VideoInf[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // if (profileInfo && profileInfo.userName) {
    if (getAuth().currentUser?.email) {
      setIsLoading(true);
      // getFeedVideos(profileInfo.userName)
      // .then((videos) => {
      setFeed([video1, video2]);
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
            key={v.videoId}
            videoInfo={v}
            userId={getAuth().currentUser?.uid || ""}
            userRewardPoints={Number(profileInfo?.rewards.toString()) || 0}
            onRefreshUser={onRefreshUser}
          />
        ))}
      </div>
    </main>
  );
}
