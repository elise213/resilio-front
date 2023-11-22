import React from "react";
import styles from "../styles/mapSettings2.css";

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

            <button
              className="flip-button"
              onClick={() => setBackSide(!backSide)}
            >
              {backSide ? "See the Map" : "Make a Plan"}
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
    </div>
  );
};

export default MapSettings;
