import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import arrow from "/assets/coralarrow.png"; // Make sure the path is correct
import { ModalInfo } from "./ModalInfo";
import Styles from "../styles/generatedTreasureMap.css";

const GeneratedTreasureMap = ({ closeModal, selectedResources }) => {
  const { store, actions } = useContext(Context);

  const getFormattedSchedule = (schedule) => {
    const formattedSchedule = {};
    Object.keys(schedule).forEach((day) => {
      // Check if the day's schedule exists and is not null before accessing start and end
      if (schedule[day] && schedule[day].start && schedule[day].end) {
        const start = formatTime(schedule[day].start);
        const end = formatTime(schedule[day].end);
        formattedSchedule[day] = `${start} - ${end}`;
      } else {
        // If the day's schedule doesn't exist or start/end is null, set to "Closed"
        formattedSchedule[day] = "Closed";
      }
    });
    return formattedSchedule;
  };

  // A utility function to format the time into a 12-hour format with AM/PM
  const formatTime = (time) => {
    if (!time || time.toLowerCase() === "closed") {
      return "Closed";
    }
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const isPM = hourInt >= 12;
    const formattedHour = isPM
      ? hourInt > 12
        ? hourInt - 12
        : hourInt
      : hourInt === 0
      ? 12
      : hourInt;
    return `${formattedHour}:${minute} ${isPM ? "PM" : "AM"}`;
  };

  const renderCarousel = (images, currentImageIndex, shiftLeft, shiftRight) => {
    // Assuming shiftLeft and shiftRight functions are defined within the context where this function is called
    return (
      <div className="carousel-container">
        {images.length > 1 && (
          <button className="arrow-button" onClick={shiftLeft}>
            <img className="left-arrow" src={arrow}></img>
          </button>
        )}

        <div className="carousel">
          <img
            className="carousel-image"
            src={images[currentImageIndex]}
            alt=""
          />
        </div>

        {images.length > 1 && (
          <button className="arrow-button" onClick={shiftRight}>
            <img className="right-arrow" src={arrow}></img>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="modal-overlay-treasure">
      <div className="modal-content-treasure">
        <button className="modal-close-treasure" onClick={closeModal}>
          X
        </button>
        <div className="resources-list">
          {selectedResources.map((resource, index) => {
            const processedCategories = actions.processCategory(
              resource.category
            );

            console.log(processedCategories, "prosscat");

            return (
              <div key={resource.id} className="modaContainer">
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
                      console.log(
                        `Icon Class Name for category ${category}: `,
                        iconClassName
                      ); //debug
                      const colorStyle = actions.getColorForCategory(category);
                      console.log(
                        `Color Style for category ${category}: `,
                        colorStyle
                      ); //  debug
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
                {selectedResources.indexOf(resource) <
                  selectedResources.length - 1 && <hr />}
              </div>
            );
          })}
        </div>
        <p className="option">Download your Path</p>
        <p className="option">Send Path to my phone</p>
        <p className="option">Print Path</p>
      </div>
    </div>
  );
};

export default GeneratedTreasureMap;
