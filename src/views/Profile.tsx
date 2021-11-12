import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import * as H from "history";
import { FollowUserRow } from "../components/FollowUserRow";
import { ChannelRow } from "../components/ChannelRow";
import { ProfilePic } from "../components/ProfilePic";
import { Video } from "../components/Video";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { FollowButton } from "../components/FollowButton";
import { PartnerRow } from "../components/PartnerRow";
import {
  fileToImgSrc,
  follow,
  getProfilePic,
  getUserProfile,
  getVideoInfo,
  getFeedVideo,
  formatBigNumber,
} from "../utils";
import backIcon from "../assets/images/icon-back.png";
import "./Profile.scss";
import { ProfileInfoPlus, VideoInfo } from "../utils/canister/typings";
// import { getAuth } from "@firebase/auth";
import { auth } from "src/utils/firebase";
import Select from "react-select";
import { PartnerButton } from "src/components/PartnerButton";

type ProfileByIdParams = {
  userId: string;
};

/*
 * Nothing specific to the IC going on here, just fetching data as per usual.
 * This file does a lot of view juggling based on a lot of currentUser data.
 * There are 2 primary views: viewing another user or viewing yourself.
 * There are 4 secondary views: a list of uploaded videos, list of followers,
 * list of users the user follows, and a video preview of any uploaded videos.
 */
export function Profile({ currentUser }) {
  const { userId = currentUser?.uid } = useParams<ProfileByIdParams>();
  const [activeSubView, setActiveSubView] = useState(0);
  const history = useHistory();
  const { goBack } = useHistory();

  const [userProfile, setUserProfile] = useState<any>();
  const [profilePic, setProfilePic] = useState("");
  const [videoPreview, setVideoPreview] = useState<any>();
  const [isLoading, setLoading] = useState(false);

  const currentUserFollows = [];
  // currentUser?.following.map(({ userName }) => userName) || [];
  const initialIsFollowed = false;
  // currentUserFollows.indexOf(userId || "") !== -1;
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed);
  const [actions, setActions] = useState([{ label: "Collections", value: 0 }]);
  const [gender, setGender] = useState([
    { label: "Genders", value: 0 },
    { label: "Male", value: 1 },
    { label: "Female", value: 2 },
  ]);
  const [categories, setCategories] = useState([
    { label: "Categories", value: 0 },
  ]);
  const [selectedOption, setSelectedOption] = useState<string>("Collections");
  const [selectedOption2, setSelectedOption2] = useState<string>("Categories");
  const [selectedOption3, setSelectedOption3] = useState<string>("Genders");

  const isCurrentUserProfile = !userId || userId === auth.currentUser?.uid;

  function handleShowVideoPreview(videoId: string) {
    getFeedVideo(videoId).then((res) => {
      setVideoPreview(res);
    });
  }

  async function fetchUserProfile() {
    const currentUserId = userId ? userId : auth.currentUser?.uid;
    try {
      setLoading(true);
      await getUserProfile(currentUserId).then((res) => {
        setUserProfile(res);
        let arr = [{ label: "Collections", value: 0 }];
        let arr2 = [{ label: "Categories", value: 0 }];
        res?.collectionNames?.map((val, idx) => {
          arr.push({ label: val, value: idx });
        });
        res?.categories?.map((val, idx) => {
          arr2.push({ label: val, value: idx });
        });
        setActions(arr);
        setCategories(arr2);
        setSelectedOption(arr[0].label);
        setSelectedOption2(arr2[0].label);
      });
    } catch (error) {
      console.error(
        `Failed to retrieve profile for user ${currentUserId}`,
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfilePic() {
    try {
      const picData = await getProfilePic(userId || "");
      if (picData !== null) {
        const imgSrc = fileToImgSrc("");
        setProfilePic(imgSrc);
      } else {
        console.info(`No profile pic set for user ${userId}`);
      }
    } catch (error) {
      console.error("Failed to retrieve profilePic.", error);
    }
  }

  useEffect(() => {
    Promise.all([fetchUserProfile(), fetchProfilePic()]);
  }, []);

  function handleFollow(userToFollow: string, willFollow: boolean) {
    follow(userToFollow, currentUser?.userName || "", willFollow);
  }

  function handleFollowCurrent() {
    setIsFollowed((state) => !state);
    // handleFollow(userName, !isFollowed);
  }

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isSelected ? "grey" : "black",
      padding: 2,
      "&:hover": {
        backgroundColor: "#b0eff556",
      },
    }),
    control: (base) => ({
      width: 400,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

  // @ts-ignore
  const {
    userName = "",
    partners = [],
    collectionNames = [],
    uploadedVideos = [],
    followers = [],
    following = [],
  } = userProfile ?? {};
  return (
    <>
      {!isCurrentUserProfile && (
        <header style={{ position: "absolute", top: "30px" }} id="alt-header">
          <button id="back" onClick={goBack}>
            <img src={backIcon} alt="Go Back" />
          </button>
        </header>
      )}
      <main>
        <LoadingIndicator
          loadingMessage="Loading profile..."
          isLoading={isLoading}
        />
        {videoPreview && (
          <Video
            userId={userId}
            userRewardPoints={0}
            videoInfo={videoPreview}
            isPreview={true}
            onClose={() => setVideoPreview("")}
            key={videoPreview}
          />
        )}
        <div className="profile-header">
          <ProfilePic name={userId} profilePic={profilePic} />
          <h2>
            <span>{userProfile?.email}</span>
            <br />
            {isCurrentUserProfile ? (
              <>
                <button
                  className="btn-link"
                  style={{ fontSize: "1.4rem" }}
                  onClick={() => {
                    auth.signOut();
                    history.push("/sign-in");
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <FollowButton
                isFollowing={isFollowed}
                handleFollow={handleFollowCurrent}
              />
            )}
          </h2>
          <section className="profile-nav">
            {[
              ["Partners", partners?.length || 0],
              ["Videos", uploadedVideos?.length || 0],
              ["Followers", followers?.length || 0],
              ["Following", following?.length || 0],
            ].map(([label, count], index) => (
              <ProfileNavLink
                key={label}
                onClick={() => setActiveSubView(index)}
                isActive={index === activeSubView}
                label={label}
                count={count}
              />
            ))}
          </section>
        </div>
        {activeSubView === 0 && (
          <>
            <h2 style={{ textAlignLast: "center", textAlign: "center" }}>
              {!categories[0] ? (
                "Create a category to be able to get partners"
              ) : (
                <Select
                  placeholder={selectedOption2}
                  components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: () => {
                      return (
                        <div
                          style={{
                            position: "relative",
                            top: "-22px",
                            marginLeft: "260px",
                            width: "0",
                            height: "0",
                            borderLeft: "7px solid transparent",
                            borderRight: "7px solid transparent",
                            borderTop: "7px solid grey",
                          }}
                        >
                          {" "}
                        </div>
                      );
                    },
                  }}
                  styles={customStyles}
                  onChange={(val) => {
                    setSelectedOption2(val?.label || "Category");
                  }}
                  options={categories}
                  menuPlacement="top"
                  classNamePrefix="select"
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary: "white",
                      neutral80: "grey",
                    },
                  })}
                />
              )}
            </h2>
            {selectedOption2 === "Categories" && (
              <>
                <div className="create">
                  {!isCurrentUserProfile ? (
                    <Link to="/create_category">
                      <button
                        className="primary"
                        style={{ height: "40px", marginBottom: "10px" }}
                      >
                        Create new category!
                      </button>
                    </Link>
                  ) : (
                    <Link to="/create_partner">
                      <button
                        className="primary"
                        style={{
                          height: "40px",
                          width: "300px",
                          marginBottom: "10px",
                        }}
                      >
                        Create partner request!
                      </button>
                    </Link>
                  )}
                </div>
                <div className="Categories"></div>
              </>
            )}
            {selectedOption2 !== "Categories" && (
              <section className="partners">
                {partners.length > 0 ? (
                  <div style={{ overflowY: "scroll", height: "180px" }}>
                    {partners.map((partner) => (
                      <PartnerRow
                        key={partner.split(" ")[1]}
                        partnerId={partner.split(" ")[1]}
                        partnerEmail={partner.split(" ")[0]}
                        handleFollow={handleFollow}
                        following={false}
                        disableFollow={false}
                        // following={currentUserFollows.includes(partner.userName)}
                        // disableFollow={partner.userName === currentUser?.userName}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="no-results">No partners yet!</div>
                )}
              </section>
            )}
          </>
        )}

        {activeSubView === 1 && (
          <>
            <h2 style={{ textAlignLast: "center", textAlign: "center" }}>
              {!collectionNames[0] ? (
                "Create a collection to be able to upload a video"
              ) : (
                <Select
                  placeholder={selectedOption}
                  components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: () => {
                      return (
                        <div
                          style={{
                            position: "relative",
                            top: "-22px",
                            marginLeft: "260px",
                            width: "0",
                            height: "0",
                            borderLeft: "7px solid transparent",
                            borderRight: "7px solid transparent",
                            borderTop: "7px solid grey",
                          }}
                        >
                          {" "}
                        </div>
                      );
                    },
                  }}
                  styles={customStyles}
                  onChange={(val) => {
                    setSelectedOption(val?.label || "Collections");
                  }}
                  options={actions}
                  menuPlacement="top"
                  classNamePrefix="select"
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary: "white",
                      neutral80: "grey",
                    },
                  })}
                />
              )}
            </h2>
            {selectedOption === "Collections" && (
              <>
                <div className="create">
                  {isCurrentUserProfile && (
                    <Link to="/create_collection">
                      <button
                        className="primary"
                        style={{ height: "40px", marginBottom: "10px" }}
                      >
                        Create new collection!
                      </button>
                    </Link>
                  )}
                </div>
                <div className="collections"></div>
              </>
            )}
            {selectedOption !== "Collections" && (
              <section className="profile-videos">
                {uploadedVideos.length > 0 ? (
                  uploadedVideos.map((uploadedVideo) => (
                    <img
                      key={uploadedVideo.split(" ")[0]}
                      src={fileToImgSrc(uploadedVideo.split(" ")[3])}
                      alt={`${
                        uploadedVideo.split(" ")[1] -
                        uploadedVideo.split(" ")[2]
                      }`}
                      role="button"
                      onClick={() =>
                        handleShowVideoPreview(uploadedVideo.split(" ")[0])
                      }
                    />
                  ))
                ) : (
                  <div className="no-results">
                    No videos yet
                    {isCurrentUserProfile && collectionNames.length > 0 && (
                      <Link to="/upload">
                        <button className="primary">Upload one now!</button>
                      </Link>
                    )}
                  </div>
                )}
              </section>
            )}
          </>
        )}
        {activeSubView === 2 && (
          <>
            <h2 style={{ textAlignLast: "center", textAlign: "center" }}>
              <Select
                placeholder={selectedOption3}
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator: () => {
                    return (
                      <div
                        style={{
                          position: "relative",
                          top: "-22px",
                          marginLeft: "260px",
                          width: "0",
                          height: "0",
                          borderLeft: "7px solid transparent",
                          borderRight: "7px solid transparent",
                          borderTop: "7px solid grey",
                        }}
                      >
                        {" "}
                      </div>
                    );
                  },
                }}
                styles={customStyles}
                onChange={(val) => {
                  setSelectedOption3(val?.label || "Gender");
                }}
                options={gender}
                menuPlacement="top"
                classNamePrefix="select"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary: "white",
                    neutral80: "grey",
                  },
                })}
              />
            </h2>
            <section className="followers">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <FollowUserRow
                    key={follower.userName}
                    userName={follower.userName}
                    handleFollow={handleFollow}
                    following={false}
                    // following={currentUserFollows.includes(follower.userName)}
                    disableFollow={follower.userName === currentUser?.userName}
                  />
                ))
              ) : (
                <div
                  className="no-results"
                  style={{ position: "relative", top: "-50px" }}
                >
                  No followers yet!
                </div>
              )}
            </section>
          </>
        )}
        {activeSubView === 3 && (
          <section className="following">
            {following.length > 0 ? (
              following.map((following) => (
                <FollowUserRow
                  key={following.userName}
                  userName={following.userName}
                  handleFollow={handleFollow}
                  following={false}
                  // following={currentUserFollows.includes(following.userName)}
                  disableFollow={following.userName === currentUser?.userName}
                />
              ))
            ) : (
              <div className="no-results">Not following anyone yet!</div>
            )}
          </section>
        )}
      </main>
    </>
  );
}

function ProfileNavLink({ isActive, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`btn-link${isActive ? " active" : ""}`}
    >
      <div className="nav-count">{formatBigNumber(count)}</div>
      <span>{label}</span>
    </button>
  );
}
