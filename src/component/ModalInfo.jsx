import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { ModalMap } from "./ModalMap";
import arrow from "/assets/coralarrow.png";
import styles from "../styles/resourceModal.css";

export const ModalInfo = ({
  res,
  id,
  modalIsOpen,
  isFavorited,
  addSelectedResource,
  setShowRating,
  toggleFavorite,
  isGeneratedMapModalOpen,
  selectedResources,
  selectedResource,
  removeSelectedResource,
}) => {
  const { store, actions } = useContext(Context);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const handleDeselectResource = (resourceId) => {
    removeSelectedResource(resourceId);
  };

  const handleToggleSelectResource = (event) => {
    event.stopPropagation();
    console.log("hnadleToggleSelectR");
    if (isSelected) {
      handleDeselectResource(res.id);
    } else {
      handleSelectResource(res);
    }
  };

  const handleSelectResource = (resource) => {
    addSelectedResource(resource);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token, modalIsOpen]);

  const images = [
    res.image,
    res.image2,
    res.image3,
    res.image4,
    res.image5,
  ].filter(Boolean);

  // const res = res || {};

  function filterNonNullValues(schedule) {
    const result = {};
    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    daysOfWeek.forEach((day) => {
      if (!schedule) return;
      const startKey = `${day}Start`;
      const endKey = `${day}End`;
      if (schedule[startKey] !== null && schedule[endKey] !== null) {
        result[startKey] = schedule[startKey];
        result[endKey] = schedule[endKey];
      } else {
        result[startKey] = "closed";
        result[endKey] = "closed";
      }
    });
    return result;
  }

  function changeImage(newIndex) {
    const imageElement = document.querySelector(".carousel-image");
    imageElement.style.opacity = "0";

    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      imageElement.style.opacity = "1";
    }, 500); // This duration should match the transition duration in the CSS
  }

  function shiftLeft() {
    let newIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    changeImage(newIndex);
  }

  function shiftRight() {
    let newIndex =
      currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    changeImage(newIndex);
  }

  function formatTime(time) {
    if (time === "closed") {
      return "closed";
    }
    if (!time) {
      return "";
    }

    const [hour, minute] = time.split(":");
    let formattedTime = time;

    if (parseInt(hour) > 12) {
      formattedTime = `${parseInt(hour) - 12}:${minute} p.m.`;
    } else {
      formattedTime = `${hour}:${minute} a.m.`;
    }
    return formattedTime;
  }

  const isSelected =
    Array.isArray(selectedResources) &&
    selectedResources.some((resource) => resource.id === res.id);

  const currentSchedule =
    store.schedules.find((each) => each.resource_id === id) || null;
  const schedule2 = filterNonNullValues(currentSchedule);
  const formattedSchedule = {};

  schedule2 != undefined
    ? Object.keys(schedule2).forEach((key) => {
        const day = key.replace(/End|Start/g, "");
        const start = schedule2[`${day}Start`];
        const end = schedule2[`${day}End`];
        const formattedStart = formatTime(start);
        const formattedEnd = formatTime(end);
        formattedSchedule[day] =
          start && end && formattedStart !== "closed"
            ? `${formattedStart} - ${formattedEnd}`
            : "Closed";
      })
    : "";

  return (
    <div className="resource-info">
      {images.length > 0 && (
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
      )}

      {/* DESCRIPTION */}

      <div className="description-div">
        {!isGeneratedMapModalOpen && (
          <>
            <button
              className={isSelected ? "remove-path-card" : "add-path"}
              onClick={handleToggleSelectResource}
            >
              {isSelected ? (
                <>
                  <span>Remove</span>
                  <span>from Plan</span>
                </>
              ) : (
                <>
                  <span>Add</span>
                  <span>to Plan</span>
                </>
              )}
            </button>
            {isLoggedIn && (
              <div className="modal-button-container">
                <button
                  className="add-favorite"
                  onClick={(event) => toggleFavorite(event)}
                >
                  {isFavorited ? (
                    <i
                      className="fa-solid fa-heart"
                      style={{ color: "red" }}
                    ></i>
                  ) : (
                    <i className="fa-regular fa-heart"></i>
                  )}
                </button>
                {/* <div className="rate-this-resource-toggle"> */}
                <button onClick={() => setShowRating(true)} className="submit">
                  Rate
                </button>
                {/* </div> */}
              </div>
            )}
            {res.description && (
              <div className="text-description-div">
                <p className="modal-text description">{res.description}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="info-map-div">
        <div className="details-div">
          <div className="details-column">
            {/* WEBSITE */}
            {res.website && (
              <div className="info">
                <i className="fa-solid fa-earth-americas"></i>
                <a
                  href={`https://www.${res.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-text"
                >
                  Visit Website
                </a>
              </div>
            )}

            {/* SCHEDULE */}
            {Object.keys(formattedSchedule).length > 0 && (
              <div className=" info">
                {/* <i className="fa-solid fa-calendar-check"></i> */}
                <div className="sched-div">
                  {Object.entries(formattedSchedule).map(
                    ([day, schedule], index) => (
                      <p
                        key={index}
                        className="modal-center"
                        style={{
                          color: schedule !== "Closed" ? "green" : "inherit",
                        }}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}: {schedule}
                      </p>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* MAP */}
        {res.latitude && res.longitude && (
          <div className="modal-map">
            <ModalMap
              res={res}
              latitude={res.latitude}
              longitude={res.longitude}
            />
          </div>
        )}
      </div>
    </div>
  );
};
