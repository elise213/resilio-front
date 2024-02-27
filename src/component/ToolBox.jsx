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

  return (
    <>
      {/* <div className="toolnav-container"> */}
      {store.CATEGORY_OPTIONS &&
      store.DAY_OPTIONS &&
      store.GROUP_OPTIONS &&
      categories &&
      days &&
      groups ? (
        <ErrorBoundary>
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
        </ErrorBoundary>
      ) : (
        <p>Loading selection options...</p>
      )}
      {/* </div> */}
    </>
  );
};

export default ToolBox;
