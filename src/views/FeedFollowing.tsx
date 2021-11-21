import React, { useEffect, useState } from "react";
import { getFeedVideos, getVideosInfo } from "../utils";
import { Video } from "../components/Video";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ProfileInfoPlus, VideoInfo } from "../utils/canister/typings";
import "../components/LoadingIndicator.scss";
import { auth } from "src/utils/firebase";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import { TopNav } from "src/components/TopNav";
import { getUserProfile } from "src/utils/canister";
import { Link } from "react-router-dom";

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
  url: "https://v77.tiktokcdn.com/4ef84321231ff2293f678e8b995b7f0c/618aba50/video/tos/useast2a/tos-useast2a-ve-0068c001/ea900decb74c427a89374f03ffac934e/?a=1233&br=2220&bt=1110&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=wZ~R.FhUkag3-I&l=202111091213200101902182260C06D23E&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=MzN2dWQ6Zjl3NzMzNzczM0ApOjtpO2hnODw5N2Y2aTU1aWcuaXFscjQwaGdgLS1kMTZzc18uLTZhLWMxLzJhYi00M2E6Yw%3D%3D&vl=&vr=",
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
  url: "https://v16m.tiktokcdn.com/07dd7c60378ba486e7ac986ef5782133/618ab9cc/video/tos/useast2a/tos-useast2a-pve-0068/afe3e6a4ffcc4da3a1c905dd8af30835/?a=1233&br=1182&bt=591&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=wZ~R.FhUkag3-I&l=202111091211130101890730455D06BFA5&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=amU8PDQ6ZjZqNzMzNzczM0ApOjdlZTszPGQ4N2hlM2Y4OmcyZTVucjRvb21gLS1kMTZzc14zMTNeMV5gLmI0XmEtL2I6Yw%3D%3D&vl=&vr=",
};

/*
 * Nothing fancy here, either!
 */
export function FeedFollowing({
  onRefreshUser,
}: {
  profileInfo?: any;
  onRefreshUser: any;
}) {
  const [feed, setFeed] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileInfo, setProfileInfo] = useState<any>();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (profileInfo && profileInfo?.following) {
      setIsLoading(true);
      getVideosInfo(profileInfo.following, true)
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
        {profileInfo && profileInfo?.following.length === 0 ? (
          <div
            className="LoadingContainerContent"
            style={{ position: "relative", top: "300px" }}
          >
            <Link to={"/feed"}>
              <h2>
                Not Following any channels yet.
                <br />
                Click to discover new channels
              </h2>
            </Link>
          </div>
        ) : (
          feed.map((v) => (
            <Video
              key={v.id}
              videoInfo={v}
              userRewardPoints={0}
              profileInfo={profileInfo}
            />
          ))
        )}
      </div>
    </main>
  );
}
