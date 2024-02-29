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
  toggleFavorite,
  isGeneratedMapModalOpen,
}) => {
  const { store, actions } = useContext(Context);

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const currentSchedule =
    store.schedules.find((each) => each.resource_id === id) || null;

  const schedule2 = filterNonNullValues(currentSchedule);

  const isEverydaySameSchedule = (formattedSchedule) => {
    const schedules = Object.values(formattedSchedule);
    return schedules.every((schedule) => schedule === schedules[0]);
  };

  const formattedSchedule = {};

  Object.keys(schedule2).forEach((key) => {
    const day = key.replace(/End|Start/g, "");
    const start = schedule2[`${day}Start`];
    const end = schedule2[`${day}End`];
    const formattedStart = formatTime(start);
    const formattedEnd = formatTime(end);
    const scheduleString =
      start && end && formattedStart !== "closed"
        ? `${formattedStart} - ${formattedEnd}`
        : "Closed";
    formattedSchedule[day] = scheduleString;
  });

  const everydaySameSchedule = isEverydaySameSchedule(formattedSchedule);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token, modalIsOpen]);

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

  // Consolidate the two formatTime functions into a single, corrected one
  function formatTime(time) {
    if (time === "closed") {
      return "Closed";
    }
    if (!time) {
      return "";
    }
    let [hour, minute] = time.split(":");
    let numericHour = parseInt(hour, 10);
    let suffix = numericHour >= 12 ? "p.m." : "a.m.";
    if (numericHour > 12) {
      numericHour -= 12;
    } else if (numericHour === 0) {
      numericHour = 12; // Handle midnight as 12 AM
    }
    return `${numericHour}:${minute} ${suffix}`;
  }

  return (
    <>
      {/* ADDRESS */}
      {res.address && (
        <div className="info-address">
          {/* <i className="fa-solid fa-map-pin"></i> */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              res.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-text"
          >
            {res.address}
          </a>
        </div>
      )}

      {/* DESCRIPTION */}
      {res.description && (
        <p className="modal-description">
          {isReadMore ? `${res.description.slice(0, 200)}...` : res.description}
          {res.description.length > 200 && (
            <span onClick={toggleReadMore} className="read-more">
              {isReadMore ? "Read more" : "Show less"}
            </span>
          )}
        </p>
      )}

      {!isGeneratedMapModalOpen && isLoggedIn && (
        <Button
          variant="contained"
          color="primary"
          className="add-favorite"
          onClick={(event) => toggleFavorite(event)}
        >
          {isFavorited ? (
            <>
              <span className="material-symbols-outlined">remove</span>
              <span>remove from favorites</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">add</span>{" "}
              <span> add to favorites</span>
            </>
          )}
        </Button>
      )}

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
        {/* {Object.keys(formattedSchedule).length > 0 && (
          <div className=" info">
            {Object.entries(formattedSchedule).map(([day, schedule], index) => (
              <p
                key={index}
                className="modal-center"
                style={{
                  color: schedule !== "Closed" ? "green" : "grey",
                }}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}: {schedule}
              </p>
            ))}
          </div>
        )} */}

        {Object.keys(formattedSchedule).length > 0 && (
          <div className="info">
            {everydaySameSchedule ? (
              <p
                className="modal-center"
                style={{
                  color:
                    formattedSchedule.monday !== "Closed" ? "green" : "grey",
                }}
              >
                Everyday: {formattedSchedule.monday}
              </p>
            ) : (
              Object.entries(formattedSchedule).map(
                ([day, schedule], index) => (
                  <p
                    key={index}
                    className="modal-center"
                    style={{
                      color: schedule !== "Closed" ? "green" : "grey",
                    }}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}: {schedule}
                  </p>
                )
              )
            )}
          </div>
        )}
        <Carousel res={res} />
      </div>
    </>
  );
};
