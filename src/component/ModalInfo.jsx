import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import Carousel from "./Carousel";
import Button from "@mui/material/Button";
import styles from "../styles/resourceModal.css";
import Rating from "@mui/material/Rating";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

export const ModalInfo = ({
  isFavorited,
  setIsFavorited,
  averageRating,
  toggleRatingModal,
  ratingCount,
}) => {
  const { store, actions } = useContext(Context);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const res = store.selectedResource;
  const id = res.id;
  const scheduleStore = res.schedule;
  // const userIdFromSession = parseInt(sessionStorage.getItem("user_id"), 10);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(res.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const currentSchedule = scheduleStore;

  console.log("Current Schedule:", currentSchedule);
  const schedule2 = filterNonNullValues(currentSchedule);
  console.log("Filtered Schedule (schedule2):", schedule2);

  const formattedSchedule = {};

  const isEverydaySameSchedule = (formattedSchedule) => {
    const schedules = Object.values(formattedSchedule);
    return schedules.every((schedule) => schedule === schedules[0]);
  };

  Object.keys(schedule2).forEach((key) => {
    const day = key.replace(/End|Start/g, "");
    const start = schedule2[`${day}Start`];
    const end = schedule2[`${day}End`];

    const scheduleString =
      start === "00:00" && end === "23:59"
        ? "24 Hours"
        : start && end && start !== "closed"
        ? `${formatTime(start)} - ${formatTime(end)}`
        : "Closed";

    formattedSchedule[day] = scheduleString;
  });
  console.log("Formatted Schedule:", formattedSchedule);
  const everydaySameSchedule = isEverydaySameSchedule(formattedSchedule);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem("token") || store.token;
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, [store.token, store.modalIsOpen]);

  function filterNonNullValues(schedule) {
    const result = {};
    const daysOfWeek = store.daysOfWeek;

    daysOfWeek.forEach((day) => {
      if (!schedule || !schedule[day]) return;
      const start = schedule[day].start;
      const end = schedule[day].end;

      if (start && start !== "" && end && end !== "") {
        result[`${day}Start`] = start;
        result[`${day}End`] = end;
      } else {
        result[`${day}Start`] = "closed";
        result[`${day}End`] = "closed";
      }
      console.log(
        `Day: ${day}, Start: ${result[`${day}Start`]}, End: ${
          result[`${day}End`]
        }`
      );
    });

    console.log("Filtered Schedule Result:", result);
    return result;
  }

  Object.keys(schedule2).forEach((key) => {
    const day = key.replace(/End|Start/g, "");
    const start = schedule2[`${day}Start`];
    const end = schedule2[`${day}End`];

    if (start === "00:00" && end === "23:59") {
      formattedSchedule[day] = "24 Hours";
    } else if (start === "closed" || !start || !end) {
      formattedSchedule[day] = "Closed";
    } else {
      formattedSchedule[day] = `${formatTime(start)} - ${formatTime(end)}`;
    }
  });

  const scheduleCategory = categorizeSchedule(schedule2);

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
      numericHour = 12;
    }
    return `${numericHour}:${minute} ${suffix}`;
  }

  Object.keys(schedule2).forEach((key) => {
    const day = key.replace(/End|Start/g, "");
    const start = schedule2[`${day}Start`];
    const end = schedule2[`${day}End`];

    if (start === "00:00" && end === "23:59") {
      formattedSchedule[day] = "24 Hours";
    } else if (start === "closed" || !start || !end) {
      formattedSchedule[day] = "Closed";
    } else {
      const formattedStart = formatTime(start);
      const formattedEnd = formatTime(end);
      formattedSchedule[day] = `${formattedStart} - ${formattedEnd}`;
    }
  });

  // const scheduleCategory = categorizeSchedule(schedule2);
  console.log("Schedule Category:", scheduleCategory);
  return (
    <>
      <Carousel res={res} />

      <div className="info-groups">
        {/* Name */}
        <div className="info-address">
          <span className="modal-info-title">Name</span>
          <span>{res.name}</span>
        </div>
        {/* ADDRESS */}
        <div className="info-address">
          <span className="modal-info-title">Address</span>
          <div>
            <span
              style={{ marginLeft: "10px", cursor: "pointer" }}
              onClick={handleCopy}
              title="Copy Address"
              className="modal-info-value"
            >
              {res.address.replace(", USA", "")} {"  "}
            </span>
            <span
              style={{ cursor: "pointer" }}
              onClick={handleCopy}
              className="material-symbols-outlined"
            >
              content_copy
            </span>
            {copied && <span style={{ marginLeft: "10px" }}>Copied!</span>}
          </div>
        </div>
        {/* Rating */}
        <div
          className="info-address"
          style={{ cursor: "pointer" }}
          onClick={() => {
            toggleRatingModal();
          }}
        >
          <span className="modal-info-title">Rating</span>
          <div className="rating-div">
            <Rating
              style={{
                flexDirection: "row",
                fontSize: "20px",
              }}
              name="read-only"
              value={averageRating}
              precision={0.5}
              readOnly
            />
            <span>({ratingCount})</span>
          </div>
        </div>

        {/* DESCRIPTION */}
        {res.description && (
          <>
            <div className="info-address">
              <span className="modal-info-title" style={{ alignSelf: "start" }}>
                About
              </span>
              <span className="modal-text" style={{ marginLeft: "20px" }}>
                {isReadMore
                  ? `${res.description.slice(0, 200)}...`
                  : res.description}
                {res.description.length > 200 && (
                  <span onClick={toggleReadMore} className="read-more">
                    {"  "}
                    {isReadMore ? "(Show more)" : "(Show less)"}
                  </span>
                )}
              </span>
            </div>
          </>
        )}
        {res.address && (
          <>
            <span
              className="info-address"
              title="Open Google Maps"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    res.address
                  )}`,
                  "_blank"
                )
              }
            >
              <span className="modal-info-title">Directions</span>
              <span
                className="material-icons"
                style={{
                  fontSize: "25px",
                  cursor: "pointer",
                }}
              >
                turn_sharp_right
              </span>
            </span>
          </>
        )}

        {/* WEBSITE */}
        {res.website && (
          <div className="info-address">
            <span
              className="modal-info-title"
              title="Open Website"
              style={{ cursor: "pointer" }}
              onClick={() =>
                window.open(
                  `https://www.${res.website}`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Website
            </span>
            {/* <span>{res.website}</span> */}

            <span
              style={{
                fontSize: "25px",
                cursor: "pointer",
              }}
              className="material-icons"
            >
              link
            </span>
          </div>
        )}

        {scheduleCategory === "Closed Everyday" && (
          <>
            <span className="info-address">
              <span className="modal-info-title">Schedule</span>
              Closed Everyday
            </span>
          </>
        )}
        {scheduleCategory === "Open 24 Hours" && (
          <>
            <span className="modal-info-title">Hours</span>
            <span className="info-address">Open 24/7</span>
          </>
        )}

        {Object.keys(formattedSchedule).length > 0 &&
          scheduleCategory === "Varied" && (
            <>
              <div className="info-address">
                <span style={{ alignSelf: "self-start" }}>Hours</span>
                <div className="schedule-info">
                  <div className="schedule-table">
                    <div
                      className="schedule-column"
                      style={{ paddingRight: "10px" }}
                    >
                      {Object.keys(formattedSchedule).map((day, index) => (
                        <div key={index} className="schedule-day">
                          {day.charAt(0).toUpperCase() + day.slice(1)}:
                        </div>
                      ))}
                    </div>
                    <div className="schedule-column">
                      {Object.values(formattedSchedule).map(
                        (schedule, index) => (
                          <div key={index} className="schedule-time">
                            {schedule}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        {isLoggedIn && (
          <div className="info-address" onClick={toggleFavorite}>
            {isFavorited ? (
              <>
                <span
                  className="modal-info-title"
                  style={{ marginRight: "7px" }}
                >
                  {" "}
                  You follow this Resource
                </span>
                <BookmarkIcon style={{ color: "green", cursor: "pointer" }} />
              </>
            ) : (
              <>
                <span text="add to favorites" style={{ marginRight: "7px" }}>
                  You do not follow this resource
                </span>{" "}
                {"  "}
                <BookmarkBorderIcon style={{ cursor: "pointer" }} />
              </>
            )}
          </div>
        )}
        {/* // Alert */}
        <div className="info-address">
          <span className="modal-info-title">Alert</span>
          {res.alert ? (
            <>
              <span className="modal-info-title" style={{ marginRight: "7px" }}>
                {res.alert}
              </span>
            </>
          ) : (
            <>
              <span text="add to favorites">No Alerts</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};
