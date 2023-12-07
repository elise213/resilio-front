import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/toolBox.css";
import { Context } from "../store/appContext";
import EmailList from "./EmailList";
import ErrorBoundary from "./ErrorBoundary";
import Selection from "./Selection";

const ToolBox = ({
  backSide,
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
  toggleToolButtonRef,
}) => {
  const { store, actions } = useContext(Context);

  const toggleNav = () => {
    setIsNavOpen(false);
    setIsDeckOpen(false);
    setIsFavoritesOpen(false);
    setIsToolBoxOpen(!isToolBoxOpen);
  };

  // const handleClickOutside = (event) => {
  //   const toolNav = document.querySelector(".toolnew-navbar");

  //   if (
  //     toggleToolButtonRef.current &&
  //     toggleToolButtonRef.current.contains(event.target)
  //   ) {
  //     return;
  //   }

  //   if (toolNav && !toolNav.contains(event.target) && isToolBoxOpen) {
  //     setIsToolBoxOpen(false);
  //   }
  // };

  useEffect(() => {
    const body = document.body;
    if (isToolBoxOpen) {
      body.classList.add("toolno-scroll");
    } else {
      body.classList.remove("toolno-scroll");
    }
  }, [isToolBoxOpen]);

  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);

  //   const body = document.body;
  //   if (isToolBoxOpen) {
  //     body.classList.add("toolno-scroll");
  //   } else {
  //     body.classList.remove("toolno-scroll");
  //   }

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, [isToolBoxOpen]);

  return (
    <>
      <div className="toolnav-container">
        <div
          className={`toolnew-navbar ${isToolBoxOpen ? "toolopen-nav" : ""}`}
        >
          <div
            onClick={toggleNav}
            className={`toolclose-icon-nav ${
              isToolBoxOpen ? "toolopen-nav" : ""
            }`}
          >
            <i className="fa-solid fa-x"></i>
          </div>

          {store.CATEGORY_OPTIONS &&
          store.DAY_OPTIONS &&
          store.GROUP_OPTIONS &&
          categories &&
          days &&
          groups ? (
            <ErrorBoundary>
              {/* <div className="side-car"> */}
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
              {/* </div> */}
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
