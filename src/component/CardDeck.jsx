import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/cardDeck.css";
import { Context } from "../store/appContext";
import ResourceCard from "./ResourceCard";

const CardDeck = ({
  isDeckOpen,
  setIsDeckOpen,
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

  const toggleCardDeck = () => {
    setIsNavOpen(false);
    setIsDeckOpen(!isDeckOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector(".decknew-navbar");
      if (nav && !nav.contains(event.target) && isDeckOpen) {
        setIsDeckOpen(false);
      }

      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    };
  }, [isDeckOpen]);

  useEffect(() => {
    const body = document.body;
    if (isDeckOpen) {
      body.classList.add("deckno-scroll");
    } else {
      body.classList.remove("deckno-scroll");
    }
  }, [isDeckOpen]);

  return (
    <>
      <div className="decknav-container">
        <div className={`decknew-navbar ${isDeckOpen ? "deckopen-nav" : ""}`}>
          <div className="deckmenu-icon" onClick={toggleCardDeck}>
            <div
              className={`deckopen-icon-nav ${!isDeckOpen ? "deckclosed" : ""}`}
              onClick={() => setIsDeckOpen(true)}
            >
              <i className="fa-solid fa-list"></i>
            </div>
            <div
              className={`deckclose-icon-nav ${
                isDeckOpen ? "deckopen-nav" : ""
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
            {store.boundaryResults && store.boundaryResults.length > 0 && (
              <div className="list-container">
                <div className="scroll-title">
                  <span>Resources in your Area</span>
                </div>
                <ul className="all-ul">
                  {Array.isArray(store.mapResults) &&
                    store.mapResults.map((resource, index) => (
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
