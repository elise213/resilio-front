import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import ResourceCard from "./ResourceCard";

import "../styles/mapBack.css";
import Swal from "sweetalert2";

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
  selectedResources,
  setSelectedResources,
  city,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  // Function to update session storage whenever selectedResources changes
  const updateSessionStorage = (resources) => {
    sessionStorage.setItem("selectedResources", JSON.stringify(resources));
  };

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

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener(
        "setSelectedResources",
        handleSetSelectedResources
      );
    };
  }, [actions]); // No need to listen to selectedResources here

  const addSelectedResource = (resource) => {
    console.log("Adding resource", resource);

    // Check if the resource has latitude and longitude
    if (
      typeof resource.latitude === "undefined" ||
      typeof resource.longitude === "undefined"
    ) {
      console.error(
        "Attempted to add resource without latitude or longitude",
        resource
      );
      return;
    }

    setSelectedResources((prevResources) => {
      if (prevResources.length >= 3) {
        // Display an alert if the limit is reached
        Swal.fire({
          icon: "error",
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

  const imagePath = "/assets/path1.png";
  const handleCreateMyPathClick = () => {
    setIsGeneratedMapModalOpen(true);
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
              key={resource.id}
              item={resource}
              openModal={openModal}
              closeModal={closeModal}
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              selectedResources={selectedResources}
              addSelectedResource={addSelectedResource}
              removeSelectedResource={removeSelectedResource}
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
            <img className="path-img flip-horizontal" src={imagePath} />

            {selectedResources.map((resource, index) => (
              <React.Fragment key={resource.id}>
                <div
                  className="selected-item"
                  onClick={() => openModal(resource)}
                >
                  <div className="path-item">
                    <div className="path-icons">
                      {renderCategoryIcons(resource.category)}
                    </div>
                    <span className="path-name">{resource.name}</span>
                  </div>
                  <button
                    className="remove-path"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeSelectedResource(resource.id);
                    }}
                  >
                    Remove from Path
                  </button>
                  {/* flip-horizontal class for every other image based on index */}
                  <img
                    className={`path-img ${index % 2 ? "flip-horizontal" : ""}`}
                    src={imagePath}
                    alt={`Path to ${resource.name}`}
                  />
                </div>
              </React.Fragment>
            ))}

            <button className="createMyPath" onClick={handleCreateMyPathClick}>
              Create your Path
            </button>
          </div>

          <div
            className="map-container"
            style={{ height: "160px", width: "100%" }}
          >
            <GoogleMapReact
              bootstrapURLKeys={{ key: apiKey }}
              defaultZoom={11}
              center={city.center}
            >
              {selectedResources.map((resource, index) => {
                console.log(resource);

                if (!resource.latitude || !resource.longitude) {
                  console.error(
                    "Resource is missing latitude or longitude",
                    resource.id
                  );
                  return null;
                }

                return (
                  <Marker
                    lat={resource.latitude}
                    lng={resource.longitude}
                    text={resource.name}
                    key={resource.id}
                    id={resource.id}
                    openModal={openModal}
                    resource={resource}
                  />
                );
              })}
            </GoogleMapReact>
          </div>
        </div>
      ) : (
        <p>Add Resources to Your Path! </p>
      )}
      <div className="flip-div">
        <button className="flip-button" onClick={() => setBackSide(!backSide)}>
          Flip The Map
        </button>
      </div>
      <div className="back-container">
        {store.boundaryResults && store.boundaryResults.length > 0 && (
          <div className="list-container">
            <div className="scroll-title">
              <span>In your Area</span>
            </div>
            <ul className="all-ul">
              {store.boundaryResults.map((resource, index) => (
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
                />
              ))}
            </ul>
          </div>
        )}
        {store.favorites && store.favorites.length > 0 && (
          <div className="list-container">
            <div className="scroll-title">
              <span>Liked Resources</span>
            </div>
            <ul>
              {store.favorites.map((resource, index) => (
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
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default MapBack;
