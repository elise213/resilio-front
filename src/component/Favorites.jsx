import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/favorites.css";
import { Context } from "../store/appContext";
import ResourceCard from "./ResourceCard";

const Favorites = ({
  favorites,
  isDeckOpen,
  setIsDeckOpen,
  isToolBoxOpen,
  isFavoritesOpen,
  setIsFavoritesOpen,
  setIsNavOpen,
  openModal,
  closeModal,
  modalIsOpen,
  setModalIsOpen,
  selectedResources,
  addSelectedResource,
  removeSelectedResource,
  setFavorites,
}) => {
  const { store, actions } = useContext(Context);

  const togglefavorites = () => {
    setIsNavOpen(false);
    setIsFavoritesOpen(!isFavoritesOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector("favoritesnew-navbar");
      if (nav && !nav.contains(event.target) && isFavoritesOpen) {
        setIsFavoritesOpen(false);
      }

      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    };
  }, [isFavoritesOpen]);

  useEffect(() => {
    const body = document.body;
    if (isFavoritesOpen) {
      body.classList.add("favoritesno-scroll");
    } else {
      body.classList.remove("favoritesno-scroll");
    }
  }, [isFavoritesOpen]);

  return (
    <>
      <div className="favoritesnav-container">
        <div
          className={`favoritesnew-navbar ${
            isFavoritesOpen ? "favoritesopen-nav" : ""
          }`}
        >
          <div className="favoritesmenu-icon" onClick={togglefavorites}>
            <div
              className={`favoritesopen-icon-nav ${
                !isFavoritesOpen && !isToolBoxOpen ? "favoritesclosed" : ""
              }`}
              onClick={() => setIsFavoritesOpen(true)}
            >
              <i className="fa-solid fa-heart"></i>
            </div>
            <div
              className={`favoritesclose-icon-nav ${
                isFavoritesOpen ? "favoritesopen-nav" : ""
              }`}
            >
              <i className="fa-solid fa-x"></i>
            </div>
          </div>

          <div
            className={`back-container ${
              store.favorites ? "column-class" : ""
            }`}
          >
            {!store.favorites ||
              (!(store.favorites.length > 0) && (
                <div className="favorites-warning-div">
                  <div className="scroll-title">
                    <span>Log in to save favorites</span>
                  </div>
                </div>
              ))}
            {store.favorites && store.favorites.length > 0 ? (
              <div className="list-container">
                <div className="scroll-title">
                  <span>Your Liked Resources</span>
                </div>
                <ul>
                  {favorites.map((resource, index) => (
                    <ResourceCard
                      key={resource.id}
                      item={resource}
                      openModal={openModal}
                      closeModal={closeModal}
                      modalIsOpen={modalIsOpen}
                      setModalIsOpen={setModalIsOpen}
                      selectedResources={selectedResources}
                      addSelectedResource={addSelectedResource}
                      removeSelectedResource={removeSelectedResource}
                      setFavorites={setFavorites}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Favorites;
