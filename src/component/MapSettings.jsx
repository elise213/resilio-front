import React, { useRef } from "react";
import styles from "../styles/mapSettings2.css";
import Buttons from "./Buttons";

const MapSettings = ({
  handleZipInputChange,
  zipInput,
  geoFindMe,
  backSide,
  setBackSide,
  toggleNav,
  isFavoritesOpen,
  isToolBoxOpen,
  setIsToolBoxOpen,
  isNavOpen,
  isDeckOpen,
  togglefavorites,
  toggleCardDeck,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;

  return (
    <div className="map-settings">
      <div className="map-settings-buttons">
        {!backSide && (
          <div className="function-buttons">
            <button
              onClick={() => setIsToolBoxOpen(true)}
              className={`toolopen-icon-nav ${
                !isFavoritesOpen && !isToolBoxOpen && !isNavOpen && !isDeckOpen
                  ? "toolclosed"
                  : ""
              }`}
            >
              Filter Resources
            </button>
          </div>
        )}

        <div className="stack">
          <button className="geo-button" onClick={() => geoFindMe()}>
            geo-location
          </button>
          <div className="zipcode-input-container">
            <input
              type="text"
              id="zipcode"
              value={zipInput}
              onChange={handleZipInputChange}
              maxLength="5"
              placeholder="Zip Code"
            />
          </div>
        </div>
      </div>
      <Buttons
        isDeckOpen={isDeckOpen}
        isNavOpen={isNavOpen}
        isFavoritesOpen={isFavoritesOpen}
        isToolBoxOpen={isToolBoxOpen}
        toggleCardDeck={toggleCardDeck}
        togglefavorites={togglefavorites}
      />
      {/* <button
        ref={toggleFavoritesButtonRef}
        onClick={togglefavorites}
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
        onClick={toggleCardDeck}
        className={`deckopen-icon-nav ${
          !isDeckOpen && !isNavOpen && !isFavoritesOpen && !isToolBoxOpen
            ? "deckclosed"
            : ""
        }`}
      >
        Resources in the map area
      </button> */}
    </div>
  );
};

export default MapSettings;
