import React, { useRef, useState } from "react";
import Styles from "../styles/buttons.css";
import Button from "@mui/material/Button";

const Buttons = ({
  isDeckOpen,
  isNavOpen,
  isFavoritesOpen,
  isToolBoxOpen,
  setIsToolBoxOpen,
  toggleCardDeck,
  togglefavorites,
  backSide,
  setBackSide,
  toggleFavoritesButtonRef,
  toggleDeckButtonRef,
  toggleToolButtonRef,
  zipInput,
  handleZipInputChange,
}) => {
  return (
    <>
      <div className="button-holder">
        {/* {!backSide && ( */}
        {/* <div className="deck-buttons"></div> */}

        <div className="function-buttons">
          {/* <Button
            variant="contained"
            color="primary"
            ref={toggleToolButtonRef}
            className={`toolopen-icon-nav ${
              !isToolBoxOpen ? "toolclosed" : ""
            }`}
            onClick={() => setIsToolBoxOpen(!isToolBoxOpen)}
          >
            Filters
          </Button> */}

          <button
            ref={toggleFavoritesButtonRef}
            onClick={() => togglefavorites()}
            className={`favoritesopen-icon-nav ${
              !isFavoritesOpen
                ? // && !isToolBoxOpen && !isNavOpen && !isDeckOpen
                  "favoritesclosed"
                : ""
            }`}
          >
            {/* Your Saved Resources */}
            {/* <span class="material-symbols-outlined">favorite</span> */}
            <i className="material-icons mdc-button__icon" aria-hidden="true">
              bookmark
            </i>{" "}
            Saved
          </button>
          <button
            ref={toggleDeckButtonRef}
            onClick={() => toggleCardDeck()}
            className={`deckopen-icon-nav ${
              !isDeckOpen
                ? // && !isNavOpen && !isFavoritesOpen && !isToolBoxOpen
                  "deckclosed"
                : ""
            }`}
          >
            {/* Resources in the Map Area */}
            <span class="material-symbols-outlined">map</span>
            List
          </button>

          <button
            ref={toggleToolButtonRef}
            onClick={() => setIsToolBoxOpen(true)}
            className={`flip-button toolopen-icon-nav ${
              !isFavoritesOpen && !isNavOpen && !isDeckOpen && !isToolBoxOpen
                ? "toolclosed"
                : ""
            }`}
          >
            Filters
          </button>

          {/* <Button
            variant="contained"
            color="primary"
            onClick={() => setBackSide(!backSide)}
          >
            {backSide ? "Go to The Map" : "Make a Plan"}
          </Button> */}
        </div>
      </div>
    </>
  );
};

export default Buttons;
