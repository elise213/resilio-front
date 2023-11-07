import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/navbar2.css";
import { Context } from "../store/appContext";
import EmailList from "../component/EmailList";
import ErrorBoundary from "../component/ErrorBoundary";
import Selection from "./Selection";

const Navbar2 = ({
  categories,
  setCategories,
  groups,
  setGroups,
  days,
  setDays,
  searchingToday,
  setSearchingToday,
  INITIAL_DAY_STATE,
}) => {
  const { store, actions } = useContext(Context);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  console.log("IsLS", isLargeScreen);

  useEffect(() => {
    // If large screen, open the navbar by default
    setIsNavOpen(isLargeScreen);
  }, [isLargeScreen]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleContactModal = () => {
    setShowContactModal(!showContactModal);
  };

  useEffect(() => {
    if (!isLargeScreen) {
      const handleClickOutside = (event) => {
        const nav = document.querySelector(".new-navbar");
        if (nav && !nav.contains(event.target) && isNavOpen) {
          setIsNavOpen(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isNavOpen, isLargeScreen]);

  useEffect(() => {
    if (isLargeScreen) {
      setIsNavOpen(true);
    }
  }, [isLargeScreen]);

  useEffect(() => {
    const body = document.body;
    if ((!isLargeScreen && isNavOpen) || showContactModal) {
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
    }
  }, [isNavOpen, showContactModal, isLargeScreen]);

  return (
    <>
      return (
      <>
        <div className="nav-container">
          <nav className={`new-navbar ${isNavOpen ? "open" : ""}`}>
            {!isLargeScreen && (
              <div className="menu-icon" onClick={toggleNav}>
                <div
                  className={`open-icon-nav ${!isNavOpen ? "closed" : ""}`}
                  onClick={() => setIsNavOpen(true)}
                >
                  <i className="fas fa-bars"></i>
                </div>
                <div className={`close-icon-nav ${isNavOpen ? "open" : ""}`}>
                  {/* <span className="navbar-toggler"> */}
                  <i className="fa-solid fa-x"></i>
                  {/* </span> */}
                </div>
              </div>
            )}

            <div className={`navbar-content ${isNavOpen ? "open" : ""}`}>
              {!isLargeScreen && (
                <img
                  src="/assets/RESILIOO.png"
                  alt="Resilio Logo"
                  className="navbar-logo"
                />
              )}
              <span className="nav-item" onClick={() => setIsNavOpen(false)}>
                <a href="/" passHref className="nav-item">
                  HOME
                </a>
              </span>
              {/* <span className="nav-item" onClick={() => setIsNavOpen(false)}>
                <a href="/fiscal" passHref className="nav-item">
                  FISCAL SPONSORSHIP
                </a>
              </span> */}
              <span
                className="nav-item"
                onClick={() => {
                  setIsNavOpen(false);
                  toggleContactModal();
                }}
              >
                CONTACT
              </span>
              {!isLargeScreen && <EmailList />}
            </div>
          </nav>

          {showContactModal && (
            <div className="modal-contact">
              <div className="modal-content-contact">
                <span className="close" onClick={toggleContactModal}>
                  <i className="fa-solid fa-x"></i>
                </span>
                <Contact />
              </div>
            </div>
          )}
        </div>
      </>
      );
      {/* <div className="nav-container">
        <nav className={`new-navbar ${isNavOpen ? "open" : ""}`}>
          {!store.isLargeScreen &&
          store.CATEGORY_OPTIONS &&
          store.DAY_OPTIONS &&
          store.GROUP_OPTIONS &&
          categories &&
          days &&
          groups ? (
            <ErrorBoundary>
              <div className="side-car">
                <Selection
                  categories={categories}
                  setCategories={setCategories}
                  groups={groups}
                  setGroups={setGroups}
                  days={days}
                  setDays={setDays}
                  searchingToday={searchingToday}
                  setSearchingToday={setSearchingToday}
                  INITIAL_DAY_STATE={INITIAL_DAY_STATE}
                />
              </div>
            </ErrorBoundary>
          ) : (
            message2Open && <p>Loading selection options...</p>
          )}

          <div className={`navbar-content ${isNavOpen ? "open" : ""}`}>
            {!store.isLargeScreen && (
              <img
                src="/img/logo2.png"
                alt="CCEA Logo"
                className="navbar-logo"
              />
            )}
            <span className="nav-item" onClick={() => setIsNavOpen(false)}>
              <a href="/" passHref className="nav-item">
                HOME
              </a>
            </span>
            <span className="nav-item" onClick={() => setIsNavOpen(false)}>
              <a href="/fiscal" passHref className="nav-item">
                FISCAL SPONSORSHIP
              </a>
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
            {!store.isLargeScreen && <EmailList />}
          </div>
        </nav>

        {showContactModal && (
          <div className="modal-contact">
            <div className="modal-content-contact">
              <span className="close" onClick={toggleContactModal}>
                <i className="fa-solid fa-x"></i>
              </span>
              <Contact />
            </div>
          </div>
        )}
      </div> */}
    </>
  );
};

export default Navbar2;
