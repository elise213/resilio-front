import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import Selection from "./Selection";
import ErrorBoundary from "./ErrorBoundary";
import MapSettings from "./MapSettings";
import Report from "./Report";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/simple_map.css";
// import MapSettings from "./MapSettings";

const SimpleMap = ({
  openModal,
  handleBoundsChange,
  INITIAL_DAY_STATE,
  searchingToday,
  setSearchingToday,
  setCategories,
  setGroups,
  setDays,
  city,
  geoFindMe,
  handleZipInputChange,
  zipInput,
  categories,
  days,
  groups,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  const createMapOptions = () => {
    return {
      styles: [
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ lightness: -5 }, { gamma: 0.8 }, { saturation: -30 }],
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
        // {
        //   featureType: "road",
        //   elementType: "labels.text.stroke",
        //   stylers: [{ visibility: "off" }],
        // },
        {
          featureType: "administrative.locality",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text.stroke",
          // stylers: [{ color: "lightGray" }, { weight: 0.01 }],
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text.fill",
          // stylers: [{ color: "white" }],
          stylers: [{ visibility: "off" }],
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
    const categories = actions.processCategory(result.category);

    const icons = categories.map((category, index) => {
      const iconClass = actions.getIconForCategory(category);
      const color = actions.getColorForCategory(category).color;
      return <i key={index} className={iconClass} style={{ color }}></i>;
    });

    const color = actions.getColorForCategory(result.category).color;
    const singleCategory = categories[0];
    const iconClass = actions.getIconForCategory(singleCategory);

    return (
      <div
        className="marker"
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => openModal(result)}
      >
        <div className="marker-icon">
          <i className={iconClass} style={{ color }}></i>
          {isHovered && text && (
            <span className="marker-text">
              {text}
              {icons}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="map-frame">
      <div className="step-1">
        <div className="group-div">
          <div className="step1-text">
            <div className="step-text">
              <p>Hit this button </p>
              <i className="fa-solid fa-arrow-right-long"></i>
            </div>
            <div className="step-text">
              <p>Or enter your zip code </p>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
          <MapSettings
            geoFindMe={geoFindMe}
            handleZipInputChange={handleZipInputChange}
            zipInput={zipInput}
          />
        </div>
        <div className="side-car">
          {store.CATEGORY_OPTIONS &&
          store.DAY_OPTIONS &&
          store.GROUP_OPTIONS &&
          categories &&
          days &&
          groups ? (
            <ErrorBoundary>
              <Selection
                categories={categories}
                setCategories={setCategories}
                groups={groups}
                setGroups={setGroups}
                days={days}
                setDays={setDays}
                searchingToday={searchingToday}
                setSearchingToday={setSearchingToday}
                INITIAL_DAY_STATE={INITIAL_DAY_STATE}
              />
            </ErrorBoundary>
          ) : (
            message2Open && <p>Loading selection options...</p>
          )}
        </div>
        {store.boundaryResults[0] && (
          <div className="scroll-headers">
            <Report />
          </div>
        )}
      </div>
      <div className="map-container" style={{ height: "80vh", width: "60vw" }}>
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
  );
};

export default SimpleMap;
