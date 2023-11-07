import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Context } from "../store/appContext";
import MapBack from "./MapBack2";
import Login from "../component/Login.jsx";

import Selection from "./Selection";
import ResourceCard from "./ResourceCard";
import ErrorBoundary from "./ErrorBoundary";
import MapSettings from "./MapSettings";
import Report from "./Report";
import GoogleMapReact from "google-map-react";
import Styles from "../styles/simple_map.css";
import RESR from "/assets/RESILIOO.png";

const AltSimpleMap = ({
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
  const [isGeneratedMapModalOpen, setIsGeneratedMapModalOpen] = useState(false);

  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favorites")) || []
  );

  const [hoveredItem, setHoveredItem] = useState(null);

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
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log("Checking if favorites is updated", store.favorites);
    actions.popFavorites();
  }, [store.favorites]);

  return (
    <div
      className={`map-frame-wrapper ${backSide ? "flipped" : ""} ${
        isGeneratedMapModalOpen ? "noPadding" : ""
      }`}
    >
      <div className={`map-frame `}>
        <div className="logo-div">
          <img className="navbar-logo" src={RESR} alt="Alive Logo" />
        </div>
        <div className="map-head">
          <Login />
          <button
            className="flip-button"
            onClick={() => setBackSide(!backSide)}
          >
            Flip The Map
          </button>
        </div>

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
            />
          </>
        ) : (
          <>
            <div
              className="map-container"
              style={{ height: "40vh", width: "0vw" }}
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
            <div className="simple-selection">
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
                </ErrorBoundary>
              ) : (
                message2Open && <p>Loading selection options...</p>
              )}

              <MapSettings
                geoFindMe={geoFindMe}
                handleZipInputChange={handleZipInputChange}
                zipInput={zipInput}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AltSimpleMap;
