import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/navbar2.css";
import { Context } from "../store/appContext";
import Login from "./Login";
import Contact from "../component/Contact";
import EmailList from "../component/EmailList";
import ErrorBoundary from "../component/ErrorBoundary";
import Selection from "./Selection";

const Navbar2 = ({
  isDeckOpen,
  isNavOpen,
  isFavoritesOpen,
  isToolBoxOpen,
  setIsDeckOpen,
  setIsNavOpen,
  setIsToolBoxOpen,
  setIsFavoritesOpen,
  toggleNav,
  setOpenLoginModal,
}) => {
  const { store, actions } = useContext(Context);

  const [showContactModal, setShowContactModal] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(store.isLargeScreen);

  useEffect(() => {
    setIsLargeScreen(store.isLargeScreen);
  }, [store.isLargeScreen]);

  const toggleContactModal = () => {
    setShowContactModal(!showContactModal);
  };

  useEffect(() => {
    // if (!isLargeScreen) {
    const handleClickOutside = (event) => {
      const nav = document.querySelector(".new-navbar");
      if (nav && !nav.contains(event.target) && isNavOpen) {
        setIsNavOpen(false);
      }
      // };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    };
  }, [isNavOpen]);

  useEffect(() => {
    const body = document.body;
    if (isNavOpen || showContactModal) {
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
    }
  }, [isNavOpen, showContactModal]);

  return (
    <>
      <div className="nav-container">
        <nav className={`new-navbar ${isNavOpen ? "open-nav" : ""}`}>
          <div
            onClick={toggleNav}
            className={`open-icon-nav ${
              !isFavoritesOpen && !isToolBoxOpen && !isNavOpen && !isDeckOpen
                ? "closed"
                : ""
            }`}
          >
            <i className="fas fa-bars"></i>
          </div>
          <div
            onClick={toggleNav}
            className={`close-icon-nav ${isNavOpen ? "open-nav" : ""}`}
          >
            <i className="fa-solid fa-x"></i>
          </div>
          {/* </div> */}

          <div className={`navbar-content ${isNavOpen ? "open-nav" : ""}`}>
            {/* <img
              src="/assets/RESILIOO.png"
              alt="Resilio Logo"
              className="navbar-logo"
            /> */}
            <div className="split-nav">
              <div className="nav-list">
                <span
                  className="nav-item"
                  onClick={() => {
                    setIsNavOpen(false);
                  }}
                >
                  ABOUT
                </span>
                <span
                  className="nav-item"
                  onClick={() => {
                    setIsNavOpen(false);
                    toggleContactModal();
                  }}
                >
                  CONTACT
                </span>

                <span
                  className="nav-item"
                  onClick={() => {
                    setIsNavOpen(false);
                  }}
                >
                  DONATE
                </span>

                <Login setOpenLoginModal={setOpenLoginModal} />
              </div>
              <EmailList />
            </div>
          </div>
        </nav>

        {showContactModal && (
          <div className="modal-contact">
            <div className="modal-content-contact">
              <span className="close-contact" onClick={toggleContactModal}>
                <i className="fa-solid fa-x"></i>
              </span>
              <Contact />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar2;
