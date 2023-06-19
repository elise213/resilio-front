import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import LogRegBtn from "./LogRegBtn";
import AliveLogo from "/assets/RESILIO.png"

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const token = sessionStorage.getItem("token");
  let is_org = sessionStorage.getItem("is_org");
  let avatarId = sessionStorage.getItem("avatar");
  let avatar = store.avatarImages[avatarId];
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const location = useLocation();

  useEffect(() => {
    setActiveBtn();
    window.addEventListener("popstate", setActiveBtn); // call setActiveBtn on URL change (back, forward)
    return () => {
      window.removeEventListener("popstate", setActiveBtn); // clean up event listener
    };
  }, [location]); // include location as a dependency

  const handleImageError = (e) => {
    e.target.src = "";
    e.target.className = "nav-profile-icon fa-regular fa-user";
  };

  function setActiveBtn() {
    const navBtns = document.querySelectorAll(".nav-btn");
    const currentUrl = location.pathname;
    navBtns.forEach((btn) => {
      const ancestorLink = btn.closest("a");
      if (ancestorLink) {
        const btnUrl = ancestorLink.getAttribute("href");
        if (btnUrl === currentUrl) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      }
    });
  }

  return (
    <nav className="navbar navbar-expand-lg mb-3" id="navbar">
      {/* Navbar Brand Logo - Link to Home - Always Visible*/}
      <div className="container-fluid">
        <Link to="/">
          <span className="navbar-brand ms-5">
            <img className="navbar-logo" src={AliveLogo}></img>
          </span>
        </Link>

        {/* Dynamic Navbar collapse-expand */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          {!isExpanded ? <i className="fa-solid fa-bars navbar-toggler-icon"></i> : <span className="navbar-toggler-icon">X</span>}
        </button>
        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
          style={{ flexGrow: "0" }}
        >

          {/* Link to general resource search - Always visible */}
          <div className="my-navbar-items">
            {/* <Link to="/">
              <span className="btn nav-btn">
                RESOURCE MAP
              </span>
            </Link> */}
            {/* FREE STUFF - Always visible */}
            {/* <Link to="/offerings" >
              <span className="btn nav-btn">
                FREE STUFF
              </span>
            </Link> */}
            {/* <Link to="/contact">
              <span className="btn nav-btn">
                CONTACT
              </span>
            </Link> */}

            {/* DONATE - Always visible */}
            {/* <Link to="/donate">
              <span className="btn nav-btn">
                DONATE
              </span>
            </Link> */}
            {/* Link to Create Resource - Only visible when logged in as an Organization */}
            {/* {token && is_org == "true" ? (
              <Link to="/createResource">
                <span className="btn nav-btn">
                  CREATE NEW LISTING
                </span>
              </Link>
            ) : (
              ""
            )} */}
            {/* Logout- Only visible when logged in, Login/ Register- Only visible when NOT logged in */}
            {/* {token ? (
              <span className="btn nav-btn" onClick={() => actions.logout()}>
                LOGOUT
              </span>
            ) : (
              <span className="btn nav-btn">
                <LogRegBtn />
              </span>
            )} */}
            {/* Link to profile page - Only visible when logged in r*/}

            {/* {token ? (
              <Link to="/userProfile">
                <i
                  className={`${avatar} nav-profile-icon`}
                />
              </Link>
            ) : null} */}
          </div>
        </div>
      </div>
    </nav >
  );
};
