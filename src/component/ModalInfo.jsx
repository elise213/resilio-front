import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { ModalMap } from "./ModalMap";
import Carousel from "./Carousel";
import Button from "@mui/material/Button";
import styles from "../styles/resourceModal.css";

export const ModalInfo = ({
  res,
  id,
  modalIsOpen,
  isFavorited,
  setIsFavorited,
  isGeneratedMapModalOpen,
}) => {
  const { store, actions } = useContext(Context);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const toggleFavorite = (event) => {
    event.stopPropagation();

    console.log("sending favorite id", id);
    if (isFavorited) {
      actions.removeFavorite(id);
    } else {
      actions.addFavorite(id);
    }
    setIsFavorited(!isFavorited);
  };

  const currentSchedule =
    store.schedules.find((each) => each.resource_id === id) || null;

  const schedule2 = filterNonNullValues(currentSchedule);

  const isEverydaySameSchedule = (formattedSchedule) => {
    const schedules = Object.values(formattedSchedule);
    return schedules.every((schedule) => schedule === schedules[0]);
  };

  const formattedSchedule = {};

  // Object.keys(schedule2).forEach((key) => {
  //   const day = key.replace(/End|Start/g, "");
  //   const start = schedule2[`${day}Start`];
  //   const end = schedule2[`${day}End`];
  //   const formattedStart = formatTime(start);
  //   const formattedEnd = formatTime(end);
  //   const scheduleString =
  //     start && end && formattedStart !== "closed"
  //       ? `${formattedStart} - ${formattedEnd}`
  //       : "Closed";
  //   formattedSchedule[day] = scheduleString;
  // });

  Object.keys(schedule2).forEach((key) => {
    const day = key.replace(/End|Start/g, "");
    const start = schedule2[`${day}Start`];
    const end = schedule2[`${day}End`];

    // Check for "24 Hours" condition
    const scheduleString =
      start === "00:00" && end === "23:59"
        ? "24 Hours"
        : start && end && start !== "closed"
        ? `${formatTime(start)} - ${formatTime(end)}`
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
    const daysOfWeek = store.daysOfWeek;
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

  function isDayClosed(start, end) {
    return !start || !end || start === "closed" || end === "closed";
  }

  function categorizeSchedule(schedule) {
    const daysOfWeek = store.daysOfWeek;
    let closedDays = 0,
      open24HoursDays = 0;

    daysOfWeek.forEach((day) => {
      const start = schedule[`${day}Start`];
      const end = schedule[`${day}End`];

      if (start === "00:00" && end === "23:59") {
        open24HoursDays += 1;
      } else if (isDayClosed(start, end)) {
        closedDays += 1;
      }
    });

    if (closedDays === 7) return "Closed Everyday";
    if (open24HoursDays === 7) return "Open 24 Hours";
    return "Varied";
  }

  function formatTime(time) {
    if (!time || time === "closed") {
      return "Closed";
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

  Object.keys(schedule2).forEach((key) => {
    const day = key.replace(/End|Start/g, "");
    const start = schedule2[`${day}Start`];
    const end = schedule2[`${day}End`];

    if (start === "00:00" && end === "23:59") {
      formattedSchedule[day] = "24 Hours"; // Directly assign "24 Hours"
    } else if (start === "closed" || !start || !end) {
      formattedSchedule[day] = "Closed"; // Directly assign "Closed" for non-operating days
    } else {
      // Use formatTime for other cases
      const formattedStart = formatTime(start);
      const formattedEnd = formatTime(end);
      formattedSchedule[day] = `${formattedStart} - ${formattedEnd}`;
    }
  });

  const scheduleCategory = categorizeSchedule(schedule2);

  return (
    <>
      {/* ADDRESS */}
      {res.address && (
        <div className="info-address">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              res.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-text"
          >
            {res.address.replace(", USA", "")}
          </a>
        </div>
      )}

      {/* DESCRIPTION */}
      {res.description && (
        <p className="modal-description">
          {isReadMore ? `${res.description.slice(0, 200)}...` : res.description}
          {res.description.length > 200 && (
            <span onClick={toggleReadMore} className="read-more">
              {isReadMore ? "(Read more)" : "(Show less)"}
            </span>
          )}
        </p>
      )}

      <div className="details-column">
        {/* WEBSITE */}
        {res.website && (
          <div className="info" style={{ flexDirection: "row" }}>
            <i
              style={{ color: "blue" }}
              className="fa-solid fa-earth-americas"
            ></i>
            <a
              href={`https://www.${res.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-text-website"
            >
              Visit Website
            </a>
          </div>
        )}

        {/*SCHEDULE*/}
        {Object.keys(formattedSchedule).length > 0 && (
          <div className="info">
            {scheduleCategory === "Closed Everyday" ? (
              <p className="schedule-row" style={{ color: "grey" }}>
                Closed Everyday
              </p>
            ) : scheduleCategory === "Open 24 Hours" ? (
              <p className="schedule-row" style={{ color: "green" }}>
                Open 24 Hours
              </p>
            ) : scheduleCategory === "Mixed Specific" ? (
              <>
                {Object.entries(formattedSchedule).map(
                  ([day, schedule], index) => (
                    <p
                      key={index}
                      className=""
                      style={{
                        color: schedule === "24 Hours" ? "green" : "grey",
                      }}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}: {schedule}
                    </p>
                  )
                )}
              </>
            ) : (
              // Handle "Varied" with specific day and time listings
              // Object.entries(formattedSchedule).map(
              //   ([day, schedule], index) => (
              //     <p
              //       key={index}
              //       className="openHours"
              //       style={{ color: schedule !== "Closed" ? "green" : "grey" }}
              //     >
              //       {day.charAt(0).toUpperCase() + day.slice(1)}: {schedule}
              //     </p>
              //   )
              // )
              Object.entries(formattedSchedule).map(
                ([day, schedule], index) => (
                  <p key={index} className="openHours">
                    <span style={{ color: "black" }}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}:
                    </span>
                    <span
                      style={{
                        color: schedule !== "Closed" ? "green" : "grey",
                      }}
                    >
                      {` ${schedule}`}
                    </span>
                  </p>
                )
              )
            )}
          </div>
        )}

        <Carousel res={res} />
      </div>
      {!isGeneratedMapModalOpen && isLoggedIn && (
        <Button
          variant="contained"
          color="primary"
          className="add-favorite"
          onClick={toggleFavorite}
        >
          {isFavorited ? (
            <>
              <span className="material-symbols-outlined">remove</span>
              <span> Remove from favorites</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">add</span>{" "}
              <span>Add to favorites</span>
            </>
          )}
        </Button>
      )}
    </>
  );
};
