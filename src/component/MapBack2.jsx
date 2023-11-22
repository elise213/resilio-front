import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import ResourceCard from "./ResourceCard";
import MyDocument from "./MyDocument";

import "../styles/mapBack.css";

const MapBack = ({
  setBackSide,
  backSide,
  setIsGeneratedMapModalOpen,
  isGeneratedMapModalOpen,
  openModal,
  closeModal,
  hoveredItem,
  setHoveredItem,
  modalIsOpen,
  setModalIsOpen,
  addSelectedResource,
  removeSelectedResource,
  selectedResources,
  setSelectedResources,
  setFavorites,
  city,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);
  const [isLargeScreen, setIsLargeScreen] = useState(store.isLargeScreen);

  useEffect(() => {
    setIsLargeScreen(store.isLargeScreen);
  }, [store.isLargeScreen]);

  // Event listener for selected resources
  useEffect(() => {
    const handleSetSelectedResources = () => {
      const sessionResources = actions.getSessionSelectedResources();
      setSelectedResources(sessionResources);
    };
    document.addEventListener(
      "setSelectedResources",
      handleSetSelectedResources
    );
    return () => {
      document.removeEventListener(
        "setSelectedResources",
        handleSetSelectedResources
      );
    };
  }, [actions]);

  const imagePath = "/assets/path1.png";

  const handleCreateMyPathClick = () => {
    setIsGeneratedMapModalOpen(true);
    // Code to generate the PDF
  };

  const renderCategoryIcons = (categoryString) => {
    let categories;
    if (typeof categoryString === "string") {
      // Split by comma and trim each category to ensure no extra whitespace
      categories = categoryString.split(",").map((cat) => cat.trim());
    } else if (Array.isArray(categoryString)) {
      categories = categoryString;
    } else {
      // If category is neither a string nor an array, return an empty array
      categories = [];
    }
    // Map over categories and create an icon for each
    return categories.map((category, index) => {
      const colorStyle = actions.getColorForCategory(category);
      return (
        <i
          key={index}
          className={`path-icon ${actions.getIconForCategory(category)}`}
          style={colorStyle ? colorStyle : {}}
        />
      );
    });
  };

  // control scrolling when modal is open
  useEffect(() => {
    const body = document.body;
    const grandContainer = document.querySelector(".grand-container");
    const disableScroll = () => {
      body.style.overflow = "hidden";
      if (grandContainer) grandContainer.style.overflow = "hidden";
    };
    const enableScroll = () => {
      body.style.overflow = "auto";
      if (grandContainer) grandContainer.style.overflow = "auto";
    };

    isGeneratedMapModalOpen ? disableScroll() : enableScroll();

    return () => enableScroll();
  }, [isGeneratedMapModalOpen]);

  useEffect(() => {
    const body = document.body;
    const grandContainer = document.querySelector(".grand-container");
    const disableScroll = () => {
      body.style.overflow = "hidden";
      if (grandContainer) grandContainer.style.overflow = "hidden";
    };
    const enableScroll = () => {
      body.style.overflow = "auto";
      if (grandContainer) grandContainer.style.overflow = "auto";
    };

    isGeneratedMapModalOpen ? disableScroll() : enableScroll();

    return () => enableScroll();
  }, [isGeneratedMapModalOpen]);

  // Marker component
  const Marker = ({ text, id, resource, markerColor }) => {
    const [isHovered, setIsHovered] = useState(false);

    const color = "red";

    let icons = <i className="fa-solid fa-map-pin"></i>;

    return (
      <div
        className="marker"
        style={{ cursor: "pointer", color, position: "relative" }}
        onMouseEnter={() => {
          setIsHovered(true);
          setHoveredItem(resource);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredItem(null);
        }}
        onClick={resource ? () => openModal(resource) : undefined}
      >
        {isHovered && resource && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              width: "300px",
              zIndex: 99999,
            }}
          >
            <ResourceCard
              key={resource.name}
              // key={`resource-${resource.id}-${index}`}
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
          </div>
        )}
        <div className="marker-icon">{icons}</div>
      </div>
    );
  };

  return (
    <>
      {selectedResources[0] ? (
        <div className="path">
          <div className="selected-resources">
            <p>THE PLAN</p>
            {selectedResources.map((resource, index) => (
              <React.Fragment key={resource.id}>
                <div
                  className="selected-item"
                  onClick={() => openModal(resource)}
                >
                  <div className="path-item">
                    <span className="path-name">{resource.name}</span>
                  </div>
                  <div className="bottom-row-path">
                    <button
                      className="remove-path"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeSelectedResource(resource.id);
                      }}
                    >
                      Remove From Plan
                      {/* <i className="fa-solid fa-x"></i> */}
                    </button>
                    <div className="path-icons">
                      {renderCategoryIcons(resource.category)}
                    </div>
                  </div>

                  {/* flip-horizontal class for every other image based on index */}
                  {/* <img
                    className={`path-img ${index % 2 ? "flip-horizontal" : ""}`}
                    src={imagePath}
                    alt={`Path to ${resource.name}`}
                  /> */}
                </div>
              </React.Fragment>
            ))}

            <button className="createMyPath" onClick={handleCreateMyPathClick}>
              View Plan
            </button>
          </div>
        </div>
      ) : (
        <p className="scroll-title">
          Add Resources <br /> To Your Path
        </p>
      )}
    </>
  );
};

export default MapBack;
