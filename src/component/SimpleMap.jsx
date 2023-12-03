import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import MapBack from "./MapBack2";
import Buttons from "./Buttons";
import ResourceCard from "./ResourceCard";
// import MapSettings from "./MapSettings";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/simple_map.css";
import Button from "@mui/material/Button";

const SimpleMap = ({
  favorites,
  setFavorites,
  openModal,
  handleBoundsChange,
  isFavoritesOpen,
  setIsFavoritesOpen,
  isToolBoxOpen,
  setIsToolBoxOpen,
  isNavOpen,
  isDeckOpen,
  setIsDeckOpen,
  city,
  geoFindMe,
  handleZipInputChange,
  zipInput,
  userLocation,
  closeModal,
  modalIsOpen,
  setModalIsOpen,
  selectedResource,
  isGeneratedMapModalOpen,
  setIsGeneratedMapModalOpen,
  selectedResources,
  setSelectedResources,
  hoveredItem,
  setHoveredItem,
  addSelectedResource,
  removeSelectedResource,
  setBackSide,
  backSide,
  toggleNav,
  togglefavorites,
  toggleCardDeck,
  toggleFavoritesButtonRef,
  toggleToolButtonRef,
  toggleDeckButtonRef,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  const mapContainerRef = useRef(null);

  useEffect(() => {
    setFavorites(store.favorites);
    console.log("store favoritres updated!");
  }, [store.favorites]);

  useEffect(() => {
    console.log("local favorites updated!");
    console.log("state favorites", favorites);
    console.log("STOREFAV", store.favorites);
  }, [favorites]);

  useEffect(() => {
    const fetchMarkers = async () => {};
    if (city && city.bounds) {
      fetchMarkers();
    }
  }, [city]);

  // Function to calculate the closest corner
  const calculateClosestCorner = (cursorX, cursorY) => {
    const mapRect = mapContainerRef.current.getBoundingClientRect();
    const isCloserToTop = cursorY < (mapRect.top + mapRect.bottom) / 2;
    const isCloserToLeft = cursorX < (mapRect.left + mapRect.right) / 2;

    if (isCloserToTop && isCloserToLeft) {
      // console.log("top left");
      return "corner-top-left";
    } else if (isCloserToTop && !isCloserToLeft) {
      // console.log("top right");
      return "corner-top-right";
    } else if (!isCloserToTop && isCloserToLeft) {
      // console.log("bottom left");
      return "corner-bottom-left";
    } else {
      // console.log("bottom right");
      return "corner-bottom-right";
    }
  };

  const Marker = ({ text, id, result, markerColor }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [closestCornerClass, setClosestCornerClass] = useState("");

    const handleMouseEnter = (event) => {
      setIsHovered(true);
      setHoveredItem(result);

      // Calculate the position relative to the marker
      const markerRect = event.currentTarget.getBoundingClientRect();
      const cornerClass = calculateClosestCorner(
        markerRect.left + markerRect.width / 2,
        markerRect.top + markerRect.height / 2
      );
      setClosestCornerClass(cornerClass);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setHoveredItem(null);
    };

    const color = "red";
    let iconClass = "fa-solid fa-map-pin";

    return (
      <div
        className="marker"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={result ? () => openModal(result) : undefined}
      >
        {isHovered && result && (
          <div className={`hover-card ${closestCornerClass}`}>
            <ResourceCard
              key={result.id}
              item={result}
              openModal={openModal}
              closeModal={closeModal}
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              selectedResource={selectedResource}
              selectedResources={selectedResources}
              addSelectedResource={addSelectedResource}
              removeSelectedResource={removeSelectedResource}
            />
          </div>
        )}

        <div className="marker-icon">
          <i className={iconClass} style={{ color, zIndex: 0 }}></i>
        </div>
      </div>
    );
  };

  useEffect(() => {
    actions.popFavorites(setFavorites);
  }, [store.favorites]);

  return (
    <>
      <div className={`map-frame ${backSide ? "flipped" : ""}`}>
        {backSide ? (
          <>
            <MapBack
              toggleCardDeck={toggleCardDeck}
              togglefavorites={togglefavorites}
              hoveredItem={hoveredItem}
              setHoveredItem={setHoveredItem}
              openModal={openModal}
              closeModal={closeModal}
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              selectedResource={selectedResource}
              setFavorites={setFavorites}
              setBackSide={setBackSide}
              backSide={backSide}
              isGeneratedMapModalOpen={isGeneratedMapModalOpen}
              setIsGeneratedMapModalOpen={setIsGeneratedMapModalOpen}
              city={city}
              selectedResources={selectedResources}
              setSelectedResources={setSelectedResources}
              removeSelectedResource={removeSelectedResource}
              isFavoritesOpen={isFavoritesOpen}
              isDeckOpen={isDeckOpen}
              isNavOpen={isNavOpen}
              isToolBoxOpen={isToolBoxOpen}
              setIsToolBoxOpen={setIsToolBoxOpen}
              toggleFavoritesButtonRef={toggleFavoritesButtonRef}
              toggleDeckButtonRef={toggleDeckButtonRef}
              setIsFavoritesOpen={setIsFavoritesOpen}
              setIsDeckOpen={setIsDeckOpen}
            />
          </>
        ) : (
          <>
            <div className="map-container-container">
              {/* <p className="the-plan">THE MAP</p> */}
              <div
                ref={mapContainerRef}
                className="map-container"
                style={{ height: "70vh", width: "auto" }}
              >
                <GoogleMapReact
                  bootstrapURLKeys={{ key: apiKey }}
                  center={city.center}
                  bounds={city.bounds}
                  // center={{ lat: 24.681678475660995, lng: 84.99154781534179 }}
                  // bounds={{
                  //   ne: { lat: 25.0, lng: 85.2 },
                  //   sw: { lat: 24.4, lng: 84.8 },
                  // }}
                  defaultZoom={12}
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

                  {userLocation && (
                    <Marker
                      lat={userLocation.lat}
                      lng={userLocation.lng}
                      text="You are here!"
                      color="maroon"
                    />
                  )}
                </GoogleMapReact>
              </div>

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
            <div className="simple-selection"></div>
          </>
        )}
      </div>
    </>
  );
};

export default SimpleMap;
