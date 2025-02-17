import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import Carousel from "./Carousel";
import Button from "@mui/material/Button";
import styles from "../styles/resourceModal.css";
import Rating from "@mui/material/Rating";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import GoogleMapReact from "google-map-react"; // Import GoogleMapReact
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Hollow plus sign
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Solid plus sign

export const ModalInfo = ({
  isFavorited,
  setIsFavorited,
  averageRating,
  toggleRatingModal,
  ratingCount,
  comments,
  setComments,
}) => {
  const { store, actions } = useContext(Context);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isReadMore, setIsReadMore] = useState(true);
  // const [comments, setComments] = useState([]);
  const apiKey = import.meta.env.VITE_GOOGLE;
  const resource = store.selectedResource;
  const mapCenter = {
    lat: resource?.latitude || 0, // Default to 0 if no latitude
    lng: resource?.longitude || 0, // Default to 0 if no longitude
  };

  const handleDelete = async (commentId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this comment? This action cannot be undone."
    );

    if (confirm) {
      const result = await actions.deleteComment(commentId);
      if (result.success) {
        // Update the UI to reflect the deleted comment
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.comment_id !== commentId)
        );
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Comment deleted successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Failed to delete the comment.",
        });
      }
    }
  };

  const mapZoom = 13;
  const toggleLikeComment = async (commentId) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Not Logged In",
        text: "Please log in to like a comment.",
        confirmButtonText: "Log In",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          actions.closeModal();
          actions.openLoginModal();
        }
      });
      return;
    }

    const current_back_url = store.current_back_url;
    const comment = comments.find((c) => c.comment_id === commentId);

    if (!comment) {
      console.error("Comment not found.");
      return;
    }

    const isLiked = comment.likes?.some(
      (like) => like.user_id === userIdFromSession
    );

    try {
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.comment_id === commentId ? { ...c, isLoading: true } : c
        )
      );

      const response = await fetch(
        `${current_back_url}/api/likeComment/${commentId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.comment_id === commentId
              ? {
                  ...c,
                  like_count:
                    data.action === "like"
                      ? c.like_count + 1
                      : c.like_count - 1,
                  likes:
                    data.action === "like"
                      ? [...(c.likes || []), { user_id: userIdFromSession }]
                      : c.likes.filter(
                          (like) => like.user_id !== userIdFromSession
                        ),
                }
              : c
          )
        );
      } else {
        console.error("Failed to toggle like:", data.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to process your request.",
        });
      }
    } catch (error) {
      console.error("Error toggling like on comment:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to process your request at this time.",
      });
    } finally {
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.comment_id === commentId ? { ...c, isLoading: false } : c
        )
      );
    }
  };

  const Marker = React.memo(({ result }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Function to open Google Maps directions
    const openGoogleMaps = () => {
      if (result) {
        const { latitude, longitude } = result;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.open(url, "_blank");
      }
    };

    return (
      <div
        className="marker"
        onClick={openGoogleMaps}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "absolute",
          transform: "translate(-50%, -100%)", // Ensures correct marker positioning
          cursor: "pointer",
        }}
      >
        <div className="marker-icon">
          <i
            className="fa-solid fa-map-pin"
            style={{
              color: "red",
              fontSize: "24px",
            }}
          ></i>
        </div>
        {isHovered && result && (
          <div className="marker-address">
            {result.address || "Address not available"}
          </div>
        )}
      </div>
    );
  });

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const res = store.selectedResource;
  const id = res.id;
  const scheduleStore = res.schedule;
  const userIdFromSession = parseInt(sessionStorage.getItem("user_id"), 10);
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

    // Check for "24 Hours" condition
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

      // Treat empty strings or null values as "closed"
      if (start && start !== "" && end && end !== "") {
        result[`${day}Start`] = start;
        result[`${day}End`] = end;
      } else {
        result[`${day}Start`] = "closed";
        result[`${day}End`] = "closed";
      }

      // Log each day's start and end after processing
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

    // Check for "24 Hours" condition
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
    let suffix = numericHour >= 12 ? "pm" : "am";
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
          <span className="modal-info-key">NAME</span>
          <span className="modal-info-value">{res.name}</span>
        </div>
        {/* ADDRESS */}

        <div className="info-address">
          <span className="modal-info-key">ADDRESS</span>
          <div>
            <span
              style={{ marginLeft: "10px", cursor: "pointer" }}
              onClick={handleCopy}
              title="Copy Address"
              className="modal-info-value"
            >
              {res.address
                ? res.address.replace(", USA", "")
                : "Address not available"}{" "}
              {"  "}
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
              <span className="modal-info-key">DIRECTIONS</span>
              <span
                className="material-icons"
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                turn_sharp_right
              </span>
            </span>
          </>
        )}
        {/* Rating */}
        <div
          className="info-address"
          style={{ cursor: "pointer" }}
          onClick={() => {
            toggleRatingModal();
          }}
        >
          <span className="modal-info-key">RATING</span>
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
            <span className="modal-info-value">({ratingCount})</span>
          </div>
        </div>
        {isLoggedIn && (
          <div className="info-address" onClick={toggleFavorite}>
            {isFavorited ? (
              <>
                <span className="modal-info-key" style={{ marginRight: "7px" }}>
                  {" "}
                  FOLLOWING
                </span>
                <BookmarkIcon style={{ color: "green", cursor: "pointer" }} />
              </>
            ) : (
              <>
                <span text="add to favorites" style={{ marginRight: "7px" }}>
                  NOT FOLLOWING
                </span>{" "}
                {"  "}
                <BookmarkBorderIcon
                  style={{ cursor: "pointer", fontSize: "20px" }}
                />
              </>
            )}
          </div>
        )}
        {/* DESCRIPTION */}
        {res.description && (
          <>
            <div className="info-address">
              <span className="modal-info-key" style={{ alignSelf: "start" }}>
                ABOUT
              </span>
              <span className="modal-info-value" style={{ maxWidth: "300px" }}>
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

        {/* WEBSITE */}
        {res.website && (
          <div className="info-address">
            <span
              className="modal-info-key"
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
              WEBSITE
            </span>
            <span
              style={{
                fontSize: "20px",
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
            <span className="info-address" style={{ color: "black" }}>
              <span className="modal-info-key">Schedule</span>
              <span className="modal-info-value">Closed Everyday</span>
            </span>
          </>
        )}
        {scheduleCategory === "Open 24 Hours" && (
          <span className="info-address" style={{ color: "black" }}>
            <span className="modal-info-key">Hours</span>
            Open 24/7
          </span>
        )}

        {Object.keys(formattedSchedule).length > 0 &&
          scheduleCategory === "Varied" && (
            <>
              <div className="info-address">
                <span style={{ alignSelf: "self-start" }}>HOURS</span>
                <div className="schedule-info">
                  <div className="schedule-table">
                    <div
                      className="schedule-column"
                      style={{ paddingRight: "10px" }}
                    >
                      {Object.keys(formattedSchedule).map((day, index) => (
                        <div
                          key={index}
                          className="schedule-day modal-info-value"
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1)}:
                        </div>
                      ))}
                    </div>
                    <div className="schedule-column">
                      {Object.values(formattedSchedule).map(
                        (schedule, index) => (
                          <div
                            key={index}
                            className="schedule-time modal-info-value"
                          >
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

        {/* // Alert */}
        <div className="info-address">
          <span className="modal-info-key">ALERT</span>
          {res.alert ? (
            <>
              <span className="modal-info-key" style={{ marginRight: "7px" }}>
                {res.alert}
              </span>
            </>
          ) : (
            <>
              <span text="add to favorites" className="modal-info-value">
                No Alerts
              </span>
            </>
          )}
        </div>
        <div
          className="info-address"
          style={{
            padding: "0px",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span className="modal-info-key" style={{ padding: "6px 0" }}>
            MAP
          </span>
          <div
            className="map-container-modal"
            style={{ height: "300px", width: "100%", justifySelf: "center" }}
          >
            <GoogleMapReact
              bootstrapURLKeys={{ key: apiKey }}
              defaultCenter={mapCenter}
              defaultZoom={mapZoom}
            >
              {/* Add a Marker for the resource */}
              <Marker
                lat={resource.latitude}
                lng={resource.longitude}
                text={resource.name}
                id={resource.id}
                result={resource}
              />
            </GoogleMapReact>
          </div>
        </div>
        {comments.length > 0 && (
          <>
            <div className="info-address" style={{ borderBottom: "none" }}>
              <span className="user-reviews">USER REVIEWS</span>
            </div>
            <div className="comment-container">
              {comments
                .slice() // Create a shallow copy to avoid mutating the original array
                .sort((a, b) => b.like_count - a.like_count) // Sort by likes, descending order
                .map((comment) => {
                  const date = new Date(comment.created_at);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  let isLiked = comment.likes?.some(
                    (like) => like.user_id === userIdFromSession
                  );

                  return (
                    <div key={comment.comment_id} className="comment-div">
                      <div className="comment-info">
                        <div className="comment-label">
                          <div
                            style={{
                              display: "flex",
                              alignSelf: "flex-end",
                              fontWeight: "100",
                              fontSize: "12px",
                            }}
                          >
                            <div className="like-icon">
                              {comment.isLoading ? (
                                <span>Loading...</span>
                              ) : comment.likes?.some(
                                  (like) => like.user_id === userIdFromSession
                                ) ? (
                                <AddCircleIcon
                                  style={{ color: "green", marginRight: "5px" }}
                                  fontSize="small"
                                  onClick={() =>
                                    toggleLikeComment(comment.comment_id)
                                  }
                                  titleAccess="Unlike this comment"
                                />
                              ) : (
                                <AddCircleOutlineIcon
                                  style={{ marginRight: "5px" }}
                                  fontSize="small"
                                  onClick={() =>
                                    toggleLikeComment(comment.comment_id)
                                  }
                                  titleAccess="Like this comment"
                                />
                              )}
                            </div>
                            {comment.like_count}
                          </div>
                          <Rating
                            name="read-only"
                            value={comment.rating_value}
                            precision={0.5}
                            readOnly
                          />
                          <p className="comment-content">
                            {comment.comment_cont}
                          </p>
                        </div>
                        <div className="comment-content-div">
                          <div className="comment-user-info">
                            <div className="user-info">
                              <span className="material-symbols-outlined account-circle">
                                account_circle
                              </span>
                              {comment.user_name} {"   "}
                            </div>
                            {formattedDate}
                          </div>
                          {parseInt(comment.user_id) === userIdFromSession && (
                            <button
                              onClick={() => handleDelete(comment.comment_id)}
                              className="delete-button"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </>
  );
};
