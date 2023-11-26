import React, { useRef, useState } from "react";
import Styles from "../styles/buttons.css";

const Buttons = ({
  isDeckOpen,
  isNavOpen,
  isFavoritesOpen,
  isToolBoxOpen,
  toggleCardDeck,
  togglefavorites,
  backSide,
  setBackSide,
  toggleFavoritesButtonRef,
  toggleDeckButtonRef,
  toggleToolButtonRef,
}) => {
  return (
    <>
      <div className="button-holder">
        <button
          ref={toggleFavoritesButtonRef}
          onClick={() => togglefavorites()}
          className={`favoritesopen-icon-nav ${
            !isFavoritesOpen && !isToolBoxOpen && !isNavOpen && !isDeckOpen
              ? "favoritesclosed"
              : ""
          }`}
        >
          Your Saved Resources
        </button>

        <button
          ref={toggleDeckButtonRef}
          onClick={() => toggleCardDeck()}
          className={`deckopen-icon-nav ${
            !isDeckOpen && !isNavOpen && !isFavoritesOpen && !isToolBoxOpen
              ? "deckclosed"
              : ""
          }`}
        >
          Resources in the Map Area
        </button>
      </div>

      <button className="flip-button" onClick={() => setBackSide(!backSide)}>
        {backSide ? "Go to The Map" : "Make a Plan"}
      </button>
    </>
  );
};

export default Buttons;
