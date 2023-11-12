import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/toolBox.css";
import { Context } from "../store/appContext";
import EmailList from "./EmailList";
import ErrorBoundary from "./ErrorBoundary";
import Selection from "./Selection";

const ToolBox = ({
  categories,
  setCategories,
  groups,
  setGroups,
  days,
  setDays,
  searchingToday,
  setSearchingToday,
  INITIAL_DAY_STATE,
  isDeckOpen,
  isNavOpen,
  isFavoritesOpen,
  isToolBoxOpen,
  setIsDeckOpen,
  setIsNavOpen,
  setIsToolBoxOpen,
  setIsFavoritesOpen,
}) => {
  const { store, actions } = useContext(Context);

  const toggleNav = () => {
    setIsNavOpen(false);
    setIsDeckOpen(false);
    setIsFavoritesOpen(false);
    setIsToolBoxOpen(!isToolBoxOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector(".toolnew-navbar");
      if (nav && !nav.contains(event.target) && isToolBoxOpen) {
        setIsToolBoxOpen(false);
      }

      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    };
  }, [isToolBoxOpen]);

  useEffect(() => {
    const body = document.body;
    if (isToolBoxOpen) {
      body.classList.add("toolno-scroll");
    } else {
      body.classList.remove("toolno-scroll");
    }
  }, [isToolBoxOpen]);

  return (
    <>
      <div className="toolnav-container">
        <div
          className={`toolnew-navbar ${isToolBoxOpen ? "toolopen-nav" : ""}`}
        >
          {/* <div className="toolmenu-icon"> */}
          <div
            onClick={toggleNav}
            className={`toolopen-icon-nav ${
              !isFavoritesOpen && !isToolBoxOpen && !isNavOpen && !isDeckOpen
                ? "toolclosed"
                : ""
            }`}
          >
            <i className="fa-solid fa-filter"></i>
          </div>
          <div
            onClick={toggleNav}
            className={`toolclose-icon-nav ${
              isToolBoxOpen ? "toolopen-nav" : ""
            }`}
          >
            <i className="fa-solid fa-x"></i>
          </div>
          {/* </div> */}

          {store.CATEGORY_OPTIONS &&
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
            <p>Loading selection options...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ToolBox;
