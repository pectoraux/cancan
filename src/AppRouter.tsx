import React, { useContext } from "react";
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext, getFirebase } from "src/utils";

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
      url: "https://v16m.tiktokcdn.com/da74d58cebaab752485c30be1a8ca883/617565b5/video/tos/alisg/tos-alisg-pve-0037c001/519d18f8fe7f4c018f2d81b2ecf06a56/?a=1233&br=2364&bt=1182&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=202110240754460101901860444E906C4A&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=ajprNDs6ZnBlNzMzODczNEApPDY0NmgzZGQzN2kzODk4O2dgZjBjcjQwNHJgLS1kMS1zc2MzYS1iMS4tMmFfNDMuNGA6Yw%3D%3D&vl=&vr=",
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
      url: "https://v16m.tiktokcdn.com/da74d58cebaab752485c30be1a8ca883/617565b5/video/tos/alisg/tos-alisg-pve-0037c001/519d18f8fe7f4c018f2d81b2ecf06a56/?a=1233&br=2364&bt=1182&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=98CxdeTw4kag3&l=202110240754460101901860444E906C4A&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=ajprNDs6ZnBlNzMzODczNEApPDY0NmgzZGQzN2kzODk4O2dgZjBjcjQwNHJgLS1kMS1zc2MzYS1iMS4tMmFfNDMuNGA6Yw%3D%3D&vl=&vr=",
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
  followers: [user1, user1, user1, user1, user1, user1, user1],
  following: [user1],
};

export function AppRouter() {
  // const {getUser, login, signOut, signUp} = useAuth();
  // console.log(currentUser);
  const isAuthReady = getFirebase();
  // const user = getAuth().currentUser;
  // const setUser = getAuth().updateCurrentUser;
  let user = useContext(AuthContext);
  const isAuthenticated = user != null;
  // const logOut = getAuth().signOut;
  return (
    <Router>
      <Switch>
        {/* Root route, decides whether to redirect someone to feed, signup,
            or authorize, based on app state, only when auth client is ready */}
        <Route exact path="/">
          user ? (
          <Redirect to={{ pathname: "/feed" }} />
          ) :
          <Redirect to={{ pathname: "/sign-in" }} />
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
                user={user}
                isAuthenticated={getAuth().currentUser}
                setUser={() => {}}
                logOut={() => {}}
              />
            </TransitionGroup>
          )}
        </Route>
      </Switch>
    </Router>
  );
}
