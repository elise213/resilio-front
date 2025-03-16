import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import Carousel from "./Carousel";
import styles from "../styles/resourceModal.css";
import Rating from "@mui/material/Rating";
import ScheduleInfo from "./ScheduleInfo";

export const ModalInfo = ({
  isFavorited,
  setIsFavorited,
  averageRating,
  toggleRatingModal,
  ratingCount,
}) => {
  const { store, actions } = useContext(Context);
  const [isReadMore, setIsReadMore] = useState(true);
  const isLoggedIn = !!store.token;

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const res = store.selectedResource;
  const id = res.id;
  const scheduleStore = res.schedule;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(res.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentSchedule = scheduleStore;

  const schedule2 = filterNonNullValues(currentSchedule);

  const formattedSchedule = {};

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
      // console.log(
      //   `Day: ${day}, Start: ${result[`${day}Start`]}, End: ${
      //     result[`${day}End`]
      //   }`
      // );
    });
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

  return (
    <>
      <Carousel res={res} />

      <div className="info-groups">
        {/* Name */}
        <div className="info-address">
          <span className="modal-info-title">Name</span>
          <span>{res.name}</span>
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
            {ratingCount > 0 && <span>{ratingCount}</span>}
          </div>
        </div>

        {/* ADDRESS */}
        <div className="info-address">
          <span className="modal-info-title">Address</span>
          <div style={{ display: "flex" }}>
            <span
              style={{ marginLeft: "10px", cursor: "pointer" }}
              onClick={handleCopy}
              title="Copy Address"
              className="modal-info-value"
            >
              {/* {res.address.replace(", USA", "")} {"  "} */}
              {res?.address
                ? res.address.replace(", USA", "")
                : "Address unavailable"}
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

        {/* WEBSITE */}
        {res.website && (
          <div className="info-address">
            <span
              className="modal-info-title"
              title="Open Website"
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
            <span
              style={{
                color: "gray",
                fontSize: "18px",
                cursor: "pointer",
                fontWeight: "100",
              }}
              className="material-icons link-icon"
            >
              link
            </span>
          </div>
        )}

        {/* HOURS */}

        {scheduleCategory === "Closed Everyday" && (
          <>
            <span className="info-address">
              <span className="modal-info-title">Hours</span>
              Closed Everyday
            </span>
          </>
        )}
        {scheduleCategory === "Open 24 Hours" && (
          <>
            <span className="info-address">
              <span className="modal-info-title">Hours</span>
              Open 24/7
            </span>
          </>
        )}

        {Object.keys(formattedSchedule).length > 0 &&
          scheduleCategory === "Varied" && (
            <>
              <div className="info-address">
                <span className="modal-info-title">Hours</span>
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
        {res.updated && (
          <div className="info-address" style={{ borderBottom: "none" }}>
            {/* LAST UPDATED DATE */}
            <div className="info-address" style={{ borderBottom: "none" }}>
              <span className="modal-info-title">Updated</span>
              <span>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour12: true,
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                }).format(new Date(res.updated + "Z"))}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
