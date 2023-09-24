import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import Login from "./Login";
import Logo from "/assets/RESILIOO.png";
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
  // const location = useLocation();
  const handleImageError = (e) => {
    e.target.src = "";
    e.target.className = "nav-profile-icon fa-regular fa-user";
  };

  // useEffect(() => {
  //   setActiveBtn();
  //   window.addEventListener("popstate", setActiveBtn);
  //   return () => {
  //     window.removeEventListener("popstate", setActiveBtn);
  //   };
  // }, [location]);

  // function setActiveBtn() {
  //   const navBtns = document.querySelectorAll(".nav-btn");
  //   const currentUrl = location.pathname;
  //   navBtns.forEach((btn) => {
  //     const ancestorLink = btn.closest("a");
  //     if (ancestorLink) {
  //       const btnUrl = ancestorLink.getAttribute("href");
  //       if (btnUrl === currentUrl) {
  //         btn.classList.add("active");
  //       } else {
  //         btn.classList.remove("active");
  //       }
  //     }
  //   });
  // }

  return (
    <nav className="navbar">

      <span onClick={() => {
        window.location.href = "/";
        actions.setBoundaryResults(null);
      }}>
        {/* <img className="navbar-logo" src={Logo} alt="Alive Logo" /> */}
      </span>
      <Login />
    </nav >
  );
}

export default Navbar;