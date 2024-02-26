import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { ModalMap } from "./ModalMap";
import Carousel from "./Carousel";
import Button from "@mui/material/Button";

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
      <Carousel res={res} />

      {/* DESCRIPTION */}

      <div className="description-div">
        {!isGeneratedMapModalOpen && (
          <div className="buttons-modal">
            {/* <Button
              variant="contained"
              color="primary"
              className={isSelected ? "remove-path" : "add-path"}
              onClick={handleToggleSelectResource}
            >
              {isSelected ? "remove from plan" : "add to plan"}
            </Button> */}
            {isLoggedIn && (
              <div className="modal-button-container">
                <button
                  className="add-favorite"
                  onClick={(event) => toggleFavorite(event)}
                >
                  {/* {isFavorited ? (
                    <i
                      className="fa-solid fa-heart"
                      style={{ color: "red" }}
                    ></i>
                  ) : (
                    <i className="fa-regular fa-heart"></i>
                  )} */}
                  {isFavorited ? "remove favorite" : "add favorite"}
                </button>

                <button onClick={() => setShowRating(true)} className="submit">
                  Rate
                </button>
              </div>
            )}
          </div>
        )}
        {res.description && (
          <div className="text-description-div">
            <p className="modal-text description">{res.description}</p>
          </div>
        )}
      </div>

      <div className="info-map-div">
        <div className="details-div">
          <div className="details-column">
            {/* WEBSITE */}
            {res.website && (
              <div className="info">
                <i
                  style={{ color: "blue" }}
                  className="fa-solid fa-earth-americas"
                ></i>
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
        {/* {res.latitude && res.longitude && (
          <div className="modal-map">
            <ModalMap
              res={res}
              latitude={res.latitude}
              longitude={res.longitude}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};
