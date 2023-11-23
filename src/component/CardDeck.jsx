import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/cardDeck.css";
import { Context } from "../store/appContext";
import ResourceCard from "./ResourceCard";

const CardDeck = ({
  isDeckOpen,
  setIsDeckOpen,
  openModal,
  closeModal,
  modalIsOpen,
  setModalIsOpen,
  selectedResources,
  addSelectedResource,
  removeSelectedResource,
  setFavorites,
  toggleCardDeck,
}) => {
  const { store, actions } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle click outside the card deck area
  const handleClickOutside = (event) => {
    const deckNav = document.querySelector(".decknew-navbar");
    if (deckNav && !deckNav.contains(event.target) && isDeckOpen) {
      setIsDeckOpen(false);
    }
  };

  // Set up the event listener
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDeckOpen]);

  return (
    <>
      <div className="decknav-container">
        <div className={`decknew-navbar ${isDeckOpen ? "deckopen-nav" : ""}`}>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div
            onClick={toggleCardDeck}
            className={`deckclose-icon-nav ${isDeckOpen ? "deckopen-nav" : ""}`}
          >
            <i className="fa-solid fa-x"></i>
          </div>

          <div
            className={`back-container ${
              store.favorites ? "column-class" : ""
            }`}
          >
            {store.boundaryResults && store.boundaryResults.length > 0 && (
              <div className="list-container">
                <div className="scroll-title">
                  <span>Resources in your Area</span>
                </div>
                <ul className="all-ul">
                  {Array.isArray(store.mapResults) &&
                    store.mapResults
                      .filter(
                        (resource) =>
                          resource.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          (resource.description &&
                            resource.description
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()))
                      )
                      .map((resource, index) => (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CardDeck;
