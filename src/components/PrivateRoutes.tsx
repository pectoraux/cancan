import React, { useContext, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { getUserFromCanister } from "../utils";
import { Feed } from "../views/Feed";
import { Discover } from "../views/Discover";
import { Upload } from "./Upload";
import { UploadProfile } from "./UploadProfile";
import { Rewards } from "../views/Rewards";
import { Profile } from "../views/Profile";
import { DropDayNotification } from "./DropDayNotification";
import { RewardShowerNotification } from "./RewardShowerNotification";
import { MainNav } from "./MainNav";
import { Redirect, Route, Switch } from "react-router-dom";
import { AuthContext } from "src/utils";
// import { getAuth } from "@firebase/auth";
import { auth } from "src/utils/firebase";
import { CreateCollection } from "./CreateCollection";
import { CreateCategory } from "./CreateCategory";
import { Settings } from "./Settings";
import { CreatePartner } from "./CreatePartner";
import { getUserProfile } from "src/utils/canister";
import { NFTickets } from "src/views/NFTickets";
import { Comments } from "./Comments";

function wrapPrivateRouteWithSlide(render) {
  return ({ match }) => (
    <CSSTransition
      in={match != null}
      timeout={250}
      classNames="page-slide"
      unmountOnExit
    >
      <div className="page-slide">{render({ match })}</div>
    </CSSTransition>
  );
}

export function PrivateRoutes({ location, isAuthenticated }) {
  const [userProfile, setUserProfile] = useState<any>({});

  function refreshProfileInfo() {
    getUserProfile(auth.currentUser?.uid!).then((res) => {
      setUserProfile(res);
    });
  }

  useEffect(() => {
    Promise.all([refreshProfileInfo()]);
  }, [userProfile]);

  const privateRoutes = [
    {
      path: "/feed",
      render: () => (
        <Feed profileInfo={userProfile} onRefreshUser={refreshProfileInfo} />
      ),
    },
    { path: "/discover", render: () => <Discover profileInfo={userProfile} /> },
    {
      path: "/upload",
      render: () => <Upload onUpload={refreshProfileInfo} user={userProfile} />,
    },
    {
      path: "/upload_profile",
      render: () => (
        <UploadProfile onUpload={refreshProfileInfo} user={userProfile} />
      ),
    },
    {
      path: "/comments",
      render: () => (
        <Comments onUpload={refreshProfileInfo} user={userProfile} />
      ),
    },
    {
      path: "/create_collection",
      render: () => <CreateCollection user={userProfile} />,
    },
    {
      path: "/create_category",
      render: () => <CreateCategory user={userProfile} />,
    },
    {
      path: "/settings",
      render: () => (
        <Settings
          paywalled={userProfile.paywall}
          followerRequest={userProfile.followerRequest}
        />
      ),
    },
    {
      path: "/create_partner/:partnerId",
      render: ({ match }) => (
        <CreatePartner partnerId={match?.params.partnerId} />
      ),
    },
    {
      path: "/nftickets",
      render: () => <NFTickets currentUser={userProfile} />,
    },
    {
      path: "/profile",
      render: () => <Profile currentUser={userProfile} />,
    },
    {
      path: "/profiles/:userId",
      render: ({ match }) => (
        <Profile key={match?.params.userId} currentUser={userProfile} />
      ),
    },
  ];
  const privatePaths = privateRoutes.map(({ path }) => path);

  return (
    <Route path={privatePaths}>
      {auth.currentUser ? (
        <>
          <DropDayNotification />
          {/* <RewardShowerNotification currentUser={user} /> */}
          <MainNav paths={privatePaths} />

          <Switch location={location}>
            {privateRoutes.map(({ path, render }) => (
              <Route key={path} path={path}>
                {wrapPrivateRouteWithSlide(render)}
              </Route>
            ))}
          </Switch>
        </>
      ) : (
        <Redirect to={{ pathname: "/" }} />
      )}
    </Route>
  );
}
