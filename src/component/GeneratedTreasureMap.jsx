import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import arrow from "/assets/coralarrow.png";
import { ModalInfo } from "./ModalInfo";
import Styles from "../styles/generatedTreasureMap.css";
import GoogleMapReact from "google-map-react";

const GeneratedTreasureMap = ({
  closeModal,
  openModal,
  selectedResources,
  city,
  hoveredItem,
  setHoveredItem,
}) => {
  const { store, actions } = useContext(Context);
  const apiKey = import.meta.env.VITE_GOOGLE;
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  console.log("IsLS", isLargeScreen);

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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // add an event listener to the document when the modal is open and remove it when the modal is closed
  useEffect(() => {
    //  disable scroll on the body when the modal is open
    document.body.style.overflow = "hidden";

    //re-enable scrolling and remove event listener
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const rootElement = document.documentElement;

    // Store the original value of the overflow property so it can be restored later
    const originalOverflow = rootElement.style.overflow;

    // Disable scrolling on the root element
    rootElement.style.overflow = "hidden";

    // re-enable scrolling when the modal is closed
    return () => {
      // Restore the original overflow value
      rootElement.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    setIsLargeScreen(store.isLargeScreen);
  }, [store.isLargeScreen]);

  return (
    <div className="modal-overlay-treasure" onClick={handleOverlayClick}>
      {/* Prevent the click from propagating to the overlay when it's inside the modal */}
      <div
        className="modal-content-treasure"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="options-path-map">
          {/* {isLargeScreen && ( */}
          <div
            className="map-container-treasure"
            style={{ height: "25vh", width: "100%" }}
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
          {/* )} */}
          <div className="options">
            <p className="option">Download Path</p>
            <p className="option">Send Path to Phone</p>
            <p className="option">Send Path to Email</p>
            <p className="option">Print Path</p>
          </div>
        </div>
        <button className="modal-close-treasure" onClick={closeModal}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="resources-list">
          {selectedResources.map((resource, index) => {
            const processedCategories = actions.processCategory(
              resource.category
            );

            // Return a React.Fragment with a key instead of the shorthand fragment
            // This is important for React's rendering of lists
            return (
              <React.Fragment key={resource.id}>
                <div className="modalContainer">
                  <div className="number-box">
                    <span>{index + 1}</span>
                  </div>
                  <div className="title-box">
                    <span>{resource.name}</span>
                  </div>
                  <div className="resource-category-icons">
                    {processedCategories &&
                      processedCategories.map((category, categoryIndex) => {
                        const iconClassName =
                          actions.getIconForCategory(category);
                        const colorStyle =
                          actions.getColorForCategory(category);

                        // Use a different key for each category to avoid key conflicts
                        return (
                          <i
                            key={`${resource.id}-${categoryIndex}`}
                            className={`${iconClassName} card-icon`}
                            style={colorStyle || {}}
                          />
                        );
                      })}
                  </div>

                  <ModalInfo
                    id={resource.id}
                    schedule={resource.schedule}
                    res={resource}
                  />
                </div>
                {/* WHY aren't these hr's showing up?? */}
                <hr />
                {index < selectedResources.length - 1 && <hr />}
              </React.Fragment>
            );
          })}

          {/* {selectedResources.map((resource, index) => {
            const processedCategories = actions.processCategory(
              resource.category
            );

            return (
              <>
                <div key={resource.id} className="modalContainer">
                  <div className="options">
                    <p className="option">Download Path</p>
                    <p className="option">Send Path to Phone</p>
                    <p className="option">Send Path to Email</p>
                    <p className="option">Print Path</p>
                  </div>
                  <div className="number-box">
                    <span>{index + 1}</span>
                  </div>
                  <div className="title-box">
                    <span>{resource.name}</span>
                  </div>
                  <div className="resource-category-icons">
                    {processedCategories &&
                      processedCategories.map((category, index) => {
                        const iconClassName =
                          actions.getIconForCategory(category);

                        const colorStyle =
                          actions.getColorForCategory(category);

                        return (
                          <i
                            key={index}
                            className={`${iconClassName} card-icon`}
                            style={colorStyle || {}}
                          />
                        );
                      })}
                  </div>

                  <ModalInfo
                    id={resource.id}
                    schedule={resource.schedule}
                    res={resource}
                  />
                </div>
                {index < selectedResources.length - 1 && <hr />}
              </>
            );
          })} */}
        </div>
      </div>
    </div>
  );
};

export default GeneratedTreasureMap;
