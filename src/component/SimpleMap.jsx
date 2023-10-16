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
  userLocation,
  closeModal,
  modalIsOpen,
  setModalIsOpen,
  selectedResource,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);
  const [backSide, setBackSide] = useState(false);

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

  // const Marker = ({ text, id, result, color }) => {
  //   const [isHovered, setIsHovered] = useState(false);
  //   const markerColor =
  //     color || actions.getColorForCategory(result.category).color;
  //   const categories = actions.processCategory(result.category);

  //   const icons = categories.map((category, index) => {
  //     const iconClass = actions.getIconForCategory(category);
  //     const color = actions.getColorForCategory(category).color;
  //     return <i key={index} className={iconClass} style={{ color }}></i>;
  //   });

  //   const color = actions.getColorForCategory(result.category).color;
  //   const singleCategory = categories[0];
  //   const iconClass = actions.getIconForCategory(singleCategory);

  //   return (
  //     <div
  //       className="marker"
  //       style={{ cursor: "pointer", color: markerColor }}
  //       onMouseEnter={() => setIsHovered(true)}
  //       onMouseLeave={() => setIsHovered(false)}
  //       onClick={() => openModal(result)}
  //     >
  //       <div className="marker-icon">
  //         <i className={iconClass} style={{ color }}></i>
  //         {isHovered && text && (
  //           <span className="marker-text">
  //             {text}
  //             {icons}
  //           </span>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };
  const Marker = ({ text, id, result, markerColor }) => {
    const [isHovered, setIsHovered] = useState(false);

    // This will handle when result is undefined
    const color = result
      ? markerColor || actions.getColorForCategory(result.category).color
      : markerColor || "red"; // red as default if no color is provided

    let icons = [];
    let iconClass = "default-icon-class"; // Add your default icon class here

    // Process category icons if result is defined
    if (result) {
      const categories = actions.processCategory(result.category);
      icons = categories.map((category, index) => {
        const iconClass = actions.getIconForCategory(category);
        const color = actions.getColorForCategory(category).color;
        return <i key={index} className={iconClass} style={{ color }}></i>;
      });

      const singleCategory = categories[0];
      iconClass = actions.getIconForCategory(singleCategory);
    }

    return (
      <div
        className="marker"
        style={{ cursor: "pointer", color }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={result ? () => openModal(result) : undefined}
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
    <div className={`map-frame ${backSide ? "flipped" : ""}`}>
      {backSide ? (
        // New view when backSide is true
        <div className="backside">
          {store.favorites && store.favorites.length > 0 && (
            <div>
              {store.favorites.map((result, i) => (
                <li key={i}>
                  <ResourceCard
                    item={result}
                    openModal={openModal}
                    closeModal={closeModal}
                    modalIsOpen={modalIsOpen}
                    setModalIsOpen={setModalIsOpen}
                    selectedResource={selectedResource}
                  />
                </li>
              ))}
            </div>
          )}

          {store.boundaryResults[0] && (
            <div className="scroll-headers">
              <Report />
            </div>
          )}
          <button
            className="flip-button"
            onClick={() => setBackSide(!backSide)}
          >
            Flip The Map
          </button>
        </div>
      ) : (
        // View when backSide is false
        <>
          <div className="step-1">
            <div className="group-div">
              <div className="step1-text"></div>
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
            <button
              className="flip-button"
              onClick={() => setBackSide(!backSide)}
            >
              Flip The Map
            </button>
          </div>
          <div
            className="map-container"
            style={{ height: "80vh", width: "60vw" }}
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

              {userLocation && (
                <Marker
                  lat={userLocation.lat}
                  lng={userLocation.lng}
                  text="You are here!"
                  color="red" // Or any other color to distinguish the user marker
                />
              )}
            </GoogleMapReact>
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleMap;
