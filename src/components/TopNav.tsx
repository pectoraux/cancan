import React from "react";
import { Link, NavLink } from "react-router-dom";
import homeIcon from "../assets/images/icon-home.png";
import discoverIcon from "../assets/images/icon-discover.png";
import uploadIcon from "../assets/images/icon-upload.png";
import heartIcon from "../assets/images/icon-heart.png";
import profileIcon from "../assets/images/icon-tokens.png";
import FavoriteIcon from "@material-ui/icons/Favorite";
import "./MainNav.scss";

function getPathRoot(path) {
  return path.split("/")[1];
}

export function TopNav({}) {
  function setDestination(destination) {
    const index = 0;
    const currentIndex = 0;

    function onClick() {
      const destinationIndex = index;
      const value = currentIndex > destinationIndex ? -100 : 100;
      document.getElementById(
        "slide-direction"
      )!.innerHTML = `.page-slide { --inDirection: ${value}%; }`;
    }

    return { to: destination, onClick };
  }

  return (
    <nav id="main-nav" style={{ position: "relative", top: "30px" }}>
      <style id="slide-direction" />
      <div className="nav-item" style={{ paddingLeft: "30px" }}>
        <NavLink {...setDestination("/feed_following")}>
          <img
            aria-label="Discover"
            src={heartIcon}
            alt="Discover"
            role="button"
            width={20}
          />
        </NavLink>
      </div>
      <div className="nav-item" style={{ paddingRight: "30px" }}>
        <NavLink {...setDestination("/feed")}>
          <img
            aria-label="Discover"
            src={profileIcon}
            alt="Discover"
            role="button"
            width={20}
          />
        </NavLink>
      </div>
    </nav>
  );
}
