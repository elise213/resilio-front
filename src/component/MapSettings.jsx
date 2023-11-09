import React from "react";
import styles from "../styles/mapSettings2.css";

const MapSettings = ({
  handleZipInputChange,
  zipInput,
  geoFindMe,
  backSide,
  setBackSide,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;

  return (
    <div className="map-settings">
      <div className="map-settings-buttons">
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
        <button className="flip-button" onClick={() => setBackSide(!backSide)}>
          Filp the Map to build your Path
        </button>
      </div>
    </div>
  );
};

export default MapSettings;
