import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import MapBack from "./MapBack2";

import ResourceCard from "./ResourceCard";
import MapSettings from "./MapSettings";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/simple_map.css";

const AltSimpleMap = ({
  favorites,
  setFavorites,
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
  addSelectedResource,
  removeSelectedResource,
  setBackSide,
  backSide,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  useEffect(() => {
    // Update local state when store.favorites changes
    setFavorites(store.favorites);
    console.log("store favoritres updated!");
  }, [store.favorites]);

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
                  style={{ height: "45vh", width: "auto" }}
                >
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: apiKey }}
                    center={city.center}
                    bounds={city.bounds}
                    defaultZoom={10}
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
    </>
  );
};

export default AltSimpleMap;
