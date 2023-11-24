import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { ModalInfo } from "./ModalInfo";
import styles from "../styles/resourceModal.css";
import Swal from "sweetalert2";
import Rating from "@mui/material/Rating";

const Modal = ({
  resource,
  modalIsOpen,
  closeModal,
  setModalIsOpen,
  isLoggedIn,

  removeSelectedResource,
  selectedResources,
  addSelectedResource,
  item,
  setFavorites,
}) => {
  const { store, actions } = useContext(Context);

  const [ratingResponse, setRatingResponse] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [hover, setHover] = useState(-1);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleSelectResource = (resource) => {
    addSelectedResource(resource);
  };

  const handleDeselectResource = (resourceId) => {
    removeSelectedResource(resourceId);
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(
      sessionStorage.getItem("favorites") || "[]"
    );
    const isItemFavorited = storedFavorites.some(
      (favorite) => favorite.name === item.name
    );
    setIsFavorited(isItemFavorited);
  }, []);

  const toggleFavorite = (event) => {
    event.stopPropagation();
    setIsFavorited(!isFavorited);

    if (isFavorited) {
      actions.removeFavorite(item.name, setFavorites);
    } else {
      actions.addFavorite(item.name, setFavorites);
    }
  };

  const isSelected =
    Array.isArray(selectedResources) &&
    selectedResources.some((resource) => resource.id === item.id);

  const handleToggleSelectResource = (event) => {
    event.stopPropagation();
    console.log("hnadleToggleSelectR");
    if (isSelected) {
      handleDeselectResource(item.id);
    } else {
      handleSelectResource(item);
    }
  };

  useEffect(() => {
    actions.getAverageRating(resource.id, setAverageRating);
    actions.getComments(resource.id, setComments);
  }, [resource.id, actions]);

  const handleCommentSubmit = () => {
    if (comment.length > 280) {
      Swal.fire({
        icon: "error",
        title: "Comment Too Long",
        text: "Your comment must be less than 280 characters.",
      });
      return;
    }

    actions.createComment(resource.id, comment, (response) => {
      if (response && response.status === "true") {
        Swal.fire({
          icon: "success",
          title: "Comment Submitted",
          text: "Your comment has been successfully submitted.",
        });
        setComment("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Submit Comment",
          text:
            response.message || "There was an issue submitting your comment.",
        });
      }
    });
  };

  // REFS
  const modalContentRef = useRef(null);
  const ratingModalRef = useRef(null);

  const toggleRatingModal = () => {
    setShowRating(!showRating);
  };

  const labels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Exceptional",
  };

  const handleRatingSubmit = () => {
    console.log("handle rating submit!");
    let resourceId = resource.id;
    actions.createRating(resourceId, rating, (response) => {
      setRatingResponse(response);
      if (response && response.status === "true") {
        Swal.fire({
          title: "Success!",
          text: "Your rating has been submitted.",
          icon: "success",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text:
            response.message || "There was an issue submitting your rating.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the rating modal is open and the click is outside the rating modal
      if (
        showRating &&
        ratingModalRef.current &&
        !ratingModalRef.current.contains(event.target)
      ) {
        console.log("Clicked outside the rating modal!");
        setShowRating(false);
      }
    };

    // Attaching the event listener to the document
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showRating]); // Dependency array includes showRating to update the listener when it changes

  const resourceId = resource.id;
  const tokenExists = sessionStorage.getItem("token");
  let categories = actions.processCategory(resource.category);

  return (
    <>
      <div className="modal-content" ref={modalContentRef}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-close-div">
            <p className="close-modal" onClick={() => setModalIsOpen(false)}>
              <i className="fa-solid fa-x"></i>
            </p>
          </div>
          {isLoggedIn && (
            <div className="modal-button-container">
              <button
                className="add-favorite"
                onClick={(event) => toggleFavorite(event)}
              >
                {isFavorited ? (
                  <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
                ) : (
                  <i className="fa-regular fa-heart"></i>
                )}
              </button>
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
            </div>
          )}
          <div className="modal-title-div">
            <div className="icon-box">
              {categories.map((category, index) => {
                const colorStyle = actions.getColorForCategory(category);
                return (
                  <i
                    key={index}
                    className={`${actions.getIconForCategory(
                      category
                    )} card-icon`}
                    style={colorStyle ? colorStyle : {}}
                  />
                );
              })}
            </div>
            <div className="title-box">
              <span>{resource.name}</span>
            </div>
            <div className="resource-rating">
              {/* <p>Average Rating:</p> */}
              <Rating
                name="read-only"
                value={averageRating}
                precision={0.5}
                readOnly
              />
            </div>
          </div>
          {isLoggedIn && (
            <div className="rate-this-resource-toggle">
              <button onClick={() => setShowRating(true)} className="submit">
                Rate this resource
              </button>
            </div>
          )}
        </div>

        <div className="modal-body">
          <ModalInfo
            id={resource.id}
            schedule={resource.schedule}
            res={resource}
          />
          <div className="full-comments-section">
            {comments.length > 0 && (
              <div className="comments-display">
                <div className="comment-heading">
                  <p>User Reviews</p>
                </div>
                {comments.map((comment, index) => {
                  // Parsing the date string
                  const date = new Date(comment.created_at);

                  // Formatting the date
                  const formattedDate =
                    date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }) +
                    " at " +
                    date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });

                  return (
                    <>
                      <div key={index} className="comment-div">
                        <div className="comment-content-div">
                          <p className="comment-content">
                            "{comment.comment_cont}"
                          </p>
                        </div>
                        <div className="comment-info">
                          <div className="comment-user-info">
                            <p className="comment-info-username">
                              <i class="fa-solid fa-user"></i> {comment.user_id}{" "}
                            </p>
                          </div>
                          <div className="comment-info-date">
                            <p className="comment-info-content">
                              {formattedDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            )}

            {isLoggedIn && (
              <div className="comment-section">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder=" Add a review..."
                  maxLength="280"
                ></textarea>
                <button className="submit" onClick={handleCommentSubmit}>
                  Submit Review
                </button>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <p className="problem">
              Is there a problem with this information? {""}
              <Link to="/Contact">Let us know</Link>
            </p>
            <p className="create">
              Click {""}
              <Link to="/create">here</Link>
              {""} to create a new resource listing.
            </p>

            {tokenExists && (
              <p className="edit-text">
                Click {""}
                <Link to={`/edit/${resourceId}`}>here</Link>
                {""} to edit this resource
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <>
          <div className="rate-this-resource" ref={ratingModalRef}>
            <div className="modal-close-div">
              <p className="close-rating" onClick={() => setShowRating(false)}>
                <i className="fa-solid fa-x"></i>
              </p>
            </div>
            <p className="what-do-you-think">
              What do You Think of <br />
              {resource.name} ?
            </p>
            <div className="rating-container">
              <div className="rating-label">
                {rating !== null && labels[hover !== -1 ? hover : rating]}
              </div>
              <Rating
                name="resource-rating"
                value={rating}
                precision={1}
                onChange={(event, newRating) => setRating(newRating)}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
              />
              <button onClick={handleRatingSubmit} className="submit">
                Submit
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
