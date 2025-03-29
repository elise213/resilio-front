import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import Carousel from "./Carousel";
import styles from "../styles/resourceModal.css";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteButton from "./FavoriteButton";
import LikeComment from "./likeComment";
import { Menu, MenuItem, IconButton, Tooltip, Icon } from "@mui/material";

export const ModalInfo = ({
  averageRating,
  toggleRatingModal,
  ratingCount,
  toggleFavorite,
  isLoggedIn,
  comments,
  setComments,
  userIdFromSession,
}) => {
  const { store, actions } = useContext(Context);
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const res = store.selectedResource;
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

  const handleDelete = async (commentId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this comment? This action cannot be undone."
    );
    if (confirm) {
      await actions.deleteComment(commentId);
    }
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
              {res?.address
                ? res.address.replace(", USA", "")
                : "Address unavailable"}
            </span>
            <span
              style={{
                cursor: "pointer",
                marginLeft: "10px",
                alignSelf: "center",
              }}
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
                fontSize: "16px",
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
        {/* {res.description && (
          <div className="info-address">
            <span className="modal-info-title" style={{ alignSelf: "start" }}>
              About
            </span>
            <span className="modal-info-value" style={{ marginLeft: "0px" }}>
              {res.description}
            </span>
          </div>
        )} */}

        {res.description && (
          <>
            <div className="info-address">
              <span className="modal-info-title" style={{ alignSelf: "start" }}>
                About
              </span>
              <span>
                <span className="modal-info-value">
                  {isReadMore
                    ? `${res.description.slice(0, 200)}...`
                    : res.description}
                </span>
                {res.description.length > 200 && (
                  <span onClick={toggleReadMore} className="read-more">
                    {"  "}
                    {isReadMore ? "Show more" : "Show less"}
                  </span>
                )}
              </span>
            </div>
          </>
        )}

        {/* LAST UPDATED DATE */}
        {res.updated && (
          <div className="info-address">
            <span className="modal-info-title">Last updated</span>
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
        )}

        {/* LAST UPDATED DATE */}
        {isLoggedIn && (
          <div className="info-address">
            <span className="modal-info-title">Following</span>
            <FavoriteButton type={"modal-favorite"} resource={res} />
          </div>
        )}
      </div>

      {/* Rating */}
      <div
        className="info-address"
        style={{ cursor: "pointer" }}
        onClick={() => {
          toggleRatingModal();
        }}
      >
        <span className="modal-info-title">Average Review</span>
        <Tooltip title="Rate this resource" arrow>
          <div className="rating-div-modal">
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
            {ratingCount > 0 && (
              <span style={{ fontSize: "14px" }}>({ratingCount})</span>
            )}
          </div>
        </Tooltip>
      </div>

      {comments.length > 0 && (
        <div className="info-address" style={{ borderBottom: "none" }}>
          <span className="modal-info-title">User Reviews</span>
          <div className="comments-display">
            {/* <span className="user-reviews">User Reviews</span> */}
            {comments.map((comment) => {
              const date = new Date(comment.created_at);
              const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              });
              let isLiked = comment.likes?.some(
                (like) => like.user_id === userIdFromSession
              );
              return (
                <div key={comment.comment_id} className="comment-div">
                  <div className="comment-info">
                    {parseInt(comment.user_id) === userIdFromSession ? (
                      <Tooltip title="Delete this comment" arrow>
                        <DeleteIcon
                          fontSize="small"
                          onClick={() => handleDelete(comment.comment_id)}
                          style={{
                            cursor: "pointer",
                            color: "gray",
                            alignSelf: "flex-start",
                          }}
                        />
                      </Tooltip>
                    ) : (
                      ""
                    )}
                    <p className="comment-content">{comment.comment_cont}</p>
                    <Tooltip title="click to rate this resource" arrow>
                      <Rating
                        name="read-only"
                        value={comment.rating_value}
                        precision={0.5}
                        readOnly
                        style={{
                          flexDirection: "row",
                          fontSize: "18px",
                        }}
                      />
                    </Tooltip>
                    <div
                      className="comment-content-div"
                      style={{ marginTop: "15px" }}
                    >
                      <div className="comment-user-info">
                        <div className="name-and-icon">
                          <span className="name-comment">
                            {comment.user_name} {"   "}
                          </span>
                          <span className="date-comment">{formattedDate}</span>
                        </div>
                      </div>

                      <LikeComment
                        comment={comment}
                        userIdFromSession={userIdFromSession}
                        isLoggedIn={isLoggedIn}
                        setComments={setComments}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
