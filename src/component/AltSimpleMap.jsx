import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import MapBack from "./MapBack2";

import ResourceCard from "./ResourceCard";
import MapSettings from "./MapSettings";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/simple_map.css";

const AltSimpleMap = ({
  openModal,
  handleBoundsChange,
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
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);
  const [backSide, setBackSide] = useState(false);

  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favorites")) || []
  );

  const addSelectedResource = (resource) => {
    console.log("Adding resource", resource);

    setSelectedResources((prevResources) => {
      if (prevResources.length >= 3) {
        // Display an alert if the limit is reached
        Swal.fire({
          // icon: "error",
          title: "Please limit the path to 3 resources at a time",
        });
        return prevResources;
      }

      if (!prevResources.some((r) => r.id === resource.id)) {
        const updatedResources = [...prevResources, resource];
        console.log("Updated Resources", updatedResources);
        updateSessionStorage(updatedResources);
        return updatedResources;
      }
      return prevResources;
    });
  };

  const removeSelectedResource = (resourceId) => {
    setSelectedResources((prevResources) => {
      const updatedResources = prevResources.filter((r) => r.id !== resourceId);
      updateSessionStorage(updatedResources);
      return updatedResources;
    });
  };

  useEffect(() => {
    // Update local state when store.favorites changes
    setFavorites(store.favorites);
    console.log("store favoritres updated!");
  }, [store.favorites]);

  // Function to update session storage whenever selectedResources changes
  const updateSessionStorage = (resources) => {
    sessionStorage.setItem("selectedResources", JSON.stringify(resources));
  };

  useEffect(() => {
    console.log("local favorites updated!");
    console.log("state favorites", favorites);

    console.log("STOREFAV", store.favorites);
  }, [favorites]);

  const Marker = ({ text, id, result, markerColor }) => {
    const [isHovered, setIsHovered] = useState(false);

    const color = "red";

    let icons = [<i className="fa-solid fa-map-pin"></i>];
    let iconClass = "fa-solid fa-map-pin";

    return (
      <div
        className="marker"
        style={{ cursor: "pointer", color, position: "relative" }}
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
          <i className={iconClass} style={{ color }}></i>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // console.log("Checking if favorites is updated", store.favorites);
    actions.popFavorites(setFavorites);
  }, [store.favorites]);

  return (
    <>
      <div
        className={`map-frame-wrapper ${backSide ? "flipped" : ""} ${
          isGeneratedMapModalOpen ? "noPadding" : ""
        }`}
      >
        <div className={`map-frame ${backSide ? "alsoFlipped" : ""}`}>
          <div className="map-head"></div>

          {backSide ? (
            <>
              <MapBack
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
              />
            </>
          ) : (
            <>
              <div className="map-container-container">
                <div
                  className="map-container"
                  style={{ height: "40vh", width: "60vw" }}
                >
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: apiKey }}
                    center={city.center}
                    bounds={city.bounds}
                    defaultZoom={25}
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
                        color="red"
                      />
                    )}
                  </GoogleMapReact>
                </div>
              </div>
              <div className="simple-selection">
                <MapSettings
                  geoFindMe={geoFindMe}
                  handleZipInputChange={handleZipInputChange}
                  zipInput={zipInput}
                  backSide={backSide}
                  setBackSide={setBackSide}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className={`back-container ${store.favorites ? "column-class" : ""}`}
      >
        {!store.favorites ||
          (!(store.favorites.length > 0) && (
            <div className="favorites-warning-div">
              <div className="scroll-title">
                <span>Log in to save favorites</span>
              </div>
            </div>
          ))}
        {store.boundaryResults && store.boundaryResults.length > 0 && (
          <div className="list-container">
            <div className="scroll-title">
              <span>Resources in your Area</span>
            </div>
            <ul className="all-ul">
              {Array.isArray(store.mapResults) &&
                store.mapResults.map((resource, index) => (
                  <ResourceCard
                    key={resource.id}
                    item={resource}
                    openModal={openModal}
                    closeModal={closeModal}
                    modalIsOpen={modalIsOpen}
                    setModalIsOpen={setModalIsOpen}
                    selectedResources={selectedResources}
                    addSelectedResource={addSelectedResource}
                    removeSelectedResource={removeSelectedResource}
                    setFavorites={setFavorites}
                  />
                ))}
            </ul>
          </div>
        )}
        {store.favorites && store.favorites.length > 0 ? (
          <div className="list-container">
            <div className="scroll-title">
              <span>Liked Resources</span>
            </div>
            <ul>
              {favorites.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  item={resource}
                  openModal={openModal}
                  closeModal={closeModal}
                  modalIsOpen={modalIsOpen}
                  setModalIsOpen={setModalIsOpen}
                  selectedResources={selectedResources}
                  addSelectedResource={addSelectedResource}
                  removeSelectedResource={removeSelectedResource}
                  setFavorites={setFavorites}
                />
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default AltSimpleMap;
