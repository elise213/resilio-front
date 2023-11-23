import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/favorites.css";
import { Context } from "../store/appContext";
import ResourceCard from "./ResourceCard";
import Login from "./Login";

const Favorites = ({
  isFavoritesOpen,
  setIsFavoritesOpen,
  openModal,
  closeModal,
  modalIsOpen,
  setModalIsOpen,
  selectedResources,
  addSelectedResource,
  removeSelectedResource,
  setFavorites,
  favorites,
  setOpenLoginModal,
  openLoginModal,
  togglefavorites,
}) => {
  const { store, actions } = useContext(Context);

  // Function to handle click outside the favorites area
  const handleClickOutside = (event) => {
    const favoritesNav = document.querySelector(".favoritesnew-navbar");
    if (
      favoritesNav &&
      !favoritesNav.contains(event.target) &&
      isFavoritesOpen
    ) {
      setIsFavoritesOpen(false);
    }
  };

  // Set up the event listener
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFavoritesOpen]);

  return (
    <>
      <div className="favoritesnav-container">
        <div
          className={`favoritesnew-navbar ${
            isFavoritesOpen ? "favoritesopen-nav" : ""
          }`}
        >
          <div
            onClick={togglefavorites}
            className={`favoritesclose-icon-nav ${
              isFavoritesOpen ? "favoritesopen-nav" : ""
            }`}
          >
            <i className="fa-solid fa-x"></i>
          </div>

          <div
            className={`back-container ${
              store.favorites ? "column-class" : ""
            }`}
          >
            {!store.favorites ||
              (!(store.favorites.length > 0) && (
                <>
                  <div className="favorites-warning-div">
                    <div className="scroll-title">
                      <span>Log in to save Resources</span>
                    </div>
                  </div>
                  <Login
                    openLoginModal={openLoginModal}
                    setOpenLoginModal={setOpenLoginModal}
                  />
                </>
              ))}

            {store.favorites && store.favorites.length > 0 ? (
              <div className="list-container">
                <div className="scroll-title">
                  <span>Saved Resources</span>
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
