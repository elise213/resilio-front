import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Context } from "../store/appContext";
import MapBack from "./MapBack2";
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
  const [selectedResources, setSelectedResources] = useState([]);
  const [backSide, setBackSide] = useState(false);
  const [draggingItem, setDraggingItem] = useState(null);
  const [initialOffset, setInitialOffset] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratedMapModalOpen, setIsGeneratedMapModalOpen] = useState(false);

  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favorites")) || []
  );

  const [hoveredItem, setHoveredItem] = useState(null);

  const onBeforeCapture = (start) => {
    setDraggingItem(start.draggableId);
  };

  const onDragEnd = (result) => {
    console.log("onDragEnd", result);
    const { destination, source } = result;

    // If dropped outside the list
    if (!destination) {
      return;
    }

    // If the position has not changed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handling the case when the source and destination are the same
    // In this case, you just reorder the list
    if (destination.droppableId === source.droppableId) {
      const newSelectedResources = Array.from(selectedResources);
      const [removed] = newSelectedResources.splice(source.index, 1);
      newSelectedResources.splice(destination.index, 0, removed);

      setSelectedResources(newSelectedResources);
    } else {
      // Handle the case when the source and destination are different
      // Here, you add the item to the destination list without removing it from the source
      const sourceList = store[source.droppableId]; // Assuming you have your source items stored in the 'store' state
      const destinationList = selectedResources;
      const item = sourceList[source.index]; // Get the dragged item

      // Add the item to the destination list
      const newDestinationList = Array.from(destinationList);
      newDestinationList.splice(destination.index, 0, item);

      setSelectedResources(newDestinationList);

      // Optionally, if you need to perform any additional state updates, do it here
      // For example, if you need to update something in your store state
      // actions.updateStoreWithNewState(...);
    }

    setIsDragging(false);
    setDraggingItem(null);
    setInitialOffset(null);
    setCurrentOffset(null);
  };

  const onDragStart = (start) => {
    setIsDragging(true);
  };

  const onDragUpdate = (update) => {
    if (update.initial && update.initial.source) {
      setInitialOffset(update.initial.source.clientOffset);
    }
    if (update.source) {
      setCurrentOffset(update.source.clientOffset);
    }
  };

  const createPath = () => {
    // Use selectedResources to create a path
    console.log("Selected Resources for path:", selectedResources);
  };

  const getDragLayerStyles = (initialOffset, currentOffset) => {
    if (!initialOffset || !currentOffset) {
      return {
        display: "none",
      };
    }

    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;

    return {
      transform,
      WebkitTransform: transform,
      touchAction: "none",
      position: "fixed",
      pointerEvents: "none",
      zIndex: 100,
      left: 0,
      top: 0,
    };
  };

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
        {backSide ? (
          <>
            <DragDropContext
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
              onDragUpdate={onDragUpdate}
              onBeforeCapture={onBeforeCapture}
            >
              <MapBack
                hoveredItem={hoveredItem}
                openModal={openModal}
                closeModal={closeModal}
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                selectedResource={selectedResource}
                setFavorites={setFavorites}
                setBackSide={setBackSide}
                backSide={backSide}
                setDraggingItem={setDraggingItem}
                onBeforeCapture={onBeforeCapture}
                isGeneratedMapModalOpen={isGeneratedMapModalOpen}
                setIsGeneratedMapModalOpen={setIsGeneratedMapModalOpen}
              />
            </DragDropContext>
          </>
        ) : (
          <>
            <button
              className="flip-button"
              onClick={() => setBackSide(!backSide)}
            >
              Flip The Map
            </button>
            <div className="logo-div">
              <img className="navbar-logo" src={RESR} alt="Alive Logo" />
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
              </ErrorBoundary>
            ) : (
              message2Open && <p>Loading selection options...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AltSimpleMap;
