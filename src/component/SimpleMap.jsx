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

  const createMapOptions = () => {
    return {
      styles: [
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ lightness: -30 }, { gamma: 0.8 }, { saturation: -70 }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.stroke",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ffffff" }, { weight: 0.1 }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text.fill",
          stylers: [{ color: "#0000" }],
        },
        {
          featureType: "water",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    };
  };

  const Marker = ({ text, id, result }) => {
    const [isHovered, setIsHovered] = useState(false);
    const iconClass = actions.getIconForCategory(result.category);
    const color = actions.getColorForCategory(result.category).color;
    return (
      <div
        className="marker"
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => openModal(result)}
      >
        <div className="marker-icon">
          <i className={iconClass} style={{ color: color }}></i>{" "}
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
          style={{ height: "66vh", width: "66vw" }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            center={city.center}
            bounds={city.bounds}
            defaultZoom={11}
            onChange={(e) => handleBoundsChange(e)}
            options={createMapOptions}
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
