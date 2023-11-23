import React, { useRef } from "react";
import Styles from "../styles/buttons.css";

const Buttons = ({
  isDeckOpen,
  isNavOpen,
  isFavoritesOpen,
  isToolBoxOpen,
  toggleCardDeck,
  togglefavorites,
}) => {
  const toggleFavoritesButtonRef = useRef(null);
  const toggleDeckButtonRef = useRef(null);

  return (
    <div className="button-holder">
      <button
        ref={toggleFavoritesButtonRef}
        onClick={togglefavorites}
        className={`favoritesopen-icon-nav ${
          !isFavoritesOpen && !isToolBoxOpen && !isNavOpen && !isDeckOpen
            ? "favoritesclosed"
            : ""
        }`}
      >
        View Your Saved Resources
      </button>

      <button
        ref={toggleDeckButtonRef}
        onClick={toggleCardDeck}
        className={`deckopen-icon-nav ${
          !isDeckOpen && !isNavOpen && !isFavoritesOpen && !isToolBoxOpen
            ? "deckclosed"
            : ""
        }`}
      >
        View All Resources in the Map Area
      </button>
    </div>
  );
};

export default Buttons;
