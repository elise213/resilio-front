import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import Login from "./Login";
import RESR from "/assets/hiddencity.png";
import styles from "../styles/navbar.css";

const Navbar = () => {
  const { store, actions } = useContext(Context);
  const token = sessionStorage.getItem("token");
  let is_org = sessionStorage.getItem("is_org");
  let avatarId = sessionStorage.getItem("avatar");
  let avatar = store.avatarImages[avatarId];
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleImageError = (e) => {
    e.target.src = "";
    e.target.className = "nav-profile-icon fa-regular fa-user";
  };

  return (
    <nav className="navbar">
      {/* <Link to="/" className="home-navbar">
        Home
      </Link> */}
      <div className="login-div">
        <Login />
      </div>
      <div className="logo-div">
        <img className="navbar-logo" src={RESR} alt="Alive Logo" />
      </div>
    </nav>
  );
};

export default Navbar;
