import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/simpleMap2.css";
import MapSettings from "./MapSettings";

const SimpleMap = ({
  openModal,
  handleBoundsChange,
  city,
  geoFindMe,
  handleZipInputChange,
  zipInput,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  const Marker = ({ text, id, result }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div
        className="marker"
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => openModal(result)}
      >
        <div className="marker-icon">
          <i className="fa-solid fa-map-pin"></i>
          {isHovered && text && <span className="marker-text">{text}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="map-info">
      <div className="map-wrapper">
        <MapSettings
          geoFindMe={geoFindMe}
          handleZipInputChange={handleZipInputChange}
          zipInput={zipInput}
        />
        <div
          className="map-container"
          style={{ height: "60vh", width: "66vw" }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            center={city.center}
            bounds={city.bounds}
            defaultZoom={11}
            onChange={(e) => handleBoundsChange(e)}
          >
            {store.boundaryResults.map((result, i) => (
              <Marker
                lat={result.latitude}
                lng={result.longitude}
                text={result.name}
                key={i}
                id={result.id}
                openModal={openModal}
                result={result}
              />
            ))}
          </GoogleMapReact>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;
