import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/navbar2.css";
import { Context } from "../store/appContext";
import Contact from "../component/Contact";
import EmailList from "../component/EmailList";
import ErrorBoundary from "../component/ErrorBoundary";
import Selection from "./Selection";

const Navbar2 = ({}) => {
  const { store, actions } = useContext(Context);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(store.isLargeScreen);

  useEffect(() => {
    setIsLargeScreen(store.isLargeScreen);
  }, [store.isLargeScreen]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

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
          {/* {!isLargeScreen && ( */}
          <div className="menu-icon" onClick={toggleNav}>
            <div
              className={`open-icon-nav ${!isNavOpen ? "closed" : ""}`}
              onClick={() => setIsNavOpen(true)}
            >
              <i className="fas fa-bars"></i>
            </div>
            <div className={`close-icon-nav ${isNavOpen ? "open-nav" : ""}`}>
              <i className="fa-solid fa-x"></i>
            </div>
          </div>
          {/* )} */}

          <div className={`navbar-content ${isNavOpen ? "open-nav" : ""}`}>
            {/* {!isLargeScreen && ( */}
            <img
              src="/assets/RESILIOO.png"
              alt="Resilio Logo"
              className="navbar-logo"
            />
            {/* )} */}
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
                // toggleContactModal();
              }}
            >
              DONATE
            </span>
            <EmailList />
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
