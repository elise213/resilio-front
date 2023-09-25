import React from "react";
import styles from "../styles/mapSettings.css";

const MapSettings = ({ handleZipInputChange, zipInput, geoFindMe }) => {
  const apiKey = import.meta.env.VITE_GOOGLE;

  return (
    <div className="map-settings">
      <div className="map-settings-buttons">
        <button className="geo-button" onClick={() => geoFindMe()}>
          Find Location
        </button>
        <div className="zipcode-input-container">
          <input
            type="text"
            id="zipcode"
            value={zipInput}
            onChange={handleZipInputChange}
            maxLength="5"
            placeholder="Enter Zip Code"
          />
        </div>
      </div>
    </div>
  );
};

export default MapSettings;
