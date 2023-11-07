import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import arrow from "/assets/coralarrow.png";
import { ModalInfo } from "./ModalInfo";
import Styles from "../styles/generatedTreasureMap.css";

const GeneratedTreasureMap = ({ closeModal, selectedResources }) => {
  const { store, actions } = useContext(Context);

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

  return (
    <div className="modal-overlay-treasure" onClick={handleOverlayClick}>
      {/* Prevent the click from propagating to the overlay when it's inside the modal */}
      <div
        className="modal-content-treasure"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="options">
          <p className="option">Download Path</p>
          <p className="option">Send Path to Phone</p>
          <p className="option">Send Path to Email</p>
          <p className="option">Print Path</p>
        </div>
        <button className="modal-close-treasure" onClick={closeModal}>
          X
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
                {/* Ensure that the <hr /> is not commented out and is displayed between resources */}
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
