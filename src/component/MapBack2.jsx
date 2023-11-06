import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import GoogleMapReact from "google-map-react";
import ResourceCard from "./ResourceCard";
import GeneratedTreasureMap from "./GeneratedTreasureMap";
import "../styles/mapBack.css"; // Assuming the path is correct

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
  city,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE;
  const { store, actions } = useContext(Context);

  // State to manage selected resources
  const [selectedResources, setSelectedResources] = useState(() => {
    const storedResources = sessionStorage.getItem("selectedResources");
    return storedResources ? JSON.parse(storedResources) : [];
  });

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
          className={`card-icon ${actions.getIconForCategory(category)}`}
          style={colorStyle ? colorStyle : {}}
        />
      );
    });
  };

  // useEffect to control scrolling when modal is open
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

  // Event listener for selected resources
  useEffect(() => {
    const handleSetSelectedResources = () => {
      setSelectedResources(actions.getSessionSelectedResources());
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

  // Sync selected resources with session storage
  useEffect(() => {
    const storedResources = actions.getSessionSelectedResources();
    if (JSON.stringify(storedResources) !== JSON.stringify(selectedResources)) {
      setSelectedResources(storedResources);
    }
  }, [actions, selectedResources]);

  // Marker component
  const Marker = ({ text, id, resource, markerColor }) => {
    const [isHovered, setIsHovered] = useState(false);

    const color = resource
      ? markerColor || actions.getColorForCategory(resource.category).color
      : markerColor || "red";

    let icons = [];
    let iconClass = "fa-solid fa-map-pin";

    if (resource) {
      const categories = actions.processCategory(resource.category);
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
    const handleSetSelectedResources = () => {
      setSelectedResources(actions.getSessionSelectedResources());
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

  const addSelectedResource = (resource) => {
    setSelectedResources((prevResources) => {
      if (!prevResources.some((r) => r.id === resource.id)) {
        const updatedResources = [...prevResources, resource];
        sessionStorage.setItem(
          "selectedResources",
          JSON.stringify(updatedResources)
        );
        return updatedResources;
      }
      return prevResources;
    });
  };

  const removeSelectedResource = (resourceId) => {
    setSelectedResources((prevResources) => {
      const updatedResources = prevResources.filter((r) => r.id !== resourceId);
      sessionStorage.setItem(
        "selectedResources",
        JSON.stringify(updatedResources)
      );
      return updatedResources;
    });
  };

  return (
    <>
      <button className="flip-button" onClick={() => setBackSide(!backSide)}>
        Flip The Map
      </button>
      <div className="path">
        <div className="selected-resources">
          {selectedResources.map((resource) => (
            <div key={resource.id} className="selected-item">
              <img src={imagePath} />
              <div className="path-icons">
                {renderCategoryIcons(resource.category)}
              </div>
              <span>{resource.name}</span>
            </div>
          ))}
        </div>
        <button className="createMyPath" onClick={handleCreateMyPathClick}>
          Create my Path
        </button>
      </div>

      <div className="map-container" style={{ height: "20vh", width: "30vw" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          defaultZoom={11}
          // defaultCenter={defaultMapCenter}
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

            // Return the Marker component.
            return (
              <Marker
                lat={resource.latitude}
                lng={resource.longitude}
                text={resource.name}
                key={resource.id}
                id={resource.id}
              />
            );
          })}
        </GoogleMapReact>
        {/* <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            defaultZoom={11}
            defaultCenter={defaultMapCenter}
            center={city.center}
          >
            {selectedResources.map((resource, index) => {
              // Logging the resource to the console before returning the Marker component.
              console.log(resource);

              // Check if the resource has the necessary lat/lng properties.
              if (!resource.latitude || !resource.longitude) {
                console.error(
                  "Resource is missing latitude or longitude",
                  resource
                );
                return null; // Don't render a marker if we don't have the necessary data.
              }

              // Return the Marker component.
              return (
                <Marker
                  lat={resource.latitude}
                  lng={resource.longitude}
                  text={resource.name}
                  key={resource.id}
                  id={resource.id}
                />
              );
            })}
          </GoogleMapReact> */}
      </div>

      <div className="back-container">
        {store.boundaryResults && store.boundaryResults.length > 0 && (
          <div className="list-container">
            <div className="scroll-title">
              <span>In your Area</span>
            </div>
            <ul>
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
              <span>Your Favorites</span>
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

      {isGeneratedMapModalOpen && (
        <GeneratedTreasureMap
          closeModal={() => setIsGeneratedMapModalOpen(false)}
          selectedResources={selectedResources}
        />
      )}
    </>
  );
};

export default MapBack;
