import React, { PropsWithRef, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { ProfileInfoPlus, VideoInfo } from "../utils/canister/typings";
import { SearchVideoItem } from "../components/SearchVideoItem";
import { Video } from "../components/Video";
import { getSearchVideos } from "../utils";
import { LoadingIndicator } from "../components/LoadingIndicator";
import "./Discover.scss";

interface DiscoverProps {
  profileInfo?: ProfileInfoPlus;
}

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
  url: "https://v77.tiktokcdn.com/55c9d85f656c1404c681bc30785533c8/616f43ba/video/tos/useast2a/tos-useast2a-ve-0068c001/420485df678b461f9fb6cc5583f08942/?a=1233&br=3842&bt=1921&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=202110191616100101901920205715F222&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=amlxNWk6ZnNwODMzNzczM0ApOWdpMzw2NDtnNzk6ZTloNGczcGRicjRvYmpgLS1kMTZzc2AwMi4zLWNjMzExX2BjLTY6Yw%3D%3D&vl=&vr=",
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
  url: "https://v77.tiktokcdn.com/7dc7b71adee5f8dcb45c4ca4f0cd8fdc/616f56b3/video/tos/useast2a/tos-useast2a-pve-0068/56358375d3e74df9bfc69785a84d43e4/?a=1233&br=2070&bt=1035&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=202110191737070101890362005C055CEC&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=anZpc2c6ZjlyNzMzNzczM0ApPGk6N2g5Mzw8NzppZDg1ZGdscm1rcjQwYS1gLS1kMTZzczI1Xi4wNGIuNC41M2EuMTI6Yw%3D%3D&vl=&vr=",
};

/*
 * Allows searching for and viewing videos. Nothing especially fancy here, just
 * the typical debounced input fetching data on change.
 */
export function Discover(props: PropsWithRef<DiscoverProps>) {
  const { profileInfo } = props;

  const [videos, setVideos] = useState<VideoInf[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoPreview, setVideoPreview] = useState<VideoInf>();
  const [isLoading, setLoading] = useState(false);

  function handleChange(val: string) {
    setSearchTerm(val);
  }

  useEffect(() => {
    if (profileInfo) {
      setLoading(true);
      // getSearchVideos(profileInfo.userName, searchTerm.split(/\W+/), [10]).then(
      //   (searchedVideos) => {
      setVideos([video1, video2]);
      setLoading(false);
      // }
      // );
    }
  }, [searchTerm, profileInfo]);

  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedChangeHandler = debounce(function () {
    handleChange(searchRef?.current?.value || "");
  }, 300);

  function handleClick(clickedVideo: VideoInf) {
    setVideoPreview(clickedVideo);
  }

  return (
    <main id="discover">
      <LoadingIndicator
        loadingMessage="Loading videos..."
        isLoading={isLoading}
      />
      {videoPreview && profileInfo !== undefined && (
        <></>
        // <Video
        //   userId={profileInfo.userName}
        //   userRewardPoints={Number(profileInfo.rewards.toString())}
        //   videoInfo={videoPreview}
        //   isPreview={true}
        //   onClose={() => setVideoPreview(undefined)}
        //   key={videoPreview.videoId}
        // />
      )}

      <div className="search-container">
        <label hidden htmlFor="search">
          Search
        </label>
        <span className="search-icon" />
        <input
          onChange={debouncedChangeHandler}
          ref={searchRef}
          type="text"
          name="search"
          id="search"
          placeholder="Search"
        />
      </div>
      <div className="featured-container">
        {searchTerm ? (
          <section className="video-list search">
            {videos.length > 0 &&
              videos.map((v) => (
                <SearchVideoItem
                  key={v.videoId + "-search"}
                  onClick={handleClick}
                  video={v}
                />
              ))}
          </section>
        ) : (
          <>
            <section className="new-uploads">
              <span className="post-text">Tags</span>
              <div className="video-list">Tag</div>
            </section>
            <section className="new-uploads">
              <span className="post-text">New for you</span>
              <div className="video-list">
                {videos.length > 0 &&
                  videos.map((v) => (
                    <SearchVideoItem
                      key={v.videoId + "-newUploads"}
                      onClick={handleClick}
                      video={v}
                    />
                  ))}
              </div>
            </section>
            <section className="viral">
              <span className="post-text">Trending</span>
              <div className="video-list">
                {videos.length > 0 &&
                  videos.map((v) => (
                    <SearchVideoItem
                      key={v.videoId + "-viral"}
                      onClick={handleClick}
                      video={v}
                    />
                  ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
