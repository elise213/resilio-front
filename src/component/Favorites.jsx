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
  toggleFavoritesButtonRef,
  toggleDeckButtonRef,
}) => {
  const { store, actions } = useContext(Context);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token]);

  // const handleClickOutside = (event) => {
  //   const favoritesNav = document.querySelector(".favoritesnew-navbar");

  //   if (
  //     toggleFavoritesButtonRef.current &&
  //     toggleFavoritesButtonRef.current.contains(event.target)
  //   ) {
  //     return; // Ignore clicks on the toggle favorites button
  //   }

  //   if (
  //     favoritesNav &&
  //     !favoritesNav.contains(event.target) &&
  //     isFavoritesOpen
  //   ) {
  //     setIsFavoritesOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, [isFavoritesOpen]);

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
            {!isLoggedIn && (
              <>
                <Login
                  openLoginModal={openLoginModal}
                  setOpenLoginModal={setOpenLoginModal}
                />
                <span className="scroll-title to-save-res">
                  to save resources
                </span>
              </>
            )}

            {isLoggedIn && !store.favorites.length > 0 && (
              <>
                <span className="scroll-title to-save-res">
                  Your Liked{" "}
                  <i style={{ color: "red" }} className="fa-solid fa-heart"></i>{" "}
                  resources will appear here. Try adding some!
                </span>
              </>
            )}

            {store.favorites && store.favorites.length > 0 ? (
              <div className="list-container">
                <div className="scroll-title">
                  <span>Saved Resources</span>
                </div>
                <ul>
                  {favorites.map((resource, index) => (
                    <ResourceCard
                      key={`${resource.id}-${index}`}
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
