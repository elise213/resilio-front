import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import Selection from "./Selection";
import ResourceCard from "./ResourceCard";
import ErrorBoundary from "./ErrorBoundary";
import MapSettings from "./MapSettings";
import Report from "./Report";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/simple_map.css";

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
  setSelectedResource,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);
  const [backSide, setBackSide] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favorites")) || []
  );

  useEffect(() => {
    if (favorites) {
      console.log("favs", favorites);
    }
  }, [favorites]);

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

        {
          featureType: "administrative.locality",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text.stroke",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text.fill",
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

  const [hoveredItem, setHoveredItem] = useState(null);

  const Marker = ({ text, id, result, markerColor }) => {
    const [isHovered, setIsHovered] = useState(false);

    const color = result
      ? markerColor || actions.getColorForCategory(result.category).color
      : markerColor || "red";

    let icons = [];
    let iconClass = "default-icon-class";

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
        style={{ cursor: "pointer", color, position: "relative" }} // Make sure the marker's position is set to 'relative'
        onMouseEnter={() => {
          setIsHovered(true);
          setHoveredItem(result);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredItem(null);
        }}
        onClick={result ? () => openModal(result) : undefined}
      >
        {/* {isHovered && result && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              width: "300px",
              zIndex: 99999,
            }}
          >
            <ResourceCard
              item={result}
              openModal={openModal}
              closeModal={closeModal}
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              selectedResource={selectedResource}
            />
          </div>
        )} */}

        {isHovered && result && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              width: "300px",
              zIndex: 99999,
            }}
          >
            <ResourceCard
              key={result.name}
              item={result}
              openModal={openModal}
              closeModal={closeModal}
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              selectedResource={selectedResource}
            />
          </div>
        )}

        <div className="marker-icon">
          <i className={iconClass} style={{ color }}></i>
          {/* {isHovered && text && (
            <span className="marker-text">
              {text}
              {icons}
            </span>
          )} */}
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log("Checking if favorites is updated", store.favorites);
    actions.popFavorites();
  }, [store.favorites]);

  // useEffect(() => {
  //   const updateFavorites = () => {
  //     setFavorites(JSON.parse(sessionStorage.getItem("favorites")) || []);
  //   };
  //   window.addEventListener("storage", updateFavorites);
  //   return () => window.removeEventListener("storage", updateFavorites);
  // }, []);

  // useEffect(() => {
  //   const updateFavorites = () => {
  //     setFavorites(JSON.parse(sessionStorage.getItem("favorites")) || []);
  //   };

  //   window.addEventListener("storage", updateFavorites);

  //   // Call updateFavorites to immediately sync the state with sessionStorage
  //   updateFavorites();

  //   return () => window.removeEventListener("storage", updateFavorites);
  // }, [favorites]); // Add favorites to the dependency array

  return (
    <div className={`map-frame ${backSide ? "flipped" : ""}`}>
      {backSide ? (
        // New view when backSide is true
        <div>
          {hoveredItem && !backSide && (
            <ResourceCard
              item={hoveredItem}
              openModal={openModal}
              closeModal={closeModal}
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              selectedResource={selectedResource}
              setFavorites={setFavorites}
            />
          )}
          <div className="backside">
            {favorites && favorites.length > 0 && (
              <div>
                <p>FAVORITES</p>
                <div className="scroll-search-results favorites-scroll">
                  <ul>
                    {favorites.map((result, i) => (
                      <li key={i}>
                        <ResourceCard
                          item={result}
                          openModal={openModal}
                          closeModal={closeModal}
                          modalIsOpen={modalIsOpen}
                          setModalIsOpen={setModalIsOpen}
                          selectedResource={selectedResource}
                          setFavorites={setFavorites}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* {store.favorites && store.favorites.length > 0 && (
              <div>
                <p>FAVORITES</p>
                <div className="scroll-search-results">
                  <ul>
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
                  </ul>
                </div>
              </div>
            )} */}

            {store.boundaryResults && store.boundaryResults.length > 0 && (
              <div>
                <p>RESOURCES IN YOUR AREA</p>
                <div className="scroll-search-results">
                  <ul>
                    {store.boundaryResults.map((result, i) => (
                      <li key={i}>
                        <ResourceCard
                          item={result}
                          openModal={openModal}
                          closeModal={closeModal}
                          modalIsOpen={modalIsOpen}
                          setModalIsOpen={setModalIsOpen}
                          selectedResource={selectedResource}
                          setFavorites={setFavorites}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* {store.boundaryResults[0] && (
              <div className="scroll-headers">
                <Report />
              </div>
            )} */}
          </div>

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

          <MapSettings
            geoFindMe={geoFindMe}
            handleZipInputChange={handleZipInputChange}
            zipInput={zipInput}
          />
          {store.CATEGORY_OPTIONS &&
          store.DAY_OPTIONS &&
          store.GROUP_OPTIONS &&
          categories &&
          days &&
          groups ? (
            <ErrorBoundary>
              <div className="side-car">
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
              </div>
              <button
                className="flip-button"
                onClick={() => setBackSide(!backSide)}
              >
                Flip The Map
              </button>
            </ErrorBoundary>
          ) : (
            message2Open && <p>Loading selection options...</p>
          )}
        </>
      )}
    </div>
  );
};

export default SimpleMap;
