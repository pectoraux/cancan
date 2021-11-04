import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { SignIn } from "./views/SignIn";
import { SignUp } from "./components/SignUp";
// import { useAuth } from "./utils";
import { PrivateRoutes } from "./components/PrivateRoutes";
import { Feed } from "./views/Feed";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext, getUserProfile } from "src/utils";
import jwtDecode from "jwt-decode";
import { decode } from "@dfinity/agent/lib/cjs/idl";
import { auth } from "src/utils";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { User } from "firebase/firebase-auth";

function wrapRouteWithFade(Component) {
  return ({ match }) => (
    <CSSTransition
      in={match != null}
      timeout={300}
      classNames="page-fade"
      unmountOnExit
    >
      <Component />
    </CSSTransition>
  );
}

const user1 = {
  userName: "tepalee",
  uploadedVideos: [
    {
      videoId: "111",
      pic: "https://jpeg.org/images/jpeg-home.jpg",
      url: "https://v16m.tiktokcdn.com/25b03122c5f588431fc587a4258530a3/617da1f5/video/tos/useast2a/tos-useast2a-ve-0068c002/dfd834e567cf4d2bb24ec318714fd291/?a=1233&br=2540&bt=1270&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=202110301349590101890731043B2AF445&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=amVmbjU6ZjNvNzMzNzczM0ApNDQ8ZGloZjtmNzQ7PDtoO2cxZG1tcjRvanNgLS1kMTZzczRjYjMtXmBiMDNjLTYuXzI6Yw%3D%3D&vl=&vr=",
    },
    {
      videoId: "112",
      pic: "https://jpeg.org/images/jpeg-home.jpg",
      url: "https://v77.tiktokcdn.com/48cb969c438afd7146df25270f8cba05/617565bd/video/tos/alisg/tos-alisg-pve-0037c001/451bb1c8f5594762bbca6de79f008c36/?a=1233&br=2564&bt=1282&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=20211024075457010190218201238EE8DB&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=M293MzY6ZmY2ODMzODczNEApNmZlNzk8NTw4N2Y1OGkzZ2dqZmZtcjRnaG5gLS1kMS1zc15iXi5jLS1hLS8wXjJiMDM6Yw%3D%3D&vl=&vr=",
    },
  ],
  likedVideos: [
    {
      videoId: "112",
      pic: "https://jpeg.org/images/jpeg-home.jpg",
      url: "https://v77.tiktokcdn.com/48cb969c438afd7146df25270f8cba05/617565bd/video/tos/alisg/tos-alisg-pve-0037c001/451bb1c8f5594762bbca6de79f008c36/?a=1233&br=2564&bt=1282&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=20211024075457010190218201238EE8DB&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=M293MzY6ZmY2ODMzODczNEApNmZlNzk8NTw4N2Y1OGkzZ2dqZmZtcjRnaG5gLS1kMS1zc15iXi5jLS1hLS8wXjJiMDM6Yw%3D%3D&vl=&vr=",
    },
  ],
  rewards: 10,
  hasPic: false,
  followers: [],
  following: [],
};

const user = {
  userName: "tepa",
  uploadedVideos: [
    {
      videoId: "111",
      pic: "https://jpeg.org/images/jpeg-home.jpg",
      url: "https://v16m.tiktokcdn.com/25b03122c5f588431fc587a4258530a3/617da1f5/video/tos/useast2a/tos-useast2a-ve-0068c002/dfd834e567cf4d2bb24ec318714fd291/?a=1233&br=2540&bt=1270&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=202110301349590101890731043B2AF445&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=amVmbjU6ZjNvNzMzNzczM0ApNDQ8ZGloZjtmNzQ7PDtoO2cxZG1tcjRvanNgLS1kMTZzczRjYjMtXmBiMDNjLTYuXzI6Yw%3D%3D&vl=&vr=",
    },
    {
      videoId: "112",
      pic: "https://jpeg.org/images/jpeg-home.jpg",
      url: "https://v16m.tiktokcdn.com/25b03122c5f588431fc587a4258530a3/617da1f5/video/tos/useast2a/tos-useast2a-ve-0068c002/dfd834e567cf4d2bb24ec318714fd291/?a=1233&br=2540&bt=1270&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=202110301349590101890731043B2AF445&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=amVmbjU6ZjNvNzMzNzczM0ApNDQ8ZGloZjtmNzQ7PDtoO2cxZG1tcjRvanNgLS1kMTZzczRjYjMtXmBiMDNjLTYuXzI6Yw%3D%3D&vl=&vr=",
    },
  ],
  likedVideos: [
    {
      videoId: "112",
      pic: "https://jpeg.org/images/jpeg-home.jpg",
      url: "https://v77.tiktokcdn.com/48cb969c438afd7146df25270f8cba05/617565bd/video/tos/alisg/tos-alisg-pve-0037c001/451bb1c8f5594762bbca6de79f008c36/?a=1233&br=2564&bt=1282&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=20211024075457010190218201238EE8DB&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=M293MzY6ZmY2ODMzODczNEApNmZlNzk8NTw4N2Y1OGkzZ2dqZmZtcjRnaG5gLS1kMS1zc15iXi5jLS1hLS8wXjJiMDM6Yw%3D%3D&vl=&vr=",
    },
  ],
  rewards: 10,
  hasPic: false,
  followers: [user1, user1, user1, user1, user1, user1, user1],
  following: [user1],
};

export function AppRouter() {
  // const {getUser, login, signOut, signUp} = useAuth();
  // console.log(currentUser);
  // const isAuthReady = getFirebase();
  // const user = getAuth().currentUser;
  // const setUser = getAuth().updateCurrentUser;
  // let user = useContext(AuthContext);
  // const logOut = getAuth().signOut;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <LoadingIndicator isLoading={isLoading} loadingMessage="Loading..." />
      {!isLoading && (
        <Switch>
          {/* Root route, decides whether to redirect someone to feed, signup,
            or authorize, based on app state, only when auth client is ready */}
          <Route exact path="/">
            {isAuthenticated ? (
              <Redirect to={{ pathname: "/feed" }} />
            ) : (
              <Redirect to={{ pathname: "/sign-in" }} />
            )}
          </Route>

          <Route path="*">
            {({ location }) => (
              <TransitionGroup>
                <Route exact path="/sign-up">
                  {wrapRouteWithFade(SignUp)}
                </Route>
                <Route exact path="/sign-in">
                  {wrapRouteWithFade(SignIn)}
                </Route>
                <PrivateRoutes
                  location={location}
                  isAuthenticated={isAuthenticated}
                />
              </TransitionGroup>
            )}
          </Route>
        </Switch>
      )}
    </Router>
  );
}
