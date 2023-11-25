import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import arrow from "/assets/coralarrow.png";
import { ModalInfo } from "./ModalInfo";
import Styles from "../styles/generatedTreasureMap.css";
import GoogleMapReact from "google-map-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";

const GeneratedTreasureMap = ({
  closeModal,
  openModal,
  modalIsOpen,
  selectedResources,
  selectedResource,
  setHoveredItem,
  hoveredItem,
  isFavorited,
  handleToggleSelectResource,
  setShowRating,
  setIsFavorited,
  isGeneratedMapModalOpen,
  addSelectedResource,
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

  const toggleFavorite = (event) => {
    event.stopPropagation();
    setIsFavorited(!isFavorited);

    if (isFavorited) {
      actions.removeFavorite(item.name, setFavorites);
    } else {
      actions.addFavorite(item.name, setFavorites);
    }
  };
  useEffect(() => {
    const rootElement = document.documentElement;
    const originalOverflow = rootElement.style.overflow;

    rootElement.style.overflow = "hidden";

    return () => {
      rootElement.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="modal-overlay-treasure" onClick={handleOverlayClick}>
      <div
        className="modal-content-treasure"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="options">
          <p className="option">Email Plan</p>

          <PDFDownloadLink
            document={<MyDocument />}
            fileName="mypath.pdf"
            className="option"
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Download Plan"
            }
          </PDFDownloadLink>
          <p className="option">Print Plan</p>
        </div>

        <button className="modal-close-treasure" onClick={closeModal}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="resources-list">
          {selectedResources &&
            selectedResources.map((resource, index) => {
              const processedCategories = actions.processCategory(
                resource.category
              );

              return (
                <React.Fragment key={resource.id}>
                  <div className="modalContainer">
                    <div className="resource-category-icons">
                      {processedCategories &&
                        processedCategories.map((category, categoryIndex) => {
                          const iconClassName =
                            actions.getIconForCategory(category);
                          const colorStyle =
                            actions.getColorForCategory(category);

                          return (
                            <i
                              key={`${resource.id}-${categoryIndex}`}
                              className={`${iconClassName} card-icon`}
                              style={colorStyle || {}}
                            />
                          );
                        })}
                    </div>
                    <div className="number-box">
                      <span>{index + 1}</span>
                    </div>
                    <div className="title-box">
                      <span>{resource.name}</span>
                    </div>

                    <ModalInfo
                      id={resource.id}
                      item={resource}
                      schedule={resource.schedule}
                      res={resource}
                      modalIsOpen={modalIsOpen}
                      isFavorited={isFavorited}
                      handleToggleSelectResource={handleToggleSelectResource}
                      setShowRating={setShowRating}
                      toggleFavorite={toggleFavorite}
                      isGeneratedMapModalOpen={isGeneratedMapModalOpen}
                      selectedResources={selectedResources}
                      addSelectedResource={addSelectedResource}
                    />
                  </div>
                  {/* {index < selectedResources.length - 1 && <hr />} */}
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default GeneratedTreasureMap;
